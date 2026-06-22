const crypto = require("crypto");
const admin = require("./_lib/firebaseAdmin");

const {
  getLoginChallenge,
  clearLoginChallenge,
  createSiteSessionForUid,
  createLoginTwoFactorSession,
  getCodeHash,
  isExpired,
  checkAttemptLock,
  recordAttemptFailure,
  clearAttemptFailures
} = require("./_lib/securityHelpers");

function cleanCode(code) {
  return String(code || "").replace(/\D/g, "");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const code = cleanCode((req.body || {}).code);

    if (!code || code.length !== 6) {
      return res.status(400).json({ error: "Please enter the 6-digit email code." });
    }

    const challenge = await getLoginChallenge(req);
    const uid = challenge.data.uid;
    const twoFactor = challenge.data.twoFactor || {};

    if (!twoFactor.emailEnabled) {
      return res.status(400).json({ error: "Email 2FA is not enabled for this login." });
    }

    const db = admin.firestore();
    const codeRef = db.collection("loginEmailCodes").doc(challenge.challengeId);
    const codeDoc = await codeRef.get();

    if (!codeDoc.exists) {
      return res.status(400).json({ error: "Please request a new email code." });
    }

    const data = codeDoc.data();

    if (data.uid !== uid) {
      return res.status(400).json({ error: "Invalid email code session." });
    }

    if (isExpired(data.expiresAt)) {
      await codeRef.delete().catch(function () {});
      return res.status(400).json({ error: "This email code expired. Please request a new one." });
    }

    await checkAttemptLock(db, uid, "server_login_email");

    const submittedHash = getCodeHash(uid, code, data.salt);

    const savedBuffer = Buffer.from(data.codeHash || "", "hex");
    const submittedBuffer = Buffer.from(submittedHash, "hex");

    const codeMatches =
      savedBuffer.length === submittedBuffer.length &&
      crypto.timingSafeEqual(savedBuffer, submittedBuffer);

    if (!codeMatches) {
      const locked = await recordAttemptFailure(db, uid, "server_login_email");

      return res.status(locked ? 429 : 400).json({
        error: locked
          ? "Too many incorrect codes. Please wait 30 minutes before trying again."
          : "The email code is incorrect."
      });
    }

    await clearAttemptFailures(db, uid, "server_login_email");
    await codeRef.delete().catch(function () {});
    await createSiteSessionForUid(uid, res);
    await createLoginTwoFactorSession(uid, res);
    await clearLoginChallenge(req, res);

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not verify email code."
    });
  }
};
