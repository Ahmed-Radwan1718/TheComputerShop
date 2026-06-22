const crypto = require("crypto");
const admin = require("./_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("./_lib/securityHelpers");

const VALID_ADDRESS_TYPES = ["apartment", "house", "office"];
const VALID_PAYMENT_METHODS = [
  "Cash on Delivery",
  "Cash on Pickup",
  "Bank Transfer",
  "Instapay",
  "To be confirmed"
];

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanAddressType(value) {
  const addressType = cleanString(value, 40);
  return VALID_ADDRESS_TYPES.includes(addressType) ? addressType : "apartment";
}

function cleanPaymentMethod(value) {
  const paymentMethod = cleanString(value, 80);
  return VALID_PAYMENT_METHODS.includes(paymentMethod) ? paymentMethod : "To be confirmed";
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

function serializeAddress(addressDoc) {
  const data = addressDoc.data() || {};

  return {
    id: addressDoc.id,
    label: data.label || "Saved Address",
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

function getCartTotalValue(cart) {
  const hasKnownPrices = cart.length > 0 && cart.every(function (item) {
    return typeof item.priceNumber === "number";
  });

  if (!hasKnownPrices) {
    return null;
  }

  return cart.reduce(function (sum, item) {
    return sum + Number(item.priceNumber || 0) * Number(item.quantity || 0);
  }, 0);
}

function getCartItemCount(cart) {
  return cart.reduce(function (total, item) {
    return total + Number(item.quantity || 0);
  }, 0);
}

function createOrderNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase();

  return "TCS-" + year + month + day + "-" + randomPart;
}

function getCheckoutDetails(body) {
  return {
    fullName: cleanString(body.fullName, 80),
    phone: cleanString(body.phone, 30),
    paymentMethod: cleanPaymentMethod(body.paymentMethod),
    addressType: cleanAddressType(body.addressType),
    buildingName: cleanString(body.buildingName, 160),
    apartmentNumber: cleanString(body.apartmentNumber, 80),
    floorNumber: cleanString(body.floorNumber, 80),
    houseNumber: cleanString(body.houseNumber, 80),
    officeName: cleanString(body.officeName, 160),
    companyName: cleanString(body.companyName, 160),
    streetName: cleanString(body.streetName, 120),
    additionalInfo: cleanString(body.additionalInfo, 500),
    customerNote: cleanString(body.customerNote, 1000)
  };
}

async function getCartSnapshot(uid) {
  return await admin.firestore()
    .collection("users")
    .doc(uid)
    .collection("cartItems")
    .orderBy("updatedAt", "desc")
    .limit(100)
    .get();
}

async function getCartItems(uid) {
  const snapshot = await getCartSnapshot(uid);
  return snapshot.docs.map(serializeCartItem);
}

async function getSavedAddresses(uid) {
  const snapshot = await admin.firestore()
    .collection("users")
    .doc(uid)
    .collection("addresses")
    .orderBy("updatedAt", "desc")
    .limit(50)
    .get();

  return snapshot.docs.map(serializeAddress);
}

async function getUserProfile(uid) {
  const db = admin.firestore();
  const userRecord = await admin.auth().getUser(uid);
  const userDoc = await db.collection("users").doc(uid).get();
  const userData = userDoc.exists ? userDoc.data() : {};

  return {
    uid,
    email: userRecord.email || userData.email || "",
    fullName: userData.fullName || userRecord.displayName || "",
    phone: userData.phone || "",
    addressType: userData.addressType || "apartment",
    buildingName: userData.buildingName || "",
    apartmentNumber: userData.apartmentNumber || "",
    floorNumber: userData.floorNumber || "",
    houseNumber: userData.houseNumber || "",
    officeName: userData.officeName || "",
    companyName: userData.companyName || "",
    streetName: userData.streetName || "",
    additionalInfo: userData.additionalInfo || ""
  };
}

async function handleGet(req, res, uid) {
  const profile = await getUserProfile(uid);
  const cartItems = await getCartItems(uid);
  const addresses = await getSavedAddresses(uid);
  const totalValue = getCartTotalValue(cartItems);

  return res.status(200).json({
    success: true,
    profile,
    cartItems,
    addresses,
    itemCount: getCartItemCount(cartItems),
    totalValue,
    totalText: totalValue === null ? "Final price to be confirmed" : totalValue.toLocaleString() + " EGP"
  });
}

async function clearCart(uid) {
  const db = admin.firestore();
  const cartSnapshot = await getCartSnapshot(uid);
  const batch = db.batch();

  cartSnapshot.docs.forEach(function (cartDoc) {
    batch.delete(cartDoc.ref);
  });

  await batch.commit();
}

async function handlePost(req, res, uid) {
  const db = admin.firestore();
  const profile = await getUserProfile(uid);
  const details = getCheckoutDetails(req.body || {});
  const cartItems = await getCartItems(uid);

  if (!cartItems.length) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  if (!details.fullName || !details.phone || !details.streetName) {
    return res.status(400).json({
      error: "Please enter your name, phone number, and street name."
    });
  }

  const totalValue = getCartTotalValue(cartItems);
  const orderNumber = createOrderNumber();

  const orderData = {
    orderNumber,
    userId: uid,
    userName: details.fullName,
    userEmail: profile.email || "",
    phone: details.phone,
    paymentMethod: details.paymentMethod,
    addressType: details.addressType,
    buildingName: details.buildingName,
    apartmentNumber: details.apartmentNumber,
    floorNumber: details.floorNumber,
    houseNumber: details.houseNumber,
    officeName: details.officeName,
    companyName: details.companyName,
    streetName: details.streetName,
    additionalInfo: details.additionalInfo,
    customerNote: details.customerNote,
    items: cartItems.map(function (item) {
      return {
        id: item.id || "",
        name: item.name || "Product",
        category: item.category || "Product",
        specsLine: item.specsLine || "",
        priceText: item.priceText || "Price pending confirmation",
        priceNumber: typeof item.priceNumber === "number" ? item.priceNumber : null,
        image: item.image || "",
        url: item.url || "",
        quantity: Number(item.quantity || 1)
      };
    }),
    itemCount: getCartItemCount(cartItems),
    totalValue,
    totalText: totalValue === null ? "Final price to be confirmed" : totalValue.toLocaleString() + " EGP",
    status: "submitted",
    paymentStatus: "not_paid",
    adminNote: "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection("orders").add(orderData);

  await db.collection("users").doc(uid).set({
    fullName: details.fullName,
    phone: details.phone,
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

  await clearCart(uid);

  return res.status(200).json({
    success: true,
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
    return res.status(error.statusCode || 401).json({
      error: error.message || "Please log in again."
    });
  }
};
