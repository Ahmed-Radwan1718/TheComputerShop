const admin = require("../_lib/firebaseAdmin");

const {
  getUserFromRequest,
  signInWithPassword,
  createSiteSessionForUid,
  revokeAllTrustedDevices,
  clearTrustedDeviceCookie
} = require("../_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession,
  clearSecurityUnlockSession
} = require("../_lib/securityUnlockHelpers");

const LOCKOUT_MS = 30 * 60 * 1000;

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function timestampToMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function serializeTimestamp(value) {
  const millis = timestampToMillis(value);
  return millis ? new Date(millis).toISOString() : null;
}

async function revokeOtherAccountSessions(uid, currentSessionId, revokedBy) {
  const keepSessionId = String(currentSessionId || "").trim();

  if (!uid || !keepSessionId) {
    const error = new Error("Could not refresh this session after password change.");
    error.statusCode = 500;
    throw error;
  }

  const db = admin.firestore();
  const snapshot = await db.collection("accountSessions")
    .where("uid", "==", uid)
    .get();

  if (snapshot.empty) {
    return;
  }

  let batch = db.batch();
  let operationCount = 0;
  const commits = [];

  snapshot.docs.forEach(function (doc) {
    const data = doc.data() || {};

    if (doc.id === keepSessionId || data.revokedAt) {
      return;
    }

    if (data.uid !== uid) {
      return;
    }

    batch.set(doc.ref, {
      revokedAt: admin.firestore.FieldValue.serverTimestamp(),
      revokedBy: revokedBy || uid,
      revokedReason: "password_changed"
    }, { merge: true });

    operationCount += 1;

    if (operationCount >= 450) {
      commits.push(batch.commit());
      batch = db.batch();
      operationCount = 0;
    }
  });

  if (operationCount) {
    commits.push(batch.commit());
  }

  await Promise.all(commits);
}

function isStrongPassword(password) {
  return typeof password === "string"
    && password.length >= 8
    && !/\s/.test(password)
    && /[A-Za-z]/.test(password)
    && /\d/.test(password);
}

async function hasSecurityUnlock(req, uid) {
  if (hasValidSecurityUnlockSession.length >= 2) {
    return await hasValidSecurityUnlockSession(req, uid);
  }

  return await hasValidSecurityUnlockSession(req);
}

async function clearSecurityUnlock(req, res, uid) {
  if (clearSecurityUnlockSession.length >= 3) {
    return await clearSecurityUnlockSession(req, res, uid);
  }

  if (clearSecurityUnlockSession.length >= 2) {
    return await clearSecurityUnlockSession(req, res);
  }

  return await clearSecurityUnlockSession(res);
}

async function createCompatibleSiteSession(req, res, uid) {
  if (createSiteSessionForUid.length >= 3) {
    return await createSiteSessionForUid(req, res, uid);
  }

  return await createSiteSessionForUid(res, uid);
}

async function checkPasswordChangeLock(uid) {
  const ref = admin.firestore().collection("passwordChangeAttempts").doc(uid);
  const doc = await ref.get();

  if (!doc.exists) {
    return;
  }

  const data = doc.data() || {};
  const lockedUntilMs = timestampToMillis(data.lockedUntil);

  if (lockedUntilMs && lockedUntilMs > Date.now()) {
    const error = new Error("Too many wrong password attempts. Please try again later.");
    error.statusCode = 429;
    throw error;
  }
}

async function recordWrongPassword(uid) {
  const ref = admin.firestore().collection("passwordChangeAttempts").doc(uid);
  const doc = await ref.get();
  const data = doc.exists ? doc.data() || {} : {};
  const attempts = Number(data.attempts || 0) + 1;

  await ref.set({
    attempts,
    lockedUntil: attempts >= 3
      ? admin.firestore.Timestamp.fromDate(new Date(Date.now() + LOCKOUT_MS))
      : null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

async function clearWrongPasswordAttempts(uid) {
  await admin.firestore().collection("passwordChangeAttempts").doc(uid).delete().catch(function () {});
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

    const currentPassword = String((req.body || {}).currentPassword || "");
    const newPassword = String((req.body || {}).newPassword || "");
    const confirmPassword = String((req.body || {}).confirmPassword || "");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "Please complete all password fields." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New passwords do not match." });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ error: "Password must be at least 8 characters and include letters and numbers." });
    }

    await checkPasswordChangeLock(decodedUser.uid);

    const userRecord = await admin.auth().getUser(decodedUser.uid);
    const email = userRecord.email || decodedUser.email || "";

    if (!email) {
      return res.status(400).json({ error: "No email address found on this account." });
    }

    try {
      await signInWithPassword(email, currentPassword);
    } catch (error) {
      await recordWrongPassword(decodedUser.uid);
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    await clearWrongPasswordAttempts(decodedUser.uid);

    const db = admin.firestore();
    const userRef = db.collection("users").doc(decodedUser.uid);

    await admin.auth().updateUser(decodedUser.uid, {
      password: newPassword
    });

    await userRef.set({
      passwordLastChangedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    const updatedUserDoc = await userRef.get();
    const updatedUserData = updatedUserDoc.exists ? updatedUserDoc.data() || {} : {};
    const passwordLastChangedAt = serializeTimestamp(updatedUserData.passwordLastChangedAt);

    if (!passwordLastChangedAt) {
      throw new Error("Could not save password change time.");
    }

    await admin.auth().revokeRefreshTokens(decodedUser.uid);
    await revokeAllTrustedDevices(decodedUser.uid, decodedUser.uid, "password_changed");
    clearTrustedDeviceCookie(res);

    const refreshedSession = await createCompatibleSiteSession(req, res, decodedUser.uid);

    await revokeOtherAccountSessions(
      decodedUser.uid,
      refreshedSession && refreshedSession.accountSessionId,
      decodedUser.uid
    );

    await clearSecurityUnlock(req, res, decodedUser.uid);

    return res.status(200).json({
      success: true,
      passwordLastChangedAt
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not change password."
    });
  }
};
