const admin = require("./_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("./_lib/securityHelpers");

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

function cleanQuantity(value) {
  const quantity = Math.floor(Number(value || 1));

  if (!Number.isFinite(quantity) || quantity < 1) {
    return 1;
  }

  return Math.min(quantity, 99);
}

function serializeOrder(orderDoc) {
  const data = orderDoc.data() || {};
  const items = Array.isArray(data.items) ? data.items : [];

  return {
    id: orderDoc.id,
    orderNumber: data.orderNumber || "Order Request",
    userId: data.userId || "",
    userName: data.userName || "",
    userEmail: data.userEmail || "",
    phone: data.phone || "",
    paymentMethod: data.paymentMethod || "",
    addressType: data.addressType || "",
    buildingName: data.buildingName || "",
    apartmentNumber: data.apartmentNumber || "",
    floorNumber: data.floorNumber || "",
    houseNumber: data.houseNumber || "",
    officeName: data.officeName || "",
    companyName: data.companyName || "",
    streetName: data.streetName || "",
    additionalInfo: data.additionalInfo || "",
    customerNote: data.customerNote || "",
    items: items.map(function (item) {
      return {
        id: item.id || "",
        name: item.name || "Product",
        category: item.category || "Product",
        specsLine: item.specsLine || "",
        priceText: item.priceText || "Price pending confirmation",
        priceNumber: typeof item.priceNumber === "number" ? item.priceNumber : null,
        image: item.image || "",
        url: item.url || "",
        quantity: cleanQuantity(item.quantity || 1)
      };
    }),
    itemCount: Number(data.itemCount || 0),
    totalValue: typeof data.totalValue === "number" ? data.totalValue : null,
    totalText: data.totalText || "Final price to be confirmed",
    status: data.status || "submitted",
    paymentStatus: data.paymentStatus || "not_paid",
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
}

function getOrderTime(order) {
  const date = new Date(order.updatedAt || order.createdAt || 0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
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
    return res.status(error.statusCode || 401).json({
      error: error.message || "Please log in again."
    });
  }
};
