const admin = require("../_lib/firebaseAdmin");
const { v2: cloudinary } = require("cloudinary");

const {
  getUserFromRequest,
  listAccountSessions,
  listTrustedDevices,
  getCurrentAccountSession,
  createAccountSession
} = require("../_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession
} = require("../_lib/securityUnlockHelpers");

const USERNAME_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;
const PROFILE_PHOTO_MAX_BYTES = 4 * 1024 * 1024;
const PROFILE_PHOTO_ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

const PROVIDER_CONFIGS = {
  google: {
    id: "google.com",
    name: "Google",
    authProvider: "google"
  },
  github: {
    id: "github.com",
    name: "GitHub",
    authProvider: "github"
  },
  facebook: {
    id: "facebook.com",
    name: "Facebook",
    authProvider: "facebook"
  }
};

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

async function hasSecurityUnlock(req, uid) {
  if (hasValidSecurityUnlockSession.length >= 2) {
    return await hasValidSecurityUnlockSession(req, uid);
  }

  return await hasValidSecurityUnlockSession(req);
}

async function requireSecurityUnlock(req, uid) {
  const unlocked = await hasSecurityUnlock(req, uid);

  if (!unlocked) {
    const error = new Error("Please unlock the Security panel first.");
    error.statusCode = 403;
    throw error;
  }
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

function getUserProviderIds(userRecord) {
  const providerIds = new Set();

  (userRecord.providerData || []).forEach(function (provider) {
    if (provider && provider.providerId) {
      providerIds.add(provider.providerId);
    }
  });

  return providerIds;
}

function addAuthProviderFallback(providerIds, userRecord, userData) {
  const data = userData && typeof userData === "object" ? userData : {};
  const authProvider = String(data.authProvider || "").toLowerCase();

  if (authProvider === "google") {
    providerIds.add("google.com");
  }

  if (authProvider === "github") {
    providerIds.add("github.com");
  }

  if (authProvider === "facebook") {
    providerIds.add("facebook.com");
  }

  if (authProvider === "password" || (userRecord.email && !authProvider && providerIds.size === 0)) {
    providerIds.add("password");
  }

  return providerIds;
}

function getFallbackAuthProvider(providerIds) {
  if (providerIds.has("password")) {
    return "password";
  }

  if (providerIds.has("google.com")) {
    return "google";
  }

  if (providerIds.has("github.com")) {
    return "github";
  }

  if (providerIds.has("facebook.com")) {
    return "facebook";
  }

  return "";
}

function getConnectedProviders(userRecord, userData) {
  const providerIds = addAuthProviderFallback(getUserProviderIds(userRecord), userRecord, userData);

  return [
    {
      id: "password",
      label: "Email & Password",
      connected: providerIds.has("password")
    },
    {
      id: "google.com",
      label: "Google",
      connected: providerIds.has("google.com")
    },
    {
      id: "github.com",
      label: "GitHub",
      connected: providerIds.has("github.com")
    },
    {
      id: "facebook.com",
      label: "Facebook",
      connected: providerIds.has("facebook.com")
    }
  ];
}

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    const error = new Error("Profile photo uploads are not configured.");
    error.statusCode = 500;
    throw error;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
}

function getProfilePhotoDataUrl(value) {
  const dataUrl = String(value || "").trim();

  if (!dataUrl) {
    return "";
  }

  const match = dataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/i);

  if (!match || !PROFILE_PHOTO_ALLOWED_MIME_TYPES.has(match[1].toLowerCase())) {
    const error = new Error("Please upload a JPG, PNG, or WEBP image.");
    error.statusCode = 400;
    throw error;
  }

  const mimeType = match[1].toLowerCase() === "image/jpg" ? "image/jpeg" : match[1].toLowerCase();
  const base64Data = match[2];
  const padding = base64Data.endsWith("==") ? 2 : base64Data.endsWith("=") ? 1 : 0;
  const byteLength = Math.floor((base64Data.length * 3) / 4) - padding;

  if (byteLength > PROFILE_PHOTO_MAX_BYTES) {
    const error = new Error("Profile photo must be 4MB or smaller.");
    error.statusCode = 413;
    throw error;
  }

  return "data:" + mimeType + ";base64," + base64Data;
}

