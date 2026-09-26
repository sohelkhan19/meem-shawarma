import { sceneBridge } from "../components/ShawarmaScene.js";

/**
 * Hero Intro Sequence (1.5s fast cinematic load) +
 * 4-Phase ScrollTrigger Unwrapping Choreography
 */
export function runHeroIntroSequence(onIntroDone) {
  const gsap = window.gsap;
  if (!gsap) {
    sceneBridge.introProgress = 1;
    if (onIntroDone) onIntroDone();
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    sceneBridge.introProgress = 1;
    gsap.set(
      [
        ".intro-curtain",
        ".hero-word-meem",
        ".hero-word-shawarma",
        ".hero-bottom-bar",
        ".main-navbar",
        ".scroll-unwrap-indicator"
      ],
      { clearProps: "all" }
    );
    gsap.set(".intro-curtain", { autoAlpha: 0, display: "none" });
    if (onIntroDone) onIntroDone();
    return;
  }

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => {
      if (onIntroDone) onIntroDone();
    }
  });

  // 1. Small Meem Shawarma emblem & center glow pulse in darkness (0.0s - 0.55s)
  tl.fromTo(
    ".intro-logo-mark",
    { scale: 0.84, opacity: 0, y: 12 },
    { scale: 1, opacity: 1, y: 0, duration: 0.42 }
  )
    .to(
      ".intro-center-glow",
      { scale: 1.35, opacity: 0.9, duration: 0.45 },
      "<"
    )
    // 2. 3D Shawarma flies/fades into the scene as curtain lifts (0.45s - 1.35s)
    .to(
      sceneBridge,
      {
        introProgress: 1,
        duration: 1.05,
        ease: "power2.out"
      },
      0.32
    )
    .to(
      ".intro-curtain",
      {
        autoAlpha: 0,
        duration: 0.62,
        ease: "power2.inOut",
        onComplete: () => {
          const el = document.querySelector(".intro-curtain");
          if (el) el.style.display = "none";
        }
      },
      0.62
    )
    // 3. Oversized split typography MEEM (left, behind) & SHAWARMA (right, front)
    .fromTo(
      ".hero-word-meem .char-inner",
      { yPercent: 115, rotateZ: 4, opacity: 0 },
      {
        yPercent: 0,
        rotateZ: 0,
        opacity: 1,
        stagger: 0.04,
        duration: 0.72
      },
      0.72
    )
    .fromTo(
      ".hero-word-shawarma .char-inner",
      { yPercent: 115, rotateZ: -3, opacity: 0 },
      {
        yPercent: 0,
        rotateZ: 0,
        opacity: 1,
        stagger: 0.03,
        duration: 0.72
      },
      0.82
    )
    // 4. Bottom subtitle, Navigation & Scroll Indicator fade in
    .fromTo(
      ".main-navbar",
      { y: -28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55 },
      0.95
    )
    .fromTo(
      [".hero-bottom-bar", ".scroll-unwrap-indicator", ".hero-phase-hud"],
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.55 },
      1.02
    );
}

export function initHeroScrollUnwrap(onPhaseChange) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  const heroStage = document.querySelector("#hero-pin-stage");
  if (!heroStage) return;

  // Main Pinned 4-Phase Hero Unwrap Timeline
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: heroStage,
      start: "top top",
      end: "+=270%",
      pin: true,
      scrub: 0.65,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        sceneBridge.unwrapProgress = p;

        let activeIdx = 0;
        if (p >= 0.75) activeIdx = 3;
        else if (p >= 0.5) activeIdx = 2;
        else if (p >= 0.25) activeIdx = 1;

        if (onPhaseChange) onPhaseChange(activeIdx, p);
      }
    }
  });

  // Phase 1 (0 -> 0.25): Scroll indicator fades/transforms, MEEM & SHAWARMA begin kinetic drift
  heroTl
    .to(
      ".scroll-unwrap-indicator",
      {
        opacity: 0,
        y: 26,
        scale: 0.9,
        duration: 0.15
      },
      0.02
    )
    .to(
      ".hero-word-meem",
      {
        xPercent: -14,
        yPercent: -8,
        scale: 1.06,
        duration: 0.5,
        ease: "none"
      },
      0
    )
    .to(
      ".hero-word-shawarma",
      {
        xPercent: 16,
        yPercent: 10,
        scale: 1.08,
        duration: 0.5,
        ease: "none"
      },
      0
    )
    // Phase 2 & 3 (0.25 -> 0.75): Background words part to frame the unwrapping shawarma
    .to(
      ".hero-word-meem",
      {
        xPercent: -34,
        opacity: 0.22,
        duration: 0.5,
        ease: "power1.inOut"
      },
      0.5
    )
    .to(
      ".hero-word-shawarma",
      {
        xPercent: 38,
        opacity: 0.18,
        duration: 0.5,
        ease: "power1.inOut"
      },
      0.5
    )
    // Phase 4 (0.72 -> 1.0): Shawarma moves right while "UNWRAP THE TASTE." slides in boldly on the left
    .fromTo(
      ".hero-phase4-headline",
      {
        x: -90,
        opacity: 0,
        scale: 0.94
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.28,
        ease: "power2.out"
      },
      0.72
    );
}
