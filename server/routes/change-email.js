const admin = require("../_lib/firebaseAdmin");

const {
  getUserFromRequest,
  signInWithPassword,
  getCodeHash,
  createSiteSessionForUid
} = require("../_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession,
  clearSecurityUnlockSession
} = require("../_lib/securityUnlockHelpers");

const EMAIL_COOLDOWN_MS = 90 * 24 * 60 * 60 * 1000;
const LOCKOUT_MS = 30 * 60 * 1000;

function getFirebaseWebApiKey() {
  const apiKey = String(process.env.FIREBASE_WEB_API_KEY || "").trim();

  if (!apiKey) {
    const error = new Error("Firebase email change verification is not configured.");
    error.statusCode = 500;
    throw error;
  }

  return apiKey;
}

async function sendFirebaseEmailChangeVerification(idToken, newEmail) {
  const apiKey = getFirebaseWebApiKey();

  if (!idToken) {
    const error = new Error("Could not create email change verification session.");
    error.statusCode = 500;
    throw error;
  }

  const response = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + encodeURIComponent(apiKey),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        requestType: "VERIFY_AND_CHANGE_EMAIL",
        idToken,
        newEmail
      })
    }
  );

  const data = await response.json().catch(function () {
    return {};
  });
  const firebaseErrorCode = data && data.error && data.error.message ? data.error.message : "";

  if (!response.ok) {
    const error = new Error(firebaseErrorCode === "EMAIL_EXISTS"
      ? "This email is already used by another account."
      : "Could not send email change verification link.");
    error.statusCode = firebaseErrorCode === "EMAIL_EXISTS" ? 409 : response.status || 500;
    error.firebaseErrorCode = firebaseErrorCode;
    throw error;
  }
}

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanEmail(value) {
  return cleanString(value, 160).toLowerCase();
}

function timestampToMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

async function hasSecurityUnlock(req, uid) {
  if (hasValidSecurityUnlockSession.length >= 2) {
    return await hasValidSecurityUnlockSession(req, uid);
  }

  return await hasValidSecurityUnlockSession(req);
}

async function clearSecurityUnlock(req, res, uid) {
  if (clearSecurityUnlockSession.length >= 3) {
    return await clearSecurityUnlockSession(req, res, uid);
  }

  if (clearSecurityUnlockSession.length >= 2) {
    return await clearSecurityUnlockSession(req, res);
  }

  return await clearSecurityUnlockSession(res);
}

async function createCompatibleSiteSession(req, res, uid) {
  if (createSiteSessionForUid.length >= 3) {
    return await createSiteSessionForUid(req, res, uid);
  }

  return await createSiteSessionForUid(res, uid);
}

async function requireSecurityUnlock(req, uid) {
  const unlocked = await hasSecurityUnlock(req, uid);

  if (!unlocked) {
    const error = new Error("Please unlock the Security panel first.");
    error.statusCode = 403;
    throw error;
  }
}

async function handleStart(req, res, uid) {
  await requireSecurityUnlock(req, uid);

  const currentEmail = cleanEmail((req.body || {}).currentEmail);
  const newEmail = cleanEmail((req.body || {}).newEmail);
  const currentPassword = String((req.body || {}).currentPassword || "");

  if (!currentEmail || !newEmail || !currentPassword) {
    return res.status(400).json({ error: "Please enter your current email, new email, and password." });
  }

  if (currentEmail === newEmail) {
    return res.status(400).json({ error: "Please enter a different new email." });
  }

  const db = admin.firestore();
  const userRecord = await admin.auth().getUser(uid);
  const realCurrentEmail = cleanEmail(userRecord.email);

  if (currentEmail !== realCurrentEmail) {
    return res.status(400).json({ error: "Current email does not match your account." });
  }

  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();
  const userData = userDoc.exists ? userDoc.data() || {} : {};

  const lastChangedMs = timestampToMillis(userData.emailLastChangedAt);

  if (lastChangedMs && Date.now() - lastChangedMs < EMAIL_COOLDOWN_MS) {
    return res.status(429).json({ error: "You can change your email once every 90 days." });
  }

  try {
    const existingUser = await admin.auth().getUserByEmail(newEmail);

    if (existingUser && existingUser.uid !== uid) {
      return res.status(409).json({ error: "This email is already used by another account." });
    }
  } catch (error) {
    if (error.code !== "auth/user-not-found") {
      throw error;
    }
  }

  let signInData;

  try {
    signInData = await signInWithPassword(realCurrentEmail, currentPassword);
  } catch (error) {
    return res.status(401).json({ error: "Current password is incorrect." });
  }

  await sendFirebaseEmailChangeVerification(signInData && signInData.idToken, newEmail);
  await db.collection("emailChangeCodes").doc(uid).delete().catch(function () {});

  await userRef.set({
    emailChangePendingTo: newEmail,
    emailChangeRequestedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  await clearSecurityUnlock(req, res, uid);

  return res.status(200).json({
    success: true,
    message: "Verification link sent to your new email."
  });
}

async function handleConfirm(req, res, uid) {
  await requireSecurityUnlock(req, uid);

  const code = cleanString((req.body || {}).code, 20);
  const db = admin.firestore();
  const codeRef = db.collection("emailChangeCodes").doc(uid);
  const codeDoc = await codeRef.get();

  if (!codeDoc.exists) {
    return res.status(400).json({ error: "Please request a new verification code." });
  }

  const data = codeDoc.data() || {};
  const lockedUntilMs = timestampToMillis(data.lockedUntil);
  const expiresAtMs = timestampToMillis(data.expiresAt);

  if (lockedUntilMs && lockedUntilMs > Date.now()) {
    return res.status(429).json({ error: "Too many wrong codes. Please try again later." });
  }

  if (!expiresAtMs || expiresAtMs < Date.now()) {
    await codeRef.delete().catch(function () {});
    return res.status(400).json({ error: "This code expired. Please request a new one." });
  }

  const expectedHash = getCodeHash(uid, code, data.salt || "");

  if (!code || expectedHash !== data.codeHash) {
    const attempts = Number(data.attempts || 0) + 1;

    await codeRef.set({
      attempts,
      lockedUntil: attempts >= 3
        ? admin.firestore.Timestamp.fromDate(new Date(Date.now() + LOCKOUT_MS))
        : null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return res.status(401).json({ error: "Invalid verification code." });
  }

  const newEmail = cleanEmail(data.newEmail);

  if (!newEmail) {
    return res.status(400).json({ error: "Missing new email. Please restart email change." });
  }

  await admin.auth().updateUser(uid, {
    email: newEmail,
    emailVerified: true
  });

  await admin.auth().revokeRefreshTokens(uid);

  await db.collection("users").doc(uid).set({
    email: newEmail,
    emailLastChangedAt: admin.firestore.FieldValue.serverTimestamp(),
    emailChangePendingTo: admin.firestore.FieldValue.delete(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  await codeRef.delete().catch(function () {});
  await createCompatibleSiteSession(req, res, uid);
  await clearSecurityUnlock(req, res, uid);

  return res.status(200).json({
    success: true,
    email: newEmail
  });
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    const action = cleanString((req.body || {}).action, 20);

    if (action === "start") {
      return await handleStart(req, res, decodedUser.uid);
    }

    if (action === "confirm") {
      return await handleConfirm(req, res, decodedUser.uid);
    }

    return res.status(400).json({ error: "Invalid email change action." });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not change email."
    });
  }
};
