const admin = require("./_lib/firebaseAdmin");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_RESET_ATTEMPTS = 5;
const RESET_WINDOW_MS = 30 * 60 * 1000;
const RESET_LOCKOUT_MS = 30 * 60 * 1000;

function cleanEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : "unknown";
}

function getAttemptId(email, ip) {
  return Buffer.from(email + "|" + ip)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 120);
}

async function checkResetLock(db, attemptId) {
  const ref = db.collection("passwordResetAttempts").doc(attemptId);
  const doc = await ref.get();

  if (!doc.exists) {
    return;
  }

  const data = doc.data();
  const lockedUntil = data.lockedUntil && data.lockedUntil.toDate ? data.lockedUntil.toDate() : null;
  const resetAt = data.resetAt && data.resetAt.toDate ? data.resetAt.toDate() : null;

  if (lockedUntil && lockedUntil.getTime() > Date.now()) {
    const error = new Error("Too many password reset attempts. Please wait 30 minutes before trying again.");
    error.statusCode = 429;
    throw error;
  }

  if (resetAt && resetAt.getTime() <= Date.now()) {
    await ref.delete().catch(function () {});
  }
}

async function recordResetAttempt(db, attemptId, email, ip) {
  const ref = db.collection("passwordResetAttempts").doc(attemptId);
  const doc = await ref.get();

  let attempts = 1;

  if (doc.exists) {
    const data = doc.data();
    const resetAt = data.resetAt && data.resetAt.toDate ? data.resetAt.toDate() : null;

    if (resetAt && resetAt.getTime() > Date.now()) {
      attempts = Number(data.attempts || 0) + 1;
    }
  }

  const updateData = {
    email,
    ip,
    attempts,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    resetAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + RESET_WINDOW_MS))
  };

  if (attempts >= MAX_RESET_ATTEMPTS) {
    updateData.lockedUntil = admin.firestore.Timestamp.fromDate(new Date(Date.now() + RESET_LOCKOUT_MS));
  }

  await ref.set(updateData, { merge: true });

  return attempts >= MAX_RESET_ATTEMPTS;
}

async function sendPasswordResetEmail(email) {
  const resetLink = await admin.auth().generatePasswordResetLink(email);

  await resend.emails.send({
    from: process.env.SECURITY_EMAIL_FROM,
    to: email,
    subject: "Reset your The Computer Shop password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Reset your password</h2>
        <p>We received a request to reset your The Computer Shop account password.</p>
        <p>Use the button below to choose a new password:</p>
        <p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">
            Reset Password
          </a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p style="word-break:break-all;">${resetLink}</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = admin.firestore();

  try {
    const email = cleanEmail((req.body || {}).email);
    const ip = getClientIp(req);
    const attemptId = getAttemptId(email || "missing-email", ip);

    await checkResetLock(db, attemptId);

    if (!email || !isValidEmail(email)) {
      await recordResetAttempt(db, attemptId, email || "invalid-email", ip);
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const locked = await recordResetAttempt(db, attemptId, email, ip);

    if (locked) {
      return res.status(429).json({
        error: "Too many password reset attempts. Please wait 30 minutes before trying again."
      });
    }

    try {
      await admin.auth().getUserByEmail(email);
      await sendPasswordResetEmail(email);
    } catch (error) {
      // Do not reveal whether the email exists.
    }

    return res.status(200).json({
      success: true,
      message: "If an account exists with this email address, a password reset link has been sent."
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not process password reset request."
    });
  }
};
