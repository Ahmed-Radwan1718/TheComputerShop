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
          <li><a href="https://api.whatsapp.com/send/?phone=201010206091&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
          <li><a href="https://www.facebook.com/share/1Gma229b3L/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">Facebook</a></li>
        </ul>
      </div>

      <div class="site-footer-column">
        <h3>Support</h3>
        <ul class="site-footer-links">
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="policies.html">Policies</a></li>
          <li><a href="terms.html">Terms & Conditions</a></li>
          <li><a href="privacy.html">Privacy Policy</a></li>
        </ul>
      </div>

      <div class="site-footer-column">
        <h3>About</h3>
        <ul class="site-footer-links">
          <li><a href="about.html">About Us</a></li>
        </ul>
      </div>
    </div>

    <div class="site-footer-bottom">
      <p>&copy; 2026 The Computer Shop. All rights reserved.</p>
    </div>
  </div>
</footer>
`;
})();
