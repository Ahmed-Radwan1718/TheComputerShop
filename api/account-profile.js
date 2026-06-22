const admin = require("./_lib/firebaseAdmin");

const {
  getSiteSessionUser
} = require("./_lib/securityHelpers");

const USERNAME_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;

function cleanString(value) {
  return String(value || "").trim();
}

function cleanFullName(value) {
  return cleanString(value).replace(/\s+/g, " ");
}

function getDateFromValue(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function serializeDate(value) {
  const date = getDateFromValue(value);
  return date ? date.toISOString() : null;
}

function getSafeTwoFactor(twoFactor) {
  const safeTwoFactor = twoFactor || {};

  return {
    appEnabled: Boolean(safeTwoFactor.appEnabled),
    emailEnabled: Boolean(safeTwoFactor.emailEnabled),
    appUpdatedAt: serializeDate(safeTwoFactor.appUpdatedAt),
    emailUpdatedAt: serializeDate(safeTwoFactor.emailUpdatedAt)
  };
}

function buildProfile(uid, authUser, userData) {
  const data = userData || {};

  return {
    uid,
    email: authUser.email || data.email || "",
    emailVerified: Boolean(authUser.emailVerified),
    fullName: data.fullName || authUser.displayName || "",
    phone: data.phone || "",
    twoFactor: getSafeTwoFactor(data.twoFactor),
    usernameLastChangedAt: serializeDate(data.usernameLastChangedAt),
    emailLastChangedAt: serializeDate(data.emailLastChangedAt),
    createdAt: serializeDate(data.createdAt) || authUser.metadata.creationTime || null,
    updatedAt: serializeDate(data.updatedAt) || authUser.metadata.lastSignInTime || null
  };
}

async function getProfile(uid) {
  const db = admin.firestore();
  const authUser = await admin.auth().getUser(uid);
  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();
  const userData = userDoc.exists ? userDoc.data() : {};

  return buildProfile(uid, authUser, userData);
}

async function handleGet(req, res, decodedUser) {
  const profile = await getProfile(decodedUser.uid);

  return res.status(200).json({
    success: true,
    profile
  });
}

async function handlePatch(req, res, decodedUser) {
  const db = admin.firestore();
  const uid = decodedUser.uid;

  const fullName = cleanFullName((req.body || {}).fullName);
  const phone = cleanString((req.body || {}).phone);

  if (!fullName) {
    return res.status(400).json({ error: "Username cannot be empty." });
  }

  if (fullName.length > 80) {
    return res.status(400).json({ error: "Username must be 80 characters or less." });
  }

  if (phone.length > 30) {
    return res.status(400).json({ error: "Phone number must be 30 characters or less." });
  }

  const authUser = await admin.auth().getUser(uid);
  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();
  const existingData = userDoc.exists ? userDoc.data() : {};
  const existingName = cleanFullName(existingData.fullName || authUser.displayName || "");

  const usernameIsChanging = fullName !== existingName;

  if (usernameIsChanging) {
    const lastChangedAt = getDateFromValue(existingData.usernameLastChangedAt);

    if (lastChangedAt) {
      const unlockAt = lastChangedAt.getTime() + USERNAME_COOLDOWN_MS;

      if (unlockAt > Date.now()) {
        return res.status(429).json({
          error: "You can change your username again on " + new Date(unlockAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }) + "."
        });
      }
    }
  }

  const updateData = {
    email: authUser.email || existingData.email || "",
    fullName,
    phone,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  if (usernameIsChanging) {
    updateData.usernameLastChangedAt = admin.firestore.FieldValue.serverTimestamp();
  }

  await userRef.set(updateData, { merge: true });

  if (usernameIsChanging) {
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
    const decodedUser = await getSiteSessionUser(req, { checkRevoked: true });

    if (req.method === "GET") {
      return await handleGet(req, res, decodedUser);
    }

    if (req.method === "PATCH") {
      return await handlePatch(req, res, decodedUser);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      error: "Please log in again."
    });
  }
};
