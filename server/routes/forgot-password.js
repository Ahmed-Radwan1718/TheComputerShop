const admin = require("../_lib/firebaseAdmin");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const WINDOW_MS = 30 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function cleanEmail(value) {
  return String(value || "").trim().toLowerCase().slice(0, 160);
}

function timestampToMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

async function checkRateLimit(email) {
  const db = admin.firestore();
  const ref = db.collection("passwordResetAttempts").doc(email.replace(/[^\w.-]/g, "_"));
  const doc = await ref.get();
  const data = doc.exists ? doc.data() || {} : {};

  const windowStartedAtMs = timestampToMillis(data.windowStartedAt);

  if (windowStartedAtMs && Date.now() - windowStartedAtMs < WINDOW_MS && Number(data.count || 0) >= MAX_ATTEMPTS) {
    const error = new Error("Too many reset requests. Please try again later.");
    error.statusCode = 429;
    throw error;
  }

  const oldWindow = !windowStartedAtMs || Date.now() - windowStartedAtMs >= WINDOW_MS;

  await ref.set({
    count: oldWindow ? 1 : Number(data.count || 0) + 1,
    windowStartedAt: oldWindow ? admin.firestore.FieldValue.serverTimestamp() : data.windowStartedAt,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const email = cleanEmail((req.body || {}).email);

    if (!email) {
      return res.status(400).json({ error: "Please enter your email address." });
    }

    await checkRateLimit(email);

    try {
      await admin.auth().getUserByEmail(email);

      const resetLink = await admin.auth().generatePasswordResetLink(email);

      await resend.emails.send({
        from: process.env.SECURITY_EMAIL_FROM,
        to: email,
        subject: "Reset your Computer Shop password",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Reset your password</h2>
            <p>Click the button below to reset your Computer Shop password.</p>
            <p>
              <a href="${resetLink}" style="display: inline-block; padding: 12px 18px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px;">
                Reset Password
              </a>
            </p>
            <p>If the button does not work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${resetLink}</p>
            <p>If you did not request this, you can ignore this email.</p>
          </div>
        `
      });
    } catch (error) {
      // Do not reveal whether the account exists.
    }

    return res.status(200).json({
      success: true,
      message: "If an account exists with that email, a reset link has been sent."
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not send password reset email."
    });
  }
};
