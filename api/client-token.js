const admin = require("./_lib/firebaseAdmin");

const {
  getSiteSessionUser
} = require("./_lib/securityHelpers");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const decodedUser = await getSiteSessionUser(req, {
      checkRevoked: true
    });

    const customToken = await admin.auth().createCustomToken(decodedUser.uid);

    return res.status(200).json({
      success: true,
      customToken
    });
  } catch (error) {
    return res.status(401).json({
      error: "Not signed in."
    });
  }
};
