(function () {
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

  <a href="cart.html" class="site-header-cart" aria-label="Cart">
    <img src="cart-icon.png" alt="Cart">
    <span class="nav-cart-count">0</span>
  </a>

  <button class="hamburger-toggle" type="button" aria-label="Open menu" aria-expanded="false">
    <span></span>
    <span></span>
    <span></span>
  </button>
</header>

<div class="floating-account-widget" id="floating-account-widget">
  <span class="floating-account-greeting" id="floating-account-greeting" hidden></span>

  <button class="floating-account-button" id="floating-account-button" type="button" aria-label="Open account menu" aria-expanded="false">
    <img src="user-icon.png" alt="Account">
  </button>

  <div class="floating-account-menu" id="floating-account-menu" hidden>
    <a href="login.html" class="floating-account-menu-link" id="floating-login-link">Login</a>
    <a href="accounts.html" class="floating-account-menu-link" id="floating-account-link" hidden>Account</a>
<button class="floating-account-menu-link floating-account-logout" id="floating-logout-button" type="button" hidden>
  <img src="logout-icon.png" alt="">
  <span>Logout</span>
</button>
  </div>
</div>

<div class="nav-menu-overlay" aria-hidden="true">
  <div class="nav-menu-panel nav-menu-main active">
    <div class="nav-menu-links">
      <a href="signature-builds.html" class="nav-menu-link">Signature Builds</a>
      <a href="components.html" class="nav-menu-link">Components</a>
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
    const accountMenu = document.getElementById("floating-account-menu");
    const loginLink = document.getElementById("floating-login-link");
    const accountLink = document.getElementById("floating-account-link");
    const logoutButton = document.getElementById("floating-logout-button");

    if (accountWidget && accountGreeting && accountButton && accountMenu && loginLink && accountLink && logoutButton) {
      const firebaseAuth = {};
      const auth = null;
      const signOut = null;

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

      function showLoggedOutAccountState() {
        loginLink.hidden = false;
        accountLink.hidden = true;
        logoutButton.hidden = true;
        accountGreeting.textContent = "";
        accountGreeting.hidden = true;
      }

      function showLoggedInAccountState(user) {
        const firstName = getFirstName(user.fullName || "", user.email || "");

        loginLink.hidden = true;
        accountLink.hidden = false;
        logoutButton.hidden = false;
        accountGreeting.textContent = "Hello, " + firstName;
        accountGreeting.hidden = false;
      }

      async function loadServerAccountState() {
        closeAccountMenu();

        const twoFactorIsPending = sessionStorage.getItem("tcs-login-2fa-pending") === "1";

        if (twoFactorIsPending) {
          showLoggedOutAccountState();
          return;
        }

        try {
          const response = await fetch("/api/me", {
            method: "GET",
            credentials: "same-origin",
            headers: {
              "Accept": "application/json"
            }
          });

          const data = await response.json().catch(function () {
            return {};
          });

          if (!response.ok || !data.signedIn || !data.user) {
            showLoggedOutAccountState();
            return;
          }

          showLoggedInAccountState(data.user);
        } catch (error) {
          showLoggedOutAccountState();
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
