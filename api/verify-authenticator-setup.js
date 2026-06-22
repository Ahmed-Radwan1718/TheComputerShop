const admin = require("./_lib/firebaseAdmin");
const { authenticator } = require("otplib");

const {
  getUserFromRequest,
  isExpired,
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
      return res.status(400).json({ error: "Please enter the 6-digit authenticator code." });
    }

    const db = admin.firestore();

    await checkAttemptLock(db, decodedUser.uid, "setup_app");

    const setupRef = db.collection("authenticatorSetupSessions").doc(decodedUser.uid);
    const setupDoc = await setupRef.get();

    if (!setupDoc.exists) {
      return res.status(400).json({ error: "Authenticator setup expired. Please start again." });
    }

    const setupData = setupDoc.data();

    if (isExpired(setupData.expiresAt)) {
      await setupRef.delete().catch(function () {});
      return res.status(400).json({ error: "Authenticator setup expired. Please start again." });
    }

    authenticator.options = { window: 1 };

    const verified = authenticator.verify({
      token: code,
      secret: setupData.secret
    });

    if (!verified) {
      const locked = await recordAttemptFailure(db, decodedUser.uid, "setup_app");

      return res.status(locked ? 429 : 400).json({
        error: locked
          ? "Too many incorrect codes. Please wait 30 minutes before trying again."
          : "The authenticator code is incorrect."
      });
    }

    const userRef = db.collection("users").doc(decodedUser.uid);
    const userDoc = await userRef.get();
    const existingTwoFactor =
      userDoc.exists && userDoc.data().twoFactor ? userDoc.data().twoFactor : {};

    delete existingTwoFactor.appSecret;

    await db.collection("twoFactorSecrets").doc(decodedUser.uid).set({
      appSecret: setupData.secret,
      email: setupData.email || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await userRef.set({
      twoFactor: {
        ...existingTwoFactor,
        appEnabled: true,
        appEnabledAt: admin.firestore.FieldValue.serverTimestamp(),
        appUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await userRef.update({
      "twoFactor.appSecret": admin.firestore.FieldValue.delete(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }).catch(function () {});

    await setupRef.delete().catch(function () {});
    await clearAttemptFailures(db, decodedUser.uid, "setup_app");

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not verify authenticator setup."
    });
  }
};
