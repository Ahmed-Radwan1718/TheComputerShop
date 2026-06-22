const {
  clearSiteSessionCookie,
  clearLoginChallenge
} = require("./_lib/securityHelpers");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await clearLoginChallenge(req, res).catch(function () {});
    clearSiteSessionCookie(res);

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    clearSiteSessionCookie(res);

    return res.status(200).json({
      success: true
    });
  }
};
