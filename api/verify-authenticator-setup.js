const admin = require("./_lib/firebaseAdmin");
const { authenticator } = require("otplib");

const {
  getUserFromRequest,
  isExpired
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
    const setupRef = db.collection("authenticatorSetupSessions").doc(decodedUser.uid);
    const setupDoc = await setupRef.get();

    if (!setupDoc.exists) {
      return res.status(400).json({ error: "Authenticator setup expired. Please start again." });
    }

    const setupData = setupDoc.data();

    if (isExpired(setupData.expiresAt)) {
      await setupRef.delete();
      return res.status(400).json({ error: "Authenticator setup expired. Please start again." });
    }

    authenticator.options = { window: 1 };

    const verified = authenticator.verify({
      token: String(code).replace(/\D/g, ""),
      secret: setupData.secret
    });

    if (!verified) {
      return res.status(400).json({ error: "The authenticator code is incorrect." });
    }

    const userRef = db.collection("users").doc(decodedUser.uid);
    const userDoc = await userRef.get();
    const existingTwoFactor = userDoc.exists && userDoc.data().twoFactor ? userDoc.data().twoFactor : {};

    await userRef.set({
      twoFactor: {
        ...existingTwoFactor,
        appEnabled: true,
        appSecret: setupData.secret,
        appEnabledAt: admin.firestore.FieldValue.serverTimestamp()
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await setupRef.delete();

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Could not verify authenticator setup." });
  }
};
