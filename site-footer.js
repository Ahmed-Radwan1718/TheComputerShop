(function () {
  const footerRoot = document.getElementById("site-footer-root");

  if (!footerRoot) {
    return;
  }

  footerRoot.outerHTML = `
<footer class="site-footer">
  <div class="site-footer-inner">
    <div class="site-footer-grid">
      <div class="site-footer-column site-footer-brand">
        <h2>The Computer Shop</h2>
        <p>Custom PC Builds and Consultation in Egypt</p>
      </div>

      <div class="site-footer-column">
        <h3>Contact</h3>
        <ul class="site-footer-links">
          <li><a href="mailto:The_Computer_Shop@icloud.com">The_Computer_Shop@icloud.com</a></li>
          <li><a href="https://wa.me/201130816735" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
          <li><a href="https://www.facebook.com/share/1AkQdshwCi/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">Facebook</a></li>
        </ul>
      </div>

      <div class="site-footer-column">
        <h3>Support</h3>
        <ul class="site-footer-links">
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="policies.html">Policies & Privacy</a></li>
          <li><a href="terms.html">Terms & Conditions</a></li>
        </ul>
      </div>
    </div>
    </div>

    <div class="site-footer-bottom">
      <p>&copy; 2026 The Computer Shop. All rights reserved.</p>
    </div>
  </div>
</footer>

<div class="cookie-consent-banner" id="cookie-consent-banner" role="region" aria-label="Cookie consent notice">
  <div class="cookie-consent-copy">
    <h2>We value your privacy</h2>
    <p>
      We use essential cookies and may use optional cookies to improve browsing, remember preferences, understand traffic, and personalize content. Choose whether to accept, reject, or view optional cookies.
    </p>
  </div>

  <div class="cookie-consent-actions">
    <button class="cookie-consent-button cookie-consent-view" id="cookie-consent-view" type="button" aria-expanded="false" aria-controls="cookie-consent-options">View Optional Cookies</button>
    <button class="cookie-consent-button cookie-consent-reject" id="cookie-consent-reject" type="button">Reject All</button>
    <button class="cookie-consent-button cookie-consent-accept" id="cookie-consent-accept" type="button">Accept All</button>
  </div>

  <div class="cookie-consent-options" id="cookie-consent-options" hidden>
    <div>
      <h3>Cookies We Use</h3>
      <p>Essential cookies: __Host-tcs_session, __Host-tcs_account_session, __Host-tcs_login_challenge, __Host-tcs_login_2fa, __Host-tcs_trusted_device, and __Host-tcs_security_unlock. These support login, account security, two-factor verification, trusted devices, and protected account actions.</p>
      <p>Optional and preference cookies: googtrans remembers language translation preferences, and tcs_cookie_consent remembers your cookie choice. We do not currently use advertising, analytics, marketing, heatmap, or tracking cookies.</p>
    </div>
  </div>
</div>
`;

  const cookieConsentBanner = document.getElementById("cookie-consent-banner");
  const cookieConsentOptions = document.getElementById("cookie-consent-options");
  const cookieConsentViewButton = document.getElementById("cookie-consent-view");
  const cookieConsentCookieName = "tcs_cookie_consent";
  const cookieConsentStorageKey = "tcs_cookie_consent";

  function getCookieConsentChoice() {
    try {
      const storedChoice = sessionStorage.getItem(cookieConsentStorageKey);

      if (storedChoice) {
        return storedChoice;
      }
    } catch (error) {}

    const cookieMatch = document.cookie.split("; ").find(function (cookie) {
      return cookie.indexOf(cookieConsentCookieName + "=") === 0;
    });

    return cookieMatch ? decodeURIComponent(cookieMatch.split("=").slice(1).join("=")) : "";
  }

  function setCookieConsentChoice(choice) {
    try {
      sessionStorage.setItem(cookieConsentStorageKey, choice);
    } catch (error) {}

    document.cookie = cookieConsentCookieName + "=" + encodeURIComponent(choice) + "; path=/; SameSite=Lax";

    window.tcsCookieConsent = {
      choice: choice,
      optionalCookiesAllowed: choice === "accepted"
    };
  }

  function dismissCookieConsent(choice) {
    if (!cookieConsentBanner) {
      return;
    }

    setCookieConsentChoice(choice);
    cookieConsentBanner.classList.add("cookie-consent-banner-hiding");

    window.setTimeout(function () {
      cookieConsentBanner.hidden = true;
    }, 260);
  }

  if (cookieConsentBanner && cookieConsentOptions && cookieConsentViewButton) {
    const existingCookieConsentChoice = getCookieConsentChoice();

    if (existingCookieConsentChoice) {
      setCookieConsentChoice(existingCookieConsentChoice);
      cookieConsentBanner.hidden = true;
    }

    document.addEventListener("click", function (event) {
      const consentButton = event.target.closest("#cookie-consent-view, #cookie-consent-reject, #cookie-consent-accept");

      if (!consentButton) {
        return;
      }

      if (consentButton.id === "cookie-consent-view") {
        const shouldShowOptions = cookieConsentOptions.hidden;

        cookieConsentOptions.hidden = !shouldShowOptions;
        cookieConsentViewButton.setAttribute("aria-expanded", String(shouldShowOptions));
        return;
      }

      if (consentButton.id === "cookie-consent-reject") {
        dismissCookieConsent("rejected");
        return;
      }

      if (consentButton.id === "cookie-consent-accept") {
        dismissCookieConsent("accepted");
      }
    });
  }
})();
