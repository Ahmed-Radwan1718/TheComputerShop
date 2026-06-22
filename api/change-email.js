const crypto = require("crypto");
const admin = require("./_lib/firebaseAdmin");
const { Resend } = require("resend");

const {
  getUserFromRequest,
  signInWithPassword,
  createSiteSessionForUid,
  getCodeHash,
  createRandomCode,
  isExpired
} = require("./_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession,
  clearSecurityUnlockSession
} = require("./_lib/securityUnlockHelpers");

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_CHANGE_COOLDOWN_MS = 90 * 24 * 60 * 60 * 1000;
const MAX_START_ATTEMPTS = 3;
const START_ATTEMPT_WINDOW_MS = 30 * 60 * 1000;
const START_LOCKOUT_MS = 30 * 60 * 1000;
const MAX_CODE_ATTEMPTS = 3;
const CODE_LOCKOUT_MS = 30 * 60 * 1000;

function cleanEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function cleanCode(code) {
  return String(code || "").replace(/\D/g, "");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getDateFromValue(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
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

async function checkStartLock(db, attemptId) {
  const ref = db.collection("emailChangeAttempts").doc(attemptId);
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
    const error = new Error("Too many email change attempts. Please wait 30 minutes before trying again.");
    error.statusCode = 429;
    throw error;
  }

  if (resetAt && resetAt.getTime() <= Date.now()) {
    await ref.delete().catch(function () {});
  }
}

async function recordStartFailure(db, attemptId, uid, ip) {
  const ref = db.collection("emailChangeAttempts").doc(attemptId);
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
      new Date(Date.now() + START_ATTEMPT_WINDOW_MS)
    )
  };

  if (attempts >= MAX_START_ATTEMPTS) {
    updateData.lockedUntil = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + START_LOCKOUT_MS)
    );
  }

  await ref.set(updateData, { merge: true });

  return attempts >= MAX_START_ATTEMPTS;
}

async function clearStartFailures(db, attemptId) {
  await db.collection("emailChangeAttempts").doc(attemptId).delete().catch(function () {});
}

