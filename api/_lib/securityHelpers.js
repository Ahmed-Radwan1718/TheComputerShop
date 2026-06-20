const crypto = require("crypto");
const admin = require("./firebaseAdmin");

function getCodeHash(uid, code, salt) {
  return crypto
    .createHmac("sha256", process.env.SECURITY_CODE_SECRET)
    .update(uid + ":" + code + ":" + salt)
    .digest("hex");
}

function getSessionHash(uid, token, salt) {
  return crypto
    .createHmac("sha256", process.env.SECURITY_CODE_SECRET)
    .update(uid + ":" + token + ":" + salt)
    .digest("hex");
}

function createRandomCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function createRandomToken() {
  return crypto.randomBytes(32).toString("hex");
}

async function getUserFromRequest(req) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("missing-token");
  }

  const idToken = authHeader.replace("Bearer ", "");
  return await admin.auth().verifyIdToken(idToken);
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
  isExpired
};
