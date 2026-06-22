const crypto = require("crypto");
const admin = require("./_lib/firebaseAdmin");

const {
  getSessionHash,
  getUserFromRequest,
  isExpired
} = require("./_lib/securityHelpers");

function isStrongPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /[0-9]/.test(password) &&
    !/\s/.test(password)
  );
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
const decodedUser = await getUserFromRequest(req, {
  checkRevoked: true,
  requireCompletedTwoFactor: true
});
    const { unlockToken, newPassword } = req.body || {};

    if (!unlockToken) {
      return res.status(400).json({ error: "Security session expired. Please verify again." });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters and include at least 1 letter and 1 number."
      });
    }

    const db = admin.firestore();
    const sessionRef = db.collection("securityPasswordSessions").doc(decodedUser.uid);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return res.status(400).json({ error: "Security session expired. Please verify again." });
    }

    const data = sessionDoc.data();

    if (isExpired(data.expiresAt)) {
      await sessionRef.delete();
      return res.status(400).json({ error: "Security session expired. Please verify again." });
    }

    const submittedHash = getSessionHash(decodedUser.uid, unlockToken, data.salt);

    const savedBuffer = Buffer.from(data.sessionHash, "hex");
    const submittedBuffer = Buffer.from(submittedHash, "hex");

    const sessionMatches =
      savedBuffer.length === submittedBuffer.length &&
      crypto.timingSafeEqual(savedBuffer, submittedBuffer);

    if (!sessionMatches) {
      return res.status(400).json({ error: "Security session expired. Please verify again." });
    }

    await admin.auth().updateUser(decodedUser.uid, {
      password: newPassword
    });

    await sessionRef.delete();

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Could not change password." });
  }
};
