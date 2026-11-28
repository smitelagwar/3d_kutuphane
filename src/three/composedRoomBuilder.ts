import * as THREE from 'three';
import type {
  ArchitecturalAsset,
  ComposedRoomShellSpec,
  ComposedRoomSpec,
  KitchenCabinetRunSpec,
  KitchenIslandSpec,
  MaterialFinish,
  PatternVariant,
  RoomArtFrameSpec,
  RoomFloorMaterialKind,
} from '../lib/catalogTypes';
import { buildArchitecturalAssetMesh } from './assetMeshBuilder';
import { loadExternalArchitecturalModel } from './externalModelLoader';

export interface ComposedRoomBuildOptions {
  isSoftwareGl: boolean;
  maxAnisotropy: number;
  wireframe: boolean;
  pattern: PatternVariant;
  onProgress?: (loadedCount: number, totalCount: number) => void;
  onPartialUpdate?: () => void;
}

export interface BuiltComposedRoom {
  group: THREE.Group;
  dispose: () => void;
  applyTheme: (finish: MaterialFinish, wireframe: boolean) => void;
}

function createFloorCanvasTexture(
  kind: RoomFloorMaterialKind,
  baseHex: string,
  maxAnisotropy: number,
  repeatX: number,
  repeatY: number,
): { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;

  const bc = document.createElement('canvas');
  bc.width = size;
  bc.height = size;
  const bctx = bc.getContext('2d')!;

  const baseCol = new THREE.Color(baseHex);
  const toRgb = (col: THREE.Color, delta = 0) => {
    const r = Math.min(255, Math.max(0, Math.round((col.r + delta) * 255)));
    const g = Math.min(255, Math.max(0, Math.round((col.g + delta) * 255)));
    const b = Math.min(255, Math.max(0, Math.round((col.b + delta) * 255)));
    return `rgb(${r},${g},${b})`;
  };

  ctx.fillStyle = toRgb(baseCol);
  ctx.fillRect(0, 0, size, size);
  bctx.fillStyle = '#909090';
  bctx.fillRect(0, 0, size, size);

  if (kind === 'oak_herringbone') {
    const pw = 64;
    const ph = 128;
    for (let row = -2; row < 10; row++) {
      for (let col = -2; col < 10; col++) {
        const isVert = (row + col) % 2 === 0;
        const delta = (((row * 17 + col * 31) & 15) - 7) * 0.008;
        const x = col * pw;
        const y = row * pw;
        ctx.fillStyle = toRgb(baseCol, delta);
        if (isVert) {
          ctx.fillRect(x, y, pw - 2, ph - 2);
          ctx.strokeStyle = toRgb(baseCol, -0.09);
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + 0.5, y + 0.5, pw - 2, ph - 2);
          bctx.strokeStyle = '#404040';
          bctx.lineWidth = 2;
          bctx.strokeRect(x, y, pw, ph);
        } else {
          ctx.fillRect(x, y, ph - 2, pw - 2);
          ctx.strokeStyle = toRgb(baseCol, -0.09);
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + 0.5, y + 0.5, ph - 2, pw - 2);
          bctx.strokeStyle = '#404040';
          bctx.lineWidth = 2;
          bctx.strokeRect(x, y, ph, pw);
        }
      }
    }
  } else if (kind === 'walnut_plank' || kind === 'light_oak_plank') {
    const planks = 8;
    const plankH = size / planks;
    for (let i = 0; i < planks; i++) {
      const y = i * plankH;
      const delta = (((i * 23 + 7) % 11) - 5) * 0.011;
      ctx.fillStyle = toRgb(baseCol, delta);
      ctx.fillRect(0, y, size, plankH - 1.5);
      // Subtle longitudinal wood grain lines
      ctx.strokeStyle = toRgb(baseCol, delta - 0.04);
      ctx.lineWidth = 1;
      for (let g = 0; g < 6; g++) {
        const gy = y + ((g + 0.5) * plankH) / 6;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.bezierCurveTo(size * 0.3, gy + 2, size * 0.7, gy - 2, size, gy);
        ctx.stroke();
      }
      // Joint seam
      const splitX = ((i * 193) % (size - 80)) + 40;
      ctx.fillStyle = toRgb(baseCol, -0.14);
      ctx.fillRect(0, y + plankH - 2, size, 2);
      ctx.fillRect(splitX, y, 2, plankH);

      bctx.fillStyle = '#383838';
      bctx.fillRect(0, y + plankH - 2, size, 2);
      bctx.fillRect(splitX, y, 2, plankH);
    }
  } else if (kind === 'calacatta_marble' || kind === 'travertine_stone') {
    const tiles = 2;
    const step = size / tiles;
    for (let r = 0; r < tiles; r++) {
      for (let cIdx = 0; cIdx < tiles; cIdx++) {
        const delta = ((r * 3 + cIdx * 5) % 4 - 1.5) * 0.012;
        ctx.fillStyle = toRgb(baseCol, delta);
        ctx.fillRect(cIdx * step, r * step, step, step);
      }
    }
    // Natural stone veins / travertine pores
    for (let v = 0; v < 28; v++) {
      const sy = (v * 39) % size;
      ctx.strokeStyle =
        kind === 'calacatta_marble'
          ? 'rgba(138, 134, 128, 0.24)'
          : 'rgba(148, 129, 104, 0.22)';
      ctx.lineWidth = kind === 'calacatta_marble' ? 1.5 + (v % 3) : 2.5 + (v % 4);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.bezierCurveTo(
        size * 0.33,
        sy + (kind === 'calacatta_marble' ? (v % 2 === 0 ? 35 : -28) : 4),
        size * 0.66,
        sy + (kind === 'calacatta_marble' ? (v % 2 === 0 ? -24 : 32) : -4),
        size,
        sy + (kind === 'calacatta_marble' ? 18 : 0),
      );
      ctx.stroke();
    }
    // Crisp thin grout lines
    ctx.strokeStyle = 'rgba(110, 102, 92, 0.28)';
    ctx.lineWidth = 2;
    bctx.strokeStyle = '#505050';
    bctx.lineWidth = 3;
    for (let i = 0; i <= tiles; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, size);
      ctx.moveTo(0, i * step);
      ctx.lineTo(size, i * step);
      ctx.stroke();

      bctx.beginPath();
      bctx.moveTo(i * step, 0);
      bctx.lineTo(i * step, size);
      bctx.moveTo(0, i * step);
      bctx.lineTo(size, i * step);
      bctx.stroke();
    }
  } else if (kind === 'terrazzo_light') {
    const chips = ['#B8A793', '#8B7D6E', '#D1C4B2', '#6C736C', '#C49F78'];
    for (let i = 0; i < 420; i++) {
      const cx = (i * 97 + 13) % size;
      const cy = (i * 151 + 29) % size;
      const rad = 2 + (i % 6);
      ctx.fillStyle = chips[i % chips.length];
      ctx.beginPath();
      ctx.ellipse(cx, cy, rad, rad * 0.72, (i * 0.7) % Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // warm_microcement: subtle troweled mineral clouding
    for (let i = 0; i < 85; i++) {
      const cx = (i * 137) % size;
      const cy = (i * 199) % size;
      const rad = 28 + (i % 54);
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, rad);
      grad.addColorStop(0, i % 2 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(60,52,44,0.05)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
    }
  }

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatX, repeatY);
  map.anisotropy = Math.min(8, Math.max(1, maxAnisotropy));

  const bump = new THREE.CanvasTexture(bc);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(repeatX, repeatY);
  bump.anisotropy = Math.min(4, Math.max(1, maxAnisotropy));

  return { map, bump };
}

