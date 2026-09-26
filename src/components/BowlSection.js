import { html } from "../utils/html.js";
import { MENU_PRODUCTS } from "../data/menuData.js";

const BOWL_INGREDIENTS = [
  {
    id: "ing-chicken",
    label: "FLAME-SHAVED SHAWARMA CHICKEN",
    sub: "Charred rotisserie chunks marinated 24 hours",
    posClass: "node-top-left",
    spreadX: -110,
    spreadY: -80
  },
  {
    id: "ing-cheese",
    label: "MOLTEN 3-CHEESE PULL",
    sub: "Aged cheddar, stretchy mozzarella & warm queso",
    posClass: "node-top-right",
    spreadX: 115,
    spreadY: -75
  },
  {
    id: "ing-sauce",
    label: "GARLIC TOUM & FIERY HARISSA",
    sub: "Cool whipped garlic swirled with red chili heat",
    posClass: "node-mid-left",
    spreadX: -135,
    spreadY: 15
  },
  {
    id: "ing-veg",
    label: "FRESH JALAPEÑOS & HERBS",
    sub: "Crisp green heat & chopped flat-leaf parsley",
    posClass: "node-mid-right",
    spreadX: 135,
    spreadY: 20
  },
  {
    id: "ing-fries",
    label: "SPICED GOLDEN CRINKLE FRIES",
    sub: "Crispy skin-on base dusted in Levantine spice salt",
    posClass: "node-bottom",
    spreadX: 0,
    spreadY: 105
  }
];

/**
 * Section 7 — Chicken Cheese Bowl ("EVERYTHING IN ONE BOWL.") — Section 23
 */
export function BowlSection({ onAddToOrder }) {
  const bowlItem = MENU_PRODUCTS[5];

  return html`
    <section
      id="bowl-section"
      className="bowl-experience-section"
      aria-labelledby="bowl-heading"
    >
      <div className="section-container">
        <div className="bowl-header-block">
          <div className="eyebrow-tag">06 // LOADED TO THE RIM</div>
          <h2 id="bowl-heading" className="section-giant-heading">
            EVERYTHING IN <span className="fire-accent-text">ONE BOWL.</span>
          </h2>
          <p className="bowl-header-copy">
            Spiced shawarma chicken, crispy golden fries, molten three-cheese pull,
            whipped garlic toum, and fiery harissa colliding in one unstoppable bowl.
          </p>
        </div>

        <!-- Rotating Bowl + Separating & Converging Ingredient Nodes -->
        <div className="bowl-orbit-arena">
          <div className="bowl-visual-rig" data-parallax="food" data-cursor="MOLTEN">
            <div className="bowl-orbit-ring" aria-hidden="true" />
            <img
              src="./assets/images/cheese-bowl.jpg"
              alt="Loaded Chicken Cheese Bowl with stretching melted cheese, grilled shawarma chicken, fries, garlic sauce, and jalapeños"
              className="bowl-center-img"
              loading="lazy"
            />
          </div>

          ${BOWL_INGREDIENTS.map(
            (node) => html`
              <div
                key=${node.id}
                className=${`bowl-ingredient-node ${node.posClass}`}
                data-spread-x=${node.spreadX}
                data-spread-y=${node.spreadY}
                data-cursor="INGREDIENT"
              >
                <span className="node-pulse-dot" />
                <div className="node-text">
                  <strong>${node.label}</strong>
                  <span>${node.sub}</span>
                </div>
              </div>
            `
          )}
        </div>

        <div className="bowl-footer-cta">
          <button
            type="button"
            className="magnetic-btn primary-fire-btn"
            data-cursor="ORDER"
            onClick=${() => onAddToOrder(bowlItem)}
          >
            <span>LOAD UP THE BOWL — ${bowlItem.price}</span>
            <span className="cta-arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  `;
}
