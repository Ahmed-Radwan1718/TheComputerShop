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

  <button class="hamburger-toggle" type="button" aria-label="Open menu">

  <button class="hamburger-toggle" type="button" aria-label="Open menu">
    <span></span>
    <span></span>
    <span></span>
  </button>
</header>

<a href="signup.html" class="floating-account-button" aria-label="Create account">
  <img src="user-icon.png" alt="Account">
</a>

<div class="nav-menu-overlay">
  <div class="nav-menu-panel nav-menu-main active">
    <div class="nav-menu-links">
      <a href="index.html" class="nav-menu-link">Home</a>
      <a href="signature-builds.html" class="nav-menu-link">Signature Builds</a>
      <button class="nav-menu-button" type="button" id="open-components-menu">Components</button>
      <a href="consultation.html" class="nav-menu-link">Need a Custom PC?</a>
    </div>
  </div>

  <div class="nav-menu-panel nav-menu-components">
    <div class="nav-menu-links">
      <button class="nav-menu-back" type="button" id="back-to-main-menu">Back</button>
      <a href="cpus.html" class="nav-menu-link">CPU</a>
      <a href="cpu-coolers.html" class="nav-menu-link">CPU Cooler</a>
      <a href="motherboards.html" class="nav-menu-link">Motherboard</a>
      <a href="memory.html" class="nav-menu-link">Memory</a>
      <a href="storage.html" class="nav-menu-link">Storage</a>
      <a href="graphics-cards.html" class="nav-menu-link">Graphics Card</a>
      <a href="cases.html" class="nav-menu-link">Case</a>
      <a href="power-supplies.html" class="nav-menu-link">Power Supply</a>
      <a href="monitors.html" class="nav-menu-link">Monitor</a>
      <a href="accessories.html" class="nav-menu-link">Peripherals</a>
    </div>
  </div>
</div>
`;

  const menuButton = document.querySelector(".hamburger-toggle");
  const mainMenu = document.querySelector(".nav-menu-main");
  const componentsMenu = document.querySelector(".nav-menu-components");
  const openComponentsButton = document.getElementById("open-components-menu");
  const backButton = document.getElementById("back-to-main-menu");

  if (menuButton && mainMenu && componentsMenu && openComponentsButton && backButton) {
    menuButton.addEventListener("click", () => {
      document.body.classList.toggle("nav-menu-open");
      mainMenu.classList.add("active");
      componentsMenu.classList.remove("active");
    });

    openComponentsButton.addEventListener("click", () => {
      mainMenu.classList.remove("active");
      componentsMenu.classList.add("active");
    });

    backButton.addEventListener("click", () => {
      componentsMenu.classList.remove("active");
      mainMenu.classList.add("active");
    });
  }
})();
