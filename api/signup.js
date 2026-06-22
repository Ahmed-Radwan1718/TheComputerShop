const admin = require("./_lib/firebaseAdmin");
const { Resend } = require("resend");

const {
  createSiteSessionForUid
} = require("./_lib/securityHelpers");

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_SIGNUP_ATTEMPTS = 5;
const SIGNUP_WINDOW_MS = 30 * 60 * 1000;
const SIGNUP_LOCKOUT_MS = 30 * 60 * 1000;

function cleanEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function cleanText(value) {
  return String(value || "").trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

function getAttemptId(email, ip) {
  return Buffer.from(email + "|" + ip).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 120);
}

async function checkSignupLock(db, attemptId) {
  const ref = db.collection("signupAttempts").doc(attemptId);
  const doc = await ref.get();

  if (!doc.exists) {
    return;
  }

  const data = doc.data();
  const lockedUntil = data.lockedUntil && data.lockedUntil.toDate ? data.lockedUntil.toDate() : null;
  const resetAt = data.resetAt && data.resetAt.toDate ? data.resetAt.toDate() : null;

  if (lockedUntil && lockedUntil.getTime() > Date.now()) {
    const error = new Error("Too many signup attempts. Please wait 30 minutes before trying again.");
    error.statusCode = 429;
    throw error;
  }

  if (resetAt && resetAt.getTime() <= Date.now()) {
    await ref.delete().catch(function () {});
  }
}

async function recordSignupFailure(db, attemptId) {
  const ref = db.collection("signupAttempts").doc(attemptId);
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
    attempts,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    resetAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + SIGNUP_WINDOW_MS))
  };

  if (attempts >= MAX_SIGNUP_ATTEMPTS) {
    updateData.lockedUntil = admin.firestore.Timestamp.fromDate(new Date(Date.now() + SIGNUP_LOCKOUT_MS));
  }

  await ref.set(updateData, { merge: true });
}

async function clearSignupFailures(db, attemptId) {
  await db.collection("signupAttempts").doc(attemptId).delete().catch(function () {});
}

async function sendVerificationEmail(email) {
  const verificationLink = await admin.auth().generateEmailVerificationLink(email);

  await resend.emails.send({
    from: process.env.SECURITY_EMAIL_FROM,
    to: email,
    subject: "Verify your The Computer Shop account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Verify your email address</h2>
        <p>Thank you for creating an account with The Computer Shop.</p>
        <p>Please verify your email address using the button below:</p>
        <p>
          <a href="${verificationLink}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">
            Verify Email
          </a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p style="word-break:break-all;">${verificationLink}</p>
        <p>If you did not create this account, you can ignore this email.</p>
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
    const fullName = cleanText((req.body || {}).fullName);
    const phone = cleanText((req.body || {}).phone);
    const email = cleanEmail((req.body || {}).email);
    const password = String((req.body || {}).password || "");
    const confirmPassword = String((req.body || {}).confirmPassword || "");

    const ip = getClientIp(req);
    const attemptId = getAttemptId(email || "missing-email", ip);

    await checkSignupLock(db, attemptId);

    if (!fullName || fullName.length > 80) {
      await recordSignupFailure(db, attemptId);
      return res.status(400).json({ error: "Please enter a valid full name." });
    }

    if (!phone || phone.length > 30) {
      await recordSignupFailure(db, attemptId);
      return res.status(400).json({ error: "Please enter a valid phone number." });
    }

    if (!email || !isValidEmail(email)) {
      await recordSignupFailure(db, attemptId);
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    if (password !== confirmPassword) {
      await recordSignupFailure(db, attemptId);
      return res.status(400).json({ error: "Passwords do not match." });
    }

    if (!isStrongPassword(password)) {
      await recordSignupFailure(db, attemptId);
      return res.status(400).json({
        error: "Password must be at least 8 characters and include at least 1 letter and 1 number."
      });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName,
      phoneNumber: undefined,
      emailVerified: false,
      disabled: false
    });

    await db.collection("users").doc(userRecord.uid).set({
      fullName,
      phone,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await sendVerificationEmail(email);
    await createSiteSessionForUid(userRecord.uid, res);
    await clearSignupFailures(db, attemptId);

    return res.status(200).json({
      success: true,
      user: {
        uid: userRecord.uid,
        email,
        fullName,
        phone
      }
    });
  } catch (error) {
    const errorCode = error && error.code ? error.code : "";

    if (errorCode === "auth/email-already-exists") {
      return res.status(400).json({
        error: "An account already exists with this email address."
      });
    }

    if (errorCode === "auth/invalid-email") {
      return res.status(400).json({
        error: "Please enter a valid email address."
      });
    }

    if (errorCode === "auth/invalid-password") {
      return res.status(400).json({
        error: "Please use a stronger password."
      });
    }

    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not create account. Please try again."
    });
  }
};
