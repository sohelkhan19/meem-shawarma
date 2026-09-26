import { html, useState, useEffect } from "../utils/html.js";
import { MENU_PRODUCTS } from "../data/menuData.js";
import { soundFX } from "../animations/soundEngine.js";

/**
 * Minimal Premium Sticky Navbar + Full-Screen Cinematic Menu Overlay
 * Fully responsive on desktop, tablet, and mobile viewports.
 */
export function Navbar({ onOpenOrder, cartCount, onSelectMenuProduct }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(MENU_PRODUCTS[0]);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const handleToggleSound = () => {
    const next = soundFX.toggle();
    setSoundEnabled(next);
  };

  const handleToggleMenu = () => {
    soundFX.playClick(580, 0.05);
    setMenuOpen((prev) => !prev);
  };

  const handleNavClick = (selector) => {
    soundFX.playClick(520, 0.04);
    setMenuOpen(false);
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return html`
    <header className=${`main-navbar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="navbar-inner">
        <a
          href="#hero-pin-stage"
          className="brand-logo"
          data-cursor="HOME"
          onClick=${(e) => {
            e.preventDefault();
            setMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="brand-emblem" aria-hidden="true">M</span>
          <span className="brand-text-wrap">
            <span className="brand-title">MEEM SHAWARMA</span>
            <span className="brand-sub">UNWRAP THE TASTE</span>
          </span>
        </a>

        <nav className="navbar-links" aria-label="Primary Navigation">
          <button
            type="button"
            className="nav-link-btn"
            data-cursor="MENU"
            onMouseEnter=${() => soundFX.playHover()}
            onClick=${handleToggleMenu}
            aria-expanded=${menuOpen}
          >
            <span className="nav-link-dot" />
            <span>${menuOpen ? "CLOSE" : "MENU"}</span>
          </button>

          <a
            href="#brand-intro-section"
            className="nav-link"
            data-cursor="STORY"
            onMouseEnter=${() => soundFX.playHover()}
            onClick=${(e) => {
              e.preventDefault();
              handleNavClick("#brand-intro-section");
            }}
          >
            ABOUT
          </a>

          <a
            href="#crispy-section"
            className="nav-link"
            data-cursor="CRUNCH"
            onMouseEnter=${() => soundFX.playHover()}
            onClick=${(e) => {
              e.preventDefault();
              handleNavClick("#crispy-section");
            }}
          >
            EXPERIENCE
          </a>

          <a
            href="#location-section"
            className="nav-link"
            data-cursor="VISIT"
            onMouseEnter=${() => soundFX.playHover()}
            onClick=${(e) => {
              e.preventDefault();
              handleNavClick("#location-section");
            }}
          >
            LOCATION
          </a>
        </nav>

        <div className="navbar-actions">
          <button
            type="button"
            className=${`sound-toggle-btn ${soundEnabled ? "is-active" : ""}`}
            onClick=${handleToggleSound}
            data-cursor="AUDIO"
            aria-label=${soundEnabled ? "Mute UI sound effects" : "Enable UI sound effects"}
            title="Toggle subtle tactile UI sound"
          >
            <span className="sound-bars" aria-hidden="true">
              <i /><i /><i /><i />
            </span>
            <span className="sound-label">${soundEnabled ? "SFX ON" : "SFX OFF"}</span>
          </button>

          <button
            type="button"
            className="magnetic-btn order-cta-btn"
            data-cursor="ORDER"
            onMouseEnter=${() => soundFX.playHover()}
            onClick=${() => {
              soundFX.playClick(640, 0.06);
              setMenuOpen(false);
              onOpenOrder();
            }}
          >
            <span className="order-btn-text">ORDER NOW</span>
            ${cartCount > 0
              ? html`<span className="cart-badge">${cartCount}</span>`
              : html`<span className="cta-arrow">→</span>`}
          </button>
        </div>
      </div>

      <!-- Full-Screen Cinematic Menu Overlay (Section 29) -->
      <div
        className=${`fullscreen-menu-overlay ${menuOpen ? "is-open" : ""}`}
        aria-hidden=${!menuOpen}
      >
        <div className="menu-overlay-backdrop" onClick=${() => setMenuOpen(false)} />
        <div className="menu-overlay-scroll-container">
          <div className="menu-overlay-grid">
            <div className="menu-overlay-left">
              <!-- Quick Section Navigation Pills (Especially useful on mobile) -->
              <div className="overlay-quick-sections">
                <span className="overlay-eyebrow">JUMP TO SECTION</span>
                <div className="overlay-section-pills">
                  <button
                    type="button"
                    className="overlay-sec-pill"
                    onClick=${() => handleNavClick("#brand-intro-section")}
                  >
                    ABOUT
                  </button>
                  <button
                    type="button"
                    className="overlay-sec-pill"
                    onClick=${() => handleNavClick("#signature-menu-section")}
                  >
                    MENU
                  </button>
                  <button
                    type="button"
                    className="overlay-sec-pill"
                    onClick=${() => handleNavClick("#crispy-section")}
                  >
                    CRISPY
                  </button>
                  <button
                    type="button"
                    className="overlay-sec-pill"
                    onClick=${() => handleNavClick("#burger-section")}
                  >
                    BURGER
                  </button>
                  <button
                    type="button"
                    className="overlay-sec-pill"
                    onClick=${() => handleNavClick("#bao-section")}
                  >
                    BAO
                  </button>
                  <button
                    type="button"
                    className="overlay-sec-pill"
                    onClick=${() => handleNavClick("#bowl-section")}
                  >
                    BOWL
                  </button>
                  <button
                    type="button"
                    className="overlay-sec-pill"
                    onClick=${() => handleNavClick("#brand-story-section")}
                  >
                    THE CODE
                  </button>
                  <button
                    type="button"
                    className="overlay-sec-pill"
                    onClick=${() => handleNavClick("#location-section")}
                  >
                    LOCATION
                  </button>
                </div>
              </div>

              <div className="overlay-eyebrow">SIGNATURE LINEUP // 01 — 06</div>
              <ul className="overlay-product-list">
                ${MENU_PRODUCTS.map(
                  (item) => html`
                    <li key=${item.id} className="overlay-product-item">
                      <button
                        type="button"
                        className=${`overlay-product-trigger ${
                          hoveredItem.id === item.id ? "is-active" : ""
                        }`}
                        data-cursor="TASTE"
                        onMouseEnter=${() => {
                          soundFX.playHover();
                          setHoveredItem(item);
                        }}
                        onClick=${() => {
                          soundFX.playClick(600, 0.05);
                          setMenuOpen(false);
                          onSelectMenuProduct(item);
                        }}
                      >
                        <span className="overlay-item-index">${item.index}</span>
                        <span className="overlay-item-name">${item.name}</span>
                        <span className="overlay-item-price">${item.price}</span>
                      </button>
                    </li>
                  `
                )}
              </ul>

              <div className="overlay-footer-links">
                <button
                  type="button"
                  className="overlay-jump-btn"
                  onClick=${() => handleNavClick("#signature-menu-section")}
                >
                  EXPLORE FULL INTERACTIVE MENU →
                </button>
                <button
                  type="button"
                  className="overlay-jump-btn"
                  onClick=${() => handleNavClick("#location-section")}
                >
                  FIND FLAGSHIP KITCHEN →
                </button>
              </div>
            </div>

            <div className="menu-overlay-right">
              <div
                className="overlay-preview-card"
                style=${{ "--preview-accent": hoveredItem.accentColor }}
              >
                <div className="overlay-preview-badge">${hoveredItem.badge}</div>
                <div className="overlay-preview-img-wrap">
                  <img
                    src=${hoveredItem.image}
                    alt=${hoveredItem.name}
                    className="overlay-preview-img"
                  />
                </div>
                <div className="overlay-preview-meta">
                  <h3>${hoveredItem.name}</h3>
                  <p>${hoveredItem.tagline}</p>
                  <div className="overlay-preview-chips">
                    ${hoveredItem.ingredients.slice(0, 4).map(
                      (ing) => html`<span key=${ing} className="ing-chip">${ing}</span>`
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `;
}
