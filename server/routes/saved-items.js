const admin = require("../_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("../_lib/securityHelpers");

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanItemId(value) {
  const itemId = cleanString(value, 160);

  if (!itemId || itemId.includes("/")) {
    return "";
  }

  return itemId.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 160);
}

function serializeTimestamp(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function serializeSavedItem(itemDoc) {
  const data = itemDoc.data() || {};

  return {
    id: data.id || itemDoc.id,
    docId: itemDoc.id,
    name: data.name || "Product",
    category: data.category || "",
    url: data.url || "",
    image: data.image || "",
    price: data.price || data.priceText || "",
    priceText: data.priceText || data.price || "",
    savedAt: serializeTimestamp(data.savedAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
}

async function handleGet(req, res, uid) {
  const itemId = cleanItemId((req.query || {}).itemId || (req.query || {}).id);

  if (itemId) {
    const itemDoc = await admin.firestore()
      .collection("users")
      .doc(uid)
      .collection("savedForLater")
      .doc(itemId)
      .get();

    return res.status(200).json({
      success: true,
      saved: itemDoc.exists,
      item: itemDoc.exists ? serializeSavedItem(itemDoc) : null
    });
  }

  const snapshot = await admin.firestore()
    .collection("users")
    .doc(uid)
    .collection("savedForLater")
    .limit(100)
    .get();

  const items = snapshot.docs.map(serializeSavedItem);

  return res.status(200).json({
    success: true,
    items,
    savedItems: items
  });
}

async function handlePost(req, res, uid) {
  const body = req.body || {};
  const product = body.product && typeof body.product === "object"
    ? body.product
    : body.item && typeof body.item === "object"
      ? body.item
      : body;
  const itemId = cleanItemId(product.id || product.url || product.name);

  if (!itemId) {
    return res.status(400).json({ error: "Missing product id." });
  }

  const itemRef = admin.firestore()
    .collection("users")
    .doc(uid)
    .collection("savedForLater")
    .doc(itemId);

  const existingDoc = await itemRef.get();

  await itemRef.set({
    id: itemId,
    name: cleanString(product.name, 160) || "Product",
    category: cleanString(product.category, 80),
    url: cleanString(product.url, 500),
    image: cleanString(product.image, 1000),
    price: cleanString(product.price || product.priceText, 80),
    priceText: cleanString(product.priceText || product.price, 80),
    savedAt: existingDoc.exists
      ? existingDoc.data().savedAt || admin.firestore.FieldValue.serverTimestamp()
      : admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  const savedDoc = await itemRef.get();

  return res.status(200).json({
    success: true,
    item: serializeSavedItem(savedDoc)
  });
}

async function handleDelete(req, res, uid) {
  const itemId = cleanItemId((req.body || {}).id || (req.body || {}).itemId || (req.query || {}).id || (req.query || {}).itemId);

  if (!itemId) {
    return res.status(400).json({ error: "Missing saved item id." });
  }

  await admin.firestore()
    .collection("users")
    .doc(uid)
    .collection("savedForLater")
    .doc(itemId)
    .delete();

  return res.status(200).json({
    success: true
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

    if (req.method === "POST") {
      return await handlePost(req, res, decodedUser.uid);
    }

    if (req.method === "DELETE") {
      return await handleDelete(req, res, decodedUser.uid);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not process saved item."
    });
  }
};
