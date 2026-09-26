import { html } from "../utils/html.js";
import { MENU_PRODUCTS } from "../data/menuData.js";
import { ProductShowcase } from "./ProductShowcase.js";
import { soundFX } from "../animations/soundEngine.js";

/**
 * Section 3 — Signature Interactive Menu Experience
 * Data-driven from MENU_PRODUCTS (Section 54).
 */
export function MenuSection({ activeProduct, onSelectProduct, onAddToOrder }) {
  const current = activeProduct || MENU_PRODUCTS[0];

  const handleTileMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tile-rx", `${-y * 15}deg`);
    card.style.setProperty("--tile-ry", `${x * 18}deg`);
    card.style.setProperty("--tile-tx", `${x * 16}px`);
    card.style.setProperty("--tile-ty", `${y * 14}px`);
  };

  const handleTileMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty("--tile-rx", "0deg");
    card.style.setProperty("--tile-ry", "0deg");
    card.style.setProperty("--tile-tx", "0px");
    card.style.setProperty("--tile-ty", "0px");
  };

  return html`
    <section
      id="signature-menu-section"
      className="signature-menu-section"
      style=${{
        "--menu-bg-tint": current.bgTint,
        "--menu-accent": current.accentColor
      }}
      aria-labelledby="signature-menu-heading"
    >
      <div className="section-container">
        <div className="menu-section-header">
          <div>
            <div className="eyebrow-tag">02 // SIGNATURE LINEUP</div>
            <h2 id="signature-menu-heading" className="section-giant-heading">
              CHICKEN, BUT MAKE IT <span className="fire-accent-text">SERIOUS.</span>
            </h2>
          </div>
          <p className="menu-header-sub">
            Hover or tap any creation below to tilt, inspect the anatomy, and feel
            the heat.
          </p>
        </div>

        <!-- Interactive 6-Product Kinetic Selector Rail -->
        <div className="menu-selector-rail" role="tablist" aria-label="Signature Menu Items">
          ${MENU_PRODUCTS.map((item) => {
            const isActive = item.id === current.id;
            return html`
              <button
                key=${item.id}
                type="button"
                role="tab"
                aria-selected=${isActive}
                className=${`menu-rail-pill ${isActive ? "is-active" : ""}`}
                style=${{ "--pill-accent": item.accentColor }}
                data-cursor="INSPECT"
                onMouseEnter=${() => {
                  soundFX.playHover();
                  onSelectProduct(item);
                }}
                onClick=${() => {
                  soundFX.playClick(560, 0.05);
                  onSelectProduct(item);
                }}
              >
                <span className="rail-pill-idx">${item.index}</span>
                <span className="rail-pill-name">${item.name}</span>
                <span className="rail-pill-price">${item.price}</span>
              </button>
            `;
          })}
        </div>

        <!-- Main 3D Tilt Product Showcase Stage -->
        <${ProductShowcase}
          product=${current}
          onAddToOrder=${onAddToOrder}
        />

        <!-- Interactive Horizontal 3D Hover Strip (All 6 Signature Creations) -->
        <div className="menu-interactive-strip">
          ${MENU_PRODUCTS.map((item) => {
            const isSelected = item.id === current.id;
            return html`
              <article
                key=${item.id}
                className=${`interactive-food-strip-item ${
                  isSelected ? "is-selected" : ""
                }`}
                style=${{ "--item-accent": item.accentColor }}
                data-cursor="VIEW"
                onMouseEnter=${() => {
                  soundFX.playHover();
                  onSelectProduct(item);
                }}
                onMouseMove=${handleTileMouseMove}
                onMouseLeave=${handleTileMouseLeave}
                onClick=${() => {
                  soundFX.playClick(600, 0.05);
                  onSelectProduct(item);
                }}
              >
                <div className="strip-item-top">
                  <span className="strip-idx">${item.index}</span>
                  <span className="strip-badge">${item.category}</span>
                </div>

                <div className="strip-visual-float">
                  <img src=${item.image} alt=${item.name} loading="lazy" />
                </div>

                <div className="strip-item-info">
                  <h4>${item.name}</h4>
                  <p className="strip-hook">${item.tagline}</p>
                  <div className="strip-bottom-row">
                    <span className="strip-price">${item.price}</span>
                    <button
                      type="button"
                      className="strip-quick-add"
                      data-cursor="ADD"
                      onClick=${(e) => {
                        e.stopPropagation();
                        soundFX.playClick(700, 0.06);
                        onAddToOrder(item);
                      }}
                    >
                      + BAG
                    </button>
                  </div>
                </div>
              </article>
            `;
          })}
        </div>
      </div>
    </section>
  `;
}
