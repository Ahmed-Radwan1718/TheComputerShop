const admin = require("./_lib/firebaseAdmin");
const { authenticator } = require("otplib");

const {
  getUserFromRequest,
  createLoginTwoFactorSession
} = require("./_lib/securityHelpers");

const MAX_2FA_ATTEMPTS = 3;
const ATTEMPT_WINDOW_MS = 30 * 60 * 1000;
const LOCKOUT_MS = 30 * 60 * 1000;

function cleanCode(code) {
  return String(code || "").replace(/\D/g, "");
}

function getAttemptRef(db, uid, purpose) {
  return db.collection("twoFactorAttempts").doc(uid + "_" + purpose);
}

async function checkTwoFactorLock(db, uid, purpose) {
  const ref = getAttemptRef(db, uid, purpose);
  const doc = await ref.get();

  if (!doc.exists) {
    return;
  }

  const data = doc.data();
  const lockedUntil = data.lockedUntil && data.lockedUntil.toDate ? data.lockedUntil.toDate() : null;
  const resetAt = data.resetAt && data.resetAt.toDate ? data.resetAt.toDate() : null;

  if (lockedUntil && lockedUntil.getTime() > Date.now()) {
    const error = new Error("Too many incorrect codes. Please wait 30 minutes before trying again.");
    error.statusCode = 429;
    throw error;
  }

  if (resetAt && resetAt.getTime() <= Date.now()) {
    await ref.delete().catch(function () {});
  }
}

async function recordTwoFactorFailure(db, uid, purpose) {
  const ref = getAttemptRef(db, uid, purpose);
  const doc = await ref.get();

  let attempts = 1;

  if (doc.exists) {
    const data = doc.data();
    const resetAt = data.resetAt && data.resetAt.toDate ? data.resetAt.toDate() : null;

    if (resetAt && resetAt.getTime() > Date.now()) {
      attempts = Number(data.attempts || 0) + 1;
    }
  }

  const updateData = {
    attempts,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    resetAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + ATTEMPT_WINDOW_MS))
  };

  if (attempts >= MAX_2FA_ATTEMPTS) {
    updateData.lockedUntil = admin.firestore.Timestamp.fromDate(new Date(Date.now() + LOCKOUT_MS));
  }

  await ref.set(updateData, { merge: true });

  return attempts >= MAX_2FA_ATTEMPTS;
}

async function clearTwoFactorFailures(db, uid, purpose) {
  await getAttemptRef(db, uid, purpose).delete().catch(function () {});
}

async function getAuthenticatorSecret(db, uid, userData) {
  const secretRef = db.collection("twoFactorSecrets").doc(uid);
  const secretDoc = await secretRef.get();

  if (secretDoc.exists && secretDoc.data().appSecret) {
    return secretDoc.data().appSecret;
  }

  const legacySecret =
    userData &&
    userData.twoFactor &&
    userData.twoFactor.appSecret
      ? userData.twoFactor.appSecret
      : "";

  if (legacySecret) {
    await secretRef.set({
      appSecret: legacySecret,
      migratedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await db.collection("users").doc(uid).update({
      "twoFactor.appSecret": admin.firestore.FieldValue.delete(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }).catch(function () {});

    return legacySecret;
  }

  return "";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true
    });

    const code = cleanCode((req.body || {}).code);

    if (!code || code.length !== 6) {
      return res.status(400).json({ error: "Please enter the 6-digit authenticator code." });
    }

    const db = admin.firestore();
    const userDoc = await db.collection("users").doc(decodedUser.uid).get();

    if (!userDoc.exists) {
      return res.status(400).json({ error: "No 2FA settings found for this account." });
    }

    const userData = userDoc.data();
    const twoFactor = userData.twoFactor || {};

    if (!twoFactor.appEnabled) {
      return res.status(400).json({ error: "Authenticator app is not enabled for this account." });
    }

    await checkTwoFactorLock(db, decodedUser.uid, "login_app");

    const appSecret = await getAuthenticatorSecret(db, decodedUser.uid, userData);

    if (!appSecret) {
      return res.status(400).json({ error: "Authenticator app secret is missing. Please set up 2FA again." });
    }

    authenticator.options = { window: 1 };

    const verified = authenticator.verify({
      token: code,
      secret: appSecret
    });

    if (!verified) {
      const locked = await recordTwoFactorFailure(db, decodedUser.uid, "login_app");

      return res.status(locked ? 429 : 400).json({
        error: locked
          ? "Too many incorrect codes. Please wait 30 minutes before trying again."
          : "The authenticator code is incorrect."
      });
    }

    await clearTwoFactorFailures(db, decodedUser.uid, "login_app");
    await createLoginTwoFactorSession(decodedUser.uid, res);

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not verify authenticator code."
    });
  }
};
