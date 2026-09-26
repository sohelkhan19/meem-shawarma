import { html } from "../utils/html.js";
import { LOCATION_INFO, MENU_PRODUCTS } from "../data/menuData.js";
import { soundFX } from "../animations/soundEngine.js";

/**
 * Section 10 — Location / Visit Us ("HUNGRY? COME GET YOURS.")
 * + Section 27 — Final CTA Loop ("READY FOR ANOTHER BITE?")
 */
export function LocationSection({ onOpenOrder, onAddToOrder }) {
  const shawarmaItem = MENU_PRODUCTS[0];

  return html`
    <div className="location-and-finale-wrap">
      <!-- SECTION 10: LOCATION / VISIT US -->
      <section
        id="location-section"
        className="location-section"
        aria-labelledby="location-heading"
      >
        <div className="section-container">
          <div className="location-hero-headline">
            <span className="eyebrow-tag">09 // FIND THE FLAME</span>
            <h2 id="location-heading" className="hungry-mega-title" data-parallax="type">
              ${LOCATION_INFO.headline}
            </h2>
            <div className="hungry-sub-title">${LOCATION_INFO.subheadline}</div>
          </div>

          <div className="location-bento-grid">
            <!-- Address & Directions Card -->
            <div className="location-card primary-loc-card">
              <div className="loc-card-eyebrow">FLAGSHIP KITCHEN</div>
              <h3>${LOCATION_INFO.brand}</h3>
              <p className="loc-address-line">${LOCATION_INFO.addressLine1}</p>
              <p className="loc-address-sub">${LOCATION_INFO.addressLine2}</p>

              <div className="loc-contact-row">
                <div>
                  <span className="loc-meta-lbl">HOTLINE</span>
                  <strong>${LOCATION_INFO.phone}</strong>
                </div>
                <div>
                  <span className="loc-meta-lbl">DIRECT</span>
                  <strong>${LOCATION_INFO.email}</strong>
                </div>
              </div>

              <div className="loc-cta-wrap">
                <a
                  href=${LOCATION_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="magnetic-btn directions-cta-btn"
                  data-cursor="MAP"
                  onMouseEnter=${() => soundFX.playHover()}
                >
                  <span>GET DIRECTIONS</span>
                  <span className="cta-arrow">→</span>
                </a>
              </div>
            </div>

            <!-- Hours & Socials Card -->
            <div className="location-card hours-loc-card">
              <div className="loc-card-eyebrow">LATE NIGHT HOURS</div>
              <ul className="hours-list">
                ${LOCATION_INFO.hours.map(
                  (h) => html`
                    <li key=${h.days} className="hours-row">
                      <span className="hours-days">${h.days}</span>
                      <span className="hours-time">${h.time}</span>
                    </li>
                  `
                )}
              </ul>

              <div className="socials-block">
                <div className="loc-card-eyebrow">FOLLOW THE HEAT</div>
                <div className="social-links-row">
                  ${LOCATION_INFO.socials.map(
                    (s) => html`
                      <a
                        key=${s.label}
                        href=${s.url}
                        className="social-pill-link"
                        data-cursor=${s.label}
                        onClick=${(e) => {
                          e.preventDefault();
                          soundFX.playClick(550, 0.04);
                        }}
                      >
                        <span>${s.label}</span>
                        <small>${s.handle}</small>
                      </a>
                    `
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 27: FINAL CTA VISUAL LOOP ("READY FOR ANOTHER BITE?") -->
      <section
        id="final-cta-section"
        className="final-cta-section"
        aria-labelledby="final-cta-heading"
      >
        <div className="section-container final-cta-grid">
          <div className="final-cta-copy">
            <div className="eyebrow-tag">10 // FULL CIRCLE</div>
            <h2 id="final-cta-heading" className="final-cta-title">
              READY FOR
              <br />
              <span className="fire-accent-text">ANOTHER BITE?</span>
            </h2>
            <p className="final-cta-sub">
              The foil is off. The spit is turning. Build your craving bag now for
              express pickup or hot delivery.
            </p>
            <div className="final-cta-actions">
              <button
                type="button"
                className="magnetic-btn primary-fire-btn xl-btn"
                data-cursor="ORDER NOW"
                onMouseEnter=${() => soundFX.playHover()}
                onClick=${() => {
                  soundFX.playClick(680, 0.06);
                  onOpenOrder();
                }}
              >
                <span>ORDER NOW</span>
                <span className="cta-arrow">→</span>
              </button>

              <button
                type="button"
                className="magnetic-btn secondary-ghost-btn"
                data-cursor="ADD ICON"
                onClick=${() => {
                  soundFX.playClick(620, 0.05);
                  onAddToOrder(shawarmaItem);
                }}
              >
                <span>+ QUICK ADD SHAWARMA (${shawarmaItem.price})</span>
              </button>
            </div>
          </div>

          <!-- Right Side: Unwrapped Shawarma Visual Loop Anchor (Syncs with 3D WebGL Return) -->
          <div className="final-shawarma-loop-stage" data-parallax="food" data-cursor="UNWRAPPED">
            <div className="final-loop-halo" aria-hidden="true" />
            <img
              src="./assets/images/shawarma-unwrapped.jpg"
              alt="Fully unwrapped Meem Chicken Shawarma ready for another bite"
              className="final-loop-shawarma-img"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  `;
}
