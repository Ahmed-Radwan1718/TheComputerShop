const admin = require("../_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("../_lib/securityHelpers");

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

function serializeOrder(orderDoc) {
  const data = orderDoc.data() || {};

  return {
    id: orderDoc.id,
    orderNumber: data.orderNumber || "",
    userId: data.userId || "",
    userName: data.userName || "",
    userEmail: data.userEmail || "",
    phone: data.phone || "",
    paymentMethod: data.paymentMethod || "",
    customerNote: data.customerNote || "",
    addressType: data.addressType || "",
    buildingName: data.buildingName || "",
    apartmentNumber: data.apartmentNumber || "",
    floorNumber: data.floorNumber || "",
    houseNumber: data.houseNumber || "",
    officeName: data.officeName || "",
    companyName: data.companyName || "",
    streetName: data.streetName || "",
    additionalInfo: data.additionalInfo || "",
    items: Array.isArray(data.items) ? data.items : [],
    itemCount: Number(data.itemCount || 0),
    totalValue: Number(data.totalValue || 0),
    totalText: data.totalText || "",
    status: data.status || "submitted",
    paymentStatus: data.paymentStatus || "not_paid",
    adminNote: data.adminNote || "",
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
}

const USER_CANCELABLE_ORDER_STATUSES = ["submitted", "reviewing", "quoted", "awaiting_payment", "confirmed"];

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanOrderId(value) {
  const orderId = cleanString(value, 120);

  if (!orderId || orderId.includes("/") || !/^[a-zA-Z0-9_-]+$/.test(orderId)) {
    return "";
  }

  return orderId;
}

function getOrderTime(order) {
  const date = new Date(order.updatedAt || order.createdAt || 0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function canUserCancelOrderStatus(status) {
  return USER_CANCELABLE_ORDER_STATUSES.includes(status || "submitted");
}

async function handleGetOrders(decodedUser, res) {
  const snapshot = await admin.firestore()
    .collection("orders")
    .where("userId", "==", decodedUser.uid)
    .limit(100)
    .get();

  const orders = snapshot.docs
    .map(serializeOrder)
    .sort(function (a, b) {
      return getOrderTime(b) - getOrderTime(a);
    });

  return res.status(200).json({
    success: true,
    orders
  });
}

async function handleCancelOrder(req, res, decodedUser) {
  const action = cleanString((req.body || {}).action, 40);
  const orderId = cleanOrderId((req.body || {}).orderId);

  if (action !== "cancel-order") {
    return res.status(400).json({ error: "Invalid order action." });
  }

  if (!orderId) {
    return res.status(400).json({ error: "Missing order id." });
  }

  const db = admin.firestore();
  const orderRef = db.collection("orders").doc(orderId);

  await db.runTransaction(async function (transaction) {
    const orderDoc = await transaction.get(orderRef);

    if (!orderDoc.exists) {
      throw createHttpError(404, "Order not found.");
    }

    const data = orderDoc.data() || {};

    if (data.userId !== decodedUser.uid) {
      throw createHttpError(404, "Order not found.");
    }

    const currentStatus = data.status === "completed" ? "fulfilled" : (data.status || "submitted");

    if (!canUserCancelOrderStatus(currentStatus)) {
      throw createHttpError(409, "This order can no longer be canceled.");
    }

    transaction.update(orderRef, {
      status: "canceled",
      canceledBy: decodedUser.uid,
      canceledAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  const updatedOrderDoc = await orderRef.get();

  return res.status(200).json({
    success: true,
    order: serializeOrder(updatedOrderDoc)
  });
}

module.exports = async function handler(req, res) {
  try {
    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    if (req.method === "GET") {
      return await handleGetOrders(decodedUser, res);
    }

    if (req.method === "POST") {
      return await handleCancelOrder(req, res, decodedUser);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || (req.method === "GET" ? "Could not load order history." : "Could not update order.")
    });
  }
};
