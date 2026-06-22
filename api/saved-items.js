const admin = require("./_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("./_lib/securityHelpers");

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanSavedItemId(value) {
  const itemId = cleanString(value, 180);

  if (!itemId) {
    return "";
  }

  if (itemId.includes("/")) {
    return "";
  }

  if (!/^[a-zA-Z0-9._:-]+$/.test(itemId)) {
    return "";
  }

  return itemId;
}

function cleanPriceNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    return null;
  }

  return numberValue;
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

function cleanSavedItem(rawData) {
  const data = rawData || {};
  const itemId = cleanSavedItemId(data.id || data.docId || data.itemId);

  return {
    id: itemId,
    name: cleanString(data.name, 180) || "Saved product",
    category: cleanString(data.category, 80) || "Product",
    specsLine: cleanString(data.specsLine, 240),
    priceText: cleanString(data.priceText, 100) || "Price coming soon",
    priceNumber: cleanPriceNumber(data.priceNumber),
    image: cleanString(data.image, 700),
    url: cleanString(data.url, 700)
  };
}

function validateSavedItem(item) {
  if (!item.id) {
    return "Missing product id.";
  }

  if (!item.name) {
    return "Missing product name.";
  }

  if (!item.url) {
    return "Missing product link.";
  }

  return "";
}

function serializeSavedItem(savedDoc) {
  const data = savedDoc.data() || {};

  return {
    docId: savedDoc.id,
    id: data.id || savedDoc.id,
    name: data.name || "Saved product",
    category: data.category || "Product",
    specsLine: data.specsLine || "",
    priceText: data.priceText || "Price coming soon",
    priceNumber: typeof data.priceNumber === "number" ? data.priceNumber : null,
    image: data.image || "",
    url: data.url || "product.html",
    savedAt: serializeTimestamp(data.savedAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
}

function getQueryValue(req, key) {
  if (req.query && req.query[key]) {
    return Array.isArray(req.query[key]) ? req.query[key][0] : req.query[key];
  }

  try {
    const url = new URL(req.url, "http://localhost");
    return url.searchParams.get(key) || "";
  } catch (error) {
    return "";
  }
}

async function handleGet(req, res, uid) {
  const db = admin.firestore();
  const requestedItemId = cleanSavedItemId(getQueryValue(req, "itemId"));

  if (requestedItemId) {
    const savedDoc = await db
      .collection("users")
      .doc(uid)
      .collection("savedForLater")
      .doc(requestedItemId)
      .get();

    return res.status(200).json({
      success: true,
      saved: savedDoc.exists,
      item: savedDoc.exists ? serializeSavedItem(savedDoc) : null
    });
  }

  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("savedForLater")
    .orderBy("savedAt", "desc")
    .limit(100)
    .get();

  const items = snapshot.docs.map(serializeSavedItem);

  return res.status(200).json({
    success: true,
    items
  });
}

async function handlePost(req, res, uid) {
  const db = admin.firestore();
  const item = cleanSavedItem((req.body || {}).item || req.body || {});
  const validationError = validateSavedItem(item);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const itemRef = db
    .collection("users")
    .doc(uid)
    .collection("savedForLater")
    .doc(item.id);

  const existingDoc = await itemRef.get();

  await itemRef.set({
    ...item,
    savedAt: existingDoc.exists && existingDoc.data().savedAt
      ? existingDoc.data().savedAt
      : admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  const savedDoc = await itemRef.get();

  return res.status(200).json({
    success: true,
    saved: true,
    item: serializeSavedItem(savedDoc)
  });
}

async function handleDelete(req, res, uid) {
  const db = admin.firestore();
  const itemId = cleanSavedItemId((req.body || {}).itemId || getQueryValue(req, "itemId"));

  if (!itemId) {
    return res.status(400).json({ error: "Missing saved item id." });
  }

  await db
    .collection("users")
    .doc(uid)
    .collection("savedForLater")
    .doc(itemId)
    .delete()
    .catch(function () {});

  return res.status(200).json({
    success: true,
    saved: false
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
    return res.status(error.statusCode || 401).json({
      error: error.message || "Please log in again."
    });
  }
};
