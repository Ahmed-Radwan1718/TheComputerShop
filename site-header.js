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

  headerRoot.outerHTML = `
<header class="site-header">
  <a href="index.html" class="site-header-logo">The Computer Shop</a>

  <nav class="site-header-nav" aria-label="Main navigation">
    <a href="signature-builds.html">Signature Builds</a>
    <a href="components.html">Components</a>
    <a href="consultation.html">Need a Custom PC?</a>
  </nav>

  <div class="site-header-actions">
    <a href="cart.html" class="site-header-cart" aria-label="Cart">
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
      <a href="components.html" class="nav-menu-link">Components</a>
      <a href="signature-builds.html" class="nav-menu-link">Signature Builds</a>
      <a href="consultation.html" class="nav-menu-link">Need a Custom PC?</a>
    </div>
  </div>
</div>
`;

  const menuButton = document.querySelector(".hamburger-toggle");
  const menuOverlay = document.querySelector(".nav-menu-overlay");
  const menuLinks = document.querySelectorAll(".nav-menu-link");

  function closeNavMenu() {
    document.body.classList.remove("nav-menu-open");

    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "false");
    }

    if (menuOverlay) {
      menuOverlay.setAttribute("aria-hidden", "true");
    }
  }

  if (menuButton && menuOverlay) {
    menuButton.addEventListener("click", () => {
      const menuIsOpen = document.body.classList.toggle("nav-menu-open");
      menuButton.setAttribute("aria-expanded", String(menuIsOpen));
      menuOverlay.setAttribute("aria-hidden", String(!menuIsOpen));
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
        window.setInterval(loadServerAccountState, 2000);
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

})();
