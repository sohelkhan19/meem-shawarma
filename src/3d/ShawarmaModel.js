import * as THREE from "../../vendor/three.module.min.js";

/**
 * 3D Chicken Shawarma Hero Model + Physical Vertex-Deforming Unwrapping Wrapper System
 *
 * Angle: Dynamically tilted at ~126 degrees (-36 deg from vertical)
 * Phases:
 *   0.00 - 0.25 (Phase 1): Gold seal band unbuckles, upper foil collar loosens & flares outward
 *   0.25 - 0.50 (Phase 2): Helical wrapper petals curl & peel backward (real vertex deformation), exposing toasted wrap & chicken
 *   0.50 - 0.75 (Phase 3): Lower wrapper layers spiral away, inner ingredients expand slightly, sauce & char glisten
 *   0.75 - 1.00 (Phase 4): 100% unwrapped shawarma glides toward the right side for seamless section transition
 */
export function createShawarmaModel(textures) {
  const rootRig = new THREE.Group();

  // Pivot group holds the 126-degree commercial product angle
  const anglePivot = new THREE.Group();
  // 90 deg vertical + 36 deg tilt = 126 deg dynamic commercial diagonal angle
  anglePivot.rotation.z = THREE.MathUtils.degToRad(-36);
  anglePivot.rotation.x = THREE.MathUtils.degToRad(16);
  anglePivot.rotation.y = THREE.MathUtils.degToRad(-12);
  rootRig.add(anglePivot);

  // Spin group rotates around the shawarma's own longitudinal axis
  const shawarmaSpinGroup = new THREE.Group();
  anglePivot.add(shawarmaSpinGroup);

  // ============================================================================
  // 1. TOASTED ARTISAN SAJ / LAVASH FLATBREAD BODY
  // ============================================================================
  const wrapHeight = 3.35;
  const topRadius = 0.78;
  const bottomRadius = 0.56;

  const breadGeo = new THREE.CylinderGeometry(
    topRadius,
    bottomRadius,
    wrapHeight,
    48,
    40,
    true
  );

  // Add organic hand-rolled flatbread ripples & seam ridge to vertices
  const bPos = breadGeo.attributes.position;
  for (let i = 0; i < bPos.count; i++) {
    const vx = bPos.getX(i);
    const vy = bPos.getY(i);
    const vz = bPos.getZ(i);
    const angle = Math.atan2(vz, vx);
    const normY = (vy + wrapHeight * 0.5) / wrapHeight; // 0 bottom -> 1 top

    // Hand-rolled organic wave + overlapping fold seam along angle ~ 0.4
    const seamBump = Math.exp(-Math.pow(angle - 0.4, 2) * 8.0) * 0.045;
    const ripple =
      Math.sin(vy * 5.5 + angle * 3.0) * 0.018 +
      Math.cos(vy * 9.0 - angle * 2.0) * 0.01;
    // Slight top flare for stuffed crown
    const topFlare = normY > 0.7 ? Math.pow((normY - 0.7) / 0.3, 1.6) * 0.11 : 0;

    const scale = 1 + seamBump + ripple + topFlare;
    bPos.setX(i, vx * scale);
    bPos.setZ(i, vz * scale);
  }
  breadGeo.computeVertexNormals();

  const breadMat = new THREE.MeshStandardMaterial({
    map: textures.breadTexture,
    bumpMap: textures.breadBump,
    bumpScale: 0.038,
    roughness: 0.68,
    metalness: 0.04,
    side: THREE.DoubleSide
  });

  const breadMesh = new THREE.Mesh(breadGeo, breadMat);
  breadMesh.castShadow = true;
  breadMesh.receiveShadow = true;
  shawarmaSpinGroup.add(breadMesh);

  // Rounded tucked bottom flatbread end-cap
  const bottomCapGeo = new THREE.SphereGeometry(bottomRadius * 0.99, 32, 20);
  bottomCapGeo.scale(1, 0.52, 1);
  const bottomCapMesh = new THREE.Mesh(bottomCapGeo, breadMat);
  bottomCapMesh.position.y = -wrapHeight * 0.5 + 0.04;
  shawarmaSpinGroup.add(bottomCapMesh);

  // Inner dark warm shadow bed at top of flatbread cylinder
  const innerBedGeo = new THREE.CircleGeometry(topRadius * 0.96, 32);
  innerBedGeo.rotateX(-Math.PI * 0.5);
  const innerBedMat = new THREE.MeshStandardMaterial({
    color: 0x2c1206,
    roughness: 0.9
  });
  const innerBedMesh = new THREE.Mesh(innerBedGeo, innerBedMat);
  innerBedMesh.position.y = wrapHeight * 0.5 - 0.38;
  shawarmaSpinGroup.add(innerBedMesh);

  // ============================================================================
  // 2. OVERFLOWING CROWN: CHARRED CHICKEN, GARLIC TOUM, PICKLES, LETTUCE & FRIES
  // ============================================================================
  const fillingCrownGroup = new THREE.Group();
  fillingCrownGroup.position.y = wrapHeight * 0.5 - 0.22;
  shawarmaSpinGroup.add(fillingCrownGroup);

  const ingredientItems = [];

  // 2A. Charred Spiced Rotisserie Chicken Strips (22 sculpted pieces)
  const chickenMat = new THREE.MeshStandardMaterial({
    map: textures.chickenTexture,
    bumpMap: textures.breadBump,
    bumpScale: 0.045,
    roughness: 0.36,
    metalness: 0.08
  });

  for (let i = 0; i < 22; i++) {
    const stripGeo = new THREE.BoxGeometry(0.24, 0.58, 0.14, 6, 10, 4);
    // Organic irregular carving deformation
    const sPos = stripGeo.attributes.position;
    for (let k = 0; k < sPos.count; k++) {
      const sx = sPos.getX(k);
      const sy = sPos.getY(k);
      const sz = sPos.getZ(k);
      const taper = 1 - Math.abs(sy) * 0.65;
      const curve = Math.sin(sy * 5 + i) * 0.04;
      sPos.setX(k, sx * taper + curve);
      sPos.setZ(k, sz * (0.85 + Math.cos(sy * 6 + i) * 0.25));
    }
    stripGeo.computeVertexNormals();

    const strip = new THREE.Mesh(stripGeo, chickenMat);
    const ring = i < 8 ? 0.18 : i < 16 ? 0.42 : 0.58;
    const theta = (i / 8) * Math.PI * 2 + i * 0.4;
    const bx = Math.cos(theta) * ring;
    const bz = Math.sin(theta) * ring;
    const by = 0.08 + (1 - ring) * 0.38 + (i % 3) * 0.07;

    strip.position.set(bx, by, bz);
    strip.rotation.set(
      (bz - 0.1) * 0.65 + (Math.random() - 0.5) * 0.3,
      theta + Math.random() * 0.5,
      -bx * 0.65 + (Math.random() - 0.5) * 0.3
    );
    strip.castShadow = true;
    fillingCrownGroup.add(strip);

    ingredientItems.push({
      mesh: strip,
      basePos: strip.position.clone(),
      baseRot: strip.rotation.clone(),
      expandVec: new THREE.Vector3(bx * 0.32, 0.16 + (i % 4) * 0.04, bz * 0.32)
    });
  }

  // 2B. Crisp Shredded Romaine Lettuce Ribbons
  const lettuceMat = new THREE.MeshStandardMaterial({
    color: 0x6ac438,
    roughness: 0.48,
    metalness: 0.02,
    side: THREE.DoubleSide
  });

  for (let i = 0; i < 16; i++) {
    const leafGeo = new THREE.PlaneGeometry(0.32, 0.45, 6, 8);
    const lPos = leafGeo.attributes.position;
    for (let k = 0; k < lPos.count; k++) {
      const lx = lPos.getX(k);
      const ly = lPos.getY(k);
      lPos.setZ(k, Math.sin(lx * 14 + i) * 0.045 + Math.cos(ly * 12) * 0.04);
    }
    leafGeo.computeVertexNormals();

    const leaf = new THREE.Mesh(leafGeo, lettuceMat);
    const angle = (i / 16) * Math.PI * 2;
    const rad = 0.52 + (i % 2) * 0.1;
    const bx = Math.cos(angle) * rad;
    const bz = Math.sin(angle) * rad;
    const by = 0.05 + (i % 3) * 0.06;

    leaf.position.set(bx, by, bz);
    leaf.rotation.set(
      Math.sin(angle) * 0.7,
      angle + Math.PI * 0.5,
      Math.cos(angle) * 0.5
    );
    fillingCrownGroup.add(leaf);

    ingredientItems.push({
      mesh: leaf,
      basePos: leaf.position.clone(),
      baseRot: leaf.rotation.clone(),
      expandVec: new THREE.Vector3(bx * 0.25, 0.1, bz * 0.25)
    });
  }

  // 2C. Pickled Pink Turnip Batons & Crinkled Dill Pickle Slices
  const turnipMat = new THREE.MeshStandardMaterial({
    color: 0xe82574,
    roughness: 0.32,
    metalness: 0.05
  });
  const pickleMat = new THREE.MeshStandardMaterial({
    color: 0x7ba628,
    roughness: 0.38,
    metalness: 0.05
  });

  for (let i = 0; i < 8; i++) {
    const batonGeo = new THREE.BoxGeometry(0.08, 0.44, 0.08);
    const baton = new THREE.Mesh(batonGeo, turnipMat);
    const angle = (i / 8) * Math.PI * 2 + 0.3;
    const rad = 0.44;
    baton.position.set(Math.cos(angle) * rad, 0.18, Math.sin(angle) * rad);
    baton.rotation.set(Math.sin(angle) * 0.45, angle, -Math.cos(angle) * 0.45);
    fillingCrownGroup.add(baton);

    ingredientItems.push({
      mesh: baton,
      basePos: baton.position.clone(),
      baseRot: baton.rotation.clone(),
      expandVec: new THREE.Vector3(Math.cos(angle) * 0.12, 0.14, Math.sin(angle) * 0.12)
    });
  }

  for (let i = 0; i < 6; i++) {
    const coinGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 20);
    const coin = new THREE.Mesh(coinGeo, pickleMat);
    const angle = (i / 6) * Math.PI * 2 + 0.6;
    const rad = 0.48;
    coin.position.set(Math.cos(angle) * rad, 0.14, Math.sin(angle) * rad);
    coin.rotation.set(0.6 + Math.sin(angle) * 0.4, angle, 0.4);
    fillingCrownGroup.add(coin);

    ingredientItems.push({
      mesh: coin,
      basePos: coin.position.clone(),
      baseRot: coin.rotation.clone(),
      expandVec: new THREE.Vector3(Math.cos(angle) * 0.1, 0.12, Math.sin(angle) * 0.1)
    });
  }

  // 2D. Glossy Whipped Garlic Toum & Fiery Red Shatta Drizzle
  const toumMat = new THREE.MeshPhysicalMaterial({
    color: 0xfff8e8,
    roughness: 0.14,
    metalness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  const shattaMat = new THREE.MeshPhysicalMaterial({
    color: 0xd91e0f,
    roughness: 0.16,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.12
  });

  // Sculpted garlic toum swirl & drips over the crown
  const toumCurvePoints = [];
  for (let i = 0; i <= 28; i++) {
    const t = i / 28;
    const angle = t * Math.PI * 3.2;
    const r = (1 - t * 0.55) * 0.52;
    toumCurvePoints.push(
      new THREE.Vector3(
        Math.cos(angle) * r,
        0.18 + Math.sin(t * Math.PI) * 0.24 + (1 - r) * 0.15,
        Math.sin(angle) * r
      )
    );
  }
  const toumCurve = new THREE.CatmullRomCurve3(toumCurvePoints);
  const toumGeo = new THREE.TubeGeometry(toumCurve, 64, 0.068, 14, false);
  const toumMesh = new THREE.Mesh(toumGeo, toumMat);
  fillingCrownGroup.add(toumMesh);

  // Fiery Shatta red chili drizzle ribbon
  const shattaPoints = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const angle = t * Math.PI * 2.4 + 1.1;
    const r = (1 - t * 0.45) * 0.46;
    shattaPoints.push(
      new THREE.Vector3(
        Math.cos(angle) * r,
        0.22 + Math.cos(t * Math.PI * 2) * 0.08 + (1 - r) * 0.18,
        Math.sin(angle) * r
      )
    );
  }
  const shattaCurve = new THREE.CatmullRomCurve3(shattaPoints);
  const shattaGeo = new THREE.TubeGeometry(shattaCurve, 48, 0.042, 12, false);
  const shattaMesh = new THREE.Mesh(shattaGeo, shattaMat);
  fillingCrownGroup.add(shattaMesh);

  // ============================================================================
  // 3. PHYSICAL 3D WRAPPER ASSEMBLY (PEELS & UNWRAPS ON SCROLL)
  // ============================================================================
  const wrapperGroup = new THREE.Group();
  shawarmaSpinGroup.add(wrapperGroup);

  const outerWrapperMat = new THREE.MeshStandardMaterial({
    map: textures.wrapperOuterTexture,
    roughness: 0.42,
    metalness: 0.35,
    side: THREE.FrontSide
  });

  const innerFoilMat = new THREE.MeshStandardMaterial({
    map: textures.wrapperFoilTexture,
    bumpMap: textures.wrapperFoilTexture,
    bumpScale: 0.03,
    color: 0xffdf9a,
    roughness: 0.24,
    metalness: 0.85,
    side: THREE.BackSide
  });

  // 3A. 4 Overlapping Helical Wrapper Panels with Real-Time Vertex Peeling
  const peelPanels = [];
  const panelCount = 4;
  const panelHeight = 2.72;

  for (let p = 0; p < panelCount; p++) {
    const thetaStart = (p / panelCount) * Math.PI * 2;
    const thetaLength = Math.PI * 0.66; // Overlapping wrap panels
    const radialRadiusOffset = 0.025 + p * 0.012;

    const panelGeo = new THREE.CylinderGeometry(
      topRadius * 0.97 + radialRadiusOffset,
      bottomRadius + radialRadiusOffset,
      panelHeight,
      28,
      36,
      true,
      thetaStart,
      thetaLength
    );

    // Save rest vertex positions for live peel-back curling
    const posAttr = panelGeo.attributes.position;
    const baseCoords = new Float32Array(posAttr.array.length);
    baseCoords.set(posAttr.array);

    const panelHolder = new THREE.Group();
    // Covers lower & middle 82% of the shawarma initially
    panelHolder.position.y = -0.28;

    const outerMesh = new THREE.Mesh(panelGeo, outerWrapperMat);
    const innerMesh = new THREE.Mesh(panelGeo, innerFoilMat);
    outerMesh.castShadow = true;
    panelHolder.add(outerMesh);
    panelHolder.add(innerMesh);
    wrapperGroup.add(panelHolder);

    const midAngle = thetaStart + thetaLength * 0.5;
    peelPanels.push({
      index: p,
      holder: panelHolder,
      geometry: panelGeo,
      baseCoords,
      midAngle,
      // Stagger each petal's peel start so it unwraps progressively in a spiral
      startAt: 0.08 + p * 0.13,
      endAt: 0.58 + p * 0.12
    });
  }

  // 3B. Upper Crinkled Gold Foil Collar Petals (partially covering the top initially)
  const collarPetals = [];
  const collarCount = 8;
  const foilBothSidesMat = new THREE.MeshStandardMaterial({
    map: textures.wrapperFoilTexture,
    bumpMap: textures.wrapperFoilTexture,
    bumpScale: 0.035,
    color: 0xffe4a8,
    roughness: 0.25,
    metalness: 0.82,
    side: THREE.DoubleSide
  });

  for (let c = 0; c < collarCount; c++) {
    const angle = (c / collarCount) * Math.PI * 2;
    const pivot = new THREE.Group();
    const rimRadius = topRadius * 0.96;
    pivot.position.set(
      Math.cos(angle) * rimRadius,
      1.05,
      Math.sin(angle) * rimRadius
    );
    pivot.rotation.y = -angle + Math.PI * 0.5;
    // Initially folded slightly inward over the shawarma upper section
    const initialFold = -0.48;
    pivot.rotation.x = initialFold;

    const petalGeo = new THREE.ConeGeometry(0.36, 0.62, 5, 4, true);
    petalGeo.translate(0, 0.28, 0);
    const petalMesh = new THREE.Mesh(petalGeo, foilBothSidesMat);
    pivot.add(petalMesh);
    wrapperGroup.add(pivot);

    collarPetals.push({
      pivot,
      angle,
      initialFold,
      baseY: 1.05
    });
  }

  // 3C. Embossed Gold Seal Ring around the waist (unbuckles in Phase 1)
  const sealBandGeo = new THREE.CylinderGeometry(
    0.73,
    0.70,
    0.34,
    48,
    1,
    true
  );
  const sealBandMat = new THREE.MeshStandardMaterial({
    color: 0xffc95c,
    roughness: 0.22,
    metalness: 0.88,
    side: THREE.DoubleSide
  });
  const sealBandMesh = new THREE.Mesh(sealBandGeo, sealBandMat);
  sealBandMesh.position.y = -0.05;
  wrapperGroup.add(sealBandMesh);

  // 3D. Lower Foil Base Cup (peels off at the end of Phase 3 -> Phase 4)
  const baseCupGeo = new THREE.CylinderGeometry(
    bottomRadius + 0.05,
    bottomRadius * 0.86,
    0.85,
    32,
    8,
     false
  );
  const baseCupMesh = new THREE.Mesh(baseCupGeo, outerWrapperMat);
  baseCupMesh.position.y = -1.32;
  wrapperGroup.add(baseCupMesh);

  // ============================================================================
  // 4. SCROLL & INTERACTION UPDATE ENGINE
  // ============================================================================
  const userDrag = {
    rotY: 0,
    rotX: 0,
    targetRotY: 0,
    targetRotX: 0
  };

  function update(unwrapProgress, elapsedTime, mouseX, mouseY, isMobile = false, ctaReturnProgress = 0) {
    // Effective unwrap progress (remains 1.0 when returning at the Final CTA section)
    const p = THREE.MathUtils.clamp(unwrapProgress, 0, 1);

    // -------------------------------------------------------------------------
    // A. Gold Seal Band Unbuckling (Phase 1: 0.0 -> 0.28)
    // -------------------------------------------------------------------------
    const bandT = THREE.MathUtils.smoothstep(p, 0.0, 0.28);
    sealBandMesh.scale.set(1 + bandT * 0.48, 1 - bandT * 0.3, 1 + bandT * 0.48);
    sealBandMesh.position.y = -0.05 - bandT * 1.65;
    sealBandMesh.rotation.y = bandT * Math.PI * 1.4;
    sealBandMesh.rotation.z = bandT * 0.35;
    sealBandMesh.visible = bandT < 0.98;

    // -------------------------------------------------------------------------
    // B. Upper Foil Collar Petals Flaring & Peeling Back (0.0 -> 0.55)
    // -------------------------------------------------------------------------
    for (let c = 0; c < collarPetals.length; c++) {
      const cp = collarPetals[c];
      const stagger = (c / collarPetals.length) * 0.12;
      const collarT = THREE.MathUtils.smoothstep(p, 0.02 + stagger, 0.45 + stagger);
      const slideT = THREE.MathUtils.smoothstep(p, 0.35 + stagger, 0.78 + stagger);

      // Hinge outward from -0.48 rad (folded in) to +1.85 rad (peeled backward)
      cp.pivot.rotation.x = cp.initialFold + collarT * 2.35;
      cp.pivot.position.y = cp.baseY - slideT * 2.8;
      const expandR = topRadius * 0.96 + collarT * 0.22 + slideT * 0.55;
      cp.pivot.position.x = Math.cos(cp.angle) * expandR;
      cp.pivot.position.z = Math.sin(cp.angle) * expandR;
      cp.pivot.scale.setScalar(1 - slideT * 0.85);
      cp.pivot.visible = slideT < 0.98;
    }

    // -------------------------------------------------------------------------
    // C. Real-Time Vertex Curling & Peeling of the 4 Helical Wrapper Panels
    // -------------------------------------------------------------------------
    for (let i = 0; i < peelPanels.length; i++) {
      const panel = peelPanels[i];
      const localP = THREE.MathUtils.clamp(
        (p - panel.startAt) / (panel.endAt - panel.startAt),
        0,
        1
      );

      const posAttr = panel.geometry.attributes.position;
      const base = panel.baseCoords;
      const halfH = panelHeight * 0.5;

      // Top-down peeling boundary moves from top (1.0) down to bottom (0.0)
      const peelLine = 1.0 - localP * 1.25;

      for (let v = 0; v < posAttr.count; v++) {
        const ix = v * 3;
        const bx = base[ix];
        const by = base[ix + 1];
        const bz = base[ix + 2];

        const normY = (by + halfH) / panelHeight; // 0 at bottom, 1 at top

        if (normY > peelLine && localP > 0.001) {
          const over = (normY - peelLine) / Math.max(1 - peelLine, 0.001);
          const curlAngle = Math.min(over * Math.PI * 0.88, Math.PI * 0.92);
          const radialLen = Math.sqrt(bx * bx + bz * bz);
          const dirX = bx / Math.max(radialLen, 0.0001);
          const dirZ = bz / Math.max(radialLen, 0.0001);

          // Outward petal curl + downward fold
          const curlOut = Math.sin(curlAngle) * 0.72 * localP;
          const dropDown = (1 - Math.cos(curlAngle)) * 0.64 * localP;
          const twist = over * localP * 0.35;

          const cosT = Math.cos(twist);
          const sinT = Math.sin(twist);
          const rx = bx * cosT - bz * sinT;
          const rz = bx * sinT + bz * cosT;

          posAttr.setXYZ(
            v,
            rx + dirX * curlOut,
            by - dropDown,
            rz + dirZ * curlOut
          );
        } else {
          posAttr.setXYZ(v, bx, by, bz);
        }
      }
      posAttr.needsUpdate = true;
      panel.geometry.computeVertexNormals();

      // Also physically peel and spiral the panel holder away in late localP
      const detachT = THREE.MathUtils.smoothstep(localP, 0.45, 1.0);
      const outDirX = Math.cos(panel.midAngle);
      const outDirZ = Math.sin(panel.midAngle);

      panel.holder.position.x = outDirX * detachT * 1.45;
      panel.holder.position.z = outDirZ * detachT * 1.45;
      panel.holder.position.y = -0.28 - detachT * 2.45;
      panel.holder.rotation.z = -outDirX * detachT * 0.85;
      panel.holder.rotation.x = outDirZ * detachT * 0.85;
      panel.holder.scale.setScalar(1 - detachT * 0.65);
      panel.holder.visible = detachT < 0.98;
    }

    // -------------------------------------------------------------------------
    // D. Lower Base Foil Cup Removal (Phase 3 -> Phase 4: 0.58 -> 0.88)
    // -------------------------------------------------------------------------
    const cupT = THREE.MathUtils.smoothstep(p, 0.58, 0.88);
    baseCupMesh.position.y = -1.32 - cupT * 2.3;
    baseCupMesh.rotation.y = cupT * Math.PI;
    baseCupMesh.rotation.z = cupT * 0.45;
    baseCupMesh.scale.setScalar(1 - cupT * 0.8);
    baseCupMesh.visible = cupT < 0.98;

    // -------------------------------------------------------------------------
    // E. Inner Ingredients Breathe & Expand Slightly as Unwrapped (Phase 2 & 3)
    // -------------------------------------------------------------------------
    const bloom = Math.sin(Math.min(p * 1.15, 1.0) * Math.PI * 0.65);
    for (let i = 0; i < ingredientItems.length; i++) {
      const item = ingredientItems[i];
      item.mesh.position.x = item.basePos.x + item.expandVec.x * bloom;
      item.mesh.position.y =
        item.basePos.y +
        item.expandVec.y * bloom +
        Math.sin(elapsedTime * 1.8 + i * 0.5) * 0.012;
      item.mesh.position.z = item.basePos.z + item.expandVec.z * bloom;
    }

    // -------------------------------------------------------------------------
    // F. Shawarma Rotation, Floating & Phase 4 Side-Transition Choreography
    // -------------------------------------------------------------------------
    userDrag.rotY += (userDrag.targetRotY - userDrag.rotY) * 0.09;
    userDrag.rotX += (userDrag.targetRotX - userDrag.rotX) * 0.09;

    // Longitudinal spin on scroll + subtle idle float + cursor response
    const targetSpinY =
      p * Math.PI * 1.65 +
      elapsedTime * 0.16 +
      mouseX * 0.38 +
      userDrag.rotY;

    shawarmaSpinGroup.rotation.y +=
      (targetSpinY - shawarmaSpinGroup.rotation.y) * 0.08;

    // Maintain the iconic ~126-degree diagonal tilt while responding subtly to cursor & scroll
    const phaseTiltAdjust = Math.sin(p * Math.PI) * 0.14;
    const targetZ =
      THREE.MathUtils.degToRad(-36) +
      phaseTiltAdjust -
      mouseX * 0.08;
    const targetX =
      THREE.MathUtils.degToRad(16) +
      mouseY * 0.16 +
      userDrag.rotX;

    anglePivot.rotation.z += (targetZ - anglePivot.rotation.z) * 0.07;
    anglePivot.rotation.x += (targetX - anglePivot.rotation.x) * 0.07;

    // Phase 4 (0.70 -> 0.98): Move unwrapped shawarma toward the right side of screen on desktop
    const sideShiftT = THREE.MathUtils.smoothstep(p, 0.70, 0.98);
    const baseRightX = isMobile ? 0.0 : 1.65;

    // When scrolling into the Final CTA / Finale Stage (ctaReturnProgress -> 1),
    // bring the unwrapped 3D Shawarma back to center (x = 0, y = 0.08) so it is 100% visible!
    const targetPosX =
      sideShiftT * baseRightX * (1 - ctaReturnProgress) +
      mouseX * (isMobile ? 0.08 : 0.18);
    const floatY =
      Math.sin(elapsedTime * 1.35) * 0.08 +
      ctaReturnProgress * 0.08 -
      mouseY * (isMobile ? 0.06 : 0.14);

    rootRig.position.x += (targetPosX - rootRig.position.x) * 0.08;
    rootRig.position.y += (floatY - rootRig.position.y) * 0.08;
  }

  function addDragDelta(dx, dy) {
    userDrag.targetRotY += dx * 0.012;
    userDrag.targetRotX = THREE.MathUtils.clamp(
      userDrag.targetRotX + dy * 0.008,
      -0.45,
      0.45
    );
  }

  return {
    rootRig,
    anglePivot,
    shawarmaSpinGroup,
    wrapperGroup,
    fillingCrownGroup,
    update,
    addDragDelta
  };
}
