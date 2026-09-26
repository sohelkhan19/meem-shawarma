/**
 * Magnetic Buttons, Multi-Layer Mouse Parallax, and 3D Product Tilt Helpers
 */
export function initGlobalMouseParallax() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reducedMotion || window.innerWidth < 768) return () => {};

  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;
  let rafId = null;

  const onMouseMove = (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  window.addEventListener("mousemove", onMouseMove, { passive: true });

  const tick = () => {
    rafId = requestAnimationFrame(tick);
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;

    // Layer 1: Background layer (~5px)
    document.querySelectorAll("[data-parallax='bg']").forEach((el) => {
      el.style.transform = `translate3d(${curX * 5}px, ${curY * 5}px, 0)`;
    });

    // Layer 2: Typography layer (~14px)
    document.querySelectorAll("[data-parallax='type']").forEach((el) => {
      const mult = parseFloat(el.dataset.parallaxMult || "1");
      el.style.transform = `translate3d(${curX * 14 * mult}px, ${curY * 12 * mult}px, 0)`;
    });

    // Layer 3: Food visual layer (~24px)
    document.querySelectorAll("[data-parallax='food']").forEach((el) => {
      const mult = parseFloat(el.dataset.parallaxMult || "1");
      el.style.transform = `translate3d(${curX * 24 * mult}px, ${curY * 20 * mult}px, 0)`;
    });

    // Layer 4: Foreground particles (~35px)
    document.querySelectorAll("[data-parallax='fg']").forEach((el) => {
      el.style.transform = `translate3d(${curX * 35}px, ${curY * 32}px, 0)`;
    });
  };

  tick();

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("mousemove", onMouseMove);
  };
}

/**
 * Magnetic Button Attachment using GSAP quickTo interpolation
 */
export function attachMagneticButtons() {
  const gsap = window.gsap;
  if (!gsap || window.innerWidth < 768) return;

  const buttons = document.querySelectorAll(".magnetic-btn");
  buttons.forEach((btn) => {
    if (btn.dataset.magneticBound === "true") return;
    btn.dataset.magneticBound = "true";

    const xTo = gsap.quickTo(btn, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.45, ease: "power3.out" });

    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * 0.34);
      yTo(relY * 0.34);
    });

    btn.addEventListener("mouseleave", () => {
      xTo(0);
      yTo(0);
    });
  });
}
