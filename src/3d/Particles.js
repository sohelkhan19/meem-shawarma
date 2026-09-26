import * as THREE from "../../vendor/three.module.min.js";

/**
 * Multi-Layer Atmospheric Food Particles:
 * - Layer 1: Golden Crispy Crumbs & Sesame/Spice Flecks (3D instanced/point cloud)
 * - Layer 2: Warm Fire/Amber Embers
 * - Layer 3: Subtle Rising Steam Wisps around the Shawarma
 */
export function createParticleSystem(scene, particleTexture, isMobile = false) {
  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  const crumbCount = isMobile ? 65 : 150;
  const positions = new Float32Array(crumbCount * 3);
  const colors = new Float32Array(crumbCount * 3);
  const velocities = [];

  const palette = [
    new THREE.Color("#ffb703"), // Golden crumb
    new THREE.Color("#fb5607"), // Cayenne/paprika spice
    new THREE.Color("#fff3d6"), // Toasted sesame seed
    new THREE.Color("#ff4d1c")  // Warm ember glow
  ];

  for (let i = 0; i < crumbCount; i++) {
    const radius = 1.4 + Math.random() * 4.5;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 6.5;

    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4.2;

    const col = palette[i % palette.length];
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;

    velocities.push({
      speedY: 0.0025 + Math.random() * 0.006,
      driftX: (Math.random() - 0.5) * 0.003,
      phase: Math.random() * Math.PI * 2,
      baseRadius: radius,
      theta
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: isMobile ? 0.09 : 0.11,
    map: particleTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  rootGroup.add(points);

  // 3D Physical Spice/Sesame Crumb Meshes orbiting close to the Shawarma
  const closeCrumbsGroup = new THREE.Group();
  rootGroup.add(closeCrumbsGroup);

  const crumbGeo = new THREE.DodecahedronGeometry(0.032, 0);
  const crumbMats = [
    new THREE.MeshStandardMaterial({
      color: 0xf4a236,
      roughness: 0.6,
      metalness: 0.1
    }),
    new THREE.MeshStandardMaterial({
      color: 0xd9381e,
      roughness: 0.5,
      metalness: 0.1
    }),
    new THREE.MeshStandardMaterial({
      color: 0xffe6b8,
      roughness: 0.4,
      metalness: 0.05
    })
  ];

  const closeCrumbCount = isMobile ? 16 : 34;
  const closeCrumbData = [];

  for (let i = 0; i < closeCrumbCount; i++) {
    const mesh = new THREE.Mesh(crumbGeo, crumbMats[i % crumbMats.length]);
    const angle = (i / closeCrumbCount) * Math.PI * 2;
    const dist = 1.05 + Math.random() * 1.35;
    const y = (Math.random() - 0.5) * 2.8;
    mesh.position.set(Math.cos(angle) * dist, y, Math.sin(angle) * dist * 0.7);
    mesh.scale.set(
      0.6 + Math.random() * 1.2,
      0.5 + Math.random() * 0.9,
      0.6 + Math.random() * 1.1
    );
    mesh.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    closeCrumbsGroup.add(mesh);

    closeCrumbData.push({
      mesh,
      angle,
      dist,
      baseY: y,
      rotSpeed: 0.008 + Math.random() * 0.015,
      floatOffset: Math.random() * Math.PI * 2
    });
  }

  return {
    rootGroup,
    points,
    closeCrumbsGroup,
    update(elapsedTime, unwrapProgress, mouseX, mouseY, reducedMotion = false) {
      if (reducedMotion) return;

      const posAttr = geometry.attributes.position;
      const burstFactor = 1 + Math.sin(unwrapProgress * Math.PI) * 0.42;

      for (let i = 0; i < crumbCount; i++) {
        const v = velocities[i];
        let y = posAttr.getY(i) + v.speedY * burstFactor;
        if (y > 3.25) y = -3.25;

        const waveX = Math.sin(elapsedTime * 0.8 + v.phase) * 0.004;
        posAttr.setX(i, posAttr.getX(i) + waveX);
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;

      // Foreground particle parallax (30-40px equivalent in 3D space)
      rootGroup.position.x += (mouseX * 0.42 - rootGroup.position.x) * 0.06;
      rootGroup.position.y += (mouseY * 0.32 - rootGroup.position.y) * 0.06;

      // Close 3D spice crumbs expand outward slightly as wrapper opens
      for (let i = 0; i < closeCrumbData.length; i++) {
        const c = closeCrumbData[i];
        const currentDist = c.dist * (1 + Math.sin(unwrapProgress * Math.PI) * 0.35);
        const curAngle = c.angle + elapsedTime * 0.14 + unwrapProgress * 0.9;
        c.mesh.position.x = Math.cos(curAngle) * currentDist;
        c.mesh.position.z = Math.sin(curAngle) * currentDist * 0.75;
        c.mesh.position.y =
          c.baseY + Math.sin(elapsedTime * 1.5 + c.floatOffset) * 0.12;
        c.mesh.rotation.x += c.rotSpeed;
        c.mesh.rotation.y += c.rotSpeed * 1.2;
      }
    }
  };
}
