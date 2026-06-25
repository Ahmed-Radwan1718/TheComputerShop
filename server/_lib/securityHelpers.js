const crypto = require("crypto");
const admin = require("./firebaseAdmin");

const IS_PRODUCTION =
  process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

const SITE_SESSION_COOKIE_NAME = IS_PRODUCTION
  ? "__Host-tcs_session"
  : "tcs_session";

const LOGIN_CHALLENGE_COOKIE_NAME = IS_PRODUCTION
  ? "__Host-tcs_login_challenge"
  : "tcs_login_challenge";

const LOGIN_2FA_COOKIE_NAME = IS_PRODUCTION
  ? "__Host-tcs_login_2fa"
  : "tcs_login_2fa";

const SITE_SESSION_EXPIRES_MS = 5 * 24 * 60 * 60 * 1000;
const LOGIN_CHALLENGE_EXPIRES_MS = 10 * 60 * 1000;
const LOGIN_2FA_SESSION_MINUTES = 30;

const MAX_2FA_ATTEMPTS = 3;
const ATTEMPT_WINDOW_MS = 30 * 60 * 1000;
const LOCKOUT_MS = 30 * 60 * 1000;

function getSecuritySecret() {
  if (!process.env.SECURITY_CODE_SECRET) {
    throw new Error("missing-security-code-secret");
  }

  return process.env.SECURITY_CODE_SECRET;
}

