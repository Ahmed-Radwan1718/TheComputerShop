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
          <li><a href="mailto:thecomputershopegypt@gmail.com">thecomputershopegypt@gmail.com</a></li>
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
      We use required cookies to keep the site working, protect your account, and remember your choices. Optional cookies may remember preferences such as language settings. Choose whether to accept, reject, or view optional cookies.
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
      <p>Required cookies help the website work properly. They support secure sign-in, account protection, trusted devices, protected account actions, cart/account features, and remembering your cookie choice.</p>
      <p>Optional preference cookies can remember choices such as your selected language. We do not currently use advertising, analytics, marketing, heatmap, or tracking cookies.</p>
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

    document.cookie = cookieConsentCookieName + "=" + encodeURIComponent(choice) + "; path=/; max-age=31536000; SameSite=Lax";

    window.tcsCookieConsent = {
      choice: choice,
      optionalCookiesAllowed: choice === "accepted"
    };

    window.dispatchEvent(new CustomEvent("tcs-cookie-consent-change", {
      detail: window.tcsCookieConsent
    }));
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
