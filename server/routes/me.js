const admin = require("../_lib/firebaseAdmin");

const {
  getOptionalSiteSessionUser,
  getUserFromRequest
} = require("../_lib/securityHelpers");

function getFirstName(fullName, email) {
  const name = String(fullName || "").trim();

  if (name) {
    return name.split(/\s+/)[0];
  }

  return String(email || "").split("@")[0] || "there";
}

async function getSessionUser(req) {
  if (typeof getOptionalSiteSessionUser === "function") {
    return await getOptionalSiteSessionUser(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });
  }

  try {
    return await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });
  } catch (error) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    res.setHeader("Cache-Control", "no-store, private");

    const decodedUser = await getSessionUser(req);

    if (!decodedUser || !decodedUser.uid) {
return res.status(200).json({
  signedIn: false,
  authenticated: false,
  loggedIn: false,
  user: null
});
    }

    let userRecord = null;
    let userData = {};

    try {
      userRecord = await admin.auth().getUser(decodedUser.uid);
    } catch (error) {}

    try {
      const userDoc = await admin.firestore().collection("users").doc(decodedUser.uid).get();
      userData = userDoc.exists ? userDoc.data() || {} : {};
    } catch (error) {}

    const fullName = userData.fullName || (userRecord && userRecord.displayName) || decodedUser.name || "";
    const email = (userRecord && userRecord.email) || userData.email || decodedUser.email || "";
    const photoURL = userData.photoURL || "";
    const firstName = getFirstName(fullName, email);

return res.status(200).json({
  signedIn: true,
  authenticated: true,
  loggedIn: true,
  user: {
        uid: decodedUser.uid,
        email,
        emailVerified: Boolean(userRecord ? userRecord.emailVerified : decodedUser.email_verified),
        displayName: fullName,
        fullName,
        photoURL,
        firstName
      }
    });
  } catch (error) {
    const sessionRevoked = Boolean(error && (
      error.message === "account-session-revoked" ||
      error.message === "account-session-invalid"
    ));

return res.status(200).json({
  signedIn: false,
  authenticated: false,
  loggedIn: false,
  sessionRevoked,
  sessionRevokedReason: sessionRevoked && error && error.revokedReason ? error.revokedReason : "",
  user: null
});
  }
};
