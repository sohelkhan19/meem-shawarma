import * as THREE from "../../vendor/three.module.min.js";
import { createShawarmaTextures } from "../3d/Textures.js";
import { setupLighting } from "../3d/Lighting.js";
import { createCameraController } from "../3d/Camera.js";
import { createParticleSystem } from "../3d/Particles.js";
import { createShawarmaModel } from "../3d/ShawarmaModel.js";
import { createSecondaryFoodModels } from "../3d/FoodModel.js";

/**
 * Shared Global Scene Controller so GSAP ScrollTriggers & UI Components
 * can drive the 3D Shawarma unwrapping and camera choreography.
 */
export const sceneBridge = {
  unwrapProgress: 0,      // 0 -> 1 during Hero Scroll
  introProgress: 0,       // 0 -> 1 during initial 1.4s load
  brandSectionProgress: 0,// 0 -> 1 during Section 2 (Brand Intro)
  visibilityAlpha: 1,     // Fades out during mid-sections, returns at Final CTA
  ctaReturnProgress: 0,   // 0 -> 1 at Final CTA ("READY FOR ANOTHER BITE?")
  mouseX: 0,
  mouseY: 0,
  webglSupported: true,
  setPhaseCallback: null
};

export function checkWebGLSupport() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

export function initShawarmaWebGL(canvasContainer, onReady) {
  if (!checkWebGLSupport()) {
    sceneBridge.webglSupported = false;
    if (onReady) onReady(false);
    return () => {};
  }

  const isMobile = window.innerWidth < 768;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const width = window.innerWidth;
  const height = window.innerHeight;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0908, 0.065);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isMobile,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.shadowMap.enabled = !isMobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  canvasContainer.innerHTML = "";
  canvasContainer.appendChild(renderer.domElement);

  const textures = createShawarmaTextures();
  const lighting = setupLighting(scene);
  const cameraCtrl = createCameraController(width, height, isMobile);
  const particles = createParticleSystem(
    scene,
    textures.particleTexture,
    isMobile
  );
  const shawarma = createShawarmaModel(textures);
  scene.add(shawarma.rootRig);

  const secondaryFood = createSecondaryFoodModels(textures);
  scene.add(secondaryFood.group);

  // Subtle warm volumetric back-halo behind the Shawarma
  const haloGeo = new THREE.PlaneGeometry(5.5, 5.5);
  const haloMat = new THREE.MeshBasicMaterial({
    map: textures.particleTexture,
    color: 0xff5418,
    transparent: true,
    opacity: 0.19,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.position.set(0, 0.1, -1.65);
  scene.add(haloMesh);

  // Mouse & Touch Drag Interaction
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;

  const onPointerMove = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    sceneBridge.mouseX = (clientX / window.innerWidth - 0.5) * 2;
    sceneBridge.mouseY = -(clientY / window.innerHeight - 0.5) * 2;

    if (isDragging) {
      const dx = clientX - prevX;
      const dy = clientY - prevY;
      shawarma.addDragDelta(dx, dy);
      prevX = clientX;
      prevY = clientY;
    }
  };

  const onPointerDown = (e) => {
    isDragging = true;
    prevX = e.touches ? e.touches[0].clientX : e.clientX;
    prevY = e.touches ? e.touches[0].clientY : e.clientY;
  };

  const onPointerUp = () => {
    isDragging = false;
  };

  window.addEventListener("mousemove", onPointerMove, { passive: true });
  window.addEventListener("mousedown", onPointerDown, { passive: true });
  window.addEventListener("mouseup", onPointerUp, { passive: true });
  window.addEventListener("touchstart", onPointerDown, { passive: true });
  window.addEventListener("touchmove", onPointerMove, { passive: true });
  window.addEventListener("touchend", onPointerUp, { passive: true });

  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const mob = w < 768;
    renderer.setSize(w, h);
    cameraCtrl.resize(w, h, mob);
  };
  window.addEventListener("resize", onResize);

  // Intro fly-in state
  shawarma.rootRig.scale.setScalar(0.75);
  const clock = new THREE.Clock();
  let rafId = null;

  const animate = () => {
    rafId = requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    const intro = sceneBridge.introProgress;
    const unwrap =
      sceneBridge.ctaReturnProgress > 0.05
        ? 1.0
        : sceneBridge.unwrapProgress;

    cameraCtrl.state.introProgress = intro;
    cameraCtrl.state.scrollProgress = unwrap;
    cameraCtrl.update(sceneBridge.mouseX, sceneBridge.mouseY, reducedMotion);

    // Scale Shawarma cleanly with intro & mobile responsiveness
    const baseScale = (window.innerWidth < 768 ? 0.76 : 0.96) * (0.72 + intro * 0.28);
    const vis = Math.max(sceneBridge.visibilityAlpha, sceneBridge.ctaReturnProgress);
    shawarma.rootRig.scale.setScalar(baseScale * Math.max(vis, 0.001));
    shawarma.rootRig.visible = vis > 0.02;

    canvasContainer.style.opacity = String(
      Math.min(1, Math.max(vis, 0.18))
    );

    shawarma.update(
      unwrap,
      elapsedTime,
      sceneBridge.mouseX,
      sceneBridge.mouseY,
      window.innerWidth < 768,
      sceneBridge.ctaReturnProgress
    );

    lighting.updateForScroll(unwrap, sceneBridge.mouseX, sceneBridge.mouseY);
    particles.update(
      elapsedTime,
      unwrap,
      sceneBridge.mouseX,
      sceneBridge.mouseY,
      reducedMotion
    );

    haloMesh.position.x = shawarma.rootRig.position.x * 0.85;
    haloMesh.position.y = shawarma.rootRig.position.y * 0.85;
    haloMat.opacity = (0.14 + Math.sin(unwrap * Math.PI) * 0.14) * intro * vis;

    renderer.render(scene, cameraCtrl.camera);
  };

  animate();
  if (onReady) onReady(true);

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("mousemove", onPointerMove);
    window.removeEventListener("mousedown", onPointerDown);
    window.removeEventListener("mouseup", onPointerUp);
    window.removeEventListener("touchstart", onPointerDown);
    window.removeEventListener("touchmove", onPointerMove);
    window.removeEventListener("touchend", onPointerUp);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
  };
}
