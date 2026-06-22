const crypto = require("crypto");
const admin = require("./_lib/firebaseAdmin");

const {
  getCodeHash,
  getSessionHash,
  createRandomToken,
  getUserFromRequest,
  isExpired,
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
      return res.status(400).json({ error: "Please enter the security code." });
    }

    const db = admin.firestore();
    const codeRef = db.collection("securityPasswordCodes").doc(decodedUser.uid);
    const codeDoc = await codeRef.get();

    if (!codeDoc.exists) {
      return res.status(400).json({ error: "Please request a new security code." });
    }

    const data = codeDoc.data();

    if (isExpired(data.expiresAt)) {
      await codeRef.delete();
      return res.status(400).json({ error: "This security code expired. Please request a new one." });
    }

    if ((data.attempts || 0) >= 5) {
      await codeRef.delete();
      return res.status(400).json({ error: "Too many attempts. Please request a new code." });
    }

    const submittedHash = getCodeHash(decodedUser.uid, code.trim(), data.salt);

    const savedBuffer = Buffer.from(data.codeHash, "hex");
    const submittedBuffer = Buffer.from(submittedHash, "hex");

    const codeMatches =
      savedBuffer.length === submittedBuffer.length &&
      crypto.timingSafeEqual(savedBuffer, submittedBuffer);

    if (!codeMatches) {
      await codeRef.update({
        attempts: admin.firestore.FieldValue.increment(1)
      });

      return res.status(400).json({ error: "The security code is incorrect." });
    }

    if (data.reason === "login-email") {
  await createLoginTwoFactorSession(decodedUser.uid, res);
  await codeRef.delete();

  return res.status(200).json({
    success: true
  });
}

    const unlockToken = createRandomToken();
    const sessionSalt = admin.firestore().collection("_").doc().id;
    const sessionHash = getSessionHash(decodedUser.uid, unlockToken, sessionSalt);

    await db.collection("securityPasswordSessions").doc(decodedUser.uid).set({
      sessionHash,
      salt: sessionSalt,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 60 * 1000))
    });

    await codeRef.delete();

    return res.status(200).json({
      success: true,
      unlockToken
    });
  } catch (error) {
    return res.status(500).json({ error: "Could not verify security code." });
  }
};