function getFirebaseWebApiKey() {
  if (!process.env.FIREBASE_WEB_API_KEY) {
    throw new Error("missing-firebase-web-api-key");
  }

  return process.env.FIREBASE_WEB_API_KEY;
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

function getLoginChallengeHash(uid, challengeId, token, salt) {
  return crypto
    .createHmac("sha256", getSecuritySecret())
    .update("login-challenge:" + uid + ":" + challengeId + ":" + token + ":" + salt)
    .digest("hex");
}

function createRandomCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function createRandomToken() {
  return crypto.randomBytes(32).toString("hex");
}

function isExpired(timestamp) {
  if (!timestamp) {
    return true;
  }

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.getTime() <= Date.now();
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

function setCookie(res, name, value, maxAgeSeconds) {
  const secureFlag = IS_PRODUCTION ? "; Secure" : "";

  appendSetCookie(
    res,
    name +
      "=" +
      encodeURIComponent(value) +
      "; Max-Age=" +
      maxAgeSeconds +
      "; Path=/; HttpOnly; SameSite=Strict" +
      secureFlag
  );
}

function clearCookie(res, name) {
  const secureFlag = IS_PRODUCTION ? "; Secure" : "";

  appendSetCookie(
    res,
    name +
      "=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict" +
      secureFlag
  );
}

async function firebaseAuthRest(endpoint, payload) {
  const response = await fetch(
    "https://identitytoolkit.googleapis.com/v1/" +
      endpoint +
      "?key=" +
      encodeURIComponent(getFirebaseWebApiKey()),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  const data = await response.json().catch(function () {
    return {};
  });

  if (!response.ok) {
    const error = new Error("firebase-auth-rest-error");
    error.statusCode = response.status;
    error.firebaseError = data;
    throw error;
  }

  return data;
}

async function signInWithPassword(email, password) {
  return await firebaseAuthRest("accounts:signInWithPassword", {
    email,
    password,
    returnSecureToken: true
  });
}

async function signInWithCustomToken(customToken) {
  return await firebaseAuthRest("accounts:signInWithCustomToken", {
    token: customToken,
    returnSecureToken: true
  });
}

async function createSiteSessionFromIdToken(idToken, res) {
  const sessionCookie = await admin.auth().createSessionCookie(idToken, {
    expiresIn: SITE_SESSION_EXPIRES_MS
  });

  setCookie(
    res,
    SITE_SESSION_COOKIE_NAME,
    sessionCookie,
    Math.floor(SITE_SESSION_EXPIRES_MS / 1000)
  );

  return sessionCookie;
}

async function createSiteSessionForUid(uid, res) {
  const customToken = await admin.auth().createCustomToken(uid);
  const signInData = await signInWithCustomToken(customToken);

  await createSiteSessionFromIdToken(signInData.idToken, res);

  return signInData;
}

function clearSiteSessionCookie(res) {
  clearCookie(res, SITE_SESSION_COOKIE_NAME);
}

async function getSiteSessionUser(req, options) {
  const settings = options || {};
  const sessionCookie = getCookie(req, SITE_SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    const error = new Error("not-signed-in");
    error.statusCode = 401;
    throw error;
  }

  return await admin.auth().verifySessionCookie(
    sessionCookie,
    settings.checkRevoked !== false
  );
}

async function getOptionalSiteSessionUser(req, options) {
  try {
    return await getSiteSessionUser(req, options);
  } catch (error) {
    return null;
  }
}

async function createLoginChallenge(uid, res, details) {
  const db = admin.firestore();
  const challengeRef = db.collection("loginChallenges").doc();
  const challengeId = challengeRef.id;
  const token = createRandomToken();
  const salt = db.collection("_").doc().id;
  const challengeHash = getLoginChallengeHash(uid, challengeId, token, salt);

  await challengeRef.set({
    uid,
    challengeHash,
    salt,
    email: details && details.email ? details.email : "",
    idToken: details && details.idToken ? details.idToken : "",
    mode: details && details.mode ? details.mode : "",
    twoFactor: details && details.twoFactor ? details.twoFactor : {},
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + LOGIN_CHALLENGE_EXPIRES_MS)
    )
  });

  setCookie(
    res,
    LOGIN_CHALLENGE_COOKIE_NAME,
    challengeId + "." + token,
    Math.floor(LOGIN_CHALLENGE_EXPIRES_MS / 1000)
  );

  return {
    challengeId
  };
}

async function getLoginChallenge(req) {
  const cookieValue = getCookie(req, LOGIN_CHALLENGE_COOKIE_NAME);

  if (!cookieValue || !cookieValue.includes(".")) {
    const error = new Error("login-challenge-required");
    error.statusCode = 401;
    throw error;
  }

  const parts = cookieValue.split(".");
  const challengeId = parts[0];
  const token = parts.slice(1).join(".");

  if (!challengeId || !token) {
    const error = new Error("login-challenge-required");
    error.statusCode = 401;
    throw error;
  }

  const db = admin.firestore();
  const challengeRef = db.collection("loginChallenges").doc(challengeId);
  const challengeDoc = await challengeRef.get();

  if (!challengeDoc.exists) {
    const error = new Error("login-challenge-expired");
    error.statusCode = 401;
    throw error;
  }

  const data = challengeDoc.data();

  if (isExpired(data.expiresAt)) {
    await challengeRef.delete().catch(function () {});

    const error = new Error("login-challenge-expired");
    error.statusCode = 401;
    throw error;
  }

  const submittedHash = getLoginChallengeHash(
    data.uid,
    challengeId,
    token,
    data.salt
  );

  const savedBuffer = Buffer.from(data.challengeHash || "", "hex");
  const submittedBuffer = Buffer.from(submittedHash, "hex");

  const matches =
    savedBuffer.length === submittedBuffer.length &&
    crypto.timingSafeEqual(savedBuffer, submittedBuffer);

  if (!matches) {
    const error = new Error("invalid-login-challenge");
    error.statusCode = 401;
    throw error;
  }

  return {
    challengeId,
    ref: challengeRef,
    data,
    uid: data.uid || "",
    email: data.email || "",
    idToken: data.idToken || "",
    mode: data.mode || "",
    twoFactor: data.twoFactor || {}
  };
}

async function clearLoginChallenge(req, res) {
  try {
    const challenge = await getLoginChallenge(req);
    await challenge.ref.delete().catch(function () {});
  } catch (error) {}

  clearCookie(res, LOGIN_CHALLENGE_COOKIE_NAME);
}

function setLoginTwoFactorCookie(res, value, maxAgeSeconds) {
  setCookie(res, LOGIN_2FA_COOKIE_NAME, value, maxAgeSeconds);
}

function clearLoginTwoFactorCookie(res) {
  clearCookie(res, LOGIN_2FA_COOKIE_NAME);
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

  return {
    sessionId
  };
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
  const settings = options || {};
  const authHeader = req.headers.authorization || "";

  if (authHeader.startsWith("Bearer ")) {
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

  return await getSiteSessionUser(req, {
    checkRevoked: settings.checkRevoked !== false
  });
}

function getAttemptRef(db, uid, purpose) {
  return db.collection("twoFactorAttempts").doc(uid + "_" + purpose);
}

async function checkAttemptLock(db, uid, purpose) {
  const ref = getAttemptRef(db, uid, purpose);
  const doc = await ref.get();

  if (!doc.exists) {
    return;
  }

  const data = doc.data();
  const lockedUntil =
    data.lockedUntil && data.lockedUntil.toDate
      ? data.lockedUntil.toDate()
      : null;

  const resetAt =
    data.resetAt && data.resetAt.toDate
      ? data.resetAt.toDate()
      : null;

  if (lockedUntil && lockedUntil.getTime() > Date.now()) {
    const error = new Error(
      "Too many incorrect codes. Please wait 30 minutes before trying again."
    );
    error.statusCode = 429;
    throw error;
  }

  if (resetAt && resetAt.getTime() <= Date.now()) {
    await ref.delete().catch(function () {});
  }
}

async function recordAttemptFailure(db, uid, purpose) {
  const ref = getAttemptRef(db, uid, purpose);
  const doc = await ref.get();

  let attempts = 1;

  if (doc.exists) {
    const data = doc.data();
    const resetAt =
      data.resetAt && data.resetAt.toDate
        ? data.resetAt.toDate()
        : null;

    if (resetAt && resetAt.getTime() > Date.now()) {
      attempts = Number(data.attempts || 0) + 1;
    }
  }

  const updateData = {
    attempts,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    resetAt: admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + ATTEMPT_WINDOW_MS)
    )
  };

  if (attempts >= MAX_2FA_ATTEMPTS) {
    updateData.lockedUntil = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + LOCKOUT_MS)
    );
  }

  await ref.set(updateData, { merge: true });

  return attempts >= MAX_2FA_ATTEMPTS;
}

