const admin = require("./_lib/firebaseAdmin");
const QRCode = require("qrcode");
const { authenticator } = require("otplib");

const {
  getUserFromRequest
} = require("./_lib/securityHelpers");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
const decodedUser = await getUserFromRequest(req, {
  checkRevoked: true,
  requireCompletedTwoFactor: true
});

    if (!decodedUser.email) {
      return res.status(400).json({ error: "No email address found on this account." });
    }

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(decodedUser.email, "The Computer Shop", secret);
    const qrDataUrl = await QRCode.toDataURL(otpauthUrl, {
      margin: 1,
      width: 220
    });

    const db = admin.firestore();

    await db.collection("authenticatorSetupSessions").doc(decodedUser.uid).set({
      secret,
      email: decodedUser.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000))
    });

    return res.status(200).json({
      success: true,
      secret,
      qrDataUrl
    });
  } catch (error) {
    return res.status(500).json({ error: "Could not start authenticator setup." });
  }
};