function createZelligeTexture(baseHex: string, maxAnisotropy: number): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const col = new THREE.Color(baseHex);
  const cols = 4;
  const rows = 8;
  const tw = size / cols;
  const th = size / rows;

  for (let r = 0; r < rows; r++) {
    for (let x = 0; x < cols; x++) {
      const shift = (r % 2) * (tw * 0.5);
      const px = (x * tw + shift) % size;
      const delta = (((r * 13 + x * 29) % 9) - 4) * 0.015;
      const rr = Math.min(255, Math.max(0, Math.round((col.r + delta) * 255)));
      const gg = Math.min(255, Math.max(0, Math.round((col.g + delta) * 255)));
      const bb = Math.min(255, Math.max(0, Math.round((col.b + delta) * 255)));
      ctx.fillStyle = `rgb(${rr},${gg},${bb})`;
      ctx.fillRect(px + 1, r * th + 1, tw - 2, th - 2);
      if (px + tw > size) {
        ctx.fillRect(0, r * th + 1, px + tw - size - 1, th - 2);
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(5, 3);
  tex.anisotropy = Math.min(8, Math.max(1, maxAnisotropy));
  return tex;
}

function createArtCanvasTexture(palette: [string, string, string]): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 320;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = palette[0];
  ctx.fillRect(0, 0, c.width, c.height);

  // Minimalist architectural abstract arch + organic geometry
  ctx.fillStyle = palette[1];
  ctx.beginPath();
  ctx.arc(128, 155, 76, Math.PI, 0);
  ctx.lineTo(204, 275);
  ctx.lineTo(52, 275);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = palette[2];
  ctx.beginPath();
  ctx.arc(154, 140, 36, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = palette[2];
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(42, 240);
  ctx.quadraticCurveTo(128, 180, 214, 248);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface ShellMaterialRefs {
  wallMat: THREE.MeshStandardMaterial;
  accentWallMat: THREE.MeshStandardMaterial;
  floorMat: THREE.MeshStandardMaterial;
  baseboardMat: THREE.MeshStandardMaterial;
  cabinetPrimaryMat: THREE.MeshStandardMaterial;
  cabinetWoodMat: THREE.MeshStandardMaterial;
  countertopMat: THREE.MeshStandardMaterial;
  hardwareMat: THREE.MeshStandardMaterial;
  ledMat: THREE.MeshStandardMaterial;
}

function buildKitchenRunGroup(
  run: KitchenCabinetRunSpec,
  shell: ComposedRoomShellSpec,
  mats: ShellMaterialRefs,
  registerGeo: <T extends THREE.BufferGeometry>(g: T) => T,
): THREE.Group {
  const g = new THREE.Group();
  g.name = `KitchenRun_${run.wall}`;

  const halfW = shell.widthCm / 200;
  const halfD = shell.depthCm / 200;
  const totalLenM = (run.endCm - run.startCm) / 100;
  const centerAlongM = ((run.startCm + run.endCm) / 2) / 100;
  const depthM = (run.baseDepthCm ?? 62) / 100;
  const baseHM = (run.baseHeightCm ?? 88) / 100;
  const plinthH = 0.1;
  const counterThick = 0.036;
  const tallLeftM = (run.tallColumnLeftCm ?? 0) / 100;
  const tallRightM = (run.tallColumnRightCm ?? 0) / 100;
  const tallH = Math.min(2.38, shell.heightCm / 100 - 0.14);

  const localRun = new THREE.Group();

  // Left tall appliance/pantry tower
  if (tallLeftM > 0.05) {
    const leftX = -totalLenM / 2 + tallLeftM / 2;
    const tower = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(tallLeftM - 0.01, tallH - plinthH, depthM)),
      mats.cabinetPrimaryMat,
    );
    tower.position.set(leftX, plinthH + (tallH - plinthH) / 2, depthM / 2);
    tower.castShadow = true;
    tower.receiveShadow = true;
    localRun.add(tower);

    const kick = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(tallLeftM - 0.02, plinthH, depthM - 0.06)),
      mats.hardwareMat,
    );
    kick.position.set(leftX, plinthH / 2, (depthM - 0.06) / 2);
    localRun.add(kick);
  }

  // Right tall cabinet column
  if (tallRightM > 0.05) {
    const rightX = totalLenM / 2 - tallRightM / 2;
    const tower = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(tallRightM - 0.01, tallH - plinthH, depthM)),
      mats.cabinetWoodMat,
    );
    tower.position.set(rightX, plinthH + (tallH - plinthH) / 2, depthM / 2);
    tower.castShadow = true;
    tower.receiveShadow = true;
    localRun.add(tower);
  }

  // Middle working base cabinet run
  const midStart = -totalLenM / 2 + tallLeftM;
  const midEnd = totalLenM / 2 - tallRightM;
  const midLen = Math.max(0.6, midEnd - midStart);
  const midCenter = (midStart + midEnd) / 2;

  const baseBody = new THREE.Mesh(
    registerGeo(new THREE.BoxGeometry(midLen, baseHM - plinthH - counterThick, depthM - 0.01)),
    mats.cabinetPrimaryMat,
  );
  baseBody.position.set(midCenter, plinthH + (baseHM - plinthH - counterThick) / 2, depthM / 2);
  baseBody.castShadow = true;
  baseBody.receiveShadow = true;
  localRun.add(baseBody);

  // Recessed dark toe-kick plinth
  const plinth = new THREE.Mesh(
    registerGeo(new THREE.BoxGeometry(midLen, plinthH, depthM - 0.08)),
    mats.hardwareMat,
  );
  plinth.position.set(midCenter, plinthH / 2, (depthM - 0.08) / 2);
  localRun.add(plinth);

  // Base cabinet door seams & minimal pulls
  const doorCount = Math.max(2, Math.round(midLen / 0.58));
  const doorW = midLen / doorCount;
  const doorH = baseHM - plinthH - counterThick - 0.02;
  const seamGeo = registerGeo(new THREE.BoxGeometry(0.008, doorH, 0.014));
  const handleGeo = registerGeo(new THREE.BoxGeometry(0.14, 0.012, 0.022));
  for (let i = 0; i < doorCount; i++) {
    const dx = midStart + (i + 0.5) * doorW;
    if (i > 0) {
      const seam = new THREE.Mesh(seamGeo, mats.hardwareMat);
      seam.position.set(midStart + i * doorW, plinthH + doorH / 2 + 0.01, depthM - 0.002);
      localRun.add(seam);
    }
    const handle = new THREE.Mesh(handleGeo, mats.hardwareMat);
    handle.position.set(dx, baseHM - counterThick - 0.06, depthM + 0.012);
    localRun.add(handle);
  }

  // Stone / Quartz Countertop slab
  const counter = new THREE.Mesh(
    registerGeo(new THREE.BoxGeometry(midLen + 0.01, counterThick, depthM + 0.025)),
    mats.countertopMat,
  );
  counter.position.set(midCenter, baseHM - counterThick / 2, (depthM + 0.025) / 2);
  counter.castShadow = true;
  counter.receiveShadow = true;
  localRun.add(counter);

  // Optional recessed under-mount sink bowl
  if (typeof run.sinkCenterCm === 'number') {
    const sinkLocalX = run.sinkCenterCm / 100 - centerAlongM;
    const sinkRim = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(0.56, 0.012, 0.42)),
      mats.hardwareMat,
    );
    sinkRim.position.set(sinkLocalX, baseHM + 0.005, depthM * 0.52);
    localRun.add(sinkRim);
  }

  // Backsplash slab
  if (run.hasBacksplash !== false) {
    const splashH = 0.62;
    const splash = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(midLen, splashH, 0.022)),
      mats.countertopMat,
    );
    splash.position.set(midCenter, baseHM + splashH / 2, 0.012);
    splash.receiveShadow = true;
    localRun.add(splash);
  }

  // Floating upper wall cabinets + warm 3000K under-cabinet LED bar
  if (run.hasUpperCabinets !== false) {
    const upperBottom = baseHM + 0.6;
    const upperH = Math.max(0.65, tallH - upperBottom);
    const upperD = 0.36;
    const upper = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(midLen, upperH, upperD)),
      mats.cabinetWoodMat,
    );
    upper.position.set(midCenter, upperBottom + upperH / 2, upperD / 2);
    upper.castShadow = true;
    upper.receiveShadow = true;
    localRun.add(upper);

    if (run.hasUnderCabinetLed !== false) {
      const ledBar = new THREE.Mesh(
        registerGeo(new THREE.BoxGeometry(midLen - 0.08, 0.012, 0.024)),
        mats.ledMat,
      );
      ledBar.position.set(midCenter, upperBottom - 0.006, upperD * 0.42);
      localRun.add(ledBar);
    }
  }

  if (run.wall === 'back') {
    localRun.position.set(centerAlongM, 0, -halfD + 0.01);
  } else {
    localRun.rotation.y = Math.PI / 2;
    localRun.position.set(-halfW + 0.01, 0, centerAlongM);
  }

  g.add(localRun);
  return g;
}

