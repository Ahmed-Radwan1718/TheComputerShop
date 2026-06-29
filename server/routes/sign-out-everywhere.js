const admin = require("../_lib/firebaseAdmin");

const {
  getUserFromRequest,
  getCurrentAccountSession,
  revokeTrustedDevice,
  clearTrustedDeviceCookie,
  clearSiteSessionCookie,
  clearLoginChallenge,
  clearLoginTwoFactorCookie
} = require("../_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession,
  clearSecurityUnlockSession
} = require("../_lib/securityUnlockHelpers");

async function hasSecurityUnlock(req, uid) {
  if (hasValidSecurityUnlockSession.length >= 2) {
    return await hasValidSecurityUnlockSession(req, uid);
  }

  return await hasValidSecurityUnlockSession(req);
}

async function clearSiteSession(req, res) {
  if (clearSiteSessionCookie.length >= 2) return await clearSiteSessionCookie(req, res);
  return await clearSiteSessionCookie(res);
}

async function clearLoginChallengeCookie(req, res) {
  if (typeof clearLoginChallenge !== "function") return;
  if (clearLoginChallenge.length >= 2) return await clearLoginChallenge(req, res);
  return await clearLoginChallenge(res);
}

async function clearLoginTwoFactor(req, res) {
  if (typeof clearLoginTwoFactorCookie !== "function") return;
  if (clearLoginTwoFactorCookie.length >= 2) return await clearLoginTwoFactorCookie(req, res);
  return await clearLoginTwoFactorCookie(res);
}

async function clearSecurityUnlock(req, res, uid) {
  if (typeof clearSecurityUnlockSession !== "function") return;
  if (clearSecurityUnlockSession.length >= 3) return await clearSecurityUnlockSession(req, res, uid);
  if (clearSecurityUnlockSession.length >= 2) return await clearSecurityUnlockSession(req, res);
  return await clearSecurityUnlockSession(res);
}

async function deleteDirectDocs(uid) {
  const db = admin.firestore();
  const batch = db.batch();

  [
    db.collection("securityPasswordCodes").doc(uid),
    db.collection("securityPasswordSessions").doc(uid),
    db.collection("authenticatorSetupSessions").doc(uid),
    db.collection("emailChangeCodes").doc(uid),
    db.collection("twoFactorAttempts").doc(uid + "_login_app"),
    db.collection("twoFactorAttempts").doc(uid + "_setup_app"),
    db.collection("twoFactorAttempts").doc(uid + "_disable_app")
  ].forEach(function (ref) {
    batch.delete(ref);
  });

  await batch.commit().catch(function () {});
}

async function deleteQuery(collectionName, uid) {
  const db = admin.firestore();
  const snapshot = await db.collection(collectionName).where("uid", "==", uid).get();

  if (snapshot.empty) {
    return;
  }

  const batch = db.batch();

  snapshot.docs.forEach(function (doc) {
    batch.delete(doc.ref);
  });

  await batch.commit();
}

function getCleanSessionId(value) {
  const sessionId = String(value || "").trim();

  if (!/^[A-Za-z0-9_-]{6,128}$/.test(sessionId)) {
    return "";
  }

  return sessionId;
}

async function signOutSession(req, res) {
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

    const sessionId = getCleanSessionId((req.body || {}).sessionId);

    if (!sessionId) {
      return res.status(400).json({ error: "Session not found." });
    }

    const currentSession = await getCurrentAccountSession(req, decodedUser.uid).catch(function (error) {
      if (error && error.statusCode === 401) {
        throw error;
      }

      return null;
    });

    if (currentSession && currentSession.id === sessionId) {
      return res.status(400).json({ error: "You cannot sign out your current session here." });
    }

    const db = admin.firestore();
    const sessionRef = db.collection("accountSessions").doc(sessionId);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: "Session not found." });
    }

    const sessionData = sessionDoc.data() || {};

    if (sessionData.uid !== decodedUser.uid) {
      return res.status(403).json({ error: "You cannot sign out this session." });
    }

    if (sessionData.revokedAt) {
      return res.status(404).json({ error: "Session not found." });
    }

    await sessionRef.set({
      revokedAt: admin.firestore.FieldValue.serverTimestamp(),
      revokedBy: decodedUser.uid,
      revokedReason: "individual_device_signout"
    }, { merge: true });

    return res.status(200).json({
      success: true,
      sessionId
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not sign out this device."
    });
  }
}

async function signOutEverywhereHandler(req, res) {
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

    await admin.auth().revokeRefreshTokens(decodedUser.uid);

    await deleteDirectDocs(decodedUser.uid);

    await Promise.all([
      deleteQuery("securityPasswordSessions", decodedUser.uid),
      deleteQuery("loginTwoFactorSessions", decodedUser.uid),
      deleteQuery("loginChallenges", decodedUser.uid),
      deleteQuery("loginEmailCodes", decodedUser.uid),
      deleteQuery("accountSessions", decodedUser.uid),
      deleteQuery("trustedDevices", decodedUser.uid)
    ]);

    await clearLoginChallengeCookie(req, res);
    await clearSecurityUnlock(req, res, decodedUser.uid);
    await clearLoginTwoFactor(req, res);
    clearTrustedDeviceCookie(res);
    await clearSiteSession(req, res);

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not sign out everywhere."
    });
  }
}

async function trustedDevices(req, res) {
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

    const trustedDeviceId = getCleanSessionId((req.body || {}).trustedDeviceId);

    await revokeTrustedDevice(
      req,
      res,
      decodedUser.uid,
      trustedDeviceId,
      "trusted_device_removed"
    );

    return res.status(200).json({
      success: true,
      trustedDeviceId
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not remove trusted device."
    });
  }
}

module.exports = signOutEverywhereHandler;
module.exports.signOutSession = signOutSession;
module.exports.trustedDevices = trustedDevices;
