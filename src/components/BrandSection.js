import { html } from "../utils/html.js";
import { BRAND_PILLARS, SOCIAL_QUOTES } from "../data/menuData.js";

/**
 * Section 8 — Brand / Ingredient Story ("FRESH / CRISPY / JUICY / LOADED / MADE FRESH")
 * & Section 9 — Interactive Floating Social Proof Quotes
 */
export function BrandSection() {
  return html`
    <div className="brand-and-social-wrapper">
      <!-- SECTION 8: BRAND / INGREDIENT PHILOSOPHY -->
      <section
        id="brand-story-section"
        className="brand-story-section"
        aria-labelledby="brand-philosophy-heading"
      >
        <div className="section-container">
          <div className="brand-story-header">
            <span className="eyebrow-tag">07 // THE MEEM CODE</span>
            <h2 id="brand-philosophy-heading" className="section-giant-heading">
              BUILT FOR <span className="fire-accent-text">CRAVINGS.</span>
            </h2>
          </div>
        </div>

        <div className="pillars-kinetic-stack">
          ${BRAND_PILLARS.map(
            (pillar) => html`
              <article
                key=${pillar.num}
                className="pillar-kinetic-row"
                style=${{ "--pillar-accent": pillar.accent }}
                data-cursor=${pillar.word}
              >
                <div className="pillar-row-inner">
                  <span className="pillar-index">${pillar.num}</span>
                  <h3 className="pillar-giant-word">${pillar.word}</h3>
                  <div className="pillar-editorial-meta">
                    <strong>${pillar.subtitle}</strong>
                    <p>${pillar.copy}</p>
                  </div>
                </div>
              </article>
            `
          )}
        </div>
      </section>

      <!-- SECTION 9: INTERACTIVE FLOATING SOCIAL PROOF -->
      <section
        id="social-proof-section"
        className="social-proof-section"
        aria-labelledby="social-proof-heading"
      >
        <div className="section-container">
          <div className="social-header">
            <span className="eyebrow-tag">08 // STREET TALK</span>
            <h2 id="social-proof-heading" className="section-giant-heading">
              ONE MORE <span className="gold-accent-text">BITE.</span>
            </h2>
            <p className="social-disclaimer-note">
              Curated flavour reactions • Sample placeholder quotes ready for live
              guest feed integration
            </p>
          </div>

          <div className="floating-quotes-field">
            ${SOCIAL_QUOTES.map(
              (q, idx) => html`
                <div
                  key=${q.id}
                  className=${`floating-quote-card q-pos-${idx + 1}`}
                  data-speed=${q.speed}
                  data-cursor="VIBE"
                >
                  <span className="quote-flavor-tag">${q.tag}</span>
                  <blockquote className="quote-large-text">${q.quote}</blockquote>
                  <span className="quote-sample-meta">${q.note}</span>
                </div>
              `
            )}
          </div>
        </div>
      </section>
    </div>
  `;
}
