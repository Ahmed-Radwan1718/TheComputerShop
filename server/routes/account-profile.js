const admin = require("../_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("../_lib/securityHelpers");

const USERNAME_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function serializeTimestamp(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function timestampToMillis(value) {
  if (!value) {
    return 0;
  }

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value.toDate === "function") {
    return value.toDate().getTime();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function getSafeTwoFactor(twoFactor) {
  const data = twoFactor && typeof twoFactor === "object" ? twoFactor : {};

  return {
    appEnabled: Boolean(data.appEnabled),
    emailEnabled: Boolean(data.emailEnabled),
    appEnabledAt: serializeTimestamp(data.appEnabledAt),
    appUpdatedAt: serializeTimestamp(data.appUpdatedAt),
    appDisabledAt: serializeTimestamp(data.appDisabledAt),
    emailEnabledAt: serializeTimestamp(data.emailEnabledAt),
    emailUpdatedAt: serializeTimestamp(data.emailUpdatedAt)
  };
}

async function getProfile(uid) {
  const userRecord = await admin.auth().getUser(uid);
  const userDoc = await admin.firestore().collection("users").doc(uid).get();
  const data = userDoc.exists ? userDoc.data() || {} : {};

  return {
    uid,
    email: userRecord.email || data.email || "",
    emailVerified: Boolean(userRecord.emailVerified),
    fullName: data.fullName || userRecord.displayName || "",
    phone: data.phone || "",
    twoFactor: getSafeTwoFactor(data.twoFactor),
    usernameLastChangedAt: serializeTimestamp(data.usernameLastChangedAt),
    emailLastChangedAt: serializeTimestamp(data.emailLastChangedAt),
    emailChangePendingTo: data.emailChangePendingTo || "",
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
}

async function handleGet(req, res, uid) {
  const profile = await getProfile(uid);

  return res.status(200).json({
    success: true,
    profile
  });
}

async function handlePatch(req, res, uid) {
  const db = admin.firestore();
  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();
  const data = userDoc.exists ? userDoc.data() || {} : {};

  const fullName = cleanString((req.body || {}).fullName, 80);
  const phone = cleanString((req.body || {}).phone, 30);

  if (!fullName) {
    return res.status(400).json({ error: "Please enter your name." });
  }

  const oldFullName = cleanString(data.fullName, 80);
  const nameChanged = fullName !== oldFullName;

  if (nameChanged && data.usernameLastChangedAt) {
    const lastChangedMs = timestampToMillis(data.usernameLastChangedAt);

    if (lastChangedMs && Date.now() - lastChangedMs < USERNAME_COOLDOWN_MS) {
      return res.status(429).json({
        error: "You can change your username once every 14 days."
      });
    }
  }

  const updateData = {
    fullName,
    phone,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  if (nameChanged) {
    updateData.usernameLastChangedAt = admin.firestore.FieldValue.serverTimestamp();
  }

  await userRef.set(updateData, { merge: true });

  if (nameChanged) {
    await admin.auth().updateUser(uid, {
      displayName: fullName
    });
  }

  const profile = await getProfile(uid);

  return res.status(200).json({
    success: true,
    profile
  });
}

module.exports = async function handler(req, res) {
  try {
    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    if (req.method === "GET") {
      return await handleGet(req, res, decodedUser.uid);
    }

    if (req.method === "PATCH") {
      return await handlePatch(req, res, decodedUser.uid);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not process account profile."
    });
  }
};
