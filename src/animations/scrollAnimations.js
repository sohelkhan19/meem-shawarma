import { sceneBridge } from "../components/ShawarmaScene.js";

/**
 * Master ScrollTrigger Choreography for Sections 2 -> 10 & Final CTA Loop
 * Includes mobile-safe bounds so no animation causes horizontal overflow on small viewports.
 */
export function initAllSectionScrollAnimations() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isMobile = window.innerWidth < 768;

  // 1. Transition 3D Shawarma visibility after Brand Intro -> Menu
  ScrollTrigger.create({
    trigger: "#signature-menu-section",
    start: "top 85%",
    end: "top 20%",
    scrub: true,
    onUpdate: (self) => {
      sceneBridge.visibilityAlpha = 1 - self.progress * 0.88;
    }
  });

  // 2. Section 2 — Brand Introduction Reveal
  gsap.fromTo(
    ".brand-intro-reveal",
    { y: isMobile ? 32 : 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.12,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#brand-intro-section",
        start: "top 78%"
      }
    }
  );

  if (reducedMotion) return;

  // 3. Section 4 — "CRISPY." Individual Letter Separation & Crumb Burst
  const crispyLetters = gsap.utils.toArray(".crispy-letter");
  if (crispyLetters.length) {
    const centerIdx = (crispyLetters.length - 1) / 2;
    const spreadStart = isMobile ? -4 : -18;
    const spreadEnd = isMobile ? 8 : 36;
    const yOffset = isMobile ? 14 : 32;

    gsap.timeline({
      scrollTrigger: {
        trigger: "#crispy-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6
      }
    })
      .fromTo(
        crispyLetters,
        {
          x: (i) => (i - centerIdx) * spreadStart,
          y: (i) => (i % 2 === 0 ? yOffset : -yOffset),
          rotateZ: (i) => (i - centerIdx) * -2.5
        },
        {
          x: (i) => (i - centerIdx) * spreadEnd,
          y: (i) => (i % 2 === 0 ? -yOffset : yOffset),
          rotateZ: (i) => (i - centerIdx) * 4,
          ease: "none"
        },
        0
      )
      .fromTo(
        ".crispy-hero-visual",
        { scale: 0.88, rotate: -6 },
        { scale: isMobile ? 1.02 : 1.1, rotate: 5, ease: "none" },
        0
      )
      .fromTo(
        ".crispy-crumb-floater",
        { y: 40, rotate: -20 },
        { y: -65, rotate: 35, stagger: 0.03, ease: "none" },
        0
      );
  }

  // 4. Section 5 — Chicken Burger ("STACKED WITH ATTITUDE.") Scroll Zoom, Rotate & Layer Separation
  gsap.timeline({
    scrollTrigger: {
      trigger: "#burger-section",
      start: "top 85%",
      end: "bottom 15%",
      scrub: 0.65
    }
  })
    .fromTo(
      ".burger-visual-rig",
      { scale: 0.86, rotate: -7, y: 30 },
      { scale: isMobile ? 1.0 : 1.06, rotate: 4, y: -15, ease: "none" },
      0
    )
    .fromTo(
      ".burger-layer-tag",
      {
        y: (i) => (isMobile ? 16 : (i - 2) * -24),
        x: (i) => (isMobile ? 0 : i % 2 === 0 ? -24 : 24),
        opacity: 0.35
      },
      {
        y: (i) => (isMobile ? 0 : (i - 2) * 14),
        x: 0,
        opacity: 1,
        ease: "power2.out"
      },
      0
    );

  // 5. Section 6 — Chicken Bao ("SOFT OUTSIDE. CRISPY INSIDE.") Softer Transition & Gentle Rotation
  gsap.timeline({
    scrollTrigger: {
      trigger: "#bao-section",
      start: "top 85%",
      end: "bottom 15%",
      scrub: 0.65
    }
  })
    .fromTo(
      ".bao-visual-rig",
      { rotate: -10, y: 35, scale: 0.9 },
      { rotate: 8, y: -25, scale: isMobile ? 1.0 : 1.05, ease: "none" },
      0
    )
    .fromTo(
      ".bao-steam-wisp",
      { y: 25, opacity: 0.15, scale: 0.85 },
      { y: -45, opacity: 0.6, scale: 1.15, stagger: 0.08, ease: "none" },
      0
    );

  // 6. Section 7 — Chicken Cheese Bowl ("EVERYTHING IN ONE BOWL.") Orbit Rotation & Ingredient Convergence
  const bowlRig = document.querySelector(".bowl-visual-rig");
  if (bowlRig) {
    gsap.timeline({
      scrollTrigger: {
        trigger: "#bowl-section",
        start: "top 85%",
        end: "bottom 15%",
        scrub: 0.65
      }
    })
      .fromTo(
        ".bowl-visual-rig",
        { rotate: -14, scale: 0.88 },
        { rotate: 12, scale: isMobile ? 1.0 : 1.05, ease: "none" },
        0
      )
      .fromTo(
        ".bowl-ingredient-node",
        {
          x: (i, el) =>
            isMobile ? 0 : parseFloat(el.dataset.spreadX || "0") * 1.15,
          y: (i, el) =>
            isMobile ? 18 : parseFloat(el.dataset.spreadY || "0") * 1.15,
          scale: isMobile ? 0.96 : 0.88,
          opacity: 0.35
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          ease: "power2.out"
        },
        0
      );
  }

  // 7. Section 8 — Brand / Ingredient Story Kinetic Word Marquee & Stagger
  gsap.utils.toArray(".pillar-kinetic-row").forEach((row, idx) => {
    const dir = idx % 2 === 0 ? 1 : -1;
    const xAmt = isMobile ? 2 : 7;
    gsap.fromTo(
      row.querySelector(".pillar-giant-word"),
      { xPercent: dir * -xAmt },
      {
        xPercent: dir * xAmt,
        ease: "none",
        scrollTrigger: {
          trigger: row,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5
        }
      }
    );
  });

  // 8. Section 9 — Social Proof Floating Quotes at Different Speeds
  gsap.utils.toArray(".floating-quote-card").forEach((card) => {
    const speed = parseFloat(card.dataset.speed || "1");
    const yTravel = isMobile ? 20 * speed : 60 * speed;
    const rotAmt = isMobile ? 0 : (speed - 1) * 6;
    gsap.fromTo(
      card,
      { y: yTravel, rotateZ: -rotAmt },
      {
        y: -yTravel,
        rotateZ: rotAmt,
        ease: "none",
        scrollTrigger: {
          trigger: "#social-proof-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5
        }
      }
    );
  });

  // 9. Section 10 & Final CTA + Finale Stage — Bring Back the Unwrapped 3D Shawarma
  ScrollTrigger.create({
    trigger: "#final-cta-section",
    start: "top 85%",
    end: "top 25%",
    scrub: 0.5,
    onUpdate: (self) => {
      sceneBridge.ctaReturnProgress = self.progress;
    }
  });
}
