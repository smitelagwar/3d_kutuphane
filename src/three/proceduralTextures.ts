import * as THREE from 'three';
import type { PatternId } from '../lib/catalogTypes';

function createCanvas(size = 256): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

export function createFabricBumpTexture(anisotropy = 4): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(256);
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  for (let y = 0; y < 256; y += 4) {
    for (let x = 0; x < 256; x += 4) {
      const n = Math.sin(x * 0.37 + y * 0.21) * 0.5 + Math.cos(x * 0.13 - y * 0.43) * 0.5;
      const lum = Math.max(40, Math.min(220, Math.round(128 + n * 48 + ((x + y) % 8 === 0 ? 18 : -12))));
      ctx.fillStyle = `rgb(${lum},${lum},${lum})`;
      ctx.fillRect(x, y, 3, 3);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.anisotropy = anisotropy;
  return tex;
}

export function createWoodGrainTexture(
  baseHex: string,
  anisotropy = 4,
): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const baseColor = new THREE.Color(baseHex);
  const darkColor = baseColor.clone().multiplyScalar(0.68);
  const lightColor = baseColor.clone().lerp(new THREE.Color('#ffffff'), 0.14);

  const [cColor, ctxC] = createCanvas(256);
  const [cBump, ctxB] = createCanvas(256);

  ctxC.fillStyle = `#${baseColor.getHexString()}`;
  ctxC.fillRect(0, 0, 256, 256);
  ctxB.fillStyle = '#808080';
  ctxB.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 64; i++) {
    const y = (i / 64) * 256;
    const wave = Math.sin(i * 0.45) * 6;
    ctxC.strokeStyle = i % 3 === 0 ? `#${darkColor.getHexString()}` : `#${lightColor.getHexString()}`;
    ctxC.globalAlpha = i % 3 === 0 ? 0.35 : 0.18;
    ctxC.lineWidth = 1.5 + (i % 3);
    ctxC.beginPath();
    ctxC.moveTo(0, y);
    ctxC.bezierCurveTo(85, y + wave, 170, y - wave, 256, y);
    ctxC.stroke();

    ctxB.strokeStyle = i % 2 === 0 ? '#5e5e5e' : '#a4a4a4';
    ctxB.globalAlpha = 0.35;
    ctxB.lineWidth = 1.5;
    ctxB.beginPath();
    ctxB.moveTo(0, y);
    ctxB.bezierCurveTo(85, y + wave, 170, y - wave, 256, y);
    ctxB.stroke();
  }

  const map = new THREE.CanvasTexture(cColor);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2, 2);
  map.anisotropy = anisotropy;

  const bumpMap = new THREE.CanvasTexture(cBump);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2, 2);
  bumpMap.anisotropy = anisotropy;

  return { map, bumpMap };
}

export function createTravertineTexture(
  baseHex: string,
  anisotropy = 4,
): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const baseColor = new THREE.Color(baseHex);
  const veinDark = baseColor.clone().multiplyScalar(0.76);
  const veinLight = baseColor.clone().lerp(new THREE.Color('#ffffff'), 0.22);

  const [cColor, ctxC] = createCanvas(256);
  const [cBump, ctxB] = createCanvas(256);

  ctxC.fillStyle = `#${baseColor.getHexString()}`;
  ctxC.fillRect(0, 0, 256, 256);
  ctxB.fillStyle = '#888888';
  ctxB.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 42; i++) {
    const y = (i / 42) * 256;
    ctxC.fillStyle = i % 2 === 0 ? `#${veinLight.getHexString()}` : `#${veinDark.getHexString()}`;
    ctxC.globalAlpha = 0.16;
    ctxC.fillRect(0, y, 256, 2 + (i % 5));
  }

  for (let i = 0; i < 180; i++) {
    const px = ((i * 73) % 250) + 2;
    const py = ((i * 131) % 250) + 2;
    const pw = 2 + (i % 7);
    const ph = 1 + (i % 3);
    ctxC.fillStyle = `#${veinDark.getHexString()}`;
    ctxC.globalAlpha = 0.42;
    ctxC.fillRect(px, py, pw, ph);

    ctxB.fillStyle = '#383838';
    ctxB.globalAlpha = 0.65;
    ctxB.fillRect(px, py, pw, ph);
  }

  const map = new THREE.CanvasTexture(cColor);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2, 2);
  map.anisotropy = anisotropy;

  const bumpMap = new THREE.CanvasTexture(cBump);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2, 2);
  bumpMap.anisotropy = anisotropy;

  return { map, bumpMap };
}

