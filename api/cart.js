const admin = require("./_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("./_lib/securityHelpers");

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanCartItemId(value) {
  const itemId = cleanString(value, 180);

  if (!itemId || itemId.includes("/")) {
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

function cleanQuantity(value) {
  const quantity = Math.floor(Number(value || 1));

  if (!Number.isFinite(quantity) || quantity < 1) {
    return 1;
  }

  return Math.min(quantity, 99);
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

function cleanCartItem(rawData) {
  const data = rawData || {};
  const itemId = cleanCartItemId(data.id || data.itemId);

  return {
    id: itemId,
    name: cleanString(data.name, 180) || "Product",
    category: cleanString(data.category, 80) || "Product",
    specsLine: cleanString(data.specsLine, 240),
    priceText: cleanString(data.priceText, 100) || "Price pending confirmation",
    priceNumber: cleanPriceNumber(data.priceNumber),
    image: cleanString(data.image, 700),
    url: cleanString(data.url, 700)
  };
}

function validateCartItem(item) {
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

function serializeCartItem(cartDoc) {
  const data = cartDoc.data() || {};

  return {
    id: data.id || cartDoc.id,
    name: data.name || "Product",
    category: data.category || "Product",
    specsLine: data.specsLine || "",
    priceText: data.priceText || "Price pending confirmation",
    priceNumber: typeof data.priceNumber === "number" ? data.priceNumber : null,
    image: data.image || "",
    url: data.url || "",
    quantity: cleanQuantity(data.quantity || 1),
    addedAt: serializeTimestamp(data.addedAt),
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

function getCartSummary(items) {
  const itemCount = items.reduce(function (total, item) {
    return total + Number(item.quantity || 0);
  }, 0);

  const hasKnownPrices = items.length > 0 && items.every(function (item) {
    return typeof item.priceNumber === "number";
  });

  const totalValue = hasKnownPrices
    ? items.reduce(function (sum, item) {
        return sum + Number(item.priceNumber || 0) * Number(item.quantity || 0);
      }, 0)
    : null;

  return {
    itemCount,
    totalValue,
    totalText: totalValue === null ? "Final price to be confirmed" : totalValue.toLocaleString() + " EGP"
  };
}

async function getCartItems(uid) {
  const db = admin.firestore();

  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("cartItems")
    .orderBy("updatedAt", "desc")
    .limit(100)
    .get();

  return snapshot.docs.map(serializeCartItem);
}

async function handleGet(req, res, uid) {
  const items = await getCartItems(uid);
  const summary = getCartSummary(items);

  return res.status(200).json({
    success: true,
    items,
    itemCount: summary.itemCount,
    totalValue: summary.totalValue,
    totalText: summary.totalText
  });
}

async function handlePost(req, res, uid) {
  const db = admin.firestore();
  const body = req.body || {};
  const item = cleanCartItem(body.item || body);
  const quantityToAdd = cleanQuantity(body.quantity || item.quantity || 1);
  const validationError = validateCartItem(item);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const itemRef = db
    .collection("users")
    .doc(uid)
    .collection("cartItems")
    .doc(item.id);

  const existingDoc = await itemRef.get();
  const existingData = existingDoc.exists ? existingDoc.data() || {} : {};
  const existingQuantity = cleanQuantity(existingData.quantity || 0);
  const nextQuantity = Math.min(existingDoc.exists ? existingQuantity + quantityToAdd : quantityToAdd, 99);

  const writeData = {
    ...item,
    quantity: nextQuantity,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  if (!existingDoc.exists || !existingData.addedAt) {
    writeData.addedAt = admin.firestore.FieldValue.serverTimestamp();
  }

  await itemRef.set(writeData, { merge: true });

  const savedDoc = await itemRef.get();
  const items = await getCartItems(uid);
  const summary = getCartSummary(items);

  return res.status(200).json({
    success: true,
    item: serializeCartItem(savedDoc),
    items,
    itemCount: summary.itemCount,
    totalValue: summary.totalValue,
    totalText: summary.totalText
  });
}

async function handleDelete(req, res, uid) {
  const db = admin.firestore();
  const body = req.body || {};
  const clearAll = Boolean(body.clearAll || getQueryValue(req, "clearAll") === "true");
  const cartRef = db.collection("users").doc(uid).collection("cartItems");

  if (clearAll) {
    const snapshot = await cartRef.limit(300).get();
    const batch = db.batch();

    snapshot.docs.forEach(function (cartDoc) {
      batch.delete(cartDoc.ref);
    });

    await batch.commit();

    return res.status(200).json({
      success: true,
      items: [],
      itemCount: 0,
      totalValue: null,
      totalText: "Final price to be confirmed"
    });
  }

  const itemId = cleanCartItemId(body.itemId || getQueryValue(req, "itemId"));

  if (!itemId) {
    return res.status(400).json({ error: "Missing cart item id." });
  }

  await cartRef.doc(itemId).delete().catch(function () {});

  const items = await getCartItems(uid);
  const summary = getCartSummary(items);

  return res.status(200).json({
    success: true,
    items,
    itemCount: summary.itemCount,
    totalValue: summary.totalValue,
    totalText: summary.totalText
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
