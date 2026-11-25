import * as THREE from 'three';
import type { ArchitecturalAsset, MaterialFinish } from '../lib/catalogTypes';
import { createWoodGrainTexture } from './proceduralTextures';
import type { ProceduralBuildResult } from './turkishEntrywayBuilder';

export const TURKISH_KITCHEN_BUILTIN_ARCHETYPES = new Set<string>([
  'tr_bosch_ankastre_set_3',
  'tr_siemens_ankastre_set_3',
  'tr_vestel_rustik_set_3',
  'tr_bosch_serie8_oven',
  'tr_siemens_iq700_oven',
  'tr_vestel_builtin_oven',
  'tr_builtin_microwave',
  'tr_induction_hob_60',
  'tr_gas_glass_hob_60',
  'tr_wok_gas_hob_75',
  'tr_downdraft_induction_hob',
  'tr_angled_glass_hood',
  'tr_island_t_hood_90',
  'tr_recessed_cabinet_hood',
  'tr_builtin_coffee_machine',
  'tr_builtin_fridge_column',
]);

export function isTurkishKitchenBuiltInArchetype(archetype: string): boolean {
  return TURKISH_KITCHEN_BUILTIN_ARCHETYPES.has(archetype);
}

function getLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function createCanvasTex(
  w: number,
  h: number,
  maxAnisotropy: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, Math.max(1, maxAnisotropy));
  tex.needsUpdate = true;
  return tex;
}

function createOvenControlTex(
  style: 'bosch-s6' | 'bosch-s8' | 'siemens-iq500' | 'siemens-iq700' | 'vestel-rustic',
  baseHex: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  return createCanvasTex(1024, 220, maxAnisotropy, (ctx, w, h) => {
    const isLight = getLuminance(baseHex) > 0.55;
    ctx.fillStyle = style === 'vestel-rustic' ? baseHex : isLight ? '#F0F2F5' : '#12151B';
    ctx.fillRect(0, 0, w, h);

    if (style === 'vestel-rustic') {
      // Ornate Roman-numeral analog clock in center
      const cx = w * 0.5;
      const cy = h * 0.52;
      const rad = 66;
      ctx.fillStyle = '#B89048';
      ctx.beginPath();
      ctx.arc(cx, cy, rad + 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FBF7EE';
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#383024';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * (rad - 13), cy + Math.sin(a) * (rad - 13));
        ctx.lineTo(cx + Math.cos(a) * (rad - 5), cy + Math.sin(a) * (rad - 5));
        ctx.stroke();
      }
      // Clock hands
      ctx.strokeStyle = '#1E1A14';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 26, cy - 22);
      ctx.stroke();
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - 12, cy - 38);
      ctx.stroke();
      ctx.fillStyle = '#B89048';
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();

      // Subtle VESTEL vintage wordmark
      ctx.fillStyle = isLight ? '#5E4B2B' : '#D4AF5A';
      ctx.font = '700 26px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('VESTEL', w * 0.5, 28);
      return;
    }

    const isSiemens = style === 'siemens-iq500' || style === 'siemens-iq700';
    const accent = isSiemens ? '#38BDF8' : '#EF4444';

    // Center TFT / LED screen window
    const sw = style === 'bosch-s8' || style === 'siemens-iq700' ? 470 : 240;
    const sh = 104;
    const sx = (w - sw) / 2;
    const sy = (h - sh) / 2 + 8;
    ctx.fillStyle = '#090C11';
    ctx.fillRect(sx, sy, sw, sh);
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 2;
    ctx.strokeRect(sx + 1, sy + 1, sw - 2, sh - 2);

    // Brand wordmark above/left
    ctx.fillStyle = isLight ? '#1F242D' : '#D9E0E8';
    ctx.font = isSiemens
      ? '700 32px "Inter", Arial, sans-serif'
      : '800 32px "Inter", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(isSiemens ? 'SIEMENS' : 'BOSCH', 36, 54);
    ctx.fillStyle = isSiemens ? '#38BDF8' : '#DC2626';
    ctx.font = '600 18px "Inter", Arial, sans-serif';
    const seriesTxt =
      style === 'bosch-s8'
        ? 'Serie 8 · Home Connect'
        : style === 'bosch-s6'
          ? 'Serie 6 · 3D Hotair'
          : style === 'siemens-iq700'
            ? 'iQ700 · studioLine'
            : 'iQ500 · activeClean';
    ctx.fillText(seriesTxt, 36, 82);

    // Glowing TFT readout (cleanly spaced left & right of central 3D ring/dial)
    ctx.textAlign = 'center';
    if (style === 'bosch-s8') {
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '700 40px "JetBrains Mono", monospace';
      ctx.fillText('180°C', sx + 88, sy + 64);
      ctx.fillStyle = '#EF4444';
      ctx.font = '700 19px "Inter", Arial, sans-serif';
      ctx.fillText('4D HOTAIR', sx + 372, sy + 44);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 22px "JetBrains Mono", monospace';
      ctx.fillText('00:35', sx + 372, sy + 80);
    } else if (style === 'siemens-iq700') {
      ctx.fillStyle = '#38BDF8';
      ctx.font = '700 40px "JetBrains Mono", monospace';
      ctx.fillText('190°C', sx + 88, sy + 64);
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '700 17px "Inter", Arial, sans-serif';
      ctx.fillText('4D HOTAIR PLUS', sx + 374, sy + 44);
      ctx.fillStyle = '#38BDF8';
      ctx.font = '600 19px "JetBrains Mono", monospace';
      ctx.fillText('14:25 · WIFI', sx + 374, sy + 80);
    } else {
      ctx.fillStyle = accent;
      ctx.font = '700 50px "JetBrains Mono", monospace';
      ctx.fillText('18:45', w * 0.5, sy + 68);
    }

    // Touch icon dots on right & left
    ctx.fillStyle = isLight ? '#475569' : '#94A3B8';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(w - 220 + i * 44, h * 0.56, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function createInductionHobTex(
  mode: 'flex60' | 'downdraft80',
  baseHex: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  return createCanvasTex(1024, 896, maxAnisotropy, (ctx, w, h) => {
    const isLight = getLuminance(baseHex) > 0.55;
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, w, h);

    const lineCol = isLight ? 'rgba(30,36,44,0.65)' : 'rgba(226,232,240,0.72)';
    const subtleCol = isLight ? 'rgba(30,36,44,0.32)' : 'rgba(226,232,240,0.34)';

    if (mode === 'flex60') {
      // Left FlexInduction zone (4 horizontal bar pairs)
      ctx.strokeStyle = lineCol;
      ctx.lineWidth = 4;
      const lx = w * 0.25;
      for (let i = 0; i < 4; i++) {
        const yy = h * (0.2 + i * 0.16);
        ctx.strokeRect(lx - 110, yy - 38, 220, 76);
        // Center cross marker
        ctx.beginPath();
        ctx.moveTo(lx - 14, yy);
        ctx.lineTo(lx + 14, yy);
        ctx.moveTo(lx, yy - 14);
        ctx.lineTo(lx, yy + 14);
        ctx.stroke();
      }

      // Right back large zone (21 cm) & right front medium zone (14.5 cm)
      const zones = [
        { cx: w * 0.72, cy: h * 0.28, r: 126 },
        { cx: w * 0.72, cy: h * 0.63, r: 96 },
      ];
      for (const z of zones) {
        ctx.strokeStyle = lineCol;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(z.cx, z.cy, z.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = subtleCol;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(z.cx, z.cy, z.r * 0.62, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(z.cx - 14, z.cy);
        ctx.lineTo(z.cx + 14, z.cy);
        ctx.moveTo(z.cx, z.cy - 14);
        ctx.lineTo(z.cx, z.cy + 14);
        ctx.stroke();
      }
    } else {
      // Downdraft 80 cm: Left & Right CombiZone rectangles flanking central vent cutout
      ctx.strokeStyle = lineCol;
      ctx.lineWidth = 4;
      for (const cx of [w * 0.21, w * 0.79]) {
        for (const cy of [h * 0.27, h * 0.61]) {
          ctx.strokeRect(cx - 125, cy - 102, 250, 204);
          ctx.beginPath();
          ctx.moveTo(cx - 16, cy);
          ctx.lineTo(cx + 16, cy);
          ctx.moveTo(cx, cy - 16);
          ctx.lineTo(cx, cy + 16);
          ctx.stroke();
        }
      }
    }

    // Front DirectSelect / touchSlider red/blue LED strip
    const barY = h * 0.87;
    ctx.strokeStyle = subtleCol;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.1, barY - 38);
    ctx.lineTo(w * 0.9, barY - 38);
    ctx.stroke();

    ctx.fillStyle = mode === 'downdraft80' ? '#38BDF8' : '#EF4444';
    ctx.font = '700 28px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'b'];
    nums.forEach((n, idx) => {
      const nx = w * 0.24 + idx * 52;
      ctx.fillText(n, nx, barY + 12);
    });

    // Schott Ceran corner print
    ctx.fillStyle = subtleCol;
    ctx.font = '600 16px "Inter", Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('SCHOTT CERAN', w - 36, h - 22);
    ctx.textAlign = 'left';
    ctx.fillText(mode === 'downdraft80' ? 'SIEMENS · inductionAir' : 'BOSCH · FlexInduction', 36, h - 22);
  });
}

function createAluminumFilterTex(maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTex(256, 256, maxAnisotropy, (ctx, w, h) => {
    ctx.fillStyle = '#B4BCC6';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#737B86';
    for (let y = 6; y < h - 6; y += 8) {
      for (let x = 6; x < w - 6; x += 12) {
        ctx.fillRect(x, y, 8, 4);
      }
    }
    ctx.strokeStyle = '#DCE2E9';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, w - 8, h - 8);
  });
}

function createHoodTouchTex(brand: string, maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTex(512, 96, maxAnisotropy, (ctx, w, h) => {
    ctx.fillStyle = '#0E1117';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '700 22px "Inter", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(brand, 26, 56);

    const icons = ['⏻', '1', '2', '3', 'B', '☀'];
    ctx.font = '600 24px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    icons.forEach((ic, idx) => {
      ctx.fillStyle = idx === 2 ? '#38BDF8' : '#CBD5E1';
      ctx.fillText(ic, 230 + idx * 46, 57);
    });
  });
}

