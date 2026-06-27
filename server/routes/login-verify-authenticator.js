const admin = require("../_lib/firebaseAdmin");
const { authenticator } = require("otplib");

const {
  getLoginChallenge,
  clearLoginChallenge,
  createSiteSessionFromIdToken,
  createSiteSessionForUid,
  createLoginTwoFactorSession,
  getAuthenticatorSecret
} = require("../_lib/securityHelpers");

const LOCKOUT_MS = 30 * 60 * 1000;

function cleanCode(value) {
  return String(value || "").trim().replace(/\D/g, "");
}

function timestampToMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

async function getSecret(uid) {
  const db = admin.firestore();
  const userDoc = await db.collection("users").doc(uid).get();
  const userData = userDoc.exists ? userDoc.data() || {} : {};

  if (typeof getAuthenticatorSecret === "function") {
    return await getAuthenticatorSecret(db, uid, userData);
  }

  const secretDoc = await db.collection("twoFactorSecrets").doc(uid).get();

  if (secretDoc.exists) {
    const data = secretDoc.data() || {};
    return data.appSecret || data.secret || data.authenticatorSecret || "";
  }

  const twoFactor = userData.twoFactor || {};

  return twoFactor.appSecret || "";
}

async function checkAttemptLock(uid) {
  const ref = admin.firestore().collection("twoFactorAttempts").doc(uid + "_login_app");
  const doc = await ref.get();

  if (!doc.exists) return;

  const data = doc.data() || {};
  const lockedUntilMs = timestampToMillis(data.lockedUntil);

  if (lockedUntilMs && lockedUntilMs > Date.now()) {
    const error = new Error("Too many wrong authenticator codes. Please try again later.");
    error.statusCode = 429;
    throw error;
  }
}

async function recordFailure(uid) {
  const ref = admin.firestore().collection("twoFactorAttempts").doc(uid + "_login_app");
  const doc = await ref.get();
  const data = doc.exists ? doc.data() || {} : {};
  const attempts = Number(data.attempts || 0) + 1;

  await ref.set({
    attempts,
    lockedUntil: attempts >= 3
      ? admin.firestore.Timestamp.fromDate(new Date(Date.now() + LOCKOUT_MS))
      : null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

async function clearFailures(uid) {
  await admin.firestore().collection("twoFactorAttempts").doc(uid + "_login_app").delete().catch(function () {});
}

async function createCompatibleSiteSession(req, res, challenge) {
  if (challenge.idToken && typeof createSiteSessionFromIdToken === "function") {
    return await createSiteSessionFromIdToken(challenge.idToken, res, req);
  }

  return await createSiteSessionForUid(challenge.uid, res, req);
}

async function createCompatibleTwoFactorSession(req, res, uid) {
  if (typeof createLoginTwoFactorSession !== "function") {
    return;
  }

  return await createLoginTwoFactorSession(uid, res);
}

async function clearCompatibleChallenge(req, res) {
  if (typeof clearLoginChallenge !== "function") {
    return;
  }

  if (clearLoginChallenge.length >= 2) {
    return await clearLoginChallenge(req, res);
  }

  return await clearLoginChallenge(res);
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const challenge = await getLoginChallenge(req);

    if (!challenge || !challenge.uid) {
      return res.status(401).json({ error: "Please log in again." });
    }

    const twoFactor = challenge.twoFactor || {};

    if (!twoFactor.appEnabled) {
      return res.status(400).json({ error: "Authenticator app is not enabled for this login." });
    }

    const code = cleanCode((req.body || {}).code);

    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: "Please enter your 6-digit authenticator code." });
    }

    await checkAttemptLock(challenge.uid);

    const secret = await getSecret(challenge.uid);

    if (!secret) {
      return res.status(400).json({ error: "Authenticator app is not enabled for this account." });
    }

    authenticator.options = { window: 1 };

    const valid = authenticator.check(code, secret);

    if (!valid) {
      await recordFailure(challenge.uid);
      return res.status(401).json({ error: "Invalid authenticator code." });
    }

    await clearFailures(challenge.uid);
    await createCompatibleSiteSession(req, res, challenge);
    await createCompatibleTwoFactorSession(req, res, challenge.uid);
    await clearCompatibleChallenge(req, res);

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not verify authenticator code."
    });
  }
};
