const crypto = require("crypto");
const admin = require("../_lib/firebaseAdmin");

const {
  getCodeHash,
  getUserFromRequest
} = require("../_lib/securityHelpers");

const {
  hasValidSecurityUnlockSession
} = require("../_lib/securityUnlockHelpers");

const RECOVERY_CODE_COUNT = 10;
const RECOVERY_CODE_LENGTH = 8;
const RECOVERY_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function timestampToMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  if (Array.isArray(forwardedFor) && forwardedFor[0]) {
    return String(forwardedFor[0]).split(",")[0].trim();
  }

  return String(
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    ""
  ).trim();
}

function twoFactorIsActive(userData) {
  const twoFactor = userData && userData.twoFactor && typeof userData.twoFactor === "object"
    ? userData.twoFactor
    : {};

  return Boolean(twoFactor.appEnabled || twoFactor.emailEnabled);
}

function recoveryRecordIsActive(data) {
  if (!data || data.revokedAt) {
    return false;
  }

  const expiresAtMs = timestampToMillis(data.expiresAt);
  return !expiresAtMs || expiresAtMs > Date.now();
}

async function getRecoveryCodeStatus(db, uid, active) {
  if (!active) {
    return {
      active: false,
      hasCodes: false,
      unusedCount: 0,
      totalCount: RECOVERY_CODE_COUNT
    };
  }

  const snapshot = await db.collection("recoveryCodes")
    .where("userId", "==", uid)
    .limit(100)
    .get();

  let generatedCount = 0;
  let unusedCount = 0;

  snapshot.docs.forEach(function (doc) {
    const data = doc.data() || {};

    if (!recoveryRecordIsActive(data)) {
      return;
    }

    generatedCount += 1;

    if (!data.usedAt) {
      unusedCount += 1;
    }
  });

  return {
    active: true,
    hasCodes: generatedCount > 0,
    unusedCount,
    totalCount: RECOVERY_CODE_COUNT
  };
}

function createRecoveryCode() {
  while (true) {
    let code = "";

    for (let index = 0; index < RECOVERY_CODE_LENGTH; index += 1) {
      code += RECOVERY_CODE_ALPHABET.charAt(crypto.randomInt(RECOVERY_CODE_ALPHABET.length));
    }

    if (/[A-Z]/.test(code) && /\d/.test(code)) {
      return code;
    }
  }
}

async function generateRecoveryCodes(db, uid, req) {
  const existingSnapshot = await db.collection("recoveryCodes")
    .where("userId", "==", uid)
    .limit(100)
    .get();

  const batch = db.batch();
  const now = admin.firestore.FieldValue.serverTimestamp();
  const codes = [];

  existingSnapshot.docs.forEach(function (doc) {
    const data = doc.data() || {};

    if (data.usedAt || data.revokedAt) {
      return;
    }

    batch.set(doc.ref, {
      revokedAt: now,
      revokedBy: uid,
      revokedReason: "replaced"
    }, { merge: true });
  });

  for (let index = 0; index < RECOVERY_CODE_COUNT; index += 1) {
    const code = createRecoveryCode();
    const salt = db.collection("_").doc().id;
    const codeRef = db.collection("recoveryCodes").doc();

    codes.push(code);

    batch.set(codeRef, {
      userId: uid,
      uid,
      codeHash: getCodeHash(uid, code, salt),
      salt,
      createdAt: now,
      createdFromIp: getClientIp(req),
      usedAt: null,
      usedFromSessionId: "",
      usedFromIp: "",
      revokedAt: null,
      revokedReason: ""
    });
  }

  await batch.commit();

  return codes;
}

async function hasSecurityUnlock(req, uid) {
  if (hasValidSecurityUnlockSession.length >= 2) {
    return await hasValidSecurityUnlockSession(req, uid);
  }

  return await hasValidSecurityUnlockSession(req);
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET" && req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    const db = admin.firestore();
    const userDoc = await db.collection("users").doc(decodedUser.uid).get();
    const userData = userDoc.exists ? userDoc.data() || {} : {};
    const twoFactorActive = twoFactorIsActive(userData);
    const unlocked = await hasSecurityUnlock(req, decodedUser.uid);
    const recoveryCodes = await getRecoveryCodeStatus(db, decodedUser.uid, twoFactorActive);

    if (req.method === "GET") {
      return res.status(200).json({
        success: true,
        unlocked: Boolean(unlocked),
        recoveryCodes
      });
    }

    const action = String((req.body || {}).action || "").trim();

    if (action !== "generate-recovery-codes") {
      return res.status(400).json({ error: "Invalid recovery code request." });
    }

    if (!unlocked) {
      return res.status(403).json({ error: "Please unlock the Security panel first." });
    }

    if (!twoFactorActive) {
      return res.status(400).json({ error: "Turn on two-factor authentication before generating recovery codes." });
    }

    const codes = await generateRecoveryCodes(db, decodedUser.uid, req);
    const updatedRecoveryCodes = await getRecoveryCodeStatus(db, decodedUser.uid, true);

    return res.status(200).json({
      success: true,
      codes,
      recoveryCodes: updatedRecoveryCodes
    });
  } catch (error) {
    if (req.method === "GET") {
      return res.status(200).json({
        success: true,
        unlocked: false
      });
    }

    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not update recovery codes."
    });
  }
};
