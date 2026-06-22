const {
  getUserFromRequest
} = require("./_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession
} = require("./_lib/securityUnlockHelpers");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    const unlocked = await hasValidSecurityUnlockSession(req, decodedUser.uid);

    return res.status(200).json({
      success: true,
      unlocked
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      unlocked: false
    });
  }
};
