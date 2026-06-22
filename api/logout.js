const {
  clearSiteSessionCookie,
  clearLoginChallenge,
  clearLoginTwoFactorCookie
} = require("./_lib/securityHelpers");

const {
  clearSecurityUnlockSession
} = require("./_lib/securityUnlockHelpers");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await clearLoginChallenge(req, res).catch(function () {});
    await clearSecurityUnlockSession(req, res).catch(function () {});
    clearLoginTwoFactorCookie(res);
    clearSiteSessionCookie(res);

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    clearLoginTwoFactorCookie(res);
    clearSiteSessionCookie(res);

    return res.status(200).json({
      success: true
    });
  }
};
