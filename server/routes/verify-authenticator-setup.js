const admin = require("../_lib/firebaseAdmin");
const { authenticator } = require("otplib");

const {
  getUserFromRequest
} = require("../_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession
} = require("../_lib/securityUnlockHelpers");

const LOCKOUT_MS = 30 * 60 * 1000;

function cleanCode(value) {
  return String(value || "").trim().replace(/\s+/g, "");
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

async function checkAttemptLock(uid) {
  const ref = admin.firestore().collection("twoFactorAttempts").doc(uid + "_setup_app");
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
  const ref = admin.firestore().collection("twoFactorAttempts").doc(uid + "_setup_app");
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
  await admin.firestore().collection("twoFactorAttempts").doc(uid + "_setup_app").delete().catch(function () {});
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

    const unlocked = await hasSecurityUnlock(req, decodedUser.uid);

    if (!unlocked) {
      return res.status(403).json({ error: "Please unlock the Security panel first." });
    }

    const code = cleanCode((req.body || {}).code);

    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: "Please enter the 6-digit authenticator code." });
    }

    await checkAttemptLock(decodedUser.uid);

    const setupRef = admin.firestore().collection("authenticatorSetupSessions").doc(decodedUser.uid);
    const setupDoc = await setupRef.get();

    if (!setupDoc.exists) {
      return res.status(400).json({ error: "Please restart authenticator setup." });
    }

    const setupData = setupDoc.data() || {};
    const expiresAtMs = timestampToMillis(setupData.expiresAt);

    if (!expiresAtMs || expiresAtMs < Date.now()) {
      await setupRef.delete().catch(function () {});
      return res.status(400).json({ error: "Authenticator setup expired. Please restart setup." });
    }

    const secret = setupData.secret || "";

    if (!secret) {
      return res.status(400).json({ error: "Please restart authenticator setup." });
    }

    authenticator.options = { window: 1 };

    const valid = authenticator.check(code, secret);

    if (!valid) {
      await recordFailure(decodedUser.uid);
      return res.status(401).json({ error: "Invalid authenticator code." });
    }

    await clearFailures(decodedUser.uid);

    const db = admin.firestore();
    const userRef = db.collection("users").doc(decodedUser.uid);
    const userDoc = await userRef.get();
    const userData = userDoc.exists ? userDoc.data() || {} : {};
    const existingTwoFactor = userData.twoFactor || {};

    delete existingTwoFactor.appSecret;

    await db.collection("twoFactorSecrets").doc(decodedUser.uid).set({
      appSecret: secret,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await userRef.set({
      twoFactor: {
        ...existingTwoFactor,
        appEnabled: true,
        appEnabledAt: existingTwoFactor.appEnabledAt || admin.firestore.FieldValue.serverTimestamp(),
        appUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await setupRef.delete().catch(function () {});

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not verify authenticator setup."
    });
  }
};