function buildKitchenIslandGroup(
  island: KitchenIslandSpec,
  mats: ShellMaterialRefs,
  registerGeo: <T extends THREE.BufferGeometry>(g: T) => T,
): THREE.Group {
  const g = new THREE.Group();
  g.name = 'KitchenWaterfallIsland';

  const w = island.widthCm / 100;
  const d = island.depthCm / 100;
  const h = (island.heightCm ?? 90) / 100;
  const plinthH = 0.09;
  const topThick = 0.045;
  const hasOverhang = island.overhangSide === 'front';
  const bodyD = hasOverhang ? d - 0.28 : d - 0.04;
  const bodyZOffset = hasOverhang ? -0.13 : 0;

  // Recessed base plinth
  const plinth = new THREE.Mesh(
    registerGeo(new THREE.BoxGeometry(w - 0.14, plinthH, bodyD - 0.08)),
    mats.hardwareMat,
  );
  plinth.position.set(0, plinthH / 2, bodyZOffset);
  g.add(plinth);

  // Main island cabinetry core
  const coreH = h - plinthH - topThick;
  const core = new THREE.Mesh(
    registerGeo(new THREE.BoxGeometry(w - 0.08, coreH, bodyD)),
    mats.cabinetPrimaryMat,
  );
  core.position.set(0, plinthH + coreH / 2, bodyZOffset);
  core.castShadow = true;
  core.receiveShadow = true;
  g.add(core);

  // Fluted oak slats along the front apron (Pinterest signature detail)
  if (island.flutedFront) {
    const slatCount = Math.min(34, Math.max(12, Math.floor((w - 0.12) / 0.06)));
    const slatGeo = registerGeo(new THREE.BoxGeometry(0.026, coreH - 0.02, 0.02));
    const frontZ = bodyZOffset + bodyD / 2 + 0.008;
    const span = w - 0.14;
    for (let i = 0; i < slatCount; i++) {
      const sx = -span / 2 + (i / Math.max(1, slatCount - 1)) * span;
      const slat = new THREE.Mesh(slatGeo, mats.cabinetWoodMat);
      slat.position.set(sx, plinthH + coreH / 2, frontZ);
      g.add(slat);
    }
  }

  // Top marble/quartz slab
  const topSlab = new THREE.Mesh(
    registerGeo(new THREE.BoxGeometry(w, topThick, d)),
    mats.countertopMat,
  );
  topSlab.position.set(0, h - topThick / 2, 0);
  topSlab.castShadow = true;
  topSlab.receiveShadow = true;
  g.add(topSlab);

  // Waterfall side marble slabs
  if (island.waterfallSides) {
    const sideGeo = registerGeo(new THREE.BoxGeometry(topThick, h - topThick, d));
    const leftSide = new THREE.Mesh(sideGeo, mats.countertopMat);
    leftSide.position.set(-w / 2 + topThick / 2, (h - topThick) / 2, 0);
    leftSide.castShadow = true;
    leftSide.receiveShadow = true;
    g.add(leftSide);

    const rightSide = new THREE.Mesh(sideGeo, mats.countertopMat);
    rightSide.position.set(w / 2 - topThick / 2, (h - topThick) / 2, 0);
    rightSide.castShadow = true;
    rightSide.receiveShadow = true;
    g.add(rightSide);
  }

  g.position.set(island.centerXCm / 100, 0, island.centerZCm / 100);
  return g;
}

