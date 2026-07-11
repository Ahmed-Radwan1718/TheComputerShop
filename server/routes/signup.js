const dns = require("dns").promises;
const admin = require("../_lib/firebaseAdmin");
const { Resend } = require("resend");
const disposableEmailDomains = require("disposable-email-domains-js");

const {
  createSiteSessionForUid,
  createSiteSessionFromIdToken,
  getCodeHash,
  createRandomCode,
  createRandomToken
} = require("../_lib/securityHelpers");

const resend = new Resend(process.env.RESEND_API_KEY);

const WINDOW_MS = 30 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const SIGNUP_CODE_TTL_MS = 10 * 60 * 1000;
const SIGNUP_CODE_RESEND_MS = 60 * 1000;
const SIGNUP_CODE_MAX_ATTEMPTS = 5;

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanEmail(value) {
  return cleanString(value, 160).toLowerCase();
}

function cleanPassword(value) {
  return String(value || "");
}

const DISPOSABLE_EMAIL_DOMAIN_OVERRIDES = new Set([
  "temp-mail.org",
  "temp-mail.io",
  "tempmail.org",
  "tempmail.io",
  "tempmail.net",
  "tempmail.plus",
  "10minutemail.com",
  "10minemail.com",
  "10minutemail.net",
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "grr.la",
  "sharklasers.com",
  "yopmail.com",
  "mail.tm",
  "mail.gw",
  "1secmail.com",
  "1secmail.net",
  "1secmail.org",
  "dispostable.com",
  "maildrop.cc",
  "getnada.com",
  "inboxkitten.com",
  "emailondeck.com",
  "trashmail.com",
  "mohmal.com",
  "moakt.com",
  "generator.email",
  "dropmail.me",
  "minuteinbox.com",
  "mailnesia.com",
  "spamgourmet.com",
  "anonbox.net",
  "burnermail.io",
  "mailpoof.com",
  "throwawaymail.com"
]);

const DISPOSABLE_EMAIL_PROVIDER_MARKERS = [
  "temp-mail",
  "tempmail",
  "10minutemail",
  "10minmail",
  "mailinator",
  "guerrillamail",
  "sharklasers",
  "yopmail",
  "1secmail",
  "maildrop",
  "getnada",
  "inboxkitten",
  "emailondeck",
  "trashmail",
  "mohmal",
  "moakt",
  "generator.email",
  "dropmail",
  "minuteinbox",
  "mailnesia",
  "spamgourmet",
  "anonbox",
  "burnermail",
  "mailpoof",
  "throwawaymail"
];

function getEmailDomain(email) {
  return cleanString(String(email || "").split("@").pop(), 160).toLowerCase();
}

function hasDisposableDomainOverride(domain) {
  if (!domain) return false;

  const parts = domain.split(".");

  for (let index = 0; index < parts.length - 1; index += 1) {
    const candidate = parts.slice(index).join(".");

    if (DISPOSABLE_EMAIL_DOMAIN_OVERRIDES.has(candidate)) {
      return true;
    }
  }

  return DISPOSABLE_EMAIL_PROVIDER_MARKERS.some(function (marker) {
    return domain.includes(marker);
  });
}

function isKnownDisposableEmail(email) {
  const domain = getEmailDomain(email);

  if (!domain) return false;
  if (hasDisposableDomainOverride(domain)) return true;

  try {
    if (typeof disposableEmailDomains.isDisposableEmail === "function" && disposableEmailDomains.isDisposableEmail(email)) {
      return true;
    }

    if (typeof disposableEmailDomains.isDisposableEmailDomain === "function" && disposableEmailDomains.isDisposableEmailDomain(domain)) {
      return true;
    }
  } catch (error) {}

  return false;
}

async function hasDisposableDnsProvider(email) {
  const domain = getEmailDomain(email);

  if (!domain) return false;

  const results = await Promise.allSettled([
    dns.resolveMx(domain),
    dns.resolveTxt(domain)
  ]);

  const dnsText = results.map(function (result) {
    if (result.status !== "fulfilled") return "";

    return JSON.stringify(result.value || []).toLowerCase();
  }).join(" ");

  return DISPOSABLE_EMAIL_PROVIDER_MARKERS.some(function (marker) {
    return dnsText.includes(marker);
  });
}

async function isBlockedEmail(email) {
  return isKnownDisposableEmail(email) || await hasDisposableDnsProvider(email);
}

function timestampToMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