/**
 * Architectural large-format light grey/warm stone porcelain bathroom wall tiles
 * with delicate 2mm grout joints for wall-hung toilet & towel warmer context.
 */
export function createPorcelainWallTileTexture(
  anisotropy = 4,
): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const [cColor, ctxC] = createCanvas(size);
  const [cBump, ctxB] = createCanvas(size);

  ctxC.fillStyle = '#DDDAD4';
  ctxC.fillRect(0, 0, size, size);
  ctxB.fillStyle = '#B8B8B8';
  ctxB.fillRect(0, 0, size, size);

  // Subtle natural stone tonal variations across tiles
  const tiles = 2;
  const step = size / tiles;
  const tints = ['#DFDDD7', '#D9D6CF', '#DCD9D2', '#E1DFDA'];
  for (let r = 0; r < tiles; r++) {
    for (let c = 0; c < tiles; c++) {
      ctxC.fillStyle = tints[(r * 2 + c) % tints.length];
      ctxC.fillRect(c * step + 2, r * step + 2, step - 4, step - 4);
    }
  }

  // Subtle mineral speckles
  for (let i = 0; i < 420; i++) {
    const x = (i * 97) % size;
    const y = (i * 193) % size;
    ctxC.fillStyle = i % 2 === 0 ? 'rgba(130,126,118,0.08)' : 'rgba(255,255,255,0.12)';
    ctxC.fillRect(x, y, 3 + (i % 5), 2);
  }

  // Crisp recessed 2mm architectural grout seams
  ctxC.strokeStyle = '#B8B4AC';
  ctxC.lineWidth = 3;
  ctxB.strokeStyle = '#383838';
  ctxB.lineWidth = 4;
  for (let i = 0; i <= tiles; i++) {
    const pos = i * step;
    ctxC.beginPath();
    ctxC.moveTo(pos, 0);
    ctxC.lineTo(pos, size);
    ctxC.moveTo(0, pos);
    ctxC.lineTo(size, pos);
    ctxC.stroke();

    ctxB.beginPath();
    ctxB.moveTo(pos, 0);
    ctxB.lineTo(pos, size);
    ctxB.moveTo(0, pos);
    ctxB.lineTo(size, pos);
    ctxB.stroke();
  }

  const map = new THREE.CanvasTexture(cColor);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(1.5, 2.0);
  map.anisotropy = anisotropy;

  const bumpMap = new THREE.CanvasTexture(cBump);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(1.5, 2.0);
  bumpMap.anisotropy = anisotropy;

  return { map, bumpMap };
}

/**
 * High-resolution 1024x1024 procedural Anatolia High-Low Pile Geometric Relief Rug Texture.
 * Supports 3 distinct architectural weave patterns:
 * - geometric_relief (matching the quarter-circle + square carved bouclé rug reference)
 * - linear_ribbed (parallel ribbed architectural channels)
 * - anatolian_diamond (contemporary carved diamond kilim relief)
 */
