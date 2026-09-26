import { html } from "../utils/html.js";
import { HERO_PHASES } from "../data/menuData.js";

function splitChars(word) {
  return word.split("").map(
    (ch, i) => html`
      <span key=${i} className="char-mask">
        <span className="char-inner">${ch}</span>
      </span>
    `
  );
}

/**
 * Hero Section — Pinned 4-Phase 3D Shawarma Unwrapping Experience
 */
export function Hero({ activePhaseIndex, unwrapProgress, webglSupported, onOpenOrder }) {
  const currentPhase = HERO_PHASES[activePhaseIndex] || HERO_PHASES[0];
  const pct = Math.round(unwrapProgress * 100);

  return html`
    <section
      id="hero-pin-stage"
      className="hero-section"
      aria-label="Meem Shawarma Interactive 3D Hero"
    >
      <!-- SEO & Screen-Reader Accessible H1 -->
      <h1 className="sr-only">
        Meem Shawarma — Unwrap The Taste. Modern Flame-Grilled Chicken Shawarma,
        Crispy Chicken, Burgers, Bao & Cheese Bowls.
      </h1>

      <!-- Fast 1.4s Cinematic Intro Curtain (Section 6) -->
      <div className="intro-curtain" aria-hidden="true">
        <div className="intro-center-glow" />
        <div className="intro-logo-mark">
          <span className="intro-emblem">M</span>
          <span className="intro-brand-name">MEEM SHAWARMA</span>
          <span className="intro-tagline">UNWRAP THE TASTE</span>
        </div>
      </div>

      <!-- Ambient Background Layer (Moves ~5px on Mouse Parallax) -->
      <div className="hero-bg-glow" data-parallax="bg" aria-hidden="true" />

      <!-- LEFT TYPOGRAPHY (Behind 3D Object: z-index 1) -->
      <div
        className="hero-typography-layer hero-layer-behind"
        data-parallax="type"
        data-parallax-mult="0.85"
        aria-hidden="true"
      >
        <div className="hero-word-meem">${splitChars("MEEM")}</div>
      </div>

      <!-- FALLBACK HERO VISUAL IF WEBGL IS DISABLED (Section 44) -->
      ${!webglSupported &&
      html`
        <div className="webgl-fallback-stage" data-parallax="food">
          <img
            src="./assets/images/shawarma-wrapped.jpg"
            alt="Meem Chicken Shawarma wrapped in black and gold foil"
            className="fallback-img wrapped"
            style=${{ opacity: Math.max(0, 1 - unwrapProgress * 1.4) }}
          />
          <img
            src="./assets/images/shawarma-unwrapped.jpg"
            alt="Meem Chicken Shawarma freshly unwrapped"
            className="fallback-img unwrapped"
            style=${{ opacity: Math.min(1, unwrapProgress * 1.4) }}
          />
        </div>
      `}

      <!-- RIGHT TYPOGRAPHY (In Front of 3D Object: z-index 5) -->
      <div
        className="hero-typography-layer hero-layer-front"
        data-parallax="type"
        data-parallax-mult="1.25"
        aria-hidden="true"
      >
        <div className="hero-word-shawarma">${splitChars("SHAWARMA")}</div>
      </div>

      <!-- PHASE 4 REVEAL HEADLINE (75% - 100% Unwrapped State) -->
      <div className="hero-phase4-headline">
        <div className="phase4-eyebrow">100% UNWRAPPED • FLAME-KISSED</div>
        <h2 className="phase4-title">
          UNWRAP
          <br />
          <span>THE TASTE.</span>
        </h2>
        <p className="phase4-copy">
          24-hour marinated chicken thigh, shaved blazing hot off the spit into
          char-blistered artisan flatbread with whipped garlic toum & fiery shatta.
        </p>
        <div className="phase4-cta-row">
          <button
            type="button"
            className="magnetic-btn primary-fire-btn"
            data-cursor="CRAVE"
            onClick=${onOpenOrder}
          >
            <span>TASTE THE ICON</span>
            <span className="cta-arrow">→</span>
          </button>
        </div>
      </div>

      <!-- LIVE 4-PHASE UNWRAP TELEMETRY HUD (Left Bottom) -->
      <div className="hero-phase-hud" data-cursor="DRAG">
        <div className="hud-header">
          <span className="hud-phase-num">PHASE ${currentPhase.phase} / 04</span>
          <span className="hud-pct">${pct}% UNWRAPPED</span>
        </div>
        <div className="hud-progress-track">
          <div
            className="hud-progress-fill"
            style=${{ transform: `scaleX(${Math.max(0.04, unwrapProgress)})` }}
          />
        </div>
        <div className="hud-phase-title">${currentPhase.title}</div>
        <div className="hud-phase-detail">${currentPhase.detail}</div>
        <div className="hud-phase-dots" aria-hidden="true">
          ${HERO_PHASES.map(
            (p, idx) => html`
              <span
                key=${p.phase}
                className=${`phase-dot ${idx <= activePhaseIndex ? "is-lit" : ""}`}
              />
            `
          )}
        </div>
      </div>

      <!-- CENTER BOTTOM: "UNWRAP THE TASTE" + PREMIUM SCROLL INDICATOR (Section 12) -->
      <div className="hero-bottom-bar">
        <div className="hero-interactive-hint">
          <span className="pulse-dot" />
          <span>DRAG 3D SHAWARMA TO ROTATE • SCROLL TO UNWRAP</span>
        </div>
      </div>

      <div className="scroll-unwrap-indicator" aria-hidden="true">
        <span className="scroll-word">SCROLL</span>
        <div className="scroll-line-track">
          <div className="scroll-line-ember" />
        </div>
        <span className="scroll-arrow-glyph">↓</span>
        <span className="scroll-word highlight">UNWRAP</span>
      </div>
    </section>
  `;
}
