import * as THREE from 'three';
import type { ArchitecturalAsset, MaterialFinish } from '../lib/catalogTypes';
import { createWoodGrainTexture } from './proceduralTextures';

export interface ProceduralBuildResult {
  group: THREE.Group;
  dispose: () => void;
}

export const TURKISH_ENTRYWAY_ARCHETYPES = new Set<string>([
  'tr_slatted_bench_vestiyer',
  'tr_mirrored_sliding_vestiyer',
  'tr_compact_entry_portmanto',
  'tr_villa_pivot_steel_door',
  'tr_double_villa_steel_door',
  'tr_door_number_bell_plate',
  'tr_flip_drawer_shoe_cabinet',
  'tr_entryway_shoe_bench',
  'tr_doormat_umbrella_set',
  'tr_entryway_console_mirror_set',
  'tr_arched_led_floor_mirror',
  'tr_organic_led_wall_mirror',
  'tr_acoustic_slat_coat_panel',
  'tr_wall_key_mail_organizer',
]);

export function isTurkishEntrywayArchetype(archetype: string): boolean {
  return TURKISH_ENTRYWAY_ARCHETYPES.has(archetype);
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

function createMirrorReflectionTex(tintHex: string, maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTex(512, 1024, maxAnisotropy, (ctx, w, h) => {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    const dark = getLuminance(tintHex) < 0.42;
    if (dark) {
      grad.addColorStop(0, '#5B5149');
      grad.addColorStop(0.28, '#7A6E65');
      grad.addColorStop(0.42, '#4A423C');
      grad.addColorStop(0.68, '#6B6058');
      grad.addColorStop(1, '#3A3430');
    } else {
      grad.addColorStop(0, '#C7D3DF');
      grad.addColorStop(0.26, '#EEF4FA');
      grad.addColorStop(0.44, '#B6C5D4');
      grad.addColorStop(0.7, '#E5EEF6');
      grad.addColorStop(1, '#9EB0C2');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle crisp architectural studio diagonal sheen bands
    ctx.save();
    ctx.globalAlpha = dark ? 0.16 : 0.32;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(w * 0.12, 0);
    ctx.lineTo(w * 0.34, 0);
    ctx.lineTo(0, h * 0.38);
    ctx.lineTo(0, h * 0.18);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = dark ? 0.1 : 0.22;
    ctx.beginPath();
    ctx.moveTo(w * 0.52, 0);
    ctx.lineTo(w * 0.62, 0);
    ctx.lineTo(0, h * 0.64);
    ctx.lineTo(0, h * 0.54);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function createTravertineTex(baseHex: string, maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTex(512, 512, maxAnisotropy, (ctx, w, h) => {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, w, h);
    const dark = getLuminance(baseHex) < 0.35;
    for (let i = 0; i < 42; i++) {
      const y = (i / 42) * h + (Math.sin(i * 2.1) * 6);
      ctx.strokeStyle = dark ? 'rgba(255,255,255,0.08)' : 'rgba(110,92,72,0.11)';
      ctx.lineWidth = 1.5 + (i % 4);
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += 32) {
        ctx.lineTo(x, y + Math.sin(x * 0.018 + i) * 4);
      }
      ctx.stroke();
    }
  });
}

function createCoirDoormatTex(maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTex(768, 460, maxAnisotropy, (ctx, w, h) => {
    // Rich golden-tan woven coconut coir fibers
    ctx.fillStyle = '#B88952';
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 2400; i++) {
      const x = (i * 73) % w;
      const y = (i * 131) % h;
      const len = 6 + (i % 9);
      ctx.strokeStyle = i % 3 === 0 ? 'rgba(92,60,28,0.28)' : i % 3 === 1 ? 'rgba(225,190,136,0.28)' : 'rgba(135,92,48,0.22)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (i % 2 === 0 ? len : -len * 0.5), y + (i % 4) - 2);
      ctx.stroke();
    }

    // Crisp architectural black inner double border
    ctx.strokeStyle = '#1E2126';
    ctx.lineWidth = 14;
    ctx.strokeRect(26, 26, w - 52, h - 52);
    ctx.lineWidth = 4;
    ctx.strokeRect(46, 46, w - 92, h - 92);

    // Subtle decorative corner diamonds
    ctx.fillStyle = '#1E2126';
    for (const [cx, cy] of [
      [78, 78],
      [w - 78, 78],
      [78, h - 78],
      [w - 78, h - 78],
    ]) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-7, -7, 14, 14);
      ctx.restore();
    }

    // Crisp Turkish "HOŞ GELDİNİZ" architectural stencil lettering
    ctx.fillStyle = '#1E2126';
    ctx.font = '800 58px "Inter", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HOŞ GELDİNİZ', w / 2, h / 2 - 12);

    ctx.fillStyle = '#33271D';
    ctx.font = '600 22px "Inter", Arial, sans-serif';
    ctx.fillText('—  EVİMİZE  —', w / 2, h / 2 + 48);
  });
}

function createArchShape(w: number, h: number): THREE.Shape {
  const r = w / 2;
  const straightH = Math.max(0.05, h - r);
  const s = new THREE.Shape();
  s.moveTo(-r, 0);
  s.lineTo(r, 0);
  s.lineTo(r, straightH);
  s.absarc(0, straightH, r, 0, Math.PI, false);
  s.lineTo(-r, 0);
  return s;
}

function createOrganicMirrorShape(w: number, h: number): THREE.Shape {
  const hw = w / 2;
  const hh = h / 2;
  const s = new THREE.Shape();
  s.moveTo(-hw * 0.72, -hh * 0.78);
  s.bezierCurveTo(-hw * 0.2, -hh * 1.04, hw * 0.62, -hh * 0.96, hw * 0.88, -hh * 0.45);
  s.bezierCurveTo(hw * 1.08, -hh * 0.02, hw * 0.94, hh * 0.56, hw * 0.44, hh * 0.88);
  s.bezierCurveTo(-hw * 0.08, hh * 1.12, -hw * 0.82, hh * 0.92, -hw * 0.94, hh * 0.34);
  s.bezierCurveTo(-hw * 1.04, -hh * 0.16, -hw * 1.02, -hh * 0.58, -hw * 0.72, -hh * 0.78);
  return s;
}

function createPillShape(w: number, h: number): THREE.Shape {
  const r = Math.min(w, h) / 2;
  const s = new THREE.Shape();
  if (h >= w) {
    const mid = h / 2 - r;
    s.absarc(0, mid, r, 0, Math.PI, false);
    s.absarc(0, -mid, r, Math.PI, Math.PI * 2, false);
  } else {
    const mid = w / 2 - r;
    s.absarc(mid, 0, r, -Math.PI / 2, Math.PI / 2, false);
    s.absarc(-mid, 0, r, Math.PI / 2, (Math.PI * 3) / 2, false);
  }
  s.closePath();
  return s;
}

