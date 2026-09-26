import * as THREE from "../../vendor/three.module.min.js";

/**
 * Cinematic Camera Controller with Scroll Choreography & Mouse Parallax
 */
export function createCameraController(width, height, isMobile = false) {
  const camera = new THREE.PerspectiveCamera(
    isMobile ? 44 : 36,
    width / Math.max(height, 1),
    0.1,
    100
  );

  // Start slightly pulled back for intro dolly-in
  const state = {
    introProgress: 0, // 0 -> 1 during initial 1.4s load
    scrollProgress: 0, // 0 -> 1 during Hero unwrap scroll
    pageProgress: 0, // 0 -> 1 across entire page
    baseZ: isMobile ? 8.2 : 6.7,
    targetX: 0,
    targetY: 0.15,
    targetZ: isMobile ? 8.2 : 6.7,
    lookAtX: 0,
    lookAtY: 0.1,
    lookAtZ: 0
  };

  camera.position.set(0, 0.25, state.baseZ + 2.4);
  camera.lookAt(0, 0.1, 0);

  function resize(newWidth, newHeight, mobileFlag) {
    camera.aspect = newWidth / Math.max(newHeight, 1);
    camera.fov = mobileFlag ? 44 : 36;
    state.baseZ = mobileFlag ? 8.2 : 6.7;
    camera.updateProjectionMatrix();
  }

  function update(mouseX, mouseY, reducedMotion = false) {
    const p = state.scrollProgress;
    const introOffsetZ = (1 - state.introProgress) * 2.2;

    // Cinematic camera dolly + subtle orbit across the 4 hero scroll phases:
    // Phase 1 (0 - 0.25): Camera slowly moves closer
    // Phase 2 (0.25 - 0.5): Camera orbits slightly to inspect exposed chicken crown
    // Phase 3 (0.5 - 0.75): Close-up tangible focus on ingredients
    // Phase 4 (0.75 - 1.0): Pulls smoothly into editorial composition
    let dollyZ = state.baseZ + introOffsetZ;
    let orbitX = 0;
    let orbitY = 0.12;

    if (!reducedMotion) {
      if (p <= 0.25) {
        const t = p / 0.25;
        dollyZ -= t * 0.75;
        orbitY = 0.12 + t * 0.12;
      } else if (p <= 0.5) {
        const t = (p - 0.25) / 0.25;
        dollyZ -= 0.75 + t * 0.45;
        orbitX = Math.sin(t * Math.PI * 0.5) * 0.32;
        orbitY = 0.24 + t * 0.14;
      } else if (p <= 0.75) {
        const t = (p - 0.5) / 0.25;
        dollyZ -= 1.2 - t * 0.35;
        orbitX = 0.32 - t * 0.45;
        orbitY = 0.38 - t * 0.22;
      } else {
        const t = (p - 0.75) / 0.25;
        dollyZ -= 0.85 - t * 0.65;
        orbitX = -0.13 + t * 0.13;
        orbitY = 0.16 - t * 0.08;
      }
    }

    const parallaxX = reducedMotion ? 0 : mouseX * 0.28;
    const parallaxY = reducedMotion ? 0 : mouseY * 0.22;

    state.targetX = orbitX + parallaxX;
    state.targetY = orbitY + parallaxY;
    state.targetZ = dollyZ;

    camera.position.x += (state.targetX - camera.position.x) * 0.07;
    camera.position.y += (state.targetY - camera.position.y) * 0.07;
    camera.position.z += (state.targetZ - camera.position.z) * 0.07;

    camera.lookAt(
      state.lookAtX + parallaxX * 0.25,
      state.lookAtY + parallaxY * 0.2,
      state.lookAtZ
    );
  }

  return {
    camera,
    state,
    resize,
    update
  };
}
