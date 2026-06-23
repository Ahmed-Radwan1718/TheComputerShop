const admin = require("../_lib/firebaseAdmin");

const {
  getCodeHash,
  getLoginChallenge,
  clearLoginChallenge,
  createSiteSessionFromIdToken,
  createSiteSessionForUid,
  createLoginTwoFactorSession
} = require("../_lib/securityHelpers");

const LOCKOUT_MS = 30 * 60 * 1000;

function cleanCode(value) {
  return String(value || "").trim().replace(/\D/g, "");
}

function getChallengeId(challenge) {
  return String(
    challenge.challengeId ||
    challenge.id ||
    challenge.sessionId ||
    challenge.uid ||
    ""
  ).trim();
}

function timestampToMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

async function createCompatibleSiteSession(req, res, challenge) {
  if (challenge.idToken && typeof createSiteSessionFromIdToken === "function") {
    if (createSiteSessionFromIdToken.length >= 3) {
      return await createSiteSessionFromIdToken(req, res, challenge.idToken);
    }

    return await createSiteSessionFromIdToken(res, challenge.idToken);
  }

  if (createSiteSessionForUid.length >= 3) {
    return await createSiteSessionForUid(req, res, challenge.uid);
  }

  return await createSiteSessionForUid(res, challenge.uid);
}

async function createCompatibleTwoFactorSession(req, res, uid) {
  if (typeof createLoginTwoFactorSession !== "function") {
    return;
  }

  if (createLoginTwoFactorSession.length >= 3) {
    return await createLoginTwoFactorSession(req, res, uid);
  }

  return await createLoginTwoFactorSession(res, uid);
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

    if (!twoFactor.emailEnabled) {
      return res.status(400).json({ error: "Email verification is not enabled for this login." });
    }

    const challengeId = getChallengeId(challenge);

    if (!challengeId) {
      return res.status(400).json({ error: "Please restart login and try again." });
    }

    const code = cleanCode((req.body || {}).code);

    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: "Please enter the 6-digit email code." });
    }

    const db = admin.firestore();
    const codeRef = db.collection("loginEmailCodes").doc(challengeId);
    const codeDoc = await codeRef.get();

    if (!codeDoc.exists) {
      return res.status(400).json({ error: "Please request a new login code." });
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

    if (data.uid !== challenge.uid) {
      return res.status(401).json({ error: "Invalid login session." });
    }

    const expectedHash = getCodeHash(challenge.uid, code, data.salt || "");

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

    await codeRef.delete().catch(function () {});
    await createCompatibleSiteSession(req, res, challenge);
    await createCompatibleTwoFactorSession(req, res, challenge.uid);
    await clearCompatibleChallenge(req, res);

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not verify login email code."
    });
  }
};
