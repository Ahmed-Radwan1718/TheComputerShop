const routes = {
  "account-addresses": require("../server/routes/account-addresses"),
  "account-orders": require("../server/routes/account-orders"),
  "account-profile": require("../server/routes/account-profile"),
  "admin-support-tickets": require("../server/routes/admin-support-tickets"),
  "cart": require("../server/routes/cart"),
  "change-email": require("../server/routes/change-email"),
  "change-password": require("../server/routes/change-password"),
  "checkout": require("../server/routes/checkout"),
  "client-token": require("../server/routes/client-token"),
  "disable-authenticator": require("../server/routes/disable-authenticator"),
  "forgot-password": require("../server/routes/forgot-password"),
  "login": require("../server/routes/login"),
  "login-send-email-code": require("../server/routes/login-send-email-code"),
  "login-verify-authenticator": require("../server/routes/login-verify-authenticator"),
  "login-verify-email-code": require("../server/routes/login-verify-email-code"),
  "logout": require("../server/routes/logout"),
  "me": require("../server/routes/me"),
  "saved-items": require("../server/routes/saved-items"),
  "security-unlock-status": require("../server/routes/security-unlock-status"),
  "send-email-verification": require("../server/routes/send-email-verification"),
  "send-security-code": require("../server/routes/send-security-code"),
  "set-email-2fa": require("../server/routes/set-email-2fa"),
  "setup-authenticator": require("../server/routes/setup-authenticator"),
  "sign-out-everywhere": require("../server/routes/sign-out-everywhere"),
  "signup": require("../server/routes/signup"),
  "support-tickets": require("../server/routes/support-tickets"),
  "verify-authenticator-setup": require("../server/routes/verify-authenticator-setup"),
  "verify-login-authenticator": require("../server/routes/verify-login-authenticator"),
  "verify-security-code": require("../server/routes/verify-security-code")
};

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
  const routeHandler = routes[routeName];

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
