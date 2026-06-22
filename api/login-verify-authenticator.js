const admin = require("./_lib/firebaseAdmin");
const { authenticator } = require("otplib");

const {
  getLoginChallenge,
  clearLoginChallenge,
  createSiteSessionForUid,
  createLoginTwoFactorSession,
  checkAttemptLock,
  recordAttemptFailure,
  clearAttemptFailures,
  getAuthenticatorSecret
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
      return res.status(400).json({ error: "Please enter the 6-digit authenticator code." });
    }

    const challenge = await getLoginChallenge(req);
    const uid = challenge.data.uid;
    const challengeTwoFactor = challenge.data.twoFactor || {};

    if (!challengeTwoFactor.appEnabled) {
      return res.status(400).json({ error: "Authenticator app is not enabled for this login." });
    }

    const db = admin.firestore();
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(400).json({ error: "No account settings found." });
    }

    const userData = userDoc.data();
    const twoFactor = userData.twoFactor || {};

    if (!twoFactor.appEnabled) {
      return res.status(400).json({ error: "Authenticator app is not enabled for this account." });
    }

    await checkAttemptLock(db, uid, "server_login_app");

    const appSecret = await getAuthenticatorSecret(db, uid, userData);

    if (!appSecret) {
      return res.status(400).json({ error: "Authenticator app secret is missing. Please contact support." });
    }

    authenticator.options = { window: 1 };

    const verified = authenticator.verify({
      token: code,
      secret: appSecret
    });

    if (!verified) {
      const locked = await recordAttemptFailure(db, uid, "server_login_app");

      return res.status(locked ? 429 : 400).json({
        error: locked
          ? "Too many incorrect codes. Please wait 30 minutes before trying again."
          : "The authenticator code is incorrect."
      });
    }

    await clearAttemptFailures(db, uid, "server_login_app");
    await createSiteSessionForUid(uid, res);
    await createLoginTwoFactorSession(uid, res);
    await clearLoginChallenge(req, res);

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not verify authenticator code."
    });
  }
};
