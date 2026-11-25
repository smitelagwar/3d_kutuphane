import * as THREE from 'three';
import type { ArchitecturalAsset, MaterialFinish } from '../lib/catalogTypes';

export interface ProceduralBuildResult {
  group: THREE.Group;
  dispose: () => void;
}

export const TURKISH_ELECTRICAL_LIGHTING_ARCHETYPES = new Set<string>([
  'tr_surface_fuse_box',
  'tr_mcb_breaker_set',
  'tr_weak_current_panel',
  'tr_rack_cabinet_9u',
  'tr_recessed_spot_round',
  'tr_gimbal_double_spot',
  'tr_led_downlight_panel',
  'tr_cove_led_strip',
  'tr_linear_recessed_led',
  'tr_tiered_ring_chandelier',
  'tr_linear_globe_chandelier',
  'tr_cascade_stair_chandelier',
  'tr_wall_sconce_updown',
]);

export function isTurkishElectricalLightingArchetype(archetype: string): boolean {
  return TURKISH_ELECTRICAL_LIGHTING_ARCHETYPES.has(archetype);
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

function createWordmarkTex(
  text: string,
  color: string,
  maxAnisotropy: number,
  subtitle?: string,
): THREE.CanvasTexture {
  return createCanvasTex(512, 160, maxAnisotropy, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.font = '800 60px "Inter", "Segoe UI", Arial, sans-serif';
    ctx.fillText(text, w / 2, subtitle ? h * 0.4 : h * 0.52);
    if (subtitle) {
      ctx.font = '600 24px "Inter", "Segoe UI", Arial, sans-serif';
      ctx.globalAlpha = 0.86;
      ctx.fillText(subtitle, w / 2, h * 0.76);
    }
  });
}

