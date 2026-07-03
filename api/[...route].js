const admin = require("../server/_lib/firebaseAdmin");
const { Resend } = require("resend");

const {
  getUserFromRequest
} = require("../server/_lib/securityHelpers");

const {
  getClientIp,
  consumeRateLimit,
  THIRTY_MINUTES_MS,
  ONE_HOUR_MS
} = require("../server/_lib/rateLimitHelpers");

const resend = new Resend(process.env.RESEND_API_KEY);
const CONSULTATION_EMAIL_TO = process.env.CONSULTATION_EMAIL_TO || "The_Computer_Shop@icloud.com";

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return cleanString(value, 5000).replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character];
  });
}

function getRequestBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return Object.fromEntries(new URLSearchParams(req.body));
    }
  }

  return {};
}

function getField(body, name, maxLength) {
  return cleanString(body[name], maxLength);
}

function fieldRow(label, value) {
  const cleanValue = cleanString(value, 2000);

  if (!cleanValue) {
    return "";
  }

  return `
    <tr>
      <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: 700;">${escapeHtml(label)}</td>
      <td style="padding: 8px 12px; border: 1px solid #ddd;">${escapeHtml(cleanValue)}</td>
    </tr>
  `;
}

async function handleConsultationRequest(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    await consumeRateLimit({
      bucket: "consultation-submit",
      keyParts: [decodedUser.uid, getClientIp(req)],
      firstLimit: 5,
      secondLimit: 10,
      firstLockMs: THIRTY_MINUTES_MS,
      secondLockMs: ONE_HOUR_MS,
      errorMessage: "Too many consultation requests."
    });

    const body = getRequestBody(req);

    if (cleanString(body._honey, 120)) {
      return res.status(200).json({ success: true });
    }

    const db = admin.firestore();
    const userRecord = await admin.auth().getUser(decodedUser.uid);
    const userDoc = await db.collection("users").doc(decodedUser.uid).get();
    const userData = userDoc.exists ? userDoc.data() || {} : {};

    const accountName = userData.fullName || userRecord.displayName || "Customer";
    const accountEmail = userRecord.email || userData.email || decodedUser.email || "";

    const formType = getField(body, "Form Type", 120) || "Custom PC Consultation Request";
    const fullName = getField(body, "Full Name", 120);
    const phoneNumber = getField(body, "Phone Number", 80);
    const submittedEmail = getField(body, "email", 160) || accountEmail;
    const budget = getField(body, "Budget", 120);
    const mainUseCase = getField(body, "Main Use Case", 160);

    if (!fullName || !phoneNumber || !budget || !mainUseCase) {
      return res.status(400).json({ error: "Please complete all required consultation fields." });
    }

    const fields = {
      "Form Type": formType,
      "Full Name": fullName,
      "Phone Number": phoneNumber,
      "Email Address": submittedEmail,
      "Budget": budget,
      "Timeline": getField(body, "Timeline", 160),
      "Main Use Case": mainUseCase,
      "Games or Software Used": getField(body, "Games or Software Used", 500),
      "Target Resolution": getField(body, "Target Resolution", 120),
      "Performance Target": getField(body, "Performance Target", 500),
      "Preferred Look": getField(body, "Preferred Look", 160),
      "Preferred Brands": getField(body, "Preferred Brands", 300),
      "What do you need included?": getField(body, "What do you need included?", 160),
      "Notes": getField(body, "Notes", 1500),
      "Extra Details": getField(body, "Extra Details", 2000)
    };

    await db.collection("consultationRequests").add({
      userId: decodedUser.uid,
      accountName,
      accountEmail,
      fields,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      userAgent: cleanString(req.headers["user-agent"], 400)
    });

    await resend.emails.send({
      from: process.env.SECURITY_EMAIL_FROM,
      to: CONSULTATION_EMAIL_TO,
      subject: formType,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>${escapeHtml(formType)}</h2>
          <p><strong>Signed-in account:</strong> ${escapeHtml(accountName)} (${escapeHtml(accountEmail)})</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 760px;">
            ${Object.entries(fields).map(function ([label, value]) {
              return fieldRow(label, value);
            }).join("")}
          </table>
        </div>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      error: statusCode === 401
        ? "Please log in before submitting a consultation request."
        : error.message || "Could not submit consultation request."
    });
  }
}

