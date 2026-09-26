import { html, useRef, useState } from "../utils/html.js";
import { soundFX } from "../animations/soundEngine.js";

/**
 * Interactive 3D Product Stage with Cursor-Driven 3D Tilt, Dynamic Specular Lighting,
 * Floating Ingredient Depth Layers, and Tactile Flavor Meters (Sections 17, 18, 19)
 */
export function ProductShowcase({ product, onAddToOrder }) {
  const stageRef = useRef(null);
  const [tilt, setTilt] = useState({
    rx: 0,
    ry: 0,
    lx: 50,
    ly: 50,
    tx: 0,
    ty: 0
  });

  const handleMouseMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width; // 0 -> 1
    const ny = (e.clientY - rect.top) / rect.height; // 0 -> 1

    const cx = (nx - 0.5) * 2; // -1 -> 1
    const cy = (ny - 0.5) * 2; // -1 -> 1

    setTilt({
      rx: -cy * 14,
      ry: cx * 16,
      lx: nx * 100,
      ly: ny * 100,
      tx: cx * 18,
      ty: cy * 14
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, lx: 50, ly: 50, tx: 0, ty: 0 });
  };

  return html`
    <div
      className="product-showcase-stage"
      style=${{
        "--stage-accent": product.accentColor,
        "--stage-glow": product.glowColor
      }}
    >
      <!-- Left: 3D Interactive Food Pedestal -->
      <div
        ref=${stageRef}
        className="product-3d-viewport"
        data-cursor="TILT 3D"
        onMouseMove=${handleMouseMove}
        onMouseLeave=${handleMouseLeave}
      >
        <div
          className="product-3d-card"
          style=${{
            transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.02, 1.02, 1.02)`
          }}
        >
          <!-- Dynamic Cursor-Reactive Light Source -->
          <div
            className="product-dynamic-light"
            style=${{
              background: `radial-gradient(circle at ${tilt.lx}% ${tilt.ly}%, ${product.glowColor}, transparent 68%)`
            }}
          />

          <!-- Background Giant Index Number (Deep Z Layer) -->
          <div
            className="product-depth-index"
            style=${{
              transform: `translate3d(${-tilt.tx * 0.6}px, ${-tilt.ty * 0.6}px, -40px)`
            }}
          >
            ${product.index}
          </div>

          <!-- Centerpiece High-Res Food Visual (Mid-Front Z Layer) -->
          <div
            className="product-visual-wrap"
            style=${{
              transform: `translate3d(${tilt.tx}px, ${tilt.ty}px, 55px)`
            }}
          >
            <img
              key=${product.id}
              src=${product.image}
              alt=${product.name}
              className="product-hero-img"
            />
          </div>

          <!-- Foreground Floating Ingredient Orbit Tags (Front Z Layer) -->
          <div
            className="product-floating-badges"
            style=${{
              transform: `translate3d(${tilt.tx * 1.45}px, ${tilt.ty * 1.45}px, 95px)`
            }}
          >
            <span className="float-pill pill-tl">${product.badge}</span>
            <span className="float-pill pill-br">${product.prepTime}</span>
            <span className="float-pill pill-bl">${product.calories}</span>
          </div>
        </div>
      </div>

      <!-- Right: Editorial Product Story & Interactive Controls -->
      <div className="product-showcase-details">
        <div className="showcase-meta-header">
          <span className="showcase-cat-tag">
            ${product.index} // ${product.category.toUpperCase()}
          </span>
          <span className="showcase-price-tag">${product.price}</span>
        </div>

        <h3 className="showcase-product-title">${product.name}</h3>
        <p className="showcase-product-hook">“${product.tagline}”</p>
        <p className="showcase-product-desc">${product.description}</p>

        <!-- Tactile Sensory Telemetry Bars -->
        <div className="sensory-meters">
          <div className="meter-row">
            <span className="meter-label">CRUNCH FACTOR</span>
            <div className="meter-track">
              <div
                className="meter-fill"
                style=${{ width: `${product.crunchLevel}%` }}
              />
            </div>
            <span className="meter-val">${product.crunchLevel}%</span>
          </div>
          <div className="meter-row">
            <span className="meter-label">FLAME & SPICE</span>
            <div className="meter-track">
              <div
                className="meter-fill"
                style=${{ width: `${product.spiceLevel}%` }}
              />
            </div>
            <span className="meter-val">${product.spiceLevel}%</span>
          </div>
          <div className="meter-row">
            <span className="meter-label">JUICINESS</span>
            <div className="meter-track">
              <div
                className="meter-fill"
                style=${{ width: `${product.juiciness}%` }}
              />
            </div>
            <span className="meter-val">${product.juiciness}%</span>
          </div>
        </div>

        <!-- Ingredient Anatomy Chips -->
        <div className="showcase-ingredients-block">
          <div className="ingredients-heading">ANATOMY OF THE BITE</div>
          <div className="ingredients-chip-list">
            ${product.ingredients.map(
              (ing) => html`
                <span key=${ing} className="ingredient-pill">${ing}</span>
              `
            )}
          </div>
        </div>

        <div className="showcase-cta-row">
          <button
            type="button"
            className="magnetic-btn primary-fire-btn"
            data-cursor="ADD"
            onMouseEnter=${() => soundFX.playHover()}
            onClick=${() => {
              soundFX.playClick(680, 0.06);
              onAddToOrder(product);
            }}
          >
            <span>ADD TO CRAVING BAG — ${product.price}</span>
            <span className="cta-arrow">+</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
