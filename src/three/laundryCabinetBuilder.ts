import * as THREE from 'three';
import type { ArchitecturalAsset, MaterialFinish, PatternVariant } from '../lib/catalogTypes';
import {
  createFabricBumpTexture,
  createWoodGrainTexture,
  getArchitecturalSurfaceTextureSet,
} from './proceduralTextures';

export interface LaundryBuildOptions {
  isSoftwareGl: boolean;
  maxAnisotropy: number;
  wireframe?: boolean;
  pattern?: PatternVariant;
}

export interface LaundryBuiltResult {
  group: THREE.Group;
  dispose: () => void;
}

export const LAUNDRY_ARCHETYPES = new Set<ArchitecturalAsset['archetype']>([
  'laundry_side_by_side_elevated',
  'laundry_stacked_tower_hamper',
  'laundry_side_by_side_counter',
  'laundry_stacked_sink_combo',
  'laundry_utility_broom_closet',
  'laundry_clean_dirty_sorter',
  'laundry_compact_banyo_tower',
  'laundry_villa_quad_wall',
]);

export function isLaundryCabinetArchetype(
  archetype: ArchitecturalAsset['archetype'],
): boolean {
  return LAUNDRY_ARCHETYPES.has(archetype);
}

function createWovenRattanTexture(
  baseHex: string,
  anisotropy = 4,
): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 256;
  const cColor = document.createElement('canvas');
  cColor.width = size;
  cColor.height = size;
  const ctxC = cColor.getContext('2d')!;

  const cBump = document.createElement('canvas');
  cBump.width = size;
  cBump.height = size;
  const ctxB = cBump.getContext('2d')!;

  const base = new THREE.Color(baseHex);
  const dark = base.clone().multiplyScalar(0.68);
  const light = base.clone().lerp(new THREE.Color('#ffffff'), 0.18);

  ctxC.fillStyle = `#${dark.getHexString()}`;
  ctxC.fillRect(0, 0, size, size);
  ctxB.fillStyle = '#3c3c3c';
  ctxB.fillRect(0, 0, size, size);

  const cell = 16;
  for (let row = 0; row < size / cell; row++) {
    for (let col = 0; col < size / cell; col++) {
      const x = col * cell;
      const y = row * cell;
      const horiz = (row + col) % 2 === 0;
      const colStr = horiz ? `#${light.getHexString()}` : `#${base.getHexString()}`;
      if (horiz) {
        ctxC.fillStyle = colStr;
        ctxC.fillRect(x + 1, y + 3, cell - 2, cell - 6);
        ctxB.fillStyle = '#d4d4d4';
        ctxB.fillRect(x + 1, y + 3, cell - 2, cell - 6);
      } else {
        ctxC.fillStyle = colStr;
        ctxC.fillRect(x + 3, y + 1, cell - 6, cell - 2);
        ctxB.fillStyle = '#b6b6b6';
        ctxB.fillRect(x + 3, y + 1, cell - 6, cell - 2);
      }
    }
  }

  const map = new THREE.CanvasTexture(cColor);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(3, 2);
  map.anisotropy = anisotropy;

  const bumpMap = new THREE.CanvasTexture(cBump);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(3, 2);
  bumpMap.anisotropy = anisotropy;

  return { map, bumpMap };
}

function createRoundedPlateGeo(
  width: number,
  height: number,
  depth: number,
  bevel = 0.004,
): THREE.ExtrudeGeometry {
  const b = Math.min(bevel, width * 0.15, height * 0.15, depth * 0.35);
  const innerW = Math.max(0.008, width - b * 2);
  const innerH = Math.max(0.008, height - b * 2);
  const hw = innerW / 2;
  const hh = innerH / 2;
  const r = Math.min(0.006, hw * 0.4, hh * 0.4);

  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.003, depth - b * 2),
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelSegments: 2,
    curveSegments: 4,
  });
  geo.center();
  return geo;
}