const routeLoaders = {
  "account-addresses": function () { return require("../server/routes/account-addresses"); },
  "account-orders": function () { return require("../server/routes/account-orders"); },
  "account-profile": function () { return require("../server/routes/account-profile"); },
  "admin-support-tickets": function () { return require("../server/routes/admin-support-tickets"); },
  "cart": function () { return require("../server/routes/cart"); },
  "change-email": function () { return require("../server/routes/change-email"); },
  "change-password": function () { return require("../server/routes/change-password"); },
  "checkout": function () { return require("../server/routes/checkout"); },
  "client-token": function () { return require("../server/routes/client-token"); },
  "consultation": function () { return handleConsultationRequest; },
  "disable-authenticator": function () { return require("../server/routes/disable-authenticator"); },
  "forgot-password": function () { return require("../server/routes/forgot-password"); },
  "login": function () { return require("../server/routes/login"); },
  "login-send-email-code": function () { return require("../server/routes/login-send-email-code"); },
  "login-verify-authenticator": function () { return require("../server/routes/login-verify-authenticator"); },
  "login-verify-email-code": function () { return require("../server/routes/login-verify-email-code"); },
  "logout": function () { return require("../server/routes/logout"); },
  "me": function () { return require("../server/routes/me"); },
  "saved-items": function () { return require("../server/routes/saved-items"); },
  "security-unlock-status": function () { return require("../server/routes/security-unlock-status"); },
  "send-email-verification": function () { return require("../server/routes/send-email-verification"); },
  "send-security-code": function () { return require("../server/routes/send-security-code"); },
  "set-email-2fa": function () { return require("../server/routes/set-email-2fa"); },
  "setup-authenticator": function () { return require("../server/routes/setup-authenticator"); },
  "sign-out-everywhere": function () { return require("../server/routes/sign-out-everywhere"); },
  "sign-out-session": function () { return require("../server/routes/sign-out-everywhere").signOutSession; },
  "trusted-devices": function () { return require("../server/routes/sign-out-everywhere").trustedDevices; },
  "signup": function () { return require("../server/routes/signup"); },
  "support-tickets": function () { return require("../server/routes/support-tickets"); },
  "verify-authenticator-setup": function () { return require("../server/routes/verify-authenticator-setup"); },
  "verify-login-authenticator": function () { return require("../server/routes/verify-login-authenticator"); },
  "verify-security-code": function () { return require("../server/routes/verify-security-code"); }
};

const routeCache = {};

function getRouteHandler(routeName) {
  const routeLoader = routeLoaders[routeName];

  if (!routeLoader) {
    return null;
  }

  if (!Object.prototype.hasOwnProperty.call(routeCache, routeName)) {
    routeCache[routeName] = routeLoader();
  }

  return routeCache[routeName];
}

function getRouteName(req) {
  if (req.query && req.query.route) {
    return Array.isArray(req.query.route)
      ? req.query.route.join("/")
      : String(req.query.route || "");
  }

  const rawUrl = String(req.url || "");
  const pathOnly = rawUrl.split("?")[0];

  return decodeURIComponent(pathOnly)
    .replace(/^\/api\/?/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}

module.exports = async function handler(req, res) {
  const routeName = getRouteName(req);
  const routeHandler = getRouteHandler(routeName);

  if (!routeHandler) {
    return res.status(404).json({
      error: "API route not found.",
      route: routeName || "missing",
      url: req.url || "",
      query: req.query || {}
    });
  }

  return routeHandler(req, res);
};