export function createAnatoliaRugTexture(
  primaryHex: string,
  secondaryHex: string,
  accentHex: string,
  anisotropy = 4,
  patternId: PatternId = 'geometric_relief',
): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const W = 1024;
  const H = 1024;
  const [cColor, ctxC] = createCanvas(W);
  const [cBump, ctxB] = createCanvas(W);

  const primary = new THREE.Color(primaryHex);
  const secondary = new THREE.Color(secondaryHex);
  const accent = new THREE.Color(accentHex);
  const darkGroove = accent.clone().multiplyScalar(0.72);
  const brightLoop = primary.clone().lerp(new THREE.Color('#ffffff'), 0.16);

  // Base flat-weave foundation
  ctxC.fillStyle = `#${primary.getHexString()}`;
  ctxC.fillRect(0, 0, W, H);
  ctxB.fillStyle = '#585858';
  ctxB.fillRect(0, 0, W, H);

  // Helper to paint chunky high-pile bouclé loops inside current clip region
  const paintBouclePile = (
    x0: number,
    y0: number,
    rw: number,
    rh: number,
    baseHexStr: string,
    bumpBase: number,
  ) => {
    ctxC.fillStyle = baseHexStr;
    ctxC.fillRect(x0, y0, rw, rh);
    ctxB.fillStyle = `rgb(${bumpBase},${bumpBase},${bumpBase})`;
    ctxB.fillRect(x0, y0, rw, rh);

    const step = 6;
    for (let py = Math.floor(y0); py < y0 + rh; py += step) {
      for (let px = Math.floor(x0); px < x0 + rw; px += step) {
        const hash = Math.sin(px * 12.9898 + py * 78.233) * 43758.5453;
        const frac = hash - Math.floor(hash);
        const shade = frac > 0.55 ? 'rgba(255,255,255,0.22)' : 'rgba(55,44,32,0.20)';
        ctxC.fillStyle = shade;
        ctxC.fillRect(px, py, 4, 4);

        const bVal = Math.min(250, Math.max(85, Math.round(bumpBase + (frac - 0.5) * 95)));
        ctxB.fillStyle = `rgb(${bVal},${bVal},${bVal})`;
        ctxB.fillRect(px, py, 4, 4);
      }
    }
  };

  // Helper to paint crisp flat-weave kilim rib texture
  const paintFlatWeave = (x0: number, y0: number, rw: number, rh: number, baseHexStr: string) => {
    ctxC.fillStyle = baseHexStr;
    ctxC.fillRect(x0, y0, rw, rh);
    ctxB.fillStyle = '#787878';
    ctxB.fillRect(x0, y0, rw, rh);
    for (let py = Math.floor(y0); py < y0 + rh; py += 4) {
      ctxC.fillStyle = py % 8 === 0 ? 'rgba(60,48,36,0.13)' : 'rgba(255,255,255,0.10)';
      ctxC.fillRect(x0, py, rw, 2);
      ctxB.fillStyle = py % 8 === 0 ? '#5c5c5c' : '#8e8e8e';
      ctxB.fillRect(x0, py, rw, 2);
    }
  };

  const margin = 26;
  const innerW = W - margin * 2;
  const innerH = H - margin * 2;

  if (patternId === 'linear_ribbed') {
    // Parallel architectural ribbed channels + horizontal band breaks
    const cols = 12;
    const colW = innerW / cols;
    for (let c = 0; c < cols; c++) {
      const x = margin + c * colW;
      const isRaised = c % 2 === 0;
      if (isRaised) {
        paintBouclePile(x + 6, margin, colW - 12, innerH, `#${primary.getHexString()}`, 215);
      } else {
        paintFlatWeave(x + 4, margin, colW - 8, innerH, `#${secondary.getHexString()}`);
      }
      ctxC.fillStyle = `#${darkGroove.getHexString()}`;
      ctxC.fillRect(x, margin, 5, innerH);
      ctxB.fillStyle = '#242424';
      ctxB.fillRect(x, margin, 6, innerH);
    }
    // Two architectural cross-channels
    for (const ry of [margin + innerH * 0.28, margin + innerH * 0.72]) {
      ctxC.fillStyle = `#${darkGroove.getHexString()}`;
      ctxC.fillRect(margin, ry - 5, innerW, 10);
      ctxB.fillStyle = '#202020';
      ctxB.fillRect(margin, ry - 6, innerW, 12);
    }
  } else if (patternId === 'anatolian_diamond') {
    // Contemporary carved Anatolian diamond grid
    paintFlatWeave(margin, margin, innerW, innerH, `#${secondary.getHexString()}`);
    const rows = 4;
    const cols = 3;
    const cw = innerW / cols;
    const ch = innerH / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = margin + (c + 0.5) * cw;
        const cy = margin + (r + 0.5) * ch;
        const rx = cw * 0.44;
        const ry = ch * 0.44;
        ctxC.save();
        ctxB.save();
        const traceDiamond = (ctx: CanvasRenderingContext2D) => {
          ctx.beginPath();
          ctx.moveTo(cx, cy - ry);
          ctx.lineTo(cx + rx, cy);
          ctx.lineTo(cx, cy + ry);
          ctx.lineTo(cx - rx, cy);
          ctx.closePath();
        };
        traceDiamond(ctxC);
        ctxC.clip();
        traceDiamond(ctxB);
        ctxB.clip();
        paintBouclePile(
          cx - rx,
          cy - ry,
          rx * 2,
          ry * 2,
          (r + c) % 2 === 0 ? `#${brightLoop.getHexString()}` : `#${primary.getHexString()}`,
          225,
        );
        ctxC.restore();
        ctxB.restore();

        traceDiamond(ctxC);
        ctxC.strokeStyle = `#${darkGroove.getHexString()}`;
        ctxC.lineWidth = 9;
        ctxC.stroke();

        traceDiamond(ctxB);
        ctxB.strokeStyle = '#1e1e1e';
        ctxB.lineWidth = 10;
        ctxB.stroke();
      }
    }
  } else {
    // DEFAULT: 'geometric_relief' — 3x4 carved geometric square + quarter-circle relief blocks
    // matching the studio reference Anatolia rug photo!
    const cols = 3;
    const rows = 4;
    const cw = innerW / cols;
    const ch = innerH / rows;

    // Specific layout matching authentic Turkish modern geometric relief rugs
    const cellStyles: Array<'flat_light' | 'boucle_warm' | 'arc_tl' | 'arc_br' | 'arc_tr' | 'arc_bl'> = [
      'flat_light', 'arc_br', 'boucle_warm',
      'arc_tr', 'flat_light', 'arc_bl',
      'boucle_warm', 'arc_tl', 'flat_light',
      'arc_br', 'boucle_warm', 'arc_tl',
    ];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = margin + c * cw;
        const y = margin + r * ch;
        const pad = 7;
        const style = cellStyles[r * cols + c];

        if (style === 'flat_light') {
          paintFlatWeave(x + pad, y + pad, cw - pad * 2, ch - pad * 2, `#${primary.getHexString()}`);
        } else if (style === 'boucle_warm') {
          paintBouclePile(x + pad, y + pad, cw - pad * 2, ch - pad * 2, `#${secondary.getHexString()}`, 215);
        } else {
          // Base contrast flat weave + raised quarter-circle bouclé relief arc
          paintFlatWeave(x + pad, y + pad, cw - pad * 2, ch - pad * 2, `#${secondary.getHexString()}`);

          const radius = Math.min(cw, ch) * 0.86;
          let ax = x + pad;
          let ay = y + pad;
          let startA = 0;
          let endA = Math.PI * 0.5;
          if (style === 'arc_tr') {
            ax = x + cw - pad;
            ay = y + pad;
            startA = Math.PI * 0.5;
            endA = Math.PI;
          } else if (style === 'arc_br') {
            ax = x + cw - pad;
            ay = y + ch - pad;
            startA = Math.PI;
            endA = Math.PI * 1.5;
          } else if (style === 'arc_bl') {
            ax = x + pad;
            ay = y + ch - pad;
            startA = Math.PI * 1.5;
            endA = Math.PI * 2;
          }

          ctxC.save();
          ctxB.save();
          const traceArc = (ctx: CanvasRenderingContext2D) => {
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.arc(ax, ay, radius, startA, endA);
            ctx.closePath();
          };
          traceArc(ctxC);
          ctxC.clip();
          traceArc(ctxB);
          ctxB.clip();
          paintBouclePile(x + pad, y + pad, cw - pad * 2, ch - pad * 2, `#${brightLoop.getHexString()}`, 235);
          ctxC.restore();
          ctxB.restore();

          // Carved shadow channel along the arc edge
          ctxC.beginPath();
          ctxC.arc(ax, ay, radius, startA, endA);
          ctxC.strokeStyle = `#${darkGroove.getHexString()}`;
          ctxC.lineWidth = 6;
          ctxC.stroke();

          ctxB.beginPath();
          ctxB.arc(ax, ay, radius, startA, endA);
          ctxB.strokeStyle = '#202020';
          ctxB.lineWidth = 8;
          ctxB.stroke();
        }

        // Deep carved architectural grid groove around every cell
        ctxC.strokeStyle = `#${darkGroove.getHexString()}`;
        ctxC.lineWidth = 10;
        ctxC.strokeRect(x + 3, y + 3, cw - 6, ch - 6);

        ctxB.strokeStyle = '#1b1b1b';
        ctxB.lineWidth = 12;
        ctxB.strokeRect(x + 3, y + 3, cw - 6, ch - 6);
      }
    }
  }

  // Outer woven overlock border band
  ctxC.strokeStyle = `#${secondary.getHexString()}`;
  ctxC.lineWidth = margin * 1.4;
  ctxC.strokeRect(margin * 0.5, margin * 0.5, W - margin, H - margin);

  ctxC.strokeStyle = `#${darkGroove.getHexString()}`;
  ctxC.lineWidth = 5;
  ctxC.strokeRect(margin, margin, innerW, innerH);

  ctxB.strokeStyle = '#282828';
  ctxB.lineWidth = 7;
  ctxB.strokeRect(margin, margin, innerW, innerH);

  const map = new THREE.CanvasTexture(cColor);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.ClampToEdgeWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;
  map.anisotropy = anisotropy;

  const bumpMap = new THREE.CanvasTexture(cBump);
  bumpMap.wrapS = THREE.ClampToEdgeWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;
  bumpMap.anisotropy = anisotropy;

  return { map, bumpMap };
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(256);
  const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
  grad.addColorStop(0, 'rgba(15, 23, 42, 0.34)');
  grad.addColorStop(0.55, 'rgba(15, 23, 42, 0.14)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface ArchitecturalSurfaceMaps {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  bumpScale: number;
  roughnessOverride?: number;
  metalnessOverride?: number;
}

