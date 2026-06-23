const admin = require("./_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("./_lib/securityHelpers");

const ADMIN_EMAILS = ["ahmedradwan21@gmail.com"];
const VALID_STATUSES = ["open", "pending", "answered", "resolved", "closed"];

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

function cleanStatus(value) {
  const status = cleanString(value, 40);
  return VALID_STATUSES.includes(status) ? status : "open";
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

async function requireAdmin(decodedUser) {
  const userRecord = await admin.auth().getUser(decodedUser.uid);
  const email = userRecord.email || decodedUser.email || "";

  if (!ADMIN_EMAILS.includes(email)) {
    const error = new Error("You do not have permission to view this page.");
    error.statusCode = 403;
    throw error;
  }

  return {
    email
  };
}

async function handleGet(req, res) {
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

      if (action === "status") {
        return await handleStatus(req, res);
      }

      if (action === "reply") {
        return await handleReply(req, res, adminUser);
      }

      return res.status(400).json({ error: "Invalid admin support action." });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not process admin support request."
    });
  }
};