function buildWallArtFrame(
  frame: RoomArtFrameSpec,
  shell: ComposedRoomShellSpec,
  frameMat: THREE.Material,
  registerGeo: <T extends THREE.BufferGeometry>(g: T) => T,
  registerMat: <T extends THREE.Material>(m: T) => T,
  registerTex: <T extends THREE.Texture>(t: T) => T,
): THREE.Group {
  const g = new THREE.Group();
  const w = frame.widthCm / 100;
  const h = frame.heightCm / 100;
  const halfW = shell.widthCm / 200;
  const halfD = shell.depthCm / 200;

  const backing = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(w, h, 0.026)), frameMat);
  g.add(backing);

  const tex = registerTex(createArtCanvasTexture(frame.palette));
  const artMat = registerMat(
    new THREE.MeshStandardMaterial({
      map: tex,
      color: 0xffffff,
      roughness: 0.72,
      metalness: 0.0,
    }),
  );
  const canvasMesh = new THREE.Mesh(registerGeo(new THREE.PlaneGeometry(w - 0.055, h - 0.055)), artMat);
  canvasMesh.position.z = 0.0145;
  g.add(canvasMesh);

  if (frame.wall === 'back') {
    g.position.set(frame.offsetCm / 100, frame.centerYCm / 100, -halfD + 0.015);
  } else {
    g.rotation.y = Math.PI / 2;
    g.position.set(-halfW + 0.015, frame.centerYCm / 100, frame.offsetCm / 100);
  }
  return g;
}

