const admin = require("../_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("../_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession
} = require("../_lib/securityUnlockHelpers");

async function hasSecurityUnlock(req, uid) {
  if (hasValidSecurityUnlockSession.length >= 2) {
    return await hasValidSecurityUnlockSession(req, uid);
  }

  return await hasValidSecurityUnlockSession(req);
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

    const enabled = Boolean((req.body || {}).enabled);
    const userRecord = await admin.auth().getUser(decodedUser.uid);

    if (enabled && !userRecord.emailVerified) {
      return res.status(400).json({
        error: "Please verify your email address before enabling email 2FA."
      });
    }

    const db = admin.firestore();
    const userRef = db.collection("users").doc(decodedUser.uid);
    const userDoc = await userRef.get();
    const userData = userDoc.exists ? userDoc.data() || {} : {};
    const existingTwoFactor = userData.twoFactor || {};

    delete existingTwoFactor.appSecret;

    await userRef.set({
      twoFactor: {
        ...existingTwoFactor,
        emailEnabled: enabled,
        emailUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not update email 2FA."
    });
  }
};
