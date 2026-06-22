const admin = require("./_lib/firebaseAdmin");

const {
  getUserFromRequest,
  clearSiteSessionCookie,
  clearLoginChallenge,
  clearLoginTwoFactorCookie
} = require("./_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession,
  clearSecurityUnlockSession
} = require("./_lib/securityUnlockHelpers");

async function deleteDocSafely(ref) {
  await ref.delete().catch(function () {});
}

async function deleteMatchingDocs(query) {
  while (true) {
    const snapshot = await query.limit(300).get();

    if (snapshot.empty) {
      return;
    }

    const batch = admin.firestore().batch();

    snapshot.docs.forEach(function (doc) {
      batch.delete(doc.ref);
    });

    await batch.commit();

    if (snapshot.size < 300) {
      return;
    }
  }
}

async function deleteUserSessionData(db, uid) {
  const directDeletes = [
    db.collection("securityPasswordCodes").doc(uid),
    db.collection("securityPasswordSessions").doc(uid),
    db.collection("authenticatorSetupSessions").doc(uid),
    db.collection("emailChangeCodes").doc(uid),
    db.collection("twoFactorAttempts").doc(uid + "_server_login_app"),
    db.collection("twoFactorAttempts").doc(uid + "_server_login_email"),
    db.collection("twoFactorAttempts").doc(uid + "_setup_app"),
    db.collection("twoFactorAttempts").doc(uid + "_disable_app"),
    db.collection("twoFactorAttempts").doc(uid + "_login_app")
  ];

  await Promise.all(directDeletes.map(deleteDocSafely));

  await Promise.all([
    deleteMatchingDocs(db.collection("securityPasswordSessions").where("uid", "==", uid)),
    deleteMatchingDocs(db.collection("loginTwoFactorSessions").where("uid", "==", uid)),
    deleteMatchingDocs(db.collection("loginChallenges").where("uid", "==", uid)),
    deleteMatchingDocs(db.collection("loginEmailCodes").where("uid", "==", uid))
  ]);
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

    const db = admin.firestore();

    await admin.auth().revokeRefreshTokens(decodedUser.uid);
    await deleteUserSessionData(db, decodedUser.uid);

    await clearLoginChallenge(req, res).catch(function () {});
    await clearSecurityUnlockSession(req, res).catch(function () {});
    clearLoginTwoFactorCookie(res);
    clearSiteSessionCookie(res);

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not sign out from all devices."
    });
  }
};
