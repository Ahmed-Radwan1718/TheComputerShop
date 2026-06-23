const admin = require("./_lib/firebaseAdmin");
const { Resend } = require("resend");

const {
  getCodeHash,
  createRandomCode,
  getLoginChallenge
} = require("./_lib/securityHelpers");

const {
  getClientIp,
  consumeRateLimit,
  THIRTY_MINUTES_MS,
  ONE_HOUR_MS
} = require("./_lib/rateLimitHelpers");

const resend = new Resend(process.env.RESEND_API_KEY);

function getChallengeId(challenge) {
  return String(
    challenge.challengeId ||
    challenge.id ||
    challenge.sessionId ||
    challenge.uid ||
    ""
  ).trim();
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const challenge = await getLoginChallenge(req);

    if (!challenge || !challenge.uid) {
      return res.status(401).json({ error: "Please log in again." });
    }

    const twoFactor = challenge.twoFactor || {};

    if (!twoFactor.emailEnabled) {
      return res.status(400).json({ error: "Email verification is not enabled for this login." });
    }

    const userRecord = await admin.auth().getUser(challenge.uid);
    const email = userRecord.email || challenge.email || "";

    if (!email) {
      return res.status(400).json({ error: "No email address found on this account." });
    }

    const challengeId = getChallengeId(challenge);

    if (!challengeId) {
      return res.status(400).json({ error: "Please restart login and try again." });
    }

    const db = admin.firestore();
    const codeRef = db.collection("loginEmailCodes").doc(challengeId);
    const existingCode = await codeRef.get();

    if (existingCode.exists) {
      const data = existingCode.data() || {};
      const lastSentAt = data.lastSentAt && data.lastSentAt.toDate ? data.lastSentAt.toDate() : null;

      if (lastSentAt && Date.now() - lastSentAt.getTime() < 60 * 1000) {
        return res.status(429).json({ error: "Please wait before requesting another code." });
      }
    }

    await consumeRateLimit({
      bucket: "login-email-code-send",
      keyParts: [email, getClientIp(req)],
      firstLimit: 5,
      secondLimit: 10,
      firstLockMs: THIRTY_MINUTES_MS,
      secondLockMs: ONE_HOUR_MS,
      errorMessage: "Too many login email codes requested."
    });

    const code = createRandomCode();
    const salt = db.collection("_").doc().id;
    const codeHash = getCodeHash(challenge.uid, code, salt);

    await codeRef.set({
      uid: challenge.uid,
      challengeId,
      codeHash,
      salt,
      attempts: 0,
      email,
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
      error: error.message || "Could not send login email code."
    });
  }
};
