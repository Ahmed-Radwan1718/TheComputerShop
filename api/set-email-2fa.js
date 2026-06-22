const admin = require("./_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("./_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession
} = require("./_lib/securityUnlockHelpers");

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

    const enabled = Boolean((req.body || {}).enabled);
    const userRecord = await admin.auth().getUser(decodedUser.uid);

    if (enabled && !userRecord.emailVerified) {
      return res.status(400).json({
        error: "Please verify your email address before enabling email 2FA."
      });
    }

    if (enabled && !userRecord.email) {
      return res.status(400).json({
        error: "No email address found for this account."
      });
    }

    const db = admin.firestore();
    const userRef = db.collection("users").doc(decodedUser.uid);
    const userDoc = await userRef.get();
    const existingTwoFactor =
      userDoc.exists && userDoc.data().twoFactor ? userDoc.data().twoFactor : {};

    delete existingTwoFactor.appSecret;

    await userRef.set({
      twoFactor: {
        ...existingTwoFactor,
        emailEnabled: enabled,
        emailUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await userRef.update({
      "twoFactor.appSecret": admin.firestore.FieldValue.delete(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }).catch(function () {});

    return res.status(200).json({
      success: true,
      emailEnabled: enabled
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not update email 2FA."
    });
  }
};