export function buildTurkishElectricalLightingMesh(
  asset: ArchitecturalAsset,
  finish: MaterialFinish,
  options: { maxAnisotropy: number },
): ProceduralBuildResult {
  const group = new THREE.Group();
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometriesToDispose.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materialsToDispose.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    texturesToDispose.push(t);
    return t;
  };

  const addMesh = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    pos: [number, number, number] = [0, 0, 0],
    rot: [number, number, number] = [0, 0, 0],
    castShadow = true,
  ) => {
    const m = new THREE.Mesh(trackGeo(geo), mat);
    m.position.set(pos[0], pos[1], pos[2]);
    m.rotation.set(rot[0], rot[1], rot[2]);
    m.castShadow = castShadow;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };

  const pf = finish.partFinishes;
  const primaryHex = pf?.primary?.hex || finish.primaryHex || '#F3F4F6';
  const secondaryHex = pf?.secondary?.hex || finish.secondaryHex || '#374151';
  const accentHex = pf?.accent?.hex || finish.accentHex || '#FFE4B5';
  const primaryRough = pf?.primary?.roughness ?? finish.roughness ?? 0.3;
  const primaryMetal = pf?.primary?.metalness ?? finish.metalness ?? 0.35;
  const secondaryRough = pf?.secondary?.roughness ?? 0.35;
  const secondaryMetal = pf?.secondary?.metalness ?? 0.3;
  const accentRough = pf?.accent?.roughness ?? 0.25;
  const accentMetal = pf?.accent?.metalness ?? 0.4;

  const makePrimaryMat = () =>
    trackMat(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(primaryHex),
        roughness: primaryRough,
        metalness: primaryMetal,
        clearcoat: primaryMetal < 0.25 ? 0.28 : 0.12,
      }),
    );
  const makeSecondaryMat = () =>
    trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(secondaryHex),
        roughness: secondaryRough,
        metalness: secondaryMetal,
      }),
    );
  const makeAccentMat = () =>
    trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(accentHex),
        roughness: accentRough,
        metalness: accentMetal,
      }),
    );
  const makeLedEmissiveMat = (intensity = 1.65) =>
    trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(accentHex),
        emissive: new THREE.Color(accentHex),
        emissiveIntensity: intensity,
        roughness: 0.14,
        metalness: 0.0,
      }),
    );

  const w = asset.dimensionsCm.width / 100;
  const d = asset.dimensionsCm.depth / 100;
  const h = asset.dimensionsCm.height / 100;

  // ============================================================================
  // 1. Viko 12'li Sıva Üstü Sigorta Kutusu (IP40)
  // ============================================================================
  if (asset.archetype === 'tr_surface_fuse_box') {
    const bodyMat = makePrimaryMat();
    const innerMat = makeSecondaryMat();
    const accentMat = makeAccentMat();
    const darkMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#1E242D', roughness: 0.58, metalness: 0.25 }),
    );
    const dinRailMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#9CA3AF', roughness: 0.26, metalness: 0.88 }),
    );
    const breakerMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#EEF1F5', roughness: 0.3, metalness: 0.05 }),
    );
    const copperMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#C27438', roughness: 0.24, metalness: 0.92 }),
    );
    const neutralMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#2563EB', roughness: 0.35, metalness: 0.15 }),
    );
    const glassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(pf?.glass?.hex || '#374151'),
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
        roughness: 0.07,
        clearcoat: 1.0,
      }),
    );

    // Full surface-mounted ABS enclosure sitting forward from wall (Z=0..d)
    const wallT = 0.012;
    const boxD = d * 0.78;
    addMesh(new THREE.BoxGeometry(w, h, wallT), bodyMat, [0, h / 2, wallT / 2]);
    addMesh(new THREE.BoxGeometry(w, wallT, boxD), bodyMat, [0, h - wallT / 2, boxD / 2]);
    addMesh(new THREE.BoxGeometry(w, wallT, boxD), bodyMat, [0, wallT / 2, boxD / 2]);
    addMesh(new THREE.BoxGeometry(wallT, h, boxD), bodyMat, [-w / 2 + wallT / 2, h / 2, boxD / 2]);
    addMesh(new THREE.BoxGeometry(wallT, h, boxD), bodyMat, [w / 2 - wallT / 2, h / 2, boxD / 2]);

    // Front cover shroud with central DIN cutout
    addMesh(new THREE.BoxGeometry(w, 0.055, 0.014), bodyMat, [0, h - 0.0275, boxD]);
    addMesh(new THREE.BoxGeometry(w, 0.052, 0.014), bodyMat, [0, 0.026, boxD]);
    addMesh(new THREE.BoxGeometry(0.024, h, 0.014), bodyMat, [-w / 2 + 0.012, h / 2, boxD]);
    addMesh(new THREE.BoxGeometry(0.024, h, 0.014), bodyMat, [w / 2 - 0.012, h / 2, boxD]);
    addMesh(new THREE.BoxGeometry(w - 0.028, h - 0.028, 0.008), innerMat, [0, h / 2, boxD * 0.45]);

    // Top & bottom PG16/M20 cable glands (distinctive sıva üstü signature)
    for (const gx of [-w * 0.28, 0, w * 0.28]) {
      addMesh(new THREE.CylinderGeometry(0.011, 0.012, 0.018, 16), darkMat, [gx, h + 0.009, boxD * 0.42]);
      addMesh(new THREE.CylinderGeometry(0.009, 0.009, 0.012, 14), darkMat, [gx, -0.006, boxD * 0.42]);
    }

    // Copper PE bar & Blue Neutral N terminal bar at top interior
    addMesh(new THREE.BoxGeometry(w * 0.34, 0.01, 0.012), copperMat, [-w * 0.2, h - 0.036, boxD * 0.64]);
    addMesh(new THREE.BoxGeometry(w * 0.34, 0.01, 0.012), neutralMat, [w * 0.2, h - 0.036, boxD * 0.64]);

    // 12-module 35mm DIN rail + 12 modular breakers (2P 30mA RCCB + 10x MCB)
    const railY = h * 0.5;
    addMesh(new THREE.BoxGeometry(w - 0.05, 0.072, 0.01), darkMat, [0, railY, boxD * 0.56]);
    addMesh(new THREE.BoxGeometry(w - 0.056, 0.028, 0.008), dinRailMat, [0, railY, boxD * 0.62]);
    const cols = 12;
    const modW = (w - 0.062) / cols;
    const startX = -(w - 0.062) / 2 + modW / 2;
    for (let c = 0; c < cols; c++) {
      const cx = startX + c * modW;
      const isRccb = c < 2;
      addMesh(new THREE.BoxGeometry(modW * 0.88, 0.068, 0.034), breakerMat, [cx, railY, boxD * 0.78]);
      addMesh(
        new THREE.BoxGeometry(modW * 0.55, 0.014, 0.015),
        isRccb ? accentMat : darkMat,
        [cx, railY + 0.008, boxD + 0.002],
        [-0.36, 0, 0],
      );
      const indMat = trackMat(new THREE.MeshBasicMaterial({ color: isRccb ? '#EF4444' : '#22C55E' }));
      addMesh(new THREE.BoxGeometry(modW * 0.36, 0.005, 0.002), indMat, [cx, railY + 0.024, boxD + 0.001]);
    }

    // Circuit label strip below DIN row
    const stripTex = trackTex(
      createCanvasTex(512, 48, options.maxAnisotropy, (ctx, lw, lh) => {
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(0, 0, lw, lh);
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, lw - 2, lh - 2);
        ctx.fillStyle = '#1E293B';
        ctx.font = '700 13px "Inter", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const pad = 16;
        const innerW = lw - pad * 2;
        ['RCD 30mA', 'ANA', 'KOMBİ', 'PRİZ', 'AYDINL.', 'BAHÇE'].forEach((lbl, i, arr) => {
          ctx.fillText(lbl, pad + ((i + 0.5) / arr.length) * innerW, lh / 2);
        });
      }),
    );
    addMesh(
      new THREE.PlaneGeometry(w - 0.056, 0.019),
      trackMat(new THREE.MeshBasicMaterial({ map: stripTex })),
      [0, railY - 0.048, boxD + 0.008],
    );

    // Hinged smoked polycarbonate flip cover slightly protruding at front
    addMesh(new THREE.BoxGeometry(w - 0.018, h - 0.052, 0.008), glassMat, [0, h * 0.455, d - 0.005]);
    addMesh(new THREE.BoxGeometry(0.055, 0.01, 0.01), bodyMat, [0, 0.025, d]);

    // Top VIKO IP40 wordmark
    const vCol = getLuminance(primaryHex) > 0.45 ? '#1E293B' : '#F8FAFC';
    const vTex = trackTex(createWordmarkTex('VIKO', vCol, options.maxAnisotropy, 'IP40 · SIVA ÜSTÜ 12M'));
    addMesh(
      new THREE.PlaneGeometry(0.115, 0.03),
      trackMat(new THREE.MeshBasicMaterial({ map: vTex, transparent: true, depthWrite: false })),
      [0, h - 0.024, boxD + 0.009],
    );
  }

  // ============================================================================
  // 2. Siemens 5SL6 / Schneider Easy9 DIN Ray Otomat, 30mA Kaçak Akım & Parafudr Seti
  // ============================================================================
  else if (asset.archetype === 'tr_mcb_breaker_set') {
    const bodyMat = makePrimaryMat();
    const dinRailMat = makeSecondaryMat();
    const accentMat = makeAccentMat();
    const darkLeverMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.34, metalness: 0.16 }),
    );
    const yellowTestMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#FACC15', roughness: 0.32, metalness: 0.05 }),
    );
    const spdGreenMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#16A34A', roughness: 0.3, metalness: 0.1 }),
    );
    const copperBusMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#C87533', roughness: 0.22, metalness: 0.94 }),
    );
    const screwMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#CBD5E1', roughness: 0.22, metalness: 0.92 }),
    );

    // 35mm TS35 slotted steel DIN rail spanning full width at rear
    addMesh(new THREE.BoxGeometry(w, 0.035, 0.008), dinRailMat, [0, h * 0.5, 0.006]);
    addMesh(new THREE.BoxGeometry(w, 0.006, 0.012), dinRailMat, [0, h * 0.5 + 0.017, 0.01]);
    addMesh(new THREE.BoxGeometry(w, 0.006, 0.012), dinRailMat, [0, h * 0.5 - 0.017, 0.01]);

    // 11 standard 18mm DIN modules:
    // [0..2]: 3P C40 Main Breaker | [3..4]: 2P 40A 30mA RCCB | [5..8]: 4x 1P MCB (B16,B16,C16,C25) | [9..10]: 2P SPD Parafudr
    const modW = 0.018;
    const modCount = 11;
    const startX = -((modCount - 1) * modW) / 2;

    const moduleDefs = [
      { label: 'C40', sub: '6kA', kind: 'main' },
      { label: 'C40', sub: '3P', kind: 'main' },
      { label: 'C40', sub: '400V', kind: 'main' },
      { label: '40A', sub: '30mA', kind: 'rccb' },
      { label: 'RCCB', sub: 'TEST', kind: 'rccb' },
      { label: 'B16', sub: '6kA', kind: 'mcb' },
      { label: 'B16', sub: '6kA', kind: 'mcb' },
      { label: 'C16', sub: '6kA', kind: 'mcb' },
      { label: 'C25', sub: '6kA', kind: 'mcb' },
      { label: 'SPD', sub: 'T2', kind: 'spd' },
      { label: '275V', sub: '20kA', kind: 'spd' },
    ];

    moduleDefs.forEach((def, idx) => {
      const mx = startX + idx * modW;
      // Stepped DIN breaker housing (deep base + central raised front nose)
      addMesh(new THREE.BoxGeometry(modW - 0.0012, h * 0.86, 0.046), bodyMat, [mx, h * 0.5, 0.032]);
      addMesh(new THREE.BoxGeometry(modW - 0.0012, h * 0.48, 0.022), bodyMat, [mx, h * 0.5, 0.064]);

      // Top & bottom recessed brass/zinc terminal screws
      for (const sy of [h * 0.84, h * 0.16]) {
        addMesh(new THREE.CylinderGeometry(0.0032, 0.0032, 0.008, 12), screwMat, [mx, sy, 0.044]);
      }

      // Crisp micro faceplate label per module
      const faceTex = trackTex(
        createCanvasTex(128, 256, options.maxAnisotropy, (ctx, fw, fh) => {
          ctx.fillStyle = primaryHex;
          ctx.fillRect(0, 0, fw, fh);
          ctx.fillStyle = '#0F172A';
          ctx.textAlign = 'center';
          ctx.font = '800 34px "JetBrains Mono", monospace';
          ctx.fillText(def.label, fw / 2, 46);
          ctx.fillStyle = '#475569';
          ctx.font = '700 22px "Inter", Arial, sans-serif';
          ctx.fillText(def.sub, fw / 2, 82);
          // Status indicator strip (Green OK for SPD, Red ON for breakers)
          ctx.fillStyle = def.kind === 'spd' ? '#16A34A' : '#DC2626';
          ctx.fillRect(28, 108, fw - 56, 20);
        }),
      );
      addMesh(
        new THREE.PlaneGeometry(modW - 0.002, h * 0.44),
        trackMat(new THREE.MeshBasicMaterial({ map: faceTex })),
        [mx, h * 0.5, 0.0755],
      );

      // Toggle levers & RCCB yellow TEST button & SPD replaceable cartridge
      if (def.kind === 'mcb') {
        addMesh(
          new THREE.BoxGeometry(modW * 0.62, 0.011, 0.016),
          darkLeverMat,
          [mx, h * 0.44, 0.08],
          [-0.38, 0, 0],
        );
      } else if (def.kind === 'spd') {
        addMesh(new THREE.BoxGeometry(modW * 0.72, 0.014, 0.006), spdGreenMat, [mx, h * 0.36, 0.077]);
      }
    });

    // Coupled 3-pole C40 main breaker bar lever (spanning modules 0..2)
    addMesh(
      new THREE.BoxGeometry(modW * 2.8, 0.012, 0.018),
      accentMat,
      [startX + modW, h * 0.44, 0.081],
      [-0.38, 0, 0],
    );
    // Coupled 2-pole 30mA RCCB lever + yellow TEST button (spanning modules 3..4)
    addMesh(
      new THREE.BoxGeometry(modW * 1.75, 0.012, 0.018),
      accentMat,
      [startX + modW * 3.5, h * 0.44, 0.081],
      [-0.38, 0, 0],
    );
    addMesh(
      new THREE.BoxGeometry(0.009, 0.011, 0.008),
      yellowTestMat,
      [startX + modW * 4, h * 0.62, 0.078],
    );

    // Bottom insulated copper comb busbar (tarak bara) linking the breakers
    addMesh(new THREE.BoxGeometry(modW * 9, 0.012, 0.01), copperBusMat, [startX + modW * 4, h * 0.07, 0.044]);
  }

  // ============================================================================
  // 3. Schneider Pragma / Estap Sıva Altı Data, Fiber & Multimedia Zayıf Akım Panosu
  // ============================================================================
  else if (asset.archetype === 'tr_weak_current_panel') {
    const frameMat = makePrimaryMat();
    const darkMetalMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#1E242E', roughness: 0.42, metalness: 0.55 }),
    );
    const backPlateMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#D1D7E0', roughness: 0.42, metalness: 0.5 }),
    );
    const ontWhiteMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.22, metalness: 0.05 }),
    );
    const splitterMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#B8C0CC', roughness: 0.26, metalness: 0.88 }),
    );
    const bluePatchMat = trackMat(new THREE.MeshStandardMaterial({ color: '#2563EB', roughness: 0.5 }));
    const yellowPatchMat = trackMat(new THREE.MeshStandardMaterial({ color: '#EAB308', roughness: 0.5 }));
    const ledGreenMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#22C55E', emissive: '#22C55E', emissiveIntensity: 1.5 }),
    );
    const ledAmberMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#F59E0B', emissive: '#F59E0B', emissiveIntensity: 1.4 }),
    );
    const glassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#E2E8F0'),
        roughness: 0.06,
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
        clearcoat: 1.0,
      }),
    );

    // Hollow flush-mount enclosure (backplate + 4 side walls + outer flange)
    const wallT = 0.014;
    const cavD = d - 0.018;
    addMesh(new THREE.BoxGeometry(w - 0.02, h - 0.02, wallT), backPlateMat, [0, h / 2, wallT / 2]);
    addMesh(new THREE.BoxGeometry(w - 0.02, wallT, cavD), frameMat, [0, h - 0.01 - wallT / 2, cavD / 2]);
    addMesh(new THREE.BoxGeometry(w - 0.02, wallT, cavD), frameMat, [0, 0.01 + wallT / 2, cavD / 2]);
    addMesh(new THREE.BoxGeometry(wallT, h - 0.02, cavD), frameMat, [-w / 2 + 0.01 + wallT / 2, h / 2, cavD / 2]);
    addMesh(new THREE.BoxGeometry(wallT, h - 0.02, cavD), frameMat, [w / 2 - 0.01 - wallT / 2, h / 2, cavD / 2]);

    // Front architectural rim frame
    const rim = 0.036;
    addMesh(new THREE.BoxGeometry(w, rim * 1.15, 0.018), frameMat, [0, h - rim * 0.575, d - 0.01]);
    addMesh(new THREE.BoxGeometry(w, rim * 0.85, 0.018), frameMat, [0, rim * 0.425, d - 0.01]);
    addMesh(new THREE.BoxGeometry(rim * 0.8, h, 0.018), frameMat, [-w / 2 + rim * 0.4, h / 2, d - 0.01]);
    addMesh(new THREE.BoxGeometry(rim * 0.8, h, 0.018), frameMat, [w / 2 - rim * 0.4, h / 2, d - 0.01]);

    // 1. TOP BAY: 12-Port Cat6A RJ45 Patch Panel
    const patchY = h * 0.81;
    addMesh(new THREE.BoxGeometry(w * 0.78, 0.048, 0.048), darkMetalMat, [0, patchY, 0.045]);
    for (let p = 0; p < 12; p++) {
      const px = -w * 0.32 + (p / 11) * (w * 0.64);
      addMesh(new THREE.BoxGeometry(0.014, 0.014, 0.008), splitterMat, [px, patchY, 0.07]);
      // Plugged-in blue & yellow Cat6A patch cords looping down to the switch
      if (p < 8) {
        addMesh(
          new THREE.CylinderGeometry(0.003, 0.003, 0.125, 8),
          p % 3 === 0 ? yellowPatchMat : bluePatchMat,
          [px, patchY - 0.068, 0.075],
        );
      }
    }

    // 2. UPPER-MID BAY: 8-Port Gigabit PoE Network Switch with live green/amber link LEDs
    const swY = h * 0.62;
    addMesh(new THREE.BoxGeometry(w * 0.76, 0.046, 0.065), darkMetalMat, [0, swY, 0.052]);
    for (let p = 0; p < 8; p++) {
      const px = -w * 0.28 + (p / 7) * (w * 0.48);
      addMesh(new THREE.BoxGeometry(0.013, 0.012, 0.008), splitterMat, [px, swY - 0.005, 0.086]);
      addMesh(
        new THREE.BoxGeometry(0.005, 0.004, 0.004),
        p % 2 === 0 ? ledGreenMat : ledAmberMat,
        [px, swY + 0.012, 0.086],
      );
    }

    // 3. LOWER-MID BAY: White Fiber ONT Modem (left) + 8-Way Coaxial TV/SAT Splitter (right)
    const midY = h * 0.4;
    addMesh(new THREE.BoxGeometry(w * 0.42, 0.125, 0.042), ontWhiteMat, [-w * 0.17, midY, 0.04]);
    for (let l = 0; l < 4; l++) {
      addMesh(new THREE.SphereGeometry(0.003, 8, 8), ledGreenMat, [-w * 0.28 + l * 0.022, midY + 0.036, 0.063]);
    }
    const ontTex = trackTex(createWordmarkTex('FIBER ONT', '#0284C7', options.maxAnisotropy, 'GPON 1000 Mbps'));
    addMesh(
      new THREE.PlaneGeometry(0.14, 0.04),
      trackMat(new THREE.MeshBasicMaterial({ map: ontTex, transparent: true, depthWrite: false })),
      [-w * 0.17, midY - 0.01, 0.0625],
    );

    // 8-way metallic F-connector TV/Satellite splitter on right
    addMesh(new THREE.BoxGeometry(w * 0.28, 0.11, 0.032), splitterMat, [w * 0.22, midY, 0.036]);
    for (let f = 0; f < 4; f++) {
      addMesh(new THREE.CylinderGeometry(0.005, 0.005, 0.018, 10), splitterMat, [w * 0.14 + f * 0.028, midY - 0.062, 0.036]);
    }

    // 4. BOTTOM BAY: 3-Way Schuko Power Distribution Strip (PDU)
    const pduY = h * 0.16;
    addMesh(new THREE.BoxGeometry(w * 0.72, 0.058, 0.044), ontWhiteMat, [0, pduY, 0.042]);
    for (const sx of [-0.085, 0, 0.085]) {
      addMesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.01, 20),
        darkMetalMat,
        [sx, pduY, 0.062],
        [Math.PI / 2, 0, 0],
      );
    }

    // Clear viewing door glass + top ZAYIF AKIM header badge
    addMesh(new THREE.BoxGeometry(w - rim * 1.6, h - rim * 2.0, 0.005), glassMat, [0, h / 2 - 0.006, d - 0.004]);
    const headCol = getLuminance(primaryHex) > 0.45 ? '#0F172A' : '#F8FAFC';
    const headTex = trackTex(createWordmarkTex('ZAYIF AKIM', headCol, options.maxAnisotropy, 'FİBER · RJ45 · TV'));
    addMesh(
      new THREE.PlaneGeometry(w * 0.56, 0.028),
      trackMat(new THREE.MeshBasicMaterial({ map: headTex, transparent: true, depthWrite: false })),
      [0, h - rim * 0.58, d + 0.002],
    );
  }

  // ============================================================================
  // 4. Estap / Canovate 9U Duvar Tipi 19" Rack Kabinet
  // ============================================================================
  else if (asset.archetype === 'tr_rack_cabinet_9u') {
    const steelMat = makePrimaryMat();
    const railMat = makeSecondaryMat();
    const deviceMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#181C24', roughness: 0.36, metalness: 0.62 }),
    );
    const chromeMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#D1D5DB', roughness: 0.16, metalness: 0.94 }),
    );
    const ledGreenMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#22C55E', emissive: '#22C55E', emissiveIntensity: 1.5 }),
    );
    const ledBlueMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#38BDF8', emissive: '#38BDF8', emissiveIntensity: 1.4 }),
    );
    const glassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#334155'),
        roughness: 0.06,
        metalness: 0.08,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        clearcoat: 1.0,
      }),
    );

    // Hollow 9U steel wall cabinet shell
    const wallT = 0.016;
    addMesh(new THREE.BoxGeometry(w, h, wallT), steelMat, [0, h / 2, -d / 2 + wallT / 2]);
    addMesh(new THREE.BoxGeometry(w, wallT, d), steelMat, [0, h - wallT / 2, 0]);
    addMesh(new THREE.BoxGeometry(w, wallT, d), steelMat, [0, wallT / 2, 0]);
    addMesh(new THREE.BoxGeometry(wallT, h, d), steelMat, [-w / 2 + wallT / 2, h / 2, 0]);
    addMesh(new THREE.BoxGeometry(wallT, h, d), steelMat, [w / 2 - wallT / 2, h / 2, 0]);

    // Front door steel frame + tempered tinted glass window + chrome cam lock
    const rim = 0.048;
    addMesh(new THREE.BoxGeometry(w, rim, 0.018), steelMat, [0, h - rim / 2, d / 2 - 0.008]);
    addMesh(new THREE.BoxGeometry(w, rim * 0.8, 0.018), steelMat, [0, rim * 0.4, d / 2 - 0.008]);
    addMesh(new THREE.BoxGeometry(rim, h, 0.018), steelMat, [-w / 2 + rim / 2, h / 2, d / 2 - 0.008]);
    addMesh(new THREE.BoxGeometry(rim, h, 0.018), steelMat, [w / 2 - rim / 2, h / 2, d / 2 - 0.008]);
    addMesh(new THREE.BoxGeometry(w - rim * 2, h - rim * 1.8, 0.005), glassMat, [0, h / 2 - 0.005, d / 2 - 0.004]);
    addMesh(new THREE.CylinderGeometry(0.011, 0.011, 0.016, 16), chromeMat, [w / 2 - rim / 2, h * 0.5, d / 2 + 0.006], [Math.PI / 2, 0, 0]);

    // Internal 19" vertical mounting rails (48.2 cm width)
    const rackW = 0.482;
    for (const rx of [-rackW / 2, rackW / 2]) {
      addMesh(new THREE.BoxGeometry(0.018, h - 0.06, 0.022), railMat, [rx, h / 2, d / 2 - 0.085]);
    }

    // 19" Rack Devices stacked inside: 1U Patch Panel, 1U Organizer, 1U 24-Port PoE Switch, 2U NVR, 1U PDU
    const slotYs = [
      { y: h * 0.8, uh: 0.044, kind: 'patch' },
      { y: h * 0.69, uh: 0.044, kind: 'switch' },
      { y: h * 0.5, uh: 0.088, kind: 'nvr' },
      { y: h * 0.24, uh: 0.044, kind: 'pdu' },
    ];
    for (const s of slotYs) {
      addMesh(new THREE.BoxGeometry(rackW - 0.01, s.uh, d * 0.62), deviceMat, [0, s.y, 0.01]);
      if (s.kind === 'switch') {
        for (let p = 0; p < 16; p++) {
          const px = -0.19 + (p / 15) * 0.34;
          addMesh(new THREE.BoxGeometry(0.011, 0.01, 0.006), chromeMat, [px, s.y - 0.006, 0.01 + d * 0.313]);
          addMesh(new THREE.BoxGeometry(0.004, 0.004, 0.004), p % 3 === 0 ? ledBlueMat : ledGreenMat, [px, s.y + 0.01, 0.01 + d * 0.314]);
        }
      } else if (s.kind === 'patch') {
        for (let p = 0; p < 16; p++) {
          const px = -0.19 + (p / 15) * 0.38;
          addMesh(new THREE.BoxGeometry(0.012, 0.012, 0.006), chromeMat, [px, s.y, 0.01 + d * 0.313]);
        }
      } else if (s.kind === 'nvr') {
        addMesh(new THREE.BoxGeometry(0.14, 0.022, 0.006), ledBlueMat, [-0.12, s.y, 0.01 + d * 0.313]);
      } else if (s.kind === 'pdu') {
        for (let o = 0; o < 6; o++) {
          addMesh(
            new THREE.CylinderGeometry(0.013, 0.013, 0.008, 16),
            railMat,
            [-0.15 + o * 0.056, s.y, 0.01 + d * 0.313],
            [Math.PI / 2, 0, 0],
          );
        }
      }
    }

    // ESTAP 9U top front header wordmark
    const eCol = getLuminance(primaryHex) > 0.45 ? '#0F172A' : '#F8FAFC';
    const eTex = trackTex(createWordmarkTex('ESTAP · 9U', eCol, options.maxAnisotropy, '19" DATA / NVR RACK'));
    addMesh(
      new THREE.PlaneGeometry(0.22, 0.036),
      trackMat(new THREE.MeshBasicMaterial({ map: eTex, transparent: true, depthWrite: false })),
      [0, h - rim / 2, d / 2 + 0.004],
    );
  }

  // ============================================================================
  // 5. Jupiter / Pelsan Anti-Glare Alçıpan Gömme LED Spot (Ø9 cm)
  // ============================================================================
  else if (asset.archetype === 'tr_recessed_spot_round') {
    const trimMat = makePrimaryMat();
    const baffleMat = makeSecondaryMat();
    const ledMat = makeLedEmissiveMat(2.2);
    const heatsinkMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#4B5563', roughness: 0.36, metalness: 0.78 }),
    );
    const springMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#E2E8F0', roughness: 0.2, metalness: 0.92 }),
    );

    // Showcase pivot angled cleanly toward viewer so BOTH glowing anti-glare COB optics
    // AND rear finned aluminum heatsink + red spring retention clips are immediately visible
    const spotGroup = new THREE.Group();
    spotGroup.position.set(0, 0.056, 0);
    spotGroup.rotation.set(-Math.PI * 0.68, 0, 0);
    group.add(spotGroup);

    const addSpot = (
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      pos: [number, number, number],
      rot: [number, number, number] = [0, 0, 0],
      cast = true,
    ) => {
      const m = new THREE.Mesh(trackGeo(geo), mat);
      m.position.set(...pos);
      m.rotation.set(...rot);
      m.castShadow = cast;
      m.receiveShadow = true;
      spotGroup.add(m);
      return m;
    };

    const outerR = w / 2;
    const innerR = outerR * 0.72;

    // Outer circular ceiling trim flange ring (hollow appearance via torus + outer step)
    addSpot(new THREE.TorusGeometry(outerR * 0.86, outerR * 0.14, 14, 40), trimMat, [0, 0.004, 0], [Math.PI / 2, 0, 0]);
    // Deep anti-glare conical baffle housing
    addSpot(new THREE.CylinderGeometry(innerR * 0.62, innerR * 0.95, 0.04, 36, 1, true), baffleMat, [0, 0.024, 0]);
    // Outer upper fixture cylinder shell
    addSpot(new THREE.CylinderGeometry(outerR * 0.82, outerR * 0.82, 0.04, 32, 1, true), trimMat, [0, 0.026, 0]);

    // Recessed glowing 3000K COB optical lens + TIR glass reflector ring inside the deep baffle
    addSpot(new THREE.CylinderGeometry(innerR * 0.56, innerR * 0.56, 0.008, 28), ledMat, [0, 0.032, 0], [0, 0, 0], false);
    addSpot(new THREE.TorusGeometry(innerR * 0.84, 0.0038, 10, 36), baffleMat, [0, 0.006, 0], [Math.PI / 2, 0, 0]);

    // Die-cast radial aluminum heatsink crown on top (above ceiling plenum)
    addSpot(new THREE.CylinderGeometry(outerR * 0.74, outerR * 0.78, 0.034, 28), heatsinkMat, [0, 0.06, 0]);
    for (let f = 0; f < 10; f++) {
      const ang = (f / 10) * Math.PI;
      addSpot(new THREE.BoxGeometry(outerR * 1.56, 0.03, 0.003), heatsinkMat, [0, 0.061, 0], [0, ang, 0]);
    }

    // Twin spring-loaded drywall retention butterfly clips on left & right
    for (const sx of [-1, 1]) {
      addSpot(
        new THREE.BoxGeometry(0.004, 0.042, 0.012),
        springMat,
        [sx * (outerR * 0.88), 0.042, 0],
        [0, 0, sx * -0.45],
      );
      addSpot(
        new THREE.BoxGeometry(0.016, 0.005, 0.012),
        trackMat(new THREE.MeshStandardMaterial({ color: '#DC2626', roughness: 0.45 })),
        [sx * (outerR * 1.05), 0.058, 0],
      );
    }
  }

  // ============================================================================
  // 6. Pelsan / Ack İkili Hareketli (Kardan/Gimbal) Kare Alçıpan Spot (22×12 cm)
  // ============================================================================
  else if (asset.archetype === 'tr_gimbal_double_spot') {
    const frameMat = makePrimaryMat();
    const gimbalMat = makeSecondaryMat();
    const ledMat = makeLedEmissiveMat(2.2);
    const darkCavityMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#14171D', roughness: 0.65, metalness: 0.35 }),
    );
    const heatsinkMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#4B5563', roughness: 0.38, metalness: 0.78 }),
    );

    const gimbalGroup = new THREE.Group();
    gimbalGroup.position.set(0, 0.068, 0);
    gimbalGroup.rotation.set(-Math.PI * 0.68, 0, 0);
    group.add(gimbalGroup);

    const addGim = (
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      pos: [number, number, number],
      rot: [number, number, number] = [0, 0, 0],
      cast = true,
    ) => {
      const m = new THREE.Mesh(trackGeo(geo), mat);
      m.position.set(...pos);
      m.rotation.set(...rot);
      m.castShadow = cast;
      m.receiveShadow = true;
      gimbalGroup.add(m);
      return m;
    };

    // Outer recessed rectangular bezel frame (flush at ceiling) + hollow inner box
    const rim = 0.014;
    addGim(new THREE.BoxGeometry(w, 0.009, rim), frameMat, [0, 0.006, d / 2 - rim / 2]);
    addGim(new THREE.BoxGeometry(w, 0.009, rim), frameMat, [0, 0.006, -d / 2 + rim / 2]);
    addGim(new THREE.BoxGeometry(rim, 0.009, d), frameMat, [-w / 2 + rim / 2, 0.006, 0]);
    addGim(new THREE.BoxGeometry(rim, 0.009, d), frameMat, [w / 2 - rim / 2, 0.006, 0]);
    // Center bridge divider between twin gimbals
    addGim(new THREE.BoxGeometry(0.01, 0.038, d - rim * 2), darkCavityMat, [0, 0.022, 0]);
    // Recessed side walls rising into ceiling
    addGim(new THREE.BoxGeometry(w - 0.008, 0.052, 0.006), darkCavityMat, [0, 0.03, d / 2 - 0.012]);
    addGim(new THREE.BoxGeometry(w - 0.008, 0.052, 0.006), darkCavityMat, [0, 0.03, -d / 2 + 0.012]);
    addGim(new THREE.BoxGeometry(0.006, 0.052, d - 0.02), darkCavityMat, [-w / 2 + 0.012, 0.03, 0]);
    addGim(new THREE.BoxGeometry(0.006, 0.052, d - 0.02), darkCavityMat, [w / 2 - 0.012, 0.03, 0]);

    // Twin directional gimbal spot heads tilted 16° for architectural wall-washing
    for (const [idx, gx] of [-w * 0.23, w * 0.23].entries()) {
      const tilt = idx === 0 ? 0.26 : -0.2;
      // Outer gimbal ring
      addGim(new THREE.TorusGeometry(0.041, 0.0055, 12, 28), gimbalMat, [gx, 0.018, 0], [Math.PI / 2 + tilt, 0, 0]);
      // Directional optical cylinder + glowing COB lens visible at aperture + rear heatsink
      addGim(new THREE.CylinderGeometry(0.032, 0.036, 0.044, 24), gimbalMat, [gx, 0.04, 0], [tilt, 0, 0]);
      addGim(new THREE.CylinderGeometry(0.029, 0.029, 0.008, 24), ledMat, [gx, 0.017, Math.sin(tilt) * 0.012], [tilt, 0, 0], false);
      addGim(new THREE.CylinderGeometry(0.034, 0.034, 0.032, 20), heatsinkMat, [gx, 0.074, -Math.sin(tilt) * 0.02], [tilt, 0, 0]);
    }
  }

  // ============================================================================
  // 7. Jupiter / Cata 18W Ultra İnce Yuvarlak Alçıpan Panel LED Downlight (Ø22 cm)
  // ============================================================================
  else if (asset.archetype === 'tr_led_downlight_panel') {
    const bezelMat = makePrimaryMat();
    const backMat = makeSecondaryMat();
    const ledMat = makeLedEmissiveMat(1.85);
    const springMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#CBD5E1', roughness: 0.22, metalness: 0.92 }),
    );
    const driverMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.3, metalness: 0.05 }),
    );

    const panelGroup = new THREE.Group();
    panelGroup.position.set(0, 0.115, 0);
    panelGroup.rotation.set(-Math.PI * 0.68, 0, 0);
    group.add(panelGroup);

    const addPan = (
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      pos: [number, number, number],
      rot: [number, number, number] = [0, 0, 0],
      cast = true,
    ) => {
      const m = new THREE.Mesh(trackGeo(geo), mat);
      m.position.set(...pos);
      m.rotation.set(...rot);
      m.castShadow = cast;
      m.receiveShadow = true;
      panelGroup.add(m);
      return m;
    };

    const outerR = w / 2;
    // Ultra-slim circular aluminum frame (1.4 cm thick)
    addPan(new THREE.CylinderGeometry(outerR, outerR, 0.014, 48), bezelMat, [0, 0.012, 0]);
    // Luminous flat opal PMMA diffuser panel clearly facing forward-upward
    addPan(new THREE.CylinderGeometry(outerR * 0.87, outerR * 0.87, 0.008, 48), ledMat, [0, 0.005, 0], [0, 0, 0], false);
    // Rear aluminum backplate
    addPan(new THREE.CylinderGeometry(outerR * 0.9, outerR * 0.9, 0.006, 36), backMat, [0, 0.022, 0]);

    // Twin steel spring retaining clips
    for (const sx of [-1, 1]) {
      addPan(new THREE.BoxGeometry(0.004, 0.036, 0.014), springMat, [sx * (outerR * 0.9), 0.034, 0], [0, 0, sx * -0.45]);
    }

    // External 18W constant-current LED driver box resting cleanly above plenum
    addPan(new THREE.BoxGeometry(0.085, 0.022, 0.036), driverMat, [0.02, 0.038, -0.02]);
    const drvTex = trackTex(createWordmarkTex('18W LED DRIVER', '#0F172A', options.maxAnisotropy, '220-240V · 3000K'));
    addPan(
      new THREE.PlaneGeometry(0.075, 0.026),
      trackMat(new THREE.MeshBasicMaterial({ map: drvTex, transparent: true, depthWrite: false })),
      [0.02, 0.0495, -0.02],
      [-Math.PI / 2, 0, 0],
    );
  }

  // ============================================================================
  // 8. Alçıpan Gizli Işık (Cove) Alüminyum Kanal & 24V COB Şerit LED Seti (200 cm)
  // ============================================================================
  else if (asset.archetype === 'tr_cove_led_strip') {
    const channelMat = makePrimaryMat();
    const gypsumMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#EAECEF', roughness: 0.78, metalness: 0.02 }),
    );
    const ledMat = makeLedEmissiveMat(2.4);
    const glowHaloMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(accentHex),
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    const psuMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#CBD5E1', roughness: 0.34, metalness: 0.82 }),
    );
    const wireMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.65, metalness: 0.1 }),
    );

    const lenA = Math.min(w, 1.35);
    const lenB = 0.68;
    const trayD = 0.14;

    // Architectural L-corner drywall cove tray (alçıpan gizli ışık havuzu)
    addMesh(new THREE.BoxGeometry(lenA, 0.02, trayD), gypsumMat, [0, 0.01, 0]);
    addMesh(new THREE.BoxGeometry(lenA, 0.095, 0.02), gypsumMat, [0, 0.055, trayD / 2 - 0.01]);
    // Mitered 90° return leg
    addMesh(new THREE.BoxGeometry(trayD, 0.02, lenB), gypsumMat, [-lenA / 2 + trayD / 2, 0.01, -lenB / 2 + trayD / 2]);
    addMesh(new THREE.BoxGeometry(0.02, 0.095, lenB), gypsumMat, [-lenA / 2 + 0.01, 0.055, -lenB / 2 + trayD / 2]);

    // Anodized 45° aluminum COB LED channel + continuous warm glowing diffuser along main leg
    addMesh(new THREE.BoxGeometry(lenA - 0.04, 0.028, 0.03), channelMat, [0.01, 0.036, 0.018], [0.45, 0, 0]);
    addMesh(new THREE.BoxGeometry(lenA - 0.048, 0.014, 0.028), ledMat, [0.01, 0.048, 0.01], [0.45, 0, 0], false);
    addMesh(new THREE.PlaneGeometry(lenA - 0.04, 0.12), glowHaloMat, [0.01, 0.11, -0.015], [0.22, 0, 0], false);

    // Return leg 45° aluminum COB LED channel + glowing diffuser
    addMesh(
      new THREE.BoxGeometry(0.03, 0.028, lenB - 0.08),
      channelMat,
      [-lenA / 2 + 0.048, 0.036, -lenB / 2 + 0.04],
      [0, 0, -0.45],
    );
    addMesh(
      new THREE.BoxGeometry(0.028, 0.014, lenB - 0.088),
      ledMat,
      [-lenA / 2 + 0.058, 0.048, -lenB / 2 + 0.04],
      [0, 0, -0.45],
      false,
    );

    // 24V 100W perforated metallic LED Power Supply (Trafo) tucked cleanly behind main cove
    addMesh(new THREE.BoxGeometry(0.22, 0.042, 0.054), psuMat, [lenA * 0.24, 0.04, -0.035]);
    const psuTex = trackTex(createWordmarkTex('24V · 100W', '#0F172A', options.maxAnisotropy, 'COB LED TRAFO'));
    addMesh(
      new THREE.PlaneGeometry(0.18, 0.038),
      trackMat(new THREE.MeshBasicMaterial({ map: psuTex, transparent: true, depthWrite: false })),
      [lenA * 0.24, 0.062, -0.035],
      [-Math.PI / 2, 0, 0],
    );
    addMesh(new THREE.CylinderGeometry(0.004, 0.004, 0.08, 8), wireMat, [lenA * 0.1, 0.034, -0.01], [Math.PI / 2, 0, 0.35]);
  }

  // ============================================================================
  // 9. Sıva Altı Gömme Mimari Lineer LED Tavan & Duvar Profili (200×3.5 cm)
  // ============================================================================
  else if (asset.archetype === 'tr_linear_recessed_led') {
    const aluMat = makePrimaryMat();
    const darkRimMat = makeSecondaryMat();
    const ledMat = makeLedEmissiveMat(2.4);
    const glowHaloMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(accentHex),
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );

    const lenA = Math.min(w, 1.35);
    const lenB = 0.68;
    const bodyD = 0.046;
    const bodyH = 0.042;

    // Main linear recessed architectural aluminum profile with perforated trimless plaster wings
    addMesh(new THREE.BoxGeometry(lenA, 0.005, 0.024), aluMat, [0, 0.01, bodyD / 2 + 0.012]);
    addMesh(new THREE.BoxGeometry(lenA, 0.005, 0.024), aluMat, [0, 0.01, -bodyD / 2 - 0.012]);
    addMesh(new THREE.BoxGeometry(lenA, bodyH, bodyD), aluMat, [0, 0.01 + bodyH / 2, 0]);
    addMesh(new THREE.BoxGeometry(lenA, 0.006, 0.005), darkRimMat, [0, 0.01 + bodyH + 0.001, bodyD / 2 - 0.002]);
    addMesh(new THREE.BoxGeometry(lenA, 0.006, 0.005), darkRimMat, [0, 0.01 + bodyH + 0.001, -bodyD / 2 + 0.002]);
    addMesh(new THREE.BoxGeometry(lenA - 0.01, 0.01, bodyD - 0.01), ledMat, [0, 0.01 + bodyH + 0.002, 0], [0, 0, 0], false);
    addMesh(new THREE.PlaneGeometry(lenA - 0.02, 0.09), glowHaloMat, [0, 0.01 + bodyH + 0.048, 0], [0, 0, 0], false);

    // Mitered 90° architectural corner return (ceiling-to-wall / continuous architectural line)
    addMesh(new THREE.BoxGeometry(0.024, 0.005, lenB), aluMat, [-lenA / 2 + bodyD / 2 + 0.012, 0.01, -lenB / 2]);
    addMesh(new THREE.BoxGeometry(0.024, 0.005, lenB), aluMat, [-lenA / 2 - bodyD / 2 - 0.012, 0.01, -lenB / 2]);
    addMesh(new THREE.BoxGeometry(bodyD, bodyH, lenB), aluMat, [-lenA / 2, 0.01 + bodyH / 2, -lenB / 2]);
    addMesh(new THREE.BoxGeometry(bodyD - 0.01, 0.01, lenB - 0.01), ledMat, [-lenA / 2, 0.01 + bodyH + 0.002, -lenB / 2], [0, 0, 0], false);
  }

  // ============================================================================
  // 10. Avonni / Özcan 3 Katlı Modern Halka LED Salon Avizesi (Ø80/60/40 cm)
  // ============================================================================
  else if (asset.archetype === 'tr_tiered_ring_chandelier') {
    const metalMat = makePrimaryMat();
    const diffuserMat = makeLedEmissiveMat(1.65);
    const cableMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#94A3B8', roughness: 0.28, metalness: 0.9 }),
    );

    const canopyY = h - 0.02;
    // Brushed metal circular ceiling canopy
    addMesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 36), metalMat, [0, canopyY, 0]);

    // 3 cascading sculptural LED rings with subtle designer tilt
    const rings = [
      { r: w * 0.5, y: h * 0.56, rx: 0.12, rz: -0.08 },
      { r: w * 0.37, y: h * 0.34, rx: -0.14, rz: 0.1 },
      { r: w * 0.24, y: h * 0.14, rx: 0.08, rz: 0.14 },
    ];

    for (const ring of rings) {
      // Outer metallic ring profile
      const ringGroup = new THREE.Group();
      ringGroup.position.set(0, ring.y, 0);
      ringGroup.rotation.set(ring.rx, 0, ring.rz);

      const outerMesh = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(ring.r, 0.018, 16, 64)),
        metalMat,
      );
      outerMesh.rotation.x = Math.PI / 2;
      outerMesh.castShadow = true;
      ringGroup.add(outerMesh);

      // Inner luminous 3000K silicone LED diffuser ring
      const innerLed = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(ring.r - 0.015, 0.011, 14, 64)),
        diffuserMat,
      );
      innerLed.rotation.x = Math.PI / 2;
      ringGroup.add(innerLed);

      group.add(ringGroup);

      // 3 ultra-fine steel suspension cables from ceiling canopy to ring perimeter
      for (let c = 0; c < 3; c++) {
        const ang = (c * Math.PI * 2) / 3 + 0.4;
        const pTop = new THREE.Vector3(Math.cos(ang) * 0.1, canopyY - 0.02, Math.sin(ang) * 0.1);
        const localPt = new THREE.Vector3(Math.cos(ang) * ring.r, 0, Math.sin(ang) * ring.r);
        localPt.applyEuler(new THREE.Euler(ring.rx, 0, ring.rz));
        localPt.y += ring.y;

        const dir = new THREE.Vector3().subVectors(localPt, pTop);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(pTop, localPt).multiplyScalar(0.5);
        const cable = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.0018, 0.0018, len, 6)), cableMat);
        cable.position.copy(mid);
        cable.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        group.add(cable);
      }
    }
  }

  // ============================================================================
  // 11. Apliqa / Avonni Yemek Masası & Mutfak Adası 6 Küreli Lineer Avize (120 cm)
  // ============================================================================
  else if (asset.archetype === 'tr_linear_globe_chandelier') {
    const metalMat = makePrimaryMat();
    const globeMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(secondaryHex),
        emissive: new THREE.Color(accentHex),
        emissiveIntensity: 0.72,
        roughness: 0.16,
        metalness: 0.02,
        clearcoat: 0.65,
      }),
    );

    const canopyY = h - 0.02;
    const barY = h * 0.24;
    const rodLen = canopyY - barY;

    // Rectangular architectural ceiling canopy
    addMesh(new THREE.BoxGeometry(0.52, 0.036, 0.085), metalMat, [0, canopyY, 0]);

    // Twin vertical rigid suspension rods
    for (const rx of [-0.22, 0.22]) {
      addMesh(new THREE.CylinderGeometry(0.0065, 0.0065, rodLen, 14), metalMat, [rx, barY + rodLen / 2, 0]);
      addMesh(new THREE.CylinderGeometry(0.015, 0.015, 0.018, 16), metalMat, [rx, barY, 0]);
    }

    // Horizontal 120 cm sculptural metal bar + decorative end caps
    addMesh(new THREE.CylinderGeometry(0.011, 0.011, w * 0.92, 20), metalMat, [0, barY, 0], [0, 0, Math.PI / 2]);

    // 6 frosted opal glass globes alternating front/back & upper/lower along the 120 cm bar
    const globePositions: Array<[number, number, number]> = [
      [-w * 0.41, barY + 0.09, 0.04],
      [-w * 0.25, barY - 0.09, -0.05],
      [-w * 0.08, barY + 0.09, -0.05],
      [w * 0.08, barY - 0.09, 0.05],
      [w * 0.25, barY + 0.09, 0.05],
      [w * 0.41, barY - 0.09, -0.04],
    ];

    for (const [gx, gy, gz] of globePositions) {
      // Short lateral brass stem + socket collar
      const dir = new THREE.Vector3(0, gy - barY, gz);
      const len = dir.length();
      const stem = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.0055, 0.0055, len, 12)), metalMat);
      stem.position.set(gx, barY + (gy - barY) / 2, gz / 2);
      stem.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      group.add(stem);

      // Luminous Ø15 cm opal glass globe
      addMesh(new THREE.SphereGeometry(0.075, 28, 22), globeMat, [gx, gy, gz], [0, 0, 0], false);
    }
  }

  // ============================================================================
  // 12. Özcan / Şişhane Villa Galeri & Merdiven Boşluğu 9'lu Kaskad Sarkıt Avize
  // ============================================================================
  else if (asset.archetype === 'tr_cascade_stair_chandelier') {
    const metalMat = makePrimaryMat();
    const glassTubeMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(secondaryHex),
        emissive: new THREE.Color(accentHex),
        emissiveIntensity: 0.78,
        roughness: 0.14,
        metalness: 0.04,
        clearcoat: 0.8,
      }),
    );
    const cordMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.55, metalness: 0.5 }),
    );

    const canopyY = h - 0.025;
    // Ø56 cm circular brushed metal ceiling plate
    addMesh(new THREE.CylinderGeometry(w * 0.46, w * 0.46, 0.042, 42), metalMat, [0, canopyY, 0]);

    // 9 spiral-helix cascading cylindrical pendants spanning 240 cm drop
    const count = 9;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const ang = i * 2.15; // Golden-angle spiral helix
      const rad = i === 0 ? 0.03 : 0.11 + (i % 3) * 0.065;
      const px = Math.cos(ang) * rad;
      const pz = Math.sin(ang) * rad;
      const pendantCenterY = h * 0.76 - t * (h * 0.64);
      const cordLen = canopyY - (pendantCenterY + 0.17);

      // Vertical suspension cord
      addMesh(new THREE.CylinderGeometry(0.0022, 0.0022, cordLen, 8), cordMat, [px, pendantCenterY + 0.17 + cordLen / 2, pz]);
      // Metallic top socket cap + lower ring accent
      addMesh(new THREE.CylinderGeometry(0.038, 0.038, 0.085, 22), metalMat, [px, pendantCenterY + 0.135, pz]);
      // Glowing fluted/frosted cylindrical glass diffuser tube (Ø7.4×26 cm)
      addMesh(new THREE.CylinderGeometry(0.036, 0.036, 0.24, 24), glassTubeMat, [px, pendantCenterY - 0.02, pz], [0, 0, 0], false);
      // Small brass bottom finial cap
      addMesh(new THREE.CylinderGeometry(0.038, 0.034, 0.016, 22), metalMat, [px, pendantCenterY - 0.145, pz]);
    }
  }

  // ============================================================================
  // 13. Jupiter / Özcan Çift Yönlü (Up-Down) Mimari Alüminyum LED Duvar Apliği
  // ============================================================================
  else if (asset.archetype === 'tr_wall_sconce_updown') {
    const bodyMat = makePrimaryMat();
    const trimMat = makeSecondaryMat();
    const ledMat = makeLedEmissiveMat(2.0);

    const cylR = Math.min(w, d) * 0.36;
    const yOff = 0.14;

    // Wall mounting rectangular backplate + horizontal standoff arm
    addMesh(new THREE.BoxGeometry(0.052, 0.12, 0.014), bodyMat, [0, yOff + h / 2, 0.007]);
    addMesh(new THREE.BoxGeometry(0.032, 0.056, 0.042), bodyMat, [0, yOff + h / 2, 0.032]);

    // Main architectural vertical aluminum cylinder housing (32 cm)
    addMesh(new THREE.CylinderGeometry(cylR, cylR, h, 36), bodyMat, [0, yOff + h / 2, 0.068]);
    // Fine decorative metallic center accent ring
    addMesh(new THREE.TorusGeometry(cylR + 0.001, 0.0035, 10, 36), trimMat, [0, yOff + h / 2, 0.068], [Math.PI / 2, 0, 0]);

    // Upper & lower recessed anti-glare rings + glowing 3000K optical glass lenses
    for (const ly of [yOff + h - 0.003, yOff + 0.003]) {
      addMesh(new THREE.TorusGeometry(cylR * 0.88, 0.004, 10, 32), trimMat, [0, ly, 0.068], [Math.PI / 2, 0, 0]);
      addMesh(new THREE.CylinderGeometry(cylR * 0.78, cylR * 0.78, 0.008, 28), ledMat, [0, ly, 0.068], [0, 0, 0], false);
    }

    // Dual warm optical light cones projecting cleanly up & down above studio floor
    const coneMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(accentHex),
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    addMesh(new THREE.ConeGeometry(cylR * 2.2, 0.135, 24, 1, true), coneMat, [0, yOff + h + 0.066, 0.068], [Math.PI, 0, 0], false);
    addMesh(new THREE.ConeGeometry(cylR * 2.2, 0.135, 24, 1, true), coneMat, [0, yOff - 0.066, 0.068], [0, 0, 0], false);
  }

  return {
    group,
    dispose: () => {
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      texturesToDispose.forEach((t) => t.dispose());
    },
  };
}
