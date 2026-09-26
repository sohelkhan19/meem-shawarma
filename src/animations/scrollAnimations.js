import { sceneBridge } from "../components/ShawarmaScene.js";

/**
 * Master ScrollTrigger Choreography for Sections 2 -> 10 & Final CTA Loop
 */
export function initAllSectionScrollAnimations() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

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
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.12,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#brand-intro-section",
        start: "top 75%"
      }
    }
  );

  if (reducedMotion) return;

  // 3. Section 4 — "CRISPY." Individual Letter Separation & Crumb Burst
  const crispyLetters = gsap.utils.toArray(".crispy-letter");
  if (crispyLetters.length) {
    const centerIdx = (crispyLetters.length - 1) / 2;
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
          x: (i) => (i - centerIdx) * -18,
          y: (i) => (i % 2 === 0 ? 35 : -35),
          rotateZ: (i) => (i - centerIdx) * -3
        },
        {
          x: (i) => (i - centerIdx) * 42,
          y: (i) => (i % 2 === 0 ? -28 : 28),
          rotateZ: (i) => (i - centerIdx) * 5,
          ease: "none"
        },
        0
      )
      .fromTo(
        ".crispy-hero-visual",
        { scale: 0.84, rotate: -8 },
        { scale: 1.12, rotate: 6, ease: "none" },
        0
      )
      .fromTo(
        ".crispy-crumb-floater",
        { y: 65, rotate: -25 },
        { y: -95, rotate: 45, stagger: 0.03, ease: "none" },
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
      { scale: 0.82, rotate: -9, y: 50 },
      { scale: 1.08, rotate: 5, y: -25, ease: "none" },
      0
    )
    .fromTo(
      ".burger-layer-tag",
      {
        y: (i) => (i - 2) * -28,
        x: (i) => (i % 2 === 0 ? -35 : 35),
        opacity: 0.25
      },
      {
        y: (i) => (i - 2) * 18,
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
      { rotate: -14, y: 60, scale: 0.88 },
      { rotate: 10, y: -40, scale: 1.06, ease: "none" },
      0
    )
    .fromTo(
      ".bao-steam-wisp",
      { y: 40, opacity: 0.15, scale: 0.85 },
      { y: -70, opacity: 0.65, scale: 1.25, stagger: 0.08, ease: "none" },
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
        { rotate: -16, scale: 0.86 },
        { rotate: 14, scale: 1.06, ease: "none" },
        0
      )
      .fromTo(
        ".bowl-ingredient-node",
        {
          x: (i, el) => parseFloat(el.dataset.spreadX || "0") * 1.45,
          y: (i, el) => parseFloat(el.dataset.spreadY || "0") * 1.45,
          scale: 0.85,
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
    gsap.fromTo(
      row.querySelector(".pillar-giant-word"),
      { xPercent: dir * -12 },
      {
        xPercent: dir * 8,
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
    gsap.fromTo(
      card,
      { y: 70 * speed, rotateZ: (speed - 1) * -8 },
      {
        y: -70 * speed,
        rotateZ: (speed - 1) * 8,
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

  // 9. Section 10 & Final CTA — Bring Back the Unwrapped 3D Shawarma (Full Circle Story Loop)
  ScrollTrigger.create({
    trigger: "#final-cta-section",
    start: "top 90%",
    end: "center center",
    scrub: 0.6,
    onUpdate: (self) => {
      sceneBridge.ctaReturnProgress = self.progress;
    }
  });
}