async function createCompatibleSiteSession(req, res, uid) {
  if (createSiteSessionForUid.length >= 3) {
    return await createSiteSessionForUid(req, res, uid);
  }

  return await createSiteSessionForUid(uid, res);
}

async function createCompatibleIdTokenSession(req, res, idToken) {
  if (createSiteSessionFromIdToken.length >= 3) {
    return await createSiteSessionFromIdToken(req, res, idToken);
  }

  return await createSiteSessionFromIdToken(idToken, res);
}

async function checkSignupRateLimit(email) {
  const safeId = email.replace(/[^\w.-]/g, "_");
  const ref = admin.firestore().collection("signupAttempts").doc(safeId);
  const doc = await ref.get();
  const data = doc.exists ? doc.data() || {} : {};
  const windowStartedAtMs = timestampToMillis(data.windowStartedAt);
  const oldWindow = !windowStartedAtMs || Date.now() - windowStartedAtMs >= WINDOW_MS;

  if (!oldWindow && Number(data.count || 0) >= MAX_ATTEMPTS) {
    const error = new Error("Too many signup attempts. Please try again later.");
    error.statusCode = 429;
    throw error;
  }

  await ref.set({
    count: oldWindow ? 1 : Number(data.count || 0) + 1,
    windowStartedAt: oldWindow ? admin.firestore.FieldValue.serverTimestamp() : data.windowStartedAt,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

function getSignupCodeRef(email) {
  const safeId = email.replace(/[^\w.-]/g, "_");
  return admin.firestore().collection("pendingSignupEmailCodes").doc(safeId);
}

async function ensureEmailCanCreateAccount(email) {
  try {
    await admin.auth().getUserByEmail(email);

    const error = new Error("This email is already used by another account.");
    error.statusCode = 409;
    throw error;
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return;
    }

    throw error;
  }
}

async function sendSignupVerificationCode(email, fullName) {
  const ref = getSignupCodeRef(email);
  const existingDoc = await ref.get();
  const existingData = existingDoc.exists ? existingDoc.data() || {} : {};
  const lastSentAtMs = timestampToMillis(existingData.lastSentAt);

  if (lastSentAtMs && Date.now() - lastSentAtMs < SIGNUP_CODE_RESEND_MS) {
    const error = new Error("Please wait a minute before requesting another verification code.");
    error.statusCode = 429;
    throw error;
  }

  const code = createRandomCode();
  const salt = createRandomToken();
  const expiresAtMs = Date.now() + SIGNUP_CODE_TTL_MS;

  await ref.set({
    email,
    codeHash: getCodeHash(email, code, salt),
    salt,
    attempts: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastSentAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: new Date(expiresAtMs)
  }, { merge: false });

  await resend.emails.send({
    from: process.env.SECURITY_EMAIL_FROM,
    to: email,
    subject: "Verify your Computer Shop email",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Verify your email address</h2>
        <p>Hi ${fullName || "there"}, enter this code to finish creating your The Computer Shop account.</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px;">${code}</p>
        <p>This code expires in 10 minutes. Your account will not be created unless this code is verified.</p>
      </div>
    `
  });
}

async function verifySignupVerificationCode(email, code) {
  if (!/^\d{6}$/.test(code)) {
    const error = new Error("Enter the 6-digit verification code.");
    error.statusCode = 400;
    throw error;
  }

  const ref = getSignupCodeRef(email);
  const doc = await ref.get();

  if (!doc.exists) {
    const error = new Error("Please request a new verification code.");
    error.statusCode = 400;
    throw error;
  }

  const data = doc.data() || {};
  const expiresAtMs = timestampToMillis(data.expiresAt);

  if (!expiresAtMs || Date.now() > expiresAtMs) {
    await ref.delete();

    const error = new Error("That verification code expired. Please request a new one.");
    error.statusCode = 400;
    throw error;
  }

  if (Number(data.attempts || 0) >= SIGNUP_CODE_MAX_ATTEMPTS) {
    await ref.delete();

    const error = new Error("Too many wrong codes. Please request a new verification code.");
    error.statusCode = 429;
    throw error;
  }

  if (getCodeHash(email, code, data.salt || "") !== data.codeHash) {
    await ref.set({
      attempts: Number(data.attempts || 0) + 1,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    const error = new Error("That verification code is not correct.");
    error.statusCode = 400;
    throw error;
  }

  return ref;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const provider = cleanString((req.body || {}).provider, 30);
    const idToken = cleanString((req.body || {}).idToken, 4000);

    const providerConfigs = {
      google: {
        name: "Google",
        firebaseProviderId: "google.com",
        authProvider: "google"
      },
      github: {
        name: "GitHub",
        firebaseProviderId: "github.com",
        authProvider: "github"
      },
      facebook: {
        name: "Facebook",
        firebaseProviderId: "facebook.com",
        authProvider: "facebook"
      }
    };
    const providerConfig = providerConfigs[provider];

    if (providerConfig) {
      if (!idToken) {
        return res.status(400).json({ error: providerConfig.name + " sign-in could not be verified." });
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const signInProvider =
        decodedToken.firebase && decodedToken.firebase.sign_in_provider
          ? decodedToken.firebase.sign_in_provider
          : "";

      if (signInProvider !== providerConfig.firebaseProviderId) {
        return res.status(400).json({ error: "Please sign in with " + providerConfig.name + "." });
      }

      const userRecord = await admin.auth().getUser(decodedToken.uid);
      const email = cleanEmail(userRecord.email || decodedToken.email);
      const fullName = cleanString(
        userRecord.displayName || decodedToken.name || email.split("@")[0] || providerConfig.name + " User",
        80
      );
      const photoURL = cleanString(userRecord.photoURL || decodedToken.picture, 600);

      if (!email) {
        return res.status(400).json({ error: providerConfig.name + " account email is required." });
      }

      const userRef = admin.firestore().collection("users").doc(decodedToken.uid);
      const userDoc = await userRef.get();
      const existingUser = userDoc.exists ? userDoc.data() || {} : {};

      if (await isBlockedEmail(email)) {
        if (!userDoc.exists) {
          await admin.auth().deleteUser(decodedToken.uid).catch(function () {});
        }

        return res.status(400).json({ error: "Please use a permanent email address. Temporary email services are not allowed." });
      }

      const emailVerified = Boolean(userRecord.emailVerified || decodedToken.email_verified);

      await userRef.set({
        fullName: existingUser.fullName || fullName,
        phone: existingUser.phone || "",
        email,
        photoURL: existingUser.photoURL || photoURL,
        authProvider: existingUser.authProvider || providerConfig.authProvider,
        emailVerified,
        createdAt: existingUser.createdAt || admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      await createCompatibleIdTokenSession(req, res, idToken);

      return res.status(200).json({
        success: true,
        user: {
          uid: decodedToken.uid,
          email,
          displayName: existingUser.fullName || fullName,
          emailVerified,
          photoURL: existingUser.photoURL || photoURL
        }
      });
    }

    const fullName = cleanString((req.body || {}).fullName, 80);
    const phone = cleanString((req.body || {}).phone, 30);
    const email = cleanEmail((req.body || {}).email);
    const password = cleanPassword((req.body || {}).password);
    const confirmPassword = cleanPassword((req.body || {}).confirmPassword);
    const verificationCode = cleanString((req.body || {}).verificationCode, 12).replace(/\D/g, "").slice(0, 6);

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "Please complete all required fields." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    if (
      password.length < 10 ||
      password.length > 48 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9\s]/.test(password)
    ) {
      return res.status(400).json({ error: "Password must be 10 to 48 characters and include uppercase, lowercase, special, and numeric characters." });
    }

    if (await isBlockedEmail(email)) {
      return res.status(400).json({ error: "Please use a permanent email address. Temporary email services are not allowed." });
    }

    await ensureEmailCanCreateAccount(email);

    if (!verificationCode) {
      await checkSignupRateLimit(email);
      await sendSignupVerificationCode(email, fullName);

      return res.status(200).json({
        success: true,
        requiresEmailVerification: true,
        message: "Check your inbox for the 6-digit code. Your account will be created after verification."
      });
    }

    const signupCodeRef = await verifySignupVerificationCode(email, verificationCode);

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName,
      emailVerified: true
    });

    await admin.firestore().collection("users").doc(userRecord.uid).set({
      fullName,
      phone,
      email,
      authProvider: "password",
      emailVerified: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await signupCodeRef.delete();
    await createCompatibleSiteSession(req, res, userRecord.uid);

    return res.status(200).json({
      success: true,
      user: {
        uid: userRecord.uid,
        email,
        displayName: fullName,
        emailVerified: true
      }
    });
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      return res.status(409).json({ error: "This email is already used by another account." });
    }

    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not create account."
    });
  }
};