async function clearAttemptFailures(db, uid, purpose) {
  await getAttemptRef(db, uid, purpose).delete().catch(function () {});
}

async function getAuthenticatorSecret(db, uid, userData) {
  const secretRef = db.collection("twoFactorSecrets").doc(uid);
  const secretDoc = await secretRef.get();

  if (secretDoc.exists && secretDoc.data().appSecret) {
    return secretDoc.data().appSecret;
  }

  const legacySecret =
    userData &&
    userData.twoFactor &&
    userData.twoFactor.appSecret
      ? userData.twoFactor.appSecret
      : "";

  if (legacySecret) {
    await secretRef.set(
      {
        appSecret: legacySecret,
        migratedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    await db
      .collection("users")
      .doc(uid)
      .update({
        "twoFactor.appSecret": admin.firestore.FieldValue.delete(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      })
      .catch(function () {});

    return legacySecret;
  }

  return "";
}

module.exports = {
  getCodeHash,
  getSessionHash,
  createRandomCode,
  createRandomToken,
  getUserFromRequest,
  isExpired,

  signInWithPassword,
  signInWithCustomToken,
  createSiteSessionFromIdToken,
  createSiteSessionForUid,
  clearSiteSessionCookie,
  getSiteSessionUser,
  getOptionalSiteSessionUser,

  createLoginChallenge,
  getLoginChallenge,
  clearLoginChallenge,

  createLoginTwoFactorSession,
  clearLoginTwoFactorCookie,
  hasValidLoginTwoFactorSession,

  checkAttemptLock,
  recordAttemptFailure,
  clearAttemptFailures,
  getAuthenticatorSecret
};
