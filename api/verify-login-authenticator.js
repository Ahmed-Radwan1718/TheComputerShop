const admin = require("./_lib/firebaseAdmin");
const { authenticator } = require("otplib");

const {
  getUserFromRequest,
  createLoginTwoFactorSession
} = require("./_lib/securityHelpers");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const decodedUser = await getUserFromRequest(req);
    const { code } = req.body || {};

    if (!code) {
      return res.status(400).json({ error: "Please enter the authenticator code." });
    }

    const db = admin.firestore();
    const userDoc = await db.collection("users").doc(decodedUser.uid).get();

    if (!userDoc.exists) {
      return res.status(400).json({ error: "No 2FA settings found for this account." });
    }

    const twoFactor = userDoc.data().twoFactor || {};

    if (!twoFactor.appEnabled || !twoFactor.appSecret) {
      return res.status(400).json({ error: "Authenticator app is not enabled for this account." });
    }

    authenticator.options = { window: 1 };

    const verified = authenticator.verify({
      token: String(code).replace(/\D/g, ""),
      secret: twoFactor.appSecret
    });

    if (!verified) {
      return res.status(400).json({ error: "The authenticator code is incorrect." });
    }

await createLoginTwoFactorSession(decodedUser.uid, res);

return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Could not verify authenticator code." });
  }
};
