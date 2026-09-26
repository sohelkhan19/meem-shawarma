import { html, useState, useEffect, useRef, useCallback } from "./utils/html.js";
import { MENU_PRODUCTS } from "./data/menuData.js";
import { CustomCursor } from "./components/CustomCursor.js";
import { Navbar } from "./components/Navbar.js";
import { Hero } from "./components/Hero.js";
import { BrandIntroSection } from "./components/BrandIntroSection.js";
import { MenuSection } from "./components/MenuSection.js";
import { CrispySection } from "./components/CrispySection.js";
import { BurgerSection } from "./components/BurgerSection.js";
import { BaoSection } from "./components/BaoSection.js";
import { BowlSection } from "./components/BowlSection.js";
import { BrandSection } from "./components/BrandSection.js";
import { LocationSection } from "./components/LocationSection.js";
import { Footer } from "./components/Footer.js";
import { initShawarmaWebGL } from "./components/ShawarmaScene.js";
import {
  runHeroIntroSequence,
  initHeroScrollUnwrap
} from "./animations/heroAnimations.js";
import { initAllSectionScrollAnimations } from "./animations/scrollAnimations.js";
import {
  initGlobalMouseParallax,
  attachMagneticButtons
} from "./animations/hoverAnimations.js";
import { initSectionTransitions } from "./animations/transitions.js";

export function App() {
  const webglMountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [unwrapProgress, setUnwrapProgress] = useState(0);
  const [activeMenuProduct, setActiveMenuProduct] = useState(MENU_PRODUCTS[0]);
  const [orderOpen, setOrderOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    { ...MENU_PRODUCTS[0], qty: 1 }
  ]);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? "" : prev));
    }, 2400);
  }, []);

  const handleAddToOrder = useCallback(
    (product) => {
      setCartItems((prev) => {
        const found = prev.find((i) => i.id === product.id);
        if (found) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          );
        }
        return [...prev, { ...product, qty: 1 }];
      });
      showToast(`ADDED ${product.name.toUpperCase()} TO BAG`);
    },
    [showToast]
  );

  const handleRemoveFromOrder = useCallback((id) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const handleSelectMenuProductFromOverlay = useCallback((product) => {
    setActiveMenuProduct(product);
    const el = document.querySelector("#signature-menu-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 1. Initialize Lenis Smooth Scroll synchronized with GSAP ScrollTrigger (Section 30)
    let lenis = null;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (window.Lenis && !reducedMotion) {
      lenis = new window.Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.5
      });

      if (ScrollTrigger) {
        lenis.on("scroll", ScrollTrigger.update);
      }

      if (gsap) {
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }
    }

    // 2. Mount 3D WebGL Shawarma Scene
    let cleanupWebGL = () => {};
    if (webglMountRef.current) {
      cleanupWebGL = initShawarmaWebGL(webglMountRef.current, (supported) => {
        setWebglSupported(supported);
      });
    }

    // 3. Run Fast 1.4s Hero Intro & Setup ScrollTrigger Timelines
    runHeroIntroSequence(() => {
      if (ScrollTrigger) ScrollTrigger.refresh();
    });

    initHeroScrollUnwrap((phaseIdx, progress) => {
      setActivePhaseIndex(phaseIdx);
      setUnwrapProgress(progress);
    });

    initAllSectionScrollAnimations();
    initSectionTransitions();
    attachMagneticButtons();
    const cleanupParallax = initGlobalMouseParallax();

    return () => {
      cleanupWebGL();
      cleanupParallax();
      if (lenis) lenis.destroy();
    };
  }, []);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return html`
    <div className="meem-experience-root">
      <!-- Dynamic Atmosphere Background Layer -->
      <div className="dynamic-atmosphere-bg" aria-hidden="true" />

      <!-- Film Grain & Subtle Cinema Vignette Overlay (Section 46) -->
      <div className="cinema-grain-overlay" aria-hidden="true" />

      <!-- Fixed 3D WebGL Stage (Layered between behind/front Hero typography) -->
      <div
        id="webgl-stage"
        ref=${webglMountRef}
        className="webgl-fixed-canvas-stage"
        aria-hidden="true"
      />

      <!-- Custom Desktop Cursor -->
      <${CustomCursor} />

      <!-- Sticky Minimal Premium Navigation + Fullscreen Menu Overlay -->
      <${Navbar}
        onOpenOrder=${() => setOrderOpen(true)}
        cartCount=${totalCartCount}
        onSelectMenuProduct=${handleSelectMenuProductFromOverlay}
      />

      <!-- Live Micro-Toast Notification -->
      ${toastMessage &&
      html`
        <div className="craving-toast-pill" role="status" aria-live="polite">
          <span className="pulse-dot" />
          <span>${toastMessage}</span>
        </div>
      `}

      <!-- Main Storytelling Scroll Container -->
      <main id="main-content" className="story-scroll-main">
        <!-- Section 1: 3D Shawarma Unwrap Hero -->
        <${Hero}
          activePhaseIndex=${activePhaseIndex}
          unwrapProgress=${unwrapProgress}
          webglSupported=${webglSupported}
          onOpenOrder=${() => setOrderOpen(true)}
        />

        <!-- Section 2: Brand Introduction ("MADE FOR THE CRAVING.") -->
        <${BrandIntroSection} />

        <!-- Section 3: Signature Interactive Menu Showcase -->
        <${MenuSection}
          activeProduct=${activeMenuProduct}
          onSelectProduct=${setActiveMenuProduct}
          onAddToOrder=${handleAddToOrder}
        />

        <!-- Section 4: "CRISPY." Kinetic Typography & High-Speed Crunch Experience -->
        <${CrispySection} onAddToOrder=${handleAddToOrder} />

        <!-- Section 5: Oversized Chicken Burger ("STACKED WITH ATTITUDE.") -->
        <${BurgerSection} onAddToOrder=${handleAddToOrder} />

        <!-- Section 6: Floating Chicken Bao ("SOFT OUTSIDE. CRISPY INSIDE.") -->
        <${BaoSection} onAddToOrder=${handleAddToOrder} />

        <!-- Section 7: Rotating Chicken Cheese Bowl ("EVERYTHING IN ONE BOWL.") -->
        <${BowlSection} onAddToOrder=${handleAddToOrder} />

        <!-- Section 8 & 9: Brand Philosophy Pillars & Floating Social Proof -->
        <${BrandSection} />

        <!-- Section 10 & Final CTA Loop ("HUNGRY? COME GET YOURS." + "READY FOR ANOTHER BITE?") -->
        <${LocationSection}
          onOpenOrder=${() => setOrderOpen(true)}
          onAddToOrder=${handleAddToOrder}
        />
      </main>

      <!-- Footer + Interactive Craving Bag Drawer -->
      <${Footer}
        orderOpen=${orderOpen}
        onCloseOrder=${() => setOrderOpen(false)}
        cartItems=${cartItems}
        onAddItem=${handleAddToOrder}
        onRemoveItem=${handleRemoveFromOrder}
        onClearCart=${handleClearCart}
      />
    </div>
  `;
}

const rootEl = document.getElementById("root");
if (rootEl && window.ReactDOM) {
  const root = window.ReactDOM.createRoot(rootEl);
  root.render(html`<${App} />`);
}
