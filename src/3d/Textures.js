import * as THREE from "../../vendor/three.module.min.js";

/**
 * Procedural + Studio Texture Generator for Meem Shawarma 3D WebGL Scene
 */
export function createShawarmaTextures() {
  // 1. Toasted Saj / Lavash Flatbread Diffuse & Bump
  const breadCanvas = document.createElement("canvas");
  breadCanvas.width = 1024;
  breadCanvas.height = 1024;
  const bCtx = breadCanvas.getContext("2d");

  const breadBumpCanvas = document.createElement("canvas");
  breadBumpCanvas.width = 1024;
  breadBumpCanvas.height = 1024;
  const bbCtx = breadBumpCanvas.getContext("2d");

  // Warm baked flatbread base
  const baseGrad = bCtx.createLinearGradient(0, 0, 1024, 1024);
  baseGrad.addColorStop(0, "#e9c793");
  baseGrad.addColorStop(0.5, "#dfb476");
  baseGrad.addColorStop(1, "#cfa060");
  bCtx.fillStyle = baseGrad;
  bCtx.fillRect(0, 0, 1024, 1024);

  bbCtx.fillStyle = "#808080";
  bbCtx.fillRect(0, 0, 1024, 1024);

  // Subtle dough pores and blistered toasted patches
  for (let i = 0; i < 650; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = 4 + Math.random() * 34;
    const grad = bCtx.createRadialGradient(x, y, 1, x, y, r);
    const isChar = Math.random() > 0.62;
    if (isChar) {
      grad.addColorStop(0, "rgba(42, 20, 8, 0.82)");
      grad.addColorStop(0.5, "rgba(110, 54, 18, 0.45)");
      grad.addColorStop(1, "rgba(210, 160, 95, 0)");
    } else {
      grad.addColorStop(0, "rgba(175, 112, 46, 0.38)");
      grad.addColorStop(1, "rgba(235, 195, 138, 0)");
    }
    bCtx.fillStyle = grad;
    bCtx.beginPath();
    bCtx.arc(x, y, r, 0, Math.PI * 2);
    bCtx.fill();

    // Bump blister
    const bGrad = bbCtx.createRadialGradient(x, y, 1, x, y, r);
    bGrad.addColorStop(0, isChar ? "#d8d8d8" : "#9c9c9c");
    bGrad.addColorStop(1, "rgba(128,128,128,0)");
    bbCtx.fillStyle = bGrad;
    bbCtx.beginPath();
    bbCtx.arc(x, y, r, 0, Math.PI * 2);
    bbCtx.fill();
  }

  // Diagonal panini / saj grill sear bars
  bCtx.save();
  bCtx.translate(512, 512);
  bCtx.rotate(-0.42);
  for (let y = -700; y < 700; y += 78) {
    const searGrad = bCtx.createLinearGradient(0, y - 14, 0, y + 14);
    searGrad.addColorStop(0, "rgba(65, 28, 8, 0)");
    searGrad.addColorStop(0.5, "rgba(52, 22, 6, 0.68)");
    searGrad.addColorStop(1, "rgba(65, 28, 8, 0)");
    bCtx.fillStyle = searGrad;
    bCtx.fillRect(-700, y - 14, 1400, 28);

    bbCtx.fillStyle = "rgba(60, 60, 60, 0.5)";
    bbCtx.fillRect(0, 512 + y * 0.6, 1024, 12);
  }
  bCtx.restore();

  // Warm flour & herb flecks
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    bCtx.fillStyle =
      Math.random() > 0.35
        ? "rgba(255, 244, 222, 0.35)"
        : "rgba(58, 98, 36, 0.45)";
    bCtx.beginPath();
    bCtx.arc(x, y, 1.2 + Math.random() * 2.5, 0, Math.PI * 2);
    bCtx.fill();
  }

  const breadTexture = new THREE.CanvasTexture(breadCanvas);
  breadTexture.wrapS = THREE.RepeatWrapping;
  breadTexture.wrapT = THREE.RepeatWrapping;
  breadTexture.colorSpace = THREE.SRGBColorSpace;

  const breadBump = new THREE.CanvasTexture(breadBumpCanvas);
  breadBump.wrapS = THREE.RepeatWrapping;
  breadBump.wrapT = THREE.RepeatWrapping;

  // 2. Branded Matte Black & Gold Foil Wrapper Texture
  const wrapCanvas = document.createElement("canvas");
  wrapCanvas.width = 1024;
  wrapCanvas.height = 1024;
  const wCtx = wrapCanvas.getContext("2d");

  const wGrad = wCtx.createLinearGradient(0, 0, 1024, 1024);
  wGrad.addColorStop(0, "#141210");
  wGrad.addColorStop(0.5, "#0d0b0a");
  wGrad.addColorStop(1, "#1a1512");
  wCtx.fillStyle = wGrad;
  wCtx.fillRect(0, 0, 1024, 1024);

  // Subtle paper grain & crinkle lines
  wCtx.strokeStyle = "rgba(255, 195, 110, 0.08)";
  wCtx.lineWidth = 1.5;
  for (let i = 0; i < 80; i++) {
    wCtx.beginPath();
    wCtx.moveTo(Math.random() * 1024, Math.random() * 1024);
    wCtx.lineTo(Math.random() * 1024, Math.random() * 1024);
    wCtx.stroke();
  }

  // Gold foil geometric luxury bands
  const goldGrad = wCtx.createLinearGradient(0, 0, 1024, 0);
  goldGrad.addColorStop(0, "#b8862d");
  goldGrad.addColorStop(0.3, "#ffd97d");
  goldGrad.addColorStop(0.5, "#c9933b");
  goldGrad.addColorStop(0.75, "#ffe299");
  goldGrad.addColorStop(1, "#a67321");

  wCtx.strokeStyle = goldGrad;
  wCtx.lineWidth = 6;
  for (let offset = -1024; offset < 2048; offset += 160) {
    wCtx.beginPath();
    wCtx.moveTo(offset, 0);
    wCtx.lineTo(offset + 520, 1024);
    wCtx.stroke();
  }

  // Top & bottom gold trim borders
  wCtx.fillStyle = goldGrad;
  wCtx.fillRect(0, 28, 1024, 14);
  wCtx.fillRect(0, 980, 1024, 14);

  // Branded stamp pattern
  wCtx.save();
  wCtx.fillStyle = goldGrad;
  wCtx.font = "900 54px 'Syne', 'Arial Black', sans-serif";
  wCtx.textAlign = "center";
  for (let y = 180; y <= 860; y += 220) {
    for (let x = 256; x <= 768; x += 512) {
      wCtx.save();
      wCtx.translate(x, y);
      wCtx.rotate(-0.18);
      wCtx.fillText("MEEM", 0, 0);
      wCtx.font = "700 22px 'Space Grotesk', sans-serif";
      wCtx.fillText("SHAWARMA • GOURMET", 0, 34);
      wCtx.font = "900 54px 'Syne', 'Arial Black', sans-serif";
      wCtx.restore();
    }
  }
  wCtx.restore();

  const wrapperOuterTexture = new THREE.CanvasTexture(wrapCanvas);
  wrapperOuterTexture.wrapS = THREE.RepeatWrapping;
  wrapperOuterTexture.wrapT = THREE.RepeatWrapping;
  wrapperOuterTexture.colorSpace = THREE.SRGBColorSpace;

  // 3. Crinkled Metallic Gold/Silver Inner Foil Texture + Bump
  const foilCanvas = document.createElement("canvas");
  foilCanvas.width = 512;
  foilCanvas.height = 512;
  const fCtx = foilCanvas.getContext("2d");

  const fGrad = fCtx.createLinearGradient(0, 0, 512, 512);
  fGrad.addColorStop(0, "#e5c178");
  fGrad.addColorStop(0.5, "#fff0cc");
  fGrad.addColorStop(1, "#c79846");
  fCtx.fillStyle = fGrad;
  fCtx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 240; i++) {
    fCtx.strokeStyle =
      i % 2 === 0 ? "rgba(255,255,255,0.45)" : "rgba(90,58,14,0.32)";
    fCtx.lineWidth = 1 + Math.random() * 3;
    fCtx.beginPath();
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    fCtx.moveTo(x, y);
    fCtx.lineTo(x + (Math.random() - 0.5) * 90, y + (Math.random() - 0.5) * 90);
    fCtx.stroke();
  }

  const wrapperFoilTexture = new THREE.CanvasTexture(foilCanvas);
  wrapperFoilTexture.wrapS = THREE.RepeatWrapping;
  wrapperFoilTexture.wrapT = THREE.RepeatWrapping;
  wrapperFoilTexture.colorSpace = THREE.SRGBColorSpace;

  // 4. Char-Grilled Spiced Chicken Texture
  const chkCanvas = document.createElement("canvas");
  chkCanvas.width = 512;
  chkCanvas.height = 512;
  const cCtx = chkCanvas.getContext("2d");

  const cGrad = cCtx.createLinearGradient(0, 0, 512, 512);
  cGrad.addColorStop(0, "#c85a17");
  cGrad.addColorStop(0.5, "#a63e0e");
  cGrad.addColorStop(1, "#7d2906");
  cCtx.fillStyle = cGrad;
  cCtx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 320; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 3 + Math.random() * 18;
    cCtx.fillStyle =
      Math.random() > 0.45
        ? "rgba(32, 11, 4, 0.72)"
        : "rgba(238, 138, 42, 0.55)";
    cCtx.beginPath();
    cCtx.ellipse(x, y, r * 1.6, r * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
    cCtx.fill();
  }

  const chickenTexture = new THREE.CanvasTexture(chkCanvas);
  chickenTexture.colorSpace = THREE.SRGBColorSpace;

  // 5. Soft Radial Particle Texture
  const pCanvas = document.createElement("canvas");
  pCanvas.width = 128;
  pCanvas.height = 128;
  const pCtx = pCanvas.getContext("2d");
  const pGrad = pCtx.createRadialGradient(64, 64, 2, 64, 64, 60);
  pGrad.addColorStop(0, "rgba(255, 240, 210, 1)");
  pGrad.addColorStop(0.4, "rgba(255, 168, 76, 0.75)");
  pGrad.addColorStop(1, "rgba(255, 90, 20, 0)");
  pCtx.fillStyle = pGrad;
  pCtx.fillRect(0, 0, 128, 128);
  const particleTexture = new THREE.CanvasTexture(pCanvas);

  return {
    breadTexture,
    breadBump,
    wrapperOuterTexture,
    wrapperFoilTexture,
    chickenTexture,
    particleTexture
  };
}
