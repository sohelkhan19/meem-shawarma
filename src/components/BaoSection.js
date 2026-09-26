import { html, useState } from "../utils/html.js";
import { MENU_PRODUCTS } from "../data/menuData.js";

/**
 * Section 6 — Chicken Bao ("SOFT OUTSIDE. CRISPY INSIDE.") — Section 22
 */
export function BaoSection({ onAddToOrder }) {
  const baoItem = MENU_PRODUCTS[2];
  const [mouseTilt, setMouseTilt] = useState({ rx: 0, ry: 0 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ rx: -y * 16, ry: x * 18 });
  };

  return html`
    <section
      id="bao-section"
      className="bao-experience-section"
      aria-labelledby="bao-heading"
    >
      <div className="section-container bao-split-layout">
        <!-- Left: Soft Editorial Typography -->
        <div className="bao-editorial-col">
          <div className="eyebrow-tag soft-cream">05 // DUALITY OF TEXTURE</div>

          <h2 id="bao-heading" className="bao-display-heading" data-parallax="type">
            SOFT OUTSIDE.
            <br />
            <span className="fire-accent-text">CRISPY INSIDE.</span>
          </h2>

          <p className="bao-lead-copy">
            A pillowy, cloud-white steamed lotus gua bao folded around a crackling
            chili-honey glazed fried chicken tender—brightened with pickled purple
            cabbage slaw, fresh cilantro, and toasted sesame seeds.
          </p>

          <div className="bao-contrast-grid">
            <div className="contrast-card">
              <span className="contrast-tag">OUTER SHELL</span>
              <strong>STEAMED CLOUD BAO</strong>
              <p>Warm, feather-light dough steamed in bamboo baskets.</p>
            </div>
            <div className="contrast-card">
              <span className="contrast-tag">INNER CORE</span>
              <strong>GLAZED CRUNCH CHICKEN</strong>
              <p>Sticky sweet-heat chili glaze over shatter-crisp chicken.</p>
            </div>
          </div>

          <div className="bao-cta-wrap">
            <button
              type="button"
              className="magnetic-btn primary-fire-btn"
              data-cursor="ORDER"
              onClick=${() => onAddToOrder(baoItem)}
            >
              <span>TASTE THE BAO — ${baoItem.price}</span>
              <span className="cta-arrow">→</span>
            </button>
          </div>
        </div>

        <!-- Right: Floating 3D Chicken Bao Stage with Steam Wisps -->
        <div
          className="bao-visual-column"
          data-cursor="FLOAT"
          onMouseMove=${handleMove}
          onMouseLeave=${() => setMouseTilt({ rx: 0, ry: 0 })}
        >
          <div className="bao-steam-layer" aria-hidden="true">
            <span className="bao-steam-wisp wisp-1" />
            <span className="bao-steam-wisp wisp-2" />
            <span className="bao-steam-wisp wisp-3" />
          </div>

          <div
            className="bao-visual-rig"
            style=${{
              transform: `perspective(1000px) rotateX(${mouseTilt.rx}deg) rotateY(${mouseTilt.ry}deg)`
            }}
          >
            <img
              src="./assets/images/chicken-bao.jpg"
              alt="Floating Steamed Chicken Bao Bun with Crispy Glazed Chicken and Pickled Slaw"
              className="bao-floating-img"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  `;
}