function buildArchitecturalRoomShell(
  spec: ComposedRoomSpec,
  finish: MaterialFinish,
  maxAnisotropy: number,
  wireframe: boolean,
): {
  shellGroup: THREE.Group;
  mats: ShellMaterialRefs;
  disposeShell: () => void;
} {
  const shell = spec.shell;
  const geos: THREE.BufferGeometry[] = [];
  const matList: THREE.Material[] = [];
  const texList: THREE.Texture[] = [];

  const registerGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geos.push(g);
    return g;
  };
  const registerMat = <T extends THREE.Material>(m: T): T => {
    matList.push(m);
    return m;
  };
  const registerTex = <T extends THREE.Texture>(t: T): T => {
    texList.push(t);
    return t;
  };

  const wM = shell.widthCm / 100;
  const dM = shell.depthCm / 100;
  const hM = shell.heightCm / 100;
  const halfW = wM / 2;
  const halfD = dM / 2;
  const wallT = 0.12;
  const slabT = 0.12;

  const activeWallHex = finish.partFinishes?.primary.hex || shell.wallColorHex;
  const activeFloorHex = finish.partFinishes?.secondary.hex || shell.floorTintHex;
  const activeAccentHex = finish.partFinishes?.accent.hex || shell.cabinetPrimaryHex || shell.accentWallColorHex;

  const { map: floorMap, bump: floorBump } = createFloorCanvasTexture(
    shell.floorMaterial,
    activeFloorHex,
    maxAnisotropy,
    Math.max(2, Math.round(wM / 1.4)),
    Math.max(2, Math.round(dM / 1.4)),
  );
  registerTex(floorMap);
  registerTex(floorBump);

  const isStoneFloor =
    shell.floorMaterial === 'calacatta_marble' ||
    shell.floorMaterial === 'travertine_stone' ||
    shell.floorMaterial === 'terrazzo_light';

  const floorMat = registerMat(
    new THREE.MeshStandardMaterial({
      map: floorMap,
      bumpMap: floorBump,
      bumpScale: 0.004,
      color: 0xffffff,
      roughness: isStoneFloor ? 0.34 : 0.46,
      metalness: 0.02,
      wireframe,
    }),
  );

  const wallMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeWallHex),
      roughness: 0.84,
      metalness: 0.0,
      wireframe,
    }),
  );

  const zelligeTex =
    shell.backWallFeature === 'zellige_tile'
      ? registerTex(createZelligeTexture(activeAccentHex, maxAnisotropy))
      : null;

  const accentWallMat = registerMat(
    new THREE.MeshStandardMaterial({
      map: zelligeTex,
      color: zelligeTex ? 0xffffff : new THREE.Color(shell.accentWallColorHex),
      roughness: zelligeTex ? 0.32 : 0.68,
      metalness: 0.02,
      wireframe,
    }),
  );

  const baseboardMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F3F0EA'),
      roughness: 0.42,
      metalness: 0.02,
      wireframe,
    }),
  );

  const cabinetPrimaryMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeAccentHex),
      roughness: 0.38,
      metalness: 0.04,
      wireframe,
    }),
  );

  const cabinetWoodMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(shell.cabinetWoodHex || activeFloorHex),
      roughness: 0.48,
      metalness: 0.02,
      wireframe,
    }),
  );

  const countertopMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(shell.countertopHex || '#F3F0EA'),
      roughness: 0.22,
      metalness: 0.04,
      wireframe,
    }),
  );

  const hardwareMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(shell.hardwareHex || '#262930'),
      roughness: 0.28,
      metalness: 0.78,
      wireframe,
    }),
  );

  const ledMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFF5DF'),
      emissive: new THREE.Color('#FFE0A6'),
      emissiveIntensity: 1.35,
      roughness: 0.2,
      metalness: 0.0,
    }),
  );

  const shellEdgeMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E3DED6'),
      roughness: 0.85,
      metalness: 0.0,
      wireframe,
    }),
  );

  const mats: ShellMaterialRefs = {
    wallMat,
    accentWallMat,
    floorMat,
    baseboardMat,
    cabinetPrimaryMat,
    cabinetWoodMat,
    countertopMat,
    hardwareMat,
    ledMat,
  };

  const shellGroup = new THREE.Group();
  shellGroup.name = 'ArchitecturalRoomShell';

  // 1. Finished Floor Slab + Architectural Outer Plinth
  const floorBase = new THREE.Mesh(
    registerGeo(new THREE.BoxGeometry(wM + wallT, slabT, dM + wallT)),
    shellEdgeMat,
  );
  floorBase.position.set(-wallT / 2, -slabT / 2, -wallT / 2);
  floorBase.receiveShadow = true;
  shellGroup.add(floorBase);

  const floorTop = new THREE.Mesh(
    registerGeo(new THREE.PlaneGeometry(wM, dM)),
    floorMat,
  );
  floorTop.rotation.x = -Math.PI / 2;
  floorTop.position.set(0, 0.001, 0);
  floorTop.receiveShadow = true;
  shellGroup.add(floorTop);

  // 2. Back & Left Cutaway Architectural Walls
  const backWallMat =
    shell.backWallFeature === 'zellige_tile' ||
    shell.backWallFeature === 'travertine_slab' ||
    shell.backWallFeature === 'calacatta_slab'
      ? accentWallMat
      : wallMat;
  const backWall = new THREE.Mesh(
    registerGeo(new THREE.BoxGeometry(wM + wallT, hM, wallT)),
    backWallMat,
  );
  backWall.position.set(-wallT / 2, hM / 2, -halfD - wallT / 2);
  backWall.receiveShadow = true;
  shellGroup.add(backWall);

  const leftWallMat =
    shell.leftWallFeature === 'travertine_slab' || shell.leftWallFeature === 'calacatta_slab'
      ? accentWallMat
      : wallMat;
  const leftWall = new THREE.Mesh(
    registerGeo(new THREE.BoxGeometry(wallT, hM, dM)),
    leftWallMat,
  );
  leftWall.position.set(-halfW - wallT / 2, hM / 2, 0);
  leftWall.receiveShadow = true;
  shellGroup.add(leftWall);

  // Baseboards (Süpürgelik 9 cm)
  const bbH = 0.09;
  const backBB = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(wM, bbH, 0.018)), baseboardMat);
  backBB.position.set(0, bbH / 2, -halfD + 0.009);
  shellGroup.add(backBB);

  const leftBB = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(0.018, bbH, dM)), baseboardMat);
  leftBB.position.set(-halfW + 0.009, bbH / 2, 0);
  shellGroup.add(leftBB);

  // Ceiling Cove LED Strip & Architectural Shadow Gap
  if (shell.ceilingCoveLed) {
    const coveBack = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(wM - 0.16, 0.032, 0.04)), ledMat);
    coveBack.position.set(0, hM - 0.08, -halfD + 0.025);
    shellGroup.add(coveBack);

    const coveLeft = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(0.04, 0.032, dM - 0.16)), ledMat);
    coveLeft.position.set(-halfW + 0.025, hM - 0.08, 0);
    shellGroup.add(coveLeft);
  }

  // 3. Wall Architectural Features (Wainscoting Molding Frames)
  const addWainscoting = (wall: 'back' | 'left', spanM: number) => {
    const panels = Math.max(3, Math.round(spanM / 1.15));
    const panelW = (spanM - 0.4) / panels - 0.12;
    const frameH = 1.05;
    const yMid = 1.62;
    const trimT = 0.028;
    for (let i = 0; i < panels; i++) {
      const offset = -spanM / 2 + 0.2 + (i + 0.5) * ((spanM - 0.4) / panels);
      const grp = new THREE.Group();
      const top = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(panelW, trimT, 0.016)), baseboardMat);
      top.position.y = frameH / 2;
      const bot = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(panelW, trimT, 0.016)), baseboardMat);
      bot.position.y = -frameH / 2;
      const lft = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(trimT, frameH, 0.016)), baseboardMat);
      lft.position.x = -panelW / 2;
      const rgt = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(trimT, frameH, 0.016)), baseboardMat);
      rgt.position.x = panelW / 2;
      grp.add(top, bot, lft, rgt);
      if (wall === 'back') {
        grp.position.set(offset, yMid, -halfD + 0.008);
      } else {
        grp.rotation.y = Math.PI / 2;
        grp.position.set(-halfW + 0.008, yMid, offset);
      }
      shellGroup.add(grp);
    }
  };
  if (shell.backWallFeature === 'wainscoting_frames') addWainscoting('back', wM);
  if (shell.leftWallFeature === 'wainscoting_frames') addWainscoting('left', dM);

  // 4. Built-In Feature Backdrops (Fluted Wood Slats / Travertine TV Wall / Upholstered Hotel Headboard)
  if (shell.builtInBackdrop) {
    const bd = shell.builtInBackdrop;
    const bw = bd.widthCm / 100;
    const bh = bd.heightCm / 100;
    const bdGroup = new THREE.Group();
    bdGroup.name = `BuiltInBackdrop_${bd.style}`;

    if (bd.style === 'fluted_slat_wall') {
      const felt = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(bw, bh, 0.016)), hardwareMat);
      felt.position.set(0, bh / 2, 0.008);
      bdGroup.add(felt);

      const slatCount = Math.min(36, Math.max(14, Math.floor(bw / 0.075)));
      const slatGeo = registerGeo(new THREE.BoxGeometry(0.032, bh - 0.04, 0.026));
      for (let i = 0; i < slatCount; i++) {
        const sx = -bw / 2 + 0.04 + (i / Math.max(1, slatCount - 1)) * (bw - 0.08);
        const slat = new THREE.Mesh(slatGeo, cabinetWoodMat);
        slat.position.set(sx, bh / 2, 0.026);
        bdGroup.add(slat);
      }
      // Subtle vertical warm LED edge wash
      const ledL = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(0.014, bh - 0.12, 0.014)), ledMat);
      ledL.position.set(-bw / 2 - 0.01, bh / 2, 0.015);
      const ledR = ledL.clone();
      ledR.position.x = bw / 2 + 0.01;
      bdGroup.add(ledL, ledR);
    } else if (bd.style === 'travertine_tv_wall') {
      const slab = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(bw * 0.72, bh, 0.05)), accentWallMat);
      slab.position.set(0, bh / 2, 0.025);
      slab.receiveShadow = true;
      bdGroup.add(slab);

      // Flanking vertical fluted wood strips
      const flankW = bw * 0.13;
      const slatGeo = registerGeo(new THREE.BoxGeometry(0.026, bh - 0.04, 0.032));
      for (const side of [-1, 1]) {
        for (let i = 0; i < 4; i++) {
          const sx = side * (bw * 0.36 + 0.04 + i * (flankW / 4));
          const slat = new THREE.Mesh(slatGeo, cabinetWoodMat);
          slat.position.set(sx, bh / 2, 0.024);
          bdGroup.add(slat);
        }
      }

      // Ultra-slim 65" OLED architectural TV mounted cleanly on the travertine slab
      const tvMat = registerMat(
        new THREE.MeshStandardMaterial({ color: '#14171D', roughness: 0.16, metalness: 0.45 }),
      );
      const tv = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(1.48, 0.84, 0.032)), tvMat);
      tv.position.set(0, 1.56, 0.068);
      bdGroup.add(tv);

      // Warm backlit halo strips behind slab
      const halo = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(bw * 0.74, 0.02, 0.014)), ledMat);
      halo.position.set(0, bh - 0.04, 0.012);
      bdGroup.add(halo);
    } else if (bd.style === 'upholstered_headboard') {
      const panelCount = 6;
      const pw = bw / panelCount;
      const panelMat = registerMat(
        new THREE.MeshStandardMaterial({ color: new THREE.Color(activeAccentHex), roughness: 0.88, metalness: 0.0 }),
      );
      const panelGeo = registerGeo(new THREE.BoxGeometry(pw - 0.012, bh, 0.065));
      for (let i = 0; i < panelCount; i++) {
        const px = -bw / 2 + (i + 0.5) * pw;
        const p = new THREE.Mesh(panelGeo, panelMat);
        p.position.set(px, bh / 2 + 0.08, 0.035);
        bdGroup.add(p);
      }
      const topLed = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(bw - 0.06, 0.018, 0.016)), ledMat);
      topLed.position.set(0, bh + 0.095, 0.02);
      bdGroup.add(topLed);
    }

    if (bd.wall === 'back') {
      bdGroup.position.set(bd.centerCm / 100, 0, -halfD + 0.005);
    } else {
      bdGroup.rotation.y = Math.PI / 2;
      bdGroup.position.set(-halfW + 0.005, 0, bd.centerCm / 100);
    }
    shellGroup.add(bdGroup);
  }

  // 5. Daylight Architectural Window + Sheer Drapes
  if (shell.windowOnWall && shell.windowOnWall !== 'none') {
    const winW = (shell.windowWidthCm ?? 150) / 100;
    const winH = Math.min(2.05, hM - 0.55);
    const winCenterY = 0.42 + winH / 2;
    const winGrp = new THREE.Group();
    winGrp.name = 'DaylightWindow';

    const skyMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: '#F4F8FD',
        emissive: '#EBF4FF',
        emissiveIntensity: 0.85,
        roughness: 0.15,
        metalness: 0.05,
      }),
    );
    const glass = new THREE.Mesh(registerGeo(new THREE.PlaneGeometry(winW - 0.08, winH - 0.08)), skyMat);
    glass.position.z = 0.018;
    winGrp.add(glass);

    // Minimalist aluminum frame + center mullion
    const frameBars: Array<[number, number, number, number, number]> = [
      [winW, 0.055, 0.045, 0, winH / 2],
      [winW, 0.055, 0.045, 0, -winH / 2],
      [0.055, winH, 0.045, -winW / 2, 0],
      [0.055, winH, 0.045, winW / 2, 0],
      [0.036, winH - 0.08, 0.038, 0, 0],
    ];
    for (const [fw, fh, fd, fx, fy] of frameBars) {
      const bar = new THREE.Mesh(registerGeo(new THREE.BoxGeometry(fw, fh, fd)), hardwareMat);
      bar.position.set(fx, fy, 0.025);
      winGrp.add(bar);
    }

    // Soft pleated sheer linen drapes flanking the window
    const drapeMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: '#F5F2EC',
        roughness: 0.92,
        metalness: 0.0,
        transparent: true,
        opacity: 0.9,
      }),
    );
    const drapeH = hM - 0.12;
    for (const side of [-1, 1]) {
      for (let f = 0; f < 3; f++) {
        const fold = new THREE.Mesh(
          registerGeo(new THREE.CylinderGeometry(0.038, 0.042, drapeH, 10)),
          drapeMat,
        );
        fold.position.set(side * (winW / 2 + 0.06 + f * 0.052), drapeH / 2 - winCenterY + 0.04, 0.07);
        winGrp.add(fold);
      }
    }

    const offsetM = (shell.windowCenterCm ?? 0) / 100;
    if (shell.windowOnWall === 'left') {
      winGrp.rotation.y = Math.PI / 2;
      winGrp.position.set(-halfW + 0.008, winCenterY, offsetM);
    } else {
      winGrp.position.set(offsetM, winCenterY, -halfD + 0.008);
    }
    shellGroup.add(winGrp);
  }

  // 6. Kitchen Cabinetry Runs & Waterfall Island
  if (shell.kitchenRuns) {
    for (const run of shell.kitchenRuns) {
      shellGroup.add(buildKitchenRunGroup(run, shell, mats, registerGeo));
    }
  }
  if (shell.kitchenIsland) {
    shellGroup.add(buildKitchenIslandGroup(shell.kitchenIsland, mats, registerGeo));
  }

  // 7. Gallery Wall Art Frames
  if (shell.artFrames) {
    for (const frame of shell.artFrames) {
      shellGroup.add(buildWallArtFrame(frame, shell, cabinetWoodMat, registerGeo, registerMat, registerTex));
    }
  }

  const disposeShell = () => {
    for (const g of geos) g.dispose();
    for (const m of matList) m.dispose();
    for (const t of texList) t.dispose();
  };

  return { shellGroup, mats, disposeShell };
}

