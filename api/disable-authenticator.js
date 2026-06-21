const admin = require("./_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("./_lib/securityHelpers");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const decodedUser = await getUserFromRequest(req);
    const db = admin.firestore();
    const userRef = db.collection("users").doc(decodedUser.uid);
    const userDoc = await userRef.get();
    const existingTwoFactor = userDoc.exists && userDoc.data().twoFactor ? userDoc.data().twoFactor : {};

    delete existingTwoFactor.appSecret;

    await userRef.set({
      twoFactor: {
        ...existingTwoFactor,
        appEnabled: false,
        appDisabledAt: admin.firestore.FieldValue.serverTimestamp()
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Could not disable authenticator app." });
  }
};