async function uploadProfilePhoto(uid, dataUrl) {
  const safeDataUrl = getProfilePhotoDataUrl(dataUrl);

  if (!safeDataUrl) {
    return "";
  }

  configureCloudinary();

  const result = await cloudinary.uploader.upload(safeDataUrl, {
    folder: "the-computer-shop/profile-photos",
    public_id: uid,
    overwrite: true,
    invalidate: true,
    unique_filename: false,
    resource_type: "image"
  });

  if (!result || !result.secure_url) {
    const error = new Error("Could not upload profile photo.");
    error.statusCode = 500;
    throw error;
  }

  return result.secure_url;
}

async function deleteProfilePhoto(uid) {
  configureCloudinary();

  await cloudinary.uploader.destroy("the-computer-shop/profile-photos/" + uid, {
    invalidate: true,
    resource_type: "image"
  });
}

async function ensureAccountSession(req, res, uid) {
  if (typeof getCurrentAccountSession !== "function" || typeof createAccountSession !== "function") {
    return;
  }

  const currentSession = await getCurrentAccountSession(req, uid).catch(function () {
    return null;
  });

  if (currentSession) {
    return;
  }

  await createAccountSession(uid, res, req);
}

async function getProfile(uid, req) {
  const userDocRef = admin.firestore().collection("users").doc(uid);
  const sessionsPromise = typeof listAccountSessions === "function"
    ? listAccountSessions(req, uid)
    : Promise.resolve([]);
  const trustedDevicesPromise = typeof listTrustedDevices === "function"
    ? listTrustedDevices(req, uid)
    : Promise.resolve([]);

  const [userRecord, userDoc, sessions, trustedDevices] = await Promise.all([
    admin.auth().getUser(uid),
    userDocRef.get(),
    sessionsPromise,
    trustedDevicesPromise
  ]);

  const data = userDoc.exists ? userDoc.data() || {} : {};

  return {
    uid,
    email: userRecord.email || data.email || "",
    emailVerified: Boolean(userRecord.emailVerified),
    fullName: data.fullName || userRecord.displayName || "",
    photoURL: data.photoURL || userRecord.photoURL || "",
    phone: data.phone || "",
    twoFactor: getSafeTwoFactor(data.twoFactor),
    connectedProviders: getConnectedProviders(userRecord, data),
    sessions,
    trustedDevices,
    passwordLastChangedAt: serializeTimestamp(data.passwordLastChangedAt),
    usernameLastChangedAt: serializeTimestamp(data.usernameLastChangedAt),
    emailLastChangedAt: serializeTimestamp(data.emailLastChangedAt),
    emailChangePendingTo: data.emailChangePendingTo || "",
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
}

async function handleProviderAction(req, res, uid, userData) {
  const action = cleanString((req.body || {}).providerAction, 30).toLowerCase();
  const providerKey = cleanString((req.body || {}).provider, 30).toLowerCase();
  const providerConfig = PROVIDER_CONFIGS[providerKey];

  if (!providerConfig) {
    return res.status(400).json({ error: "Invalid connected account provider." });
  }

  const db = admin.firestore();
  const userRef = db.collection("users").doc(uid);

  if (action === "connect") {
    const userRecord = await admin.auth().getUser(uid);
    const providerIds = getUserProviderIds(userRecord);

    if (!providerIds.has(providerConfig.id)) {
      return res.status(400).json({ error: "Please finish connecting " + providerConfig.name + " first." });
    }

    const connectedAccounts = {};
    connectedAccounts[providerKey + "ConnectedAt"] = admin.firestore.FieldValue.serverTimestamp();

    const updateData = {
      connectedAccounts,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (!cleanString(userData.authProvider, 30)) {
      updateData.authProvider = providerConfig.authProvider;
    }

    await userRef.set(updateData, { merge: true });

    const profile = await getProfile(uid, req);

    return res.status(200).json({
      success: true,
      profile
    });
  }

  if (action === "disconnect") {
    await requireSecurityUnlock(req, uid);

    const userRecord = await admin.auth().getUser(uid);
    const providerIds = addAuthProviderFallback(getUserProviderIds(userRecord), userRecord, userData);

    if (!providerIds.has(providerConfig.id)) {
      return res.status(400).json({ error: providerConfig.name + " is already disconnected." });
    }

    if (providerIds.size <= 1) {
      return res.status(400).json({ error: "Connect another sign-in method before disconnecting " + providerConfig.name + "." });
    }

    await admin.auth().updateUser(uid, {
      providersToUnlink: [providerConfig.id]
    });

    providerIds.delete(providerConfig.id);

    const connectedAccounts = {};
    connectedAccounts[providerKey + "DisconnectedAt"] = admin.firestore.FieldValue.serverTimestamp();

    const fallbackAuthProvider = getFallbackAuthProvider(providerIds);
    const updateData = {
      connectedAccounts,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (fallbackAuthProvider) {
      updateData.authProvider = fallbackAuthProvider;
    } else {
      updateData.authProvider = admin.firestore.FieldValue.delete();
    }

    await userRef.set(updateData, { merge: true });

    const profile = await getProfile(uid, req);

    return res.status(200).json({
      success: true,
      profile
    });
  }

  return res.status(400).json({ error: "Invalid connected account action." });
}

async function handleGet(req, res, uid) {
  await ensureAccountSession(req, res, uid);

  const profile = await getProfile(uid, req);

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
  const providerAction = cleanString((req.body || {}).providerAction, 30).toLowerCase();

  if (providerAction) {
    return await handleProviderAction(req, res, uid, data);
  }

  const fullName = cleanString((req.body || {}).fullName, 80);
  const phone = cleanString((req.body || {}).phone, 30);
  const profilePhotoDataUrl = getProfilePhotoDataUrl((req.body || {}).profilePhotoDataUrl);
  const removeProfilePhoto = Boolean((req.body || {}).removeProfilePhoto) && !profilePhotoDataUrl;

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

  let photoURL = data.photoURL || "";

  if (profilePhotoDataUrl) {
    photoURL = await uploadProfilePhoto(uid, profilePhotoDataUrl);
  } else if (removeProfilePhoto) {
    await deleteProfilePhoto(uid);
    photoURL = "";
  }

  const updateData = {
    fullName,
    phone,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  if (profilePhotoDataUrl && photoURL) {
    updateData.photoURL = photoURL;
    updateData.profilePhotoUpdatedAt = admin.firestore.FieldValue.serverTimestamp();
  } else if (removeProfilePhoto) {
    updateData.photoURL = admin.firestore.FieldValue.delete();
    updateData.profilePhotoDeletedAt = admin.firestore.FieldValue.serverTimestamp();
  }

  if (nameChanged) {
    updateData.usernameLastChangedAt = admin.firestore.FieldValue.serverTimestamp();
  }

  await userRef.set(updateData, { merge: true });

  const authUpdateData = {};

  if (nameChanged) {
    authUpdateData.displayName = fullName;
  }

  if (profilePhotoDataUrl && photoURL) {
    authUpdateData.photoURL = photoURL;
  } else if (removeProfilePhoto) {
    authUpdateData.photoURL = null;
  }

  if (Object.keys(authUpdateData).length) {
    await admin.auth().updateUser(uid, authUpdateData);
  }

  const profile = await getProfile(uid, req);

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
    const sessionRevoked = Boolean(error && (
      error.message === "account-session-revoked" ||
      error.message === "account-session-invalid"
    ));

    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not process account profile.",
      sessionRevoked,
      sessionRevokedReason: sessionRevoked && error && error.revokedReason ? error.revokedReason : ""
    });
  }
};
