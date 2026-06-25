const admin = require("../_lib/firebaseAdmin");
const { Resend } = require("resend");

const {
  getCodeHash,
  createRandomCode,
  createLoginChallenge,
  getLoginChallenge
} = require("../_lib/securityHelpers");

const {
  getClientIp,
  consumeRateLimit,
  THIRTY_MINUTES_MS,
  ONE_HOUR_MS
} = require("../_lib/rateLimitHelpers");

const resend = new Resend(process.env.RESEND_API_KEY);

function cleanEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function maskEmail(email) {
  const cleanValue = cleanEmail(email);
  const parts = cleanValue.split("@");

  if (parts.length !== 2) {
    return cleanValue || "your email";
  }

  const name = parts[0];
  const domain = parts[1];
  const visibleName = name.length <= 2 ? name.charAt(0) : name.slice(0, 2);

  return visibleName + "***@" + domain;
}

function getChallengeId(challenge) {
  return String(
    challenge.challengeId ||
    challenge.id ||
    challenge.sessionId ||
    challenge.uid ||
    ""
  ).trim();
}

function getSafeTwoFactorSettings(userData) {
  const twoFactor = userData && userData.twoFactor && typeof userData.twoFactor === "object"
    ? userData.twoFactor
    : {};

  return {
    appEnabled: Boolean(twoFactor.appEnabled),
    emailEnabled: Boolean(twoFactor.emailEnabled)
  };
}

async function consumeEmailSendLimit(req, email, bucket) {
  await consumeRateLimit({
    bucket,
    keyParts: [email, getClientIp(req)],
    firstLimit: 5,
    secondLimit: 10,
    firstLockMs: THIRTY_MINUTES_MS,
    secondLockMs: ONE_HOUR_MS,
    errorMessage: "Too many login email codes requested."
  });
}

async function createAndSendCode(req, options) {
  const uid = options.uid;
  const email = options.email;
  const challengeId = options.challengeId;
  const bucket = options.bucket;

  await consumeEmailSendLimit(req, email, bucket);

  const db = admin.firestore();
  const codeRef = db.collection("loginEmailCodes").doc(challengeId);
  const existingCode = await codeRef.get();

  if (existingCode.exists) {
    const data = existingCode.data() || {};
    const lastSentAt = data.lastSentAt && data.lastSentAt.toDate ? data.lastSentAt.toDate() : null;

    if (lastSentAt && Date.now() - lastSentAt.getTime() < 60 * 1000) {
      const error = new Error("Please wait before requesting another code.");
      error.statusCode = 429;
      throw error;
    }
  }

  const code = createRandomCode();
  const salt = db.collection("_").doc().id;
  const codeHash = getCodeHash(uid, code, salt);

  await codeRef.set({
    uid,
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
}

async function sendPasswordlessCode(req, res, email) {
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  let userRecord = null;

  try {
    userRecord = await admin.auth().getUserByEmail(email);
  } catch (error) {
    if (error.code !== "auth/user-not-found") {
      throw error;
    }
  }

  if (!userRecord || !userRecord.uid) {
    await consumeEmailSendLimit(req, email, "passwordless-login-email-code-send");

    return res.status(200).json({
      success: true,
      passwordless: true,
      maskedEmail: maskEmail(email),
      methods: {
        app: false,
        email: true
      }
    });
  }

  const userDoc = await admin.firestore().collection("users").doc(userRecord.uid).get();
  const userData = userDoc.exists ? userDoc.data() || {} : {};
  const twoFactor = getSafeTwoFactorSettings(userData);

  const challenge = await createLoginChallenge(userRecord.uid, res, {
    email: userRecord.email || email,
    mode: "passwordless",
    twoFactor
  });

  const challengeId = getChallengeId(challenge);

  if (!challengeId) {
    return res.status(400).json({ error: "Please restart login and try again." });
  }

  await createAndSendCode(req, {
    uid: userRecord.uid,
    email: userRecord.email || email,
    challengeId,
    bucket: "passwordless-login-email-code-send"
  });

  return res.status(200).json({
    success: true,
    passwordless: true,
    maskedEmail: maskEmail(userRecord.email || email),
    methods: {
      app: twoFactor.appEnabled,
      email: true
    }
  });
}

async function sendTwoFactorEmailCode(req, res) {
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

  await createAndSendCode(req, {
    uid: challenge.uid,
    email,
    challengeId,
    bucket: "login-email-code-send"
  });

  return res.status(200).json({
    success: true,
    maskedEmail: maskEmail(email)
  });
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const email = cleanEmail((req.body || {}).email);

    if (email) {
      return await sendPasswordlessCode(req, res, email);
    }

    return await sendTwoFactorEmailCode(req, res);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not send login email code."
    });
  }
};
