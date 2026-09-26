import { html, useState } from "../utils/html.js";
import { MENU_PRODUCTS } from "../data/menuData.js";
import { soundFX } from "../animations/soundEngine.js";

/**
 * Footer + Interactive Craving Order Drawer
 */
export function Footer({
  orderOpen,
  onCloseOrder,
  cartItems,
  onAddItem,
  onRemoveItem,
  onClearCart
}) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [sauceLevel, setSauceLevel] = useState("EXTRA GARLIC TOUM + SHATTA");

  const subtotal = cartItems.reduce((sum, item) => {
    const val = parseFloat(item.price.replace("$", "")) || 0;
    return sum + val * item.qty;
  }, 0);

  const handleCheckout = () => {
    soundFX.playClick(760, 0.08);
    setOrderPlaced(true);
    setTimeout(() => {
      onClearCart();
      setOrderPlaced(false);
      onCloseOrder();
    }, 2400);
  };

  return html`
    <footer className="site-footer" role="contentinfo">
      <div className="section-container footer-inner">
        <div className="footer-brand-row">
          <span className="footer-giant-watermark" aria-hidden="true">
            MEEM SHAWARMA
          </span>
        </div>

        <div className="footer-bottom-bar">
          <p>© ${new Date().getFullYear()} MEEM SHAWARMA. UNWRAP THE TASTE.</p>
          <div className="footer-mini-links">
            <a href="#hero-pin-stage" data-cursor="TOP">BACK TO TOP ↑</a>
            <a href="#signature-menu-section" data-cursor="MENU">SIGNATURE MENU</a>
            <a href="#location-section" data-cursor="VISIT">FIND US</a>
          </div>
        </div>
      </div>

      <!-- Interactive Craving Order Drawer -->
      <div
        className=${`order-drawer-modal ${orderOpen ? "is-open" : ""}`}
        aria-hidden=${!orderOpen}
        role="dialog"
        aria-label="Your Meem Shawarma Craving Bag"
      >
        <div className="order-drawer-backdrop" onClick=${onCloseOrder} />
        <div className="order-drawer-panel">
          <div className="drawer-header">
            <div>
              <span className="eyebrow-tag">HOT OFF THE SPIT</span>
              <h3>YOUR CRAVING BAG</h3>
            </div>
            <button
              type="button"
              className="drawer-close-btn"
              data-cursor="CLOSE"
              onClick=${onCloseOrder}
            >
              ✕
            </button>
          </div>

          ${orderPlaced
            ? html`
                <div className="order-success-state">
                  <div className="success-flame-icon">🔥</div>
                  <h4>FIRE IS LIT! ORDER RECEIVED.</h4>
                  <p>
                    Our kitchen is shaving the spit and crisping your order fresh.
                  </p>
                </div>
              `
            : html`
                <div className="drawer-body">
                  ${cartItems.length === 0
                    ? html`
                        <div className="empty-bag-state">
                          <p>Your craving bag is currently empty. Pick a signature item:</p>
                          <div className="quick-pick-grid">
                            ${MENU_PRODUCTS.map(
                              (prod) => html`
                                <button
                                  key=${prod.id}
                                  type="button"
                                  className="quick-pick-card"
                                  onClick=${() => {
                                    soundFX.playClick(640, 0.05);
                                    onAddItem(prod);
                                  }}
                                >
                                  <img src=${prod.image} alt=${prod.name} />
                                  <div>
                                    <strong>${prod.name}</strong>
                                    <span>${prod.price}</span>
                                  </div>
                                </button>
                              `
                            )}
                          </div>
                        </div>
                      `
                    : html`
                        <ul className="bag-items-list">
                          ${cartItems.map(
                            (item) => html`
                              <li key=${item.id} className="bag-item-row">
                                <img
                                  src=${item.image}
                                  alt=${item.name}
                                  className="bag-item-thumb"
                                />
                                <div className="bag-item-info">
                                  <strong>${item.name}</strong>
                                  <span>${item.price} each</span>
                                </div>
                                <div className="bag-qty-controls">
                                  <button
                                    type="button"
                                    onClick=${() => onRemoveItem(item.id)}
                                  >
                                    −
                                  </button>
                                  <span>${item.qty}</span>
                                  <button
                                    type="button"
                                    onClick=${() => onAddItem(item)}
                                  >
                                    +
                                  </button>
                                </div>
                              </li>
                            `
                          )}
                        </ul>

                        <div className="sauce-selector-box">
                          <span className="sauce-box-label">SIGNATURE SAUCE LEVEL</span>
                          <div className="sauce-pills">
                            ${[
                              "CLASSIC GARLIC TOUM",
                              "EXTRA GARLIC TOUM + SHATTA",
                              "MAXIMUM FIRE SHATTA"
                            ].map(
                              (lvl) => html`
                                <button
                                  key=${lvl}
                                  type="button"
                                  className=${`sauce-pill ${
                                    sauceLevel === lvl ? "is-active" : ""
                                  }`}
                                  onClick=${() => setSauceLevel(lvl)}
                                >
                                  ${lvl}
                                </button>
                              `
                            )}
                          </div>
                        </div>
                      `}
                </div>

                ${cartItems.length > 0 &&
                html`
                  <div className="drawer-footer">
                    <div className="subtotal-row">
                      <span>ESTIMATED TOTAL</span>
                      <strong>$${subtotal.toFixed(2)}</strong>
                    </div>
                    <button
                      type="button"
                      className="magnetic-btn primary-fire-btn full-width-btn"
                      onClick=${handleCheckout}
                    >
                      <span>FIRE MY ORDER NOW →</span>
                    </button>
                  </div>
                `}
              `}
        </div>
      </div>
    </footer>
  `;
}
