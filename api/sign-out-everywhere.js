const admin = require("./_lib/firebaseAdmin");

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

    await admin.auth().revokeRefreshTokens(decodedUser.uid);

    const db = admin.firestore();

    await Promise.all([
      db.collection("securityPasswordSessions").doc(decodedUser.uid).delete().catch(function () {}),
      db.collection("securityPasswordCodes").doc(decodedUser.uid).delete().catch(function () {})
    ]);

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Could not sign out from all devices." });
  }
};
