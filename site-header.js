(function () {
  const faviconHref = "favicon.png";
  const existingFavicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');

  if (existingFavicon) {
    existingFavicon.rel = "icon";
    existingFavicon.type = "image/png";
    existingFavicon.href = faviconHref;
  } else {
    const favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = faviconHref;
    document.head.appendChild(favicon);
  }

  const headerRoot = document.getElementById("site-header-root");

  if (!headerRoot) {
    return;
  }

  function setupLanguageSwitcher() {
    if (document.getElementById("tcs-language-switcher")) {
      return;
    }

    const languageStyles = document.createElement("style");
    languageStyles.id = "tcs-language-switcher-styles";
    languageStyles.textContent = `
      .tcs-language-switcher {
        position: fixed;
        top: 30px;
        right: 34px;
        z-index: 2400;
        font-family: Arial, sans-serif;
      }

      .tcs-language-toggle {
        width: 48px;
        height: 48px;
        padding: 0;
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 999px;
        background: rgba(24, 25, 24, 0.86);
        color: white;
        box-shadow: 0 18px 38px rgba(0, 0, 0, 0.34);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(16px);
        transition: transform 0.22s ease, border-color 0.22s ease, background 0.22s ease;
      }

      .tcs-language-toggle:hover {
        transform: translateY(-1px);
        border-color: rgba(255, 255, 255, 0.28);
        background: rgba(24, 25, 24, 0.96);
      }

      .tcs-language-toggle img {
        width: 26px;
        height: 26px;
        display: block;
        object-fit: contain;
        filter: invert(1);
      }

      .tcs-language-panel {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        min-width: 142px;
        padding: 8px;
        border: 1px solid rgba(255, 255, 255, 0.13);
        border-radius: 16px;
        background: rgba(24, 25, 24, 0.94);
        box-shadow: 0 18px 38px rgba(0, 0, 0, 0.34);
        backdrop-filter: blur(16px);
        display: grid;
        gap: 6px;
      }

      .tcs-language-panel[hidden] {
        display: none;
      }

      .tcs-language-option {
        width: 100%;
        min-height: 38px;
        padding: 0 12px;
        border: 0;
        border-radius: 12px;
        background: transparent;
        color: rgba(255, 255, 255, 0.78);
        font: inherit;
        font-size: 12px;
        font-weight: 700;
        text-align: left;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .tcs-language-flag {
        width: 28px;
        height: 20px;
        flex: 0 0 28px;
        border-radius: 3px;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: transparent;
      }

      .tcs-language-flag img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: contain;
        transform: none;
      }

      .tcs-language-option:hover {
        background: rgba(255, 255, 255, 0.09);
        color: white;
      }

      #google_translate_element {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
      }

      .goog-te-banner-frame,
      .goog-te-banner-frame.skiptranslate,
      iframe.goog-te-banner-frame,
      body > .skiptranslate:not(.tcs-language-switcher),
      .goog-te-gadget {
        display: none !important;
        visibility: hidden !important;
        width: 0 !important;
        height: 0 !important;
        border: 0 !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      html {
        margin-top: 0 !important;
      }

      body {
        top: 0 !important;
        margin-top: 0 !important;
      }

      @media (max-width: 1168px) {
        .tcs-language-switcher {
          top: 94px;
          right: 24px;
        }
      }

      @media (max-width: 900px) {
        .tcs-language-switcher {
          display: none;
        }
      }
    `;

    document.head.appendChild(languageStyles);

    const languageSwitcher = document.createElement("div");
    languageSwitcher.id = "tcs-language-switcher";
    languageSwitcher.className = "tcs-language-switcher skiptranslate notranslate";
    languageSwitcher.setAttribute("translate", "no");
    languageSwitcher.innerHTML = `
      <button class="tcs-language-toggle" id="tcs-language-toggle" type="button" aria-label="Change language" aria-expanded="false">
        <img src="language-icon.png" alt="">
      </button>

      <div class="tcs-language-panel" id="tcs-language-panel" hidden>
        <button class="tcs-language-option" type="button" data-tcs-language="en"><span class="tcs-language-flag" aria-hidden="true"><img src="united-states.png" alt=""></span><span>English</span></button>
        <button class="tcs-language-option" type="button" data-tcs-language="ar"><span class="tcs-language-flag" aria-hidden="true"><img src="egypt.png" alt=""></span><span>Arabic</span></button>
        <button class="tcs-language-option" type="button" data-tcs-language="fr"><span class="tcs-language-flag" aria-hidden="true"><img src="france.png" alt=""></span><span>French</span></button>
        <button class="tcs-language-option" type="button" data-tcs-language="de"><span class="tcs-language-flag" aria-hidden="true"><img src="germany.png" alt=""></span><span>German</span></button>
        <button class="tcs-language-option" type="button" data-tcs-language="es"><span class="tcs-language-flag" aria-hidden="true"><img src="spain.png" alt=""></span><span>Spanish</span></button>
      </div>

      <div id="google_translate_element" aria-hidden="true"></div>
    `;

    document.body.appendChild(languageSwitcher);

    const languageToggle = document.getElementById("tcs-language-toggle");
    const languagePanel = document.getElementById("tcs-language-panel");

    function closeLanguagePanel() {
      languagePanel.hidden = true;
      languageToggle.setAttribute("aria-expanded", "false");
    }

    function openLanguagePanel() {
      languagePanel.hidden = false;
      languageToggle.setAttribute("aria-expanded", "true");
    }

    function getCookieConsentChoice() {
      if (window.tcsCookieConsent && window.tcsCookieConsent.choice) {
        return window.tcsCookieConsent.choice;
      }

      const cookieMatch = document.cookie.split("; ").find(function (cookie) {
        return cookie.indexOf("tcs_cookie_consent=") === 0;
      });

      return cookieMatch ? decodeURIComponent(cookieMatch.split("=").slice(1).join("=")) : "";
    }

    function optionalPreferenceCookiesRejected() {
      return getCookieConsentChoice() === "rejected";
    }

    function clearGoogleTranslateCookie() {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

      if (window.location.hostname.includes(".")) {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=." + window.location.hostname.split(".").slice(-2).join(".");
      }
    }

    function setGoogleTranslateCookie(languageCode) {
      if (optionalPreferenceCookiesRejected()) {
        clearGoogleTranslateCookie();
        return false;
      }

      const cookieValue = "/en/" + languageCode;
      document.cookie = "googtrans=" + cookieValue + "; path=/";

      if (window.location.hostname.includes(".")) {
        document.cookie = "googtrans=" + cookieValue + "; path=/; domain=." + window.location.hostname.split(".").slice(-2).join(".");
      }

      return true;
    }

    window.addEventListener("tcs-cookie-consent-change", function (event) {
      if (event.detail && event.detail.optionalCookiesAllowed === false) {
        clearGoogleTranslateCookie();
      }
    });

    function protectProductNamesFromTranslation() {
      const productNameSelectors = [
        ".signature-build-card h3",
        ".tcs-home-component-card-body h3",
        ".tcs-home-build-card h3",
        ".product-title-block h1",
        ".product-specifications-table .product-spec-row:first-child strong",
        ".cart-item h3",
        ".checkout-item h3",
        ".account-saved-item-info h3",
        ".account-order-detail-item-info h3",
        ".order-item h3"
      ];

      document.querySelectorAll(productNameSelectors.join(", ")).forEach(function (element) {
        element.classList.add("notranslate");
        element.setAttribute("translate", "no");
      });
    }

    function startProductNameTranslationProtection() {
      protectProductNamesFromTranslation();

      if (window.tcsProductNameTranslationObserverStarted) {
        return;
      }

      window.tcsProductNameTranslationObserverStarted = true;

      const observer = new MutationObserver(function () {
        protectProductNamesFromTranslation();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      document.addEventListener("DOMContentLoaded", protectProductNamesFromTranslation);
    }

    window.googleTranslateElementInit = function () {
      startProductNameTranslationProtection();

      new google.translate.TranslateElement({
        pageLanguage: "en",
        includedLanguages: "en,ar,fr,de,es",
        autoDisplay: false
      }, "google_translate_element");
    };

    function loadGoogleTranslateScript() {
      startProductNameTranslationProtection();

      if (document.getElementById("google-translate-script")) {
        return;
      }

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }

    function applyLanguage(languageCode, attemptCount) {
      if (languageCode === "en") {
        clearGoogleTranslateCookie();
        window.location.reload();
        return;
      }

      if (!setGoogleTranslateCookie(languageCode)) {
        return;
      }

      loadGoogleTranslateScript();

      const translateCombo = document.querySelector(".goog-te-combo");

      if (translateCombo) {
        translateCombo.value = languageCode;
        translateCombo.dispatchEvent(new Event("change"));
        return;
      }

      if (attemptCount < 12) {
        window.setTimeout(function () {
          applyLanguage(languageCode, attemptCount + 1);
        }, 500);
        return;
      }

      window.location.reload();
    }

    languageToggle.addEventListener("click", function (event) {
      event.stopPropagation();

      if (languagePanel.hidden) {
        openLanguagePanel();
      } else {
        closeLanguagePanel();
      }
    });

    document.querySelectorAll(".tcs-language-option").forEach(function (button) {
      button.addEventListener("click", function () {
        closeLanguagePanel();
        applyLanguage(button.dataset.tcsLanguage, 0);
      });
    });

    document.addEventListener("click", function (event) {
      const mobileLanguageButton = event.target.closest ? event.target.closest("#tcs-mobile-language-button") : null;
      const mobileLanguageOption = event.target.closest ? event.target.closest("[data-tcs-mobile-language]") : null;

      if (mobileLanguageButton) {
        event.preventDefault();
        closeLanguagePanel();
        showLanguageNavPanel();
        return;
      }

      if (mobileLanguageOption) {
        event.preventDefault();
        closeLanguagePanel();
        closeNavMenu();
        applyLanguage(mobileLanguageOption.dataset.tcsMobileLanguage, 0);
        return;
      }

      if (!languageSwitcher.contains(event.target)) {
        closeLanguagePanel();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeLanguagePanel();
      }
    });

    if (!optionalPreferenceCookiesRejected()) {
      loadGoogleTranslateScript();
    }
  }

  setupLanguageSwitcher();

  headerRoot.outerHTML = `
<header class="site-header">
  <a href="index.html" class="site-header-logo">The Computer Shop</a>

  <nav class="site-header-nav" aria-label="Main navigation">
    <a href="signature-builds.html">Signature Builds</a>
    <a href="pc-builder.html">PC Builder</a>
    <a href="components.html">Components</a>
    <a href="consultation.html">Need a Custom PC?</a>
  </nav>

  <div class="site-header-actions">
    <a href="cart.html" class="site-header-cart" aria-label="Cart" data-cart-animation-target>
      <img src="cart-icon.png" alt="Cart">
      <span class="nav-cart-count">0</span>
    </a>

    <div class="floating-account-widget" id="floating-account-widget">
      <span class="floating-account-greeting" id="floating-account-greeting" hidden></span>

      <button class="floating-account-button" id="floating-account-button" type="button" aria-label="Open account menu" aria-expanded="false">
        <img src="user-icon.png" alt="Account" id="floating-account-photo">
      </button>

      <div class="floating-account-menu" id="floating-account-menu" hidden>
        <a href="login.html" class="floating-account-menu-link" id="floating-login-link">Login</a>
        <a href="accounts.html" class="floating-account-menu-link" id="floating-account-link" hidden>
          <img src="user-icon.png" alt="">
          <span>Account</span>
        </a>
        <a href="accounts.html#saved" class="floating-account-menu-link" id="floating-saved-link" hidden>
          <img src="saved-icon.png" alt="">
          <span>Saved for Later</span>
        </a>
        <a href="accounts.html#orders" class="floating-account-menu-link" id="floating-orders-link" hidden>
          <img src="orders-icon.png" alt="">
          <span>Order History</span>
        </a>
<button class="floating-account-menu-link floating-account-logout" id="floating-logout-button" type="button" hidden>
  <img src="logout-icon.png" alt="">
  <span>Logout</span>
</button>
      </div>
    </div>
  </div>

  <button class="hamburger-toggle" type="button" aria-label="Open menu" aria-expanded="false">
    <span></span>
    <span></span>
    <span></span>
  </button>
</header>

<div class="nav-menu-overlay" aria-hidden="true">
  <div class="nav-menu-panel nav-menu-main active">
    <div class="nav-menu-links">
      <a href="pc-builder.html" class="nav-menu-link">PC Builder</a>
      <a href="components.html" class="nav-menu-link">Components</a>
      <a href="signature-builds.html" class="nav-menu-link">Signature Builds</a>
      <a href="consultation.html" class="nav-menu-link">Need a Custom PC?</a>
      <button class="nav-menu-button" id="tcs-mobile-language-button" type="button">Language</button>
    </div>
  </div>

  <div class="nav-menu-panel nav-menu-language">
    <div class="nav-menu-links">
      <button class="nav-menu-button" type="button" data-tcs-mobile-language="en"><span class="tcs-language-flag" aria-hidden="true"><img src="united-states.png" alt=""></span><span>English</span></button>
      <button class="nav-menu-button" type="button" data-tcs-mobile-language="ar"><span class="tcs-language-flag" aria-hidden="true"><img src="egypt.png" alt=""></span><span>Arabic</span></button>
      <button class="nav-menu-button" type="button" data-tcs-mobile-language="fr"><span class="tcs-language-flag" aria-hidden="true"><img src="france.png" alt=""></span><span>French</span></button>
      <button class="nav-menu-button" type="button" data-tcs-mobile-language="de"><span class="tcs-language-flag" aria-hidden="true"><img src="germany.png" alt=""></span><span>German</span></button>
      <button class="nav-menu-button" type="button" data-tcs-mobile-language="es"><span class="tcs-language-flag" aria-hidden="true"><img src="spain.png" alt=""></span><span>Spanish</span></button>
    </div>
  </div>
</div>
`;

  const menuButton = document.querySelector(".hamburger-toggle");
  const menuOverlay = document.querySelector(".nav-menu-overlay");
  const menuLinks = document.querySelectorAll(".nav-menu-link");

  function setActiveNavPanel(panelSelector) {
    document.querySelectorAll(".nav-menu-panel").forEach(function (panel) {
      panel.classList.toggle("active", panel.matches(panelSelector));
    });
  }

  function showMainNavPanel() {
    setActiveNavPanel(".nav-menu-main");
  }

  function showLanguageNavPanel() {
    setActiveNavPanel(".nav-menu-language");
  }

  function closeNavMenu() {
    document.body.classList.remove("nav-menu-open");

    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "false");
    }

    if (menuOverlay) {
      menuOverlay.setAttribute("aria-hidden", "true");
    }

    showMainNavPanel();
  }

  if (menuButton && menuOverlay) {
    menuButton.addEventListener("click", () => {
      const menuIsOpen = document.body.classList.toggle("nav-menu-open");
      menuButton.setAttribute("aria-expanded", String(menuIsOpen));
      menuOverlay.setAttribute("aria-hidden", String(!menuIsOpen));
      showMainNavPanel();
    });

    menuOverlay.addEventListener("click", function (event) {
      if (event.target === menuOverlay) {
        closeNavMenu();
      }
    });

    menuLinks.forEach(function (link) {
      link.addEventListener("click", closeNavMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeNavMenu();
      }
    });
  }
const floatingAccountWidget = document.getElementById("floating-account-widget");

if (floatingAccountWidget) {
  const accountAuthScript = document.createElement("script");
  accountAuthScript.type = "module";
  accountAuthScript.textContent = `
    const accountWidget = document.getElementById("floating-account-widget");
    const accountGreeting = document.getElementById("floating-account-greeting");
    const accountButton = document.getElementById("floating-account-button");
    const accountPhoto = document.getElementById("floating-account-photo");
    const accountMenu = document.getElementById("floating-account-menu");
    const loginLink = document.getElementById("floating-login-link");
    const accountLink = document.getElementById("floating-account-link");
    const savedLink = document.getElementById("floating-saved-link");
    const ordersLink = document.getElementById("floating-orders-link");
    const logoutButton = document.getElementById("floating-logout-button");

    if (accountWidget && accountGreeting && accountButton && accountPhoto && accountMenu && loginLink && accountLink && savedLink && ordersLink && logoutButton) {
      function closeAccountMenu() {
        accountMenu.hidden = true;
        accountButton.setAttribute("aria-expanded", "false");
      }

      function openAccountMenu() {
        accountMenu.hidden = false;
        accountButton.setAttribute("aria-expanded", "true");
      }

      function getFirstName(fullName, email) {
        if (fullName && fullName.trim()) {
          return fullName.trim().split(" ")[0];
        }

        if (email && email.includes("@")) {
          return email.split("@")[0];
        }

        return "there";
      }

      function setAccountPhoto(photoURL) {
        const safePhotoURL = String(photoURL || "").trim();

        if (safePhotoURL) {
          accountPhoto.src = safePhotoURL;
          accountPhoto.alt = "Account profile photo";
          accountPhoto.classList.add("has-profile-photo");
          return;
        }

        accountPhoto.src = "user-icon.png";
        accountPhoto.alt = "Account";
        accountPhoto.classList.remove("has-profile-photo");
      }

      function showLoggedOutAccountState() {
        loginLink.hidden = false;
        accountLink.hidden = true;
        savedLink.hidden = true;
        ordersLink.hidden = true;
        logoutButton.hidden = true;
        accountGreeting.textContent = "";
        accountGreeting.hidden = true;
        setAccountPhoto("");
      }

      function showLoggedInAccountState(user) {
        const firstName = getFirstName(user.fullName || "", user.email || "");

        loginLink.hidden = true;
        accountLink.hidden = false;
        savedLink.hidden = false;
        ordersLink.hidden = false;
        logoutButton.hidden = false;
        accountGreeting.textContent = "Hello, " + firstName;
        accountGreeting.hidden = false;
        setAccountPhoto(user.photoURL || "");
      }

      const loginSessionSignedOutMessage = "This session was signed out from another device.";
      let sessionStatusRedirecting = false;
      let accountStateRequestInFlight = false;

      async function redirectRevokedSession() {
        if (sessionStatusRedirecting) {
          return;
        }

        sessionStatusRedirecting = true;
        sessionStorage.removeItem("tcs-login-2fa-pending");
        sessionStorage.setItem("tcs-login-message", loginSessionSignedOutMessage);
        await logoutServerSession();
        window.location.href = "login.html";
      }

      async function loadServerAccountState() {
        const twoFactorIsPending = sessionStorage.getItem("tcs-login-2fa-pending") === "1";

        if (twoFactorIsPending) {
          showLoggedOutAccountState();
          return;
        }

        if (accountStateRequestInFlight) {
          return;
        }

        accountStateRequestInFlight = true;

        try {
          const response = await fetch("/api/me", {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store",
            headers: {
              "Accept": "application/json"
            }
          });

          const data = await response.json().catch(function () {
            return {};
          });

          if (response.ok && data.sessionRevoked) {
            await redirectRevokedSession();
            return;
          }

          if (!response.ok || !data.signedIn || !data.user) {
            showLoggedOutAccountState();
            return;
          }

          showLoggedInAccountState(data.user);
        } catch (error) {
          showLoggedOutAccountState();
        } finally {
          accountStateRequestInFlight = false;
        }
      }

      async function logoutServerSession() {
        await fetch("/api/logout", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({})
        }).catch(function () {});
      }

      accountButton.addEventListener("click", function (event) {
        event.stopPropagation();

        if (accountMenu.hidden) {
          openAccountMenu();
        } else {
          closeAccountMenu();
        }
      });

      accountLink.addEventListener("click", closeAccountMenu);
      savedLink.addEventListener("click", closeAccountMenu);
      ordersLink.addEventListener("click", closeAccountMenu);

      document.addEventListener("click", function (event) {
        if (!accountWidget.contains(event.target)) {
          closeAccountMenu();
        }
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          closeAccountMenu();
        }
      });

      logoutButton.addEventListener("click", async function () {
        logoutButton.disabled = true;

        await logoutServerSession();

        // Firebase client session removed; server logout is the source of truth.

        sessionStorage.removeItem("tcs-login-2fa-pending");
        closeAccountMenu();
        showLoggedOutAccountState();

        window.location.href = "index.html";
      });

      loadServerAccountState();

      const currentPageName = window.location.pathname.split("/").pop().toLowerCase();
      const headerIsOnAccountPage = currentPageName === "accounts.html";

      if (!headerIsOnAccountPage) {
        window.setInterval(loadServerAccountState, 5 * 60 * 1000);
      }

      window.tcsReloadAccountHeader = loadServerAccountState;
    }
  `;

  document.body.appendChild(accountAuthScript);
}

const cartCountScript = document.createElement("script");

cartCountScript.textContent = `
  (function () {
    function updateHeaderCartCount(totalQuantity) {
      document.querySelectorAll(".nav-cart-count").forEach(function (count) {
        count.textContent = totalQuantity;
        count.style.display = totalQuantity > 0 ? "block" : "none";
      });
    }

    async function loadHeaderCartCount() {
      try {
        const response = await fetch("/api/cart", {
          method: "GET",
          credentials: "same-origin",
          headers: {
            "Accept": "application/json"
          }
        });

        const data = await response.json().catch(function () {
          return {};
        });

        if (!response.ok || !data.success) {
          updateHeaderCartCount(0);
          return;
        }

        updateHeaderCartCount(Number(data.itemCount || 0));
      } catch (error) {
        updateHeaderCartCount(0);
      }
    }

    window.tcsRefreshCartCount = loadHeaderCartCount;

    loadHeaderCartCount();
  })();
`;

document.body.appendChild(cartCountScript);

const productStockScript = document.createElement("script");

productStockScript.textContent = `
  (function () {
    const stockEndpoint = "/api/admin-support-tickets?type=stock-public";
    const stockCacheKey = "tcs-product-stock-cache-v1";
    const stockCacheMaxAgeMs = 15 * 60 * 1000;
    let stockRefreshInFlight = false;
    let currentStockMap = {};

    function normalizePublicStock(stock) {
      const normalizedStock = {};

      Object.keys(stock || {}).forEach(function (productId) {
        const item = stock[productId];

        if (item && item.status === "unavailable") {
          normalizedStock[productId] = {
            status: "unavailable",
            updatedAt: item.updatedAt || ""
          };
        }
      });

      return normalizedStock;
    }

    function setCurrentStockMap(stockMap, options) {
      const settings = options || {};
      currentStockMap = normalizePublicStock(stockMap);
      ensureStockStyles();

      if (!settings.skipCache) {
        saveCachedProductStock(currentStockMap);
      }

      applyProductCardStock(currentStockMap);
      applyProductDetailStock(currentStockMap);
    }

    function getProductIdFromHref(href) {
      try {
        return new URL(href, window.location.href).searchParams.get("product") || "";
      } catch (error) {
        return "";
      }
    }

    function getProductStatus(stockMap, productId) {
      const stockItem = stockMap && productId ? stockMap[productId] : null;
      return stockItem && stockItem.status === "unavailable" ? "unavailable" : "in_stock";
    }

    function hasProductStockTargets() {
      return Boolean(
        document.querySelector(".product-card-link, .signature-build-card, .tcs-home-component-card, .tcs-home-build-card") ||
        getProductIdFromHref(window.location.href)
      );
    }

    function readCachedProductStock() {
      try {
        const cached = JSON.parse(sessionStorage.getItem(stockCacheKey) || "{}");

        if (!cached || typeof cached !== "object" || !cached.stock || !cached.savedAt) {
          return null;
        }

        if (Date.now() - Number(cached.savedAt || 0) > stockCacheMaxAgeMs) {
          return null;
        }

        return cached.stock;
      } catch (error) {
        return null;
      }
    }

    function saveCachedProductStock(stock) {
      try {
        sessionStorage.setItem(stockCacheKey, JSON.stringify({
          stock: stock || {},
          savedAt: Date.now()
        }));
      } catch (error) {}
    }

    function ensureStockStyles() {
      if (document.getElementById("tcs-product-stock-styles")) {
        return;
      }

      const style = document.createElement("style");
      style.id = "tcs-product-stock-styles";
      style.textContent = [
        ".product-card-link,.signature-build-card,.tcs-home-component-card,.tcs-home-build-card{position:relative;}",
        ".tcs-product-stock-badge{position:absolute;top:12px;left:12px;z-index:5;padding:7px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(24,25,24,.82);color:#fff;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;backdrop-filter:blur(12px);}",
        ".tcs-product-stock-badge.in_stock{border-color:rgba(126,224,161,.35);color:#9ff0b8;}",
        ".tcs-product-stock-badge.unavailable{border-color:rgba(255,156,156,.42);color:#ffb8b8;}",
        ".tcs-product-unavailable img{filter:grayscale(.8);opacity:.56;}",
        ".tcs-product-unavailable{opacity:.82;}",
        ".tcs-product-stock-detail{margin:16px 0 0;padding:12px 14px;border-radius:14px;border:1px solid rgba(126,224,161,.26);background:rgba(126,224,161,.08);color:#9ff0b8;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;}",
        ".tcs-product-stock-detail.unavailable{border-color:rgba(255,156,156,.36);background:rgba(255,156,156,.1);color:#ffb8b8;}"
      ].join("");
      document.head.appendChild(style);
    }

    function setCardStockBadge(card, status) {
      let badge = card.querySelector(".tcs-product-stock-badge");

      if (status !== "unavailable") {
        if (badge) {
          badge.remove();
        }

        card.classList.remove("tcs-product-unavailable");
        return;
      }

      if (!badge) {
        badge = document.createElement("span");
        badge.className = "tcs-product-stock-badge";
        card.appendChild(badge);
      }

      badge.className = "tcs-product-stock-badge unavailable";
      badge.textContent = "Unavailable";
      card.classList.add("tcs-product-unavailable");
    }

    function applyProductCardStock(stockMap) {
      document.querySelectorAll(".product-card-link, .signature-build-card, .tcs-home-component-card, .tcs-home-build-card").forEach(function (card) {
        const productId = getProductIdFromHref(card.getAttribute("href") || "");

        if (!productId) {
          return;
        }

        setCardStockBadge(card, getProductStatus(stockMap, productId));
      });
    }

    function setStockDisabled(element, disabled) {
      if (!element) {
        return;
      }

      if (disabled) {
        element.dataset.tcsStockDisabled = "1";
        element.disabled = true;
        return;
      }

      if (element.dataset.tcsStockDisabled === "1") {
        element.disabled = false;
        delete element.dataset.tcsStockDisabled;
      }
    }

    function applyProductDetailStock(stockMap) {
      const productId = getProductIdFromHref(window.location.href);

      if (!productId) {
        return;
      }

      const status = getProductStatus(stockMap, productId);
      const purchasePanel = document.querySelector(".product-purchase-panel");
      const actionGrid = document.querySelector(".product-action-grid");
      let statusElement = document.getElementById("tcs-product-stock-status");

      if (status !== "unavailable") {
        if (statusElement) {
          statusElement.remove();
        }
      } else {
        if (!statusElement && purchasePanel) {
          statusElement = document.createElement("p");
          statusElement.id = "tcs-product-stock-status";
          purchasePanel.insertBefore(statusElement, actionGrid || null);
        }

        if (statusElement) {
          statusElement.className = "tcs-product-stock-detail unavailable";
          statusElement.textContent = "Unavailable";
        }
      }

      const addToCartButton = document.getElementById("add-to-cart-button");
      const quantityInput = document.getElementById("product-quantity");
      const decreaseButton = document.getElementById("decrease-quantity");
      const increaseButton = document.getElementById("increase-quantity");
      const isUnavailable = status === "unavailable";

      if (addToCartButton) {
        if (isUnavailable) {
          addToCartButton.dataset.tcsStockDisabled = "1";
          addToCartButton.disabled = true;
          addToCartButton.textContent = "Unavailable";
        } else if (addToCartButton.dataset.tcsStockDisabled === "1") {
          addToCartButton.disabled = false;
          addToCartButton.textContent = "Add to Cart";
          delete addToCartButton.dataset.tcsStockDisabled;
        }
      }

      [quantityInput, decreaseButton, increaseButton].forEach(function (element) {
        setStockDisabled(element, isUnavailable);
      });
    }

    async function loadProductStock(options) {
      const settings = options || {};
      const cachedStock = settings.force ? null : readCachedProductStock();

      if (cachedStock) {
        return cachedStock;
      }

      try {
        const response = await fetch(stockEndpoint, {
          method: "GET",
          credentials: "same-origin",
          headers: {
            "Accept": "application/json"
          }
        });

        const data = await response.json().catch(function () {
          return {};
        });

        if (!response.ok || !data.success || !data.stock) {
          return {};
        }

        const stock = normalizePublicStock(data.stock);
        saveCachedProductStock(stock);
        return stock;
      } catch (error) {
        return readCachedProductStock() || {};
      }
    }

    async function applyStockState(options) {
      if (stockRefreshInFlight) {
        return;
      }

      stockRefreshInFlight = true;

      try {
        const stockMap = await loadProductStock(options);

        setCurrentStockMap(stockMap);
      } finally {
        stockRefreshInFlight = false;
      }
    }

    function startProductStockLiveUpdates() {
      if (!hasProductStockTargets()) {
        return;
      }

      applyStockState();

      window.addEventListener("focus", applyStockState);

      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState !== "hidden") {
          applyStockState();
        }
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", startProductStockLiveUpdates);
    } else {
      startProductStockLiveUpdates();
    }
  })();
`;

  document.body.appendChild(productStockScript);

  function setupComponentSortControls() {
    const searchBox = document.querySelector(".component-search-box");
    const grid = document.querySelector(".signature-builds-grid");

    if (!searchBox || !grid || document.querySelector(".component-sort-control")) {
      return;
    }

    const controlsRow = document.createElement("div");
    controlsRow.className = "component-controls-row";
    searchBox.parentNode.insertBefore(controlsRow, searchBox);
    controlsRow.appendChild(searchBox);

    const sortControl = document.createElement("div");
    sortControl.className = "component-sort-control";
    sortControl.innerHTML = `
      <button class="component-sort-toggle" type="button" aria-label="Sort products" aria-expanded="false">
        <span class="component-sort-toggle-line"></span>
        <span class="component-sort-toggle-line"></span>
        <span class="component-sort-toggle-line"></span>
      </button>
      <div class="component-sort-menu" hidden>
        <button class="component-sort-option active" type="button" data-sort="default">Default order</button>
        <button class="component-sort-option" type="button" data-sort="name-asc">Name A to Z</button>
        <button class="component-sort-option" type="button" data-sort="name-desc">Name Z to A</button>
        <button class="component-sort-option" type="button" data-sort="price-asc">Price low to high</button>
        <button class="component-sort-option" type="button" data-sort="price-desc">Price high to low</button>
      </div>
    `;
    controlsRow.appendChild(sortControl);

    const toggle = sortControl.querySelector(".component-sort-toggle");
    const menu = sortControl.querySelector(".component-sort-menu");
    const options = Array.from(sortControl.querySelectorAll(".component-sort-option"));
    const originalCards = Array.from(grid.querySelectorAll(".signature-build-card"));

    originalCards.forEach(function (card, index) {
      card.dataset.componentOriginalIndex = String(index);
    });

    function getCardName(card) {
      const title = card.querySelector("h3");
      return title ? title.textContent.trim().toLowerCase() : "";
    }

    function getCardPrice(card) {
      const price = card.querySelector(".signature-build-price");
      const priceText = price ? price.textContent.replace(/,/g, "") : "";
      const match = priceText.match(/\d+(?:\.\d+)?/);

      if (!match) {
        return null;
      }

      const value = Number(match[0]);
      return Number.isFinite(value) ? value : null;
    }

    function getOriginalIndex(card) {
      return Number(card.dataset.componentOriginalIndex || 0);
    }

    function sortCards(sortType) {
      const cards = Array.from(grid.querySelectorAll(".signature-build-card"));

      cards.sort(function (firstCard, secondCard) {
        if (sortType === "name-asc") {
          return getCardName(firstCard).localeCompare(getCardName(secondCard)) || getOriginalIndex(firstCard) - getOriginalIndex(secondCard);
        }

        if (sortType === "name-desc") {
          return getCardName(secondCard).localeCompare(getCardName(firstCard)) || getOriginalIndex(firstCard) - getOriginalIndex(secondCard);
        }

        if (sortType === "price-asc" || sortType === "price-desc") {
          const firstPrice = getCardPrice(firstCard);
          const secondPrice = getCardPrice(secondCard);

          if (firstPrice === null && secondPrice === null) {
            return getOriginalIndex(firstCard) - getOriginalIndex(secondCard);
          }

          if (firstPrice === null) {
            return 1;
          }

          if (secondPrice === null) {
            return -1;
          }

          return sortType === "price-asc"
            ? firstPrice - secondPrice || getOriginalIndex(firstCard) - getOriginalIndex(secondCard)
            : secondPrice - firstPrice || getOriginalIndex(firstCard) - getOriginalIndex(secondCard);
        }

        return getOriginalIndex(firstCard) - getOriginalIndex(secondCard);
      });

      cards.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    function closeSortMenu() {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      const isOpen = !menu.hidden;
      menu.hidden = isOpen;
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });

    let sortAnimationTimer;

    options.forEach(function (option) {
      option.addEventListener("click", function () {
        const sortType = option.dataset.sort || "default";

        options.forEach(function (button) {
          button.classList.remove("active");
        });

        option.classList.add("active");
        closeSortMenu();

        window.clearTimeout(sortAnimationTimer);
        sortControl.classList.add("sort-is-loading");
        grid.classList.add("sort-is-updating");
        toggle.disabled = true;
        toggle.setAttribute("aria-busy", "true");

        sortAnimationTimer = window.setTimeout(function () {
          sortCards(sortType);

          window.setTimeout(function () {
            sortControl.classList.remove("sort-is-loading");
            grid.classList.remove("sort-is-updating");
            toggle.disabled = false;
            toggle.removeAttribute("aria-busy");
          }, 180);
        }, 180);
      });
    });

    document.addEventListener("click", function (event) {
      if (!sortControl.contains(event.target)) {
        closeSortMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeSortMenu();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupComponentSortControls);
  } else {
    setupComponentSortControls();
  }

})();
