function App() {
  return (
    <>
      <button className="hamburger-toggle" type="button" aria-label="Open menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <a href="/cart" className="nav-cart-link" aria-label="Cart">
        <img src="/cart-icon.png" alt="Cart" />
        <span className="nav-cart-count">0</span>
      </a>

      <main>
        <section className="hero">
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <div className="hero-text">
              <p className="hero-eyebrow">Welcome to The Computer Shop</p>
              <h1>Performance Built Systems</h1>

              <div className="hero-actions">
                <a href="/signature-builds" className="hero-button hero-button-primary">
                  Signature Builds
                </a>
                <a href="/consultation" className="hero-button hero-button-secondary">
                  Need a Custom PC?
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
