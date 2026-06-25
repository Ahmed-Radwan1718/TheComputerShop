const admin = require("../_lib/firebaseAdmin");
const { Resend } = require("resend");

const {
  createSiteSessionForUid,
  createSiteSessionFromIdToken
} = require("../_lib/securityHelpers");

const resend = new Resend(process.env.RESEND_API_KEY);

const WINDOW_MS = 30 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanEmail(value) {
  return cleanString(value, 160).toLowerCase();
}

function cleanPassword(value) {
  return String(value || "");
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

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const provider = cleanString((req.body || {}).provider, 30);
    const idToken = cleanString((req.body || {}).idToken, 4000);

    if (provider === "google") {
      if (!idToken) {
        return res.status(400).json({ error: "Google sign-in could not be verified." });
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const signInProvider =
        decodedToken.firebase && decodedToken.firebase.sign_in_provider
          ? decodedToken.firebase.sign_in_provider
          : "";

      if (signInProvider !== "google.com") {
        return res.status(400).json({ error: "Please sign in with Google." });
      }

      const userRecord = await admin.auth().getUser(decodedToken.uid);
      const email = cleanEmail(userRecord.email || decodedToken.email);
      const fullName = cleanString(userRecord.displayName || decodedToken.name || email.split("@")[0], 80);
      const photoURL = cleanString(userRecord.photoURL || decodedToken.picture, 600);

      if (!email) {
        return res.status(400).json({ error: "Google account email is required." });
      }

      const userRef = admin.firestore().collection("users").doc(decodedToken.uid);
      const userDoc = await userRef.get();
      const existingUser = userDoc.exists ? userDoc.data() || {} : {};

      await userRef.set({
        fullName: existingUser.fullName || fullName,
        phone: existingUser.phone || "",
        email,
        photoURL: existingUser.photoURL || photoURL,
        authProvider: "google",
        emailVerified: Boolean(userRecord.emailVerified || decodedToken.email_verified),
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
          emailVerified: Boolean(userRecord.emailVerified || decodedToken.email_verified),
          photoURL: existingUser.photoURL || photoURL
        }
      });
    }

    const fullName = cleanString((req.body || {}).fullName, 80);
    const phone = cleanString((req.body || {}).phone, 30);
    const email = cleanEmail((req.body || {}).email);
    const password = cleanPassword((req.body || {}).password);

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Please complete all required fields." });
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password) || /\s/.test(password)) {
      return res.status(400).json({ error: "Password must be at least 8 characters and include letters and numbers." });
    }

    await checkSignupRateLimit(email);

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName,
      emailVerified: false
    });

    await admin.firestore().collection("users").doc(userRecord.uid).set({
      fullName,
      phone,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const verificationLink = await admin.auth().generateEmailVerificationLink(email);

    await resend.emails.send({
      from: process.env.SECURITY_EMAIL_FROM,
      to: email,
      subject: "Verify your Computer Shop email",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Verify your email address</h2>
          <p>Welcome to The Computer Shop. Click below to verify your email.</p>
          <p>
            <a href="${verificationLink}" style="display: inline-block; padding: 12px 18px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px;">
              Verify Email
            </a>
          </p>
          <p>If the button does not work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${verificationLink}</p>
        </div>
      `
    });

    await createCompatibleSiteSession(req, res, userRecord.uid);

    return res.status(200).json({
      success: true,
      user: {
        uid: userRecord.uid,
        email,
        displayName: fullName,
        emailVerified: false
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
