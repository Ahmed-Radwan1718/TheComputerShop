const admin = require("../_lib/firebaseAdmin");
const { Resend } = require("resend");

const {
  getUserFromRequest
} = require("../_lib/securityHelpers");

const {
  getClientIp,
  consumeRateLimit,
  THIRTY_MINUTES_MS,
  ONE_HOUR_MS
} = require("../_lib/rateLimitHelpers");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    const userRecord = await admin.auth().getUser(decodedUser.uid);
    const email = userRecord.email || decodedUser.email || "";

    if (!email) {
      return res.status(400).json({ error: "No email address found on this account." });
    }

    if (userRecord.emailVerified) {
      return res.status(200).json({
        success: true,
        alreadyVerified: true
      });
    }

    const db = admin.firestore();
    const sendRef = db.collection("emailVerificationAttempts").doc(decodedUser.uid);
    const sendDoc = await sendRef.get();

    if (sendDoc.exists) {
      const data = sendDoc.data() || {};
      const lastSentAt = data.lastSentAt && data.lastSentAt.toDate ? data.lastSentAt.toDate() : null;

      if (lastSentAt && Date.now() - lastSentAt.getTime() < 60 * 1000) {
        return res.status(429).json({ error: "Please wait before requesting another verification email." });
      }
    }

    await consumeRateLimit({
      bucket: "email-verification-send",
      keyParts: [decodedUser.uid, getClientIp(req)],
      firstLimit: 5,
      secondLimit: 10,
      firstLockMs: THIRTY_MINUTES_MS,
      secondLockMs: ONE_HOUR_MS,
      errorMessage: "Too many verification emails requested."
    });

    const verificationLink = await admin.auth().generateEmailVerificationLink(email);

    await sendRef.set({
      email,
      lastSentAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await resend.emails.send({
      from: process.env.SECURITY_EMAIL_FROM,
      to: email,
      subject: "Verify your Computer Shop email",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Verify your email address</h2>
          <p>Click the button below to verify your Computer Shop account email.</p>
          <p>
            <a href="${verificationLink}" style="display: inline-block; padding: 12px 18px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px;">
              Verify Email
            </a>
          </p>
          <p>If the button does not work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${verificationLink}</p>
          <p>If you did not request this, you can ignore this email.</p>
        </div>
      `
    });

    return res.status(200).json({
      success: true,
      alreadyVerified: false
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not send verification email."
    });
  }
};
