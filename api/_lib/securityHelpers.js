const crypto = require("crypto");
const admin = require("./firebaseAdmin");

const IS_PRODUCTION =
  process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

const LOGIN_2FA_COOKIE_NAME = IS_PRODUCTION
  ? "__Host-tcs_login_2fa"
  : "tcs_login_2fa";

const LOGIN_2FA_SESSION_MINUTES = 30;

function getSecuritySecret() {
  if (!process.env.SECURITY_CODE_SECRET) {
    throw new Error("missing-security-code-secret");
  }

  return process.env.SECURITY_CODE_SECRET;
}

function getCodeHash(uid, code, salt) {
  return crypto
    .createHmac("sha256", getSecuritySecret())
    .update(uid + ":" + code + ":" + salt)
    .digest("hex");
}

function getSessionHash(uid, token, salt) {
  return crypto
    .createHmac("sha256", getSecuritySecret())
    .update(uid + ":" + token + ":" + salt)
    .digest("hex");
}

function getLoginTwoFactorSessionHash(uid, token, salt) {
  return crypto
    .createHmac("sha256", getSecuritySecret())
    .update("login-2fa:" + uid + ":" + token + ":" + salt)
    .digest("hex");
}

function createRandomCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function createRandomToken() {
  return crypto.randomBytes(32).toString("hex");
}

function getCookie(req, name) {
  const cookieHeader = req.headers.cookie || "";
  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const parts = cookie.trim().split("=");

    if (parts[0] === name) {
      return decodeURIComponent(parts.slice(1).join("="));
    }
  }

  return "";
}

function appendSetCookie(res, cookieValue) {
  const existing = res.getHeader("Set-Cookie");

  if (!existing) {
    res.setHeader("Set-Cookie", cookieValue);
    return;
  }

  if (Array.isArray(existing)) {
    res.setHeader("Set-Cookie", existing.concat(cookieValue));
    return;
  }

  res.setHeader("Set-Cookie", [existing, cookieValue]);
}

function setLoginTwoFactorCookie(res, value, maxAgeSeconds) {
  const secureFlag = IS_PRODUCTION ? "; Secure" : "";

  appendSetCookie(
    res,
    LOGIN_2FA_COOKIE_NAME +
      "=" +
      encodeURIComponent(value) +
      "; Max-Age=" +
      maxAgeSeconds +
      "; Path=/; HttpOnly; SameSite=Strict" +
      secureFlag
  );
}

function clearLoginTwoFactorCookie(res) {
  const secureFlag = IS_PRODUCTION ? "; Secure" : "";

  appendSetCookie(
    res,
    LOGIN_2FA_COOKIE_NAME +
      "=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict" +
      secureFlag
  );
}

async function createLoginTwoFactorSession(uid, res) {
  const db = admin.firestore();
  const sessionId = db.collection("_").doc().id;
  const sessionToken = createRandomToken();
  const salt = db.collection("_").doc().id;

  const sessionHash = getLoginTwoFactorSessionHash(uid, sessionToken, salt);

  await db.collection("loginTwoFactorSessions").doc(sessionId).set({
    uid,
    sessionHash,
    salt,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + LOGIN_2FA_SESSION_MINUTES * 60 * 1000)
    )
  });

  setLoginTwoFactorCookie(
    res,
    sessionId + "." + sessionToken,
    LOGIN_2FA_SESSION_MINUTES * 60
  );

  return { sessionId };
}

async function hasValidLoginTwoFactorSession(req, uid) {
  const cookieValue = getCookie(req, LOGIN_2FA_COOKIE_NAME);

  if (!cookieValue || !cookieValue.includes(".")) {
    return false;
  }

  const parts = cookieValue.split(".");
  const sessionId = parts[0];
  const sessionToken = parts.slice(1).join(".");

  if (!sessionId || !sessionToken) {
    return false;
  }

  const db = admin.firestore();
  const sessionRef = db.collection("loginTwoFactorSessions").doc(sessionId);
  const sessionDoc = await sessionRef.get();

  if (!sessionDoc.exists) {
    return false;
  }

  const data = sessionDoc.data();

  if (data.uid !== uid) {
    return false;
  }

  if (isExpired(data.expiresAt)) {
    await sessionRef.delete().catch(function () {});
    return false;
  }

  const submittedHash = getLoginTwoFactorSessionHash(uid, sessionToken, data.salt);

  const savedBuffer = Buffer.from(data.sessionHash || "", "hex");
  const submittedBuffer = Buffer.from(submittedHash, "hex");

  return (
    savedBuffer.length === submittedBuffer.length &&
    crypto.timingSafeEqual(savedBuffer, submittedBuffer)
  );
}

async function userRequiresTwoFactor(uid) {
  const db = admin.firestore();
  const userDoc = await db.collection("users").doc(uid).get();

  if (!userDoc.exists) {
    return false;
  }

  const twoFactor = userDoc.data().twoFactor || {};

  return Boolean(twoFactor.appEnabled || twoFactor.emailEnabled);
}

async function getUserFromRequest(req, options) {
  const authHeader = req.headers.authorization || "";
  const settings = options || {};

  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("missing-token");
  }

  const idToken = authHeader.replace("Bearer ", "");

  const decodedUser = await admin.auth().verifyIdToken(
    idToken,
    Boolean(settings.checkRevoked)
  );

  if (settings.requireCompletedTwoFactor) {
    const needsTwoFactor = await userRequiresTwoFactor(decodedUser.uid);

    if (needsTwoFactor) {
      const hasCompletedTwoFactor = await hasValidLoginTwoFactorSession(
        req,
        decodedUser.uid
      );

      if (!hasCompletedTwoFactor) {
        const error = new Error("two-factor-required");
        error.statusCode = 403;
        throw error;
      }
    }
  }

  return decodedUser;
}

function isExpired(timestamp) {
  if (!timestamp) {
    return true;
  }

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.getTime() <= Date.now();
}

module.exports = {
  getCodeHash,
  getSessionHash,
  createRandomCode,
  createRandomToken,
  getUserFromRequest,
  isExpired,
  createLoginTwoFactorSession,
  clearLoginTwoFactorCookie,
  hasValidLoginTwoFactorSession
};
