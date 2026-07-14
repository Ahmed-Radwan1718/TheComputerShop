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

async function productIsUnavailable(itemId) {
  const stockDoc = await admin.firestore()
    .collection("productStock")
    .doc(itemId)
    .get();

  if (!stockDoc.exists) {
    return false;
  }

  const data = stockDoc.data() || {};
  return data.status === "unavailable";
}

function getNumberValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const cleaned = String(value || "").replace(/[^\d.]/g, "");
  const number = Number(cleaned);

  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value) {
  return "EGP " + Number(value || 0).toLocaleString("en-US");
}

function serializeCartItem(itemDoc) {
  const data = itemDoc.data() || {};
  const quantity = Math.max(1, Math.min(99, Number(data.quantity || 1)));
  const priceNumber = typeof data.priceNumber === "number" ? data.priceNumber : null;
  const priceValue = priceNumber === null ? getNumberValue(data.priceValue || data.price || data.priceText || 0) : priceNumber;

  return {
    id: data.id || itemDoc.id,
    name: data.name || "Product",
    category: data.category || "",
    specsLine: data.specsLine || "",
    url: data.url || "",
    image: data.image || "",
    price: data.price || data.priceText || formatMoney(priceValue),
    priceText: data.priceText || data.price || formatMoney(priceValue),
    priceNumber,
    priceValue,
    quantity,
    lineTotalValue: priceNumber === null ? 0 : priceNumber * quantity,
    lineTotalText: priceNumber === null ? "Final price to be confirmed" : formatMoney(priceNumber * quantity)
  };
}

function getSummary(cartItems) {
  const itemCount = cartItems.reduce(function (sum, item) {
    return sum + Number(item.quantity || 0);
  }, 0);

  const totalValue = cartItems.reduce(function (sum, item) {
    return sum + Number(item.lineTotalValue || 0);
  }, 0);

  return {
    itemCount,
    totalValue,
    totalText: formatMoney(totalValue)
  };
}

async function getCartItems(uid) {
  const snapshot = await admin.firestore()
    .collection("users")
    .doc(uid)
    .collection("cartItems")
    .limit(100)
    .get();

  return snapshot.docs.map(serializeCartItem);
}

async function handleGet(req, res, uid) {
  const cartItems = await getCartItems(uid);
  const summary = getSummary(cartItems);

  return res.status(200).json({
    success: true,
    cartItems,
    items: cartItems,
    itemCount: summary.itemCount,
    totalValue: summary.totalValue,
    totalText: summary.totalText
  });
}

async function handlePost(req, res, uid) {
  const body = req.body || {};
  const product =
    body.item && typeof body.item === "object"
      ? body.item
      : body.product && typeof body.product === "object"
        ? body.product
        : body;

  const itemId = cleanItemId(product.id || product.url || product.name);
  const quantityToAdd = Math.max(1, Math.min(99, Number(body.quantity || body.quantityToAdd || product.quantity || 1)));

  if (!itemId) {
    return res.status(400).json({ error: "Missing product id." });
  }

  if (await productIsUnavailable(itemId)) {
    return res.status(409).json({ error: "This product is currently unavailable." });
  }

  const cartRef = admin.firestore()
    .collection("users")
    .doc(uid)
    .collection("cartItems")
    .doc(itemId);

  await admin.firestore().runTransaction(async function (transaction) {
    const cartDoc = await transaction.get(cartRef);
    const existingQuantity = cartDoc.exists ? Number((cartDoc.data() || {}).quantity || 0) : 0;
    const newQuantity = Math.max(1, Math.min(99, existingQuantity + quantityToAdd));

    transaction.set(cartRef, {
      id: itemId,
      name: cleanString(product.name, 160) || "Product",
      category: cleanString(product.category, 80),
      url: cleanString(product.url, 500),
      image: cleanString(product.image, 1000),
      specsLine: cleanString(product.specsLine, 240),
      price: cleanString(product.price || product.priceText, 80),
      priceText: cleanString(product.priceText || product.price, 80),
      priceNumber: typeof product.priceNumber === "number" ? product.priceNumber : null,
      priceValue: getNumberValue(product.priceValue || product.priceNumber || product.price || product.priceText),
      quantity: newQuantity,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: cartDoc.exists
        ? (cartDoc.data() || {}).createdAt || admin.firestore.FieldValue.serverTimestamp()
        : admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });

  const savedDoc = await cartRef.get();
  const cartItems = await getCartItems(uid);
  const summary = getSummary(cartItems);

  return res.status(200).json({
    success: true,
    item: serializeCartItem(savedDoc),
    cartItems,
    items: cartItems,
    itemCount: summary.itemCount,
    totalValue: summary.totalValue,
    totalText: summary.totalText
  });
}

async function handleDelete(req, res, uid) {
  const clearAll = Boolean((req.body || {}).clearAll || (req.query || {}).clearAll);
  const itemId = cleanItemId((req.body || {}).id || (req.body || {}).itemId || (req.query || {}).id || (req.query || {}).itemId);

  const cartRef = admin.firestore()
    .collection("users")
    .doc(uid)
    .collection("cartItems");

  if (clearAll) {
    const snapshot = await cartRef.get();
    const batch = admin.firestore().batch();

    snapshot.docs.forEach(function (cartDoc) {
      batch.delete(cartDoc.ref);
    });

    await batch.commit();
  } else {
    if (!itemId) {
      return res.status(400).json({ error: "Missing cart item id." });
    }

    await cartRef.doc(itemId).delete();
  }

  const cartItems = await getCartItems(uid);
  const summary = getSummary(cartItems);

  return res.status(200).json({
    success: true,
    cartItems,
    items: cartItems,
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
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not process cart."
    });
  }
};
