import * as THREE from 'three';
import type { ArchitecturalAsset, MaterialFinish, PatternVariant } from '../lib/catalogTypes';
import {
  createAnatoliaRugTexture,
  createFabricBumpTexture,
  createPorcelainWallTileTexture,
  createWoodGrainTexture,
} from './proceduralTextures';
import {
  buildLaundryCabinetMesh,
  isLaundryCabinetArchetype,
} from './laundryCabinetBuilder';
import {
  buildTurkishGapMesh,
  isTurkishGapArchetype,
} from './turkishArchitecturalBuilder';

function createRoundedBoxGeometry(
  width: number,
  height: number,
  depth: number,
  radius = 0.04,
): THREE.ExtrudeGeometry {
  const r = Math.min(radius, width * 0.42, height * 0.42);
  const shape = new THREE.Shape();
  const hw = width / 2;
  const hh = height / 2;
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);

  const extrudeDepth = Math.max(0.01, depth - r * 2);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: extrudeDepth,
    bevelEnabled: true,
    bevelThickness: r,
    bevelSize: r,
    bevelSegments: 4,
    curveSegments: 8,
  });
  geo.center();
  return geo;
}

/**
 * Generates an exact architectural D-shaped 2D contour (flat back against wall at -Z,
 * parallel straight sides, smooth semicircular front nose at +Z) used for modern
 * European/Turkish wall-hung rimless toilets (VitrA Sento / S50 / Duravit Starck).
 */
function sampleDContourPoint(
  t: number, // 0..1 around closed D-loop
  halfW: number,
  backZ: number,
  frontZ: number,
): [number, number] {
  // Split parameter into 4 clean segments:
  // [0.00..0.20]: back wall edge (-halfW -> +halfW at backZ)
  // [0.20..0.40]: right straight side (backZ -> noseStartZ at +halfW)
  // [0.40..0.80]: front semicircular nose (angle 0 -> PI around center (0, noseStartZ))
  // [0.80..1.00]: left straight side (noseStartZ -> backZ at -halfW)
  const noseR = Math.min(halfW, (frontZ - backZ) * 0.52);
  const noseCenterZ = frontZ - noseR;

  if (t < 0.2) {
    const u = t / 0.2;
    return [-halfW + u * (halfW * 2), backZ];
  }
  if (t < 0.4) {
    const u = (t - 0.2) / 0.2;
    return [halfW, backZ + u * (noseCenterZ - backZ)];
  }
  if (t < 0.8) {
    const u = (t - 0.4) / 0.4;
    const angle = u * Math.PI; // 0 (right) -> PI/2 (front +Z) -> PI (left)
    return [Math.cos(angle) * halfW, noseCenterZ + Math.sin(angle) * noseR];
  }
  const u = (t - 0.8) / 0.2;
  return [-halfW, noseCenterZ - u * (noseCenterZ - backZ)];
}

/**
 * Builds a single continuous, smooth lofted ceramic wall-hung toilet shell
 * (zero boxy seams!) with an anatomically curved lower underbelly, flat rear wall-mount
 * flush plane, and genuine recessed inner rimless bowl cavity.
 */