async function sendEmailChangeCode(newEmail, code) {
  await resend.emails.send({
    from: process.env.SECURITY_EMAIL_FROM,
    to: newEmail,
    subject: "Confirm your new The Computer Shop email",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Confirm your new email address</h2>
        <p>Use this code to confirm this email address for your The Computer Shop account:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${code}</p>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `
  });
}

async function emailAlreadyExists(email, currentUid) {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    return userRecord.uid !== currentUid;
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return false;
    }

    throw error;
  }
}

async function handleStart(req, res, decodedUser) {
  const db = admin.firestore();
  const uid = decodedUser.uid;

  const hasSecurityUnlock = await hasValidSecurityUnlockSession(req, uid);

  if (!hasSecurityUnlock) {
    return res.status(403).json({
      error: "Security session expired. Please verify again."
    });
  }

  const currentEmail = cleanEmail((req.body || {}).currentEmail);
  const newEmail = cleanEmail((req.body || {}).newEmail);
  const currentPassword = String((req.body || {}).currentPassword || "");

  const userRecord = await admin.auth().getUser(uid);
  const savedEmail = cleanEmail(userRecord.email || "");

  if (!savedEmail) {
    return res.status(400).json({ error: "No email address found for this account." });
  }

  if (!currentEmail || currentEmail !== savedEmail) {
    return res.status(400).json({ error: "The current email address does not match your account." });
  }

  if (!newEmail || !isValidEmail(newEmail)) {
    return res.status(400).json({ error: "Please enter a valid new email address." });
  }

  if (newEmail === savedEmail) {
    return res.status(400).json({ error: "This is already your current email address." });
  }

  if (!currentPassword) {
    return res.status(400).json({ error: "Please enter your current password." });
  }

  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();
  const userData = userDoc.exists ? userDoc.data() : {};
  const lastChangedAt = getDateFromValue(userData.emailLastChangedAt);

  if (lastChangedAt) {
    const unlockAt = lastChangedAt.getTime() + EMAIL_CHANGE_COOLDOWN_MS;

    if (unlockAt > Date.now()) {
      return res.status(429).json({
        error: "You can change your email again on " + new Date(unlockAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }) + "."
      });
    }
  }

  if (await emailAlreadyExists(newEmail, uid)) {
    return res.status(400).json({
      error: "An account already exists with this email address."
    });
  }

  const ip = getClientIp(req);
  const attemptId = getAttemptId(uid, ip);

  await checkStartLock(db, attemptId);

  try {
    await signInWithPassword(savedEmail, currentPassword);
  } catch (error) {
    const locked = await recordStartFailure(db, attemptId, uid, ip);

    return res.status(locked ? 429 : 400).json({
      error: locked
        ? "Too many email change attempts. Please wait 30 minutes before trying again."
        : "The current password is incorrect."
    });
  }

  const codeRef = db.collection("emailChangeCodes").doc(uid);
  const existingCode = await codeRef.get();

  if (existingCode.exists) {
    const existingData = existingCode.data();
    const lastSentAt =
      existingData.lastSentAt && existingData.lastSentAt.toDate
        ? existingData.lastSentAt.toDate()
        : null;

    const lockedUntil =
      existingData.lockedUntil && existingData.lockedUntil.toDate
        ? existingData.lockedUntil.toDate()
        : null;

    if (lockedUntil && lockedUntil.getTime() > Date.now()) {
      return res.status(429).json({
        error: "Too many incorrect codes. Please wait 30 minutes before trying again."
      });
    }

    if (lastSentAt && Date.now() - lastSentAt.getTime() < 60 * 1000) {
      return res.status(429).json({
        error: "Please wait before requesting another email change code."
      });
    }
  }

  const code = createRandomCode();
  const salt = db.collection("_").doc().id;
  const codeHash = getCodeHash(uid, code, salt);

  await codeRef.set({
    uid,
    currentEmail: savedEmail,
    newEmail,
    codeHash,
    salt,
    attempts: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastSentAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000))
  });

  await userRef.set({
    emailChangePendingTo: newEmail,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  await sendEmailChangeCode(newEmail, code);
  await clearStartFailures(db, attemptId);

  return res.status(200).json({
    success: true,
    message: "Verification code sent to your new email address."
  });
}

async function handleConfirm(req, res, decodedUser) {
  const db = admin.firestore();
  const uid = decodedUser.uid;

  const hasSecurityUnlock = await hasValidSecurityUnlockSession(req, uid);

  if (!hasSecurityUnlock) {
    return res.status(403).json({
      error: "Security session expired. Please verify again."
    });
  }

  const code = cleanCode((req.body || {}).code);

  if (!code || code.length !== 6) {
    return res.status(400).json({ error: "Please enter the 6-digit email verification code." });
  }

  const codeRef = db.collection("emailChangeCodes").doc(uid);
  const codeDoc = await codeRef.get();

  if (!codeDoc.exists) {
    return res.status(400).json({ error: "Please request a new email verification code." });
  }

  const data = codeDoc.data();

  const lockedUntil =
    data.lockedUntil && data.lockedUntil.toDate
      ? data.lockedUntil.toDate()
      : null;

  if (lockedUntil && lockedUntil.getTime() > Date.now()) {
    return res.status(429).json({
      error: "Too many incorrect codes. Please wait 30 minutes before trying again."
    });
  }

  if (isExpired(data.expiresAt)) {
    await codeRef.delete().catch(function () {});
    return res.status(400).json({ error: "This verification code expired. Please request a new one." });
  }

  const submittedHash = getCodeHash(uid, code, data.salt);

  const savedBuffer = Buffer.from(data.codeHash || "", "hex");
  const submittedBuffer = Buffer.from(submittedHash, "hex");

  const codeMatches =
    savedBuffer.length === submittedBuffer.length &&
    crypto.timingSafeEqual(savedBuffer, submittedBuffer);

  if (!codeMatches) {
    const nextAttempts = Number(data.attempts || 0) + 1;

    const updateData = {
      attempts: nextAttempts,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (nextAttempts >= MAX_CODE_ATTEMPTS) {
      updateData.lockedUntil = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + CODE_LOCKOUT_MS)
      );
    }

    await codeRef.set(updateData, { merge: true });

    return res.status(nextAttempts >= MAX_CODE_ATTEMPTS ? 429 : 400).json({
      error: nextAttempts >= MAX_CODE_ATTEMPTS
        ? "Too many incorrect codes. Please wait 30 minutes before trying again."
        : "The email verification code is incorrect."
    });
  }

  const newEmail = cleanEmail(data.newEmail);

  if (!newEmail || !isValidEmail(newEmail)) {
    await codeRef.delete().catch(function () {});
    return res.status(400).json({ error: "Invalid email change request. Please start again." });
  }

  if (await emailAlreadyExists(newEmail, uid)) {
    await codeRef.delete().catch(function () {});
    return res.status(400).json({
      error: "An account already exists with this email address."
    });
  }

  await admin.auth().updateUser(uid, {
    email: newEmail,
    emailVerified: true
  });

  await db.collection("users").doc(uid).set({
    email: newEmail,
    emailLastChangedAt: admin.firestore.FieldValue.serverTimestamp(),
    emailChangePendingTo: admin.firestore.FieldValue.delete(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  await codeRef.delete().catch(function () {});

  await admin.auth().revokeRefreshTokens(uid);
  await createSiteSessionForUid(uid, res);
  await clearSecurityUnlockSession(req, res);

  return res.status(200).json({
    success: true,
    email: newEmail
  });
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

    const action = String((req.body || {}).action || "").trim();

    if (action === "start") {
      return await handleStart(req, res, decodedUser);
    }

    if (action === "confirm") {
      return await handleConfirm(req, res, decodedUser);
    }

    return res.status(400).json({ error: "Invalid email change request." });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not change email address."
    });
  }
};
