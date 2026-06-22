const admin = require("./_lib/firebaseAdmin");

const {
  getUserFromRequest,
  signInWithPassword,
  createSiteSessionForUid
} = require("./_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession,
  clearSecurityUnlockSession
} = require("./_lib/securityUnlockHelpers");

const MAX_PASSWORD_ATTEMPTS = 3;
const PASSWORD_ATTEMPT_WINDOW_MS = 30 * 60 * 1000;
const PASSWORD_LOCKOUT_MS = 30 * 60 * 1000;

function isStrongPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /[0-9]/.test(password) &&
    !/\s/.test(password)
  );
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : "unknown";
}

function getAttemptId(uid, ip) {
  return Buffer.from(uid + "|" + ip)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 120);
}

async function checkPasswordChangeLock(db, attemptId) {
  const ref = db.collection("passwordChangeAttempts").doc(attemptId);
  const doc = await ref.get();

  if (!doc.exists) {
    return;
  }

  const data = doc.data();
  const lockedUntil =
    data.lockedUntil && data.lockedUntil.toDate
      ? data.lockedUntil.toDate()
      : null;

  const resetAt =
    data.resetAt && data.resetAt.toDate
      ? data.resetAt.toDate()
      : null;

  if (lockedUntil && lockedUntil.getTime() > Date.now()) {
    const error = new Error("Too many incorrect password attempts. Please wait 30 minutes before trying again.");
    error.statusCode = 429;
    throw error;
  }

  if (resetAt && resetAt.getTime() <= Date.now()) {
    await ref.delete().catch(function () {});
  }
}

async function recordPasswordChangeFailure(db, attemptId, uid, ip) {
  const ref = db.collection("passwordChangeAttempts").doc(attemptId);
  const doc = await ref.get();

  let attempts = 1;

  if (doc.exists) {
    const data = doc.data();
    const resetAt =
      data.resetAt && data.resetAt.toDate
        ? data.resetAt.toDate()
        : null;

    if (resetAt && resetAt.getTime() > Date.now()) {
      attempts = Number(data.attempts || 0) + 1;
    }
  }

  const updateData = {
    uid,
    ip,
    attempts,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    resetAt: admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + PASSWORD_ATTEMPT_WINDOW_MS)
    )
  };

  if (attempts >= MAX_PASSWORD_ATTEMPTS) {
    updateData.lockedUntil = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + PASSWORD_LOCKOUT_MS)
    );
  }

  await ref.set(updateData, { merge: true });

  return attempts >= MAX_PASSWORD_ATTEMPTS;
}

async function clearPasswordChangeFailures(db, attemptId) {
  await db.collection("passwordChangeAttempts").doc(attemptId).delete().catch(function () {});
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = admin.firestore();

  try {
    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    const currentPassword = String((req.body || {}).currentPassword || "");
    const newPassword = String((req.body || {}).newPassword || "");

    if (!currentPassword) {
      return res.status(400).json({ error: "Please enter your current password." });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters and include at least 1 letter and 1 number, with no spaces."
      });
    }

    const hasSecurityUnlock = await hasValidSecurityUnlockSession(req, decodedUser.uid);

    if (!hasSecurityUnlock) {
      return res.status(403).json({
        error: "Security session expired. Please verify again."
      });
    }

    const userRecord = await admin.auth().getUser(decodedUser.uid);
    const email = userRecord.email || decodedUser.email || "";

    if (!email) {
      return res.status(400).json({ error: "No email address found for this account." });
    }

    const ip = getClientIp(req);
    const attemptId = getAttemptId(decodedUser.uid, ip);

    await checkPasswordChangeLock(db, attemptId);

    try {
      await signInWithPassword(email, currentPassword);
    } catch (error) {
      const locked = await recordPasswordChangeFailure(db, attemptId, decodedUser.uid, ip);

      return res.status(locked ? 429 : 400).json({
        error: locked
          ? "Too many incorrect password attempts. Please wait 30 minutes before trying again."
          : "The current password is incorrect."
      });
    }

    await admin.auth().updateUser(decodedUser.uid, {
      password: newPassword
    });

    await clearPasswordChangeFailures(db, attemptId);

    await admin.auth().revokeRefreshTokens(decodedUser.uid);
    await createSiteSessionForUid(decodedUser.uid, res);
    await clearSecurityUnlockSession(req, res);

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not change password."
    });
  }
};
