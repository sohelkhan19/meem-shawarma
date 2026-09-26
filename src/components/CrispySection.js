import { html } from "../utils/html.js";
import { MENU_PRODUCTS } from "../data/menuData.js";

/**
 * Section 4 — "CRISPY." Experience (Section 20)
 * Giant kinetic letters C R I S P Y . that separate & distort on scroll
 * with a suspended high-speed crispy chicken explosion and flying crumbs.
 */
export function CrispySection({ onAddToOrder }) {
  const crispyItem = MENU_PRODUCTS[3]; // Crispy Chicken
  const letters = ["C", "R", "I", "S", "P", "Y", "."];

  return html`
    <section
      id="crispy-section"
      className="crispy-experience-section"
      aria-labelledby="crispy-heading"
    >
      <h2 id="crispy-heading" className="sr-only">
        Crispy Chicken Experience — Shatter-Crisp Golden Fried Chicken
      </h2>

      <!-- Ambient Radial Fire Glow -->
      <div className="crispy-radial-burst" data-parallax="bg" aria-hidden="true" />

      <div className="section-container crispy-stage-wrap">
        <div className="crispy-top-meta">
          <span className="eyebrow-tag">03 // ACOUSTIC TEXTURE</span>
          <span className="crispy-db-badge">99.8% SHATTER CRUNCH INDEX</span>
        </div>

        <!-- Giant Kinetic Letters + Suspended Crispy Chicken Visual -->
        <div className="crispy-kinetic-arena">
          <!-- Letters Behind Visual -->
          <div
            className="crispy-word-row layer-back"
            data-parallax="type"
            aria-hidden="true"
          >
            ${letters.map(
              (ch, idx) => html`
                <span key=${idx} className="crispy-letter">
                  ${ch}
                </span>
              `
            )}
          </div>

          <!-- Centerpiece Suspended Crispy Chicken Burst -->
          <div className="crispy-visual-center" data-parallax="food" data-cursor="CRUNCH">
            <img
              src="./assets/images/crispy-chicken.jpg"
              alt="Meem Shatter-Crisp Golden Fried Chicken Tenders and Popcorn"
              className="crispy-hero-visual"
              loading="lazy"
            />

            <!-- Floating Crumb & Spice Particles -->
            <span className="crispy-crumb-floater c-1" aria-hidden="true">✦</span>
            <span className="crispy-crumb-floater c-2" aria-hidden="true">●</span>
            <span className="crispy-crumb-floater c-3" aria-hidden="true">◆</span>
            <span className="crispy-crumb-floater c-4" aria-hidden="true">✦</span>
          </div>

          <!-- Stroke Outline Letters in Front of Visual for 3D Sandwich Depth -->
          <div
            className="crispy-word-row layer-front-stroke"
            data-parallax="fg"
            aria-hidden="true"
          >
            ${letters.map(
              (ch, idx) => html`
                <span key=${idx} className="crispy-letter stroke-only">
                  ${ch}
                </span>
              `
            )}
          </div>
        </div>

        <div className="crispy-editorial-bar">
          <div className="crispy-copy-col">
            <h3>18-HOUR BUTTERMILK BRINE. TRIPLE-RIDGED GOLDEN ARMOR.</h3>
            <p>
              Every cut is hand-dredged for craggy, shattering ridges that lock in
              pure heat and natural juiciness—finished with smoky paprika-lime dust.
            </p>
          </div>
          <div className="crispy-action-col">
            <button
              type="button"
              className="magnetic-btn primary-fire-btn"
              data-cursor="ORDER"
              onClick=${() => onAddToOrder(crispyItem)}
            >
              <span>GET IT CRISPY — ${crispyItem.price}</span>
              <span className="cta-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}
