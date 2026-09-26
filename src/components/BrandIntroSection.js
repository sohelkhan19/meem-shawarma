import { html } from "../utils/html.js";

/**
 * Section 2 — Brand Introduction ("MADE FOR THE CRAVING." / "SERIOUSLY GOOD CHICKEN.")
 * Seamlessly continues from the Hero as the unwrapped 3D Shawarma rests on the right.
 */
export function BrandIntroSection() {
  return html`
    <section
      id="brand-intro-section"
      className="brand-intro-section"
      aria-labelledby="brand-intro-heading"
    >
      <div className="section-container brand-intro-grid">
        <div className="brand-intro-editorial">
          <div className="eyebrow-tag brand-intro-reveal">
            <span>01 // THE MANIFESTO</span>
          </div>

          <h2
            id="brand-intro-heading"
            className="editorial-display-title brand-intro-reveal"
            data-parallax="type"
          >
            MADE FOR
            <br />
            <span className="fire-accent-text">THE CRAVING.</span>
          </h2>

          <div className="editorial-subdisplay brand-intro-reveal">
            SERIOUSLY GOOD CHICKEN.
          </div>

          <p className="editorial-lead-copy brand-intro-reveal">
            Fresh chicken. Bold flavours. Crispy textures. Wrapped, stacked and
            served hot.
          </p>

          <div className="brand-stat-strip brand-intro-reveal">
            <div className="stat-block">
              <span className="stat-val">24H</span>
              <span className="stat-lbl">SPICE MARINADE</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-block">
              <span className="stat-val">450°F</span>
              <span className="stat-lbl">VERTICAL FLAME SPIT</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-block">
              <span className="stat-val">100%</span>
              <span className="stat-lbl">HAND-BUILT FRESH</span>
            </div>
          </div>
        </div>

        <!-- Right column frames the live 3D unwrapped Shawarma from the WebGL stage + floating tactile callouts -->
        <div className="brand-intro-stage-frame" data-parallax="food">
          <div className="floating-anatomy-card card-top" data-cursor="FRESH">
            <span className="anatomy-num">01</span>
            <div>
              <strong>WHIPPED GARLIC TOUM</strong>
              <p>Emulsified fresh daily with lemon & roasted garlic.</p>
            </div>
          </div>

          <div className="floating-anatomy-card card-mid" data-cursor="CHAR">
            <span className="anatomy-num">02</span>
            <div>
              <strong>FLAME-SHAVED CHICKEN</strong>
              <p>Caramelized edges, juicy Levantine spice core.</p>
            </div>
          </div>

          <div className="floating-anatomy-card card-bot" data-cursor="CRISP">
            <span className="anatomy-num">03</span>
            <div>
              <strong>BLISTERED SAJ FLATBREAD</strong>
              <p>Pressed on hot iron for smoky char & audible crunch.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
