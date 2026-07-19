const admin = require("../_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("../_lib/securityHelpers");

const ADMIN_EMAILS = ["ahmedradwan21@gmail.com"];
const VALID_STATUSES = ["open", "pending", "answered", "resolved", "closed"];
const VALID_ORDER_STATUSES = ["submitted", "reviewing", "awaiting_payment", "preparing_order", "ready_for_delivery_pickup", "out_for_delivery", "fulfilled", "canceled"];
const VALID_PAYMENT_STATUSES = ["not_paid", "pending", "paid", "refunded"];
const VALID_PRODUCT_STOCK_STATUSES = ["in_stock", "unavailable"];

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanDocumentId(value) {
  const documentId = cleanString(value, 120);

  if (!documentId || documentId.includes("/")) {
    return "";
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(documentId)) {
    return "";
  }

  return documentId;
}

function cleanTicketId(value) {
  return cleanDocumentId(value);
}

function cleanOrderId(value) {
  return cleanDocumentId(value);
}

function cleanProductId(value) {
  return cleanDocumentId(value);
}

function cleanStatus(value) {
  const status = cleanString(value, 40);
  return VALID_STATUSES.includes(status) ? status : "open";
}

function cleanOrderStatus(value) {
  const status = cleanString(value, 40);

  if (status === "completed") {
    return "fulfilled";
  }

  return VALID_ORDER_STATUSES.includes(status) ? status : "submitted";
}

function cleanPaymentStatus(value) {
  const status = cleanString(value, 40);
  return VALID_PAYMENT_STATUSES.includes(status) ? status : "not_paid";
}

function cleanProductStockStatus(value) {
  const status = cleanString(value, 40);
  return VALID_PRODUCT_STOCK_STATUSES.includes(status) ? status : "in_stock";
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

function serializeTicket(ticketDoc) {
  const data = ticketDoc.data() || {};
  const messages = Array.isArray(data.messages) ? data.messages : [];

  return {
    id: ticketDoc.id,
    userId: data.userId || "",
    userName: data.userName || "Customer",
    userEmail: data.userEmail || "",
    category: data.category || "Support",
    subject: data.subject || "Support Ticket",
    message: data.message || "",
    status: data.status || "open",
    lastMessageFrom: data.lastMessageFrom || "customer",
    adminNote: data.adminNote || "",
    messages: messages.map(function (message) {
      return {
        sender: message.sender || "customer",
        name: message.name || "",
        email: message.email || "",
        message: message.message || "",
        createdAt: message.createdAt || null
      };
    }),
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
}

function getTicketTime(ticket) {
  const date = new Date(ticket.updatedAt || ticket.createdAt || 0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function serializeOrder(orderDoc) {
  const data = orderDoc.data() || {};
  const items = Array.isArray(data.items) ? data.items : [];

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
    locationLatitude: data.locationLatitude || "",
    locationLongitude: data.locationLongitude || "",
    locationMapUrl: data.locationMapUrl || "",
    items: items.map(function (item) {
      return {
        id: item.id || "",
        name: item.name || "Product",
        category: item.category || "",
        url: item.url || "",
        image: item.image || "",
        price: item.price || item.priceText || "",
        priceText: item.priceText || item.price || "",
        priceValue: Number(item.priceValue || 0),
        quantity: Math.max(1, Math.min(99, Number(item.quantity || 1))),
        lineTotalValue: Number(item.lineTotalValue || 0),
        lineTotalText: item.lineTotalText || ""
      };
    }),
    itemCount: Number(data.itemCount || items.length || 0),
    totalValue: Number(data.totalValue || 0),
    totalText: data.totalText || "",
    status: data.status === "completed" ? "fulfilled" : (data.status || "submitted"),
    paymentStatus: data.paymentStatus || "not_paid",
    adminNote: data.adminNote || "",
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
}

function getOrderTime(order) {
  const date = new Date(order.updatedAt || order.createdAt || 0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function serializeProductStock(productDoc) {
  const data = productDoc.data() || {};
  const status = VALID_PRODUCT_STOCK_STATUSES.includes(data.status) ? data.status : "in_stock";

  return {
    id: productDoc.id,
    productId: data.productId || productDoc.id,
    status,
    updatedBy: data.updatedBy || "",
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
}

function getProductStockTime(productStock) {
  const date = new Date(productStock.updatedAt || productStock.createdAt || 0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

async function requireAdmin(decodedUser) {
  const userRecord = await admin.auth().getUser(decodedUser.uid);
  const email = userRecord.email || decodedUser.email || "";

  if (!ADMIN_EMAILS.includes(email)) {
    const error = new Error("You do not have permission to view this page.");
    error.statusCode = 403;
    throw error;
  }

  return { email };
}

async function handleGetTickets(res) {
  const snapshot = await admin.firestore()
    .collection("supportTickets")
    .limit(300)
    .get();

  const tickets = snapshot.docs
    .map(serializeTicket)
    .sort(function (a, b) {
      return getTicketTime(b) - getTicketTime(a);
    });

  return res.status(200).json({
    success: true,
    tickets
  });
}

async function handleGetOrders(res) {
  const snapshot = await admin.firestore()
    .collection("orders")
    .limit(300)
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

async function getProductStockRecords() {
  const snapshot = await admin.firestore()
    .collection("productStock")
    .limit(1000)
    .get();

  return snapshot.docs
    .map(serializeProductStock)
    .sort(function (a, b) {
      return getProductStockTime(b) - getProductStockTime(a);
    });
}

async function handleGetProductStock(res) {
  const productStock = await getProductStockRecords();

  return res.status(200).json({
    success: true,
    productStock
  });
}

function getRealtimeDatabaseUrl() {
  return String(process.env.FIREBASE_DATABASE_URL || "").trim().replace(/\/+$/, "");
}

function encodeRealtimeKey(value) {
  return encodeURIComponent(String(value || "")).replace(/\./g, "%2E");
}

async function updatePublicStockMirror(productId, status) {
  const realtimeDatabaseUrl = getRealtimeDatabaseUrl();

  if (!realtimeDatabaseUrl || !productId) {
    return;
  }

  try {
    const stockRef = admin.database().ref("publicStock/unavailable").child(encodeRealtimeKey(productId));

    if (status === "unavailable") {
      await stockRef.set({
        status: "unavailable",
        updatedAt: new Date().toISOString()
      });
      return;
    }

    await stockRef.remove();
  } catch (error) {
    console.error("Could not update realtime public stock mirror.", error);
  }
}

async function handleGetPublicStock(res) {
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=900, stale-while-revalidate=3600");
  res.setHeader("CDN-Cache-Control", "public, max-age=900, stale-while-revalidate=3600");
  res.setHeader("Vercel-CDN-Cache-Control", "public, max-age=900, stale-while-revalidate=3600");

  const snapshot = await admin.firestore()
    .collection("productStock")
    .where("status", "==", "unavailable")
    .limit(1000)
    .get();
  const stock = {};

  snapshot.docs.map(serializeProductStock).forEach(function (item) {
    stock[item.productId] = {
      status: item.status,
      updatedAt: item.updatedAt
    };
  });

  return res.status(200).json({
    success: true,
    stock,
    realtimeDatabaseUrl: getRealtimeDatabaseUrl()
  });
}

async function handleGet(req, res) {
  const type = String((req.query || {}).type || "").trim();

  if (type === "orders") {
    return await handleGetOrders(res);
  }

  if (type === "product-stock") {
    return await handleGetProductStock(res);
  }

  return await handleGetTickets(res);
}

async function handleStatus(req, res) {
  const db = admin.firestore();
  const ticketId = cleanTicketId((req.body || {}).ticketId);
  const status = cleanStatus((req.body || {}).status);

  if (!ticketId) {
    return res.status(400).json({ error: "Missing support ticket id." });
  }

  const ticketRef = db.collection("supportTickets").doc(ticketId);
  const ticketDoc = await ticketRef.get();

  if (!ticketDoc.exists) {
    return res.status(404).json({ error: "Support ticket not found." });
  }

  await ticketRef.update({
    status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  const updatedTicket = await ticketRef.get();

  return res.status(200).json({
    success: true,
    ticket: serializeTicket(updatedTicket)
  });
}

async function handleOrderUpdate(req, res) {
  const db = admin.firestore();
  const orderId = cleanOrderId((req.body || {}).orderId);
  const status = cleanOrderStatus((req.body || {}).status);
  const paymentStatus = cleanPaymentStatus((req.body || {}).paymentStatus);
  const adminNote = cleanString((req.body || {}).adminNote, 1500);

  if (!orderId) {
    return res.status(400).json({ error: "Missing order id." });
  }

  const orderRef = db.collection("orders").doc(orderId);
  const orderDoc = await orderRef.get();

  if (!orderDoc.exists) {
    return res.status(404).json({ error: "Order not found." });
  }

  const responseData = Object.assign({}, orderDoc.data() || {}, {
    status,
    paymentStatus,
    adminNote,
    updatedAt: new Date().toISOString()
  });

  await orderRef.update({
    status,
    paymentStatus,
    adminNote,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return res.status(200).json({
    success: true,
    order: serializeOrder({
      id: orderDoc.id,
      data: function () {
        return responseData;
      }
    })
  });
}

async function handleOrderDelete(req, res) {
  const db = admin.firestore();
  const orderId = cleanOrderId((req.body || {}).orderId);

  if (!orderId) {
    return res.status(400).json({ error: "Missing order id." });
  }

  const orderRef = db.collection("orders").doc(orderId);
  const orderDoc = await orderRef.get();

  if (!orderDoc.exists) {
    return res.status(404).json({ error: "Order not found." });
  }

  await orderRef.delete();

  return res.status(200).json({
    success: true,
    orderId
  });
}

async function handleProductStockUpdate(req, res, adminUser) {
  const db = admin.firestore();
  const productId = cleanProductId((req.body || {}).productId);
  const status = cleanProductStockStatus((req.body || {}).status);

  if (!productId) {
    return res.status(400).json({ error: "Missing product id." });
  }

  const productRef = db.collection("productStock").doc(productId);
  const productDoc = await productRef.get();
  const existingData = productDoc.exists ? productDoc.data() || {} : {};

  await productRef.set({
    productId,
    status,
    updatedBy: adminUser.email,
    createdAt: existingData.createdAt || admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  await updatePublicStockMirror(productId, status);

  const updatedProduct = await productRef.get();

  return res.status(200).json({
    success: true,
    productStock: serializeProductStock(updatedProduct)
  });
}

async function handleTicketDelete(req, res) {
  const db = admin.firestore();
  const ticketId = cleanTicketId((req.body || {}).ticketId);

  if (!ticketId) {
    return res.status(400).json({ error: "Missing support ticket id." });
  }

  const ticketRef = db.collection("supportTickets").doc(ticketId);
  const ticketDoc = await ticketRef.get();

  if (!ticketDoc.exists) {
    return res.status(404).json({ error: "Support ticket not found." });
  }

  await ticketRef.delete();

  return res.status(200).json({
    success: true,
    ticketId
  });
}

async function handleReply(req, res, adminUser) {
  const db = admin.firestore();
  const ticketId = cleanTicketId((req.body || {}).ticketId);
  const replyText = cleanString((req.body || {}).message, 1500);

  if (!ticketId) {
    return res.status(400).json({ error: "Missing support ticket id." });
  }

  if (!replyText) {
    return res.status(400).json({ error: "Please enter a reply." });
  }

  const ticketRef = db.collection("supportTickets").doc(ticketId);

  await db.runTransaction(async function (transaction) {
    const ticketDoc = await transaction.get(ticketRef);

    if (!ticketDoc.exists) {
      const error = new Error("Support ticket not found.");
      error.statusCode = 404;
      throw error;
    }

    const ticketData = ticketDoc.data() || {};
    const messages = Array.isArray(ticketData.messages) ? ticketData.messages : [];

    transaction.update(ticketRef, {
      status: "answered",
      lastMessageFrom: "admin",
      messages: messages.concat([
        {
          sender: "admin",
          name: "The Computer Shop",
          email: adminUser.email,
          message: replyText,
          createdAt: new Date().toISOString()
        }
      ]),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  const updatedTicket = await ticketRef.get();

  return res.status(200).json({
    success: true,
    ticket: serializeTicket(updatedTicket)
  });
}

module.exports = async function handler(req, res) {
  try {
    const requestType = String((req.query || {}).type || "").trim();

    if (req.method === "GET" && requestType === "stock-public") {
      return await handleGetPublicStock(res);
    }

    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    const adminUser = await requireAdmin(decodedUser);

    if (req.method === "GET") {
      return await handleGet(req, res);
    }

    if (req.method === "POST") {
      const action = String((req.body || {}).action || "").trim();

      if (action === "order-update") {
        return await handleOrderUpdate(req, res);
      }

      if (action === "order-delete") {
        return await handleOrderDelete(req, res);
      }

      if (action === "product-stock-update") {
        return await handleProductStockUpdate(req, res, adminUser);
      }

      if (action === "delete") {
        return await handleTicketDelete(req, res);
      }

      if (action === "status") {
        return await handleStatus(req, res);
      }

      if (action === "reply") {
        return await handleReply(req, res, adminUser);
      }

      return res.status(400).json({ error: "Invalid admin action." });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not process admin request."
    });
  }
};

module.exports.ADMIN_EMAILS = ADMIN_EMAILS;