const architecturalSurfaceCache = new Map<string, ArchitecturalSurfaceMaps>();

/**
 * Generates and caches seamless, luminance-neutral procedural albedo-detail + bump maps
 * for live architectural material & texture swapping on ANY 3D GLB/glTF asset.
 * Neutral albedo values (~0.80–1.0) multiply cleanly with any preset or custom RAL/HEX color.
 */
export function getArchitecturalSurfaceTextureSet(
  patternId: PatternId,
  anisotropy = 4,
): ArchitecturalSurfaceMaps | null {
  if (typeof document === 'undefined') return null;
  const supported: PatternId[] = [
    'boucle_linen',
    'oak_wood_grain',
    'marble_vein',
    'brushed_pvd',
    'fluted_ribbed',
    'microcement_matte',
  ];
  if (!supported.includes(patternId)) return null;

  const cached = architecturalSurfaceCache.get(patternId);
  if (cached) return cached;

  const size = 512;
  const [cColor, ctxC] = createCanvas(size);
  const [cBump, ctxB] = createCanvas(size);

  let repeatX = 4;
  let repeatY = 4;
  let bumpScale = 0.014;
  let roughnessOverride: number | undefined;
  let metalnessOverride: number | undefined;

  if (patternId === 'boucle_linen') {
    repeatX = 6;
    repeatY = 6;
    bumpScale = 0.022;
    roughnessOverride = 0.88;
    metalnessOverride = 0.0;
    ctxC.fillStyle = '#ECECEC';
    ctxC.fillRect(0, 0, size, size);
    ctxB.fillStyle = '#808080';
    ctxB.fillRect(0, 0, size, size);

    for (let y = 0; y < size; y += 4) {
      for (let x = 0; x < size; x += 4) {
        const warp = Math.sin(x * 0.45) * 0.5 + Math.cos(y * 0.45) * 0.5;
        const loop = ((x / 4 + y / 4) % 2 === 0 ? 12 : -10) + Math.sin(x * 0.19 + y * 0.31) * 14;
        const cVal = Math.max(198, Math.min(252, Math.round(234 + warp * 10 + loop * 0.65)));
        const bVal = Math.max(36, Math.min(230, Math.round(128 + warp * 44 + loop * 2.1)));
        ctxC.fillStyle = `rgb(${cVal},${cVal},${cVal})`;
        ctxC.fillRect(x, y, 4, 4);
        ctxB.fillStyle = `rgb(${bVal},${bVal},${bVal})`;
        ctxB.fillRect(x, y, 4, 4);
      }
    }
  } else if (patternId === 'oak_wood_grain') {
    repeatX = 3;
    repeatY = 3;
    bumpScale = 0.012;
    roughnessOverride = 0.54;
    metalnessOverride = 0.02;
    ctxC.fillStyle = '#EAEAEA';
    ctxC.fillRect(0, 0, size, size);
    ctxB.fillStyle = '#848484';
    ctxB.fillRect(0, 0, size, size);

    for (let i = 0; i < 120; i++) {
      const y = (i / 120) * size;
      const amp = 4 + (i % 5) * 2.5;
      const isDark = i % 3 === 0;
      ctxC.strokeStyle = isDark ? 'rgba(162,162,162,0.48)' : 'rgba(252,252,252,0.34)';
      ctxC.lineWidth = 1.5 + (i % 4);
      ctxC.beginPath();
      ctxC.moveTo(0, y);
      ctxC.bezierCurveTo(size * 0.33, y + amp, size * 0.66, y - amp, size, y);
      ctxC.stroke();

      ctxB.strokeStyle = isDark ? 'rgba(64,64,64,0.52)' : 'rgba(190,190,190,0.42)';
      ctxB.lineWidth = 1.6 + (i % 3);
      ctxB.beginPath();
      ctxB.moveTo(0, y);
      ctxB.bezierCurveTo(size * 0.33, y + amp, size * 0.66, y - amp, size, y);
      ctxB.stroke();
    }
  } else if (patternId === 'marble_vein') {
    repeatX = 2;
    repeatY = 2;
    bumpScale = 0.005;
    roughnessOverride = 0.14;
    metalnessOverride = 0.02;
    ctxC.fillStyle = '#F3F3F3';
    ctxC.fillRect(0, 0, size, size);
    ctxB.fillStyle = '#929292';
    ctxB.fillRect(0, 0, size, size);

    // Soft cloudy mineral depth
    for (let i = 0; i < 24; i++) {
      const cx = (i * 97) % size;
      const cy = (i * 151) % size;
      const rad = 54 + (i % 4) * 28;
      const grad = ctxC.createRadialGradient(cx, cy, 4, cx, cy, rad);
      grad.addColorStop(0, 'rgba(205,205,205,0.28)');
      grad.addColorStop(1, 'rgba(243,243,243,0)');
      ctxC.fillStyle = grad;
      ctxC.fillRect(0, 0, size, size);
    }
    // Crisp Calacatta/travertine diagonal veins
    for (let v = 0; v < 14; v++) {
      const startY = (v * 41) % size;
      ctxC.strokeStyle = v % 3 === 0 ? 'rgba(130,130,130,0.56)' : 'rgba(168,168,168,0.34)';
      ctxC.lineWidth = v % 4 === 0 ? 3.2 : 1.4;
      ctxC.beginPath();
      ctxC.moveTo(0, startY);
      for (let x = 32; x <= size; x += 32) {
        const dy = Math.sin(x * 0.024 + v * 1.4) * 22 + Math.cos(x * 0.06 - v) * 9;
        ctxC.lineTo(x, (startY + x * 0.42 + dy) % size);
      }
      ctxC.stroke();

      ctxB.strokeStyle = 'rgba(92,92,92,0.42)';
      ctxB.lineWidth = 1.6;
      ctxB.stroke();
    }
  } else if (patternId === 'brushed_pvd') {
    repeatX = 4;
    repeatY = 4;
    bumpScale = 0.006;
    roughnessOverride = 0.22;
    metalnessOverride = 0.94;
    ctxC.fillStyle = '#EEEEEE';
    ctxC.fillRect(0, 0, size, size);
    ctxB.fillStyle = '#808080';
    ctxB.fillRect(0, 0, size, size);

    for (let y = 0; y < size; y += 2) {
      const streak = Math.sin(y * 1.7) * 10 + Math.cos(y * 0.43) * 8;
      const cVal = Math.max(210, Math.min(254, Math.round(236 + streak)));
      const bVal = Math.max(85, Math.min(185, Math.round(128 + streak * 2.4)));
      ctxC.fillStyle = `rgb(${cVal},${cVal},${cVal})`;
      ctxC.fillRect(0, y, size, 2);
      ctxB.fillStyle = `rgb(${bVal},${bVal},${bVal})`;
      ctxB.fillRect(0, y, size, 2);
    }
  } else if (patternId === 'fluted_ribbed') {
    repeatX = 6;
    repeatY = 2;
    bumpScale = 0.028;
    roughnessOverride = 0.44;
    ctxC.fillStyle = '#EBEBEB';
    ctxC.fillRect(0, 0, size, size);
    ctxB.fillStyle = '#808080';
    ctxB.fillRect(0, 0, size, size);

    const flutes = 16;
    const step = size / flutes;
    for (let x = 0; x < size; x++) {
      const phase = ((x % step) / step) * Math.PI;
      const ridge = Math.sin(phase);
      const cVal = Math.round(202 + ridge * 50);
      const bVal = Math.round(32 + ridge * 214);
      ctxC.fillStyle = `rgb(${cVal},${cVal},${cVal})`;
      ctxC.fillRect(x, 0, 1, size);
      ctxB.fillStyle = `rgb(${bVal},${bVal},${bVal})`;
      ctxB.fillRect(x, 0, 1, size);
    }
  } else {
    // microcement_matte
    repeatX = 4;
    repeatY = 4;
    bumpScale = 0.016;
    roughnessOverride = 0.86;
    metalnessOverride = 0.0;
    ctxC.fillStyle = '#E8E8E8';
    ctxC.fillRect(0, 0, size, size);
    ctxB.fillStyle = '#808080';
    ctxB.fillRect(0, 0, size, size);

    for (let i = 0; i < 36; i++) {
      const cx = (i * 83) % size;
      const cy = (i * 127) % size;
      const rad = 34 + (i % 5) * 24;
      const grad = ctxC.createRadialGradient(cx, cy, 2, cx, cy, rad);
      grad.addColorStop(0, i % 2 === 0 ? 'rgba(204,204,204,0.32)' : 'rgba(250,250,250,0.28)');
      grad.addColorStop(1, 'rgba(232,232,232,0)');
      ctxC.fillStyle = grad;
      ctxC.fillRect(0, 0, size, size);
    }
    for (let y = 0; y < size; y += 4) {
      for (let x = 0; x < size; x += 4) {
        const grain = Math.sin(x * 0.71 + y * 0.53) * 18 + Math.cos(x * 0.29 - y * 0.83) * 14;
        const bVal = Math.max(48, Math.min(212, Math.round(128 + grain)));
        ctxB.fillStyle = `rgb(${bVal},${bVal},${bVal})`;
        ctxB.fillRect(x, y, 4, 4);
      }
    }
  }

  const map = new THREE.CanvasTexture(cColor);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatX, repeatY);
  map.anisotropy = anisotropy;
  map.userData.__mimarSharedProcedural = true;

  const bumpMap = new THREE.CanvasTexture(cBump);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(repeatX, repeatY);
  bumpMap.anisotropy = anisotropy;
  bumpMap.userData.__mimarSharedProcedural = true;

  const result: ArchitecturalSurfaceMaps = {
    map,
    bumpMap,
    bumpScale,
    roughnessOverride,
    metalnessOverride,
  };
  architecturalSurfaceCache.set(patternId, result);
  return result;
}