/**
 * Builds a complete live 3D Composed Room Scene:
 * - Constructs the architectural cutaway room shell synchronously so the viewport displays immediately.
 * - Populates every placed real catalog sub-asset (both procedural Turkish CAD models and real PBR .GLB models)
 *   at exact architectural coordinates, grounded cleanly on the floor or counter.
 */
export async function buildComposedRoomScene(
  roomAsset: ArchitecturalAsset,
  catalogById: ReadonlyMap<string, ArchitecturalAsset>,
  finish: MaterialFinish,
  options: ComposedRoomBuildOptions,
  signal?: AbortSignal,
): Promise<BuiltComposedRoom> {
  const spec = roomAsset.composedRoom;
  if (!spec) {
    throw new Error(`Asset '${roomAsset.id}' has no composedRoom specification.`);
  }

  const root = new THREE.Group();
  root.name = `ComposedRoom_${roomAsset.slug}`;

  const { shellGroup, mats, disposeShell } = buildArchitecturalRoomShell(
    spec,
    finish,
    options.maxAnisotropy,
    options.wireframe,
  );
  root.add(shellGroup);

  const subDisposers: Array<() => void> = [];
  const total = spec.placements.length;
  let completed = 0;

  const furnitureGroup = new THREE.Group();
  furnitureGroup.name = 'PlacedCatalogModels';
  root.add(furnitureGroup);

  // Place procedural Turkish CAD models immediately (zero network latency!)
  const externalJobs: Array<{ placement: (typeof spec.placements)[number]; subAsset: ArchitecturalAsset }> = [];

  for (const placement of spec.placements) {
    const subAsset = catalogById.get(placement.assetId);
    if (!subAsset) {
      completed += 1;
      continue;
    }

    const isExternal =
      subAsset.modelSource?.provider === 'polyhaven' ||
      subAsset.modelSource?.provider === 'khronos' ||
      subAsset.modelSource?.provider === 'abo' ||
      subAsset.modelSource?.provider === 'hf';

    if (isExternal) {
      externalJobs.push({ placement, subAsset });
      continue;
    }

    try {
      const subFinish =
        subAsset.finishes.find((f) => f.id === subAsset.defaultFinishId) ?? subAsset.finishes[0];
      const built = buildArchitecturalAssetMesh(subAsset, subFinish, {
        isSoftwareGl: options.isSoftwareGl,
        maxAnisotropy: options.maxAnisotropy,
        wireframe: options.wireframe,
      });
      subDisposers.push(built.dispose);

      const holder = new THREE.Group();
      holder.name = `${placement.assetId}_${placement.roleLabel}`;
      holder.add(built.group);

      const scale = placement.scaleOverride ?? 1;
      if (scale !== 1) holder.scale.setScalar(scale);
      holder.rotation.y = THREE.MathUtils.degToRad(placement.rotYDeg);

      // Ground bottom strictly onto placement.yCm / 100
      holder.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(holder);
      const yOffset = Number.isFinite(box.min.y) ? placement.yCm / 100 - box.min.y : placement.yCm / 100;
      holder.position.set(placement.xCm / 100, yOffset, placement.zCm / 100);
      furnitureGroup.add(holder);
    } catch {
      // Skip any failed procedural sub-asset without crashing room assembly
    }
    completed += 1;
  }

  options.onProgress?.(completed, total);
  options.onPartialUpdate?.();

  // Deduplicate & load external GLB assets with bounded concurrency (4 at a time)
  const runJob = async (job: { placement: (typeof spec.placements)[number]; subAsset: ArchitecturalAsset }) => {
    if (signal?.aborted) return;
    const { placement, subAsset } = job;
    try {
      const subFinish =
        subAsset.finishes.find((f) => f.id === subAsset.defaultFinishId) ?? subAsset.finishes[0];
      const subPattern =
        subAsset.patterns.find((p) => p.id === subAsset.defaultPatternId) ?? subAsset.patterns[0];

      const built = await loadExternalArchitecturalModel(
        subAsset,
        subFinish,
        subPattern,
        {
          isSoftwareGl: options.isSoftwareGl,
          maxAnisotropy: options.maxAnisotropy,
          wireframe: options.wireframe,
        },
        signal,
      );

      if (signal?.aborted) {
        built.dispose();
        return;
      }

      subDisposers.push(built.dispose);

      const holder = new THREE.Group();
      holder.name = `${placement.assetId}_${placement.roleLabel}`;
      holder.add(built.group);

      const scale = placement.scaleOverride ?? 1;
      if (scale !== 1) holder.scale.setScalar(scale);
      holder.rotation.y = THREE.MathUtils.degToRad(placement.rotYDeg);

      holder.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(holder);
      const yOffset = Number.isFinite(box.min.y) ? placement.yCm / 100 - box.min.y : placement.yCm / 100;
      holder.position.set(placement.xCm / 100, yOffset, placement.zCm / 100);
      furnitureGroup.add(holder);
    } catch {
      // Graceful resilience: if one CDN asset is slow/offline, keep the rest of the room crisp
    } finally {
      completed += 1;
      if (!signal?.aborted) {
        options.onProgress?.(completed, total);
        options.onPartialUpdate?.();
      }
    }
  };

  const concurrency = 4;
  for (let i = 0; i < externalJobs.length; i += concurrency) {
    if (signal?.aborted) break;
    await Promise.all(externalJobs.slice(i, i + concurrency).map(runJob));
  }

  const applyTheme = (nextFinish: MaterialFinish, nextWireframe: boolean) => {
    const wallHex = nextFinish.partFinishes?.primary.hex || spec.shell.wallColorHex;
    const floorHex = nextFinish.partFinishes?.secondary.hex || spec.shell.floorTintHex;
    const accentHex = nextFinish.partFinishes?.accent.hex || spec.shell.cabinetPrimaryHex || spec.shell.accentWallColorHex;

    mats.wallMat.color.set(wallHex);
    mats.cabinetPrimaryMat.color.set(accentHex);
    if (!mats.accentWallMat.map) {
      mats.accentWallMat.color.set(accentHex);
    }
    // Tint floor subtly relative to base texture without darkening pure white textures into mud
    const baseFloorCol = new THREE.Color(spec.shell.floorTintHex);
    const nextFloorCol = new THREE.Color(floorHex);
    const tintR = Math.min(1.25, Math.max(0.65, nextFloorCol.r / Math.max(0.15, baseFloorCol.r)));
    const tintG = Math.min(1.25, Math.max(0.65, nextFloorCol.g / Math.max(0.15, baseFloorCol.g)));
    const tintB = Math.min(1.25, Math.max(0.65, nextFloorCol.b / Math.max(0.15, baseFloorCol.b)));
    mats.floorMat.color.setRGB(tintR, tintG, tintB);

    root.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const list = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of list) {
          if (m instanceof THREE.MeshStandardMaterial) {
            m.wireframe = nextWireframe;
          }
        }
      }
    });
  };

  const dispose = () => {
    disposeShell();
    for (const d of subDisposers) {
      try {
        d();
      } catch {}
    }
  };

  return { group: root, dispose, applyTheme };
}
