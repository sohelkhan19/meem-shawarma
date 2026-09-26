import * as THREE from "../../vendor/three.module.min.js";

/**
 * 3D Secondary Food Models (Crispy Burger, Steamed Bao, Chicken Cheese Bowl)
 * Used for scroll-driven 3D storytelling across Sections 5, 6, and 7.
 */
export function createSecondaryFoodModels(textures) {
  const group = new THREE.Group();
  group.visible = false;

  // ==========================================================================
  // 1. 3D STACKED CRISPY CHICKEN BURGER (Explodes/Separates on Scroll)
  // ==========================================================================
  const burgerGroup = new THREE.Group();
  burgerGroup.visible = false;
  group.add(burgerGroup);

  const briocheMat = new THREE.MeshStandardMaterial({
    color: 0xd9822b,
    bumpMap: textures.breadBump,
    bumpScale: 0.02,
    roughness: 0.35,
    metalness: 0.05
  });

  // Top Brioche Crown
  const topBunGeo = new THREE.SphereGeometry(1.05, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
  topBunGeo.scale(1, 0.68, 1);
  const topBun = new THREE.Mesh(topBunGeo, briocheMat);

  // Sesame seeds on top bun
  const sesameMat = new THREE.MeshStandardMaterial({ color: 0xfff2d6, roughness: 0.4 });
  const sesameGeo = new THREE.SphereGeometry(0.032, 8, 8);
  sesameGeo.scale(1, 0.5, 1.8);
  for (let i = 0; i < 28; i++) {
    const seed = new THREE.Mesh(sesameGeo, sesameMat);
    const phi = Math.acos(1 - Math.random() * 0.55);
    const theta = Math.random() * Math.PI * 2;
    seed.position.set(
      1.04 * Math.sin(phi) * Math.cos(theta),
      0.68 * Math.cos(phi),
      1.04 * Math.sin(phi) * Math.sin(theta)
    );
    seed.lookAt(0, 0, 0);
    topBun.add(seed);
  }
  burgerGroup.add(topBun);

  // Melted Aged Cheddar Slice
  const cheeseGeo = new THREE.BoxGeometry(1.65, 0.06, 1.65, 16, 2, 16);
  const cPos = cheeseGeo.attributes.position;
  for (let i = 0; i < cPos.count; i++) {
    const cx = cPos.getX(i);
    const cz = cPos.getZ(i);
    const edgeDist = Math.max(Math.abs(cx), Math.abs(cz));
    if (edgeDist > 0.65) {
      cPos.setY(i, cPos.getY(i) - Math.pow(edgeDist - 0.65, 1.5) * 0.65);
    }
  }
  cheeseGeo.computeVertexNormals();
  const cheeseMat = new THREE.MeshPhysicalMaterial({
    color: 0xffa800,
    roughness: 0.18,
    clearcoat: 0.9
  });
  const cheeseMesh = new THREE.Mesh(cheeseGeo, cheeseMat);
  cheeseMesh.rotation.y = Math.PI * 0.25;
  burgerGroup.add(cheeseMesh);

  // Extra-Crispy Fried Chicken Thigh Fillet
  const pattyGeo = new THREE.CylinderGeometry(1.08, 1.04, 0.48, 36, 12);
  const pPos = pattyGeo.attributes.position;
  for (let i = 0; i < pPos.count; i++) {
    const px = pPos.getX(i);
    const py = pPos.getY(i);
    const pz = pPos.getZ(i);
    const crag =
      Math.sin(px * 9 + py * 7) * 0.07 +
      Math.cos(pz * 10 - py * 6) * 0.06;
    pPos.setX(i, px * (1 + crag));
    pPos.setZ(i, pz * (1 + crag));
  }
  pattyGeo.computeVertexNormals();
  const pattyMat = new THREE.MeshStandardMaterial({
    map: textures.chickenTexture,
    bumpMap: textures.breadBump,
    bumpScale: 0.06,
    color: 0xe07a16,
    roughness: 0.52
  });
  const pattyMesh = new THREE.Mesh(pattyGeo, pattyMat);
  burgerGroup.add(pattyMesh);

  // Pickles & Lettuce Layer
  const slawGroup = new THREE.Group();
  const pickleMat = new THREE.MeshStandardMaterial({ color: 0x6b9e23, roughness: 0.35 });
  for (let i = 0; i < 4; i++) {
    const pCoin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 0.05, 24),
      pickleMat
    );
    const a = (i / 4) * Math.PI * 2;
    pCoin.position.set(Math.cos(a) * 0.45, 0.06, Math.sin(a) * 0.45);
    pCoin.rotation.z = Math.sin(a) * 0.12;
    slawGroup.add(pCoin);
  }
  burgerGroup.add(slawGroup);

  // Bottom Brioche Bun
  const botBunGeo = new THREE.CylinderGeometry(0.98, 0.88, 0.34, 36);
  const botBun = new THREE.Mesh(botBunGeo, briocheMat);
  burgerGroup.add(botBun);

  function updateBurger(explodeProgress, elapsedTime) {
    const gap = 0.22 + Math.sin(explodeProgress * Math.PI) * 0.48;
    topBun.position.y = gap * 2.1;
    cheeseMesh.position.y = gap * 1.15;
    pattyMesh.position.y = 0;
    slawGroup.position.y = -gap * 1.05;
    botBun.position.y = -gap * 1.85;

    burgerGroup.rotation.y = elapsedTime * 0.35 + explodeProgress * 1.8;
    burgerGroup.rotation.z = Math.sin(elapsedTime * 0.8) * 0.08;
  }

  return {
    group,
    burgerGroup,
    updateBurger
  };
}