function createRimlessDToiletBodyGeometry(
  width: number,
  depth: number,
  height: number,
): THREE.BufferGeometry {
  const segs = 64;
  // Cross-section stations from bottom underbelly -> outer rim -> inner rimless funnel
  interface RingSpec {
    y: number;
    halfW: number;
    backZ: number;
    frontZ: number;
  }

  const hw = width / 2;
  const bz = -depth / 2;
  const fz = depth / 2;

  const rings: RingSpec[] = [
    // Bottom closed center underbelly (floating cleanly at y=0 of local body)
    { y: 0.0, halfW: 0.005, backZ: bz + 0.04, frontZ: bz + 0.14 },
    { y: 0.005, halfW: hw * 0.56, backZ: bz + 0.015, frontZ: bz + depth * 0.48 },
    { y: height * 0.08, halfW: hw * 0.72, backZ: bz, frontZ: bz + depth * 0.62 },
    { y: height * 0.22, halfW: hw * 0.84, backZ: bz, frontZ: bz + depth * 0.76 },
    { y: height * 0.40, halfW: hw * 0.92, backZ: bz, frontZ: bz + depth * 0.88 },
    { y: height * 0.60, halfW: hw * 0.97, backZ: bz, frontZ: bz + depth * 0.96 },
    { y: height * 0.78, halfW: hw * 0.995, backZ: bz, frontZ: fz - 0.004 },
    { y: height * 0.93, halfW: hw, backZ: bz, frontZ: fz },
    // Softly rolled top outer rim bevel
    { y: height * 0.985, halfW: hw * 0.985, backZ: bz + 0.004, frontZ: fz - 0.005 },
    { y: height, halfW: hw * 0.94, backZ: bz + 0.012, frontZ: fz - 0.014 },
    // Inner rimless bowl lip curving smoothly down into concave ceramic funnel
    { y: height * 0.985, halfW: hw * 0.84, backZ: bz + 0.11, frontZ: fz - 0.032 },
    { y: height * 0.86, halfW: hw * 0.76, backZ: bz + 0.13, frontZ: fz - 0.055 },
    { y: height * 0.62, halfW: hw * 0.58, backZ: bz + 0.15, frontZ: fz - 0.11 },
    { y: height * 0.38, halfW: hw * 0.34, backZ: bz + 0.16, frontZ: bz + depth * 0.56 },
    { y: height * 0.24, halfW: 0.045, backZ: bz + 0.17, frontZ: bz + 0.26 },
    { y: height * 0.22, halfW: 0.005, backZ: bz + 0.19, frontZ: bz + 0.22 },
  ];

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let r = 0; r < rings.length; r++) {
    const ring = rings[r];
    const vCoord = r / (rings.length - 1);
    for (let s = 0; s <= segs; s++) {
      const uCoord = s / segs;
      const [x, z] = sampleDContourPoint(uCoord % 1, ring.halfW, ring.backZ, ring.frontZ);
      positions.push(x, ring.y, z);
      uvs.push(uCoord, vCoord);
    }
  }

  const stride = segs + 1;
  for (let r = 0; r < rings.length - 1; r++) {
    for (let s = 0; s < segs; s++) {
      const a = r * stride + s;
      const b = a + 1;
      const c = (r + 1) * stride + s;
      const d = c + 1;
      // Outward-facing winding for the ceramic loft
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds an exact D-shaped contoured slim soft-close lid or seat ring
 * matching the ceramic rim profile 1-to-1 (never a boxy square!).
 */
function createDShapeExtrudedPlate(
  width: number,
  depth: number,
  thickness: number,
  bevel = 0.005,
  hollowCenter = false,
): THREE.BufferGeometry {
  const hw = width / 2;
  const bz = -depth / 2;
  const fz = depth / 2;
  const noseR = Math.min(hw, depth * 0.5);
  const noseCenterZ = fz - noseR;
  const cornerR = 0.022;

  // Shape in XY where shape.x = world X, shape.y = world -Z (after rotateX(-PI/2))
  const shape = new THREE.Shape();
  shape.moveTo(-hw + cornerR, -bz);
  shape.lineTo(hw - cornerR, -bz);
  shape.quadraticCurveTo(hw, -bz, hw, -bz - cornerR);
  shape.lineTo(hw, -noseCenterZ);
  shape.absarc(0, -noseCenterZ, noseR, 0, -Math.PI, true);
  shape.lineTo(-hw, -bz - cornerR);
  shape.quadraticCurveTo(-hw, -bz, -hw + cornerR, -bz);

  if (hollowCenter) {
    const hole = new THREE.Path();
    const ihw = hw * 0.64;
    const ibz = bz + 0.115;
    const ifz = fz - 0.055;
    const inoseR = ihw;
    const inoseCenterZ = ifz - inoseR;
    hole.moveTo(-ihw, -ibz);
    hole.lineTo(ihw, -ibz);
    hole.lineTo(ihw, -inoseCenterZ);
    hole.absarc(0, -inoseCenterZ, inoseR, 0, -Math.PI, true);
    hole.lineTo(-ihw, -ibz);
    shape.holes.push(hole);
  }

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.004, thickness - bevel * 2),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 28,
  });
  // Rotate so extrude depth runs upward along +Y, back sits at -Z, rounded nose points to +Z
  geo.rotateX(-Math.PI / 2);
  return geo;
}

