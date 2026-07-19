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
          <li><a href="https://www.instagram.com/thecomputershopegypt?igsh=MWtneHF1aWk3ejVtbA%3D%3D&amp;utm_source=qr" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="https://www.tiktok.com/@thecomputershop?_r=1&amp;_t=ZS-98AtfYNECYe" target="_blank" rel="noopener noreferrer">TikTok</a></li>
        </ul>
      </div>

      <div class="site-footer-column">
        <h3>Support</h3>
        <ul class="site-footer-links">
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="policies.html">Policies & Privacy</a></li>
          <li><a href="terms.html">Terms of Service</a></li>
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

  function playCookieRain() {
    const cookieRain = document.createElement("div");
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const cookies = [];
    const duration = 2000;
    const cookieCount = 140;
    let startedAt = 0;
    let lastTime = 0;
    let animationFrameId = 0;

    cookieRain.setAttribute("aria-hidden", "true");
    cookieRain.style.position = "fixed";
    cookieRain.style.inset = "0";
    cookieRain.style.pointerEvents = "none";
    cookieRain.style.overflow = "hidden";
    cookieRain.style.zIndex = "9999";

    document.body.appendChild(cookieRain);

    function getStartPoint(size) {
      return {
        x: Math.random() * screenWidth,
        y: -size - (Math.random() * screenHeight * 0.35)
      };
    }

    for (let index = 0; index < cookieCount; index += 1) {
      const cookie = document.createElement("img");
      const size = 24 + Math.random() * 46;
      const start = getStartPoint(size);
      const drift = (Math.random() * 120) - 60;
      const speed = (screenHeight / 1.25) + Math.random() * 240;

      cookie.src = "cookie.png";
      cookie.alt = "";
      cookie.style.position = "absolute";
      cookie.style.left = "0";
      cookie.style.top = "0";
      cookie.style.width = size + "px";
      cookie.style.height = size + "px";
      cookie.style.objectFit = "contain";
      cookie.style.opacity = "0";
      cookie.style.willChange = "transform, opacity";

      cookieRain.appendChild(cookie);

      cookies.push({
        element: cookie,
        x: start.x,
        y: start.y,
        vx: drift,
        vy: speed,
        radius: size * 0.42,
        size: size,
        rotation: Math.random() * 360,
        spin: (Math.random() * 360) - 180,
        delay: Math.random() * 500,
        active: false
      });
    }

    function updateCookie(cookie, delta) {
      cookie.x += cookie.vx * delta;
      cookie.y += cookie.vy * delta;
      cookie.rotation += cookie.spin * delta;

      if (cookie.x < -cookie.radius && cookie.vx < 0) {
        cookie.x = -cookie.radius;
        cookie.vx = Math.abs(cookie.vx) * 0.82;
      }

      if (cookie.x > screenWidth + cookie.radius && cookie.vx > 0) {
        cookie.x = screenWidth + cookie.radius;
        cookie.vx = -Math.abs(cookie.vx) * 0.82;
      }
    }

    function bounceCookies() {
      for (let firstIndex = 0; firstIndex < cookies.length; firstIndex += 1) {
        const firstCookie = cookies[firstIndex];

        if (!firstCookie.active) {
          continue;
        }

        for (let secondIndex = firstIndex + 1; secondIndex < cookies.length; secondIndex += 1) {
          const secondCookie = cookies[secondIndex];

          if (!secondCookie.active) {
            continue;
          }

          const distanceX = secondCookie.x - firstCookie.x;
          const distanceY = secondCookie.y - firstCookie.y;
          const distance = Math.hypot(distanceX, distanceY);
          const minimumDistance = firstCookie.radius + secondCookie.radius;

          if (!distance || distance >= minimumDistance) {
            continue;
          }

          const normalX = distanceX / distance;
          const normalY = distanceY / distance;
          const overlap = (minimumDistance - distance) / 2;
          const relativeVelocityX = secondCookie.vx - firstCookie.vx;
          const relativeVelocityY = secondCookie.vy - firstCookie.vy;
          const speed = (relativeVelocityX * normalX) + (relativeVelocityY * normalY);

          firstCookie.x -= normalX * overlap;
          firstCookie.y -= normalY * overlap;
          secondCookie.x += normalX * overlap;
          secondCookie.y += normalY * overlap;

          if (speed < 0) {
            firstCookie.vx += speed * normalX;
            firstCookie.vy += speed * normalY;
            secondCookie.vx -= speed * normalX;
            secondCookie.vy -= speed * normalY;
            firstCookie.spin += speed * 0.35;
            secondCookie.spin -= speed * 0.35;
          }
        }
      }
    }

    function drawCookies(elapsed) {
      cookies.forEach(function (cookie) {
        if (!cookie.active) {
          return;
        }

        const age = elapsed - cookie.delay;
        const fadeIn = Math.min(age / 250, 1);
        const fadeOut = elapsed > duration - 650 ? Math.max((duration - elapsed) / 650, 0) : 1;
        const opacity = Math.min(fadeIn, fadeOut);

        cookie.element.style.opacity = String(opacity);
        cookie.element.style.transform = "translate3d(" + (cookie.x - cookie.radius) + "px, " + (cookie.y - cookie.radius) + "px, 0) rotate(" + cookie.rotation + "deg)";
      });
    }

    function animateCookies(now) {
      if (!startedAt) {
        startedAt = now;
        lastTime = now;
      }

      const elapsed = now - startedAt;
      const delta = Math.min((now - lastTime) / 1000, 0.032);

      lastTime = now;

      cookies.forEach(function (cookie) {
        if (elapsed < cookie.delay) {
          return;
        }

        cookie.active = true;
        updateCookie(cookie, delta);
      });

      drawCookies(elapsed);

      if (elapsed < duration) {
        animationFrameId = window.requestAnimationFrame(animateCookies);
        return;
      }

      cookieRain.remove();
    }

    animationFrameId = window.requestAnimationFrame(animateCookies);

    window.setTimeout(function () {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }

      cookieRain.remove();
    }, duration + 500);
  }

  function dismissCookieConsent(choice) {
    if (!cookieConsentBanner) {
      return;
    }

    setCookieConsentChoice(choice);

    if (choice === "accepted") {
      playCookieRain();
    }

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
