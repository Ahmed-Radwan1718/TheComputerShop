const admin = require("../_lib/firebaseAdmin");

const {
  getUserFromRequest,
  getAuthenticatorSecret
} = require("../_lib/securityHelpers");

async function hasAuthenticatorMethod(db, uid) {
  const userDoc = await db.collection("users").doc(uid).get();
  const userData = userDoc.exists ? userDoc.data() || {} : {};
  const twoFactor = userData.twoFactor || {};

  if (!twoFactor.appEnabled || typeof getAuthenticatorSecret !== "function") {
    return false;
  }

  const secret = await getAuthenticatorSecret(db, uid, userData);
  return Boolean(secret);
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

    const reason = String((req.body || {}).reason || "").trim();

    if (reason && reason !== "security-panel") {
      return res.status(400).json({ error: "Invalid security verification request." });
    }

    const db = admin.firestore();
    const hasAuthenticator = await hasAuthenticatorMethod(db, decodedUser.uid);

    if (!hasAuthenticator) {
      return res.status(400).json({
        error: "Firebase can send account verification and password reset emails, but it does not send custom security codes. Set up an authenticator app to unlock the security panel."
      });
    }

    return res.status(200).json({
      success: true,
      method: "authenticator"
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not start security verification."
    });
  }
};
