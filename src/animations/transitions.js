/**
 * Section Atmosphere Transitions & Full-Screen Overlay Transitions
 */
export function initSectionTransitions() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  const bgLayer = document.querySelector(".dynamic-atmosphere-bg");
  if (!bgLayer) return;

  const sectionThemes = [
    { selector: "#hero-pin-stage", bg: "#0b0908" },
    { selector: "#brand-intro-section", bg: "#120c09" },
    { selector: "#signature-menu-section", bg: "#140e09" },
    { selector: "#crispy-section", bg: "#1d1006" },
    { selector: "#burger-section", bg: "#150e07" },
    { selector: "#bao-section", bg: "#1d1714" }, // Softer warm transition for Bao
    { selector: "#bowl-section", bg: "#140b06" },
    { selector: "#brand-story-section", bg: "#0f0a08" },
    { selector: "#social-proof-section", bg: "#140d09" },
    { selector: "#location-section", bg: "#0b0908" }
  ];

  sectionThemes.forEach(({ selector, bg }) => {
    const el = document.querySelector(selector);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => {
        gsap.to(bgLayer, {
          backgroundColor: bg,
          duration: 0.75,
          ease: "power2.out",
          overwrite: "auto"
        });
      },
      onEnterBack: () => {
        gsap.to(bgLayer, {
          backgroundColor: bg,
          duration: 0.75,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    });
  });
}
