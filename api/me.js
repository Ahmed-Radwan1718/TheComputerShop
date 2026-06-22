const admin = require("./_lib/firebaseAdmin");

const {
  getOptionalSiteSessionUser
} = require("./_lib/securityHelpers");

function getFirstName(fullName) {
  return String(fullName || "").trim().split(/\s+/)[0] || "";
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const decodedUser = await getOptionalSiteSessionUser(req, {
      checkRevoked: true
    });

    if (!decodedUser) {
      return res.status(200).json({
        signedIn: false
      });
    }

    const db = admin.firestore();
    const userDoc = await db.collection("users").doc(decodedUser.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    const twoFactor = userData.twoFactor || {};

    const userRecord = await admin.auth().getUser(decodedUser.uid);

    return res.status(200).json({
      signedIn: true,
      user: {
        uid: decodedUser.uid,
        email: userRecord.email || userData.email || "",
        emailVerified: Boolean(userRecord.emailVerified),
        fullName: userData.fullName || "",
        firstName: getFirstName(userData.fullName || ""),
        phone: userData.phone || "",
        isAdmin: userRecord.email === "ahmedradwan21@gmail.com",
        twoFactor: {
          appEnabled: Boolean(twoFactor.appEnabled),
          emailEnabled: Boolean(twoFactor.emailEnabled)
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      signedIn: false,
      error: "Could not load account session."
    });
  }
};