export function buildLaundryCabinetMesh(
  asset: ArchitecturalAsset,
  finish: MaterialFinish,
  options: LaundryBuildOptions,
): LaundryBuiltResult {
  const group = new THREE.Group();
  group.name = asset.slug || asset.id;

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    if (options.wireframe && 'wireframe' in m) {
      (m as unknown as { wireframe: boolean }).wireframe = true;
    }
    materials.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    textures.push(t);
    return t;
  };
  const shadow = <T extends THREE.Object3D>(obj: T): T => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = !options.isSoftwareGl;
      obj.receiveShadow = !options.isSoftwareGl;
    }
    return obj;
  };

  const w = asset.dimensionsCm.width / 100;
  const d = asset.dimensionsCm.depth / 100;
  const h = asset.dimensionsCm.height / 100;
  const frontZ = d / 2;

  const patternId = options.pattern?.id ?? 'original_pbr';
  const roughDelta = options.pattern?.roughnessDelta ?? 0;
  const tactileMaps =
    typeof document !== 'undefined'
      ? getArchitecturalSurfaceTextureSet(patternId, options.maxAnisotropy)
      : null;

  // Resolve smart palette roles even when user uses Custom RAL/HEX Color Studio
  const isCustomColorStudio =
    finish.id.startsWith('ral-') || finish.id.startsWith('ozel-');
  const cabinetHex = finish.primaryHex;
  const interiorWoodHex = isCustomColorStudio
    ? '#C9A982'
    : finish.secondaryHex || '#C9A982';
  const hardwareHex = isCustomColorStudio
    ? finish.metalness >= 0.65
      ? finish.primaryHex
      : '#23262C'
    : finish.accentHex || '#23262C';

  const effectiveRough = THREE.MathUtils.clamp(
    (tactileMaps?.roughnessOverride ?? finish.roughness) + roughDelta,
    0.12,
    0.92,
  );
  const effectiveMetal = tactileMaps?.metalnessOverride ?? finish.metalness;

  // Primary cabinet doors & carcass material (reacts to live color & tactile PBR textures!)
  const matCabinet = trackMat(
    new THREE.MeshStandardMaterial({
      color: cabinetHex,
      roughness: effectiveRough,
      metalness: effectiveMetal,
      map: tactileMaps?.map ?? null,
      bumpMap: tactileMaps?.bumpMap ?? null,
      bumpScale: tactileMaps ? tactileMaps.bumpScale : 0.004,
    }),
  );

  // Subtle recessed interior / shaker frame shadow tone
  const cabinetInnerColor = new THREE.Color(cabinetHex).multiplyScalar(0.86);
  const matCabinetRecess = trackMat(
    new THREE.MeshStandardMaterial({
      color: cabinetInnerColor,
      roughness: Math.min(0.92, effectiveRough + 0.08),
      metalness: effectiveMetal * 0.6,
    }),
  );

  const matShadowGap = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#191c22',
      roughness: 0.9,
      metalness: 0.05,
    }),
  );

  // Warm natural oak interior shelves / niche panels
  const oakTex = createWoodGrainTexture(interiorWoodHex, options.maxAnisotropy);
  trackTex(oakTex.map);
  trackTex(oakTex.bumpMap);
  const matOakInterior = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: oakTex.map,
      bumpMap: oakTex.bumpMap,
      bumpScale: 0.006,
      roughness: 0.56,
      metalness: 0.02,
    }),
  );

  // Hardware (slim matte-black / brushed brass bar handles, faucets, rails)
  const isBrassHardware =
    hardwareHex.toLowerCase().includes('c5') ||
    hardwareHex.toLowerCase().includes('c7') ||
    hardwareHex.toLowerCase().includes('d4') ||
    hardwareHex.toLowerCase().includes('b8');
  const matHardware = trackMat(
    new THREE.MeshStandardMaterial({
      color: hardwareHex,
      roughness: isBrassHardware ? 0.24 : 0.34,
      metalness: isBrassHardware ? 0.92 : 0.78,
    }),
  );

  const matChrome = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#e2e6ec',
      roughness: 0.14,
      metalness: 0.95,
    }),
  );

  const matSteelRail = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#bfc5ce',
      roughness: 0.24,
      metalness: 0.9,
    }),
  );

  // Marble / quartz countertop material
  const marbleMaps =
    typeof document !== 'undefined'
      ? getArchitecturalSurfaceTextureSet('marble_vein', options.maxAnisotropy)
      : null;
  const matMarble = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: '#f4f2ee',
      map: marbleMaps?.map ?? null,
      bumpMap: marbleMaps?.bumpMap ?? null,
      bumpScale: 0.002,
      roughness: 0.16,
      metalness: 0.02,
      clearcoat: 0.55,
      clearcoatRoughness: 0.14,
    }),
  );

  const matCeramicSink = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: '#fbfcfd',
      roughness: 0.08,
      metalness: 0.01,
      clearcoat: 0.9,
      clearcoatRoughness: 0.06,
    }),
  );

  // Appliance materials (untinted so washers & dryers ALWAYS stay crisp & authentic!)
  const darkMachineFinish =
    cabinetHex.toLowerCase() === '#22262e' ||
    cabinetHex.toLowerCase() === '#343840' ||
    cabinetHex.toLowerCase() === '#2f3540';
  const matApplianceBody = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: darkMachineFinish ? '#383d46' : '#f7f8fa',
      roughness: darkMachineFinish ? 0.28 : 0.16,
      metalness: darkMachineFinish ? 0.42 : 0.06,
      clearcoat: 0.65,
      clearcoatRoughness: 0.12,
    }),
  );
  const matApplianceFascia = trackMat(
    new THREE.MeshStandardMaterial({
      color: darkMachineFinish ? '#252930' : '#eef0f4',
      roughness: 0.22,
      metalness: 0.12,
    }),
  );
  const matDoorRing = trackMat(
    new THREE.MeshStandardMaterial({
      color: darkMachineFinish ? '#1c1f24' : '#262a32',
      roughness: 0.24,
      metalness: 0.65,
    }),
  );
  const matDoorBezelChrome = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#dce1e8',
      roughness: 0.16,
      metalness: 0.94,
    }),
  );
  const matDrumInterior = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#9aa2ad',
      roughness: 0.28,
      metalness: 0.88,
      side: THREE.DoubleSide,
    }),
  );
  const matRubberGasket = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#4b515c',
      roughness: 0.84,
      metalness: 0.04,
    }),
  );
  const matSmokedGlass = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: '#1b2029',
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    }),
  );
  const matDisplayBlack = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#101318',
      roughness: 0.12,
      metalness: 0.2,
    }),
  );
  const matLedCyan = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#7dd3fc',
      emissive: new THREE.Color('#38bdf8'),
      emissiveIntensity: 1.4,
      roughness: 0.2,
    }),
  );
  const matLedWarm = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#fff4dc',
      emissive: new THREE.Color('#ffd48a'),
      emissiveIntensity: 1.65,
      roughness: 0.2,
    }),
  );

  // Woven rattan & cream basket materials
  const rattanTex = createWovenRattanTexture('#c59f72', options.maxAnisotropy);
  trackTex(rattanTex.map);
  trackTex(rattanTex.bumpMap);
  const matRattan = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: rattanTex.map,
      bumpMap: rattanTex.bumpMap,
      bumpScale: 0.012,
      roughness: 0.82,
      metalness: 0.0,
    }),
  );

  const creamBasketTex = createWovenRattanTexture('#e5dfd4', options.maxAnisotropy);
  trackTex(creamBasketTex.map);
  trackTex(creamBasketTex.bumpMap);
  const matCreamBasket = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: creamBasketTex.map,
      bumpMap: creamBasketTex.bumpMap,
      bumpScale: 0.01,
      roughness: 0.85,
      metalness: 0.0,
    }),
  );

  // Folded clean towels & dirty laundry fabrics
  const fabricBump = trackTex(createFabricBumpTexture(options.maxAnisotropy));
  const makeFabricMat = (hex: string) =>
    trackMat(
      new THREE.MeshStandardMaterial({
        color: hex,
        bumpMap: fabricBump,
        bumpScale: 0.008,
        roughness: 0.91,
        metalness: 0.0,
      }),
    );

  const matTowelIvory = makeFabricMat('#f2ede4');
  const matTowelOat = makeFabricMat('#d9cec0');
  const matTowelSage = makeFabricMat('#9fa99b');
  const matDirtyDenim = makeFabricMat('#5a6d84');
  const matDirtyTerracotta = makeFabricMat('#b0725c');
  const matDirtyCharcoal = makeFabricMat('#4b4f58');
  const matAmberGlass = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: '#8f4f1c',
      roughness: 0.14,
      metalness: 0.05,
      clearcoat: 0.85,
    }),
  );

  // --- REUSABLE ARCHITECTURAL SUB-BUILDERS ---

  const addBox = (
    parent: THREE.Object3D,
    bw: number,
    bh: number,
    bd: number,
    x: number,
    y: number,
    z: number,
    mat: THREE.Material,
  ) => {
    const mesh = shadow(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(bw, bh, bd)), mat));
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };

  /** Crisp cabinet door or drawer front with shadow reveal backing, beveled slab, optional shaker frame & bar handle */
  const addCabinetDoor = (
    parent: THREE.Object3D,
    dw: number,
    dh: number,
    x: number,
    y: number,
    zFront: number,
    opts: {
      shaker?: boolean;
      handleSide?: 'left' | 'right' | 'top-center' | 'center' | 'none';
      handleOrientation?: 'vertical' | 'horizontal';
      handleLength?: number;
      tiltOutDeg?: number;
      ovalCutout?: boolean;
    } = {},
  ) => {
    const gap = 0.004;
    const doorW = Math.max(0.06, dw - gap);
    const doorH = Math.max(0.06, dh - gap);
    const doorDepth = 0.02;

    // Dark recessed reveal plane behind the door edge
    addBox(parent, dw, dh, 0.004, x, y, zFront - doorDepth - 0.001, matShadowGap);

    const doorGroup = new THREE.Group();
    if (opts.tiltOutDeg) {
      // Pivot from bottom edge so tilt-out hamper opens cleanly forward!
      doorGroup.position.set(x, y - doorH / 2, zFront - doorDepth / 2);
      doorGroup.rotation.x = THREE.MathUtils.degToRad(opts.tiltOutDeg);
      const innerOffset = new THREE.Group();
      innerOffset.position.set(0, doorH / 2, 0);
      doorGroup.add(innerOffset);
      parent.add(doorGroup);
      buildDoorFace(innerOffset, doorW, doorH, doorDepth, opts);
    } else {
      doorGroup.position.set(x, y, zFront - doorDepth / 2);
      parent.add(doorGroup);
      buildDoorFace(doorGroup, doorW, doorH, doorDepth, opts);
    }
    return doorGroup;
  };

  const buildDoorFace = (
    host: THREE.Group,
    doorW: number,
    doorH: number,
    doorDepth: number,
    opts: {
      shaker?: boolean;
      handleSide?: 'left' | 'right' | 'top-center' | 'center' | 'none';
      handleOrientation?: 'vertical' | 'horizontal';
      handleLength?: number;
      ovalCutout?: boolean;
    },
  ) => {
    if (opts.shaker) {
      // Shaker recessed inner panel + 4 perimeter stiles & rails
      const frame = Math.min(0.052, doorW * 0.16, doorH * 0.18);
      addBox(host, doorW - frame * 1.6, doorH - frame * 1.6, doorDepth * 0.65, 0, 0, -0.002, matCabinetRecess);
      // Left & Right stiles
      addBox(host, frame, doorH, doorDepth, -doorW / 2 + frame / 2, 0, 0, matCabinet);
      addBox(host, frame, doorH, doorDepth, doorW / 2 - frame / 2, 0, 0, matCabinet);
      // Top & Bottom rails
      addBox(host, doorW - frame * 2, frame, doorDepth, 0, doorH / 2 - frame / 2, 0, matCabinet);
      addBox(host, doorW - frame * 2, frame, doorDepth, 0, -doorH / 2 + frame / 2, 0, matCabinet);
    } else {
      const panel = shadow(
        new THREE.Mesh(
          trackGeo(createRoundedPlateGeo(doorW, doorH, doorDepth, 0.003)),
          matCabinet,
        ),
      );
      host.add(panel);
    }

    if (opts.ovalCutout) {
      // Recessed pill-shaped laundry drop slot (inspired by Pinterest modern laundry sorter!)
      const slotW = Math.min(0.14, doorW * 0.36);
      const slotH = 0.044;
      const slot = new THREE.Mesh(
        trackGeo(createRoundedPlateGeo(slotW, slotH, 0.008, 0.003)),
        matShadowGap,
      );
      slot.position.set(0, doorH * 0.22, doorDepth * 0.42);
      host.add(slot);
    }

    const handleSide = opts.handleSide ?? 'none';
    if (handleSide === 'none') return;

    const orient = opts.handleOrientation ?? (handleSide === 'left' || handleSide === 'right' ? 'vertical' : 'horizontal');
    const len = opts.handleLength ?? (orient === 'vertical' ? Math.min(0.16, doorH * 0.28) : Math.min(0.16, doorW * 0.34));
    const hx =
      handleSide === 'left'
        ? -doorW / 2 + 0.036
        : handleSide === 'right'
          ? doorW / 2 - 0.036
          : 0;
    const hy =
      handleSide === 'top-center'
        ? doorH / 2 - 0.042
        : handleSide === 'left' || handleSide === 'right'
          ? -doorH * 0.22
          : 0;
    const hz = doorDepth / 2 + 0.022;

    if (orient === 'vertical') {
      addBox(host, 0.01, len, 0.01, hx, hy, hz, matHardware);
      addBox(host, 0.008, 0.01, 0.022, hx, hy + len * 0.36, doorDepth / 2 + 0.01, matHardware);
      addBox(host, 0.008, 0.01, 0.022, hx, hy - len * 0.36, doorDepth / 2 + 0.01, matHardware);
    } else {
      addBox(host, len, 0.01, 0.01, hx, hy, hz, matHardware);
      addBox(host, 0.01, 0.008, 0.022, hx - len * 0.36, hy, doorDepth / 2 + 0.01, matHardware);
      addBox(host, 0.01, 0.008, 0.022, hx + len * 0.36, hy, doorDepth / 2 + 0.01, matHardware);
    }
  };

  /** Photorealistic front-load washing machine or heat-pump dryer (59.5 x 58 x 84.5 cm) */
  const createFrontLoadAppliance = (
    kind: 'washer' | 'dryer',
    bw = 0.595,
    bh = 0.845,
    bd = 0.58,
  ): THREE.Group => {
    const g = new THREE.Group();
    const fz = bd / 2;

    // 1. Main enameled rounded housing
    const body = shadow(
      new THREE.Mesh(
        trackGeo(createRoundedPlateGeo(bw, bh, bd, 0.008)),
        matApplianceBody,
      ),
    );
    body.position.set(0, bh / 2, 0);
    g.add(body);

    // 2. Top control fascia panel (12 cm tall) with crisp 2mm shadow seam
    const fasciaH = 0.125;
    const fasciaY = bh - fasciaH / 2 - 0.006;
    addBox(g, bw - 0.008, 0.004, 0.01, 0, bh - fasciaH - 0.008, fz - 0.002, matShadowGap);
    const fascia = shadow(
      new THREE.Mesh(
        trackGeo(createRoundedPlateGeo(bw - 0.008, fasciaH, 0.014, 0.003)),
        matApplianceFascia,
      ),
    );
    fascia.position.set(0, fasciaY, fz + 0.001);
    g.add(fascia);

    // 3. Detergent / Condensate Water Drawer (top-left)
    const dispW = bw * 0.28;
    const disp = shadow(
      new THREE.Mesh(
        trackGeo(createRoundedPlateGeo(dispW, fasciaH * 0.72, 0.012, 0.003)),
        matApplianceBody,
      ),
    );
    disp.position.set(-bw * 0.31, fasciaY, fz + 0.006);
    g.add(disp);
    // Recessed finger groove
    addBox(g, dispW * 0.65, 0.01, 0.006, -bw * 0.31, fasciaY - fasciaH * 0.24, fz + 0.01, matShadowGap);

    // 4. Central Rotary Program Dial (brushed metal cylinder + chrome collar)
    const dialGeo = trackGeo(new THREE.CylinderGeometry(0.028, 0.03, 0.018, 24));
    dialGeo.rotateX(Math.PI / 2);
    const dial = shadow(new THREE.Mesh(dialGeo, matDoorBezelChrome));
    dial.position.set(0, fasciaY, fz + 0.014);
    g.add(dial);

    const dialCapGeo = trackGeo(new THREE.CylinderGeometry(0.022, 0.022, 0.006, 20));
    dialCapGeo.rotateX(Math.PI / 2);
    const dialCap = new THREE.Mesh(dialCapGeo, matDisplayBlack);
    dialCap.position.set(0, fasciaY, fz + 0.022);
    g.add(dialCap);

    // 5. Right Glossy Black Digital LED Display + status dots
    const screenW = bw * 0.3;
    addBox(g, screenW, fasciaH * 0.56, 0.008, bw * 0.27, fasciaY, fz + 0.008, matDisplayBlack);
    for (let i = 0; i < 3; i++) {
      const dot = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.012, 0.006, 0.003)),
        i === 0 ? matLedWarm : matLedCyan,
      );
      dot.position.set(bw * 0.2 + i * 0.028, fasciaY, fz + 0.013);
      g.add(dot);
    }

    // 6. Hero Circular Porthole Door Assembly (centered cleanly below fascia)
    const doorCenterY = bh * 0.445;
    const outerRadius = Math.min(bw * 0.385, 0.228);

    // Outer dark matte ring & chrome highlight rim
    const outerRingGeo = trackGeo(new THREE.TorusGeometry(outerRadius, 0.026, 14, 36));
    const outerRing = shadow(new THREE.Mesh(outerRingGeo, matDoorRing));
    outerRing.position.set(0, doorCenterY, fz + 0.014);
    g.add(outerRing);

    const chromeTrimGeo = trackGeo(
      new THREE.TorusGeometry(outerRadius + 0.02, 0.007, 10, 36),
    );
    const chromeTrim = new THREE.Mesh(chromeTrimGeo, matDoorBezelChrome);
    chromeTrim.position.set(0, doorCenterY, fz + 0.02);
    g.add(chromeTrim);

    // Rubber gasket tunnel behind door
    const gasketGeo = trackGeo(
      new THREE.CylinderGeometry(outerRadius * 0.88, outerRadius * 0.82, 0.08, 28, 1, true),
    );
    gasketGeo.rotateX(Math.PI / 2);
    const gasket = new THREE.Mesh(gasketGeo, matRubberGasket);
    gasket.position.set(0, doorCenterY, fz - 0.025);
    g.add(gasket);

    // Visible stainless-steel perforated inner drum cylinder + rear wall
    const drumGeo = trackGeo(
      new THREE.CylinderGeometry(outerRadius * 0.8, outerRadius * 0.78, 0.26, 28, 1, true),
    );
    drumGeo.rotateX(Math.PI / 2);
    const drum = new THREE.Mesh(drumGeo, matDrumInterior);
    drum.position.set(0, doorCenterY, fz - 0.16);
    g.add(drum);

    const drumBackGeo = trackGeo(new THREE.CircleGeometry(outerRadius * 0.79, 24));
    const drumBack = new THREE.Mesh(drumBackGeo, matDrumInterior);
    drumBack.position.set(0, doorCenterY, fz - 0.28);
    g.add(drumBack);

    // 3 Stainless drum paddles / lifters visible inside drum
    for (let k = 0; k < 3; k++) {
      const ang = (k / 3) * Math.PI * 2 + (kind === 'dryer' ? 0.5 : 0.1);
      const paddle = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.028, 0.036, 0.2)),
        matDoorBezelChrome,
      );
      paddle.position.set(
        Math.cos(ang) * outerRadius * 0.68,
        doorCenterY + Math.sin(ang) * outerRadius * 0.68,
        fz - 0.16,
      );
      paddle.rotation.z = ang;
      g.add(paddle);
    }

    // Subtle hinge block on left & handle grip recess on right of porthole
    addBox(g, 0.026, 0.085, 0.022, -outerRadius - 0.015, doorCenterY, fz + 0.012, matDoorRing);
    addBox(g, 0.022, 0.095, 0.026, outerRadius + 0.008, doorCenterY, fz + 0.016, matDoorBezelChrome);

    // Convex smoked glass porthole dome (outer glossy glass layer with depthWrite=false)
    const glassGeo = trackGeo(
      new THREE.SphereGeometry(outerRadius * 0.9, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.36),
    );
    glassGeo.rotateX(Math.PI / 2);
    const glass = new THREE.Mesh(glassGeo, matSmokedGlass);
    glass.position.set(0, doorCenterY, fz - outerRadius * 0.56);
    glass.renderOrder = 3;
    g.add(glass);

    // Bottom plinth service flap on front-load washer
    if (kind === 'washer') {
      addBox(g, 0.11, 0.075, 0.006, bw * 0.31, 0.06, fz + 0.003, matApplianceFascia);
    }

    return g;
  };

  /** Woven rattan or cream laundry basket filled with folded clean towels or dirty laundry */
  const createWovenBasket = (
    bw: number,
    bh: number,
    bd: number,
    style: 'rattan-clean' | 'cream-clean' | 'rattan-dirty' | 'wire-dirty',
  ): THREE.Group => {
    const g = new THREE.Group();
    const wallT = 0.016;
    const basketMat =
      style === 'cream-clean'
        ? matCreamBasket
        : style === 'wire-dirty'
          ? matSteelRail
          : matRattan;

    // Bottom base + 4 woven walls (hollow interior!)
    addBox(g, bw, wallT, bd, 0, wallT / 2, 0, basketMat);
    addBox(g, bw, bh, wallT, 0, bh / 2, bd / 2 - wallT / 2, basketMat);
    addBox(g, bw, bh, wallT, 0, bh / 2, -bd / 2 + wallT / 2, basketMat);
    addBox(g, wallT, bh, bd - wallT * 2, -bw / 2 + wallT / 2, bh / 2, 0, basketMat);
    addBox(g, wallT, bh, bd - wallT * 2, bw / 2 - wallT / 2, bh / 2, 0, basketMat);

    // Rolled top collar rim
    addBox(g, bw + 0.012, 0.018, 0.022, 0, bh, bd / 2 - 0.006, basketMat);
    addBox(g, bw + 0.012, 0.018, 0.022, 0, bh, -bd / 2 + 0.006, basketMat);
    addBox(g, 0.022, 0.018, bd + 0.012, -bw / 2 + 0.006, bh, 0, basketMat);
    addBox(g, 0.022, 0.018, bd + 0.012, bw / 2 - 0.006, bh, 0, basketMat);

    // Carved handle slot on front face
    addBox(g, Math.min(0.09, bw * 0.34), 0.024, 0.02, 0, bh * 0.72, bd / 2 - 0.004, matShadowGap);

    if (style === 'rattan-clean' || style === 'cream-clean') {
      // Neatly folded clean towel stack inside basket
      const towelMats = [matTowelOat, matTowelIvory, matTowelSage, matTowelIvory];
      const layers = Math.max(2, Math.min(4, Math.floor((bh - 0.03) / 0.048)));
      for (let i = 0; i < layers; i++) {
        const th = 0.042;
        const towel = shadow(
          new THREE.Mesh(
            trackGeo(
              createRoundedPlateGeo(
                bw - 0.055,
                th,
                bd - 0.06,
                0.012,
              ),
            ),
            towelMats[i % towelMats.length],
          ),
        );
        towel.position.set(
          (i % 2 === 0 ? 1 : -1) * 0.004,
          wallT + th / 2 + i * (th + 0.003),
          0,
        );
        g.add(towel);
      }
    } else {
      // Soft organic dirty-laundry cloth mound
      const dirtyMats = [matDirtyDenim, matTowelIvory, matDirtyTerracotta, matDirtyCharcoal];
      for (let i = 0; i < 4; i++) {
        const blob = shadow(
          new THREE.Mesh(
            trackGeo(new THREE.SphereGeometry(Math.min(bw, bd) * 0.32, 12, 10)),
            dirtyMats[i % dirtyMats.length],
          ),
        );
        blob.scale.set(1.15, 0.62, 1.05);
        blob.position.set(
          ((i % 2) - 0.5) * bw * 0.28,
          bh * 0.58 + (i >= 2 ? 0.045 : 0),
          (i < 2 ? -0.14 : 0.14) * bd,
        );
        g.add(blob);
      }
    }

    return g;
  };

  /** Folded clean towel stack placed directly on open oak linen shelves */
  const addFoldedTowelStack = (
    parent: THREE.Object3D,
    x: number,
    shelfTopY: number,
    z: number,
    tw = 0.28,
    td = 0.34,
    count = 4,
  ) => {
    const mats = [matTowelIvory, matTowelOat, matTowelIvory, matTowelSage];
    const layerH = 0.044;
    for (let i = 0; i < count; i++) {
      const towel = shadow(
        new THREE.Mesh(
          trackGeo(createRoundedPlateGeo(tw, layerH, td, 0.013)),
          mats[i % mats.length],
        ),
      );
      towel.position.set(
        x + ((i % 2) - 0.5) * 0.005,
        shelfTopY + layerH / 2 + i * (layerH + 0.002),
        z,
      );
      parent.add(towel);
    }
  };

  /** Extended pull-out basket loading tray on stainless telescopic rails (Pinterest hero detail!) */
  const addPullOutLoadingTray = (
    parent: THREE.Object3D,
    trayW: number,
    y: number,
    zFrontCabinet: number,
    extendDist = 0.28,
    withBasket = true,
  ) => {
    const trayD = 0.48;
    const trayH = 0.032;
    const trayCenterZ = zFrontCabinet - trayD / 2 + extendDist;

    // Sliding laminate/oak tray deck
    addBox(parent, trayW - 0.02, trayH, trayD, 0, y, trayCenterZ, matCabinet);
    // Front lip fascia + matte handle
    addCabinetDoor(parent, trayW, 0.072, 0, y + 0.01, trayCenterZ + trayD / 2 + 0.012, {
      handleSide: 'center',
      handleOrientation: 'horizontal',
      handleLength: Math.min(0.14, trayW * 0.28),
    });

    // Twin metallic telescopic ball-bearing drawer slides on left & right
    for (const sx of [-1, 1]) {
      addBox(
        parent,
        0.014,
        0.036,
        trayD * 0.9,
        sx * (trayW / 2 - 0.01),
        y - 0.002,
        trayCenterZ - 0.02,
        matSteelRail,
      );
    }

    if (withBasket) {
      const bW = Math.min(0.46, trayW - 0.12);
      const basket = createWovenBasket(bW, 0.22, 0.34, 'cream-clean');
      basket.position.set(0, y + trayH / 2, trayCenterZ + 0.02);
      parent.add(basket);
    }
  };

  /** Aesthetic amber glass & matte white detergent/softener bottles on shelves or counters */
  const addDetergentBottles = (
    parent: THREE.Object3D,
    x: number,
    y: number,
    z: number,
  ) => {
    const specs = [
      { dx: -0.055, r: 0.038, h: 0.21, mat: matAmberGlass },
      { dx: 0.032, r: 0.034, h: 0.18, mat: matCeramicSink },
      { dx: 0.105, r: 0.028, h: 0.15, mat: matAmberGlass },
    ];
    for (const sp of specs) {
      const bottle = shadow(
        new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(sp.r * 0.92, sp.r, sp.h, 16)),
          sp.mat,
        ),
      );
      bottle.position.set(x + sp.dx, y + sp.h / 2, z);
      parent.add(bottle);

      const cap = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.014, 0.016, 0.036, 12)),
        matHardware,
      );
      cap.position.set(x + sp.dx, y + sp.h + 0.018, z);
      parent.add(cap);
    }
  };

  /** Ceramic apron-front Belfast utility sink + marble counter + curved gooseneck faucet */
  const addUtilitySinkBay = (
    parent: THREE.Object3D,
    bayX: number,
    bayW: number,
    counterY: number,
    bayD: number,
    shaker: boolean,
  ) => {
    const plinthH = 0.1;
    const baseBodyH = counterY - 0.035 - plinthH;
    const sinkW = Math.min(0.56, bayW * 0.62);
    const sinkH = 0.23;
    const sinkD = bayD - 0.1;

    // Plinth & base cabinet carcass
    addBox(parent, bayW, plinthH, bayD - 0.05, bayX, plinthH / 2, -0.025, matCabinetRecess);
    addBox(parent, bayW, baseBodyH, bayD - 0.02, bayX, plinthH + baseBodyH / 2, -0.01, matCabinet);

    // Lower double cabinet doors beneath the apron-front sink
    const lowerDoorH = Math.max(0.36, baseBodyH - sinkH - 0.01);
    const lowerDoorY = plinthH + lowerDoorH / 2;
    addCabinetDoor(parent, bayW / 2 - 0.004, lowerDoorH, bayX - bayW / 4, lowerDoorY, frontZ, {
      shaker,
      handleSide: 'right',
      handleOrientation: 'vertical',
      handleLength: 0.13,
    });
    addCabinetDoor(parent, bayW / 2 - 0.004, lowerDoorH, bayX + bayW / 4, lowerDoorY, frontZ, {
      shaker,
      handleSide: 'left',
      handleOrientation: 'vertical',
      handleLength: 0.13,
    });

    // Marble countertop left & right wings + rear strip + backsplash
    const sideWingW = (bayW - sinkW) / 2;
    if (sideWingW > 0.03) {
      addBox(parent, sideWingW, 0.035, bayD + 0.015, bayX - bayW / 2 + sideWingW / 2, counterY - 0.0175, 0.005, matMarble);
      addBox(parent, sideWingW, 0.035, bayD + 0.015, bayX + bayW / 2 - sideWingW / 2, counterY - 0.0175, 0.005, matMarble);
    }
    addBox(parent, sinkW + 0.02, 0.035, 0.12, bayX, counterY - 0.0175, -bayD / 2 + 0.06, matMarble);
    // Marble backsplash (14 cm high)
    addBox(parent, bayW, 0.14, 0.022, bayX, counterY + 0.07, -bayD / 2 + 0.014, matMarble);

    // Deep glazed ceramic Belfast apron-front sink (4 walls + recessed floor, genuinely hollow!)
    const sinkTopY = counterY - 0.004;
    const sinkBottomY = sinkTopY - sinkH;
    const sWall = 0.03;
    const sinkCenterZ = 0.055;
    // Floor of basin
    addBox(parent, sinkW, sWall, sinkD, bayX, sinkBottomY + sWall / 2, sinkCenterZ, matCeramicSink);
    // Apron front (flush & proud +1.5 cm like real farmhouse sink!)
    const apron = shadow(
      new THREE.Mesh(
        trackGeo(createRoundedPlateGeo(sinkW, sinkH, 0.038, 0.008)),
        matCeramicSink,
      ),
    );
    apron.position.set(bayX, sinkBottomY + sinkH / 2, frontZ + 0.006);
    parent.add(apron);
    // Left, right & back basin walls
    addBox(parent, sWall, sinkH, sinkD, bayX - sinkW / 2 + sWall / 2, sinkBottomY + sinkH / 2, sinkCenterZ, matCeramicSink);
    addBox(parent, sWall, sinkH, sinkD, bayX + sinkW / 2 - sWall / 2, sinkBottomY + sinkH / 2, sinkCenterZ, matCeramicSink);
    addBox(parent, sinkW, sinkH, sWall, bayX, sinkBottomY + sinkH / 2, sinkCenterZ - sinkD / 2 + sWall / 2, matCeramicSink);

    // Chrome drain strainer
    const drain = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.036, 0.036, 0.006, 20)),
      matChrome,
    );
    drain.position.set(bayX, sinkBottomY + sWall + 0.003, sinkCenterZ);
    parent.add(drain);

    // Gooseneck curved pull-out faucet (TubeGeometry!)
    const faucetBaseZ = -bayD / 2 + 0.085;
    const faucetBase = shadow(
      new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.024, 0.028, 0.09, 18)), matHardware),
    );
    faucetBase.position.set(bayX, counterY + 0.045, faucetBaseZ);
    parent.add(faucetBase);

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(bayX, counterY + 0.08, faucetBaseZ),
      new THREE.Vector3(bayX, counterY + 0.29, faucetBaseZ),
      new THREE.Vector3(bayX, counterY + 0.36, faucetBaseZ + 0.09),
      new THREE.Vector3(bayX, counterY + 0.31, faucetBaseZ + 0.19),
      new THREE.Vector3(bayX, counterY + 0.24, faucetBaseZ + 0.205),
    ]);
    const spout = shadow(
      new THREE.Mesh(trackGeo(new THREE.TubeGeometry(curve, 22, 0.012, 12, false)), matHardware),
    );
    parent.add(spout);

    // Side mixer lever
    const lever = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.006, 0.006, 0.085, 10)),
      matHardware,
    );
    lever.rotation.z = -Math.PI / 2.4;
    lever.position.set(bayX + 0.052, counterY + 0.085, faucetBaseZ);
    parent.add(lever);

    // Detergent bottles on counter wing
    if (sideWingW > 0.12) {
      addDetergentBottles(parent, bayX + bayW / 2 - sideWingW * 0.55, counterY, -bayD / 2 + 0.16);
    }
  };

  /** Open Hanging Clothes Rod Niche with hangers, sculpted linen shirts & recessed warm LED bar */
  const addHangingRodNiche = (
    parent: THREE.Object3D,
    nx: number,
    bottomY: number,
    nicheW: number,
    nicheH: number,
    nicheD: number,
    nicheZ = 0,
  ) => {
    // Oak back panel + top/side liners cleanly recessed to nicheZ
    const liner = 0.02;
    addBox(parent, nicheW, nicheH, liner, nx, bottomY + nicheH / 2, nicheZ - nicheD / 2 + liner / 2, matOakInterior);
    addBox(parent, liner, nicheH, nicheD, nx - nicheW / 2 + liner / 2, bottomY + nicheH / 2, nicheZ, matOakInterior);
    addBox(parent, liner, nicheH, nicheD, nx + nicheW / 2 - liner / 2, bottomY + nicheH / 2, nicheZ, matOakInterior);
    addBox(parent, nicheW, liner, nicheD, nx, bottomY + nicheH - liner / 2, nicheZ, matOakInterior);

    // Recessed warm LED strip at top of niche
    addBox(parent, nicheW - 0.08, 0.012, 0.018, nx, bottomY + nicheH - 0.022, nicheZ - nicheD / 2 + 0.06, matLedWarm);

    // Horizontal brushed brass / black hanging rod recessed nicely inside the niche
    const rodY = bottomY + nicheH - 0.095;
    const rodZ = nicheZ + 0.01;
    const rodGeo = trackGeo(new THREE.CylinderGeometry(0.011, 0.011, nicheW - 0.04, 16));
    rodGeo.rotateZ(Math.PI / 2);
    const rod = shadow(new THREE.Mesh(rodGeo, matHardware));
    rod.position.set(nx, rodY, rodZ);
    parent.add(rod);

    // Sculpted minimalist linen shirts on hangers (strictly recessed inside nicheD & clear above counter!)
    const shirtCount = Math.max(3, Math.min(4, Math.floor(nicheW / 0.19)));
    const shirtMats = [matTowelIvory, matTowelOat, matDirtyDenim, matTowelSage];
    const garmentD = Math.min(0.28, nicheD - 0.12);
    const shirtH = Math.max(0.24, Math.min(0.38, nicheH - 0.36));
    const usableW = Math.max(0.22, nicheW - 0.22);
    for (let i = 0; i < shirtCount; i++) {
      const sx = nx - usableW / 2 + (i / Math.max(1, shirtCount - 1)) * usableW;
      // Curved wire hook + wooden shoulder bar
      addBox(parent, 0.006, 0.042, 0.006, sx, rodY - 0.022, rodZ, matHardware);
      addBox(parent, 0.014, 0.012, garmentD + 0.03, sx, rodY - 0.048, rodZ, matOakInterior);
      // Soft collar accent
      addBox(parent, 0.03, 0.026, 0.11, sx, rodY - 0.062, rodZ, shirtMats[i % shirtMats.length]);
      // Draped linen shirt body (slim rounded garment profile)
      const shirt = shadow(
        new THREE.Mesh(
          trackGeo(createRoundedPlateGeo(0.034, shirtH, garmentD, 0.014)),
          shirtMats[i % shirtMats.length],
        ),
      );
      shirt.position.set(sx, rodY - 0.068 - shirtH / 2, rodZ);
      parent.add(shirt);
    }
  };

  /** Tall Utility Closet Bay with mounted folded ironing board, stick vacuum, broom & detergent shelves */
  const addUtilityClosetBay = (
    parent: THREE.Object3D,
    bx: number,
    bayW: number,
    plinthH: number,
    totalH: number,
    bayD: number,
  ) => {
    const panelT = 0.022;
    const innerH = totalH - plinthH - panelT;

    // Carcass back + dividers
    addBox(parent, bayW, innerH, panelT, bx, plinthH + innerH / 2, -bayD / 2 + panelT / 2, matOakInterior);
    addBox(parent, bayW, panelT, bayD, bx, plinthH + panelT / 2, 0, matOakInterior);

    // Upper detergent shelf at y = 1.62 m + top shelf at y = 1.98 m
    const shelf1Y = Math.min(totalH - 0.72, 1.62);
    const shelf2Y = Math.min(totalH - 0.36, 1.98);
    addBox(parent, bayW - 0.02, 0.02, bayD - 0.04, bx, shelf1Y, 0, matOakInterior);
    addBox(parent, bayW - 0.02, 0.02, bayD - 0.04, bx, shelf2Y, 0, matOakInterior);

    addDetergentBottles(parent, bx - 0.02, shelf1Y + 0.01, 0.02);
    const topBasket = createWovenBasket(Math.min(0.36, bayW - 0.07), 0.22, bayD - 0.14, 'rattan-clean');
    topBasket.position.set(bx, shelf2Y + 0.01, 0.01);
    parent.add(topBasket);

    // 1. Mounted Folded Ironing Board leaning against inner-left wall
    const boardH = Math.min(1.18, shelf1Y - plinthH - 0.14);
    const board = shadow(
      new THREE.Mesh(
        trackGeo(createRoundedPlateGeo(0.036, boardH, 0.34, 0.014)),
        matTowelOat,
      ),
    );
    board.position.set(bx - bayW / 2 + 0.055, plinthH + 0.06 + boardH / 2, 0.02);
    parent.add(board);
    // Folded metallic X-legs on ironing board back
    addBox(parent, 0.016, boardH * 0.72, 0.022, bx - bayW / 2 + 0.082, plinthH + 0.06 + boardH * 0.45, -0.04, matHardware);
    addBox(parent, 0.016, boardH * 0.72, 0.022, bx - bayW / 2 + 0.082, plinthH + 0.06 + boardH * 0.45, 0.07, matHardware);

    // 2. Upright Cordless Stick Vacuum in center-right of bay
    const vacX = bx + bayW * 0.14;
    const vacZ = -0.02;
    // Floor motorized brush head
    addBox(parent, 0.22, 0.055, 0.12, vacX, plinthH + 0.045, vacZ + 0.05, matDoorRing);
    // Metallic wand
    const wand = shadow(
      new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.015, 0.015, 0.96, 14)), matSteelRail),
    );
    wand.position.set(vacX, plinthH + 0.54, vacZ);
    parent.add(wand);
    // Cyclone motor & dustbin canister
    const canister = shadow(
      new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.055, 0.05, 0.24, 18)), matDoorRing),
    );
    canister.position.set(vacX, plinthH + 1.08, vacZ + 0.02);
    parent.add(canister);
    // Accent ring on cyclone
    const accentRing = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.058, 0.058, 0.04, 18)),
      matHardware,
    );
    accentRing.position.set(vacX, plinthH + 1.12, vacZ + 0.02);
    parent.add(accentRing);

    // 3. Wooden-handle broom tucked right side
    const broomX = bx + bayW * 0.36;
    const broomStick = shadow(
      new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.012, 0.012, 1.24, 12)), matOakInterior),
    );
    broomStick.position.set(broomX, plinthH + 0.72, -0.14);
    parent.add(broomStick);
    addBox(parent, 0.055, 0.11, 0.22, broomX, plinthH + 0.08, -0.14, matTowelOat);
  };

  // =========================================================================
  // 8 ARCHITECTURAL PINTEREST LAUNDRY ROOM CABINET ARCHETYPES
  // =========================================================================

  const plinthH = 0.1;
  const wallT = 0.022;

  if (asset.archetype === 'laundry_side_by_side_elevated') {
    // 1. YÜKSELTİLMİŞ YAN YANA ÇAMAŞIR & KURUTMA DOLABI (138x68x235 cm)
    // Faithful to image_86169570.png & image_e6ae1644.png!
    const pedTopY = 0.62; // Ergonomic pedestal top
    const machineH = 0.855;
    const upperBottomY = pedTopY + 0.095 + machineH; // +9.5 cm for pull-out loading tray bay!
    const upperH = h - upperBottomY;
    const colW = (w - wallT * 3) / 2;

    // Recessed toe-kick plinth
    addBox(group, w - 0.01, plinthH, d - 0.05, 0, plinthH / 2, -0.025, matCabinetRecess);
    // Outer left, center, right vertical gables + back panel + top roof
    addBox(group, wallT, h - plinthH, d, -w / 2 + wallT / 2, plinthH + (h - plinthH) / 2, 0, matCabinet);
    addBox(group, wallT, h - plinthH, d, w / 2 - wallT / 2, plinthH + (h - plinthH) / 2, 0, matCabinet);
    addBox(group, wallT, h - plinthH, d - 0.015, 0, plinthH + (h - plinthH) / 2, -0.007, matCabinet);
    addBox(group, w - wallT * 2, h - plinthH, 0.018, 0, plinthH + (h - plinthH) / 2, -d / 2 + 0.009, matCabinetRecess);
    addBox(group, w, wallT, d, 0, h - wallT / 2, 0, matCabinet);

    // Lower Pedestal: 4 Clean/Dirty Deep Sorting Drawers (2 tiers x 2 columns)
    const drawerZoneH = pedTopY - plinthH;
    const eachDrawerH = drawerZoneH / 2;
    for (const [ci, cx] of [
      [0, -w / 4],
      [1, w / 4],
    ] as const) {
      // Lower drawer (left one slightly opened 18 cm revealing folded clean linen!)
      if (ci === 0) {
        const pull = 0.18;
        addBox(group, colW - 0.04, eachDrawerH - 0.04, d - 0.12, cx, plinthH + eachDrawerH / 2, pull - 0.02, matOakInterior);
        addFoldedTowelStack(group, cx - 0.12, plinthH + 0.04, pull + 0.04, 0.24, 0.26, 3);
        addFoldedTowelStack(group, cx + 0.14, plinthH + 0.04, pull + 0.04, 0.24, 0.26, 3);
        addCabinetDoor(group, colW + 0.01, eachDrawerH, cx, plinthH + eachDrawerH / 2, frontZ + pull, {
          handleSide: 'top-center',
          handleOrientation: 'horizontal',
          handleLength: 0.16,
        });
      } else {
        addCabinetDoor(group, colW + 0.01, eachDrawerH, cx, plinthH + eachDrawerH / 2, frontZ, {
          handleSide: 'top-center',
          handleOrientation: 'horizontal',
          handleLength: 0.16,
        });
      }
      // Upper pedestal drawer
      addCabinetDoor(group, colW + 0.01, eachDrawerH, cx, plinthH + eachDrawerH * 1.5, frontZ, {
        handleSide: 'top-center',
        handleOrientation: 'horizontal',
        handleLength: 0.16,
      });
    }

    // Pull-Out Basket Loading Tray Zone (pedTopY .. pedTopY + 0.095)
    addBox(group, w - wallT * 2, 0.024, d - 0.02, 0, pedTopY + 0.012, -0.01, matCabinet);
    addBox(group, w - wallT * 2, 0.024, d - 0.02, 0, pedTopY + 0.095, -0.01, matCabinet);

    // Left tray closed flush, Right tray PULLED OUT 30 cm with woven white laundry basket + folded linens!
    addCabinetDoor(group, colW + 0.01, 0.072, -w / 4, pedTopY + 0.055, frontZ, {
      handleSide: 'center',
      handleOrientation: 'horizontal',
      handleLength: 0.14,
    });
    const rightTrayGroup = new THREE.Group();
    rightTrayGroup.position.set(w / 4, 0, 0);
    addPullOutLoadingTray(rightTrayGroup, colW, pedTopY + 0.042, frontZ, 0.3, true);
    group.add(rightTrayGroup);

    // Side-by-side Washer (left) & Heat-Pump Dryer (right) at ergonomic height
    const machineBaseY = pedTopY + 0.107;
    const washer = createFrontLoadAppliance('washer', Math.min(0.6, colW - 0.02), 0.845, d - 0.06);
    washer.position.set(-w / 4, machineBaseY, 0.015);
    group.add(washer);

    const dryer = createFrontLoadAppliance('dryer', Math.min(0.6, colW - 0.02), 0.845, d - 0.06);
    dryer.position.set(w / 4, machineBaseY, 0.015);
    group.add(dryer);

    // Upper Storage Cabinets above machines
    addBox(group, w - wallT * 2, wallT, d - 0.02, 0, upperBottomY + wallT / 2, -0.01, matCabinet);
    addCabinetDoor(group, colW + 0.01, upperH - wallT, -w / 4, upperBottomY + upperH / 2, frontZ, {
      handleSide: 'right',
      handleOrientation: 'vertical',
      handleLength: 0.17,
    });
    addCabinetDoor(group, colW + 0.01, upperH - wallT, w / 4, upperBottomY + upperH / 2, frontZ, {
      handleSide: 'left',
      handleOrientation: 'vertical',
      handleLength: 0.17,
    });
  } else if (asset.archetype === 'laundry_stacked_tower_hamper') {
    // 2. ÜST ÜSTE ÇAMAŞIR & KURUTMA KULESİ + YAN ÇİFT DEVRİLİR KİRLİ SEPETİ & TEMİZ HAVLU RAFLI (124x66x240 cm)
    // Faithful to image_86169570.png (top-right) & image_e6ae1644.png!
    const leftBayW = 0.66;
    const rightBayW = w - leftBayW - wallT * 3;
    const leftX = -w / 2 + wallT + leftBayW / 2;
    const rightX = w / 2 - wallT - rightBayW / 2;
    const dividerX = -w / 2 + wallT + leftBayW + wallT / 2;

    // Plinth & outer carcass
    addBox(group, w - 0.01, plinthH, d - 0.05, 0, plinthH / 2, -0.025, matCabinetRecess);
    addBox(group, wallT, h - plinthH, d, -w / 2 + wallT / 2, plinthH + (h - plinthH) / 2, 0, matCabinet);
    addBox(group, wallT, h - plinthH, d, w / 2 - wallT / 2, plinthH + (h - plinthH) / 2, 0, matCabinet);
    addBox(group, wallT, h - plinthH, d - 0.01, dividerX, plinthH + (h - plinthH) / 2, -0.005, matCabinet);
    addBox(group, w - wallT * 2, h - plinthH, 0.018, 0, plinthH + (h - plinthH) / 2, -d / 2 + 0.009, matOakInterior);
    addBox(group, w, wallT, d, 0, h - wallT / 2, 0, matCabinet);

    // LEFT COLUMN: Stacked Washer + Middle Pull-Out Basket Tray + Stacked Dryer + Overhead Cupboard
    addBox(group, leftBayW, wallT, d - 0.02, leftX, plinthH + wallT / 2, -0.01, matCabinet);
    const wY = plinthH + wallT;
    const washer = createFrontLoadAppliance('washer', 0.6, 0.845, d - 0.06);
    washer.position.set(leftX, wY, 0.015);
    group.add(washer);

    // Pull-out basket tray right between washer and dryer!
    const midTrayY = wY + 0.855 + 0.04;
    addBox(group, leftBayW, 0.022, d - 0.02, leftX, wY + 0.855, -0.01, matCabinet);
    const midTrayHost = new THREE.Group();
    midTrayHost.position.set(leftX, 0, 0);
    addPullOutLoadingTray(midTrayHost, leftBayW - 0.01, midTrayY, frontZ, 0.24, true);
    group.add(midTrayHost);

    const dryerShelfY = midTrayY + 0.055;
    addBox(group, leftBayW, 0.024, d - 0.02, leftX, dryerShelfY, -0.01, matCabinet);
    const dryer = createFrontLoadAppliance('dryer', 0.6, 0.845, d - 0.06);
    dryer.position.set(leftX, dryerShelfY + 0.012, 0.015);
    group.add(dryer);

    const topCabY = dryerShelfY + 0.865;
    const topCabH = h - topCabY - wallT;
    addBox(group, leftBayW, wallT, d - 0.02, leftX, topCabY, -0.01, matCabinet);
    addCabinetDoor(group, leftBayW + 0.01, topCabH, leftX, topCabY + topCabH / 2 + wallT / 2, frontZ, {
      handleSide: 'top-center',
      handleOrientation: 'horizontal',
      handleLength: 0.16,
    });

    // RIGHT COLUMN: Dual Tilt-Out Dirty Laundry Wire Hampers (bottom + mid) + Open Oak Clean Towel Shelves (top)!
    const hamperH = 0.56;
    // Bottom tilt-out hamper (slightly closed / ajar 8°)
    addCabinetDoor(group, rightBayW + 0.008, hamperH, rightX, plinthH + hamperH / 2, frontZ, {
      handleSide: 'top-center',
      handleOrientation: 'horizontal',
      handleLength: 0.14,
      tiltOutDeg: 7,
    });
    const dirtyBin1 = createWovenBasket(rightBayW - 0.08, 0.42, d - 0.22, 'wire-dirty');
    dirtyBin1.position.set(rightX, plinthH + 0.04, 0.02);
    group.add(dirtyBin1);

    // Mid tilt-out dirty hamper (OPEN 22° revealing wire hamper + dirty laundry!)
    const midHamperBaseY = plinthH + hamperH + 0.018;
    addBox(group, rightBayW, 0.018, d - 0.04, rightX, midHamperBaseY - 0.009, -0.02, matOakInterior);
    addCabinetDoor(group, rightBayW + 0.008, hamperH, rightX, midHamperBaseY + hamperH / 2, frontZ, {
      handleSide: 'top-center',
      handleOrientation: 'horizontal',
      handleLength: 0.14,
      tiltOutDeg: 22,
    });
    const dirtyBin2 = createWovenBasket(rightBayW - 0.08, 0.38, d - 0.24, 'rattan-dirty');
    dirtyBin2.position.set(rightX, midHamperBaseY + 0.05, 0.08);
    dirtyBin2.rotation.x = THREE.MathUtils.degToRad(14);
    group.add(dirtyBin2);

    // Upper Open Clean-Laundry Oak Niche with 3 shelves, folded clean towels & woven basket + LED!
    const cleanZoneBaseY = midHamperBaseY + hamperH + 0.02;
    const cleanZoneH = h - cleanZoneBaseY - wallT;
    const shelfCount = 3;
    const shelfStep = cleanZoneH / shelfCount;
    for (let s = 0; s < shelfCount; s++) {
      const sy = cleanZoneBaseY + s * shelfStep;
      addBox(group, rightBayW, 0.022, d - 0.04, rightX, sy, -0.015, matOakInterior);
      if (s === 0) {
        addFoldedTowelStack(group, rightX, sy + 0.011, 0.02, Math.min(0.36, rightBayW - 0.09), 0.34, 4);
      } else if (s === 1) {
        addDetergentBottles(group, rightX - 0.02, sy + 0.011, 0.04);
      } else {
        const cleanBasket = createWovenBasket(rightBayW - 0.08, 0.2, d - 0.18, 'rattan-clean');
        cleanBasket.position.set(rightX, sy + 0.011, 0.02);
        group.add(cleanBasket);
      }
    }
    addBox(group, rightBayW - 0.06, 0.01, 0.016, rightX, h - wallT - 0.015, -d / 2 + 0.1, matLedWarm);
  } else if (asset.archetype === 'laundry_side_by_side_counter') {
    // 3. TEZGAH ALTI YAN YANA ÇAMAŞIR ODASI ÜNİTESİ (188x68x236 cm)
    // Faithful to image_f52e77fc.png (Hale Navy & Warm Cashmere Shaker folding counter + hanging rod niche!)
    const counterY = 0.91;
    const leftSectionW = 1.24; // Washer + Dryer side-by-side under continuous marble folding counter
    const rightSectionW = w - leftSectionW - wallT * 3;
    const leftStart = -w / 2 + wallT;
    const rightX = w / 2 - wallT - rightSectionW / 2;

    const upperCabBottomY = 1.66;
    const upperCabH = h - upperCabBottomY;
    const upperD = 0.42;
    const upperZ = -d / 2 + upperD / 2;

    // Lower base plinth & stepped gables (full depth below counter, architectural upperD above counter!)
    addBox(group, w - 0.01, plinthH, d - 0.05, 0, plinthH / 2, -0.025, matCabinetRecess);
    addBox(group, wallT, counterY - plinthH, d, -w / 2 + wallT / 2, plinthH + (counterY - plinthH) / 2, 0, matCabinet);
    addBox(group, wallT, counterY - plinthH, d, w / 2 - wallT / 2, plinthH + (counterY - plinthH) / 2, 0, matCabinet);
    addBox(group, wallT, h - counterY, upperD + 0.015, -w / 2 + wallT / 2, counterY + (h - counterY) / 2, upperZ + 0.0075, matCabinet);
    addBox(group, wallT, h - counterY, upperD + 0.015, w / 2 - wallT / 2, counterY + (h - counterY) / 2, upperZ + 0.0075, matCabinet);
    addBox(group, wallT, counterY - plinthH, d - 0.02, leftStart + leftSectionW + wallT / 2, plinthH + (counterY - plinthH) / 2, -0.01, matCabinet);
    addBox(group, w - wallT * 2, h - plinthH, 0.018, 0, plinthH + (h - plinthH) / 2, -d / 2 + 0.009, matCabinetRecess);

    // Side-by-side Washer & Dryer under counter
    const washer = createFrontLoadAppliance('washer', 0.595, 0.845, d - 0.06);
    washer.position.set(leftStart + 0.305, 0.005, 0.015);
    group.add(washer);

    const dryer = createFrontLoadAppliance('dryer', 0.595, 0.845, d - 0.06);
    dryer.position.set(leftStart + 0.93, 0.005, 0.015);
    group.add(dryer);

    // Right lower base cabinet (2 deep dirty/clean shaker drawers)
    const lowerRightH = counterY - 0.035 - plinthH;
    addBox(group, rightSectionW, lowerRightH, d - 0.02, rightX, plinthH + lowerRightH / 2, -0.01, matCabinet);
    addCabinetDoor(group, rightSectionW + 0.006, lowerRightH / 2, rightX, plinthH + lowerRightH * 0.25, frontZ, {
      shaker: true,
      handleSide: 'center',
      handleOrientation: 'horizontal',
      handleLength: 0.15,
    });
    addCabinetDoor(group, rightSectionW + 0.006, lowerRightH / 2, rightX, plinthH + lowerRightH * 0.75, frontZ, {
      shaker: true,
      handleSide: 'center',
      handleOrientation: 'horizontal',
      handleLength: 0.15,
    });

    // Continuous Veined Marble Folding Countertop + Backsplash
    addBox(group, w - wallT * 2 + 0.01, 0.036, d + 0.016, 0, counterY - 0.018, 0.006, matMarble);
    addBox(group, w - wallT * 2, 0.52, 0.018, 0, counterY + 0.26, -d / 2 + 0.025, matMarble);

    // Folded clean linen pile & woven basket on folding countertop
    addFoldedTowelStack(group, leftStart + 0.34, counterY, 0.02, 0.34, 0.32, 3);
    addDetergentBottles(group, leftStart + 0.88, counterY, -0.14);

    // Middle Zone (counterY .. 1.66 m): Right side = Oak Hanging Clothes Drying Rod Niche (aligned flush to back wall!)
    addHangingRodNiche(
      group,
      rightX,
      counterY + 0.005,
      rightSectionW,
      upperCabBottomY - counterY - 0.01,
      upperD,
      upperZ,
    );

    // Open Rattan Basket Shelf above left counter (between 1.38 m and 1.66 m)
    const openShelfY = 1.38;
    addBox(group, leftSectionW, 0.024, upperD, leftStart + leftSectionW / 2, openShelfY, upperZ, matOakInterior);
    addBox(group, leftSectionW - 0.1, 0.01, 0.016, leftStart + leftSectionW / 2, openShelfY - 0.016, upperZ - 0.08, matLedWarm);
    for (let b = 0; b < 3; b++) {
      const bx = leftStart + 0.21 + b * 0.41;
      const basket = createWovenBasket(0.35, 0.22, upperD - 0.06, 'rattan-clean');
      basket.position.set(bx, openShelfY + 0.012, upperZ + 0.01);
      group.add(basket);
    }

    // Upper Shaker Wall Cabinets (3 wide doors across full width)
    addBox(group, w - wallT * 2, upperCabH, upperD, 0, upperCabBottomY + upperCabH / 2, upperZ, matCabinet);
    addBox(group, w, 0.05, upperD + 0.02, 0, h - 0.025, upperZ + 0.01, matCabinet); // Crown molding
    const doorCount = 3;
    const eachW = (w - wallT * 2) / doorCount;
    for (let i = 0; i < doorCount; i++) {
      const dx = -w / 2 + wallT + eachW * (i + 0.5);
      addCabinetDoor(group, eachW, upperCabH - 0.05, dx, upperCabBottomY + (upperCabH - 0.05) / 2, upperZ + upperD / 2 + 0.008, {
        shaker: true,
        handleSide: i === 1 ? 'left' : 'right',
        handleOrientation: 'vertical',
        handleLength: 0.14,
      });
    }
  } else if (asset.archetype === 'laundry_stacked_sink_combo') {
    // 4. EVİYELİ & ÜST ÜSTE ÇAMAŞIR ODASI DOLABI (176x66x238 cm)
    // Faithful to image_00241e96.png!
    const towerW = 0.68;
    const sinkBayW = w - towerW - wallT * 3;
    const sinkBayX = -w / 2 + wallT + sinkBayW / 2;
    const towerX = w / 2 - wallT - towerW / 2;
    const dividerX = w / 2 - wallT - towerW - wallT / 2;
    const counterY = 0.9;

    const upY = 1.54;
    const upH = h - upY;
    const upD = 0.4;
    const upZ = -d / 2 + upD / 2;

    // Outer gables & back (left gable steps back cleanly above sink counter to flush upperD!)
    addBox(group, wallT, counterY, d, -w / 2 + wallT / 2, counterY / 2, 0, matCabinet);
    addBox(group, wallT, h - counterY, upD + 0.015, -w / 2 + wallT / 2, counterY + (h - counterY) / 2, upZ + 0.0075, matCabinet);
    addBox(group, wallT, h, d, w / 2 - wallT / 2, h / 2, 0, matCabinet);
    addBox(group, wallT, h, d, dividerX, h / 2, 0, matCabinet);
    addBox(group, w - wallT * 2, h, 0.018, 0, h / 2, -d / 2 + 0.009, matCabinetRecess);

    // LEFT BAY: Deep Ceramic Apron-Front Belfast Laundry Sink + Marble Counter + Shaker Base & Upper Cabinets
    addUtilitySinkBay(group, sinkBayX, sinkBayW, counterY, d, true);

    // Warm oak framed accent panel behind sink backsplash for crisp architectural contrast
    addBox(group, sinkBayW - 0.01, upY - counterY - 0.14, 0.012, sinkBayX, counterY + 0.14 + (upY - counterY - 0.14) / 2, -d / 2 + 0.022, matOakInterior);

    // Upper Shaker Wall Cabinets over the sink (y = 1.54 .. h)
    addBox(group, sinkBayW, upH, upD, sinkBayX, upY + upH / 2, upZ, matCabinet);
    addBox(group, sinkBayW - 0.1, 0.01, 0.016, sinkBayX, upY - 0.008, upZ - 0.05, matLedWarm);
    addCabinetDoor(group, sinkBayW / 2 - 0.004, upH - 0.05, sinkBayX - sinkBayW / 4, upY + (upH - 0.05) / 2, upZ + upD / 2 + 0.008, {
      shaker: true,
      handleSide: 'right',
      handleOrientation: 'vertical',
      handleLength: 0.14,
    });
    addCabinetDoor(group, sinkBayW / 2 - 0.004, upH - 0.05, sinkBayX + sinkBayW / 4, upY + (upH - 0.05) / 2, upZ + upD / 2 + 0.008, {
      shaker: true,
      handleSide: 'left',
      handleOrientation: 'vertical',
      handleLength: 0.14,
    });
    // Stepped architectural crown molding across top
    addBox(group, sinkBayW + wallT * 2, 0.05, upD + 0.02, sinkBayX, h - 0.025, upZ + 0.01, matCabinet);
    addBox(group, towerW + wallT * 2, 0.05, d + 0.015, towerX, h - 0.025, 0.005, matCabinet);

    // RIGHT TOWER: Stacked Washer + Pull-Out Tray + Dryer + Top Shaker Cupboard
    addBox(group, towerW, 0.03, d - 0.02, towerX, 0.015, -0.01, matCabinetRecess);
    const washer = createFrontLoadAppliance('washer', 0.6, 0.845, d - 0.06);
    washer.position.set(towerX, 0.03, 0.015);
    group.add(washer);

    const midShelfY = 0.895;
    addBox(group, towerW, 0.026, d - 0.02, towerX, midShelfY, -0.01, matCabinet);
    const dryer = createFrontLoadAppliance('dryer', 0.6, 0.845, d - 0.06);
    dryer.position.set(towerX, midShelfY + 0.013, 0.015);
    group.add(dryer);

    const topDoorBottomY = midShelfY + 0.87;
    const topDoorH = h - topDoorBottomY - 0.05;
    addBox(group, towerW, wallT, d - 0.02, towerX, topDoorBottomY, -0.01, matCabinet);
    addCabinetDoor(group, towerW + 0.008, topDoorH, towerX, topDoorBottomY + topDoorH / 2 + 0.008, frontZ, {
      shaker: true,
      handleSide: 'top-center',
      handleOrientation: 'horizontal',
      handleLength: 0.15,
    });
  } else if (asset.archetype === 'laundry_utility_broom_closet') {
    // 5. ÜTÜ MASALI, SÜPÜRGELİKLİ & ÜST ÜSTE ÇAMAŞIR BOY DOLABI (126x65x242 cm)
    // Faithful to image_00241e96.png (120 cm utility + stacked diagram) & image_e6ae1644.png!
    const utilW = 0.5;
    const machW = w - utilW - wallT * 3;
    const utilX = -w / 2 + wallT + utilW / 2;
    const machX = w / 2 - wallT - machW / 2;
    const divX = -w / 2 + wallT + utilW + wallT / 2;

    // Outer frame & toe-kick plinth
    addBox(group, w - 0.01, plinthH, d - 0.05, 0, plinthH / 2, -0.025, matCabinetRecess);
    addBox(group, wallT, h - plinthH, d, -w / 2 + wallT / 2, plinthH + (h - plinthH) / 2, 0, matCabinet);
    addBox(group, wallT, h - plinthH, d, w / 2 - wallT / 2, plinthH + (h - plinthH) / 2, 0, matCabinet);
    addBox(group, wallT, h - plinthH, d - 0.01, divX, plinthH + (h - plinthH) / 2, -0.005, matCabinet);
    addBox(group, w, wallT, d, 0, h - wallT / 2, 0, matCabinet);
    addBox(group, machW, h - plinthH, 0.018, machX, plinthH + (h - plinthH) / 2, -d / 2 + 0.009, matOakInterior);

    // LEFT COLUMN: Open architectural broom, vacuum, folded ironing board & detergent shelves!
    addUtilityClosetBay(group, utilX, utilW, plinthH, h, d);

    // RIGHT COLUMN: Stacked Washer + Pull-Out Middle Basket Shelf + Dryer + Top Wicker Basket Cubby!
    addBox(group, machW, wallT, d - 0.02, machX, plinthH + wallT / 2, -0.01, matOakInterior);
    const washer = createFrontLoadAppliance('washer', 0.6, 0.845, d - 0.06);
    washer.position.set(machX, plinthH + wallT, 0.015);
    group.add(washer);

    const midY = plinthH + wallT + 0.855 + 0.036;
    const midHost = new THREE.Group();
    midHost.position.set(machX, 0, 0);
    addPullOutLoadingTray(midHost, machW - 0.01, midY, frontZ, 0.22, false);
    group.add(midHost);

    const dryerBaseY = midY + 0.06;
    addBox(group, machW, 0.024, d - 0.02, machX, dryerBaseY - 0.012, -0.01, matOakInterior);
    const dryer = createFrontLoadAppliance('dryer', 0.6, 0.845, d - 0.06);
    dryer.position.set(machX, dryerBaseY, 0.015);
    group.add(dryer);

    // Open top wicker basket cubby (exact match to 50 cm top cubby in Pinterest 120 cm diagram!)
    const cubbyY = dryerBaseY + 0.86;
    addBox(group, machW, 0.024, d - 0.02, machX, cubbyY, -0.01, matOakInterior);
    const topWicker = createWovenBasket(machW - 0.1, 0.3, d - 0.16, 'rattan-clean');
    topWicker.position.set(machX, cubbyY + 0.012, 0.02);
    group.add(topWicker);
    addBox(group, machW - 0.08, 0.01, 0.016, machX, h - wallT - 0.014, -d / 2 + 0.12, matLedWarm);
  } else if (asset.archetype === 'laundry_clean_dirty_sorter') {
    // 6. TEMİZ & KİRLİ ÇAMAŞIR AYIRMA BOY DOLABI (92x54x218 cm)
    // Fits bathrooms, hallways, dressing rooms & laundry rooms!
    // Bottom: 2 Tilt-Out Dirty Laundry Hampers (Beyazlar / Renkliler) with oval laundry drop cutouts
    // Middle: Pull-out folding tray + oak counter niche
    // Top: Clean towel & rattan basket shelves + closed linen cupboard
    const colW = (w - wallT * 3) / 2;
    addBox(group, w - 0.01, plinthH, d - 0.04, 0, plinthH / 2, -0.02, matCabinetRecess);
    addBox(group, wallT, h - plinthH, d, -w / 2 + wallT / 2, plinthH + (h - plinthH) / 2, 0, matCabinet);
    addBox(group, wallT, h - plinthH, d, w / 2 - wallT / 2, plinthH + (h - plinthH) / 2, 0, matCabinet);
    addBox(group, wallT, h - plinthH, d - 0.01, 0, plinthH + (h - plinthH) / 2, -0.005, matCabinet);
    addBox(group, w - wallT * 2, h - plinthH, 0.018, 0, plinthH + (h - plinthH) / 2, -d / 2 + 0.009, matOakInterior);
    addBox(group, w, wallT, d, 0, h - wallT / 2, 0, matCabinet);

    // Bottom Dirty Laundry Sorting Zone (2 tilt-out bays: Left closed with oval drop slot, Right tilted open!)
    const dirtyH = 0.72;
    addCabinetDoor(group, colW + 0.006, dirtyH, -w / 4, plinthH + dirtyH / 2, frontZ, {
      handleSide: 'top-center',
      handleOrientation: 'horizontal',
      handleLength: 0.12,
      ovalCutout: true,
    });
    addCabinetDoor(group, colW + 0.006, dirtyH, w / 4, plinthH + dirtyH / 2, frontZ, {
      handleSide: 'top-center',
      handleOrientation: 'horizontal',
      handleLength: 0.12,
      ovalCutout: true,
      tiltOutDeg: 22,
    });
    const dirtyBasketRight = createWovenBasket(colW - 0.07, 0.46, d - 0.18, 'rattan-dirty');
    dirtyBasketRight.position.set(w / 4, plinthH + 0.05, 0.08);
    dirtyBasketRight.rotation.x = THREE.MathUtils.degToRad(14);
    group.add(dirtyBasketRight);

    // Middle Pull-out Folding Shelf (y = 0.84 .. 0.94 m)
    const foldShelfY = plinthH + dirtyH + 0.04;
    const foldHost = new THREE.Group();
    addPullOutLoadingTray(foldHost, w - wallT * 2, foldShelfY, frontZ, 0.2, false);
    group.add(foldHost);

    // Middle Open Clean-Laundry Oak Niche (y = 0.96 .. 1.56 m) with 2 rattan clean baskets + folded towels
    const nicheBottomY = foldShelfY + 0.06;
    const nicheMidY = nicheBottomY + 0.3;
    const nicheTopY = nicheBottomY + 0.6;
    addBox(group, w - wallT * 2, 0.022, d - 0.02, 0, nicheBottomY, -0.01, matOakInterior);
    addBox(group, w - wallT * 2, 0.022, d - 0.02, 0, nicheMidY, -0.01, matOakInterior);
    addBox(group, w - wallT * 2, 0.022, d - 0.02, 0, nicheTopY, -0.01, matOakInterior);
    addBox(group, w - 0.12, 0.01, 0.016, 0, nicheTopY - 0.018, -d / 2 + 0.09, matLedWarm);

    const b1 = createWovenBasket(colW - 0.06, 0.22, d - 0.12, 'rattan-clean');
    b1.position.set(-w / 4, nicheBottomY + 0.011, 0.02);
    group.add(b1);
    const b2 = createWovenBasket(colW - 0.06, 0.22, d - 0.12, 'cream-clean');
    b2.position.set(w / 4, nicheBottomY + 0.011, 0.02);
    group.add(b2);

    addFoldedTowelStack(group, -w / 4, nicheMidY + 0.011, 0.02, colW - 0.1, d - 0.18, 4);
    addFoldedTowelStack(group, w / 4, nicheMidY + 0.011, 0.02, colW - 0.1, d - 0.18, 4);

    // Top Closed Clean-Linen Double Doors (y = nicheTopY .. h)
    const topH = h - nicheTopY - wallT;
    addCabinetDoor(group, colW + 0.006, topH, -w / 4, nicheTopY + topH / 2 + 0.008, frontZ, {
      handleSide: 'right',
      handleOrientation: 'vertical',
      handleLength: 0.15,
    });
    addCabinetDoor(group, colW + 0.006, topH, w / 4, nicheTopY + topH / 2 + 0.008, frontZ, {
      handleSide: 'left',
      handleOrientation: 'vertical',
      handleLength: 0.15,
    });
  } else if (asset.archetype === 'laundry_compact_banyo_tower') {
    // 7. KOMPAKT BANYO & BALKON ÜST ÜSTE ÇAMAŞIR DOLABI (72x66x228 cm)
    // Tailored for Turkish apartment bathrooms & closed balconies!
    const innerW = w - wallT * 2;
    const bottomDrawerH = 0.175;

    addBox(group, w - 0.01, plinthH, d - 0.05, 0, plinthH / 2, -0.025, matCabinetRecess);
    addBox(group, wallT, h - plinthH, d, -w / 2 + wallT / 2, plinthH + (h - plinthH) / 2, 0, matCabinet);
    addBox(group, wallT, h - plinthH, d, w / 2 - wallT / 2, plinthH + (h - plinthH) / 2, 0, matCabinet);
    addBox(group, innerW, h - plinthH, 0.018, 0, plinthH + (h - plinthH) / 2, -d / 2 + 0.009, matCabinetRecess);
    addBox(group, w, wallT, d, 0, h - wallT / 2, 0, matCabinet);

    // Bottom Pull-Out Dirty Laundry Drawer (slightly open 16 cm!)
    const pull = 0.16;
    addBox(group, innerW - 0.04, bottomDrawerH - 0.03, d - 0.14, 0, plinthH + bottomDrawerH / 2, pull - 0.02, matOakInterior);
    const lowBasket = createWovenBasket(innerW - 0.12, 0.13, d - 0.24, 'rattan-dirty');
    lowBasket.position.set(0, plinthH + 0.015, pull + 0.01);
    group.add(lowBasket);
    addCabinetDoor(group, innerW + 0.01, bottomDrawerH, 0, plinthH + bottomDrawerH / 2, frontZ + pull, {
      handleSide: 'center',
      handleOrientation: 'horizontal',
      handleLength: 0.16,
    });

    // Stacked Washer
    const wBaseY = plinthH + bottomDrawerH + 0.02;
    addBox(group, innerW, 0.02, d - 0.02, 0, wBaseY - 0.01, -0.01, matCabinet);
    const washer = createFrontLoadAppliance('washer', 0.6, 0.84, d - 0.06);
    washer.position.set(0, wBaseY, 0.015);
    group.add(washer);

    // Middle Pull-Out Basket Loading Tray
    const midY = wBaseY + 0.848 + 0.03;
    addPullOutLoadingTray(group, innerW - 0.01, midY, frontZ, 0.26, true);

    // Stacked Dryer
    const dBaseY = midY + 0.052;
    addBox(group, innerW, 0.02, d - 0.02, 0, dBaseY - 0.01, -0.01, matCabinet);
    const dryer = createFrontLoadAppliance('dryer', 0.6, 0.84, d - 0.06);
    dryer.position.set(0, dBaseY, 0.015);
    group.add(dryer);

    // Top Overhead Detergent Cupboard — strictly flush inside cabinet roof!
    const topY = dBaseY + 0.848;
    const topH = Math.max(0.08, h - topY - wallT - 0.004);
    addBox(group, innerW, wallT, d - 0.02, 0, topY, -0.01, matCabinet);
    addCabinetDoor(group, innerW + 0.01, topH, 0, topY + wallT / 2 + topH / 2, frontZ, {
      handleSide: 'center',
      handleOrientation: 'horizontal',
      handleLength: 0.16,
    });
  } else {
    // 8. LÜKS VİLLA 4'LÜ KOMPLE ÇAMAŞIR ODASI DUVARI (256x68x246 cm)
    // Faithful to image_f52e77fc.png (4-machine dual stacked luxury villa wall + central hanging rod & marble folding station!)
    const towerW = 0.68;
    const centerW = w - towerW * 2 - wallT * 4;
    const leftX = -w / 2 + wallT + towerW / 2;
    const rightX = w / 2 - wallT - towerW / 2;
    const counterY = 0.9;

    // Full-width plinth, gables & crown molding
    addBox(group, w - 0.01, plinthH, d - 0.05, 0, plinthH / 2, -0.025, matCabinetRecess);
    addBox(group, wallT, h - plinthH, d, -w / 2 + wallT / 2, plinthH + (h - plinthH) / 2, 0, matCabinet);
    addBox(group, wallT, h - plinthH, d, w / 2 - wallT / 2, plinthH + (h - plinthH) / 2, 0, matCabinet);
    addBox(group, wallT, h - plinthH, d, -centerW / 2 - wallT / 2, plinthH + (h - plinthH) / 2, 0, matCabinet);
    addBox(group, wallT, h - plinthH, d, centerW / 2 + wallT / 2, plinthH + (h - plinthH) / 2, 0, matCabinet);
    addBox(group, w - wallT * 2, h - plinthH, 0.018, 0, plinthH + (h - plinthH) / 2, -d / 2 + 0.009, matCabinetRecess);
    addBox(group, w, 0.055, d + 0.018, 0, h - 0.0275, 0.008, matCabinet);

    // LEFT & RIGHT STACKED MACHINE TOWERS (4 front-load machines total: 2 washers + 2 dryers!)
    for (const [ti, tx] of [
      [0, leftX],
      [1, rightX],
    ] as const) {
      addBox(group, towerW, wallT, d - 0.02, tx, plinthH + wallT / 2, -0.01, matCabinet);
      const lowApp = createFrontLoadAppliance('washer', 0.6, 0.845, d - 0.06);
      lowApp.position.set(tx, plinthH + wallT, 0.015);
      group.add(lowApp);

      const midY = plinthH + wallT + 0.86;
      addBox(group, towerW, 0.028, d - 0.02, tx, midY, -0.01, matCabinet);
      if (ti === 0) {
        const trayHost = new THREE.Group();
        trayHost.position.set(tx, 0, 0);
        addPullOutLoadingTray(trayHost, towerW - 0.02, midY + 0.026, frontZ, 0.24, true);
        group.add(trayHost);
      }

      const hiBaseY = midY + (ti === 0 ? 0.08 : 0.02);
      const hiApp = createFrontLoadAppliance('dryer', 0.6, 0.845, d - 0.06);
      hiApp.position.set(tx, hiBaseY, 0.015);
      group.add(hiApp);

      const capY = hiBaseY + 0.855;
      const capH = h - capY - 0.055;
      addBox(group, towerW, wallT, d - 0.02, tx, capY, -0.01, matCabinet);
      addCabinetDoor(group, towerW + 0.008, capH, tx, capY + capH / 2 + 0.008, frontZ, {
        shaker: true,
        handleSide: 'top-center',
        handleOrientation: 'horizontal',
        handleLength: 0.15,
      });
    }

    // CENTER LUXURY FOLDING, SORTING & HANGING STATION
    const baseH = counterY - 0.036 - plinthH;
    addBox(group, centerW, baseH, d - 0.02, 0, plinthH + baseH / 2, -0.01, matCabinet);
    // 2 Wide Clean/Dirty Tilt-Out / Pull-Out Shaker Drawers underneath marble counter
    addCabinetDoor(group, centerW / 2 - 0.004, baseH, -centerW / 4, plinthH + baseH / 2, frontZ, {
      shaker: true,
      handleSide: 'top-center',
      handleOrientation: 'horizontal',
      handleLength: 0.16,
      tiltOutDeg: 18,
    });
    const centerDirty = createWovenBasket(centerW / 2 - 0.09, 0.44, d - 0.22, 'rattan-dirty');
    centerDirty.position.set(-centerW / 4, plinthH + 0.06, 0.07);
    centerDirty.rotation.x = THREE.MathUtils.degToRad(12);
    group.add(centerDirty);

    addCabinetDoor(group, centerW / 2 - 0.004, baseH / 2, centerW / 4, plinthH + baseH * 0.25, frontZ, {
      shaker: true,
      handleSide: 'center',
      handleOrientation: 'horizontal',
      handleLength: 0.16,
    });
    addCabinetDoor(group, centerW / 2 - 0.004, baseH / 2, centerW / 4, plinthH + baseH * 0.75, frontZ, {
      shaker: true,
      handleSide: 'center',
      handleOrientation: 'horizontal',
      handleLength: 0.16,
    });

    // Veined Marble Folding Countertop + Folded Towels (positioned cleanly in front of recessed hanging niche!)
    addBox(group, centerW, 0.036, d + 0.016, 0, counterY - 0.018, 0.006, matMarble);
    addFoldedTowelStack(group, -centerW * 0.24, counterY, 0.14, 0.3, 0.26, 3);
    addDetergentBottles(group, centerW * 0.28, counterY, 0.12);

    // Illuminated Oak Hanging Clothes Drying Rod Niche cleanly recessed against back wall!
    const upY = 1.72;
    const nicheD = 0.42;
    const nicheZ = -d / 2 + nicheD / 2;
    addHangingRodNiche(group, 0, counterY + 0.005, centerW, upY - counterY - 0.01, nicheD, nicheZ);

    // Full-Depth Upper Shaker Double Cabinets flush with left & right towers (zero dark gap!)
    const upH = h - upY - 0.055;
    addBox(group, centerW, upH, d - 0.02, 0, upY + upH / 2, -0.01, matCabinet);
    addCabinetDoor(group, centerW / 2 - 0.004, upH, -centerW / 4, upY + upH / 2, frontZ, {
      shaker: true,
      handleSide: 'right',
      handleOrientation: 'vertical',
      handleLength: 0.15,
    });
    addCabinetDoor(group, centerW / 2 - 0.004, upH, centerW / 4, upY + upH / 2, frontZ, {
      shaker: true,
      handleSide: 'left',
      handleOrientation: 'vertical',
      handleLength: 0.15,
    });
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
