const admin = require("./_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("./_lib/securityHelpers");

const {
  getClientIp,
  consumeRateLimit,
  THIRTY_MINUTES_MS,
  ONE_HOUR_MS
} = require("./_lib/rateLimitHelpers");

const VALID_CATEGORIES = [
  "General Question",
  "Product Question",
  "Build Consultation",
  "Order Help",
  "Warranty / Return"
];

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanTicketId(value) {
  const ticketId = cleanString(value, 120);

  if (!ticketId || ticketId.includes("/")) {
    return "";
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(ticketId)) {
    return "";
  }

  return ticketId;
}

function cleanCategory(value) {
  const category = cleanString(value, 80);
  return VALID_CATEGORIES.includes(category) ? category : "General Question";
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
    category: data.category || "General Question",
    subject: data.subject || "Support Request",
    message: data.message || "",
    status: data.status || "open",
    lastMessageFrom: data.lastMessageFrom || "customer",
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

async function rateLimitSupportAction(req, uid) {
  await consumeRateLimit({
    bucket: "support-ticket-action",
    keyParts: [uid, getClientIp(req)],
    firstLimit: 10,
    secondLimit: 20,
    firstLockMs: THIRTY_MINUTES_MS,
    secondLockMs: ONE_HOUR_MS,
    errorMessage: "Too many support actions."
  });
}

async function getUserIdentity(uid) {
  const db = admin.firestore();
  const userRecord = await admin.auth().getUser(uid);
  const userDoc = await db.collection("users").doc(uid).get();
  const userData = userDoc.exists ? userDoc.data() : {};

  return {
    uid,
    email: userRecord.email || userData.email || "",
    fullName: userData.fullName || userRecord.displayName || "Customer"
  };
}

async function listTickets(uid) {
  const snapshot = await admin.firestore()
    .collection("supportTickets")
    .where("userId", "==", uid)
    .limit(100)
    .get();

  return snapshot.docs
    .map(serializeTicket)
    .sort(function (a, b) {
      return getTicketTime(b) - getTicketTime(a);
    });
}

async function handleGet(req, res, uid) {
  const tickets = await listTickets(uid);

  return res.status(200).json({
    success: true,
    tickets
  });
}

async function handleCreate(req, res, uid) {
  await rateLimitSupportAction(req, uid);

  const db = admin.firestore();
  const identity = await getUserIdentity(uid);

  const category = cleanCategory((req.body || {}).category);
  const subject = cleanString((req.body || {}).subject, 160);
  const message = cleanString((req.body || {}).message, 1500);

  if (!subject || !message) {
    return res.status(400).json({ error: "Please enter a subject and message." });
  }

  const ticketRef = await db.collection("supportTickets").add({
    userId: uid,
    userName: identity.fullName || "Customer",
    userEmail: identity.email || "",
    category,
    subject,
    message,
    status: "open",
    lastMessageFrom: "customer",
    messages: [
      {
        sender: "customer",
        name: identity.fullName || "Customer",
        email: identity.email || "",
        message,
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  const savedTicket = await ticketRef.get();

  return res.status(200).json({
    success: true,
    ticket: serializeTicket(savedTicket)
  });
}

async function handleReply(req, res, uid) {
  await rateLimitSupportAction(req, uid);

  const db = admin.firestore();
  const identity = await getUserIdentity(uid);
  const ticketId = cleanTicketId((req.body || {}).ticketId);
  const replyText = cleanString((req.body || {}).message, 1500);

  if (!ticketId) {
    return res.status(400).json({ error: "Missing support ticket id." });
  }

  if (!replyText) {
    return res.status(400).json({ error: "Please enter your reply." });
  }

  const ticketRef = db.collection("supportTickets").doc(ticketId);

  await db.runTransaction(async function (transaction) {
    const ticketDoc = await transaction.get(ticketRef);

    if (!ticketDoc.exists) {
      const error = new Error("Support request not found.");
      error.statusCode = 404;
      throw error;
    }

    const ticketData = ticketDoc.data() || {};

    if (ticketData.userId !== uid) {
      const error = new Error("You do not have access to this support request.");
      error.statusCode = 403;
      throw error;
    }

    if (ticketData.status === "closed" || ticketData.status === "resolved") {
      const error = new Error("This support request is already closed.");
      error.statusCode = 400;
      throw error;
    }

    const messages = Array.isArray(ticketData.messages) ? ticketData.messages : [];

    transaction.update(ticketRef, {
      status: "open",
      lastMessageFrom: "customer",
      messages: messages.concat([
        {
          sender: "customer",
          name: identity.fullName || "Customer",
          email: identity.email || "",
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

async function handleResolve(req, res, uid) {
  await rateLimitSupportAction(req, uid);

  const db = admin.firestore();
  const ticketId = cleanTicketId((req.body || {}).ticketId);

  if (!ticketId) {
    return res.status(400).json({ error: "Missing support ticket id." });
  }

  const ticketRef = db.collection("supportTickets").doc(ticketId);

  await db.runTransaction(async function (transaction) {
    const ticketDoc = await transaction.get(ticketRef);

    if (!ticketDoc.exists) {
      const error = new Error("Support request not found.");
      error.statusCode = 404;
      throw error;
    }

    const ticketData = ticketDoc.data() || {};

    if (ticketData.userId !== uid) {
      const error = new Error("You do not have access to this support request.");
      error.statusCode = 403;
      throw error;
    }

    transaction.update(ticketRef, {
      status: "resolved",
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
    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    if (req.method === "GET") {
      return await handleGet(req, res, decodedUser.uid);
    }

    if (req.method === "POST") {
      const action = String((req.body || {}).action || "").trim();

      if (action === "create") {
        return await handleCreate(req, res, decodedUser.uid);
      }

      if (action === "reply") {
        return await handleReply(req, res, decodedUser.uid);
      }

      if (action === "resolve") {
        return await handleResolve(req, res, decodedUser.uid);
      }

      return res.status(400).json({ error: "Invalid support request action." });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not process support request."
    });
  }
};