function createCoffeeTftTex(maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTex(512, 160, maxAnisotropy, (ctx, w, h) => {
    ctx.fillStyle = '#0A0D12';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '700 22px "Inter", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SIEMENS  iQ700', 22, 36);

    const drinks = [
      { label: 'Espresso', x: 96, col: '#D97706' },
      { label: 'Cappuccino', x: 256, col: '#F59E0B' },
      { label: 'Latte', x: 416, col: '#FBBF24' },
    ];
    for (const d of drinks) {
      ctx.fillStyle = d.col;
      ctx.beginPath();
      ctx.arc(d.x, 86, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1E140B';
      ctx.beginPath();
      ctx.arc(d.x, 86, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#CBD5E1';
      ctx.font = '600 17px "Inter", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, d.x, 136);
    }
  });
}

export function buildTurkishKitchenBuiltInMesh(
  asset: ArchitecturalAsset,
  finish: MaterialFinish,
  options: { wireframe?: boolean; maxAnisotropy: number },
): ProceduralBuildResult {
  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    if (options.wireframe && 'wireframe' in m) {
      (m as unknown as THREE.MeshStandardMaterial).wireframe = true;
    }
    materials.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    textures.push(t);
    return t;
  };

  const addMesh = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    pos: [number, number, number],
    rot: [number, number, number] = [0, 0, 0],
    castShadow = true,
  ) => {
    const mesh = new THREE.Mesh(trackGeo(geo), mat);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  const pf = finish.partFinishes;
  const primaryHex = pf?.primary.hex || finish.primaryHex;
  const secondaryHex = pf?.secondary.hex || finish.secondaryHex || '#C6CCD4';
  const accentHex = pf?.accent.hex || finish.accentHex || '#E0E5EC';
  const glassHex = pf?.glass?.hex || '#181C22';

  const makePrimaryMat = (withWood = false) => {
    const grain = withWood ? createWoodGrainTexture(primaryHex, options.maxAnisotropy) : undefined;
    if (grain) {
      trackTex(grain.map);
      trackTex(grain.bumpMap);
    }
    const params: THREE.MeshStandardMaterialParameters = {
      color: grain ? '#FFFFFF' : new THREE.Color(primaryHex),
      roughness: pf?.primary.roughness ?? finish.roughness,
      metalness: pf?.primary.metalness ?? finish.metalness,
    };
    if (grain) {
      params.map = grain.map;
      params.bumpMap = grain.bumpMap;
      params.bumpScale = 0.004;
    }
    return trackMat(new THREE.MeshStandardMaterial(params));
  };

  const makeSecondaryMat = () =>
    trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(secondaryHex),
        roughness: pf?.secondary.roughness ?? 0.28,
        metalness: pf?.secondary.metalness ?? 0.86,
      }),
    );

  const makeAccentMat = () =>
    trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(accentHex),
        roughness: pf?.accent.roughness ?? 0.2,
        metalness: pf?.accent.metalness ?? 0.92,
      }),
    );

  const darkChassisMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#1C2026',
      roughness: 0.48,
      metalness: 0.65,
    }),
  );

  const castIronMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#202329',
      roughness: 0.64,
      metalness: 0.56,
    }),
  );

  const chromeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#DCE2EA',
      roughness: 0.14,
      metalness: 0.96,
    }),
  );

  const cavityEnamelMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#2B3038',
      roughness: 0.34,
      metalness: 0.45,
    }),
  );

  const ovenDoorGlassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(glassHex),
      roughness: 0.06,
      metalness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      transparent: true,
      opacity: 0.68,
    }),
  );

  const warmLedMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#FFF6E3',
      emissive: new THREE.Color('#FFD28E'),
      emissiveIntensity: 2.2,
      roughness: 0.2,
    }),
  );

  const coolLedMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#E0F2FE',
      emissive: new THREE.Color('#38BDF8'),
      emissiveIntensity: 1.9,
      roughness: 0.2,
    }),
  );

  const primaryMat = makePrimaryMat(finish.materialKind === 'wood');
  const secondaryMat = makeSecondaryMat();
  const accentMat = makeAccentMat();

  const filterTex = trackTex(createAluminumFilterTex(options.maxAnisotropy));
  const filterMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      map: filterTex,
      roughness: 0.34,
      metalness: 0.82,
    }),
  );

  // ── Helper: Build a detailed 60×60 cm built-in oven at given base Y ──
  const buildOvenUnit = (
    baseY: number,
    style: 'bosch-s6' | 'bosch-s8' | 'siemens-iq500' | 'siemens-iq700' | 'vestel-rustic',
    zOffset = 0,
  ) => {
    const W = 0.595;
    const H = 0.595;
    const D = 0.54;
    const cy = baseY + H / 2;

    // Rear steel recessed box
    addMesh(new THREE.BoxGeometry(W - 0.032, H - 0.02, D - 0.03), darkChassisMat, [0, cy, zOffset - 0.015]);

    // Front fascia backing
    addMesh(new THREE.BoxGeometry(W, H, 0.024), primaryMat, [0, cy, zOffset + D / 2 - 0.012]);

    // Upper control panel decal strip
    const ctrlH = 0.115;
    const ctrlY = baseY + H - ctrlH / 2 - 0.008;
    const ctrlTex = trackTex(createOvenControlTex(style, primaryHex, options.maxAnisotropy));
    const ctrlMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        map: ctrlTex,
        roughness: 0.12,
        metalness: 0.14,
      }),
    );
    addMesh(new THREE.BoxGeometry(W - 0.006, ctrlH, 0.006), ctrlMat, [0, ctrlY, zOffset + D / 2 + 0.003]);

    // Control knobs / Bosch ControlRing
    if (style === 'bosch-s8') {
      // Iconic central Bosch stainless ControlRing
      addMesh(
        new THREE.TorusGeometry(0.026, 0.0045, 16, 36),
        accentMat,
        [0, ctrlY - 0.004, zOffset + D / 2 + 0.009],
      );
    } else if (style === 'siemens-iq700') {
      // Sleek horizontal stainless trim bars + central precision dial
      addMesh(
        new THREE.BoxGeometry(W, 0.009, 0.008),
        secondaryMat,
        [0, baseY + H - ctrlH - 0.012, zOffset + D / 2 + 0.004],
      );
      addMesh(
        new THREE.CylinderGeometry(0.019, 0.02, 0.018, 28),
        accentMat,
        [0, ctrlY - 0.004, zOffset + D / 2 + 0.012],
        [Math.PI / 2, 0, 0],
      );
    } else {
      // Twin rotary knobs (Bosch S6 / Siemens iQ500 / Vestel Rustik)
      for (const kx of [-0.185, 0.185]) {
        addMesh(
          new THREE.CylinderGeometry(0.02, 0.022, 0.024, 24),
          style === 'vestel-rustic' ? accentMat : secondaryMat,
          [kx, ctrlY - 0.002, zOffset + D / 2 + 0.014],
          [Math.PI / 2, 0, 0],
        );
        addMesh(
          new THREE.CylinderGeometry(0.024, 0.024, 0.004, 24),
          accentMat,
          [kx, ctrlY - 0.002, zOffset + D / 2 + 0.005],
          [Math.PI / 2, 0, 0],
        );
      }
    }

    // Lower oven door frame + recessed lit cavity + wire racks + glass pane
    const doorH = H - ctrlH - 0.026;
    const doorY = baseY + doorH / 2 + 0.008;
    const winW = W - 0.11;
    const winH = doorH - 0.12;

    // Inner dark enamel cavity backdrop (slightly behind door glass)
    addMesh(new THREE.BoxGeometry(winW, winH, 0.06), cavityEnamelMat, [0, doorY - 0.01, zOffset + D / 2 - 0.032]);

    // Glowing oven cavity bulb + convection fan disc
    addMesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.006, 20),
      darkChassisMat,
      [0, doorY - 0.01, zOffset + D / 2 - 0.058],
      [Math.PI / 2, 0, 0],
    );
    addMesh(
      new THREE.BoxGeometry(0.055, 0.022, 0.008),
      warmLedMat,
      [0, doorY + winH / 2 - 0.03, zOffset + D / 2 - 0.048],
      [0, 0, 0],
      false,
    );

    // Two interior chrome wire racks
    for (const ry of [doorY - 0.07, doorY + 0.03]) {
      addMesh(new THREE.BoxGeometry(winW - 0.02, 0.006, 0.008), chromeMat, [0, ry, zOffset + D / 2 - 0.015]);
      for (let rx = -winW / 2 + 0.04; rx <= winW / 2 - 0.04; rx += 0.055) {
        addMesh(new THREE.BoxGeometry(0.004, 0.004, 0.04), chromeMat, [rx, ry, zOffset + D / 2 - 0.035]);
      }
    }

    // Translucent tempered outer door glass
    addMesh(new THREE.BoxGeometry(winW + 0.01, winH + 0.01, 0.008), ovenDoorGlassMat, [0, doorY - 0.01, zOffset + D / 2 + 0.004]);

    // Decorative outer perimeter border around viewing window
    const topStripH = 0.052;
    addMesh(new THREE.BoxGeometry(W - 0.004, topStripH, 0.01), primaryMat, [0, doorY + doorH / 2 - topStripH / 2, zOffset + D / 2 + 0.004]);
    addMesh(new THREE.BoxGeometry(W - 0.004, 0.045, 0.01), primaryMat, [0, baseY + 0.03, zOffset + D / 2 + 0.004]);
    for (const sx of [-1, 1]) {
      addMesh(new THREE.BoxGeometry(0.052, doorH, 0.01), primaryMat, [sx * (W / 2 - 0.026), doorY, zOffset + D / 2 + 0.004]);
    }

    // Ergonomic bar handle (tubular or curved brass for rustic)
    const handleY = doorY + doorH / 2 - 0.026;
    const handleZ = zOffset + D / 2 + 0.044;
    const handleMat = style === 'vestel-rustic' ? accentMat : accentMat;
    if (style === 'siemens-iq700' || style === 'siemens-iq500') {
      addMesh(new THREE.BoxGeometry(W - 0.08, 0.016, 0.018), handleMat, [0, handleY, handleZ]);
    } else {
      addMesh(
        new THREE.CylinderGeometry(0.011, 0.011, W - 0.09, 20),
        handleMat,
        [0, handleY, handleZ],
        [0, 0, Math.PI / 2],
      );
    }
    for (const bx of [-(W / 2 - 0.085), W / 2 - 0.085]) {
      addMesh(new THREE.BoxGeometry(0.018, 0.018, 0.038), handleMat, [bx, handleY, zOffset + D / 2 + 0.024]);
    }
  };

  // ── Helper: Build a detailed 60 cm induction hob at given Y ──
  const buildInductionHob60 = (baseY: number, zOffset = 0) => {
    const W = 0.6;
    const D = 0.52;
    // Recessed under-counter housing
    addMesh(new THREE.BoxGeometry(W - 0.04, 0.042, D - 0.035), darkChassisMat, [0, baseY + 0.021, zOffset]);
    // Tempered Schott Ceran glass plate
    const hobTex = trackTex(createInductionHobTex('flex60', primaryHex, options.maxAnisotropy));
    const hobTopMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        map: hobTex,
        roughness: 0.08,
        metalness: 0.12,
      }),
    );
    addMesh(new THREE.BoxGeometry(W, 0.008, D), primaryMat, [0, baseY + 0.046, zOffset]);
    addMesh(
      new THREE.PlaneGeometry(W - 0.012, D - 0.012),
      hobTopMat,
      [0, baseY + 0.0505, zOffset],
      [-Math.PI / 2, 0, 0],
      false,
    );
    // Side brushed steel protective strips
    for (const sx of [-1, 1]) {
      addMesh(new THREE.BoxGeometry(0.009, 0.01, D + 0.002), accentMat, [sx * (W / 2 - 0.003), baseY + 0.047, zOffset]);
    }
  };

  // ── Helper: Build a single detailed Sabaf gas burner + cast-iron pan support ──
  const buildGasBurner = (
    x: number,
    y: number,
    z: number,
    radius: number,
    isWok = false,
  ) => {
    // Aluminum burner cup
    addMesh(new THREE.CylinderGeometry(radius * 0.92, radius, 0.016, 28), chromeMat, [x, y + 0.008, z]);
    // Matte black / brass flame cap
    addMesh(
      new THREE.CylinderGeometry(radius * 0.98, radius * 0.95, 0.007, 28),
      isWok ? accentMat : castIronMat,
      [x, y + 0.019, z],
    );
    if (isWok) {
      // Inner secondary Wok crown
      addMesh(new THREE.CylinderGeometry(radius * 0.42, radius * 0.46, 0.024, 24), chromeMat, [x, y + 0.012, z]);
      addMesh(new THREE.CylinderGeometry(radius * 0.48, radius * 0.45, 0.006, 24), accentMat, [x, y + 0.026, z]);
    }
    // White ceramic spark igniter pin
    addMesh(
      new THREE.CylinderGeometry(0.003, 0.003, 0.022, 8),
      trackMat(new THREE.MeshStandardMaterial({ color: '#F1F5F9', roughness: 0.25 })),
      [x + radius * 1.12, y + 0.011, z],
    );

    // Cast-iron pan support cross-grate (4 diagonal spider fingers + perimeter ring)
    const span = isWok ? radius * 2.4 : radius * 2.65;
    const grateY = y + 0.032;
    addMesh(
      new THREE.TorusGeometry(radius * 1.38, 0.006, 10, 28),
      castIronMat,
      [x, grateY, z],
      [Math.PI / 2, 0, 0],
    );
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2 + Math.PI / 4;
      addMesh(
        new THREE.BoxGeometry(span, 0.01, 0.009),
        castIronMat,
        [x + Math.cos(ang) * (radius * 0.85), grateY, z + Math.sin(ang) * (radius * 0.85)],
        [0, -ang, 0],
      );
      // Vertical support legs touching glass
      addMesh(
        new THREE.BoxGeometry(0.01, 0.032, 0.01),
        castIronMat,
        [x + Math.cos(ang) * (radius * 1.42), y + 0.016, z + Math.sin(ang) * (radius * 1.42)],
      );
    }
  };

  // ── Helper: Build a detailed 60 cm 4-burner gas glass hob at given Y ──
  const buildGasHob60 = (baseY: number, zOffset = 0, knobMat = accentMat) => {
    const W = 0.6;
    const D = 0.52;
    addMesh(new THREE.BoxGeometry(W - 0.04, 0.044, D - 0.035), darkChassisMat, [0, baseY + 0.022, zOffset]);
    addMesh(new THREE.BoxGeometry(W, 0.01, D), primaryMat, [0, baseY + 0.049, zOffset]);

    const topY = baseY + 0.054;
    // 4 burners: front-left large, back-left medium, back-right medium, front-right small
    buildGasBurner(-0.145, topY, zOffset + 0.075, 0.048, false);
    buildGasBurner(-0.145, topY, zOffset - 0.11, 0.038, false);
    buildGasBurner(0.145, topY, zOffset - 0.11, 0.038, false);
    buildGasBurner(0.145, topY, zOffset + 0.075, 0.03, false);

    // 4 front ergonomic rotary knobs
    const knobXs = [-0.175, -0.06, 0.06, 0.175];
    for (const kx of knobXs) {
      addMesh(new THREE.CylinderGeometry(0.018, 0.022, 0.024, 20), knobMat, [kx, topY + 0.012, zOffset + D / 2 - 0.045]);
      addMesh(new THREE.BoxGeometry(0.007, 0.022, 0.034), knobMat, [kx, topY + 0.022, zOffset + D / 2 - 0.045]);
    }
  };

  // ── Helper: Build a 60 cm angled tempered glass wall hood at given base Y ──
  const buildAngledGlassHood = (baseY: number, brand: string, zOffset = -0.14) => {
    const W = 0.6;
    // Wall backing chassis
    addMesh(new THREE.BoxGeometry(W - 0.04, 0.34, 0.14), darkChassisMat, [0, baseY + 0.21, zOffset - 0.04]);
    // Telescopic stainless flue chimney
    addMesh(new THREE.BoxGeometry(0.24, 0.48, 0.22), secondaryMat, [0, baseY + 0.62, zOffset - 0.01]);
    // Ceiling collar trim
    addMesh(new THREE.BoxGeometry(0.26, 0.016, 0.24), secondaryMat, [0, baseY + 0.855, zOffset - 0.01]);

    // Angled double-panel tempered glass canopy (32 deg tilt)
    const tilt = -0.54;
    // Back glass panel
    addMesh(new THREE.BoxGeometry(W, 0.44, 0.012), primaryMat, [0, baseY + 0.23, zOffset + 0.11], [tilt, 0, 0]);
    // Front floating glass panel (1.8 cm perimeter suction gap)
    addMesh(new THREE.BoxGeometry(W - 0.016, 0.34, 0.012), primaryMat, [0, baseY + 0.22, zOffset + 0.145], [tilt, 0, 0]);

    // Front touch display bar flush on outer face of the angled floating glass panel
    const touchTex = trackTex(createHoodTouchTex(brand, options.maxAnisotropy));
    const touchMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        map: touchTex,
        emissiveMap: touchTex,
        emissive: new THREE.Color('#FFFFFF'),
        emissiveIntensity: 0.32,
        roughness: 0.12,
        metalness: 0.1,
      }),
    );
    const localY = -0.105;
    const localZ = 0.011;
    const touchY = baseY + 0.22 + localY * Math.cos(tilt) - localZ * Math.sin(tilt);
    const touchZ = zOffset + 0.145 + localY * Math.sin(tilt) + localZ * Math.cos(tilt);
    addMesh(
      new THREE.PlaneGeometry(0.36, 0.058),
      touchMat,
      [0, touchY, touchZ],
      [tilt, 0, 0],
      false,
    );

    // Underside grease filter + twin glowing 3000K LED spots
    addMesh(new THREE.BoxGeometry(0.44, 0.012, 0.18), filterMat, [0, baseY + 0.042, zOffset + 0.02]);
    for (const lx of [-0.21, 0.21]) {
      addMesh(new THREE.CylinderGeometry(0.024, 0.024, 0.008, 16), chromeMat, [lx, baseY + 0.038, zOffset + 0.02]);
      addMesh(new THREE.CylinderGeometry(0.018, 0.018, 0.009, 16), warmLedMat, [lx, baseY + 0.036, zOffset + 0.02], [0, 0, 0], false);
    }
  };

  // ── Helper: Build a 60 cm rustic pyramid hood (Vestel Rustik) ──
  const buildRusticPyramidHood = (baseY: number, zOffset = -0.1) => {
    const W = 0.6;
    const D = 0.48;
    // Lower skirt box
    addMesh(new THREE.BoxGeometry(W, 0.07, D), primaryMat, [0, baseY + 0.035, zOffset + 0.07]);
    // Pyramid taper (4-sided truncated cone)
    addMesh(
      new THREE.CylinderGeometry(0.18, 0.42, 0.26, 4),
      primaryMat,
      [0, baseY + 0.2, zOffset + 0.07],
      [0, Math.PI / 4, 0],
    );
    // Chimney column
    addMesh(new THREE.BoxGeometry(0.24, 0.48, 0.22), primaryMat, [0, baseY + 0.56, zOffset - 0.03]);
    // Signature Vestel Rustik antique brass front rail bar
    addMesh(
      new THREE.CylinderGeometry(0.01, 0.01, W - 0.06, 16),
      accentMat,
      [0, baseY + 0.038, zOffset + D / 2 + 0.105],
      [0, 0, Math.PI / 2],
    );
    for (const rx of [-0.26, 0.26]) {
      addMesh(new THREE.CylinderGeometry(0.008, 0.008, 0.042, 12), accentMat, [rx, baseY + 0.038, zOffset + D / 2 + 0.085], [Math.PI / 2, 0, 0]);
    }
    // Mechanical brass push buttons on right front
    for (let i = 0; i < 4; i++) {
      addMesh(new THREE.BoxGeometry(0.016, 0.016, 0.012), accentMat, [0.12 + i * 0.03, baseY + 0.038, zOffset + D / 2 + 0.072]);
    }
    // Underside grease filters + twin warm LEDs
    addMesh(new THREE.BoxGeometry(0.5, 0.01, 0.34), filterMat, [0, baseY + 0.004, zOffset + 0.07]);
    for (const lx of [-0.2, 0.2]) {
      addMesh(new THREE.CylinderGeometry(0.02, 0.02, 0.008, 16), warmLedMat, [lx, baseY + 0.003, zOffset - 0.04], [0, 0, 0], false);
    }
  };

  // =========================================================================
  // ARCHETYPE DISPATCH (16 Bespoke Turkish Mutfak Ankastre 3D CAD Models)
  // =========================================================================
  switch (asset.archetype) {
    case 'tr_bosch_ankastre_set_3':
    case 'tr_siemens_ankastre_set_3':
    case 'tr_vestel_rustik_set_3': {
      const isBosch = asset.archetype === 'tr_bosch_ankastre_set_3';
      const isSiemens = asset.archetype === 'tr_siemens_ankastre_set_3';
      const isVestel = asset.archetype === 'tr_vestel_rustik_set_3';

      // Architectural kitchen plinth + cabinet carcase framing the 60 cm oven & hob
      const cabMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: isVestel ? '#EAE3D4' : '#2A2E35',
          roughness: 0.42,
          metalness: 0.05,
        }),
      );
      const counterMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: isVestel ? '#DDD3C2' : '#E5E7EB',
          roughness: 0.22,
          metalness: 0.04,
        }),
      );
      const splashMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: isVestel ? '#F3EEE4' : '#D5D9DF',
          roughness: 0.28,
          metalness: 0.04,
        }),
      );

      // Plinth kickboard + lower drawer + side cheeks
      addMesh(new THREE.BoxGeometry(0.6, 0.11, 0.52), darkChassisMat, [0, 0.055, -0.02]);
      addMesh(new THREE.BoxGeometry(0.62, 0.13, 0.56), cabMat, [0, 0.175, 0]);
      for (const sx of [-0.305, 0.305]) {
        addMesh(new THREE.BoxGeometry(0.018, 0.62, 0.56), cabMat, [sx, 0.55, 0]);
      }
      // Quartz countertop slab at Y=0.86..0.895
      addMesh(new THREE.BoxGeometry(0.64, 0.036, 0.6), counterMat, [0, 0.878, 0.01]);
      // Thin architectural backsplash panel behind hob & hood so wall hood sits cleanly
      addMesh(new THREE.BoxGeometry(0.64, 1.0, 0.024), splashMat, [0, 1.38, -0.28]);

      // 1. Built-in Oven (Y=0.24..0.835)
      buildOvenUnit(0.24, isBosch ? 'bosch-s6' : isSiemens ? 'siemens-iq500' : 'vestel-rustic', 0.015);

      // 2. Hob flush on countertop (Bosch & Vestel use 4-burner gas glass hob; Siemens iQ500 uses FlexInduction)
      if (isBosch || isVestel) {
        buildGasHob60(0.852, 0.01, accentMat);
      } else {
        buildInductionHob60(0.854, 0.01);
      }

      // 3. Wall Hood mounted at exact Turkish standard 65 cm clearance above hob (Y=1.52)
      if (isVestel) {
        buildRusticPyramidHood(1.52, -0.11);
      } else {
        buildAngledGlassHood(1.48, isBosch ? 'BOSCH' : 'SIEMENS', -0.17);
      }
      break;
    }

    case 'tr_bosch_serie8_oven': {
      buildOvenUnit(0, 'bosch-s8', 0);
      break;
    }

    case 'tr_siemens_iq700_oven': {
      buildOvenUnit(0, 'siemens-iq700', 0);
      break;
    }

    case 'tr_vestel_builtin_oven': {
      buildOvenUnit(0, 'vestel-rustic', 0);
      break;
    }

    case 'tr_builtin_microwave': {
      const W = 0.595;
      const H = 0.382;
      const D = 0.385;
      const cy = H / 2;

      // Recessed rear body
      addMesh(new THREE.BoxGeometry(W - 0.04, H - 0.024, D - 0.025), darkChassisMat, [0, cy, -0.012]);
      // Flush outer built-in trim frame
      addMesh(new THREE.BoxGeometry(W, H, 0.022), secondaryMat, [0, cy, D / 2 - 0.011]);
      // Inner primary glass fascia
      addMesh(new THREE.BoxGeometry(W - 0.024, H - 0.024, 0.014), primaryMat, [0, cy, D / 2 - 0.002]);

      // Left viewing window + recessed stainless cavity + glass turntable (cleanly behind outer door glass)
      const winW = 0.36;
      const winH = 0.255;
      const winX = -0.068;
      // Cavity back & bottom wall recessed inside body
      addMesh(new THREE.BoxGeometry(winW, winH, 0.016), cavityEnamelMat, [winX, cy, D / 2 - 0.14]);
      addMesh(new THREE.BoxGeometry(winW, 0.012, 0.13), cavityEnamelMat, [winX, cy - winH / 2 + 0.008, D / 2 - 0.072]);
      // Glass turntable cleanly recessed inside cavity (max Z = D/2 - 0.078 + 0.068 = D/2 - 0.010 < glass at D/2 + 0.006)
      addMesh(new THREE.CylinderGeometry(0.068, 0.068, 0.008, 28), chromeMat, [winX, cy - winH / 2 + 0.018, D / 2 - 0.078]);
      addMesh(new THREE.BoxGeometry(0.055, 0.014, 0.008), warmLedMat, [winX, cy + winH / 2 - 0.02, D / 2 - 0.06], [0, 0, 0], false);
      // Translucent smoked door glass
      addMesh(new THREE.BoxGeometry(winW, winH, 0.007), ovenDoorGlassMat, [winX, cy, D / 2 + 0.006]);

      // Right vertical touch control strip + red/blue digital clock + push-open button
      const ctrlX = 0.205;
      const mwTex = trackTex(
        createCanvasTex(256, 512, options.maxAnisotropy, (ctx, w, h) => {
          ctx.fillStyle = '#0D1016';
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = '#E2E8F0';
          ctx.font = '700 28px "Inter", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('BOSCH', w / 2, 44);
          ctx.fillStyle = '#EF4444';
          ctx.font = '700 54px "JetBrains Mono", monospace';
          ctx.fillText('02:30', w / 2, 134);
          ctx.fillStyle = '#94A3B8';
          ctx.font = '600 22px "Inter", Arial, sans-serif';
          ctx.fillText('900 W · AutoPilot', w / 2, 182);
          for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 2; c++) {
              ctx.strokeStyle = '#64748B';
              ctx.lineWidth = 3;
              ctx.strokeRect(42 + c * 96, 224 + r * 54, 72, 36);
            }
          }
          // Door open icon at bottom
          ctx.fillStyle = '#CBD5E1';
          ctx.fillRect(66, 434, 124, 34);
          ctx.fillStyle = '#0D1016';
          ctx.font = '700 20px "Inter", Arial, sans-serif';
          ctx.fillText('AÇ / OPEN', w / 2, 458);
        }),
      );
      const mwMat = trackMat(new THREE.MeshStandardMaterial({ color: '#FFFFFF', map: mwTex, roughness: 0.14 }));
      addMesh(new THREE.PlaneGeometry(0.13, H - 0.04), mwMat, [ctrlX, cy, D / 2 + 0.007], [0, 0, 0], false);
      // Tactile stainless door-open button strip
      addMesh(new THREE.BoxGeometry(0.09, 0.028, 0.012), accentMat, [ctrlX, 0.06, D / 2 + 0.01]);
      break;
    }

    case 'tr_induction_hob_60': {
      buildInductionHob60(0, 0);
      break;
    }

    case 'tr_gas_glass_hob_60': {
      buildGasHob60(0, 0, accentMat);
      break;
    }

    case 'tr_wok_gas_hob_75': {
      const W = 0.75;
      const D = 0.52;
      addMesh(new THREE.BoxGeometry(W - 0.04, 0.046, D - 0.035), darkChassisMat, [0, 0.023, 0]);
      addMesh(new THREE.BoxGeometry(W, 0.012, D), primaryMat, [0, 0.052, 0]);
      // Side protective steel trim
      for (const sx of [-1, 1]) {
        addMesh(new THREE.BoxGeometry(0.009, 0.014, D + 0.002), accentMat, [sx * (W / 2 - 0.003), 0.052, 0]);
      }

      const topY = 0.058;
      // Central heavy triple-ring Wok burner
      buildGasBurner(0, topY, -0.02, 0.064, true);
      // 4 flanking burners
      buildGasBurner(-0.24, topY, -0.115, 0.04, false);
      buildGasBurner(-0.24, topY, 0.075, 0.034, false);
      buildGasBurner(0.24, topY, -0.115, 0.046, false);
      buildGasBurner(0.24, topY, 0.075, 0.03, false);

      // Continuous cast-iron longitudinal rail bars tying the 3-piece grate together
      for (const gz of [-0.19, 0.14]) {
        addMesh(new THREE.BoxGeometry(W - 0.07, 0.01, 0.01), castIronMat, [0, topY + 0.032, gz]);
      }

      // 5 front ergonomic knobs
      for (let i = 0; i < 5; i++) {
        const kx = -0.24 + i * 0.12;
        addMesh(new THREE.CylinderGeometry(0.019, 0.023, 0.025, 22), accentMat, [kx, topY + 0.012, D / 2 - 0.045]);
        addMesh(new THREE.BoxGeometry(0.008, 0.023, 0.036), accentMat, [kx, topY + 0.023, D / 2 - 0.045]);
      }
      break;
    }

    case 'tr_downdraft_induction_hob': {
      const W = 0.8;
      const D = 0.52;
      // Under-counter downdraft motor & duct housing
      addMesh(new THREE.BoxGeometry(0.54, 0.17, 0.42), darkChassisMat, [0, 0.085, 0]);
      // Rear rectangular exhaust duct outlet
      addMesh(new THREE.BoxGeometry(0.24, 0.09, 0.08), secondaryMat, [0, 0.07, -0.23]);
      // Top frameless vitroceramic glass plate
      addMesh(new THREE.BoxGeometry(W, 0.01, D), primaryMat, [0, 0.175, 0]);

      const ddTex = trackTex(createInductionHobTex('downdraft80', primaryHex, options.maxAnisotropy));
      const ddMat = trackMat(
        new THREE.MeshStandardMaterial({ color: '#FFFFFF', map: ddTex, roughness: 0.08, metalness: 0.12 }),
      );
      addMesh(
        new THREE.PlaneGeometry(W - 0.01, D - 0.01),
        ddMat,
        [0, 0.1806, 0],
        [-Math.PI / 2, 0, 0],
        false,
      );

      // Central flush cast-iron downdraft extraction grille (recessed pocket + 9 slatted fins)
      addMesh(new THREE.BoxGeometry(0.145, 0.016, 0.34), darkChassisMat, [0, 0.178, -0.02]);
      addMesh(new THREE.BoxGeometry(0.155, 0.008, 0.35), accentMat, [0, 0.181, -0.02]);
      addMesh(new THREE.BoxGeometry(0.132, 0.01, 0.325), darkChassisMat, [0, 0.183, -0.02]);
      for (let i = 0; i < 9; i++) {
        const sz = -0.155 + i * 0.034;
        addMesh(new THREE.BoxGeometry(0.128, 0.012, 0.009), castIronMat, [0, 0.188, sz]);
      }
      break;
    }

    case 'tr_angled_glass_hood': {
      buildAngledGlassHood(0, 'SILVERLINE', -0.02);
      break;
    }

    case 'tr_island_t_hood_90': {
      const W = 0.9;
      const D = 0.6;
      // Wide slim T-box canopy
      addMesh(new THREE.BoxGeometry(W, 0.068, D), primaryMat, [0, 0.034, 0]);
      // Upper transition housing
      addMesh(new THREE.BoxGeometry(0.42, 0.06, 0.34), secondaryMat, [0, 0.095, 0]);
      // Tall rectangular ceiling flue chimney
      addMesh(new THREE.BoxGeometry(0.32, 0.82, 0.26), secondaryMat, [0, 0.5, 0]);
      // Ceiling trim collar
      addMesh(new THREE.BoxGeometry(0.36, 0.022, 0.3), accentMat, [0, 0.91, 0]);

      // Front black glass touch control strip
      const touchTex = trackTex(createHoodTouchTex('FRANKE', options.maxAnisotropy));
      const touchMat = trackMat(new THREE.MeshStandardMaterial({ color: '#FFFFFF', map: touchTex, roughness: 0.12 }));
      addMesh(new THREE.PlaneGeometry(0.34, 0.048), touchMat, [0, 0.034, D / 2 + 0.002], [0, 0, 0], false);

      // Underside 3 washable aluminum grease filter cassettes
      for (const fx of [-0.26, 0, 0.26]) {
        addMesh(new THREE.BoxGeometry(0.24, 0.008, 0.42), filterMat, [fx, 0.003, 0]);
      }
      // 4 glowing corner LED task spots
      for (const lx of [-0.36, 0.36]) {
        for (const lz of [-0.21, 0.21]) {
          addMesh(new THREE.CylinderGeometry(0.024, 0.024, 0.008, 16), chromeMat, [lx, 0.003, lz]);
          addMesh(new THREE.CylinderGeometry(0.018, 0.018, 0.009, 16), warmLedMat, [lx, 0.001, lz], [0, 0, 0], false);
        }
      }
      break;
    }

    case 'tr_recessed_cabinet_hood': {
      const W = 0.6;
      const D = 0.29;
      // Flush architectural bottom perimeter bezel
      addMesh(new THREE.BoxGeometry(W, 0.024, D), primaryMat, [0, 0.012, 0]);
      // Upper recessed motor enclosure hidden inside upper cabinet
      addMesh(new THREE.BoxGeometry(W - 0.06, 0.21, D - 0.035), darkChassisMat, [0, 0.125, -0.004]);
      // Standard Ø150 mm circular top exhaust duct collar
      addMesh(new THREE.CylinderGeometry(0.075, 0.075, 0.055, 24), secondaryMat, [0, 0.255, -0.01]);
      // Twin aluminum cassette grease filters on underside
      for (const fx of [-0.14, 0.14]) {
        addMesh(new THREE.BoxGeometry(0.26, 0.008, 0.175), filterMat, [fx, 0.004, 0.01]);
      }
      // Full-width 3000K linear LED light bar along rear underside
      addMesh(new THREE.BoxGeometry(W - 0.08, 0.008, 0.024), warmLedMat, [0, 0.003, -0.105], [0, 0, 0], false);
      // Front capacitive touch strip
      const touchTex = trackTex(createHoodTouchTex('TEKA', options.maxAnisotropy));
      const touchMat = trackMat(new THREE.MeshStandardMaterial({ color: '#FFFFFF', map: touchTex, roughness: 0.12 }));
      addMesh(new THREE.PlaneGeometry(0.24, 0.02), touchMat, [0, 0.012, D / 2 + 0.002], [0, 0, 0], false);
      break;
    }

    case 'tr_builtin_coffee_machine': {
      const W = 0.595;
      const H = 0.455;
      const D = 0.38;
      const cy = H / 2;

      // Rear recessed tall-cabinet chassis (ends at D/2 - 0.145 so the front brewing bay is genuinely hollow!)
      addMesh(new THREE.BoxGeometry(W - 0.036, H - 0.02, D - 0.155), darkChassisMat, [0, cy, -0.075]);
      // Outer side walls extending forward behind the front fascia cheeks
      for (const sx of [-1, 1]) {
        addMesh(new THREE.BoxGeometry(0.115, H - 0.02, 0.14), darkChassisMat, [sx * (W / 2 - 0.065), cy, D / 2 - 0.085]);
      }
      // Front glass/inox surround cheeks & top/bottom fascia framing the open brewing bay
      addMesh(new THREE.BoxGeometry(W, 0.135, 0.024), primaryMat, [0, H - 0.0675, D / 2 - 0.012]);
      addMesh(new THREE.BoxGeometry(W, 0.055, 0.024), primaryMat, [0, 0.0275, D / 2 - 0.012]);
      for (const sx of [-1, 1]) {
        addMesh(new THREE.BoxGeometry(0.12, H - 0.19, 0.024), primaryMat, [sx * (W / 2 - 0.06), 0.19, D / 2 - 0.012]);
      }
      // Hollow recessed brewing bay interior walls (back wall, ceiling, side liners)
      const bayW = W - 0.24;
      const bayH = H - 0.19;
      addMesh(new THREE.BoxGeometry(bayW, bayH, 0.012), cavityEnamelMat, [0, 0.19, D / 2 - 0.142]);
      addMesh(new THREE.BoxGeometry(bayW, 0.012, 0.14), cavityEnamelMat, [0, 0.318, D / 2 - 0.075]);
      for (const sx of [-1, 1]) {
        addMesh(new THREE.BoxGeometry(0.01, bayH, 0.14), cavityEnamelMat, [sx * (bayW / 2 - 0.004), 0.19, D / 2 - 0.075]);
      }

      // Upper color TFT coffee menu + control ring
      const tftTex = trackTex(createCoffeeTftTex(options.maxAnisotropy));
      const tftMat = trackMat(new THREE.MeshStandardMaterial({ color: '#FFFFFF', map: tftTex, roughness: 0.12 }));
      addMesh(new THREE.PlaneGeometry(0.28, 0.088), tftMat, [0, H - 0.068, D / 2 + 0.002], [0, 0, 0], false);
      addMesh(new THREE.TorusGeometry(0.022, 0.004, 14, 28), accentMat, [0.21, H - 0.068, D / 2 + 0.006]);
      addMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.008, 16), coolLedMat, [-0.22, H - 0.068, D / 2 + 0.004], [Math.PI / 2, 0, 0], false);

      // Stainless dual coffee dispenser head + milk frother wand (fully visible inside open bay!)
      addMesh(new THREE.BoxGeometry(0.095, 0.092, 0.068), secondaryMat, [0, 0.268, D / 2 - 0.065]);
      addMesh(new THREE.BoxGeometry(0.098, 0.022, 0.072), accentMat, [0, 0.226, D / 2 - 0.065]);
      for (const sx of [-0.02, 0.02]) {
        addMesh(new THREE.CylinderGeometry(0.006, 0.005, 0.036, 12), chromeMat, [sx, 0.20, D / 2 - 0.055]);
      }
      // Milk frother tube on right
      addMesh(new THREE.CylinderGeometry(0.005, 0.005, 0.08, 10), chromeMat, [0.075, 0.232, D / 2 - 0.062]);
      // Warm cup-bay LED strip
      addMesh(new THREE.BoxGeometry(0.22, 0.009, 0.016), warmLedMat, [0, 0.31, D / 2 - 0.072], [0, 0, 0], false);

      // Slotted stainless drip tray
      addMesh(new THREE.BoxGeometry(bayW - 0.006, 0.024, 0.135), secondaryMat, [0, 0.067, D / 2 - 0.07]);
      addMesh(new THREE.BoxGeometry(bayW - 0.022, 0.004, 0.115), filterMat, [0, 0.08, D / 2 - 0.07]);

      // Two porcelain espresso cups with dark crema for instant scale & luxury read
      const cupMat = trackMat(new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.14 }));
      const coffeeMat = trackMat(new THREE.MeshStandardMaterial({ color: '#3B2314', roughness: 0.22 }));
      for (const cx of [-0.044, 0.044]) {
        addMesh(new THREE.CylinderGeometry(0.028, 0.021, 0.054, 20), cupMat, [cx, 0.109, D / 2 - 0.062]);
        addMesh(new THREE.CylinderGeometry(0.025, 0.025, 0.004, 18), coffeeMat, [cx, 0.134, D / 2 - 0.062]);
        addMesh(
          new THREE.TorusGeometry(0.013, 0.0035, 10, 18),
          cupMat,
          [cx + 0.028, 0.112, D / 2 - 0.062],
        );
      }
      break;
    }

    case 'tr_builtin_fridge_column': {
      const W = 0.6;
      const D = 0.58;
      const H = 1.95;

      // Full-height built-in refrigerator housing
      addMesh(new THREE.BoxGeometry(W, H - 0.1, D - 0.025), secondaryMat, [0, 0.1 + (H - 0.1) / 2, -0.012]);

      // Recessed plinth kickboard with authentic 3D aluminum ventilation grille slats (200 cm² airflow)
      addMesh(new THREE.BoxGeometry(W - 0.01, 0.1, D - 0.07), darkChassisMat, [0, 0.05, -0.025]);
      addMesh(new THREE.BoxGeometry(0.46, 0.068, 0.012), accentMat, [0, 0.05, D / 2 - 0.058]);
      for (let i = 0; i < 6; i++) {
        addMesh(new THREE.BoxGeometry(0.42, 0.005, 0.016), darkChassisMat, [0, 0.026 + i * 0.0095, D / 2 - 0.055]);
      }

      // Lower Freezer Door (32% height: Y=0.102..0.72)
      const freezerH = 0.615;
      addMesh(new THREE.BoxGeometry(W - 0.004, freezerH, 0.022), primaryMat, [0, 0.104 + freezerH / 2, D / 2 - 0.011]);

      // Crisp horizontal Gola shadow-gap channel between freezer & refrigerator doors
      addMesh(new THREE.BoxGeometry(W - 0.008, 0.026, 0.024), accentMat, [0, 0.735, D / 2 - 0.016]);

      // Upper Refrigerator Door (68% height: Y=0.752..1.946)
      const fridgeH = H - 0.754;
      addMesh(new THREE.BoxGeometry(W - 0.004, fridgeH, 0.022), primaryMat, [0, 0.752 + fridgeH / 2, D / 2 - 0.011]);

      // Brushed full-height vertical profile handles on left door edge
      addMesh(new THREE.BoxGeometry(0.016, 0.42, 0.026), accentMat, [-W / 2 + 0.036, 0.99, D / 2 + 0.012]);
      addMesh(new THREE.BoxGeometry(0.016, 0.28, 0.026), accentMat, [-W / 2 + 0.036, 0.54, D / 2 + 0.012]);

      // Subtle cool-white interior LED glow peeking at upper ventilation reveal + Bosch/Siemens top badge
      addMesh(new THREE.BoxGeometry(W - 0.04, 0.007, 0.008), coolLedMat, [0, H - 0.006, D / 2 - 0.016], [0, 0, 0], false);
      const badgeTex = trackTex(
        createCanvasTex(256, 64, options.maxAnisotropy, (ctx, w, h) => {
          ctx.fillStyle = '#141820';
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = '#E2E8F0';
          ctx.font = '700 22px "Inter", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('NO-FROST  4°C', w / 2, 40);
        }),
      );
      const badgeMat = trackMat(new THREE.MeshStandardMaterial({ color: '#FFFFFF', map: badgeTex, roughness: 0.2 }));
      addMesh(new THREE.PlaneGeometry(0.14, 0.024), badgeMat, [0, 0.735, D / 2 - 0.003], [0, 0, 0], false);
      break;
    }
  }

  return {
    group,
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
