import * as THREE from 'three';
import type {
  ArchitecturalAsset,
  AssetArchetype,
  MaterialFinish,
  PatternVariant,
} from '../lib/catalogTypes';
import type { BuiltAssetModel } from './assetMeshBuilder';
import { createWoodGrainTexture } from './proceduralTextures';

const HOME_STUDY_TOYS_ARCHETYPES = new Set<AssetArchetype>([
  'tr_mirrored_6door_wardrobe',
  'tr_glass_walkin_wardrobe',
  'tr_sliding_wardrobe_220',
  'tr_kids_3door_wardrobe',
  'tr_tall_filled_bookcase',
  'tr_arched_fluted_bookcase',
  'tr_study_desk_hutch_set',
  'tr_montessori_kids_bookshelf',
  'tr_pen_holder_stationery_set',
  'tr_desk_organizer_tray',
  'tr_turkish_textbooks_stack',
  'tr_open_textbook_study_set',
  'tr_bookends_encyclopedia_row',
  'tr_modern_ultrabook_laptop',
  'tr_laptop_stand_workstation',
  'tr_dual_monitor_desk_setup',
  'tr_montessori_rainbow_blocks',
  'tr_toddler_wooden_abacus_xylophone',
  'tr_kids_teepee_play_tent',
  'tr_wooden_kids_play_kitchen',
  'tr_kids_toy_storage_organizer',
  'tr_wooden_dollhouse_3story',
]);

export function isTurkishHomeStudyToysArchetype(archetype: AssetArchetype): boolean {
  return HOME_STUDY_TOYS_ARCHETYPES.has(archetype);
}

function makeCanvasTex(
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
  tex.anisotropy = Math.min(maxAnisotropy, 8);
  tex.needsUpdate = true;
  return tex;
}

function makeKeyboardTex(maxAnisotropy: number): THREE.CanvasTexture {
  return makeCanvasTex(512, 224, maxAnisotropy, (ctx, w, h) => {
    ctx.fillStyle = '#15181F';
    ctx.fillRect(0, 0, w, h);
    const rows = [
      ['ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '←'],
      ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
      ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ', '↵'],
      ['⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', '.', '⇧'],
      ['FN', 'CTRL', 'ALT', 'SPACE', 'ALT', '◄', '▼', '►'],
    ];
    const rowH = (h - 24) / rows.length;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    rows.forEach((row, r) => {
      let x = 12;
      const totalUnits = row.reduce((s, k) => s + (k === 'SPACE' ? 5.2 : k.length > 1 ? 1.45 : 1), 0);
      const unitW = (w - 24 - (row.length - 1) * 4) / totalUnits;
      row.forEach((key) => {
        const kw = unitW * (key === 'SPACE' ? 5.2 : key.length > 1 ? 1.45 : 1);
        const y = 10 + r * rowH;
        ctx.fillStyle = '#242933';
        ctx.fillRect(x, y, kw, rowH - 5);
        ctx.strokeStyle = '#363D4B';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, kw - 1, rowH - 6);
        if (key !== 'SPACE') {
          ctx.fillStyle = '#D5DCE6';
          ctx.font = `600 ${key.length > 1 ? 9 : 12}px sans-serif`;
          ctx.fillText(key, x + kw / 2, y + (rowH - 5) / 2);
        }
        x += kw + 4;
      });
    });
  });
}

function makeArchScreenTex(mode: 'blender' | 'cad' | 'slides', maxAnisotropy: number): THREE.CanvasTexture {
  return makeCanvasTex(512, 320, maxAnisotropy, (ctx, w, h) => {
    if (mode === 'cad') {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(56,189,248,0.14)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, 0, w, 26);
      ctx.fillStyle = '#38BDF8';
      ctx.font = '700 11px monospace';
      ctx.fillText('VILLA_KAT_PLANI_1_50.DWG  ·  240m²', 12, 17);
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 3;
      ctx.strokeRect(64, 52, 360, 220);
      ctx.beginPath();
      ctx.moveTo(220, 52);
      ctx.lineTo(220, 272);
      ctx.moveTo(220, 152);
      ctx.lineTo(424, 152);
      ctx.moveTo(64, 180);
      ctx.lineTo(160, 180);
      ctx.stroke();
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(220, 120, 28, 0, Math.PI * 0.5);
      ctx.stroke();
      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 11px sans-serif';
      ctx.fillText('SALON 42m²', 108, 120);
      ctx.fillText('MUTFAK 24m²', 284, 106);
      ctx.fillText('EBEVEYN 28m²', 280, 218);
      return;
    }
    if (mode === 'slides') {
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, 0, w, 34);
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '700 12px sans-serif';
      ctx.fillText('MİMARİ İÇ MEKAN SUNUMU · 2026', 16, 21);
      ctx.fillStyle = '#E2D9CC';
      ctx.fillRect(24, 52, 230, 230);
      ctx.fillStyle = '#8A6748';
      ctx.fillRect(42, 175, 194, 86);
      ctx.fillStyle = '#C5A059';
      ctx.beginPath();
      ctx.arc(138, 108, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0F172A';
      ctx.font = '700 18px sans-serif';
      ctx.fillText('BODRUM VİLLA', 274, 92);
      ctx.fillStyle = '#475569';
      ctx.font = '500 12px sans-serif';
      ctx.fillText('Doğal Traverten & Meşe', 274, 120);
      ctx.fillStyle = '#CBD5E1';
      for (let i = 0; i < 4; i++) ctx.fillRect(274, 148 + i * 22, 185 - i * 18, 9);
      return;
    }
    // Blender 3D architectural viewport
    ctx.fillStyle = '#1E222B';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2B303C';
    ctx.fillRect(0, 0, w, 24);
    ctx.fillRect(w - 118, 24, 118, h - 24);
    const sky = ctx.createLinearGradient(0, 24, 0, 210);
    sky.addColorStop(0, '#38BDF8');
    sky.addColorStop(1, '#E0F2FE');
    ctx.fillStyle = sky;
    ctx.fillRect(8, 30, w - 134, 170);
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(8, 200, w - 134, 110);
    // Modern Turkish villa silhouette
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(58, 122, 240, 108);
    ctx.fillStyle = '#334155';
    ctx.fillRect(48, 112, 260, 14);
    ctx.fillStyle = '#1E3A5F';
    ctx.fillRect(78, 142, 92, 68);
    ctx.fillRect(190, 142, 86, 68);
    ctx.fillStyle = '#FDE68A';
    ctx.globalAlpha = 0.45;
    ctx.fillRect(82, 146, 84, 60);
    ctx.globalAlpha = 1;
    // Outliner text
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '600 10px monospace';
    ctx.fillText('Blender 4.3 · Cycles', 12, 16);
    ctx.fillStyle = '#F59E0B';
    ctx.fillText('Scene Collection', w - 110, 44);
    ctx.fillStyle = '#94A3B8';
    ['Villa_Govde', 'Pergola_ALU', 'Salon_Koltuk', 'Sun_Light', 'Camera_01'].forEach((item, idx) => {
      ctx.fillText('• ' + item, w - 108, 66 + idx * 20);
    });
  });
}

function makeBookCoverTex(
  title: string,
  subtitle: string,
  bgHex: string,
  accentHex: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  return makeCanvasTex(256, 360, maxAnisotropy, (ctx, w, h) => {
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = accentHex;
    ctx.fillRect(0, 0, w, 46);
    ctx.fillRect(20, h - 52, w - 40, 6);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, w / 2, 138);
    ctx.fillStyle = 'rgba(255,255,255,0.86)';
    ctx.font = '600 16px sans-serif';
    ctx.fillText(subtitle, w / 2, 176);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 3;
    ctx.strokeRect(24, 72, w - 48, h - 146);
  });
}

function makeOpenBookPageTex(maxAnisotropy: number): THREE.CanvasTexture {
  return makeCanvasTex(512, 340, maxAnisotropy, (ctx, w, h) => {
    ctx.fillStyle = '#FAF6EE';
    ctx.fillRect(0, 0, w, h);
    // Center spine crease shadow
    const grad = ctx.createLinearGradient(w / 2 - 22, 0, w / 2 + 22, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.5, 'rgba(30,25,20,0.22)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(w / 2 - 22, 0, 44, h);
    // Left page text lines & heading
    ctx.fillStyle = '#1E3A8A';
    ctx.font = '700 16px sans-serif';
    ctx.fillText('BÖLÜM 4: ÜÇGENLER & GEOMETRİ', 28, 42);
    ctx.fillStyle = '#334155';
    for (let i = 0; i < 12; i++) {
      ctx.fillRect(28, 62 + i * 19, i % 4 === 3 ? 130 : 196, 5);
    }
    ctx.fillStyle = 'rgba(250, 204, 21, 0.55)';
    ctx.fillRect(26, 117, 168, 12);
    // Right page geometric triangle diagram + formula
    ctx.strokeStyle = '#1D4ED8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(298, 190);
    ctx.lineTo(458, 190);
    ctx.lineTo(356, 78);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = '#0F172A';
    ctx.font = '700 15px monospace';
    ctx.fillText('a² + b² = c²', 324, 232);
    ctx.fillStyle = '#475569';
    for (let i = 0; i < 4; i++) ctx.fillRect(290, 252 + i * 16, 180, 4);
  });
}

function makeStorybookTex(label: string, bg: string, motif: string, maxAnisotropy: number): THREE.CanvasTexture {
  return makeCanvasTex(256, 320, maxAnisotropy, (ctx, w, h) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = motif;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.58, 66, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(w / 2 - 20, h * 0.54, 14, 0, Math.PI * 2);
    ctx.arc(w / 2 + 20, h * 0.54, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, w / 2, 66);
  });
}

