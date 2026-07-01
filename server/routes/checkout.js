const admin = require("../_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("../_lib/securityHelpers");

const {
  getClientIp,
  consumeRateLimit,
  THIRTY_MINUTES_MS,
  ONE_HOUR_MS
} = require("../_lib/rateLimitHelpers");

const VALID_ADDRESS_TYPES = ["apartment", "house", "office"];
const VALID_FULFILLMENT_METHODS = ["delivery", "pickup"];

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanAddressType(value) {
  const addressType = cleanString(value, 30);
  return VALID_ADDRESS_TYPES.includes(addressType) ? addressType : "apartment";
}

function cleanFulfillmentMethod(value) {
  const fulfillmentMethod = cleanString(value, 30);
  return VALID_FULFILLMENT_METHODS.includes(fulfillmentMethod) ? fulfillmentMethod : "delivery";
}

function serializeTimestamp(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function getNumberValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;

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
  const priceValue = getNumberValue(data.priceValue || data.price || data.priceText || 0);

  return {
    id: data.id || itemDoc.id,
    name: data.name || "Product",
    category: data.category || "",
    url: data.url || "",
    image: data.image || "",
    price: data.price || data.priceText || formatMoney(priceValue),
    priceText: data.priceText || data.price || formatMoney(priceValue),
    priceValue,
    quantity,
    lineTotalValue: priceValue * quantity,
    lineTotalText: formatMoney(priceValue * quantity)
  };
}

function serializeAddress(addressDoc) {
  const data = addressDoc.data() || {};

  return {
    id: addressDoc.id,
    label: data.label || "",
    addressType: data.addressType || "apartment",
    buildingName: data.buildingName || "",
    apartmentNumber: data.apartmentNumber || "",
    floorNumber: data.floorNumber || "",
    houseNumber: data.houseNumber || "",
    officeName: data.officeName || "",
    companyName: data.companyName || "",
    streetName: data.streetName || "",
    additionalInfo: data.additionalInfo || "",
    isDefault: Boolean(data.isDefault),
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
}

function createOrderNumber() {
  const now = new Date();
  const day = String(now.getUTCDate()).padStart(2, "0");
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const year = String(now.getUTCFullYear());
  const datePart = day + month + year;
  const randomPart = Math.random().toString(36).slice(2, 12).toUpperCase();

  return datePart + "-" + randomPart;
}

async function getProfile(uid) {
  const userRecord = await admin.auth().getUser(uid);
  const userDoc = await admin.firestore().collection("users").doc(uid).get();
  const data = userDoc.exists ? userDoc.data() || {} : {};

  return {
    uid,
    fullName: data.fullName || userRecord.displayName || "",
    email: userRecord.email || data.email || "",
    phone: data.phone || "",
    addressType: data.addressType || "apartment",
    buildingName: data.buildingName || "",
    apartmentNumber: data.apartmentNumber || "",
    floorNumber: data.floorNumber || "",
    houseNumber: data.houseNumber || "",
    officeName: data.officeName || "",
    companyName: data.companyName || "",
    streetName: data.streetName || "",
    additionalInfo: data.additionalInfo || ""
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

async function getAddresses(uid) {
  const snapshot = await admin.firestore()
    .collection("users")
    .doc(uid)
    .collection("addresses")
    .limit(50)
    .get();

  return snapshot.docs.map(serializeAddress).sort(function (first, second) {
    return Number(Boolean(second.isDefault)) - Number(Boolean(first.isDefault));
  });
}

function getCartSummary(cartItems) {
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

function getCheckoutDetails(body, profile) {
  const fulfillmentMethod = cleanFulfillmentMethod(body.fulfillmentMethod);
  const usesDelivery = fulfillmentMethod === "delivery";
  const addressType = usesDelivery ? cleanAddressType(body.addressType || profile.addressType) : "";

  return {
    fullName: cleanString(body.fullName || body.userName || profile.fullName, 80),
    email: cleanString(body.email || profile.email, 160),
    phone: cleanString(body.phone || profile.phone, 30),
    paymentMethod: cleanString(body.paymentMethod || "Instapay", 80),
    fulfillmentMethod,
    customerNote: cleanString(body.customerNote || body.note || "", 1000),
    addressType,
    buildingName: usesDelivery ? cleanString(body.buildingName || "", 80) : "",
    apartmentNumber: usesDelivery ? cleanString(body.apartmentNumber || "", 40) : "",
    floorNumber: usesDelivery ? cleanString(body.floorNumber || "", 40) : "",
    houseNumber: usesDelivery ? cleanString(body.houseNumber || "", 40) : "",
    officeName: usesDelivery ? cleanString(body.officeName || "", 80) : "",
    companyName: usesDelivery ? cleanString(body.companyName || "", 80) : "",
    streetName: usesDelivery ? cleanString(body.streetName || "", 120) : "",
    additionalInfo: usesDelivery ? cleanString(body.additionalInfo || "", 500) : ""
  };
}

async function handleGet(req, res, uid) {
  const profile = await getProfile(uid);
  const cartItems = await getCartItems(uid);
  const addresses = await getAddresses(uid);
  const summary = getCartSummary(cartItems);

  return res.status(200).json({
    success: true,
    profile,
    cartItems,
    addresses,
    itemCount: summary.itemCount,
    totalValue: summary.totalValue,
    totalText: summary.totalText
  });
}

async function handlePost(req, res, uid) {
  await consumeRateLimit({
    bucket: "checkout-submit",
    keyParts: [uid, getClientIp(req)],
    firstLimit: 5,
    secondLimit: 10,
    firstLockMs: THIRTY_MINUTES_MS,
    secondLockMs: ONE_HOUR_MS,
    errorMessage: "Too many order submissions."
  });

  const db = admin.firestore();
  const profile = await getProfile(uid);
  const cartItems = await getCartItems(uid);
  const summary = getCartSummary(cartItems);
  const details = getCheckoutDetails(req.body || {}, profile);

  if (!cartItems.length) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  if (!details.fullName || !details.email || !details.phone) {
    return res.status(400).json({ error: "Please complete your contact details." });
  }

  const orderRef = db.collection("orders").doc();
  const orderNumber = createOrderNumber();

  const orderData = {
    orderNumber,
    userId: uid,
    userName: details.fullName,
    userEmail: details.email,
    phone: details.phone,
    paymentMethod: details.paymentMethod,
    fulfillmentMethod: details.fulfillmentMethod,
    customerNote: details.customerNote,
    addressType: details.addressType,
    buildingName: details.buildingName,
    apartmentNumber: details.apartmentNumber,
    floorNumber: details.floorNumber,
    houseNumber: details.houseNumber,
    officeName: details.officeName,
    companyName: details.companyName,
    streetName: details.streetName,
    additionalInfo: details.additionalInfo,
    items: cartItems,
    itemCount: summary.itemCount,
    totalValue: summary.totalValue,
    totalText: summary.totalText,
    status: "submitted",
    paymentStatus: "not_paid",
    adminNote: "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  const cartSnapshot = await db
    .collection("users")
    .doc(uid)
    .collection("cartItems")
    .get();

  const batch = db.batch();

  batch.set(orderRef, orderData);

  batch.set(db.collection("users").doc(uid), {
    fullName: details.fullName,
    phone: details.phone,
    email: details.email,
    addressType: details.addressType,
    buildingName: details.buildingName,
    apartmentNumber: details.apartmentNumber,
    floorNumber: details.floorNumber,
    houseNumber: details.houseNumber,
    officeName: details.officeName,
    companyName: details.companyName,
    streetName: details.streetName,
    additionalInfo: details.additionalInfo,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  cartSnapshot.docs.forEach(function (cartDoc) {
    batch.delete(cartDoc.ref);
  });

  await batch.commit();

  return res.status(200).json({
    success: true,
    orderId: orderRef.id,
    orderNumber
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

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not process checkout."
    });
  }
};
