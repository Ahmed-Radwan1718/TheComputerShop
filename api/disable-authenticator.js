const admin = require("./_lib/firebaseAdmin");
const { authenticator } = require("otplib");

const {
  getUserFromRequest,
  getAuthenticatorSecret,
  checkAttemptLock,
  recordAttemptFailure,
  clearAttemptFailures
} = require("./_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession
} = require("./_lib/securityUnlockHelpers");

function cleanCode(code) {
  return String(code || "").replace(/\D/g, "");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    const hasSecurityUnlock = await hasValidSecurityUnlockSession(req, decodedUser.uid);

    if (!hasSecurityUnlock) {
      return res.status(403).json({
        error: "Security session expired. Please verify again."
      });
    }

    const code = cleanCode((req.body || {}).code);

    if (!code || code.length !== 6) {
      return res.status(400).json({ error: "Please enter your 6-digit authenticator code." });
    }

    const db = admin.firestore();
    const userRef = db.collection("users").doc(decodedUser.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(400).json({ error: "No account settings found." });
    }

    const userData = userDoc.data();
    const existingTwoFactor = userData.twoFactor || {};

    if (!existingTwoFactor.appEnabled) {
      return res.status(400).json({ error: "Authenticator app 2FA is already disabled." });
    }

    await checkAttemptLock(db, decodedUser.uid, "disable_app");

    const appSecret = await getAuthenticatorSecret(db, decodedUser.uid, userData);

    if (!appSecret) {
      return res.status(400).json({
        error: "Authenticator app secret is missing. Please contact support."
      });
    }

    authenticator.options = { window: 1 };

    const verified = authenticator.verify({
      token: code,
      secret: appSecret
    });

    if (!verified) {
      const locked = await recordAttemptFailure(db, decodedUser.uid, "disable_app");

      return res.status(locked ? 429 : 400).json({
        error: locked
          ? "Too many incorrect codes. Please wait 30 minutes before trying again."
          : "The authenticator code is incorrect."
      });
    }

    delete existingTwoFactor.appSecret;

    await db.collection("twoFactorSecrets").doc(decodedUser.uid).delete().catch(function () {});

    await userRef.set({
      twoFactor: {
        ...existingTwoFactor,
        appEnabled: false,
        appDisabledAt: admin.firestore.FieldValue.serverTimestamp(),
        appUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await userRef.update({
      "twoFactor.appSecret": admin.firestore.FieldValue.delete(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }).catch(function () {});

    await clearAttemptFailures(db, decodedUser.uid, "disable_app");

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not disable authenticator app."
    });
  }
};
