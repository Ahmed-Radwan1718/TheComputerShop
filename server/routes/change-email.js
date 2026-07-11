const admin = require("../_lib/firebaseAdmin");
const { Resend } = require("resend");
const disposableEmailDomains = require("disposable-email-domains-js");

const {
  getUserFromRequest,
  signInWithPassword,
  getCodeHash,
  createRandomCode,
  createSiteSessionForUid
} = require("../_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession,
  clearSecurityUnlockSession
} = require("../_lib/securityUnlockHelpers");

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_COOLDOWN_MS = 90 * 24 * 60 * 60 * 1000;
const LOCKOUT_MS = 30 * 60 * 1000;

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanEmail(value) {
  return cleanString(value, 160).toLowerCase();
}

function timestampToMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

async function hasSecurityUnlock(req, uid) {
  if (hasValidSecurityUnlockSession.length >= 2) {
    return await hasValidSecurityUnlockSession(req, uid);
  }

  return await hasValidSecurityUnlockSession(req);
}

async function clearSecurityUnlock(req, res, uid) {
  if (clearSecurityUnlockSession.length >= 3) {
    return await clearSecurityUnlockSession(req, res, uid);
  }

  if (clearSecurityUnlockSession.length >= 2) {
    return await clearSecurityUnlockSession(req, res);
  }

  return await clearSecurityUnlockSession(res);
}

async function createCompatibleSiteSession(req, res, uid) {
  if (createSiteSessionForUid.length >= 3) {
    return await createSiteSessionForUid(req, res, uid);
  }

  return await createSiteSessionForUid(res, uid);
}

async function requireSecurityUnlock(req, uid) {
  const unlocked = await hasSecurityUnlock(req, uid);

  if (!unlocked) {
    const error = new Error("Please unlock the Security panel first.");
    error.statusCode = 403;
    throw error;
  }
}

async function handleStart(req, res, uid) {
  await requireSecurityUnlock(req, uid);

  const currentEmail = cleanEmail((req.body || {}).currentEmail);
  const newEmail = cleanEmail((req.body || {}).newEmail);
  const currentPassword = String((req.body || {}).currentPassword || "");

  if (!currentEmail || !newEmail || !currentPassword) {
    return res.status(400).json({ error: "Please enter your current email, new email, and password." });
  }

  if (currentEmail === newEmail) {
    return res.status(400).json({ error: "Please enter a different new email." });
  }

  if (disposableEmailDomains.isDisposableEmail(newEmail)) {
    return res.status(400).json({ error: "Please use a permanent email address. Temporary email services are not allowed." });
  }

  const db = admin.firestore();
  const userRecord = await admin.auth().getUser(uid);
  const realCurrentEmail = cleanEmail(userRecord.email);

  if (currentEmail !== realCurrentEmail) {
    return res.status(400).json({ error: "Current email does not match your account." });
  }

  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();
  const userData = userDoc.exists ? userDoc.data() || {} : {};

  const lastChangedMs = timestampToMillis(userData.emailLastChangedAt);

  if (lastChangedMs && Date.now() - lastChangedMs < EMAIL_COOLDOWN_MS) {
    return res.status(429).json({ error: "You can change your email once every 90 days." });
  }

  try {
    const existingUser = await admin.auth().getUserByEmail(newEmail);

    if (existingUser && existingUser.uid !== uid) {
      return res.status(409).json({ error: "This email is already used by another account." });
    }
  } catch (error) {
    if (error.code !== "auth/user-not-found") {
      throw error;
    }
  }

  try {
    await signInWithPassword(realCurrentEmail, currentPassword);
  } catch (error) {
    return res.status(401).json({ error: "Current password is incorrect." });
  }

  const code = createRandomCode();
  const salt = db.collection("_").doc().id;
  const codeHash = getCodeHash(uid, code, salt);

  await db.collection("emailChangeCodes").doc(uid).set({
    newEmail,
    codeHash,
    salt,
    attempts: 0,
    lockedUntil: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastSentAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000))
  });

  await userRef.set({
    emailChangePendingTo: newEmail,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  await resend.emails.send({
    from: process.env.SECURITY_EMAIL_FROM,
    to: newEmail,
    subject: "Confirm your new Computer Shop email",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Confirm your new email</h2>
        <p>Use this code to confirm your email change:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${code}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `
  });

  return res.status(200).json({
    success: true,
    message: "Verification code sent to your new email."
  });
}

async function handleConfirm(req, res, uid) {
  await requireSecurityUnlock(req, uid);

  const code = cleanString((req.body || {}).code, 20);
  const db = admin.firestore();
  const codeRef = db.collection("emailChangeCodes").doc(uid);
  const codeDoc = await codeRef.get();

  if (!codeDoc.exists) {
    return res.status(400).json({ error: "Please request a new verification code." });
  }

  const data = codeDoc.data() || {};
  const lockedUntilMs = timestampToMillis(data.lockedUntil);
  const expiresAtMs = timestampToMillis(data.expiresAt);

  if (lockedUntilMs && lockedUntilMs > Date.now()) {
    return res.status(429).json({ error: "Too many wrong codes. Please try again later." });
  }

  if (!expiresAtMs || expiresAtMs < Date.now()) {
    await codeRef.delete().catch(function () {});
    return res.status(400).json({ error: "This code expired. Please request a new one." });
  }

  const expectedHash = getCodeHash(uid, code, data.salt || "");

  if (!code || expectedHash !== data.codeHash) {
    const attempts = Number(data.attempts || 0) + 1;

    await codeRef.set({
      attempts,
      lockedUntil: attempts >= 3
        ? admin.firestore.Timestamp.fromDate(new Date(Date.now() + LOCKOUT_MS))
        : null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return res.status(401).json({ error: "Invalid verification code." });
  }

  const newEmail = cleanEmail(data.newEmail);

  if (!newEmail) {
    return res.status(400).json({ error: "Missing new email. Please restart email change." });
  }

  if (disposableEmailDomains.isDisposableEmail(newEmail)) {
    return res.status(400).json({ error: "Please use a permanent email address. Temporary email services are not allowed." });
  }

  await admin.auth().updateUser(uid, {
    email: newEmail,
    emailVerified: true
  });

  await admin.auth().revokeRefreshTokens(uid);

  await db.collection("users").doc(uid).set({
    email: newEmail,
    emailLastChangedAt: admin.firestore.FieldValue.serverTimestamp(),
    emailChangePendingTo: admin.firestore.FieldValue.delete(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  await codeRef.delete().catch(function () {});
  await createCompatibleSiteSession(req, res, uid);
  await clearSecurityUnlock(req, res, uid);

  return res.status(200).json({
    success: true,
    email: newEmail
  });
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    const action = cleanString((req.body || {}).action, 20);

    if (action === "start") {
      return await handleStart(req, res, decodedUser.uid);
    }

    if (action === "confirm") {
      return await handleConfirm(req, res, decodedUser.uid);
    }

    return res.status(400).json({ error: "Invalid email change action." });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not change email."
    });
  }
};