export interface BuiltAssetModel {
  group: THREE.Group;
  dispose: () => void;
}

export function buildArchitecturalAssetMesh(
  asset: ArchitecturalAsset,
  finish: MaterialFinish,
  options: {
    isSoftwareGl: boolean;
    maxAnisotropy: number;
    wireframe?: boolean;
    pattern?: PatternVariant;
  },
): BuiltAssetModel {
  if (isLaundryCabinetArchetype(asset.archetype)) {
    return buildLaundryCabinetMesh(asset, finish, options);
  }
  if (isTurkishGapArchetype(asset.archetype)) {
    return buildTurkishGapMesh(asset, finish, options);
  }

  const group = new THREE.Group();
  group.name = asset.slug || asset.id;

  const texturesToDispose: THREE.Texture[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometriesToDispose.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    if (options.wireframe && 'wireframe' in m) {
      (m as unknown as { wireframe: boolean }).wireframe = true;
    }
    materialsToDispose.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    texturesToDispose.push(t);
    return t;
  };

  const w = asset.dimensionsCm.width / 100;
  const d = asset.dimensionsCm.depth / 100;
  const h = asset.dimensionsCm.height / 100;
  const pattern = options.pattern;
  const roughDelta = pattern?.roughnessDelta ?? 0;

  const enableShadows = (mesh: THREE.Mesh) => {
    mesh.castShadow = !options.isSoftwareGl;
    mesh.receiveShadow = !options.isSoftwareGl;
    return mesh;
  };

  if (asset.archetype === 'wall_hung_toilet') {
    // === RE-ENGINEERED ARCHITECTURAL VITRA SENTO / GEBERIT SIGMA WALL-HUNG TOILET ===
    const wallTex = createPorcelainWallTileTexture(options.maxAnisotropy);
    trackTex(wallTex.map);
    trackTex(wallTex.bumpMap);

    const effectiveRoughness = THREE.MathUtils.clamp(finish.roughness + roughDelta, 0.04, 0.55);
    const matCeramic = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: finish.primaryHex,
        roughness: effectiveRoughness,
        metalness: finish.metalness,
        clearcoat: effectiveRoughness < 0.2 ? 0.95 : 0.2,
        clearcoatRoughness: 0.08,
        side: THREE.DoubleSide,
      }),
    );
    const matLid = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: finish.primaryHex,
        roughness: Math.max(0.05, effectiveRoughness + 0.03),
        metalness: 0.01,
        clearcoat: effectiveRoughness < 0.2 ? 0.85 : 0.15,
        clearcoatRoughness: 0.1,
      }),
    );
    const matChrome = trackMat(
      new THREE.MeshStandardMaterial({
        color: finish.secondaryHex,
        roughness: finish.secondaryHex.toLowerCase() === '#22252a' ? 0.34 : 0.14,
        metalness: finish.secondaryHex.toLowerCase() === '#22252a' ? 0.72 : 0.94,
      }),
    );
    const matPlateTrim = trackMat(
      new THREE.MeshStandardMaterial({
        color: finish.accentHex,
        roughness: 0.45,
        metalness: 0.4,
      }),
    );
    const matWallTile = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: wallTex.map,
        bumpMap: wallTex.bumpMap,
        bumpScale: 0.004,
        roughness: 0.72,
        metalness: 0.02,
      }),
    );

    const mountY = (asset.dimensionsCm.mountHeight ?? 41) / 100; // Rim top at +41 cm
    const bodyBottomY = Math.max(0.09, mountY - h); // +10 cm clean floating floor clearance
    const wallFaceZ = -d / 2;

    // 1. Compact architectural porcelain wall slab (2x2 large-format tiles) so toilet commands the viewport
    const wallSlab = enableShadows(
      new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.02, 1.28, 0.075)), matWallTile),
    );
    wallSlab.position.set(0, 0.64, wallFaceZ - 0.0375);
    group.add(wallSlab);

    // 2. Single continuous lofted D-shaped rimless ceramic toilet shell (flush against wall, floating above floor)
    const ceramicBodyGeo = trackGeo(createRimlessDToiletBodyGeometry(w, d, h));
    const ceramicBody = enableShadows(new THREE.Mesh(ceramicBodyGeo, matCeramic));
    ceramicBody.position.set(0, bodyBottomY, 0);
    group.add(ceramicBody);

    // 3. Tiny rear seat rubber buffers (creates realistic architectural shadow line under slim seat)
    const matBumper = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#b8bec8',
        roughness: 0.85,
        metalness: 0.0,
      }),
    );
    const bumperGeo = trackGeo(new THREE.CylinderGeometry(0.009, 0.009, 0.004, 12));
    for (const sx of [-1, 1]) {
      for (const zPos of [-0.04, 0.12]) {
        const bumper = new THREE.Mesh(bumperGeo, matBumper);
        bumper.position.set(sx * (w * 0.36), mountY + 0.002, zPos);
        group.add(bumper);
      }
    }

    // 5. Contoured D-shaped slim soft-close seat ring (exact match to ceramic rim!)
    const seatRingGeo = trackGeo(createDShapeExtrudedPlate(w * 0.985, d * 0.96, 0.014, 0.0038, true));
    const seatRing = enableShadows(new THREE.Mesh(seatRingGeo, matLid));
    seatRing.position.set(0, mountY + 0.004, 0.004);
    group.add(seatRing);

    // 6. Contoured D-shaped wrap-over slim soft-close top lid with subtle reveal gap
    const topLidGeo = trackGeo(createDShapeExtrudedPlate(w * 0.992, d * 0.955, 0.015, 0.0045, false));
    const topLid = enableShadows(new THREE.Mesh(topLidGeo, matLid));
    topLid.position.set(0, mountY + 0.021, 0.002);
    group.add(topLid);

    // 7. Brushed chrome soft-close rear hinge pins & damper bar (tucked cleanly behind lid edge)
    const hingeBarGeo = trackGeo(new THREE.CylinderGeometry(0.0065, 0.0065, w * 0.46, 16));
    hingeBarGeo.rotateZ(Math.PI / 2);
    const hingeBar = enableShadows(new THREE.Mesh(hingeBarGeo, matChrome));
    hingeBar.position.set(0, mountY + 0.014, wallFaceZ + 0.036);
    group.add(hingeBar);

    for (const sx of [-1, 1]) {
      const hingeCap = enableShadows(
        new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.011, 0.012, 0.016, 16)), matChrome),
      );
      hingeCap.position.set(sx * (w * 0.22), mountY + 0.009, wallFaceZ + 0.036);
      group.add(hingeCap);
    }

    // 8. Recessed Geberit Sigma Dual-Flush Actuator Wall Plate (+98 cm centerline)
    const plateY = 0.98;
    const plateOuter = enableShadows(
      new THREE.Mesh(trackGeo(createRoundedBoxGeometry(0.246, 0.164, 0.012, 0.004)), matChrome),
    );
    plateOuter.position.set(0, plateY, wallFaceZ + 0.006);
    group.add(plateOuter);

    const plateRecess = new THREE.Mesh(
      trackGeo(createRoundedBoxGeometry(0.214, 0.132, 0.006, 0.003)),
      matPlateTrim,
    );
    plateRecess.position.set(0, plateY, wallFaceZ + 0.01);
    group.add(plateRecess);

    // Large 6L flush actuator button (left) + Eco 3L flush button (right)
    const btnBig = enableShadows(
      new THREE.Mesh(trackGeo(createRoundedBoxGeometry(0.108, 0.096, 0.009, 0.003)), matChrome),
    );
    btnBig.position.set(-0.042, plateY, wallFaceZ + 0.014);
    group.add(btnBig);

    const btnEco = enableShadows(
      new THREE.Mesh(trackGeo(createRoundedBoxGeometry(0.066, 0.096, 0.009, 0.003)), matChrome),
    );
    btnEco.position.set(0.056, plateY, wallFaceZ + 0.014);
    group.add(btnEco);
  } else if (asset.archetype === 'modern_rug') {
    // === UV-FIXED 1024px HIGH-LOW RELIEF ANATOLIA RUG + 192 PHYSICAL 3D TASSELS ===
    const rugTex = createAnatoliaRugTexture(
      finish.primaryHex,
      finish.secondaryHex,
      finish.accentHex,
      options.maxAnisotropy,
      pattern?.id ?? 'geometric_relief',
    );
    trackTex(rugTex.map);
    trackTex(rugTex.bumpMap);

    const matRugTop = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: rugTex.map,
        bumpMap: rugTex.bumpMap,
        bumpScale: pattern?.bumpScale ?? 0.032,
        roughness: THREE.MathUtils.clamp(finish.roughness + roughDelta, 0.82, 0.99),
        metalness: 0.0,
      }),
    );
    const matEdge = trackMat(
      new THREE.MeshStandardMaterial({
        color: finish.secondaryHex,
        roughness: 0.95,
        metalness: 0.0,
      }),
    );
    const matTassel = trackMat(
      new THREE.MeshStandardMaterial({
        color: finish.primaryHex,
        roughness: 0.96,
        metalness: 0.0,
      }),
    );

    // 1. Clean BoxGeometry gives EXACT 0..1 UVs across 100% of the 200x290 cm top face!
    const rugThickness = 0.018;
    const rugBodyGeo = trackGeo(new THREE.BoxGeometry(w, rugThickness, d));
    const rugMaterials = [matEdge, matEdge, matRugTop, matEdge, matEdge, matEdge];
    const rugBody = enableShadows(new THREE.Mesh(rugBodyGeo, rugMaterials));
    rugBody.position.set(0, rugThickness / 2, 0);
    group.add(rugBody);

    // 2. Tightly stitched overlock binding rails along the two 290 cm long sides
    const overlockGeo = trackGeo(new THREE.CylinderGeometry(0.0095, 0.0095, d, 10));
    overlockGeo.rotateX(Math.PI / 2);
    for (const sx of [-1, 1]) {
      const rail = enableShadows(new THREE.Mesh(overlockGeo, matEdge));
      rail.position.set(sx * (w / 2), rugThickness * 0.5, 0);
      group.add(rail);
    }

    // 3. 192 Physical 3D Knotted Cotton Fringe Tassels (püsküller) on BOTH short ends (96 per end!)
    const tasselsPerEnd = 96;
    const totalTassels = tasselsPerEnd * 2;
    const tasselGeo = trackGeo(new THREE.CylinderGeometry(0.0022, 0.0038, 0.048, 5));
    tasselGeo.rotateX(Math.PI / 2);

    const knotGeo = trackGeo(new THREE.SphereGeometry(0.0048, 6, 5));

    const tasselsMesh = new THREE.InstancedMesh(tasselGeo, matTassel, totalTassels);
    const knotsMesh = new THREE.InstancedMesh(knotGeo, matEdge, totalTassels);
    tasselsMesh.castShadow = !options.isSoftwareGl;
    tasselsMesh.receiveShadow = !options.isSoftwareGl;

    const dummy = new THREE.Object3D();
    const knotDummy = new THREE.Object3D();
    let idx = 0;
    for (const sz of [-1, 1]) {
      for (let i = 0; i < tasselsPerEnd; i++) {
        const u = (i + 0.5) / tasselsPerEnd;
        const x = -w * 0.49 + u * (w * 0.98);
        const seed = Math.sin(i * 19.37 + sz * 7.13);
        const lenScale = 0.88 + (seed * 0.5 + 0.5) * 0.26;
        const yaw = seed * 0.16;

        // Dip knot along the woven end hem
        knotDummy.position.set(x, 0.006, sz * (d / 2 + 0.004));
        knotDummy.scale.set(1, 0.85, 1.15);
        knotDummy.updateMatrix();
        knotsMesh.setMatrixAt(idx, knotDummy.matrix);

        // Organic splayed cotton yarn strand
        dummy.position.set(x + yaw * 0.012, 0.0045, sz * (d / 2 + 0.026 * lenScale));
        dummy.rotation.set(0, yaw, 0);
        dummy.scale.set(1, 0.72, lenScale);
        dummy.updateMatrix();
        tasselsMesh.setMatrixAt(idx, dummy.matrix);
        idx++;
      }
    }
    tasselsMesh.computeBoundingSphere();
    knotsMesh.computeBoundingSphere();
    group.add(knotsMesh);
    group.add(tasselsMesh);
  } else if (asset.archetype === 'towel_warmer') {
    const wallTex = createPorcelainWallTileTexture(options.maxAnisotropy);
    trackTex(wallTex.map);
    trackTex(wallTex.bumpMap);

    const matMetal = trackMat(
      new THREE.MeshStandardMaterial({
        color: finish.primaryHex,
        roughness: THREE.MathUtils.clamp(finish.roughness + roughDelta, 0.1, 0.65),
        metalness: finish.metalness,
      }),
    );
    const matValve = trackMat(
      new THREE.MeshStandardMaterial({
        color: finish.secondaryHex,
        roughness: Math.max(0.14, finish.roughness - 0.1),
        metalness: Math.min(0.98, finish.metalness + 0.15),
      }),
    );
    const matWallTile = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: wallTex.map,
        bumpMap: wallTex.bumpMap,
        bumpScale: 0.004,
        roughness: 0.74,
        metalness: 0.02,
      }),
    );

    const baseLift = 0.25;
    const centerY = baseLift + h / 2;

    const wallTile = enableShadows(
      new THREE.Mesh(trackGeo(new THREE.BoxGeometry(w + 0.62, h + 0.48, 0.06)), matWallTile),
    );
    wallTile.position.set(0, centerY, -0.075);
    group.add(wallTile);

    for (const sx of [-1, 1]) {
      const rail = enableShadows(
        new THREE.Mesh(trackGeo(createRoundedBoxGeometry(0.036, h, 0.036, 0.004)), matMetal),
      );
      rail.position.set(sx * (w / 2 - 0.018), centerY, 0.01);
      group.add(rail);
    }

    const barPositions = [
      -0.46, -0.4, -0.34, -0.28, -0.22,
      -0.06, 0.0, 0.06, 0.12,
      0.28, 0.34, 0.4, 0.46,
    ];
    const barGeo = trackGeo(createRoundedBoxGeometry(w - 0.04, 0.038, 0.016, 0.003));
    for (const relY of barPositions) {
      const bar = enableShadows(new THREE.Mesh(barGeo, matMetal));
      bar.position.set(0, centerY + relY * h, 0.012);
      group.add(bar);
    }

    const bracketGeo = trackGeo(new THREE.CylinderGeometry(0.012, 0.012, 0.065, 16));
    bracketGeo.rotateX(Math.PI / 2);
    for (const sx of [-1, 1]) {
      for (const sy of [-0.41, 0.41]) {
        const bracket = enableShadows(new THREE.Mesh(bracketGeo, matValve));
        bracket.position.set(sx * (w / 2 - 0.018), centerY + sy * h, -0.025);
        group.add(bracket);
      }
      const valve = enableShadows(
        new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.075, 16)), matValve),
      );
      valve.position.set(sx * (w / 2 - 0.018), baseLift - 0.035, 0.01);
      group.add(valve);
    }
  } else if (asset.archetype === 'bioclimatic_pergola') {
    const matFrame = trackMat(
      new THREE.MeshStandardMaterial({
        color: finish.primaryHex,
        roughness: THREE.MathUtils.clamp(finish.roughness + roughDelta, 0.15, 0.7),
        metalness: finish.metalness,
      }),
    );
    const matLouvers = trackMat(
      new THREE.MeshStandardMaterial({
        color: finish.secondaryHex,
        roughness: Math.min(0.8, finish.roughness + 0.1),
        metalness: Math.max(0.2, finish.metalness - 0.1),
      }),
    );
    const matLed = trackMat(
      new THREE.MeshStandardMaterial({
        color: finish.accentHex,
        emissive: new THREE.Color(finish.accentHex),
        emissiveIntensity: 1.6,
        roughness: 0.2,
        metalness: 0.0,
      }),
    );

    const postSize = 0.14;
    const beamH = 0.22;
    const halfW = w / 2 - postSize / 2;
    const halfD = d / 2 - postSize / 2;

    const postGeo = trackGeo(new THREE.BoxGeometry(postSize, h, postSize));
    const footGeo = trackGeo(new THREE.BoxGeometry(postSize + 0.06, 0.02, postSize + 0.06));
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const post = enableShadows(new THREE.Mesh(postGeo, matFrame));
        post.position.set(sx * halfW, h / 2, sz * halfD);
        group.add(post);

        const foot = enableShadows(new THREE.Mesh(footGeo, matLouvers));
        foot.position.set(sx * halfW, 0.01, sz * halfD);
        group.add(foot);
      }
    }

    const frontBackBeamGeo = trackGeo(new THREE.BoxGeometry(w, beamH, 0.16));
    for (const sz of [-1, 1]) {
      const beam = enableShadows(new THREE.Mesh(frontBackBeamGeo, matFrame));
      beam.position.set(0, h - beamH / 2, sz * halfD);
      group.add(beam);
    }
    const leftRightBeamGeo = trackGeo(new THREE.BoxGeometry(0.16, beamH, d));
    for (const sx of [-1, 1]) {
      const beam = enableShadows(new THREE.Mesh(leftRightBeamGeo, matFrame));
      beam.position.set(sx * halfW, h - beamH / 2, 0);
      group.add(beam);
    }

    const slatCount = 14;
    const slatGeo = trackGeo(new THREE.BoxGeometry(w - 0.3, 0.026, 0.115));
    const slats = new THREE.InstancedMesh(slatGeo, matLouvers, slatCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < slatCount; i++) {
      const t = i / (slatCount - 1);
      const z = -halfD + 0.24 + t * (d - 0.48);
      dummy.position.set(0, h - 0.06, z);
      dummy.rotation.set(0.48, 0, 0);
      dummy.updateMatrix();
      slats.setMatrixAt(i, dummy.matrix);
    }
    slats.computeBoundingSphere();
    group.add(slats);

    const ledFrontBack = trackGeo(new THREE.BoxGeometry(w - 0.36, 0.018, 0.022));
    for (const sz of [-1, 1]) {
      const strip = new THREE.Mesh(ledFrontBack, matLed);
      strip.position.set(0, h - beamH + 0.012, sz * (halfD - 0.085));
      group.add(strip);
    }
    const ledLeftRight = trackGeo(new THREE.BoxGeometry(0.022, 0.018, d - 0.36));
    for (const sx of [-1, 1]) {
      const strip = new THREE.Mesh(ledLeftRight, matLed);
      strip.position.set(sx * (halfW - 0.085), h - beamH + 0.012, 0);
      group.add(strip);
    }
  } else {
    // Clean multi-part architectural fallback for web-discovered parametric items
    const fabricBump = trackTex(createFabricBumpTexture(options.maxAnisotropy));
    const woodTex = createWoodGrainTexture(finish.secondaryHex, options.maxAnisotropy);
    trackTex(woodTex.map);
    trackTex(woodTex.bumpMap);

    const matPrimary = trackMat(
      new THREE.MeshStandardMaterial({
        color: finish.primaryHex,
        roughness: THREE.MathUtils.clamp(finish.roughness + roughDelta, 0.1, 0.98),
        metalness: finish.metalness,
        bumpMap: finish.materialKind === 'fabric' || finish.materialKind === 'linen' ? fabricBump : undefined,
        bumpScale: 0.008,
      }),
    );
    const matSecondary = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: woodTex.map,
        bumpMap: woodTex.bumpMap,
        bumpScale: 0.004,
        roughness: 0.44,
        metalness: 0.08,
      }),
    );
    const matAccent = trackMat(
      new THREE.MeshStandardMaterial({
        color: finish.accentHex,
        roughness: 0.25,
        metalness: 0.72,
      }),
    );

    if (asset.archetype === 'dining_table') {
      const top = enableShadows(
        new THREE.Mesh(trackGeo(createRoundedBoxGeometry(w, 0.05, d, 0.02)), matPrimary),
      );
      top.position.set(0, h - 0.025, 0);
      group.add(top);
      for (const sx of [-1, 1]) {
        const col = enableShadows(
          new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.14, 0.22, h - 0.05, 28)), matSecondary),
        );
        col.position.set(sx * (w * 0.28), (h - 0.05) / 2, 0);
        group.add(col);
      }
    } else if (asset.archetype === 'vanity_cabinet') {
      const cabinet = enableShadows(
        new THREE.Mesh(trackGeo(createRoundedBoxGeometry(w, h * 0.62, d, 0.015)), matSecondary),
      );
      cabinet.position.set(0, h * 0.46, 0);
      group.add(cabinet);
      const counter = enableShadows(
        new THREE.Mesh(trackGeo(createRoundedBoxGeometry(w + 0.02, 0.035, d + 0.02, 0.008)), matPrimary),
      );
      counter.position.set(0, h * 0.79, 0);
      group.add(counter);
      const basin = enableShadows(
        new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.22, 0.16, 0.14, 32)), matPrimary),
      );
      basin.position.set(0, h * 0.79 + 0.08, 0.03);
      group.add(basin);
      const faucetStem = enableShadows(
        new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.016, 0.02, 0.24, 16)), matAccent),
      );
      faucetStem.position.set(0, h * 0.79 + 0.12, -d * 0.34);
      group.add(faucetStem);
    } else if (asset.archetype === 'floor_lamp') {
      const base = enableShadows(
        new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.18, 0.19, 0.04, 32)), matSecondary),
      );
      base.position.set(0, 0.02, 0);
      group.add(base);
      const pole = enableShadows(
        new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.014, 0.018, h - 0.26, 16)), matAccent),
      );
      pole.position.set(0, (h - 0.26) / 2 + 0.04, 0);
      group.add(pole);
      const matGlobe = trackMat(
        new THREE.MeshStandardMaterial({
          color: '#FFF6E6',
          emissive: new THREE.Color('#FFE5BA'),
          emissiveIntensity: 1.2,
          roughness: 0.2,
          metalness: 0.0,
        }),
      );
      const globe = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.16, 28, 20)), matGlobe);
      globe.position.set(0, h - 0.16, 0);
      group.add(globe);
    } else {
      const legGeo = trackGeo(new THREE.CylinderGeometry(0.02, 0.016, 0.22, 14));
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          const leg = enableShadows(new THREE.Mesh(legGeo, matSecondary));
          leg.position.set(sx * (w * 0.36), 0.11, sz * (d * 0.34));
          group.add(leg);
        }
      }
      const seat = enableShadows(
        new THREE.Mesh(trackGeo(createRoundedBoxGeometry(w * 0.88, 0.18, d * 0.84, 0.06)), matPrimary),
      );
      seat.position.set(0, 0.31, 0.02);
      group.add(seat);
      const backrest = enableShadows(
        new THREE.Mesh(trackGeo(createRoundedBoxGeometry(w * 0.84, h * 0.54, 0.2, 0.07)), matPrimary),
      );
      backrest.position.set(0, h * 0.65, -d * 0.32);
      backrest.rotation.x = -0.14;
      group.add(backrest);
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
