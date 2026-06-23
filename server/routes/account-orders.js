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

function getOrderTime(order) {
  const date = new Date(order.updatedAt || order.createdAt || 0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

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
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not load order history."
    });
  }
};
