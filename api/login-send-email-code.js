const admin = require("./_lib/firebaseAdmin");
const { Resend } = require("resend");

const {
  getLoginChallenge,
  getCodeHash,
  createRandomCode
} = require("./_lib/securityHelpers");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const challenge = await getLoginChallenge(req);
    const uid = challenge.data.uid;
    const email = challenge.data.email || "";
    const twoFactor = challenge.data.twoFactor || {};

    if (!twoFactor.emailEnabled) {
      return res.status(400).json({ error: "Email 2FA is not enabled for this login." });
    }

    if (!email) {
      return res.status(400).json({ error: "No email address found for this account." });
    }

    const db = admin.firestore();
    const codeRef = db.collection("loginEmailCodes").doc(challenge.challengeId);
    const existingCode = await codeRef.get();

    if (existingCode.exists) {
      const data = existingCode.data();
      const lastSentAt = data.lastSentAt && data.lastSentAt.toDate ? data.lastSentAt.toDate() : null;

      if (lastSentAt && Date.now() - lastSentAt.getTime() < 60 * 1000) {
        return res.status(429).json({ error: "Please wait before requesting another code." });
      }
    }

    const code = createRandomCode();
    const salt = db.collection("_").doc().id;
    const codeHash = getCodeHash(uid, code, salt);

    await codeRef.set({
      uid,
      email,
      codeHash,
      salt,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastSentAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000))
    });

    await resend.emails.send({
      from: process.env.SECURITY_EMAIL_FROM,
      to: email,
      subject: "Your login verification code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Your Computer Shop login code</h2>
          <p>Use this code to finish signing in:</p>
          <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${code}</p>
          <p>This code expires in 10 minutes.</p>
          <p>If you did not request this, you can ignore this email.</p>
        </div>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not send login code."
    });
  }
};