export function buildTurkishHomeStudyToysMesh(
  asset: ArchitecturalAsset,
  finish: MaterialFinish,
  options: {
    isSoftwareGl: boolean;
    maxAnisotropy: number;
    wireframe?: boolean;
    pattern?: PatternVariant;
  },
): BuiltAssetModel {
  const maxAnisotropy = options.maxAnisotropy || 4;
  const group = new THREE.Group();
  const geos: THREE.BufferGeometry[] = [];
  const mats: THREE.Material[] = [];
  const texs: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geos.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    mats.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    texs.push(t);
    return t;
  };

  const addMesh = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    pos: [number, number, number] = [0, 0, 0],
    rot: [number, number, number] = [0, 0, 0],
  ) => {
    trackGeo(geo);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(pos[0], pos[1], pos[2]);
    m.rotation.set(rot[0], rot[1], rot[2]);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };

  const w = asset.dimensionsCm.width / 100;
  const d = asset.dimensionsCm.depth / 100;
  const h = asset.dimensionsCm.height / 100;

  const pHex = finish.partFinishes?.primary.hex ?? finish.primaryHex;
  const sHex = finish.partFinishes?.secondary.hex ?? finish.secondaryHex;
  const aHex = finish.partFinishes?.accent.hex ?? finish.accentHex;
  const pRough = finish.partFinishes?.primary.roughness ?? finish.roughness;
  const pMetal = finish.partFinishes?.primary.metalness ?? finish.metalness;
  const sRough = finish.partFinishes?.secondary.roughness ?? 0.5;
  const sMetal = finish.partFinishes?.secondary.metalness ?? 0.08;
  const aRough = finish.partFinishes?.accent.roughness ?? 0.28;
  const aMetal = finish.partFinishes?.accent.metalness ?? 0.85;

  const woodPrimaryMaps =
    finish.materialKind === 'wood' ? createWoodGrainTexture(pHex, maxAnisotropy) : null;
  if (woodPrimaryMaps) {
    trackTex(woodPrimaryMaps.map);
    trackTex(woodPrimaryMaps.bumpMap);
  }
  const woodSecondaryMaps = createWoodGrainTexture(sHex, maxAnisotropy);
  trackTex(woodSecondaryMaps.map);
  trackTex(woodSecondaryMaps.bumpMap);

  const primaryMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: woodPrimaryMaps ? '#FFFFFF' : pHex,
      map: woodPrimaryMaps ? woodPrimaryMaps.map : null,
      bumpMap: woodPrimaryMaps ? woodPrimaryMaps.bumpMap : null,
      bumpScale: woodPrimaryMaps ? 0.008 : 0,
      roughness: pRough,
      metalness: pMetal,
    }),
  );
  const secondaryMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: sMetal > 0.35 ? sHex : '#FFFFFF',
      map: sMetal > 0.35 ? null : woodSecondaryMaps.map,
      bumpMap: sMetal > 0.35 ? null : woodSecondaryMaps.bumpMap,
      bumpScale: sMetal > 0.35 ? 0 : 0.008,
      roughness: sRough,
      metalness: sMetal,
    }),
  );
  const accentMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: aHex,
      roughness: aRough,
      metalness: aMetal,
    }),
  );
  const mirrorMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: '#DDE5EE',
      roughness: 0.04,
      metalness: 0.94,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    }),
  );
  const smokedGlassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: '#343A44',
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.36,
      clearcoat: 0.9,
    }),
  );
  const clearGlassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: '#E6F4FE',
      roughness: 0.06,
      metalness: 0.05,
      transparent: true,
      opacity: 0.42,
    }),
  );
  const warmLedMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#FFF4D6',
      emissive: '#FFCC6E',
      emissiveIntensity: 1.8,
      roughness: 0.2,
    }),
  );
  const paperMat = trackMat(new THREE.MeshStandardMaterial({ color: '#F6F1E6', roughness: 0.86 }));
  const darkMat = trackMat(new THREE.MeshStandardMaterial({ color: '#1C2027', roughness: 0.4, metalness: 0.35 }));
  const beechMaps = createWoodGrainTexture('#D7B084', maxAnisotropy);
  trackTex(beechMaps.map);
  trackTex(beechMaps.bumpMap);
  const beechMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: beechMaps.map,
      bumpMap: beechMaps.bumpMap,
      bumpScale: 0.006,
      roughness: 0.54,
      metalness: 0.0,
    }),
  );

  const bookPalette = ['#2B4C7E', '#B85D3B', '#5E7A66', '#D4A359', '#3D4451', '#A64253', '#D9CFC1', '#4C6687'];
  const bookMats = bookPalette.map((hex) =>
    trackMat(new THREE.MeshStandardMaterial({ color: hex, roughness: 0.72, metalness: 0.02 })),
  );
  const addBook = (
    x: number,
    y: number,
    z: number,
    bw: number,
    bh: number,
    bd: number,
    colorIdx: number,
    rotZ = 0,
    rotY = 0,
  ) => {
    const mat = bookMats[colorIdx % bookMats.length];
    addMesh(new THREE.BoxGeometry(bw, bh, bd), mat, [x, y + bh / 2, z], [0, rotY, rotZ]);
    // White page edge inset slightly
    addMesh(
      new THREE.BoxGeometry(bw * 0.82, bh * 0.94, bd * 0.92),
      paperMat,
      [x, y + bh / 2, z - bd * 0.03],
      [0, rotY, rotZ],
    );
  };

  const addLaptopUnit = (
    cx: number,
    cy: number,
    cz: number,
    lw: number,
    ld: number,
    screenMode: 'blender' | 'cad' | 'slides',
    bodyMat: THREE.Material,
  ) => {
    const baseH = 0.014;
    addMesh(new THREE.BoxGeometry(lw, baseH, ld), bodyMat, [cx, cy + baseH / 2, cz]);
    // Recessed keyboard deck
    const kbTex = trackTex(makeKeyboardTex(maxAnisotropy));
    const kbMat = trackMat(new THREE.MeshStandardMaterial({ map: kbTex, roughness: 0.45 }));
    addMesh(new THREE.BoxGeometry(lw * 0.86, 0.002, ld * 0.46), kbMat, [cx, cy + baseH + 0.001, cz - ld * 0.14]);
    // Trackpad
    addMesh(new THREE.BoxGeometry(lw * 0.34, 0.0015, ld * 0.28), darkMat, [cx, cy + baseH + 0.001, cz + ld * 0.26]);
    // Hinged lid tilted back 112 deg
    const lidH = ld * 0.94;
    const lidTilt = -0.34;
    const hingeY = cy + baseH;
    const hingeZ = cz - ld * 0.48;
    const lidGroup = new THREE.Group();
    lidGroup.position.set(cx, hingeY, hingeZ);
    lidGroup.rotation.x = lidTilt;
    const shell = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(lw, lidH, 0.007)), bodyMat);
    shell.position.set(0, lidH / 2, 0);
    shell.castShadow = true;
    lidGroup.add(shell);
    const bezel = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(lw * 0.97, lidH * 0.96, 0.002)), darkMat);
    bezel.position.set(0, lidH / 2, 0.004);
    lidGroup.add(bezel);
    const scrTex = trackTex(makeArchScreenTex(screenMode, maxAnisotropy));
    const scrMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: scrTex,
        emissiveMap: scrTex,
        emissive: '#FFFFFF',
        emissiveIntensity: 0.65,
        roughness: 0.14,
      }),
    );
    const screen = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(lw * 0.91, lidH * 0.86)), scrMat);
    screen.position.set(0, lidH / 2 + 0.004, 0.006);
    lidGroup.add(screen);
    group.add(lidGroup);
  };

  switch (asset.archetype) {
    // =========================================================================
    // A. GARDIROP & GİYİNME DOLAPLARI (4)
    // =========================================================================
    case 'tr_mirrored_6door_wardrobe': {
      const plinthH = 0.08;
      // Plinth + main carcass
      addMesh(new THREE.BoxGeometry(w - 0.04, plinthH, d - 0.06), secondaryMat, [0, plinthH / 2, -0.02]);
      addMesh(new THREE.BoxGeometry(w, h - plinthH, d - 0.03), primaryMat, [0, plinthH + (h - plinthH) / 2, -0.015]);
      // Top cornice
      addMesh(new THREE.BoxGeometry(w + 0.02, 0.03, d + 0.01), primaryMat, [0, h - 0.015, 0]);
      // 6 doors: outer 2 + 2 primary, center 2 full-height mirror
      const doorCount = 6;
      const doorW = (w - 0.024) / doorCount;
      const doorH = h - plinthH - 0.04;
      for (let i = 0; i < doorCount; i++) {
        const dx = -w / 2 + 0.012 + doorW * (i + 0.5);
        const isMirror = i === 2 || i === 3;
        addMesh(
          new THREE.BoxGeometry(doorW - 0.005, doorH, 0.022),
          isMirror ? accentMat : primaryMat,
          [dx, plinthH + doorH / 2, d / 2 - 0.011],
        );
        if (isMirror) {
          addMesh(
            new THREE.BoxGeometry(doorW - 0.034, doorH - 0.04, 0.008),
            mirrorMat,
            [dx, plinthH + doorH / 2, d / 2 + 0.002],
          );
        }
        // Long architectural vertical pull handle
        const hx = dx + (i % 2 === 0 ? doorW * 0.36 : -doorW * 0.36);
        addMesh(new THREE.BoxGeometry(0.014, 0.78, 0.024), accentMat, [hx, plinthH + doorH * 0.48, d / 2 + 0.014]);
      }
      break;
    }

    case 'tr_glass_walkin_wardrobe': {
      const plinthH = 0.07;
      // Back, top, bottom, side walls & 2 vertical dividers (open front behind smoked glass)
      addMesh(new THREE.BoxGeometry(w, h, 0.024), secondaryMat, [0, h / 2, -d / 2 + 0.012]);
      addMesh(new THREE.BoxGeometry(w, plinthH, d), primaryMat, [0, plinthH / 2, 0]);
      addMesh(new THREE.BoxGeometry(w, 0.03, d), primaryMat, [0, h - 0.015, 0]);
      for (const sx of [-w / 2 + 0.015, -w / 6, w / 6, w / 2 - 0.015]) {
        addMesh(new THREE.BoxGeometry(0.028, h - plinthH, d - 0.03), primaryMat, [sx, plinthH + (h - plinthH) / 2, -0.01]);
      }
      // Interior upper shelves & hanging rods + garments
      const bayW = w / 3 - 0.03;
      const clothesHex = ['#E8E2D8', '#8F9AA6', '#566474', '#C6B4A2', '#3B424D', '#D9CFC1'];
      for (const bx of [-w / 3, w / 3]) {
        addMesh(new THREE.BoxGeometry(bayW, 0.022, d - 0.06), primaryMat, [bx, h - 0.44, -0.02]);
        // Chrome hanging bar
        addMesh(
          new THREE.CylinderGeometry(0.012, 0.012, bayW - 0.02, 12),
          accentMat,
          [bx, h - 0.56, 0],
          [0, 0, Math.PI / 2],
        );
        // Hanging garments
        for (let g = 0; g < 6; g++) {
          const gx = bx - bayW * 0.38 + g * (bayW * 0.15);
          const gMat = trackMat(new THREE.MeshStandardMaterial({ color: clothesHex[g % clothesHex.length], roughness: 0.88 }));
          addMesh(new THREE.BoxGeometry(0.042, 0.88, 0.42), gMat, [gx, h - 1.04, -0.02]);
        }
        // Folded knit stack on top shelf
        for (let f = 0; f < 3; f++) {
          const fMat = trackMat(new THREE.MeshStandardMaterial({ color: clothesHex[(f + 2) % clothesHex.length], roughness: 0.9 }));
          addMesh(new THREE.BoxGeometry(0.28, 0.065, 0.34), fMat, [bx - 0.12, h - 0.4 + f * 0.068, -0.02]);
        }
      }
      // Center bay: 3 drawers + glass jewelry showcase + 3 upper shelves
      for (let dr = 0; dr < 3; dr++) {
        const dy = plinthH + 0.12 + dr * 0.21;
        addMesh(new THREE.BoxGeometry(bayW - 0.02, 0.19, d - 0.09), primaryMat, [0, dy, -0.02]);
        addMesh(new THREE.BoxGeometry(0.16, 0.014, 0.018), accentMat, [0, dy + 0.04, d / 2 - 0.05]);
      }
      for (const sy of [0.82, 1.18, 1.54, 1.92]) {
        addMesh(new THREE.BoxGeometry(bayW, 0.02, d - 0.06), primaryMat, [0, sy, -0.02]);
      }
      // Warm vertical LED strips inside side dividers
      for (const lx of [-w / 2 + 0.036, -w / 6 + 0.02, w / 6 + 0.02]) {
        addMesh(new THREE.BoxGeometry(0.01, h - 0.2, 0.012), warmLedMat, [lx, h / 2, d / 2 - 0.06]);
      }
      // 4 Aluminum-framed smoked glass doors across front
      const gdW = (w - 0.02) / 4;
      for (let i = 0; i < 4; i++) {
        const gx = -w / 2 + 0.01 + gdW * (i + 0.5);
        const gh = h - plinthH - 0.04;
        const gy = plinthH + gh / 2;
        addMesh(new THREE.BoxGeometry(gdW - 0.012, gh - 0.04, 0.008), smokedGlassMat, [gx, gy, d / 2 - 0.01]);
        // Slim metal perimeter frame
        addMesh(new THREE.BoxGeometry(0.018, gh, 0.022), accentMat, [gx - gdW / 2 + 0.01, gy, d / 2 - 0.01]);
        addMesh(new THREE.BoxGeometry(0.018, gh, 0.022), accentMat, [gx + gdW / 2 - 0.01, gy, d / 2 - 0.01]);
        addMesh(new THREE.BoxGeometry(gdW - 0.006, 0.018, 0.022), accentMat, [gx, plinthH + gh - 0.009, d / 2 - 0.01]);
        addMesh(new THREE.BoxGeometry(gdW - 0.006, 0.018, 0.022), accentMat, [gx, plinthH + 0.009, d / 2 - 0.01]);
      }
      break;
    }

    case 'tr_sliding_wardrobe_220': {
      addMesh(new THREE.BoxGeometry(w, h, d - 0.06), primaryMat, [0, h / 2, -0.03]);
      // Top & bottom aluminum tracks
      addMesh(new THREE.BoxGeometry(w, 0.036, 0.07), accentMat, [0, h - 0.018, d / 2 - 0.035]);
      addMesh(new THREE.BoxGeometry(w, 0.032, 0.07), accentMat, [0, 0.016, d / 2 - 0.035]);
      const panelW = w * 0.51;
      const panelH = h - 0.068;
      // Left sliding panel: full-height framed mirror (front track)
      addMesh(new THREE.BoxGeometry(panelW, panelH, 0.024), accentMat, [-w * 0.245, h / 2, d / 2 - 0.014]);
      addMesh(new THREE.BoxGeometry(panelW - 0.04, panelH - 0.04, 0.01), mirrorMat, [-w * 0.245, h / 2, d / 2 - 0.001]);
      // Right sliding panel: fluted wood slats + smooth inset (rear track)
      addMesh(new THREE.BoxGeometry(panelW, panelH, 0.024), primaryMat, [w * 0.245, h / 2, d / 2 - 0.042]);
      for (let i = 0; i < 16; i++) {
        const sx = w * 0.02 + i * ((panelW - 0.08) / 15);
        addMesh(new THREE.BoxGeometry(0.026, panelH - 0.04, 0.014), secondaryMat, [sx, h / 2, d / 2 - 0.026]);
      }
      break;
    }

    case 'tr_kids_3door_wardrobe': {
      const legH = 0.12;
      // 4 splayed conical beech legs
      for (const [lx, lz] of [
        [-w * 0.44, d * 0.38],
        [w * 0.44, d * 0.38],
        [-w * 0.44, -d * 0.38],
        [w * 0.44, -d * 0.38],
      ]) {
        addMesh(new THREE.CylinderGeometry(0.022, 0.014, legH, 12), beechMat, [lx, legH / 2, lz]);
      }
      const bodyH = h - legH;
      // Main carcass
      addMesh(new THREE.BoxGeometry(w, bodyH, d - 0.024), primaryMat, [0, legH + bodyH / 2, -0.012]);
      // Left 2 full-height doors
      const colW = w / 3;
      const topDoorH = bodyH - 0.44;
      for (let i = 0; i < 2; i++) {
        const dx = -w / 2 + colW * (i + 0.5);
        addMesh(new THREE.BoxGeometry(colW - 0.008, topDoorH, 0.022), primaryMat, [dx, legH + 0.44 + topDoorH / 2, d / 2 - 0.011]);
        const kx = dx + (i === 0 ? colW * 0.34 : -colW * 0.34);
        addMesh(new THREE.SphereGeometry(0.02, 14, 12), beechMat, [kx, legH + 0.96, d / 2 + 0.016]);
      }
      // Right column: upper door + 2 open pastel cubbies
      const rx = w / 2 - colW / 2;
      addMesh(new THREE.BoxGeometry(colW - 0.008, topDoorH * 0.46, 0.022), accentMat, [rx, h - topDoorH * 0.23, d / 2 - 0.011]);
      addMesh(new THREE.SphereGeometry(0.02, 14, 12), beechMat, [rx - colW * 0.34, h - topDoorH * 0.34, d / 2 + 0.016]);
      // Open cubby shelves + folded blanket & toy basket
      addMesh(new THREE.BoxGeometry(colW - 0.04, 0.02, d - 0.06), beechMat, [rx, legH + 0.44 + topDoorH * 0.26, 0]);
      addMesh(new THREE.BoxGeometry(colW * 0.68, 0.14, d * 0.65), secondaryMat, [rx, legH + 0.52, 0.02]);
      addMesh(new THREE.BoxGeometry(colW * 0.62, 0.12, d * 0.58), accentMat, [rx, legH + 0.44 + topDoorH * 0.34, 0.02]);
      // Bottom 2 wide drawers
      for (let dr = 0; dr < 2; dr++) {
        const dy = legH + 0.11 + dr * 0.21;
        addMesh(new THREE.BoxGeometry(w - 0.02, 0.195, 0.022), dr === 0 ? beechMat : primaryMat, [0, dy, d / 2 - 0.011]);
        addMesh(new THREE.SphereGeometry(0.02, 14, 12), beechMat, [-0.18, dy, d / 2 + 0.016]);
        addMesh(new THREE.SphereGeometry(0.02, 14, 12), beechMat, [0.18, dy, d / 2 + 0.016]);
      }
      break;
    }

    // =========================================================================
    // B. KİTAPLIK & ÇALIŞMA MASASI (4)
    // =========================================================================
    case 'tr_tall_filled_bookcase': {
      // Side walls, back panel, top, bottom
      addMesh(new THREE.BoxGeometry(0.026, h, d), primaryMat, [-w / 2 + 0.013, h / 2, 0]);
      addMesh(new THREE.BoxGeometry(0.026, h, d), primaryMat, [w / 2 - 0.013, h / 2, 0]);
      addMesh(new THREE.BoxGeometry(w, h, 0.018), primaryMat, [0, h / 2, -d / 2 + 0.009]);
      addMesh(new THREE.BoxGeometry(w, 0.028, d), primaryMat, [0, h - 0.014, 0]);
      addMesh(new THREE.BoxGeometry(w, 0.06, d), primaryMat, [0, 0.03, 0]);
      // Bottom closed 2-door cabinet (0.06 -> 0.56)
      addMesh(new THREE.BoxGeometry(w - 0.05, 0.026, d), primaryMat, [0, 0.56, 0]);
      for (const s of [-1, 1]) {
        addMesh(new THREE.BoxGeometry((w - 0.06) / 2 - 0.004, 0.47, 0.02), primaryMat, [s * (w / 4 - 0.01), 0.31, d / 2 - 0.01]);
        addMesh(new THREE.BoxGeometry(0.012, 0.12, 0.02), accentMat, [s * 0.04, 0.42, d / 2 + 0.01]);
      }
      // 4 open shelves with rich curated books + vase + plant
      const shelfYs = [0.57, 0.93, 1.29, 1.65];
      shelfYs.forEach((sy, idx) => {
        if (idx > 0) addMesh(new THREE.BoxGeometry(w - 0.05, 0.024, d - 0.02), secondaryMat, [0, sy - 0.012, 0]);
        // Populate left/right book groups
        const startX = idx % 2 === 0 ? -w / 2 + 0.07 : -0.1;
        const count = idx === 3 ? 6 : 9;
        for (let b = 0; b < count; b++) {
          const bh = 0.21 + ((b * 17 + idx * 7) % 5) * 0.02;
          const bw = 0.028 + ((b + idx) % 3) * 0.007;
          const bx = startX + b * 0.044;
          if (bx > w / 2 - 0.08) break;
          const lean = b === count - 1 && idx % 2 === 0 ? -0.18 : 0;
          addBook(bx, sy, 0.02, bw, bh, 0.21, b + idx * 3, lean);
        }
        // Horizontal stack or ceramic vase + plant on open side
        if (idx === 0) {
          for (let st = 0; st < 3; st++) {
            addMesh(new THREE.BoxGeometry(0.22, 0.032, 0.18), bookMats[(st + 2) % bookMats.length], [0.24, sy + 0.016 + st * 0.033, 0.02]);
          }
        } else if (idx === 1) {
          addMesh(new THREE.CylinderGeometry(0.045, 0.065, 0.2, 18), paperMat, [-0.28, sy + 0.1, 0.02]);
        } else if (idx === 2) {
          const potMat = trackMat(new THREE.MeshStandardMaterial({ color: '#D4CFC5', roughness: 0.6 }));
          const leafMat = trackMat(new THREE.MeshStandardMaterial({ color: '#4E7A56', roughness: 0.72 }));
          addMesh(new THREE.CylinderGeometry(0.055, 0.045, 0.09, 14), potMat, [0.26, sy + 0.045, 0.02]);
          for (let lf = 0; lf < 5; lf++) {
            const ang = (lf / 5) * Math.PI * 2;
            addMesh(new THREE.SphereGeometry(0.042, 10, 8), leafMat, [0.26 + Math.cos(ang) * 0.04, sy + 0.12 + (lf % 2) * 0.03, 0.02 + Math.sin(ang) * 0.04]);
          }
        }
      });
      break;
    }

    case 'tr_arched_fluted_bookcase': {
      const lowerH = 0.72;
      const archR = w / 2;
      const archCenterY = h - archR;
      // Arched back & outer surround via ExtrudeGeometry
      const outer = new THREE.Shape();
      outer.moveTo(-w / 2, 0);
      outer.lineTo(w / 2, 0);
      outer.lineTo(w / 2, archCenterY);
      outer.absarc(0, archCenterY, archR, 0, Math.PI, false);
      outer.closePath();
      const hole = new THREE.Path();
      const pad = 0.045;
      hole.moveTo(-w / 2 + pad, lowerH);
      hole.lineTo(w / 2 - pad, lowerH);
      hole.lineTo(w / 2 - pad, archCenterY);
      hole.absarc(0, archCenterY, archR - pad, 0, Math.PI, false);
      hole.closePath();
      outer.holes.push(hole);
      const archFrameGeo = new THREE.ExtrudeGeometry(outer, { depth: d, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004, curveSegments: 28 });
      archFrameGeo.translate(0, 0, -d / 2);
      addMesh(archFrameGeo, primaryMat);
      // Solid arched back panel
      const backShape = new THREE.Shape();
      backShape.moveTo(-w / 2 + 0.01, 0);
      backShape.lineTo(w / 2 - 0.01, 0);
      backShape.lineTo(w / 2 - 0.01, archCenterY);
      backShape.absarc(0, archCenterY, archR - 0.01, 0, Math.PI, false);
      backShape.closePath();
      const backGeo = new THREE.ExtrudeGeometry(backShape, { depth: 0.022, bevelEnabled: false, curveSegments: 28 });
      backGeo.translate(0, 0, -d / 2);
      addMesh(backGeo, secondaryMat);
      // Warm LED arch halo strip inside top curve
      addMesh(new THREE.TorusGeometry(archR - pad - 0.012, 0.007, 8, 28, Math.PI), warmLedMat, [0, archCenterY, d * 0.25]);
      // 3 open shelves inside arch + books & travertine decor
      for (const [idx, sy] of [0.74, 1.12, 1.5].entries()) {
        const shelfW = idx === 2 ? w - 0.14 : w - 0.09;
        addMesh(new THREE.BoxGeometry(shelfW, 0.026, d - 0.04), secondaryMat, [0, sy, 0]);
        for (let b = 0; b < 5; b++) {
          addBook(-shelfW * 0.36 + b * 0.042, sy + 0.013, 0.02, 0.03, 0.23 + (b % 3) * 0.02, 0.21, b + idx * 2);
        }
        addMesh(new THREE.SphereGeometry(0.062, 18, 14), paperMat, [shelfW * 0.26, sy + 0.075, 0.04]);
      }
      // Fluted 2-door lower cabinet
      for (let i = 0; i < 14; i++) {
        const fx = -w / 2 + 0.065 + i * ((w - 0.13) / 13);
        addMesh(new THREE.CylinderGeometry(0.015, 0.015, lowerH - 0.08, 10), primaryMat, [fx, lowerH / 2, d / 2 + 0.008]);
      }
      addMesh(new THREE.SphereGeometry(0.018, 12, 10), accentMat, [-0.045, lowerH * 0.72, d / 2 + 0.028]);
      addMesh(new THREE.SphereGeometry(0.018, 12, 10), accentMat, [0.045, lowerH * 0.72, d / 2 + 0.028]);
      break;
    }

    case 'tr_study_desk_hutch_set': {
      const deskH = 0.75;
      // Desktop slab
      addMesh(new THREE.BoxGeometry(w, 0.03, d), secondaryMat, [0, deskH, 0]);
      // Left 3-drawer pedestal
      const pedW = 0.4;
      addMesh(new THREE.BoxGeometry(pedW, deskH - 0.03, d - 0.04), primaryMat, [-w / 2 + pedW / 2 + 0.02, (deskH - 0.03) / 2, 0]);
      for (let dr = 0; dr < 3; dr++) {
        const dy = 0.14 + dr * 0.22;
        addMesh(new THREE.BoxGeometry(pedW - 0.02, 0.19, 0.02), primaryMat, [-w / 2 + pedW / 2 + 0.02, dy, d / 2 - 0.01]);
        addMesh(new THREE.BoxGeometry(0.11, 0.014, 0.018), accentMat, [-w / 2 + pedW / 2 + 0.02, dy + 0.02, d / 2 + 0.008]);
      }
      // Right slim frame legs
      addMesh(new THREE.BoxGeometry(0.032, deskH - 0.02, 0.032), accentMat, [w / 2 - 0.05, (deskH - 0.02) / 2, d / 2 - 0.06]);
      addMesh(new THREE.BoxGeometry(0.032, deskH - 0.02, 0.032), accentMat, [w / 2 - 0.05, (deskH - 0.02) / 2, -d / 2 + 0.06]);
      addMesh(new THREE.BoxGeometry(0.03, 0.03, d - 0.12), accentMat, [w / 2 - 0.05, 0.14, 0]);
      // Upper bookshelf hutch (rear 28 cm depth)
      const hutchD = 0.26;
      const hutchZ = -d / 2 + hutchD / 2;
      const hutchH = h - deskH;
      addMesh(new THREE.BoxGeometry(0.026, hutchH, hutchD), primaryMat, [-w / 2 + 0.013, deskH + hutchH / 2, hutchZ]);
      addMesh(new THREE.BoxGeometry(0.026, hutchH, hutchD), primaryMat, [w / 2 - 0.013, deskH + hutchH / 2, hutchZ]);
      addMesh(new THREE.BoxGeometry(w, 0.026, hutchD), primaryMat, [0, h - 0.013, hutchZ]);
      addMesh(new THREE.BoxGeometry(w, 0.024, hutchD), primaryMat, [0, deskH + 0.44, hutchZ]);
      addMesh(new THREE.BoxGeometry(0.024, hutchH - 0.44, hutchD), primaryMat, [0.1, deskH + 0.44 + (hutchH - 0.44) / 2, hutchZ]);
      // Under-hutch warm task LED bar
      addMesh(new THREE.BoxGeometry(w * 0.72, 0.01, 0.016), warmLedMat, [0, deskH + 0.422, hutchZ + hutchD * 0.38]);
      // Books on hutch shelf
      for (let b = 0; b < 10; b++) {
        addBook(-w / 2 + 0.08 + b * 0.044, deskH + 0.455, hutchZ + 0.02, 0.032, 0.22 + (b % 3) * 0.025, 0.19, b);
      }
      // Desktop ready props: open notebook + pen cup
      addMesh(new THREE.BoxGeometry(0.28, 0.012, 0.21), paperMat, [0.06, deskH + 0.021, 0.08], [0, 0.08, 0]);
      addMesh(new THREE.CylinderGeometry(0.038, 0.034, 0.095, 16), accentMat, [0.38, deskH + 0.062, -0.02]);
      break;
    }

    case 'tr_montessori_kids_bookshelf': {
      // Rounded natural beechwood side panels + rear support
      addMesh(new THREE.BoxGeometry(0.024, h, d), beechMat, [-w / 2 + 0.012, h / 2, 0]);
      addMesh(new THREE.BoxGeometry(0.024, h, d), beechMat, [w / 2 - 0.012, h / 2, 0]);
      addMesh(new THREE.BoxGeometry(w, h * 0.92, 0.018), primaryMat, [0, h * 0.46, -d / 2 + 0.009]);
      // Bottom toy storage box bin
      addMesh(new THREE.BoxGeometry(w - 0.048, 0.22, d - 0.04), primaryMat, [0, 0.11, 0.01]);
      // 3 front-facing storybook ledges with wooden safety rails + illustrated storybooks!
      const titles = [
        ['MASAL', '#E07A5F', '#F2CC8F'],
        ['UZAY', '#3B6E8C', '#FACC15'],
        ['DOĞA', '#6A994E', '#A7C957'],
        ['DİNO', '#D97706', '#FDE68A'],
        ['DENİZ', '#2563EB', '#93C5FD'],
        ['RENK', '#DB2777', '#FBCFE8'],
      ];
      for (let tier = 0; tier < 3; tier++) {
        const ty = 0.28 + tier * 0.22;
        const tz = 0.05 - tier * 0.055;
        addMesh(new THREE.BoxGeometry(w - 0.048, 0.018, 0.08), beechMat, [0, ty, tz]);
        // Wooden front safety dowel rail
        addMesh(new THREE.CylinderGeometry(0.009, 0.009, w - 0.048, 12), beechMat, [0, ty + 0.075, tz + 0.038], [0, 0, Math.PI / 2]);
        // 3 illustrated front-facing storybooks per tier
        for (let b = 0; b < 3; b++) {
          const [txt, bg, motif] = titles[(tier * 3 + b) % titles.length];
          const covTex = trackTex(makeStorybookTex(txt, bg, motif, maxAnisotropy));
          const covMat = trackMat(new THREE.MeshStandardMaterial({ map: covTex, roughness: 0.65 }));
          addMesh(
            new THREE.BoxGeometry(0.19, 0.21, 0.016),
            covMat,
            [-w * 0.31 + b * (w * 0.31), ty + 0.115, tz + 0.004],
            [-0.14, 0, 0],
          );
        }
      }
      break;
    }

    // =========================================================================
    // C. KALEMLİK, KIRTASİYE & DERS KİTAPLARI (5)
    // =========================================================================
    case 'tr_pen_holder_stationery_set': {
      // Sleek base tray
      addMesh(new THREE.BoxGeometry(w, 0.012, d), secondaryMat, [0, 0.006, 0]);
      // Fluted pen cup on left
      const cupX = -w * 0.22;
      const cupH = 0.105;
      addMesh(new THREE.CylinderGeometry(0.042, 0.038, cupH, 20), primaryMat, [cupX, 0.012 + cupH / 2, -0.01]);
      // Brass rim ring
      addMesh(new THREE.TorusGeometry(0.042, 0.003, 10, 24), accentMat, [cupX, 0.012 + cupH, -0.01], [Math.PI / 2, 0, 0]);
      // 8 sharpened colorful pencils + ruler + scissors sticking out
      const pencilHex = ['#EAB308', '#EF4444', '#2563EB', '#16A34A', '#F97316', '#9333EA', '#0EA5E9', '#1E293B'];
      pencilHex.forEach((hex, idx) => {
        const ang = (idx / pencilHex.length) * Math.PI * 2;
        const px = cupX + Math.cos(ang) * 0.018;
        const pz = -0.01 + Math.sin(ang) * 0.018;
        const pLen = 0.145 + (idx % 3) * 0.012;
        const pMat = trackMat(new THREE.MeshStandardMaterial({ color: hex, roughness: 0.5 }));
        const tiltX = Math.sin(ang) * 0.16;
        const tiltZ = -Math.cos(ang) * 0.16;
        addMesh(new THREE.CylinderGeometry(0.004, 0.004, pLen, 6), pMat, [px, 0.016 + pLen / 2, pz], [tiltX, 0, tiltZ]);
        // Sharpened wood tip cone
        addMesh(
          new THREE.ConeGeometry(0.004, 0.016, 6),
          beechMat,
          [px - Math.sin(tiltZ) * (pLen / 2 + 0.007), 0.016 + pLen + 0.006, pz + Math.sin(tiltX) * (pLen / 2 + 0.007)],
          [tiltX, 0, tiltZ],
        );
      });
      // Wooden 16 cm ruler angled in cup
      addMesh(new THREE.BoxGeometry(0.024, 0.165, 0.004), beechMat, [cupX + 0.014, 0.095, -0.026], [-0.14, 0.2, -0.18]);
      // Sticky note cube on right front
      const noteMat = trackMat(new THREE.MeshStandardMaterial({ color: '#FEF08A', roughness: 0.85 }));
      addMesh(new THREE.BoxGeometry(0.076, 0.042, 0.076), noteMat, [w * 0.22, 0.033, 0.028]);
      // Mini brass paperclip dish on right back
      addMesh(new THREE.CylinderGeometry(0.036, 0.03, 0.024, 18), accentMat, [w * 0.22, 0.024, -0.042]);
      break;
    }

    case 'tr_desk_organizer_tray': {
      // Base walnut tray + perimeter walls
      addMesh(new THREE.BoxGeometry(w, 0.016, d), primaryMat, [0, 0.008, 0]);
      addMesh(new THREE.BoxGeometry(w, 0.048, 0.012), primaryMat, [0, 0.028, d / 2 - 0.006]);
      addMesh(new THREE.BoxGeometry(w, 0.095, 0.012), primaryMat, [0, 0.055, -d / 2 + 0.006]);
      addMesh(new THREE.BoxGeometry(0.012, 0.068, d), primaryMat, [-w / 2 + 0.006, 0.04, 0]);
      addMesh(new THREE.BoxGeometry(0.012, 0.068, d), primaryMat, [w / 2 - 0.006, 0.04, 0]);
      // Internal brass/wood dividers
      addMesh(new THREE.BoxGeometry(w - 0.02, 0.08, 0.008), accentMat, [0, 0.048, -d * 0.14]);
      addMesh(new THREE.BoxGeometry(0.008, 0.05, d * 0.6), accentMat, [-w * 0.12, 0.032, d * 0.18]);
      // Rear slot: 2 vertical notebooks
      addMesh(new THREE.BoxGeometry(0.24, 0.11, 0.016), bookMats[0], [-0.02, 0.065, -d * 0.34]);
      addMesh(new THREE.BoxGeometry(0.22, 0.095, 0.014), bookMats[6], [0.01, 0.058, -d * 0.24]);
      // Left front: slim pens resting horizontally
      addMesh(new THREE.CylinderGeometry(0.005, 0.005, 0.14, 10), accentMat, [-w * 0.3, 0.022, d * 0.16], [0, 0.12, Math.PI / 2]);
      addMesh(new THREE.CylinderGeometry(0.005, 0.005, 0.13, 10), darkMat, [-w * 0.29, 0.022, d * 0.24], [0, -0.08, Math.PI / 2]);
      // Right front: tilted smartphone on stand
      addMesh(new THREE.BoxGeometry(0.072, 0.135, 0.009), darkMat, [w * 0.22, 0.076, d * 0.16], [-0.35, -0.1, 0]);
      const phoneScr = trackMat(new THREE.MeshStandardMaterial({ color: '#38BDF8', emissive: '#0284C7', emissiveIntensity: 0.45, roughness: 0.12 }));
      addMesh(new THREE.PlaneGeometry(0.064, 0.122), phoneScr, [w * 0.22, 0.076, d * 0.167], [-0.35, -0.1, 0]);
      break;
    }

    case 'tr_turkish_textbooks_stack': {
      const books: Array<[string, string, string, string, number, number]> = [
        ['MATEMATİK', 'TYT · AYT', '#1E3A8A', '#F59E0B', 0.036, 0.02],
        ['FİZİK', 'KONU ANLATIMI', '#991B1B', '#FDE047', 0.032, -0.05],
        ['GEOMETRİ', 'SORU BANKASI', '#14532D', '#4ADE80', 0.034, 0.06],
        ['EDEBİYAT', 'LİSE DERS KİTABI', '#581C87', '#E879F9', 0.028, -0.03],
        ['MİMARİ PROJE', 'TEKNİK ÇİZİM', '#334155', '#38BDF8', 0.032, 0.04],
      ];
      let curY = 0;
      books.forEach(([title, sub, bg, acc, bh, rotY], i) => {
        const bw = 0.22 - i * 0.006;
        const bd = 0.27 - i * 0.006;
        const coverThick = 0.0035;
        const coverTex = trackTex(makeBookCoverTex(title, sub, bg, acc, maxAnisotropy));
        const spineMat = trackMat(new THREE.MeshStandardMaterial({ color: bg, roughness: 0.62 }));
        const topCoverMats = [
          spineMat,
          spineMat,
          trackMat(new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.52 })),
          spineMat,
          spineMat,
          spineMat,
        ];
        const bGrp = new THREE.Group();
        bGrp.position.set(-0.02 + (i % 2) * 0.008, curY, 0);
        bGrp.rotation.y = rotY;
        // Bottom board
        const bot = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(bw, coverThick, bd)), spineMat);
        bot.position.y = coverThick / 2;
        bot.castShadow = true;
        bot.receiveShadow = true;
        bGrp.add(bot);
        // Slightly recessed crisp white page block
        const pages = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(bw - 0.009, bh - coverThick * 2, bd - 0.008)),
          paperMat,
        );
        pages.position.set(0.002, bh / 2, 0);
        pages.castShadow = true;
        pages.receiveShadow = true;
        bGrp.add(pages);
        // Spine wrap on left edge (-X)
        const spine = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.006, bh, bd)), spineMat);
        spine.position.set(-bw / 2 + 0.003, bh / 2, 0);
        spine.castShadow = true;
        bGrp.add(spine);
        // Top printed cover board
        const top = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(bw, coverThick, bd)), topCoverMats);
        top.position.y = bh - coverThick / 2;
        top.castShadow = true;
        top.receiveShadow = true;
        bGrp.add(top);
        group.add(bGrp);
        curY += bh + 0.002;
      });
      // Highlighter pen resting diagonally near front-right corner so top book title stays 100% legible
      const hlMat = trackMat(new THREE.MeshStandardMaterial({ color: '#FACC15', roughness: 0.35 }));
      const hlCapMat = trackMat(new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.4 }));
      const hlGrp = new THREE.Group();
      hlGrp.position.set(0.035, curY + 0.008, 0.075);
      hlGrp.rotation.y = 0.38;
      hlGrp.add(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.088, 0.014, 0.02)), hlMat));
      const hlCap = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.026, 0.015, 0.021)), hlCapMat);
      hlCap.position.x = 0.056;
      hlGrp.add(hlCap);
      group.add(hlGrp);
      break;
    }

    case 'tr_open_textbook_study_set': {
      // Open textbook on left with gently curved left & right pages + diagram texture
      const pageTex = trackTex(makeOpenBookPageTex(maxAnisotropy));
      const pageMat = trackMat(new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.8 }));
      const bx = -0.07;
      addMesh(new THREE.BoxGeometry(0.36, 0.008, 0.26), primaryMat, [bx, 0.004, 0]);
      addMesh(new THREE.BoxGeometry(0.34, 0.022, 0.245), paperMat, [bx, 0.016, 0]);
      addMesh(new THREE.PlaneGeometry(0.34, 0.242), pageMat, [bx, 0.0285, 0], [-Math.PI / 2, 0, 0]);
      // Spiral notebook angled on right
      const nx = 0.19;
      addMesh(new THREE.BoxGeometry(0.16, 0.014, 0.22), secondaryMat, [nx, 0.007, 0.03], [0, -0.22, 0]);
      addMesh(new THREE.BoxGeometry(0.152, 0.012, 0.212), paperMat, [nx, 0.014, 0.03], [0, -0.22, 0]);
      // Spiral rings
      for (let r = 0; r < 9; r++) {
        addMesh(new THREE.TorusGeometry(0.008, 0.0015, 6, 12), accentMat, [nx - 0.078, 0.015, -0.055 + r * 0.021], [0, -0.22, 0]);
      }
      // Yellow pencil + pastel highlighter + eraser
      addMesh(new THREE.CylinderGeometry(0.004, 0.004, 0.16, 6), trackMat(new THREE.MeshStandardMaterial({ color: '#EAB308', roughness: 0.45 })), [0.06, 0.032, 0.09], [0, 0.55, Math.PI / 2]);
      addMesh(new THREE.BoxGeometry(0.11, 0.014, 0.02), trackMat(new THREE.MeshStandardMaterial({ color: '#FB7185', roughness: 0.35 })), [0.16, 0.028, -0.11], [0, -0.35, 0]);
      // Transparent architectural 30-60-90 triangle ruler (gönye)
      const tri = new THREE.Shape();
      tri.moveTo(0, 0);
      tri.lineTo(0.15, 0);
      tri.lineTo(0, 0.11);
      tri.closePath();
      const triGeo = new THREE.ExtrudeGeometry(tri, { depth: 0.003, bevelEnabled: false });
      triGeo.rotateX(-Math.PI / 2);
      addMesh(triGeo, clearGlassMat, [-0.14, 0.031, 0.12], [0, 0.28, 0]);
      break;
    }

    case 'tr_bookends_encyclopedia_row': {
      // Left & right half-arch honed travertine bookends
      const archShape = new THREE.Shape();
      archShape.moveTo(-0.06, 0);
      archShape.lineTo(0.06, 0);
      archShape.lineTo(0.06, 0.11);
      archShape.absarc(0, 0.11, 0.06, 0, Math.PI, false);
      archShape.closePath();
      const endGeo = new THREE.ExtrudeGeometry(archShape, { depth: 0.038, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, curveSegments: 20 });
      endGeo.rotateY(Math.PI / 2);
      addMesh(endGeo, primaryMat, [-w / 2 + 0.02, 0, 0]);
      addMesh(endGeo.clone(), primaryMat, [w / 2 - 0.058, 0, 0]);
      // 13 varied architectural books between bookends
      for (let i = 0; i < 13; i++) {
        const bx = -w / 2 + 0.08 + i * 0.033;
        const bh = 0.2 + ((i * 11) % 6) * 0.014;
        const bd = 0.17 + (i % 3) * 0.018;
        const bw = 0.024 + (i % 2) * 0.006;
        const lean = i === 12 ? -0.16 : 0;
        addBook(bx, 0, 0, bw, bh, bd, i, lean);
      }
      break;
    }

    // =========================================================================
    // D. LAPTOP & ÇALIŞMA İSTASYONLARI (3)
    // =========================================================================
    case 'tr_modern_ultrabook_laptop': {
      addLaptopUnit(0, 0, 0.02, w, d, 'blender', primaryMat);
      break;
    }

    case 'tr_laptop_stand_workstation': {
      // Anthracite felt desk mat
      const matMeshMat = trackMat(new THREE.MeshStandardMaterial({ color: '#343942', roughness: 0.92 }));
      addMesh(new THREE.BoxGeometry(w, 0.006, d), matMeshMat, [0, 0.003, 0]);
      // Bent anodized aluminum laptop riser stand (back center-left)
      const standX = -0.05;
      const standZ = -0.05;
      addMesh(new THREE.BoxGeometry(0.24, 0.008, 0.18), primaryMat, [standX, 0.01, standZ]);
      addMesh(new THREE.BoxGeometry(0.22, 0.1, 0.01), primaryMat, [standX, 0.056, standZ - 0.04], [-0.36, 0, 0]);
      addMesh(new THREE.BoxGeometry(0.25, 0.008, 0.19), primaryMat, [standX, 0.098, standZ], [0.22, 0, 0]);
      // 15" open ultrabook perched on stand
      addLaptopUnit(standX, 0.104, standZ + 0.01, 0.33, 0.22, 'slides', primaryMat);
      // Slim wireless keyboard in front
      const kbTex = trackTex(makeKeyboardTex(maxAnisotropy));
      const kbTopMat = trackMat(new THREE.MeshStandardMaterial({ map: kbTex, roughness: 0.45 }));
      addMesh(new THREE.BoxGeometry(0.29, 0.01, 0.115), primaryMat, [standX, 0.011, 0.105]);
      addMesh(new THREE.PlaneGeometry(0.275, 0.102), kbTopMat, [standX, 0.017, 0.105], [-Math.PI / 2, 0, 0]);
      // Wireless mouse on right
      const mouseGeo = new THREE.SphereGeometry(0.032, 16, 12);
      mouseGeo.scale(0.85, 0.55, 1.5);
      addMesh(mouseGeo, darkMat, [0.18, 0.018, 0.105]);
      // Ceramic coffee mug + handle + dark coffee top
      const mugX = 0.23;
      const mugZ = -0.06;
      addMesh(new THREE.CylinderGeometry(0.038, 0.034, 0.092, 20), paperMat, [mugX, 0.052, mugZ]);
      addMesh(new THREE.TorusGeometry(0.022, 0.005, 8, 16, Math.PI), paperMat, [mugX + 0.036, 0.054, mugZ], [0, 0, -Math.PI / 2]);
      addMesh(new THREE.CylinderGeometry(0.033, 0.033, 0.004, 18), trackMat(new THREE.MeshStandardMaterial({ color: '#3A2314', roughness: 0.18 })), [mugX, 0.092, mugZ]);
      break;
    }

    case 'tr_dual_monitor_desk_setup': {
      // Wide felt desk mat
      const feltMat = trackMat(new THREE.MeshStandardMaterial({ color: '#2F343D', roughness: 0.92 }));
      addMesh(new THREE.BoxGeometry(0.84, 0.006, 0.34), feltMat, [0, 0.003, 0.04]);
      // Central clamp pole + dual articulated monitor arms safely behind angled screens
      addMesh(new THREE.CylinderGeometry(0.018, 0.018, 0.42, 14), darkMat, [0, 0.21, -0.19]);
      addMesh(new THREE.BoxGeometry(0.08, 0.022, 0.08), darkMat, [0, 0.011, -0.19]);
      addMesh(new THREE.BoxGeometry(0.62, 0.022, 0.022), darkMat, [0, 0.35, -0.185]);
      // Rear VESA bracket blocks connecting arm to monitor backs
      addMesh(new THREE.BoxGeometry(0.09, 0.09, 0.05), darkMat, [-0.28, 0.35, -0.155]);
      addMesh(new THREE.BoxGeometry(0.09, 0.09, 0.05), darkMat, [0.28, 0.35, -0.155]);
      // Left & right 27" frameless monitors angled inward 11 deg
      const monW = 0.57;
      const monH = 0.33;
      const modes: Array<['cad' | 'blender', number, number]> = [
        ['cad', -0.295, 0.18],
        ['blender', 0.295, -0.18],
      ];
      modes.forEach(([mode, mx, rotY]) => {
        const mGrp = new THREE.Group();
        mGrp.position.set(mx, 0.35, -0.09);
        mGrp.rotation.y = rotY;
        const housing = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(monW, monH, 0.018)), primaryMat);
        housing.castShadow = true;
        mGrp.add(housing);
        const tex = trackTex(makeArchScreenTex(mode, maxAnisotropy));
        const sMat = trackMat(new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: '#FFFFFF', emissiveIntensity: 0.65, roughness: 0.14 }));
        const scr = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(monW - 0.022, monH - 0.024)), sMat);
        scr.position.z = 0.01;
        mGrp.add(scr);
        group.add(mGrp);
      });
      // Mechanical keyboard + mouse
      const kbTex = trackTex(makeKeyboardTex(maxAnisotropy));
      addMesh(new THREE.BoxGeometry(0.36, 0.022, 0.13), primaryMat, [-0.04, 0.017, 0.09]);
      addMesh(new THREE.PlaneGeometry(0.34, 0.115), trackMat(new THREE.MeshStandardMaterial({ map: kbTex, roughness: 0.5 })), [-0.04, 0.029, 0.09], [-Math.PI / 2, 0, 0]);
      const mGeo = new THREE.SphereGeometry(0.032, 14, 12);
      mGeo.scale(0.85, 0.58, 1.45);
      addMesh(mGeo, darkMat, [0.22, 0.02, 0.09]);
      // Left & right studio bookshelf speakers with copper woofer cones
      for (const sx of [-0.52, 0.52]) {
        addMesh(new THREE.BoxGeometry(0.12, 0.2, 0.14), secondaryMat, [sx, 0.1, -0.03], [0, sx < 0 ? 0.22 : -0.22, 0]);
        addMesh(new THREE.CylinderGeometry(0.036, 0.026, 0.012, 18), accentMat, [sx, 0.08, 0.04], [Math.PI / 2, 0, 0]);
        addMesh(new THREE.CylinderGeometry(0.018, 0.016, 0.012, 14), darkMat, [sx, 0.15, 0.04], [Math.PI / 2, 0, 0]);
      }
      break;
    }

    // =========================================================================
    // E. OYUNCAKLAR & KÜÇÜK ÇOCUK / BEBEK OYUNCAKLARI (6)
    // =========================================================================
    case 'tr_montessori_rainbow_blocks': {
      // 7 concentric wooden Montessori rainbow arches (left-center)
      const rainbowColors = ['#D46A56', '#E59A54', '#E9C46A', '#7FA989', '#5B8FB9', '#7B74A8', '#E0B4A4'];
      const rx = -0.05;
      rainbowColors.forEach((hex, idx) => {
        const outerR = 0.175 - idx * 0.02;
        const innerR = outerR - 0.017;
        const arch = new THREE.Shape();
        arch.absarc(0, 0, outerR, 0, Math.PI, false);
        arch.lineTo(-innerR, 0);
        arch.absarc(0, 0, innerR, Math.PI, 0, true);
        arch.closePath();
        const geo = new THREE.ExtrudeGeometry(arch, { depth: 0.068, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, curveSegments: 24 });
        geo.translate(0, 0, -0.034);
        const mat = trackMat(new THREE.MeshStandardMaterial({ color: hex, roughness: 0.56 }));
        addMesh(geo, mat, [rx, 0, -0.02]);
      });
      // Natural wooden geometric balance blocks arranged beside rainbow
      addMesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), beechMat, [0.15, 0.03, 0.04], [0, 0.35, 0]);
      addMesh(new THREE.CylinderGeometry(0.028, 0.028, 0.075, 16), beechMat, [0.15, 0.098, 0.04]);
      addMesh(new THREE.ConeGeometry(0.032, 0.065, 4), trackMat(new THREE.MeshStandardMaterial({ color: '#7FA989', roughness: 0.54 })), [0.15, 0.168, 0.04], [0, Math.PI / 4, 0]);
      addMesh(new THREE.BoxGeometry(0.11, 0.028, 0.048), beechMat, [0.06, 0.014, 0.09], [0, -0.25, 0]);
      addMesh(new THREE.CylinderGeometry(0.022, 0.022, 0.08, 14), trackMat(new THREE.MeshStandardMaterial({ color: '#E9C46A', roughness: 0.54 })), [-0.14, 0.022, 0.085], [0, 0.4, Math.PI / 2]);
      break;
    }

    case 'tr_toddler_wooden_abacus_xylophone': {
      // Left: Wooden A-frame toddler abacus with 5 metal rods & 35 colorful beads
      const ax = -0.1;
      const az = -0.04;
      addMesh(new THREE.BoxGeometry(0.22, 0.018, 0.08), beechMat, [ax, 0.009, az]);
      addMesh(new THREE.BoxGeometry(0.018, 0.24, 0.04), beechMat, [ax - 0.1, 0.125, az]);
      addMesh(new THREE.BoxGeometry(0.018, 0.24, 0.04), beechMat, [ax + 0.1, 0.125, az]);
      addMesh(new THREE.BoxGeometry(0.22, 0.022, 0.04), beechMat, [ax, 0.245, az]);
      const beadColors = ['#E07A5F', '#F2CC8F', '#81B29A', '#5B8FB9', '#B5838D'];
      for (let row = 0; row < 5; row++) {
        const ry = 0.055 + row * 0.038;
        addMesh(new THREE.CylinderGeometry(0.003, 0.003, 0.19, 8), accentMat, [ax, ry, az], [0, 0, Math.PI / 2]);
        const bMat = trackMat(new THREE.MeshStandardMaterial({ color: beadColors[row], roughness: 0.45 }));
        for (let b = 0; b < 6; b++) {
          const offset = b < 3 ? -0.072 + b * 0.022 : 0.026 + (b - 3) * 0.022;
          addMesh(new THREE.SphereGeometry(0.011, 12, 10), bMat, [ax + offset, ry, az]);
        }
      }
      // Front-right: 8-key rainbow wooden xylophone + 2 wooden mallets
      const xx = 0.07;
      const xz = 0.065;
      addMesh(new THREE.BoxGeometry(0.24, 0.018, 0.12), beechMat, [xx, 0.009, xz], [0, -0.18, 0]);
      const xyloColors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'];
      xyloColors.forEach((hex, idx) => {
        const kx = xx - 0.095 + idx * 0.027;
        const kLen = 0.115 - idx * 0.005;
        addMesh(
          new THREE.BoxGeometry(0.022, 0.012, kLen),
          trackMat(new THREE.MeshStandardMaterial({ color: hex, roughness: 0.35 })),
          [kx, 0.024, xz + idx * 0.004],
          [0, -0.18, 0],
        );
      });
      // Mallet resting across xylophone
      addMesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.14, 8), beechMat, [xx + 0.01, 0.036, xz + 0.02], [0, 0.5, Math.PI / 2]);
      addMesh(new THREE.SphereGeometry(0.012, 12, 10), trackMat(new THREE.MeshStandardMaterial({ color: '#E07A5F', roughness: 0.4 })), [xx + 0.07, 0.038, xz - 0.015]);
      // Back-right: Wooden shape sorter cube
      addMesh(new THREE.BoxGeometry(0.11, 0.11, 0.11), beechMat, [0.13, 0.055, -0.06], [0, 0.25, 0]);
      addMesh(new THREE.CylinderGeometry(0.018, 0.018, 0.03, 12), trackMat(new THREE.MeshStandardMaterial({ color: '#5B8FB9', roughness: 0.48 })), [0.13, 0.12, -0.06]);
      break;
    }

    case 'tr_kids_teepee_play_tent': {
      const r = w * 0.48;
      // 4 natural beechwood teepee poles crossing near apex
      const poleCorners: Array<[number, number]> = [
        [-r, -r],
        [r, -r],
        [r, r],
        [-r, r],
      ];
      const apexY = h * 0.86;
      poleCorners.forEach(([px, pz]) => {
        const start = new THREE.Vector3(px, 0, pz);
        const dir = new THREE.Vector3(-px * 0.18, h, -pz * 0.18).sub(start);
        const len = dir.length();
        const mid = start.clone().addScaledVector(dir, 0.5);
        const cyl = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.016, 0.018, len, 10)), beechMat);
        cyl.position.copy(mid);
        cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        cyl.castShadow = true;
        group.add(cyl);
      });
      // Rope tie collar at apex
      addMesh(new THREE.TorusGeometry(0.052, 0.012, 8, 16), accentMat, [0, apexY, 0], [Math.PI / 2, 0, 0]);
      // 3 closed canvas side panels (back, left, right) + 2 tied-back front doorway curtains
      const tentMat = trackMat(new THREE.MeshStandardMaterial({ color: pHex, roughness: 0.9, side: THREE.DoubleSide }));
      const addTriPanel = (a: [number, number, number], b: [number, number, number], c: [number, number, number], mat: THREE.Material) => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c], 3));
        g.computeVertexNormals();
        addMesh(g, mat);
      };
      addTriPanel([-r, 0.02, -r], [r, 0.02, -r], [0, apexY, 0], tentMat);
      addTriPanel([-r, 0.02, r], [-r, 0.02, -r], [0, apexY, 0], tentMat);
      addTriPanel([r, 0.02, -r], [r, 0.02, r], [0, apexY, 0], tentMat);
      // Front doorway tied-back flaps
      addTriPanel([-r, 0.02, r], [-r * 0.42, 0.02, r], [0, apexY, 0], tentMat);
      addTriPanel([r * 0.42, 0.02, r], [r, 0.02, r], [0, apexY, 0], tentMat);
      // Warm glowing fairy LED bulbs along doorway opening
      for (let i = 0; i < 9; i++) {
        const t = i / 8;
        const lx = -r * 0.46 + t * (r * 0.92);
        const ly = apexY * (1 - Math.abs(t - 0.5) * 1.45);
        addMesh(new THREE.SphereGeometry(0.015, 10, 8), warmLedMat, [lx, ly, r * (1 - ly / apexY) + 0.04]);
      }
      // Quilted floor mat inside + 3 cozy pillows
      addMesh(new THREE.CylinderGeometry(r * 0.88, r * 0.9, 0.036, 28), secondaryMat, [0, 0.018, 0]);
      const pColors = [aHex, '#E07A5F', '#81B29A'];
      [
        [-0.22, 0.14, -0.18, 0.3],
        [0.2, 0.14, -0.16, -0.35],
        [0, 0.13, -0.24, 0.05],
      ].forEach(([cx, cy, cz, ry], idx) => {
        const pGeo = new THREE.SphereGeometry(0.14, 14, 12);
        pGeo.scale(1.1, 0.85, 0.55);
        addMesh(pGeo, trackMat(new THREE.MeshStandardMaterial({ color: pColors[idx], roughness: 0.9 })), [cx, cy, cz], [-0.25, ry, 0]);
      });
      break;
    }

    case 'tr_wooden_kids_play_kitchen': {
      const counterH = 0.52;
      // Lower cabinet body + plinth
      addMesh(new THREE.BoxGeometry(w, counterH, d), primaryMat, [0, counterH / 2, 0]);
      addMesh(new THREE.BoxGeometry(w + 0.016, 0.026, d + 0.016), beechMat, [0, counterH + 0.013, 0]);
      // Left oven door with clear window & handle + 3 clicking knobs
      addMesh(new THREE.BoxGeometry(w * 0.44, 0.3, 0.018), primaryMat, [-w * 0.24, 0.22, d / 2 + 0.008]);
      addMesh(new THREE.BoxGeometry(w * 0.3, 0.16, 0.01), clearGlassMat, [-w * 0.24, 0.23, d / 2 + 0.018]);
      addMesh(new THREE.CylinderGeometry(0.008, 0.008, 0.2, 10), beechMat, [-w * 0.24, 0.34, d / 2 + 0.026], [0, 0, Math.PI / 2]);
      for (let k = 0; k < 3; k++) {
        addMesh(new THREE.CylinderGeometry(0.016, 0.016, 0.018, 12), accentMat, [-w * 0.34 + k * 0.08, 0.44, d / 2 + 0.01], [Math.PI / 2, 0, 0]);
      }
      // Right cupboard door + wooden knob
      addMesh(new THREE.BoxGeometry(w * 0.42, 0.38, 0.018), secondaryMat, [w * 0.25, 0.26, d / 2 + 0.008]);
      addMesh(new THREE.SphereGeometry(0.016, 12, 10), beechMat, [w * 0.1, 0.34, d / 2 + 0.024]);
      // Countertop: left 2 stove burners + mini pot, right stainless sink + faucet
      for (const bx of [-w * 0.31, -w * 0.16]) {
        addMesh(new THREE.CylinderGeometry(0.052, 0.052, 0.004, 18), darkMat, [bx, counterH + 0.028, 0.02]);
      }
      addMesh(new THREE.CylinderGeometry(0.048, 0.044, 0.065, 16), accentMat, [-w * 0.31, counterH + 0.062, 0.02]);
      addMesh(new THREE.BoxGeometry(0.2, 0.02, 0.17), trackMat(new THREE.MeshStandardMaterial({ color: '#CBD5E1', roughness: 0.22, metalness: 0.85 })), [w * 0.24, counterH + 0.024, 0.02]);
      addMesh(new THREE.CylinderGeometry(0.008, 0.008, 0.12, 10), accentMat, [w * 0.24, counterH + 0.085, -0.08]);
      addMesh(new THREE.BoxGeometry(0.014, 0.014, 0.075), accentMat, [w * 0.24, counterH + 0.14, -0.045]);
      // Upper backsplash + toy microwave + shelf
      addMesh(new THREE.BoxGeometry(w, h - counterH, 0.02), primaryMat, [0, counterH + (h - counterH) / 2, -d / 2 + 0.01]);
      addMesh(new THREE.BoxGeometry(w * 0.48, 0.22, 0.18), secondaryMat, [-w * 0.22, h - 0.12, -d / 2 + 0.095]);
      addMesh(new THREE.BoxGeometry(w * 0.3, 0.14, 0.01), clearGlassMat, [-w * 0.25, h - 0.12, -d / 2 + 0.186]);
      addMesh(new THREE.BoxGeometry(w * 0.44, 0.02, 0.14), beechMat, [w * 0.25, h - 0.2, -d / 2 + 0.075]);
      break;
    }

    case 'tr_kids_toy_storage_organizer': {
      // Rounded birchwood side frames + bottom rail
      addMesh(new THREE.BoxGeometry(0.024, h, d), beechMat, [-w / 2 + 0.012, h / 2, 0]);
      addMesh(new THREE.BoxGeometry(0.024, h, d), beechMat, [w / 2 - 0.012, h / 2, 0]);
      addMesh(new THREE.BoxGeometry(w, 0.024, d * 0.85), beechMat, [0, 0.04, 0]);
      const binColors = ['#F4F1EA', '#E5B88B', '#8FB09C', '#E29578', '#8EB8D4', '#F2CC8F'];
      for (let row = 0; row < 3; row++) {
        const ry = 0.16 + row * 0.25;
        // Metal support rails
        addMesh(new THREE.CylinderGeometry(0.008, 0.008, w - 0.04, 10), accentMat, [0, ry - 0.06, -0.06], [0, 0, Math.PI / 2]);
        addMesh(new THREE.CylinderGeometry(0.008, 0.008, w - 0.04, 10), accentMat, [0, ry - 0.09, 0.08], [0, 0, Math.PI / 2]);
        for (let col = 0; col < 3; col++) {
          const bx = -w * 0.31 + col * (w * 0.31);
          const bwBin = w * 0.282;
          const bhBin = 0.14;
          const bdBin = d * 0.8;
          const wallT = 0.01;
          const bMat = trackMat(new THREE.MeshStandardMaterial({ color: binColors[(row * 3 + col) % binColors.length], roughness: 0.58 }));
          const binGrp = new THREE.Group();
          binGrp.position.set(bx, ry, 0.01);
          binGrp.rotation.x = 0.18;
          // Open-top hollow basket (bottom + 4 walls)
          const bBot = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(bwBin, wallT, bdBin)), bMat);
          bBot.position.y = -bhBin / 2 + wallT / 2;
          binGrp.add(bBot);
          const bFront = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(bwBin, bhBin * 0.85, wallT)), bMat);
          bFront.position.set(0, -bhBin * 0.075, bdBin / 2 - wallT / 2);
          binGrp.add(bFront);
          const bBack = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(bwBin, bhBin, wallT)), bMat);
          bBack.position.set(0, 0, -bdBin / 2 + wallT / 2);
          binGrp.add(bBack);
          const bLeft = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(wallT, bhBin, bdBin)), bMat);
          bLeft.position.set(-bwBin / 2 + wallT / 2, 0, 0);
          binGrp.add(bLeft);
          const bRight = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(wallT, bhBin, bdBin)), bMat);
          bRight.position.set(bwBin / 2 - wallT / 2, 0, 0);
          binGrp.add(bRight);
          // Wooden toy blocks & balls nestled inside the open bin
          const cube = new THREE.Mesh(
            trackGeo(new THREE.BoxGeometry(0.056, 0.056, 0.056)),
            bookMats[(row + col * 2) % bookMats.length],
          );
          cube.position.set(-0.045, 0.032, 0.01);
          cube.rotation.set(0.25, 0.45, 0.12);
          binGrp.add(cube);
          const ball = new THREE.Mesh(
            trackGeo(new THREE.SphereGeometry(0.038, 12, 10)),
            bookMats[(row * 2 + col + 3) % bookMats.length],
          );
          ball.position.set(0.048, 0.035, 0.02);
          binGrp.add(ball);
          group.add(binGrp);
        }
      }
      break;
    }

    case 'tr_wooden_dollhouse_3story': {
      const wallH = h * 0.72;
      const roofH = h - wallH;
      // Back wall, side walls, 3 floor slabs
      addMesh(new THREE.BoxGeometry(w, wallH, 0.018), primaryMat, [0, wallH / 2, -d / 2 + 0.009]);
      addMesh(new THREE.BoxGeometry(0.018, wallH, d), beechMat, [-w / 2 + 0.009, wallH / 2, 0]);
      addMesh(new THREE.BoxGeometry(0.018, wallH, d), beechMat, [w / 2 - 0.009, wallH / 2, 0]);
      const floorYs = [0.01, wallH * 0.36, wallH * 0.72, wallH];
      floorYs.forEach((fy) => addMesh(new THREE.BoxGeometry(w, 0.016, d), beechMat, [0, fy, 0]));
      // Interior room divider walls
      addMesh(new THREE.BoxGeometry(0.014, wallH * 0.36, d - 0.03), primaryMat, [0.02, wallH * 0.18, 0]);
      addMesh(new THREE.BoxGeometry(0.014, wallH * 0.36, d - 0.03), primaryMat, [-0.04, wallH * 0.54, 0]);
      // Pitched triangular roof + attic gable + chimney
      const gable = new THREE.Shape();
      gable.moveTo(-w / 2, 0);
      gable.lineTo(w / 2, 0);
      gable.lineTo(0, roofH);
      gable.closePath();
      const gableGeo = new THREE.ExtrudeGeometry(gable, { depth: 0.018, bevelEnabled: false });
      addMesh(gableGeo, primaryMat, [0, wallH, -d / 2]);
      const slopeLen = Math.hypot(w / 2 + 0.04, roofH + 0.02);
      const slopeAng = Math.atan2(roofH, w / 2);
      addMesh(new THREE.BoxGeometry(slopeLen, 0.02, d + 0.04), accentMat, [-w * 0.25, wallH + roofH * 0.5, 0], [0, 0, slopeAng]);
      addMesh(new THREE.BoxGeometry(slopeLen, 0.02, d + 0.04), accentMat, [w * 0.25, wallH + roofH * 0.5, 0], [0, 0, -slopeAng]);
      addMesh(new THREE.BoxGeometry(0.07, 0.12, 0.07), secondaryMat, [w * 0.24, wallH + roofH * 0.78, -0.04]);
      // Miniature dollhouse furniture inside all 3 floors!
      // Ground floor left: mini sofa & coffee table
      addMesh(new THREE.BoxGeometry(0.16, 0.06, 0.075), trackMat(new THREE.MeshStandardMaterial({ color: '#E07A5F', roughness: 0.8 })), [-0.16, 0.05, -0.04]);
      addMesh(new THREE.BoxGeometry(0.1, 0.035, 0.055), beechMat, [-0.16, 0.035, 0.06]);
      // Ground floor right: wooden staircase
      addMesh(new THREE.BoxGeometry(0.05, 0.28, 0.07), beechMat, [0.16, 0.14, -0.04], [0, 0, 0.52]);
      // 2nd floor: dining table & kitchen counter
      addMesh(new THREE.BoxGeometry(0.13, 0.065, 0.08), beechMat, [0.14, wallH * 0.36 + 0.04, 0.02]);
      addMesh(new THREE.BoxGeometry(0.16, 0.08, 0.07), secondaryMat, [-0.18, wallH * 0.36 + 0.05, -0.08]);
      // 3rd floor / attic: cozy miniature bed + pillow
      addMesh(new THREE.BoxGeometry(0.17, 0.055, 0.11), trackMat(new THREE.MeshStandardMaterial({ color: '#81B29A', roughness: 0.8 })), [-0.04, wallH * 0.72 + 0.035, -0.02]);
      addMesh(new THREE.BoxGeometry(0.04, 0.025, 0.08), paperMat, [-0.1, wallH * 0.72 + 0.07, -0.02]);
      break;
    }

    default:
      addMesh(new THREE.BoxGeometry(w, h, d), primaryMat, [0, h / 2, 0]);
  }

  return {
    group,
    dispose: () => {
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      texs.forEach((t) => t.dispose());
    },
  };
}
