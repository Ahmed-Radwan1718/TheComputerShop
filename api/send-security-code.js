const admin = require("./_lib/firebaseAdmin");
const { Resend } = require("resend");

const {
  getCodeHash,
  createRandomCode,
  getUserFromRequest
} = require("./_lib/securityHelpers");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
const { reason } = req.body || {};

const decodedUser = await getUserFromRequest(req, {
  checkRevoked: true,
  requireCompletedTwoFactor: !isLoginCode
});

    if (!decodedUser.email) {
      return res.status(400).json({ error: "No email address found on this account." });
    }

    const db = admin.firestore();
    const codeRef = db.collection("securityPasswordCodes").doc(decodedUser.uid);
    const existingCode = await codeRef.get();

    if (existingCode.exists) {
      const data = existingCode.data();
      const lastSentAt = data.lastSentAt && data.lastSentAt.toDate ? data.lastSentAt.toDate() : null;

      if (lastSentAt && Date.now() - lastSentAt.getTime() < 60 * 1000) {
        return res.status(429).json({ error: "Please wait before requesting another code." });
      }
    }

    const code = createRandomCode();
    const salt = admin.firestore().collection("_").doc().id;
    const codeHash = getCodeHash(decodedUser.uid, code, salt);

    const isLoginCode = reason === "login-email";

    await codeRef.set({
      codeHash,
      salt,
      attempts: 0,
      email: decodedUser.email,
      reason: isLoginCode ? "login-email" : "security-panel",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastSentAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000))
    });

    await resend.emails.send({
      from: process.env.SECURITY_EMAIL_FROM,
      to: decodedUser.email,
      subject: isLoginCode ? "Your login verification code" : "Your security code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>${isLoginCode ? "Your Computer Shop login code" : "Your Computer Shop security code"}</h2>
          <p>${isLoginCode ? "Use this code to finish signing in:" : "Use this code to unlock your Security panel:"}</p>
          <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${code}</p>
          <p>This code expires in 10 minutes.</p>
          <p>If you did not request this, you can ignore this email.</p>
        </div>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Could not send security code." });
  }
};
