const crypto = require("crypto");
const admin = require("./_lib/firebaseAdmin");

const {
  getCodeHash,
  getUserFromRequest,
  isExpired
} = require("./_lib/securityHelpers");

const {
  createSecurityUnlockSession
} = require("./_lib/securityUnlockHelpers");

function cleanCode(code) {
  return String(code || "").replace(/\D/g, "");
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

    const code = cleanCode((req.body || {}).code);

    if (!code || code.length !== 6) {
      return res.status(400).json({ error: "Please enter the 6-digit security code." });
    }

    const db = admin.firestore();
    const codeRef = db.collection("securityPasswordCodes").doc(decodedUser.uid);
    const codeDoc = await codeRef.get();

    if (!codeDoc.exists) {
      return res.status(400).json({ error: "Please request a new security code." });
    }

    const data = codeDoc.data();

    if (data.reason !== "security-panel") {
      await codeRef.delete().catch(function () {});
      return res.status(400).json({ error: "Invalid security code." });
    }

    if (isExpired(data.expiresAt)) {
      await codeRef.delete().catch(function () {});
      return res.status(400).json({ error: "This security code expired. Please request a new one." });
    }

    if ((data.attempts || 0) >= 3) {
      await codeRef.delete().catch(function () {});
      return res.status(429).json({
        error: "Too many incorrect codes. Please request a new code after 30 minutes."
      });
    }

    const submittedHash = getCodeHash(decodedUser.uid, code, data.salt);

    const savedBuffer = Buffer.from(data.codeHash || "", "hex");
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

    const unlockSession = await createSecurityUnlockSession(decodedUser.uid, res);

    await codeRef.delete().catch(function () {});

    return res.status(200).json({
      success: true,
      unlockUntil: unlockSession.unlockUntil
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Could not verify security code."
    });
  }
};
