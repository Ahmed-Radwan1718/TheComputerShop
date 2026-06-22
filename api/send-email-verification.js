const admin = require("./_lib/firebaseAdmin");
const { Resend } = require("resend");

const {
  getUserFromRequest
} = require("./_lib/securityHelpers");

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_EMAIL_VERIFICATION_SENDS = 5;
const EMAIL_VERIFICATION_WINDOW_MS = 30 * 60 * 1000;
const EMAIL_VERIFICATION_LOCKOUT_MS = 30 * 60 * 1000;

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

async function checkVerificationLock(db, attemptId) {
  const ref = db.collection("emailVerificationAttempts").doc(attemptId);
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
    const error = new Error("Too many verification emails requested. Please wait 30 minutes before trying again.");
    error.statusCode = 429;
    throw error;
  }

  if (resetAt && resetAt.getTime() <= Date.now()) {
    await ref.delete().catch(function () {});
  }
}

async function recordVerificationSend(db, attemptId, uid, ip) {
  const ref = db.collection("emailVerificationAttempts").doc(attemptId);
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
      new Date(Date.now() + EMAIL_VERIFICATION_WINDOW_MS)
    )
  };

  if (attempts >= MAX_EMAIL_VERIFICATION_SENDS) {
    updateData.lockedUntil = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + EMAIL_VERIFICATION_LOCKOUT_MS)
    );
  }

  await ref.set(updateData, { merge: true });

  return attempts >= MAX_EMAIL_VERIFICATION_SENDS;
}

async function sendVerificationEmail(email) {
  const verificationLink = await admin.auth().generateEmailVerificationLink(email);

  await resend.emails.send({
    from: process.env.SECURITY_EMAIL_FROM,
    to: email,
    subject: "Verify your The Computer Shop email",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Verify your email address</h2>
        <p>Please verify your email address for your The Computer Shop account.</p>
        <p>
          <a href="${verificationLink}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">
            Verify Email
          </a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p style="word-break:break-all;">${verificationLink}</p>
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
    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    const userRecord = await admin.auth().getUser(decodedUser.uid);
    const email = userRecord.email || "";

    if (!email) {
      return res.status(400).json({ error: "No email address found for this account." });
    }

    if (userRecord.emailVerified) {
      return res.status(200).json({
        success: true,
        alreadyVerified: true,
        message: "Your email is already verified."
      });
    }

    const ip = getClientIp(req);
    const attemptId = getAttemptId(decodedUser.uid, ip);

    await checkVerificationLock(db, attemptId);

    const locked = await recordVerificationSend(db, attemptId, decodedUser.uid, ip);

    if (locked) {
      return res.status(429).json({
        error: "Too many verification emails requested. Please wait 30 minutes before trying again."
      });
    }

    await sendVerificationEmail(email);

    return res.status(200).json({
      success: true,
      message: "Verification email sent. Please check your inbox and spam folder."
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not send verification email."
    });
  }
};
