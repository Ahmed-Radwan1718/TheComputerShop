const admin = require("./_lib/firebaseAdmin");
const QRCode = require("qrcode");
const { authenticator } = require("otplib");

const {
  getUserFromRequest
} = require("./_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession
} = require("./_lib/securityUnlockHelpers");

const {
  getClientIp,
  consumeRateLimit,
  THIRTY_MINUTES_MS,
  ONE_HOUR_MS
} = require("./_lib/rateLimitHelpers");

async function hasSecurityUnlock(req, uid) {
  if (hasValidSecurityUnlockSession.length >= 2) {
    return await hasValidSecurityUnlockSession(req, uid);
  }

  return await hasValidSecurityUnlockSession(req);
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    const unlocked = await hasSecurityUnlock(req, decodedUser.uid);

    if (!unlocked) {
      return res.status(403).json({ error: "Please unlock the Security panel first." });
    }

    await consumeRateLimit({
      bucket: "setup-authenticator",
      keyParts: [decodedUser.uid, getClientIp(req)],
      firstLimit: 5,
      secondLimit: 10,
      firstLockMs: THIRTY_MINUTES_MS,
      secondLockMs: ONE_HOUR_MS,
      errorMessage: "Too many authenticator setup attempts."
    });

    const userRecord = await admin.auth().getUser(decodedUser.uid);
    const email = userRecord.email || decodedUser.email || "";

    if (!email) {
      return res.status(400).json({ error: "No email address found on this account." });
    }

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(email, "The Computer Shop", secret);
    const qrDataUrl = await QRCode.toDataURL(otpauthUrl, {
      margin: 1,
      width: 220
    });

    await admin.firestore().collection("authenticatorSetupSessions").doc(decodedUser.uid).set({
      secret,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000))
    });

    return res.status(200).json({
      success: true,
      secret,
      qrDataUrl
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not start authenticator setup."
    });
  }
};
