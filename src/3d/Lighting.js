import * as THREE from "../../vendor/three.module.min.js";

/**
 * Commercial Food Studio Lighting + Interactive Cursor Rim/Highlight Light
 */
export function setupLighting(scene) {
  const lightsGroup = new THREE.Group();
  scene.add(lightsGroup);

  // Soft warm ambient fill
  const ambientLight = new THREE.AmbientLight(0xffe8cc, 0.72);
  lightsGroup.add(ambientLight);

  // Hemisphere studio fill (warm cream top, deep espresso ground bounce)
  const hemiLight = new THREE.HemisphereLight(0xfff4e2, 0x261108, 0.95);
  hemiLight.position.set(0, 6, 0);
  lightsGroup.add(hemiLight);

  // Primary Warm Food Key Light (top-right front)
  const keyLight = new THREE.DirectionalLight(0xffcf8b, 2.55);
  keyLight.position.set(4.2, 5.4, 5.2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.0005;
  lightsGroup.add(keyLight);

  // Fiery Orange-Red Rim Light (back-left edge kick)
  const rimLight = new THREE.DirectionalLight(0xff471a, 2.25);
  rimLight.position.set(-5.2, 3.2, -3.8);
  lightsGroup.add(rimLight);

  // Golden Crown Accent Light (illuminates exposed chicken & garlic toum sauce)
  const crownSpot = new THREE.PointLight(0xffb732, 2.4, 12, 1.5);
  crownSpot.position.set(1.2, 3.5, 2.6);
  lightsGroup.add(crownSpot);

  // Interactive Cursor-Following Light (Section 36)
  const cursorLight = new THREE.PointLight(0xffa94d, 2.8, 10, 1.4);
  cursorLight.position.set(0, 0.5, 3.8);
  lightsGroup.add(cursorLight);

  return {
    lightsGroup,
    ambientLight,
    keyLight,
    rimLight,
    crownSpot,
    cursorLight,
    updateForScroll(progress, mouseX, mouseY) {
      // As wrapper peels open (Phase 1 -> 3), boost warm food lighting
      const unwrapBoost = Math.sin(Math.min(progress, 1) * Math.PI);
      keyLight.intensity = 2.4 + unwrapBoost * 0.9;
      crownSpot.intensity = 2.1 + progress * 1.6;
      rimLight.intensity = 2.1 + unwrapBoost * 0.8;

      // Smoothly move virtual light source with cursor
      const targetX = mouseX * 3.8;
      const targetY = mouseY * 2.8 + 0.4;
      cursorLight.position.x += (targetX - cursorLight.position.x) * 0.09;
      cursorLight.position.y += (targetY - cursorLight.position.y) * 0.09;
    }
  };
}
