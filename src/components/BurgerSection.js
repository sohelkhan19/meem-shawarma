import { html, useState } from "../utils/html.js";
import { MENU_PRODUCTS } from "../data/menuData.js";
import { soundFX } from "../animations/soundEngine.js";

const BURGER_LAYERS = [
  {
    num: "01",
    name: "SESAME BRIOCHE CROWN",
    detail: "Butter-toasted golden dome dusted with roasted white sesame seeds.",
    side: "left"
  },
  {
    num: "02",
    name: "TORCHED AGED CHEDDAR",
    detail: "Melted over open heat with smoky chipotle-shawarma glaze drips.",
    side: "right"
  },
  {
    num: "03",
    name: "CRUNCHY THIGH FILLET",
    detail: "Oversized 18-hour buttermilk fried chicken thigh with craggy golden ridges.",
    side: "left"
  },
  {
    num: "04",
    name: "HOUSE DILL PICKLES",
    detail: "Thick-cut crinkle pickles & chilled shredded iceberg for sharp contrast.",
    side: "right"
  },
  {
    num: "05",
    name: "TOASTED BRIOCHE BASE",
    detail: "Seared with whipped garlic toum to seal the stack.",
    side: "left"
  }
];

/**
 * Section 5 — Chicken Burger ("STACKED WITH ATTITUDE.") — Section 21
 */
export function BurgerSection({ onAddToOrder }) {
  const burgerItem = MENU_PRODUCTS[4];
  const [activeLayer, setActiveLayer] = useState(2);

  return html`
    <section
      id="burger-section"
      className="burger-experience-section"
      aria-labelledby="burger-heading"
    >
      <div className="section-container">
        <div className="burger-header-center">
          <div className="eyebrow-tag">04 // ARCHITECTURE OF CRUNCH</div>
          <h2 id="burger-heading" className="section-giant-heading">
            STACKED WITH <span className="gold-accent-text">ATTITUDE.</span>
          </h2>
          <p className="burger-subcopy">
            A towering collision of shatter-crisp chicken thigh, stretching aged
            cheddar, smoky fire glaze, and butter-toasted brioche.
          </p>
        </div>

        <div className="burger-exploded-stage">
          <!-- Center Oversized Exploded Burger Visual Rig -->
          <div className="burger-visual-rig" data-parallax="food" data-cursor="STACK">
            <div className="burger-glow-halo" aria-hidden="true" />
            <img
              src="./assets/images/crispy-burger.jpg"
              alt="Oversized Crispy Chicken Burger with separated layers of brioche, melted cheddar, crunchy chicken fillet, pickles, and lettuce"
              className="burger-giant-img"
              loading="lazy"
            />
          </div>

          <!-- Interactive Separating Layer Callouts Around the Burger -->
          <div className="burger-layers-overlay">
            ${BURGER_LAYERS.map((layer, idx) => {
              const isSelected = activeLayer === idx;
              return html`
                <div
                  key=${layer.num}
                  className=${`burger-layer-tag side-${layer.side} ${
                    isSelected ? "is-active" : ""
                  }`}
                  data-cursor="LAYER"
                  onMouseEnter=${() => {
                    soundFX.playHover();
                    setActiveLayer(idx);
                  }}
                  onClick=${() => setActiveLayer(idx)}
                >
                  <div className="layer-connector-line" aria-hidden="true" />
                  <div className="layer-tag-card">
                    <div className="layer-tag-top">
                      <span className="layer-num">LAYER ${layer.num}</span>
                      <span className="layer-name">${layer.name}</span>
                    </div>
                    <p className="layer-detail">${layer.detail}</p>
                  </div>
                </div>
              `;
            })}
          </div>
        </div>

        <div className="burger-bottom-cta">
          <button
            type="button"
            className="magnetic-btn primary-fire-btn"
            data-cursor="ORDER"
            onClick=${() => onAddToOrder(burgerItem)}
          >
            <span>CLAIM THE BURGER — ${burgerItem.price}</span>
            <span className="cta-arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  `;
}
