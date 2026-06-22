const admin = require("./_lib/firebaseAdmin");
const { authenticator } = require("otplib");
const QRCode = require("qrcode");

const {
  getUserFromRequest
} = require("./_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession
} = require("./_lib/securityUnlockHelpers");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    const hasSecurityUnlock = await hasValidSecurityUnlockSession(req, decodedUser.uid);

    if (!hasSecurityUnlock) {
      return res.status(403).json({
        error: "Security session expired. Please verify again."
      });
    }

    const userRecord = await admin.auth().getUser(decodedUser.uid);
    const email = userRecord.email || decodedUser.email || "";

    if (!email) {
      return res.status(400).json({ error: "No email address found for this account." });
    }

    const db = admin.firestore();
    const secret = authenticator.generateSecret();
    const issuer = "The Computer Shop";
    const label = email;

    const otpauthUrl = authenticator.keyuri(label, issuer, secret);
    const qrDataUrl = await QRCode.toDataURL(otpauthUrl);

    await db.collection("authenticatorSetupSessions").doc(decodedUser.uid).set({
      uid: decodedUser.uid,
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