export function buildTurkishEntrywayMesh(
  asset: ArchitecturalAsset,
  finish: MaterialFinish,
  options: { isSoftwareGl: boolean; maxAnisotropy: number; wireframe?: boolean },
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
    if ('wireframe' in m && options.wireframe) {
      (m as unknown as THREE.MeshStandardMaterial).wireframe = true;
    }
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
  const secondaryHex = pf?.secondary.hex || finish.secondaryHex || '#B98C5A';
  const accentHex = pf?.accent.hex || finish.accentHex || '#23272F';
  const glassHex = pf?.glass?.hex || '#DCE4EC';

  const makePrimaryMat = (withGrain = false) => {
    const grain = withGrain ? createWoodGrainTexture(primaryHex, options.maxAnisotropy) : undefined;
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

  const makeWoodMat = (hex = secondaryHex) => {
    const grain = createWoodGrainTexture(hex, options.maxAnisotropy);
    trackTex(grain.map);
    trackTex(grain.bumpMap);
    return trackMat(
      new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        map: grain.map,
        bumpMap: grain.bumpMap,
        bumpScale: 0.0045,
        roughness: pf?.secondary.roughness ?? 0.46,
        metalness: pf?.secondary.metalness ?? 0.04,
      }),
    );
  };

  const makeAccentMat = () =>
    trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(accentHex),
        roughness: pf?.accent.roughness ?? 0.28,
        metalness: pf?.accent.metalness ?? 0.85,
      }),
    );

  const makeMirrorMat = (tint = glassHex) => {
    const tex = trackTex(createMirrorReflectionTex(tint, options.maxAnisotropy));
    return trackMat(
      new THREE.MeshPhysicalMaterial({
        color: '#FFFFFF',
        map: tex,
        roughness: 0.04,
        metalness: 0.72,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
      }),
    );
  };

  const makeWarmLedMat = (intensity = 2.2) =>
    trackMat(
      new THREE.MeshStandardMaterial({
        color: '#FFF6E3',
        emissive: '#FFCC78',
        emissiveIntensity: intensity,
        roughness: 0.14,
        metalness: 0.0,
      }),
    );

  const makeLedHaloMat = (opacity = 0.28) =>
    trackMat(
      new THREE.MeshBasicMaterial({
        color: '#FFD284',
        transparent: true,
        opacity,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );

  const w = asset.dimensionsCm.width / 100;
  const d = asset.dimensionsCm.depth / 100;
  const h = asset.dimensionsCm.height / 100;

  // ============================================================================
  // 1. Tavana Kadar Ahşap Çıtalı, Oturaklı & Gizli LED'li Modern Vestiyer (220×50×260)
  // ============================================================================
  if (asset.archetype === 'tr_slatted_bench_vestiyer') {
    const cabinetMat = makePrimaryMat();
    const slatMat = makeWoodMat(secondaryHex);
    const metalMat = makeAccentMat();
    const mirrorMat = makeMirrorMat(glassHex);
    const feltMat = trackMat(new THREE.MeshStandardMaterial({ color: '#1F232A', roughness: 0.92 }));
    const cushionMat = trackMat(new THREE.MeshStandardMaterial({ color: '#EDE9E1', roughness: 0.88 }));
    const ledMat = makeWarmLedMat(2.2);
    const haloMat = makeLedHaloMat(0.24);
    const revealMat = trackMat(new THREE.MeshStandardMaterial({ color: '#181B20', roughness: 0.7 }));

    const leftW = w * 0.36;
    const midW = w * 0.40;
    const rightW = w * 0.24;
    const plinthH = 0.12;
    const leftX = -w / 2 + leftW / 2;
    const midX = -w / 2 + leftW + midW / 2;
    const rightX = w / 2 - rightW / 2;

    // Recessed dark shadow plinth & floating warm floor LED under center shoe bay
    addMesh(new THREE.BoxGeometry(w - 0.04, plinthH, d - 0.08), revealMat, [0, plinthH / 2, -0.02]);
    addMesh(new THREE.BoxGeometry(midW - 0.04, 0.012, 0.014), ledMat, [midX, plinthH + 0.01, d / 2 - 0.12], [0, 0, 0], false);

    // LEFT BLOCK: Twin full-height handleless matte lacquer coat doors (260 cm)
    addMesh(new THREE.BoxGeometry(leftW, h - plinthH, d - 0.022), cabinetMat, [leftX, plinthH + (h - plinthH) / 2, -0.011]);
    const doorW = leftW / 2 - 0.004;
    for (const side of [-1, 1]) {
      const dx = leftX + side * (leftW / 4);
      addMesh(new THREE.BoxGeometry(doorW, h - plinthH - 0.01, 0.02), cabinetMat, [dx, plinthH + (h - plinthH) / 2, d / 2 - 0.01]);
      // Recessed vertical milled metallic J-pull accent channel on inner edge
      addMesh(new THREE.BoxGeometry(0.012, 0.62, 0.012), metalMat, [dx - side * (doorW / 2 - 0.012), 1.18, d / 2 + 0.002]);
    }

    // CENTER NICHE: Upper bridge cabinet + 14 acoustic wood slats + LED strip + hooks + boucle bench + drawer
    const bridgeH = 0.52;
    const benchTopY = 0.48;
    const benchH = 0.26;
    // Upper bridge cabinet above niche
    addMesh(new THREE.BoxGeometry(midW, bridgeH, d), cabinetMat, [midX, h - bridgeH / 2, 0]);
    // Door split line on upper bridge
    addMesh(new THREE.BoxGeometry(0.005, bridgeH - 0.01, 0.004), revealMat, [midX, h - bridgeH / 2, d / 2 + 0.002]);
    // Recessed 3000K warm LED cove bar under upper bridge
    addMesh(new THREE.BoxGeometry(midW - 0.04, 0.012, 0.016), ledMat, [midX, h - bridgeH - 0.004, d / 2 - 0.06], [0, 0, 0], false);
    addMesh(new THREE.PlaneGeometry(midW - 0.04, 0.24), haloMat, [midX, h - bridgeH - 0.13, -d / 2 + 0.06], [0, 0, 0], false);

    // Back acoustic dark felt panel + 14 crisp vertical oak slats inside niche
    const nicheH = h - bridgeH - benchTopY;
    const nicheCenterY = benchTopY + nicheH / 2;
    addMesh(new THREE.BoxGeometry(midW, nicheH, 0.022), feltMat, [midX, nicheCenterY, -d / 2 + 0.018]);
    const slatCount = 14;
    const slatPitch = (midW - 0.04) / slatCount;
    for (let i = 0; i < slatCount; i++) {
      const sx = midX - (midW - 0.04) / 2 + slatPitch * (i + 0.5);
      addMesh(new THREE.BoxGeometry(slatPitch * 0.58, nicheH - 0.01, 0.028), slatMat, [sx, nicheCenterY, -d / 2 + 0.042]);
    }

    // 4 architectural matte-black/brass coat hook pegs + slim hat/bag shelf
    addMesh(new THREE.BoxGeometry(midW - 0.03, 0.024, 0.22), slatMat, [midX, h - bridgeH - 0.24, -d / 2 + 0.14]);
    for (let k = 0; k < 4; k++) {
      const kx = midX - midW * 0.34 + (k / 3) * (midW * 0.68);
      addMesh(new THREE.CylinderGeometry(0.014, 0.011, 0.046, 16), metalMat, [kx, 1.56, -d / 2 + 0.078], [Math.PI / 2, 0, 0]);
      addMesh(new THREE.CylinderGeometry(0.018, 0.018, 0.008, 16), metalMat, [kx, 1.56, -d / 2 + 0.102], [Math.PI / 2, 0, 0]);
    }

    // Floating lower shoe drawer + plush rounded boucle bench cushion
    addMesh(new THREE.BoxGeometry(midW - 0.01, benchH, d - 0.04), cabinetMat, [midX, plinthH + 0.06 + benchH / 2, -0.01]);
    addMesh(new THREE.BoxGeometry(midW * 0.34, 0.012, 0.014), metalMat, [midX, plinthH + 0.06 + benchH - 0.03, d / 2 - 0.02]);
    // Plush rounded boucle cushion resting on bench
    addMesh(new THREE.BoxGeometry(midW - 0.03, 0.065, d - 0.08), cushionMat, [midX, benchTopY + 0.018, -0.01]);
    addMesh(
      new THREE.CylinderGeometry(0.032, 0.032, midW - 0.03, 16),
      cushionMat,
      [midX, benchTopY + 0.018, d / 2 - 0.05],
      [0, 0, Math.PI / 2],
    );

    // RIGHT BLOCK: Full-height smoked/bronze frameless mirror cabinet door
    addMesh(new THREE.BoxGeometry(rightW, h - plinthH, d - 0.022), cabinetMat, [rightX, plinthH + (h - plinthH) / 2, -0.011]);
    addMesh(new THREE.BoxGeometry(rightW - 0.01, h - plinthH - 0.012, 0.016), mirrorMat, [rightX, plinthH + (h - plinthH) / 2, d / 2 - 0.006]);
    // Thin metallic perimeter edge trim around mirror
    addMesh(new THREE.BoxGeometry(0.008, h - plinthH - 0.012, 0.02), metalMat, [rightX - rightW / 2 + 0.004, plinthH + (h - plinthH) / 2, d / 2 - 0.006]);
    addMesh(new THREE.BoxGeometry(0.008, h - plinthH - 0.012, 0.02), metalMat, [rightX + rightW / 2 - 0.004, plinthH + (h - plinthH) / 2, d / 2 - 0.006]);
  }

  // ============================================================================
  // 2. Tam Boy Füme Aynalı & Alüminyum Profilli Sürgülü Vestiyer (180×55×230)
  // ============================================================================
  else if (asset.archetype === 'tr_mirrored_sliding_vestiyer') {
    const bodyMat = makePrimaryMat();
    const woodMat = makeWoodMat(secondaryHex);
    const frameMat = makeAccentMat();
    const mirrorMat = makeMirrorMat(glassHex);

    const plinthH = 0.08;
    // Outer wardrobe shell
    addMesh(new THREE.BoxGeometry(w, h - plinthH, d - 0.06), bodyMat, [0, plinthH + (h - plinthH) / 2, -0.03]);
    addMesh(new THREE.BoxGeometry(w - 0.04, plinthH, d - 0.1), frameMat, [0, plinthH / 2, -0.04]);
    // Top & bottom extruded anodized sliding tracks
    addMesh(new THREE.BoxGeometry(w, 0.036, 0.06), frameMat, [0, h - 0.018, d / 2 - 0.03]);
    addMesh(new THREE.BoxGeometry(w, 0.024, 0.06), frameMat, [0, plinthH + 0.012, d / 2 - 0.03]);

    const leafW = w * 0.51;
    const leafH = h - plinthH - 0.056;
    const leafY = plinthH + 0.024 + leafH / 2;

    // LEFT SLIDING LEAF (front track): Full-height smoked mirror with thin aluminum frame + 3 horizontal muntins
    const leftX = -w / 4 + 0.008;
    const leftZ = d / 2 - 0.014;
    addMesh(new THREE.BoxGeometry(leafW - 0.028, leafH - 0.028, 0.014), mirrorMat, [leftX, leafY, leftZ]);
    addMesh(new THREE.BoxGeometry(leafW, 0.024, 0.022), frameMat, [leftX, leafY + leafH / 2 - 0.012, leftZ]);
    addMesh(new THREE.BoxGeometry(leafW, 0.024, 0.022), frameMat, [leftX, leafY - leafH / 2 + 0.012, leftZ]);
    addMesh(new THREE.BoxGeometry(0.024, leafH, 0.022), frameMat, [leftX - leafW / 2 + 0.012, leafY, leftZ]);
    addMesh(new THREE.BoxGeometry(0.024, leafH, 0.022), frameMat, [leftX + leafW / 2 - 0.012, leafY, leftZ]);
    for (const frac of [0.25, 0.5, 0.75]) {
      addMesh(new THREE.BoxGeometry(leafW - 0.02, 0.014, 0.02), frameMat, [leftX, plinthH + 0.024 + leafH * frac, leftZ + 0.002]);
    }

    // RIGHT SLIDING LEAF (rear track): Fluted wood panel with slim metallic perimeter + full-height pull
    const rightX = w / 4 - 0.008;
    const rightZ = d / 2 - 0.042;
    addMesh(new THREE.BoxGeometry(leafW - 0.024, leafH - 0.024, 0.018), woodMat, [rightX, leafY, rightZ]);
    for (let s = 0; s < 14; s++) {
      const sx = rightX - (leafW - 0.08) / 2 + (s / 13) * (leafW - 0.08);
      addMesh(new THREE.BoxGeometry(0.018, leafH - 0.05, 0.012), woodMat, [sx, leafY, rightZ + 0.011]);
    }
    addMesh(new THREE.BoxGeometry(0.024, leafH, 0.024), frameMat, [rightX + leafW / 2 - 0.012, leafY, rightZ + 0.004]);
    addMesh(new THREE.BoxGeometry(0.024, leafH, 0.024), frameMat, [rightX - leafW / 2 + 0.012, leafY, rightZ + 0.004]);
  }

  // ============================================================================
  // 3. Dar Antre İçin Oturaklı, Aynalı & Çıtalı Kompakt Portmanto (120×38×210)
  // ============================================================================
  else if (asset.archetype === 'tr_compact_entry_portmanto') {
    const bodyMat = makePrimaryMat();
    const woodMat = makeWoodMat(secondaryHex);
    const metalMat = makeAccentMat();
    const mirrorMat = makeMirrorMat(glassHex);
    const cushionMat = trackMat(new THREE.MeshStandardMaterial({ color: '#E8E3DA', roughness: 0.88 }));

    const legH = 0.14;
    const leftW = w * 0.4;
    const rightW = w * 0.6;
    const leftX = -w / 2 + leftW / 2;
    const rightX = w / 2 - rightW / 2;

    // 4 tapered solid wood legs
    for (const lx of [-w / 2 + 0.06, -w / 2 + leftW - 0.04, w / 2 - 0.06]) {
      for (const lz of [-d / 2 + 0.05, d / 2 - 0.05]) {
        addMesh(new THREE.CylinderGeometry(0.016, 0.011, legH, 14), woodMat, [lx, legH / 2, lz]);
      }
    }

    // LEFT TALL MIRRORED COAT CABINET
    addMesh(new THREE.BoxGeometry(leftW, h - legH, d - 0.02), bodyMat, [leftX, legH + (h - legH) / 2, -0.01]);
    addMesh(new THREE.BoxGeometry(leftW - 0.04, h - legH - 0.08, 0.014), mirrorMat, [leftX, legH + (h - legH) / 2, d / 2 - 0.003]);
    // Slim metallic vertical handle on right side of mirror door
    addMesh(new THREE.CylinderGeometry(0.006, 0.006, 0.28, 12), metalMat, [leftX + leftW / 2 - 0.022, 1.08, d / 2 + 0.018]);

    // RIGHT OPEN SECTION: Lower shoe bench + cushion + 9 oak slats + top hat shelf + 4 coat hooks
    const benchH = 0.36;
    const benchTopY = legH + benchH;
    addMesh(new THREE.BoxGeometry(rightW, benchH, d), bodyMat, [rightX, legH + benchH / 2, 0]);
    // Horizontal groove splitting 2 tilting shoe compartments + metallic pull handles
    addMesh(new THREE.BoxGeometry(rightW - 0.03, 0.006, 0.006), metalMat, [rightX, legH + benchH / 2, d / 2 + 0.002]);
    addMesh(new THREE.BoxGeometry(0.14, 0.01, 0.014), metalMat, [rightX, legH + benchH - 0.045, d / 2 + 0.008]);
    addMesh(new THREE.BoxGeometry(0.14, 0.01, 0.014), metalMat, [rightX, legH + benchH * 0.42, d / 2 + 0.008]);
    // Upholstered seat pad
    addMesh(new THREE.BoxGeometry(rightW - 0.02, 0.055, d - 0.03), cushionMat, [rightX, benchTopY + 0.028, 0]);

    // Slatted oak back panel rising from bench to top shelf
    const backH = h - benchTopY - 0.055;
    addMesh(new THREE.BoxGeometry(rightW, backH, 0.018), bodyMat, [rightX, benchTopY + 0.055 + backH / 2, -d / 2 + 0.01]);
    for (let i = 0; i < 9; i++) {
      const sx = rightX - (rightW - 0.06) / 2 + (i / 8) * (rightW - 0.06);
      addMesh(new THREE.BoxGeometry(0.034, backH - 0.04, 0.022), woodMat, [sx, benchTopY + 0.055 + backH / 2, -d / 2 + 0.03]);
    }
    // Top hat shelf + chrome hanging bar underneath + 4 coat hooks
    addMesh(new THREE.BoxGeometry(rightW, 0.026, d - 0.04), woodMat, [rightX, h - 0.16, -0.02]);
    for (let k = 0; k < 4; k++) {
      const kx = rightX - rightW * 0.34 + (k / 3) * (rightW * 0.68);
      addMesh(new THREE.CylinderGeometry(0.01, 0.01, 0.04, 12), metalMat, [kx, 1.56, -d / 2 + 0.055], [Math.PI / 2, 0, 0]);
      addMesh(new THREE.BoxGeometry(0.014, 0.048, 0.014), metalMat, [kx, 1.57, -d / 2 + 0.072]);
    }
  }

  // ============================================================================
  // 4. Sur Albero / Boss Lüks Villa Hemyüz Pivot Çelik Giriş Kapısı (140×12×260)
  // ============================================================================
  else if (asset.archetype === 'tr_villa_pivot_steel_door') {
    const steelMat = makePrimaryMat();
    const irokoMat = makeWoodMat(secondaryHex);
    const handleMat = makeAccentMat();
    const ledMat = makeWarmLedMat(2.5);
    const haloMat = makeLedHaloMat(0.28);
    const chromeMat = trackMat(new THREE.MeshStandardMaterial({ color: '#D8DEE6', roughness: 0.18, metalness: 0.94 }));

    const frameT = 0.09;
    // Heavy flush architectural anthracite surround frame (hemyüz kasa) + stainless threshold sill
    addMesh(new THREE.BoxGeometry(w, frameT, d), steelMat, [0, h - frameT / 2, 0]);
    addMesh(new THREE.BoxGeometry(frameT, h, d), steelMat, [-w / 2 + frameT / 2, h / 2, 0]);
    addMesh(new THREE.BoxGeometry(frameT, h, d), steelMat, [w / 2 - frameT / 2, h / 2, 0]);
    addMesh(new THREE.BoxGeometry(w, 0.026, d + 0.02), chromeMat, [0, 0.013, 0]);

    // Massive pivot door leaf (slightly cracked open 5° or flush with crisp 6mm shadow reveal)
    const leafW = w - frameT * 2 - 0.012;
    const leafH = h - frameT - 0.032;
    const leafY = 0.03 + leafH / 2;
    const leafD = 0.082;
    addMesh(new THREE.BoxGeometry(leafW, leafH, leafD), steelMat, [0, leafY, 0.008]);

    // Left 62% vertical iroko/termowood fluted exterior cladding slats
    const woodAreaW = leafW * 0.62;
    const woodStartX = -leafW / 2 + 0.025;
    const slatN = 11;
    const slatPitch = (woodAreaW - 0.03) / slatN;
    for (let i = 0; i < slatN; i++) {
      const sx = woodStartX + slatPitch * (i + 0.5);
      addMesh(new THREE.BoxGeometry(slatPitch * 0.78, leafH - 0.03, 0.02), irokoMat, [sx, leafY, leafD / 2 + 0.016]);
    }

    // Right 38% matte anthracite sintered stone architectural band + metallic accent inlay groove
    const stoneX = leafW / 2 - (leafW * 0.34) / 2 - 0.01;
    addMesh(new THREE.BoxGeometry(leafW * 0.34, leafH - 0.02, 0.014), steelMat, [stoneX, leafY, leafD / 2 + 0.014]);
    addMesh(new THREE.BoxGeometry(0.01, leafH - 0.02, 0.018), chromeMat, [-leafW / 2 + woodAreaW + 0.012, leafY, leafD / 2 + 0.015]);

    // Full-height 185 cm tubular architectural bar pull handle + warm 3000K vertical LED glow behind handle!
    const handleX = leafW / 2 - 0.16;
    const handleH = 1.85;
    addMesh(new THREE.CylinderGeometry(0.018, 0.018, handleH, 20), handleMat, [handleX, 1.24, leafD / 2 + 0.072]);
    for (const sy of [0.46, 1.24, 2.02]) {
      addMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.056, 14), handleMat, [handleX, sy, leafD / 2 + 0.044], [Math.PI / 2, 0, 0]);
    }
    // Recessed vertical 3000K LED strip tucked directly behind the pull bar
    addMesh(new THREE.BoxGeometry(0.008, handleH - 0.06, 0.008), ledMat, [handleX, 1.24, leafD / 2 + 0.055], [0, 0, 0], false);
    addMesh(new THREE.PlaneGeometry(0.07, handleH), haloMat, [handleX, 1.24, leafD / 2 + 0.024], [0, 0, 0], false);

    // Biometric fingerprint & smart keypad reader plate next to pull bar
    const bioTex = trackTex(
      createCanvasTex(128, 256, options.maxAnisotropy, (ctx, cw, ch) => {
        ctx.fillStyle = '#0D1016';
        ctx.fillRect(0, 0, cw, ch);
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cw / 2, 68, 24, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '700 22px "Inter", Arial, sans-serif';
        ctx.textAlign = 'center';
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            ctx.fillText(String(r * 3 + c + 1), 32 + c * 32, 134 + r * 34);
          }
        }
      }),
    );
    addMesh(
      new THREE.BoxGeometry(0.055, 0.135, 0.012),
      trackMat(new THREE.MeshBasicMaterial({ map: bioTex })),
      [handleX + 0.088, 1.18, leafD / 2 + 0.026],
    );

    // Concealed stainless top & bottom pivot hinge pin plates (24 cm from left edge)
    addMesh(new THREE.BoxGeometry(0.09, 0.012, 0.06), chromeMat, [-leafW / 2 + 0.24, 0.034, 0.008]);
    addMesh(new THREE.BoxGeometry(0.09, 0.012, 0.06), chromeMat, [-leafW / 2 + 0.24, h - frameT - 0.008, 0.008]);
  }

  // ============================================================================
  // 5. Kale / Formet Çift Kanatlı & Yan Camlı Lüks Villa Çelik Kapısı (170×14×240)
  // ============================================================================
  else if (asset.archetype === 'tr_double_villa_steel_door') {
    const steelMat = makePrimaryMat();
    const panelWoodMat = makeWoodMat(secondaryHex);
    const inoxMat = makeAccentMat();
    const glassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(glassHex),
        roughness: 0.24,
        metalness: 0.1,
        transparent: true,
        opacity: 0.62,
        clearcoat: 0.85,
      }),
    );
    const darkGrooveMat = trackMat(new THREE.MeshStandardMaterial({ color: '#111318', roughness: 0.6 }));

    const frameT = 0.085;
    // Outer double-door armored frame + threshold
    addMesh(new THREE.BoxGeometry(w, frameT, d), steelMat, [0, h - frameT / 2, 0]);
    addMesh(new THREE.BoxGeometry(frameT, h, d), steelMat, [-w / 2 + frameT / 2, h / 2, 0]);
    addMesh(new THREE.BoxGeometry(frameT, h, d), steelMat, [w / 2 - frameT / 2, h / 2, 0]);
    addMesh(new THREE.BoxGeometry(w + 0.04, 0.032, d + 0.03), darkGrooveMat, [0, 0.016, 0]);

    const innerW = w - frameT * 2;
    const leafH = h - frameT - 0.036;
    const leafY = 0.034 + leafH / 2;
    const mainW = innerW * 0.65;
    const sideW = innerW * 0.35 - 0.012;
    const mainX = -innerW / 2 + mainW / 2;
    const sideX = innerW / 2 - sideW / 2;

    // MAIN ACTIVE LEAF (105 cm) with horizontal architectural walnut/termowood relief & inox strips
    addMesh(new THREE.BoxGeometry(mainW, leafH, 0.08), steelMat, [mainX, leafY, 0.005]);
    addMesh(new THREE.BoxGeometry(mainW - 0.08, leafH - 0.08, 0.018), panelWoodMat, [mainX, leafY, 0.048]);
    for (const frac of [0.22, 0.44, 0.66, 0.84]) {
      addMesh(new THREE.BoxGeometry(mainW - 0.08, 0.014, 0.022), inoxMat, [mainX, 0.04 + leafH * frac, 0.05]);
    }

    // Long 145 cm stainless bar handle + Kale 14-point monoblock lock escutcheon + optical peephole
    const hx = mainX + mainW / 2 - 0.13;
    addMesh(new THREE.CylinderGeometry(0.017, 0.017, 1.45, 20), inoxMat, [hx, 1.18, 0.112]);
    for (const sy of [0.56, 1.8]) {
      addMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.058, 14), inoxMat, [hx, sy, 0.082], [Math.PI / 2, 0, 0]);
    }
    // Dual Kale security lock rosettes
    for (const ly of [0.96, 1.16]) {
      addMesh(new THREE.CylinderGeometry(0.026, 0.028, 0.016, 20), inoxMat, [hx + 0.068, ly, 0.062], [Math.PI / 2, 0, 0]);
      addMesh(new THREE.BoxGeometry(0.008, 0.024, 0.006), darkGrooveMat, [hx + 0.068, ly, 0.071]);
    }
    // Security peephole (dürbün) at +158 cm
    addMesh(new THREE.CylinderGeometry(0.013, 0.013, 0.012, 16), inoxMat, [mainX, 1.58, 0.06], [Math.PI / 2, 0, 0]);

    // SECONDARY FIXED/SEMI-ACTIVE SIDELIGHT LEAF (55 cm) with frosted security glass + 5 inox armor bars
    const rim = 0.075;
    addMesh(new THREE.BoxGeometry(sideW, rim, 0.078), steelMat, [sideX, 0.034 + rim / 2, 0.005]);
    addMesh(new THREE.BoxGeometry(sideW, rim, 0.078), steelMat, [sideX, h - frameT - rim / 2, 0.005]);
    addMesh(new THREE.BoxGeometry(rim, leafH, 0.078), steelMat, [sideX - sideW / 2 + rim / 2, leafY, 0.005]);
    addMesh(new THREE.BoxGeometry(rim, leafH, 0.078), steelMat, [sideX + sideW / 2 - rim / 2, leafY, 0.005]);
    addMesh(new THREE.BoxGeometry(sideW - rim * 2, leafH - rim * 2, 0.022), glassMat, [sideX, leafY, 0.012]);
    // 5 horizontal 304 inox security armor bars across sidelight
    for (let b = 0; b < 5; b++) {
      const by = 0.36 + (b / 4) * (leafH - 0.68);
      addMesh(new THREE.CylinderGeometry(0.01, 0.01, sideW - rim * 1.6, 14), inoxMat, [sideX, by, 0.036], [0, 0, Math.PI / 2]);
    }
  }

  // ============================================================================
  // 6. Modern Lazer Kesim Pleksi & Pirinç Daire Kapı Numarası + LED Zil (22×3×26)
  // ============================================================================
  else if (asset.archetype === 'tr_door_number_bell_plate') {
    const plateMat = makePrimaryMat();
    const numMat = makeWoodMat(secondaryHex); // metallic/wood number color
    const metalNumMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(secondaryHex),
        roughness: pf?.secondary.roughness ?? 0.2,
        metalness: pf?.secondary.metalness ?? 0.92,
      }),
    );
    const ledMat = makeWarmLedMat(2.5);
    const haloMat = makeLedHaloMat(0.32);
    void numMat;

    // Back wall glow halo + 4 standoff mounting pins
    addMesh(new THREE.PlaneGeometry(w + 0.048, h + 0.048), haloMat, [0, h / 2, 0.002], [0, 0, 0], false);
    addMesh(new THREE.BoxGeometry(w - 0.016, h - 0.016, 0.008), ledMat, [0, h / 2, 0.008], [0, 0, 0], false);
    // Main floating architectural plate
    addMesh(new THREE.BoxGeometry(w, h, 0.012), plateMat, [0, h / 2, 0.019]);

    // Crisp laser-cut graphic face ("NO: 14", divider rule, nameplate)
    const faceTex = trackTex(
      createCanvasTex(512, 600, options.maxAnisotropy, (ctx, cw, ch) => {
        ctx.clearRect(0, 0, cw, ch);
        ctx.strokeStyle = secondaryHex;
        ctx.lineWidth = 6;
        ctx.strokeRect(18, 18, cw - 36, ch - 36);

        ctx.fillStyle = secondaryHex;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '700 44px "Inter", Arial, sans-serif';
        ctx.fillText('DAİRE', cw / 2, 108);

        ctx.font = '800 185px "Inter", Arial, sans-serif';
        ctx.fillText('14', cw / 2, 265);

        ctx.fillRect(72, 385, cw - 144, 4);

        ctx.font = '600 32px "Inter", Arial, sans-serif';
        ctx.fillText('KAT 4 · B BLOK', cw / 2, 430);
      }),
    );
    addMesh(
      new THREE.PlaneGeometry(w - 0.012, h - 0.012),
      trackMat(new THREE.MeshBasicMaterial({ map: faceTex, transparent: true, depthWrite: false })),
      [0, h / 2, 0.026],
    );

    // Tactile illuminated stainless/brass doorbell push button at bottom center
    addMesh(new THREE.TorusGeometry(0.018, 0.003, 12, 28), ledMat, [0, 0.042, 0.027], [0, 0, 0], false);
    addMesh(new THREE.CylinderGeometry(0.015, 0.015, 0.009, 24), metalNumMat, [0, 0.042, 0.028], [Math.PI / 2, 0, 0]);
  }

  // ============================================================================
  // 7. 3'lü Düşer Kapaklı Ultra İnce (24 cm) Antre Ayakkabılık (80×24×125)
  // ============================================================================
  else if (asset.archetype === 'tr_flip_drawer_shoe_cabinet') {
    const bodyMat = makePrimaryMat();
    const legWoodMat = makeWoodMat(secondaryHex);
    const handleMat = makeAccentMat();
    const innerMat = trackMat(new THREE.MeshStandardMaterial({ color: '#E2E6EC', roughness: 0.45 }));
    const shoeMat1 = trackMat(new THREE.MeshStandardMaterial({ color: '#3B3F46', roughness: 0.65 }));
    const shoeMat2 = trackMat(new THREE.MeshStandardMaterial({ color: '#9C6F47', roughness: 0.6 }));
    const bowlMat = trackMat(new THREE.MeshStandardMaterial({ color: '#DED5C6', roughness: 0.5 }));

    const legH = 0.14;
    const cabH = h - legH;
    // 4 tapered Scandinavian oak legs
    for (const lx of [-w / 2 + 0.07, w / 2 - 0.07]) {
      for (const lz of [-d / 2 + 0.045, d / 2 - 0.045]) {
        addMesh(new THREE.CylinderGeometry(0.016, 0.01, legH, 14), legWoodMat, [lx, legH / 2, lz]);
      }
    }

    // Slim cabinet carcass (hollow top cavity so tilted drawer reveals interior!)
    const sideT = 0.02;
    addMesh(new THREE.BoxGeometry(w, 0.022, d), bodyMat, [0, legH + 0.011, 0]);
    addMesh(new THREE.BoxGeometry(w, 0.024, d + 0.008), legWoodMat, [0, h - 0.012, 0.002]);
    addMesh(new THREE.BoxGeometry(sideT, cabH, d), bodyMat, [-w / 2 + sideT / 2, legH + cabH / 2, 0]);
    addMesh(new THREE.BoxGeometry(sideT, cabH, d), bodyMat, [w / 2 - sideT / 2, legH + cabH / 2, 0]);
    addMesh(new THREE.BoxGeometry(w - sideT * 2, cabH, 0.016), innerMat, [0, legH + cabH / 2, -d / 2 + 0.008]);

    // 3 Flip-front tilting shoe drawers (top drawer tilted open 22° to reveal shoes inside!)
    const drawerH = (cabH - 0.06) / 3;
    for (let i = 0; i < 3; i++) {
      const bottomY = legH + 0.028 + i * (drawerH + 0.006);
      const isTopOpen = i === 2;

      const pivot = new THREE.Group();
      pivot.position.set(0, bottomY, d / 2 - 0.01);
      if (isTopOpen) pivot.rotation.x = 0.36;
      group.add(pivot);

      const addP = (
        geo: THREE.BufferGeometry,
        mat: THREE.Material,
        pos: [number, number, number],
        rot: [number, number, number] = [0, 0, 0],
      ) => {
        const m = new THREE.Mesh(trackGeo(geo), mat);
        m.position.set(...pos);
        m.rotation.set(...rot);
        m.castShadow = true;
        m.receiveShadow = true;
        pivot.add(m);
      };

      // Front door panel + metallic edge pull bar
      addP(new THREE.BoxGeometry(w - 0.048, drawerH - 0.006, 0.018), bodyMat, [0, drawerH / 2, 0]);
      addP(new THREE.BoxGeometry(0.18, 0.012, 0.016), handleMat, [0, drawerH - 0.04, 0.014]);

      if (isTopOpen) {
        // Side fan wings + internal angled divider shelf + 2 pairs of sculpted shoe silhouettes!
        addP(new THREE.BoxGeometry(0.012, drawerH * 0.78, 0.16), innerMat, [-w / 2 + 0.036, drawerH * 0.4, -0.085]);
        addP(new THREE.BoxGeometry(0.012, drawerH * 0.78, 0.16), innerMat, [w / 2 - 0.036, drawerH * 0.4, -0.085]);
        addP(new THREE.BoxGeometry(w - 0.08, 0.01, 0.14), innerMat, [0, drawerH * 0.45, -0.075], [0.22, 0, 0]);
        for (const [idx, sx] of [-0.22, -0.08, 0.08, 0.22].entries()) {
          addP(new THREE.BoxGeometry(0.085, 0.18, 0.055), idx < 2 ? shoeMat1 : shoeMat2, [sx, drawerH * 0.52, -0.07]);
        }
      }
    }

    // Minimalist ceramic key catchall bowl + brass keys on top oak ledge
    addMesh(new THREE.CylinderGeometry(0.085, 0.062, 0.034, 24), bowlMat, [-0.18, h + 0.017, 0]);
    addMesh(new THREE.CylinderGeometry(0.042, 0.035, 0.16, 20), bowlMat, [0.22, h + 0.08, -0.02]);
  }

  // ============================================================================
  // 8. Bukle Minderli & Ahşap Çıtalı Antre Oturma Bankı — Ayakkabılıklı (110×40×48)
  // ============================================================================
  else if (asset.archetype === 'tr_entryway_shoe_bench') {
    const cushionMat = makePrimaryMat();
    const woodMat = makeWoodMat(secondaryHex);
    const metalMat = makeAccentMat();
    const basketMat = trackMat(new THREE.MeshStandardMaterial({ color: '#C6A374', roughness: 0.85 }));
    const sneakerMat = trackMat(new THREE.MeshStandardMaterial({ color: '#F1F5F9', roughness: 0.55 }));
    const soleMat = trackMat(new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.65 }));

    const seatBaseY = h - 0.085;
    // 4 solid rounded vertical legs + upper/lower oak apron rails
    for (const lx of [-w / 2 + 0.032, w / 2 - 0.032]) {
      for (const lz of [-d / 2 + 0.032, d / 2 - 0.032]) {
        addMesh(new THREE.CylinderGeometry(0.02, 0.017, seatBaseY, 16), woodMat, [lx, seatBaseY / 2, lz]);
      }
    }
    // Horizontal side stretchers & seat platform frame
    addMesh(new THREE.BoxGeometry(w - 0.02, 0.034, d - 0.02), woodMat, [0, seatBaseY - 0.012, 0]);
    // Lower slatted shoe rack (7 crisp wooden slats at y = 0.14 m)
    const shelfY = 0.14;
    for (let s = 0; s < 7; s++) {
      const sz = -d / 2 + 0.05 + (s / 6) * (d - 0.1);
      addMesh(new THREE.BoxGeometry(w - 0.08, 0.014, 0.028), woodMat, [0, shelfY, sz]);
    }
    // Subtle dark metal corner L-brackets
    for (const lx of [-w / 2 + 0.032, w / 2 - 0.032]) {
      addMesh(new THREE.BoxGeometry(0.044, 0.016, d - 0.06), metalMat, [lx, shelfY - 0.008, 0]);
    }

    // Thick rounded upholstered boucle seat cushion with subtle piping
    const cushH = 0.08;
    addMesh(new THREE.BoxGeometry(w - 0.04, cushH, d - 0.04), cushionMat, [0, seatBaseY + cushH / 2 + 0.004, 0]);
    for (const sz of [-d / 2 + 0.022, d / 2 - 0.022]) {
      addMesh(
        new THREE.CylinderGeometry(cushH / 2, cushH / 2, w - 0.04, 16),
        cushionMat,
        [0, seatBaseY + cushH / 2 + 0.004, sz],
        [0, 0, Math.PI / 2],
      );
    }

    // Left bay: Woven seagrass/rattan storage basket with carry handles
    addMesh(new THREE.BoxGeometry(0.34, 0.18, d - 0.1), basketMat, [-w * 0.25, shelfY + 0.098, 0]);
    addMesh(new THREE.BoxGeometry(0.11, 0.026, 0.014), metalMat, [-w * 0.25, shelfY + 0.155, d / 2 - 0.048]);

    // Right bay: Pair of sleek minimalist sneakers resting on the slatted shoe shelf
    for (const sx of [0.12, 0.26]) {
      addMesh(new THREE.BoxGeometry(0.095, 0.022, 0.25), soleMat, [sx, shelfY + 0.018, 0.01]);
      addMesh(new THREE.BoxGeometry(0.09, 0.062, 0.22), sneakerMat, [sx, shelfY + 0.056, -0.005]);
    }
  }

  // ============================================================================
  // 9. Doğal Coir Kapı Önü Paspası & Pirinç Şemsiyelik Seti (80×50×55)
  // ============================================================================
  else if (asset.archetype === 'tr_doormat_umbrella_set') {
    const rubberMat = trackMat(new THREE.MeshStandardMaterial({ color: '#1E2126', roughness: 0.78 }));
    const coirTex = trackTex(createCoirDoormatTex(options.maxAnisotropy));
    const coirTopMat = trackMat(new THREE.MeshStandardMaterial({ map: coirTex, roughness: 0.94, metalness: 0.0 }));
    const coirSideMat = trackMat(new THREE.MeshStandardMaterial({ color: '#A37743', roughness: 0.94 }));
    const standMat = trackMat(new THREE.MeshStandardMaterial({ color: '#22262E', roughness: 0.36, metalness: 0.72 }));
    const brassMat = makeAccentMat();
    const umbDarkMat = trackMat(new THREE.MeshStandardMaterial({ color: '#2B3442', roughness: 0.72 }));
    const umbBeigeMat = trackMat(new THREE.MeshStandardMaterial({ color: '#C8B9A6', roughness: 0.75 }));
    const woodHandleMat = makeWoodMat(secondaryHex);

    // 1. Thick textured coir welcome doormat (62×42×2.2 cm) on left-center
    const matX = -0.1;
    addMesh(new THREE.BoxGeometry(0.64, 0.008, 0.44), rubberMat, [matX, 0.004, 0.02]);
    addMesh(
      new THREE.BoxGeometry(0.60, 0.018, 0.40),
      [coirSideMat, coirSideMat, coirTopMat, coirSideMat, coirSideMat, coirSideMat] as unknown as THREE.Material,
      [matX, 0.016, 0.02],
    );

    // 2. Cylindrical fluted matte-black & brushed-brass umbrella stand beside mat
    const standX = 0.31;
    const standZ = -0.06;
    const standH = 0.44;
    const standR = 0.095;
    addMesh(new THREE.CylinderGeometry(standR, standR * 0.95, standH, 32, 1, true), standMat, [standX, standH / 2, standZ]);
    addMesh(new THREE.CylinderGeometry(standR * 0.96, standR * 0.96, 0.018, 28), brassMat, [standX, 0.009, standZ]);
    addMesh(new THREE.TorusGeometry(standR, 0.007, 12, 32), brassMat, [standX, standH, standZ], [Math.PI / 2, 0, 0]);
    // Decorative brass mid-band
    addMesh(new THREE.TorusGeometry(standR + 0.002, 0.005, 10, 32), brassMat, [standX, standH * 0.25, standZ], [Math.PI / 2, 0, 0]);

    // 2 folded umbrellas (charcoal + beige) with curved wooden J-handles + long brass shoehorn
    addMesh(new THREE.CylinderGeometry(0.026, 0.014, 0.48, 14), umbDarkMat, [standX - 0.025, 0.26, standZ], [0.1, 0, 0.08]);
    addMesh(new THREE.CylinderGeometry(0.008, 0.008, 0.14, 10), woodHandleMat, [standX - 0.04, 0.54, standZ + 0.015], [0.1, 0, 0.08]);
    addMesh(new THREE.TorusGeometry(0.028, 0.008, 10, 20, Math.PI), woodHandleMat, [standX - 0.072, 0.60, standZ + 0.02], [0, 0.3, 0]);

    addMesh(new THREE.CylinderGeometry(0.024, 0.013, 0.46, 14), umbBeigeMat, [standX + 0.028, 0.25, standZ - 0.015], [-0.08, 0, -0.1]);
    addMesh(new THREE.CylinderGeometry(0.008, 0.008, 0.12, 10), woodHandleMat, [standX + 0.045, 0.51, standZ - 0.025], [-0.08, 0, -0.1]);
    addMesh(new THREE.TorusGeometry(0.025, 0.0075, 10, 20, Math.PI), woodHandleMat, [standX + 0.07, 0.56, standZ - 0.025], [0, -0.2, 0]);

    // Long brushed-brass shoehorn (kerata)
    addMesh(new THREE.CylinderGeometry(0.006, 0.012, 0.48, 10), brassMat, [standX + 0.005, 0.29, standZ + 0.036], [0.14, 0, 0]);
  }

  // ============================================================================
  // 10. Traverten & Ceviz Çıtalı Modern Antre Dresuar + Oval LED Ayna Seti (125×36×185)
  // ============================================================================
  else if (asset.archetype === 'tr_entryway_console_mirror_set') {
    const stoneTex = trackTex(createTravertineTex(primaryHex, options.maxAnisotropy));
    const stoneMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: stoneTex,
        roughness: pf?.primary.roughness ?? 0.42,
        metalness: pf?.primary.metalness ?? 0.04,
      }),
    );
    const woodMat = makeWoodMat(secondaryHex);
    const metalMat = makeAccentMat();
    const mirrorMat = makeMirrorMat(glassHex);
    const ledMat = makeWarmLedMat(2.2);
    const haloMat = makeLedHaloMat(0.28);
    const ceramicMat = trackMat(new THREE.MeshStandardMaterial({ color: '#ECE6DC', roughness: 0.46 }));

    const consoleH = 0.82;
    const apronH = 0.17;
    const legH = consoleH - apronH - 0.028;

    // Twin sculptural rounded fluted wood pedestal legs + slim brass horizontal stretcher
    for (const lx of [-w * 0.34, w * 0.34]) {
      addMesh(new THREE.CylinderGeometry(0.09, 0.09, legH, 24), woodMat, [lx, legH / 2, 0]);
      // Subtle metallic collar rings at top & bottom of legs
      addMesh(new THREE.CylinderGeometry(0.094, 0.094, 0.016, 24), metalMat, [lx, 0.01, 0]);
      addMesh(new THREE.CylinderGeometry(0.094, 0.094, 0.014, 24), metalMat, [lx, legH - 0.008, 0]);
    }
    addMesh(new THREE.CylinderGeometry(0.011, 0.011, w * 0.68, 14), metalMat, [0, 0.16, 0], [0, 0, Math.PI / 2]);

    // Oval-ended fluted walnut console apron body with 2 concealed drawers
    const pillGeo = new THREE.ExtrudeGeometry(createPillShape(w - 0.04, d - 0.04), {
      depth: apronH,
      bevelEnabled: true,
      bevelSize: 0.004,
      bevelThickness: 0.004,
      bevelSegments: 2,
    });
    pillGeo.rotateX(Math.PI / 2);
    addMesh(pillGeo, woodMat, [0, consoleH - 0.028, 0]);
    // Subtle brass drawer pull trims
    for (const dx of [-0.22, 0.22]) {
      addMesh(new THREE.BoxGeometry(0.14, 0.012, 0.012), metalMat, [dx, consoleH - 0.11, d / 2 - 0.012]);
    }

    // Thick honed travertine/Calacatta pill-shaped top slab
    const topGeo = new THREE.ExtrudeGeometry(createPillShape(w, d), {
      depth: 0.028,
      bevelEnabled: true,
      bevelSize: 0.004,
      bevelThickness: 0.004,
      bevelSegments: 3,
    });
    topGeo.rotateX(Math.PI / 2);
    addMesh(topGeo, stoneMat, [0, consoleH, 0]);

    // Styled entryway objects on console: travertine catchall bowl, reed diffuser with wooden sticks, sculptural ceramic vase
    addMesh(new THREE.CylinderGeometry(0.095, 0.07, 0.036, 24), stoneMat, [-0.34, consoleH + 0.018, 0.02]);
    // Reed diffuser bottle + 5 rattan diffuser sticks
    addMesh(new THREE.CylinderGeometry(0.032, 0.036, 0.11, 18), metalMat, [0.22, consoleH + 0.055, 0.03]);
    for (let r = 0; r < 5; r++) {
      const ang = (r - 2) * 0.14;
      addMesh(new THREE.CylinderGeometry(0.0025, 0.0025, 0.2, 6), woodMat, [0.22 + ang * 0.09, consoleH + 0.14, 0.03], [0.06, 0, -ang]);
    }
    // Sculptural ceramic arch vase on right
    addMesh(new THREE.CylinderGeometry(0.055, 0.072, 0.22, 24), ceramicMat, [0.40, consoleH + 0.11, -0.02]);

    // Floating backlit oval/pill architectural mirror mounted above console (+100 to +184 cm)
    const mirW = 0.64;
    const mirH = 0.86;
    const mirY = 1.42;
    const mirZ = -d / 2 + 0.035;
    const haloGeo = new THREE.ShapeGeometry(createPillShape(mirW + 0.09, mirH + 0.09), 32);
    addMesh(haloGeo, haloMat, [0, mirY, mirZ - 0.014], [0, 0, 0], false);
    const backLedGeo = new THREE.ExtrudeGeometry(createPillShape(mirW - 0.01, mirH - 0.01), { depth: 0.012, bevelEnabled: false });
    addMesh(backLedGeo, ledMat, [0, mirY, mirZ - 0.008], [0, 0, 0], false);
    const frameGeo = new THREE.ExtrudeGeometry(createPillShape(mirW, mirH), { depth: 0.022, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003 });
    addMesh(frameGeo, metalMat, [0, mirY, mirZ]);
    const glassGeo = new THREE.ShapeGeometry(createPillShape(mirW - 0.026, mirH - 0.026), 32);
    addMesh(glassGeo, mirrorMat, [0, mirY, mirZ + 0.026]);
  }

  // ============================================================================
  // 11. Kemerli (Arch) İnce Metal Çerçeveli & Arkadan LED'li Boy Aynası (75×8×185)
  // ============================================================================
  else if (asset.archetype === 'tr_arched_led_floor_mirror') {
    const frameMat = makeAccentMat();
    const backMat = makePrimaryMat();
    const mirrorMat = makeMirrorMat(glassHex);
    const ledMat = makeWarmLedMat(2.2);
    const haloMat = makeLedHaloMat(0.28);

    // Subtle 4° architectural leaning angle with rear fold-out support easel
    const mirPivot = new THREE.Group();
    mirPivot.position.set(0, 0.005, 0.04);
    mirPivot.rotation.x = -0.06;
    group.add(mirPivot);

    const addM = (geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number], cast = true) => {
      const m = new THREE.Mesh(trackGeo(geo), mat);
      m.position.set(...pos);
      m.castShadow = cast;
      m.receiveShadow = true;
      mirPivot.add(m);
    };

    // Warm 3000K rear ambient LED glow silhouette + emissive rear diffuser rim
    addM(new THREE.ShapeGeometry(createArchShape(w + 0.08, h + 0.05), 36), haloMat, [0, -0.01, -0.026], false);
    addM(
      new THREE.ExtrudeGeometry(createArchShape(w - 0.014, h - 0.01), { depth: 0.012, bevelEnabled: false }),
      ledMat,
      [0, 0.006, -0.018],
      false,
    );

    // Sleek arched aluminum outer frame
    addM(
      new THREE.ExtrudeGeometry(createArchShape(w, h), {
        depth: 0.028,
        bevelEnabled: true,
        bevelSize: 0.003,
        bevelThickness: 0.003,
      }),
      frameMat,
      [0, 0, -0.006],
    );
    // High-reflectivity arched crystal mirror pane
    addM(new THREE.ShapeGeometry(createArchShape(w - 0.026, h - 0.026), 36), mirrorMat, [0, 0.013, 0.0255]);
    // Rear backing board
    addM(new THREE.ShapeGeometry(createArchShape(w - 0.03, h - 0.03), 24), backMat, [0, 0.015, -0.01]);

    // Rear folding easel stand leg (hinged cleanly behind rear backing board)
    addMesh(new THREE.BoxGeometry(0.022, 1.06, 0.016), frameMat, [-0.18, 0.53, -0.20], [0.22, 0, 0]);
    addMesh(new THREE.BoxGeometry(0.022, 1.06, 0.016), frameMat, [0.18, 0.53, -0.20], [0.22, 0, 0]);
    addMesh(new THREE.BoxGeometry(0.38, 0.018, 0.016), frameMat, [0, 0.22, -0.27]);
  }

  // ============================================================================
  // 12. Asimetrik Organik Formlu Arkadan Gün Işığı LED'li Antre Aynası (85×5×115)
  // ============================================================================
  else if (asset.archetype === 'tr_organic_led_wall_mirror') {
    const mirrorMat = makeMirrorMat(glassHex);
    const metalMat = makeAccentMat();
    const ledMat = makeWarmLedMat(2.4);
    const haloMat = makeLedHaloMat(0.34);

    const cy = h / 2;
    // Soft 360° warm wall halo behind floating organic mirror
    addMesh(new THREE.ShapeGeometry(createOrganicMirrorShape(w + 0.11, h + 0.11), 40), haloMat, [0, cy, 0.003], [0, 0, 0], false);
    // Concealed rear LED diffuser rim
    addMesh(
      new THREE.ExtrudeGeometry(createOrganicMirrorShape(w - 0.03, h - 0.03), { depth: 0.016, bevelEnabled: false }),
      ledMat,
      [0, cy, 0.008],
      [0, 0, 0],
      false,
    );
    // Frameless polished-edge crystal organic mirror
    addMesh(
      new THREE.ExtrudeGeometry(createOrganicMirrorShape(w, h), {
        depth: 0.008,
        bevelEnabled: true,
        bevelSize: 0.0025,
        bevelThickness: 0.0025,
        bevelSegments: 2,
      }),
      metalMat,
      [0, cy, 0.025],
    );
    addMesh(new THREE.ShapeGeometry(createOrganicMirrorShape(w - 0.006, h - 0.006), 40), mirrorMat, [0, cy, 0.036]);
    // Subtle touch sensor ring at bottom center
    addMesh(new THREE.TorusGeometry(0.016, 0.002, 10, 24), ledMat, [0, cy - h * 0.34, 0.038], [0, 0, 0], false);
  }

  // ============================================================================
  // 13. Akustik Keçeli Ahşap Duvar Çıtası + Gizli LED + Metal Askı Paneli (120×8×240)
  // ============================================================================
  else if (asset.archetype === 'tr_acoustic_slat_coat_panel') {
    const slatMat = makeWoodMat(secondaryHex);
    const metalMat = makeAccentMat();
    const feltMat = trackMat(new THREE.MeshStandardMaterial({ color: '#1B1E24', roughness: 0.94 }));
    const ledMat = makeWarmLedMat(2.5);
    const haloMat = makeLedHaloMat(0.24);

    // Full-height 120×240 cm acoustic charcoal PET felt backing
    addMesh(new THREE.BoxGeometry(w, h, 0.014), feltMat, [0, h / 2, 0.007]);

    // 18 crisp vertical natural oak/walnut wood slats + 2 full-height recessed 3000K linear LED strips
    const slatCount = 18;
    const pitch = (w - 0.03) / slatCount;
    for (let i = 0; i < slatCount; i++) {
      const sx = -(w - 0.03) / 2 + pitch * (i + 0.5);
      addMesh(new THREE.BoxGeometry(pitch * 0.62, h - 0.01, 0.028), slatMat, [sx, h / 2, 0.028]);
    }
    // Dual recessed vertical 3000K architectural LED lines nestled cleanly in grooves 5 & 12
    for (const idx of [5, 12]) {
      const lx = -(w - 0.03) / 2 + pitch * idx;
      addMesh(new THREE.BoxGeometry(0.01, h - 0.04, 0.018), ledMat, [lx, h / 2, 0.024], [0, 0, 0], false);
      addMesh(new THREE.PlaneGeometry(0.055, h - 0.04), haloMat, [lx, h / 2, 0.036], [0, 0, 0], false);
    }

    // 5 ergonomic staggered cylindrical brass/matte-black wall coat pegs
    const pegs: Array<[number, number]> = [
      [-0.4, 1.66],
      [-0.2, 1.52],
      [0.0, 1.68],
      [0.2, 1.54],
      [0.4, 1.66],
    ];
    for (const [px, py] of pegs) {
      addMesh(new THREE.CylinderGeometry(0.016, 0.013, 0.058, 18), metalMat, [px, py, 0.068], [Math.PI / 2, 0, 0]);
      addMesh(new THREE.CylinderGeometry(0.022, 0.022, 0.01, 18), metalMat, [px, py, 0.098], [Math.PI / 2, 0, 0]);
    }

    // Floating slim walnut/oak entryway key & mail ledge at +108 cm
    addMesh(new THREE.BoxGeometry(0.56, 0.028, 0.14), slatMat, [0, 1.08, 0.105]);
    addMesh(new THREE.BoxGeometry(0.56, 0.008, 0.012), metalMat, [0, 1.096, 0.168]);
  }

  // ============================================================================
  // 14. Ahşap & Metal Duvar Tipi Antre Anahtarlık, Mektupluk & Raf (48×12×22)
  // ============================================================================
  else if (asset.archetype === 'tr_wall_key_mail_organizer') {
    const woodMat = makeWoodMat(secondaryHex);
    const metalMat = makeAccentMat();
    const paperMat = trackMat(new THREE.MeshStandardMaterial({ color: '#F8F7F4', roughness: 0.78 }));
    const brassMat = trackMat(new THREE.MeshStandardMaterial({ color: '#D4AF5A', roughness: 0.2, metalness: 0.94 }));
    const darkMat = trackMat(new THREE.MeshStandardMaterial({ color: '#1E222A', roughness: 0.42, metalness: 0.5 }));

    // Solid beveled wood backboard + top catchall shelf
    addMesh(new THREE.BoxGeometry(w, h, 0.022), woodMat, [0, h / 2, 0.011]);
    addMesh(new THREE.BoxGeometry(w, 0.018, d - 0.02), woodMat, [0, h - 0.075, d / 2]);
    // Front mail retainer lip on left half of top ledge
    addMesh(new THREE.BoxGeometry(w * 0.46, 0.052, 0.006), metalMat, [-w * 0.24, h - 0.042, d - 0.016]);
    // Folded letter envelopes tucked neatly behind mail rail
    addMesh(new THREE.BoxGeometry(0.16, 0.105, 0.007), paperMat, [-w * 0.26, h - 0.012, d - 0.036], [-0.14, 0, 0.04]);
    addMesh(new THREE.BoxGeometry(0.14, 0.092, 0.006), paperMat, [-w * 0.18, h - 0.02, d - 0.05], [-0.18, 0, -0.05]);
    // Folded sunglasses / wallet tray on right side of shelf
    addMesh(new THREE.BoxGeometry(0.14, 0.022, 0.072), darkMat, [w * 0.24, h - 0.055, d * 0.55]);

    // Lower matte black powder-coated steel key rail + 6 curved key hooks
    addMesh(new THREE.BoxGeometry(w - 0.04, 0.032, 0.008), metalMat, [0, 0.045, 0.026]);
    for (let k = 0; k < 6; k++) {
      const kx = -(w - 0.1) / 2 + (k / 5) * (w - 0.1);
      addMesh(new THREE.CylinderGeometry(0.004, 0.004, 0.026, 10), metalMat, [kx, 0.045, 0.038], [Math.PI / 2, 0, 0]);
      addMesh(new THREE.CylinderGeometry(0.004, 0.004, 0.018, 10), metalMat, [kx, 0.052, 0.05], [0.2, 0, 0]);

      // Hang realistic brass apartment keys on hooks 1 and 4
      if (k === 1 || k === 4) {
        addMesh(new THREE.TorusGeometry(0.012, 0.0022, 8, 18), brassMat, [kx, 0.032, 0.048]);
        addMesh(new THREE.BoxGeometry(0.009, 0.042, 0.003), brassMat, [kx - 0.004, 0.002, 0.048], [0, 0, 0.12]);
        addMesh(new THREE.BoxGeometry(0.009, 0.038, 0.003), brassMat, [kx + 0.006, 0.004, 0.051], [0, 0, -0.16]);
      }
    }
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
