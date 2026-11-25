import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type {
  ArchitecturalAsset,
  MaterialFinish,
  MultiPartFinishSpec,
  PartMaterialSpec,
  PatternVariant,
  RetailComboRole,
} from '../lib/catalogTypes';
import type { BuiltAssetModel } from './assetMeshBuilder';
import { getArchitecturalSurfaceTextureSet } from './proceduralTextures';

const sharedLoader = new GLTFLoader();
sharedLoader.setCrossOrigin('anonymous');

/**
 * Compatibility plugin for legacy glTF 2.0 assets declaring `KHR_materials_pbrSpecularGlossiness`
 * (removed in Three.js r150+). Converts diffuse/specular/glossiness into MeshStandardMaterial PBR
 * so legacy Objaverse models (e.g. chrome towel rails, hooks, staircases) load without errors.
 */
sharedLoader.register((parser) => ({
  name: 'KHR_materials_pbrSpecularGlossiness',
  getMaterialType() {
    return THREE.MeshStandardMaterial;
  },
  extendMaterialParams(materialIndex: number, materialParams: Record<string, unknown>) {
    const materialDef = parser.json.materials?.[materialIndex];
    const ext = materialDef?.extensions?.KHR_materials_pbrSpecularGlossiness as
      | {
          diffuseFactor?: number[];
          diffuseTexture?: { index: number; texCoord?: number };
          specularFactor?: number[];
          glossinessFactor?: number;
        }
      | undefined;
    if (!ext) return Promise.resolve();

    const pending: Array<Promise<unknown>> = [];
    if (Array.isArray(ext.diffuseFactor)) {
      const [r = 1, g = 1, b = 1, a = 1] = ext.diffuseFactor;
      materialParams.color = new THREE.Color(r, g, b);
      materialParams.opacity = a;
      if (a < 0.999) {
        materialParams.transparent = true;
      }
    }
    if (ext.diffuseTexture) {
      pending.push(
        parser.assignTexture(materialParams, 'map', ext.diffuseTexture, THREE.SRGBColorSpace),
      );
    }
    const glossiness = typeof ext.glossinessFactor === 'number' ? ext.glossinessFactor : 0.85;
    materialParams.roughness = THREE.MathUtils.clamp(1.0 - glossiness * 0.85, 0.08, 0.96);

    if (Array.isArray(ext.specularFactor)) {
      const maxSpec = Math.max(
        ext.specularFactor[0] ?? 0,
        ext.specularFactor[1] ?? 0,
        ext.specularFactor[2] ?? 0,
      );
      materialParams.metalness =
        maxSpec > 0.5 ? THREE.MathUtils.clamp((maxSpec - 0.3) * 1.25, 0.25, 0.94) : 0.08;
    } else {
      materialParams.metalness = 0.22;
    }

    return Promise.all(pending);
  },
}));

/**
 * Resolves ABO and Hugging Face proxy paths directly to their CORS-enabled CDN origins
 * so 30–65 MB high-resolution GLBs stream directly to the browser without hitting Cloud Run's
 * 32 MiB proxy response limit or incurring an extra server hop.
 */
export function resolveDirectGlbUrl(rawUrl: string): string {
  const aboMatch = rawUrl.match(/^\/api\/v1\/abo\/glb\/([0-9a-zA-Z])\/([A-Z0-9_-]{4,28}\.glb)$/i);
  if (aboMatch) {
    return `https://amazon-berkeley-objects.s3.amazonaws.com/3dmodels/original/${aboMatch[1]}/${aboMatch[2]}`;
  }
  const hfMatch = rawUrl.match(
    /^\/api\/v1\/hf\/glb\/(usdcraft-glb|simready-glb|objaverse-clean-glb)\/([a-zA-Z0-9_-]{2,96})$/,
  );
  if (hfMatch) {
    return `https://huggingface.co/datasets/codepawl/${hfMatch[1]}/resolve/main/engine/${hfMatch[2]}/${hfMatch[2]}.glb`;
  }
  return rawUrl;
}

interface StoredMaterialBaseline {
  color: THREE.Color;
  map: THREE.Texture | null;
  bumpMap: THREE.Texture | null;
  bumpScale: number;
  roughnessMap: THREE.Texture | null;
  metalnessMap: THREE.Texture | null;
  roughness: number;
  metalness: number;
  normalScale: THREE.Vector2;
  envMapIntensity: number;
  transparent: boolean;
  opacity: number;
  depthWrite: boolean;
  transmission: number;
  sheen: number;
  sheenColor: THREE.Color | null;
  sheenColorMap: THREE.Texture | null;
  luma: number;
  matName: string;
  meshName: string;
  isGlassOrMirror: boolean;
  isWaterOrIndicator: boolean;
  isBrightCeramic: boolean;
  isOriginalMetal: boolean;
  isDarkRubber: boolean;
  isBotanicalFoliage: boolean;
}

interface MaterialSpatialStats {
  mat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;
  base: StoredMaterialBaseline;
  relMinY: number;
  relMaxY: number;
  relHeight: number;
  relVolume: number;
  meshCount: number;
}

const GLASS_OR_MIRROR_RE = /glass|cam\b|mirror|ayna|lens|crystal|clear_glass|frosted/i;
const WATER_OR_INDICATOR_RE =
  /water|bath_water|emission|emissive|indicator|plastic__red|plastic__blue|hot_dot|cold_dot|logo|glow/i;
const RUBBER_OR_SEAL_RE = /rubber|gasket|seal|silicone|nozzle|aerator|embeddedmaterial/i;
const METAL_NAME_RE =
  /chrome|metal|steel|brass|gold|iron|nickel|gunmetal|pivot|hinge|handle|kulp|knob|faucet|tap|drain|sifon|pipe|valve|vana|dial|pump|pompa|bracket|bolt|screw|ring|lock|rail|track/i;
const CERAMIC_OR_TOP_NAME_RE =
  /ceramic|porcelain|sink|basin|lavabo|acrylic|tray|tekne|marble|mermer|stone|traverten|counter|top|paper|roll|towel|havlu/i;
const LEG_OR_WOOD_NAME_RE =
  /wood|oak|walnut|ceviz|mese|bamboo|bambu|leg|foot|base|frame|ayak|iskelet|plinth|cabinet|floor|parke|door/i;
const SEAT_OR_LID_NAME_RE = /plastic__glossy|seat|lid|kapak|cover|knob_polymer/i;
const FOLIAGE_NAME_RE =
  /leaf|leaves|foliage|branch|stem|fern|palm|cactus|succulent|flower|petal|soil|dirt|earth|bark|moss|yaprak|toprak|ivy|bush|tree|frond|twig|needle/i;
const POT_OR_PLANTER_RE =
  /(?:^|[_\-\s])(pot|planter|vase|bowl|saksi|vazo|stand|basket|ceramic|terracotta|concrete|base)(?:$|[_\-\s\d])/i;
const BEDDING_NAME_RE =
  /mattress|sheet|pillow|blanket|duvet|bedding|quilt|yorgan|yastik|carsaf|nevresim|cloth|fabric_white|linen_white/i;
const LAMP_SHADE_RE =
  /shade|abajur|opal|globe|bulb|diffuser|lamp_glass|lampshade|fabric|linen|paper|parchment|frosted|glow|emissive/i;
const APPLIANCE_PANEL_RE =
  /screen|display|panel|bezel|door_glass|control|window|drum|button|grill|vent|black_glass|dark_glass/i;

function parseHexToRgbBytes(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? `${clean[0]}${clean[0]}${clean[1]}${clean[1]}${clean[2]}${clean[2]}`
      : clean.padEnd(6, '0').slice(0, 6);
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) return [230, 224, 214];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Generates and caches a 3-color interior-design remapped PBR diffuse texture for woven rugs.
 * Preserves 100% of the original geometric motifs, borders, weave knots, and pile micro-texture.
 */
function getOrCreateTriToneRugTexture(
  sourceTex: THREE.Texture,
  primaryHex: string,
  secondaryHex: string,
  accentHex: string,
): THREE.Texture | null {
  const cacheKey = `${primaryHex.toUpperCase()}|${secondaryHex.toUpperCase()}|${accentHex.toUpperCase()}`;
  let cache = sourceTex.userData.__mimarTriToneCache as Map<string, THREE.Texture> | undefined;
  if (cache?.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const img = sourceTex.image as
    | HTMLImageElement
    | HTMLCanvasElement
    | ImageBitmap
    | { width?: number; height?: number }
    | undefined;
  if (!img || typeof document === 'undefined') return null;

  const w = Number((img as HTMLImageElement).naturalWidth || img.width || 0);
  const h = Number((img as HTMLImageElement).naturalHeight || img.height || 0);
  if (w < 4 || h < 4) return null;

  try {
    const targetW = Math.min(w, 1024);
    const targetH = Math.min(h, 1024);
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(img as CanvasImageSource, 0, 0, targetW, targetH);
    const imgData = ctx.getImageData(0, 0, targetW, targetH);
    const data = imgData.data;
    const pixelCount = targetW * targetH;

    const hist = new Uint32Array(256);
    const lumas = new Float32Array(pixelCount);

    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const l = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      lumas[p] = l;
      const bin = Math.min(255, Math.max(0, Math.round(l * 255)));
      hist[bin] += 1;
    }

    const p5Target = pixelCount * 0.05;
    const p68Target = pixelCount * 0.68;
    const p92Target = pixelCount * 0.92;
    let accum = 0;
    let p5 = 0.08;
    let p68 = 0.68;
    let p92 = 0.92;
    let foundP5 = false;
    let foundP68 = false;
    let foundP92 = false;

    for (let b = 0; b < 256; b++) {
      accum += hist[b];
      if (!foundP5 && accum >= p5Target) {
        p5 = b / 255;
        foundP5 = true;
      }
      if (!foundP68 && accum >= p68Target) {
        p68 = b / 255;
        foundP68 = true;
      }
      if (!foundP92 && accum >= p92Target) {
        p92 = b / 255;
        foundP92 = true;
        break;
      }
    }

    let gR = 0;
    let gG = 0;
    let gB = 0;
    let gCount = 0;
    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      if (lumas[p] >= p68) {
        gR += data[i] / 255;
        gG += data[i + 1] / 255;
        gB += data[i + 2] / 255;
        gCount += 1;
      }
    }
    if (gCount > 0) {
      gR /= gCount;
      gG /= gCount;
      gB /= gCount;
    } else {
      gR = gG = gB = 0.85;
    }

    let maxChroma = 0.08;
    const chromas = new Float32Array(pixelCount);
    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const dr = data[i] / 255 - gR;
      const dg = data[i + 1] / 255 - gG;
      const db = data[i + 2] / 255 - gB;
      const cd = Math.sqrt(dr * dr + dg * dg + db * db);
      chromas[p] = cd;
      if (cd > maxChroma) maxChroma = cd;
    }

    const lumaSpan = Math.max(p92 - p5, 0.045);
    const chromaNormDiv = Math.max(maxChroma * 0.78, 0.075);
    const [pR, pG, pB] = parseHexToRgbBytes(primaryHex);
    const [sR, sG, sB] = parseHexToRgbBytes(secondaryHex);
    const [aR, aG, aB] = parseHexToRgbBytes(accentHex);

    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const normL = Math.max(0, Math.min(1, (lumas[p] - p5) / lumaSpan));
      const normChroma = Math.max(0, Math.min(1, chromas[p] / chromaNormDiv));

      const rawMotif = Math.max(0, Math.min(1, (1 - normL) * 0.72 + normChroma * 0.48));
      const motif = Math.pow(rawMotif, 0.82);

      let outR: number;
      let outG: number;
      let outB: number;
      if (motif <= 0.14) {
        outR = pR;
        outG = pG;
        outB = pB;
      } else if (motif <= 0.62) {
        const u = (motif - 0.14) / 0.48;
        outR = pR + (sR - pR) * u;
        outG = pG + (sG - pG) * u;
        outB = pB + (sB - pB) * u;
      } else {
        const u = (motif - 0.62) / 0.38;
        outR = sR + (aR - sR) * u;
        outG = sG + (aG - sG) * u;
        outB = sB + (aB - sB) * u;
      }

      const yarnGrain = 0.84 + 0.16 * normL;
      data[i] = Math.max(0, Math.min(255, Math.round(outR * yarnGrain)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(outG * yarnGrain)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(outB * yarnGrain)));
    }

    ctx.putImageData(imgData, 0, 0);

    const triTex = new THREE.CanvasTexture(canvas);
    triTex.colorSpace = THREE.SRGBColorSpace;
    triTex.wrapS = sourceTex.wrapS;
    triTex.wrapT = sourceTex.wrapT;
    triTex.repeat.copy(sourceTex.repeat);
    triTex.offset.copy(sourceTex.offset);
    triTex.rotation = sourceTex.rotation;
    triTex.center.copy(sourceTex.center);
    triTex.flipY = sourceTex.flipY;
    triTex.anisotropy = sourceTex.anisotropy;
    triTex.needsUpdate = true;

    if (!cache) {
      cache = new Map<string, THREE.Texture>();
      sourceTex.userData.__mimarTriToneCache = cache;
    }
    if (cache.size >= 12) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey) {
        cache.get(oldestKey)?.dispose();
        cache.delete(oldestKey);
      }
    }
    cache.set(cacheKey, triTex);
    return triTex;
  } catch {
    return null;
  }
}

/**
 * Generates and caches a smart multi-zone PBR diffuse texture for single-material textured GLBs
 * (e.g. ABO sofas with wood/metal legs, coffee tables with marble/wood top + metal frame,
 * vanities with ceramic basin + wood cabinet, mirrors with glass + frame, single-atlas rooms).
 *
 * Uses optional metallicRoughnessTexture to isolate true metal/mirror pixels + fast 3-cluster
 * color segmentation on non-metal pixels so real-world retail combinations NEVER wash an
 * entire object into flat monochrome white or black!
 */
function getOrCreateMultiZonePartTexture(
  sourceTex: THREE.Texture,
  mrTex: THREE.Texture | null,
  parts: MultiPartFinishSpec,
  comboRole: RetailComboRole | undefined,
): THREE.Texture | null {
  const ceramicHex = parts.ceramic?.hex || '';
  const cacheKey = `${comboRole || 'std'}|${parts.primary.hex.toUpperCase()}|${parts.secondary.hex.toUpperCase()}|${parts.accent.hex.toUpperCase()}|${ceramicHex.toUpperCase()}`;
  let cache = sourceTex.userData.__mimarMultiZoneCache as Map<string, THREE.Texture> | undefined;
  if (cache?.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const img = sourceTex.image as
    | HTMLImageElement
    | HTMLCanvasElement
    | ImageBitmap
    | { width?: number; height?: number }
    | undefined;
  if (!img || typeof document === 'undefined') return null;

  const w = Number((img as HTMLImageElement).naturalWidth || img.width || 0);
  const h = Number((img as HTMLImageElement).naturalHeight || img.height || 0);
  if (w < 4 || h < 4) return null;

  try {
    const targetW = Math.min(w, 512);
    const targetH = Math.min(h, 512);
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(img as CanvasImageSource, 0, 0, targetW, targetH);
    const imgData = ctx.getImageData(0, 0, targetW, targetH);
    const data = imgData.data;

    // Optional metallicRoughness map sampling (glTF standard: G = roughness, B = metalness)
    let mrData: Uint8ClampedArray | null = null;
    if (mrTex && mrTex.image) {
      const mrImg = mrTex.image as { width?: number; height?: number };
      const mw = Number((mrImg as HTMLImageElement).naturalWidth || mrImg.width || 0);
      const mh = Number((mrImg as HTMLImageElement).naturalHeight || mrImg.height || 0);
      if (mw >= 4 && mh >= 4) {
        try {
          const mrCanvas = document.createElement('canvas');
          mrCanvas.width = targetW;
          mrCanvas.height = targetH;
          const mrCtx = mrCanvas.getContext('2d', { willReadFrequently: true });
          if (mrCtx) {
            mrCtx.drawImage(mrImg as CanvasImageSource, 0, 0, targetW, targetH);
            mrData = mrCtx.getImageData(0, 0, targetW, targetH).data;
          }
        } catch {
          mrData = null;
        }
      }
    }

    // Step 1: Sample a fast stride grid of non-metal pixels for 3-cluster color segmentation
    const step = Math.max(1, Math.floor(Math.sqrt((targetW * targetH) / 3600)));
    const samplesR: number[] = [];
    const samplesG: number[] = [];
    const samplesB: number[] = [];

    for (let y = 0; y < targetH; y += step) {
      for (let x = 0; x < targetW; x += step) {
        const idx = (y * targetW + x) * 4;
        if (data[idx + 3] < 20) continue;
        if (mrData && mrData[idx + 2] > 145) continue; // skip pure metal pixels for non-metal clustering
        const pr = data[idx] / 255;
        const pg = data[idx + 1] / 255;
        const pb = data[idx + 2] / 255;
        // On botanical plants, never pull green foliage into planter clustering
        if (comboRole === 'botanical_plant' && pg > pr * 1.07 && pg > pb * 1.07 && pg > 0.14) {
          continue;
        }
        samplesR.push(pr);
        samplesG.push(pg);
        samplesB.push(pb);
      }
    }

    const nSamples = samplesR.length;
    if (nSamples < 16) {
      return null;
    }

    // Seed 3 centroids deterministically: brightest, darkest, and most distant from both
    let brightIdx = 0;
    let darkIdx = 0;
    let bestBright = -1;
    let bestDark = 10;
    for (let s = 0; s < nSamples; s++) {
      const l = 0.299 * samplesR[s] + 0.587 * samplesG[s] + 0.114 * samplesB[s];
      if (l > bestBright) {
        bestBright = l;
        brightIdx = s;
      }
      if (l < bestDark) {
        bestDark = l;
        darkIdx = s;
      }
    }

    const cR = [samplesR[brightIdx], samplesR[darkIdx], 0.5];
    const cG = [samplesG[brightIdx], samplesG[darkIdx], 0.5];
    const cB = [samplesB[brightIdx], samplesB[darkIdx], 0.5];

    let farIdx = 0;
    let maxMinDist = -1;
    for (let s = 0; s < nSamples; s++) {
      const d0 =
        (samplesR[s] - cR[0]) ** 2 + (samplesG[s] - cG[0]) ** 2 + (samplesB[s] - cB[0]) ** 2;
      const d1 =
        (samplesR[s] - cR[1]) ** 2 + (samplesG[s] - cG[1]) ** 2 + (samplesB[s] - cB[1]) ** 2;
      const md = Math.min(d0, d1);
      if (md > maxMinDist) {
        maxMinDist = md;
        farIdx = s;
      }
    }
    cR[2] = samplesR[farIdx];
    cG[2] = samplesG[farIdx];
    cB[2] = samplesB[farIdx];

    // 6 iterations of lightweight 3-means
    const counts = [0, 0, 0];
    for (let iter = 0; iter < 6; iter++) {
      const sumR = [0, 0, 0];
      const sumG = [0, 0, 0];
      const sumB = [0, 0, 0];
      counts[0] = counts[1] = counts[2] = 0;

      for (let s = 0; s < nSamples; s++) {
        let bestK = 0;
        let bestD = Infinity;
        for (let k = 0; k < 3; k++) {
          const dr = samplesR[s] - cR[k];
          const dg = samplesG[s] - cG[k];
          const db = samplesB[s] - cB[k];
          const d = dr * dr + dg * dg + db * db;
          if (d < bestD) {
            bestD = d;
            bestK = k;
          }
        }
        sumR[bestK] += samplesR[s];
        sumG[bestK] += samplesG[s];
        sumB[bestK] += samplesB[s];
        counts[bestK] += 1;
      }

      for (let k = 0; k < 3; k++) {
        if (counts[k] > 0) {
          cR[k] = sumR[k] / counts[k];
          cG[k] = sumG[k] / counts[k];
          cB[k] = sumB[k] / counts[k];
        }
      }
    }

    // Build cluster descriptors sorted by area share
    const clusters = [0, 1, 2].map((k) => {
      const luma = 0.299 * cR[k] + 0.587 * cG[k] + 0.114 * cB[k];
      return {
        k,
        r: cR[k],
        g: cG[k],
        b: cB[k],
        luma,
        share: counts[k] / nSamples,
      };
    });

    const sortedByShare = [...clusters].sort((a, b) => b.share - a.share);
    const mainCluster = sortedByShare[0];
    const secCluster = sortedByShare[1];
    const thirdCluster = sortedByShare[2];

    const distMainSec = Math.sqrt(
      (mainCluster.r - secCluster.r) ** 2 +
        (mainCluster.g - secCluster.g) ** 2 +
        (mainCluster.b - secCluster.b) ** 2,
    );
    const distMainThird = Math.sqrt(
      (mainCluster.r - thirdCluster.r) ** 2 +
        (mainCluster.g - thirdCluster.g) ** 2 +
        (mainCluster.b - thirdCluster.b) ** 2,
    );

    const [pR, pG, pB] = parseHexToRgbBytes(parts.primary.hex);
    const [sR, sG, sB] = parseHexToRgbBytes(parts.secondary.hex);
    const [aR, aG, aB] = parseHexToRgbBytes(parts.accent.hex);
    const [cerR, cerG, cerB] = parseHexToRgbBytes(parts.ceramic?.hex || parts.secondary.hex);

    // Assign each cluster index (0, 1, 2) a target RGB color according to semantic product role
    const targetRgb: Array<[number, number, number]> = [
      [pR, pG, pB],
      [pR, pG, pB],
      [pR, pG, pB],
    ];

    const hasDistinctZones = distMainSec >= 0.13 && secCluster.share >= 0.04;

    if ((comboRole === 'vanity' || comboRole === 'laundry_cabinet') && hasDistinctZones) {
      // On bathroom/kitchen/laundry cabinets, keep the brightest cluster as ceramic basin/top and recolor cabinet body!
      const brightest = [...clusters].sort((a, b) => b.luma - a.luma)[0];
      const others = clusters.filter((c) => c.k !== brightest.k).sort((a, b) => b.share - a.share);
      if (brightest.luma > 0.68) {
        targetRgb[brightest.k] = [cerR, cerG, cerB];
        targetRgb[others[0].k] = [pR, pG, pB];
        targetRgb[others[1].k] = distMainThird >= 0.16 ? [aR, aG, aB] : [pR, pG, pB];
      } else {
        targetRgb[mainCluster.k] = [pR, pG, pB];
        targetRgb[secCluster.k] = [sR, sG, sB];
        targetRgb[thirdCluster.k] = [aR, aG, aB];
      }
    } else if (comboRole === 'bed_frame' && hasDistinctZones) {
      // On single-atlas beds, keep brightest cloth/mattress region crisp hotel white/ecru!
      const brightest = [...clusters].sort((a, b) => b.luma - a.luma)[0];
      const others = clusters.filter((c) => c.k !== brightest.k).sort((a, b) => b.share - a.share);
      if (brightest.luma > 0.58) {
        targetRgb[brightest.k] = [cerR, cerG, cerB];
        targetRgb[others[0].k] = [pR, pG, pB];
        targetRgb[others[1].k] = [sR, sG, sB];
      } else {
        targetRgb[mainCluster.k] = [pR, pG, pB];
        targetRgb[secCluster.k] = [sR, sG, sB];
        targetRgb[thirdCluster.k] = [aR, aG, aB];
      }
    } else if (comboRole === 'lighting_fixture' && hasDistinctZones) {
      // On single-atlas floor/table lamps & sconces, brightest shade/diffuser stays warm opal/cream!
      const brightest = [...clusters].sort((a, b) => b.luma - a.luma)[0];
      const others = clusters.filter((c) => c.k !== brightest.k).sort((a, b) => b.share - a.share);
      if (brightest.luma > 0.56) {
        targetRgb[brightest.k] = [cerR, cerG, cerB];
        targetRgb[others[0].k] = [pR, pG, pB];
        targetRgb[others[1].k] = [aR, aG, aB];
      } else {
        targetRgb[mainCluster.k] = [pR, pG, pB];
        targetRgb[secCluster.k] = [sR, sG, sB];
        targetRgb[thirdCluster.k] = [aR, aG, aB];
      }
    } else if (comboRole === 'appliance' && hasDistinctZones) {
      // On single-atlas appliances, darkest panel/glass door gets secondary, main chassis gets primary
      const darkest = [...clusters].sort((a, b) => a.luma - b.luma)[0];
      const others = clusters.filter((c) => c.k !== darkest.k).sort((a, b) => b.share - a.share);
      if (darkest.luma < 0.36) {
        targetRgb[darkest.k] = [sR, sG, sB];
        targetRgb[others[0].k] = [pR, pG, pB];
        targetRgb[others[1].k] = [aR, aG, aB];
      } else {
        targetRgb[mainCluster.k] = [pR, pG, pB];
        targetRgb[secCluster.k] = [sR, sG, sB];
        targetRgb[thirdCluster.k] = [aR, aG, aB];
      }
    } else if (comboRole === 'mirror_light' && hasDistinctZones) {
      // On single-atlas mirrors, brightest/neutral glass region stays reflective silver, frame gets primary
      const brightest = [...clusters].sort((a, b) => b.luma - a.luma)[0];
      const others = clusters.filter((c) => c.k !== brightest.k).sort((a, b) => b.share - a.share);
      targetRgb[brightest.k] = [sR, sG, sB]; // crystal silver mirror
      targetRgb[others[0].k] = [pR, pG, pB]; // wood/black/brass frame
      targetRgb[others[1].k] = [aR, aG, aB]; // LED/accent detail
    } else if (comboRole === 'room_scene') {
      // Full room atlas: distribute across primary (walls/main), secondary (wood/furniture), ceramic (bright) / accent
      const byLuma = [...clusters].sort((a, b) => b.luma - a.luma);
      targetRgb[byLuma[0].k] = [pR, pG, pB];
      targetRgb[byLuma[1].k] = [sR, sG, sB];
      targetRgb[byLuma[2].k] = [aR, aG, aB];
    } else if (hasDistinctZones) {
      // Standard multi-zone retail furniture (sofa upholstery + legs, marble top + frame, towel + border, accessory + lid)
      targetRgb[mainCluster.k] = [pR, pG, pB];
      targetRgb[secCluster.k] = [sR, sG, sB];
      targetRgb[thirdCluster.k] =
        distMainThird >= 0.18 && thirdCluster.share >= 0.02 ? [aR, aG, aB] : [sR, sG, sB];
    } else {
      // Low-contrast single-color source texture: preserve rich depth with subtle crevice shading
      targetRgb[mainCluster.k] = [pR, pG, pB];
      targetRgb[secCluster.k] = [
        Math.round(pR * 0.78 + sR * 0.22),
        Math.round(pG * 0.78 + sG * 0.22),
        Math.round(pB * 0.78 + sB * 0.22),
      ];
      targetRgb[thirdCluster.k] = [
        Math.round(pR * 0.65 + sR * 0.35),
        Math.round(pG * 0.65 + sG * 0.35),
        Math.round(pB * 0.65 + sB * 0.35),
      ];
    }

    // Step 2: Remap every pixel smoothly preserving weave/grain/AO micro-texture!
    const sharpness = hasDistinctZones ? 32.0 : 12.0;
    const totalPixels = targetW * targetH;

    for (let p = 0; p < totalPixels; p++) {
      const idx = p * 4;
      if (data[idx + 3] < 8) continue;

      const r = data[idx] / 255;
      const g = data[idx + 1] / 255;
      const b = data[idx + 2] / 255;
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;

      // Protect live green foliage pixels on potted plants so leaves ALWAYS stay natural botanical green!
      if (comboRole === 'botanical_plant' && g > r * 1.04 && g > b * 1.04 && g > 0.09) {
        continue;
      }

      // Check metallicRoughness map for metallic legs / brass handles / lamp poles / mirror glass!
      if (mrData) {
        const metalVal = mrData[idx + 2] / 255;
        const roughVal = mrData[idx + 1] / 255;

        if (comboRole === 'mirror_light' && metalVal > 0.65 && roughVal < 0.2) {
          // Keep reflective silver mirror glass untouched
          data[idx] = sR;
          data[idx + 1] = sG;
          data[idx + 2] = sB;
          continue;
        }

        if (metalVal > 0.45) {
          // On lighting/faucet/towel/shower fixtures, metallic parts ARE the primary metal body/pole!
          const isMetalPrimaryRole =
            comboRole === 'lighting_fixture' ||
            comboRole === 'faucet_hardware' ||
            comboRole === 'towel_hardware' ||
            comboRole === 'shower_cabin';
          const [mR, mG, mB] = isMetalPrimaryRole
            ? [pR, pG, pB]
            : comboRole === 'table_console'
              ? [sR, sG, sB]
              : [aR, aG, aB];
          const metalShade = Math.max(0.76, Math.min(1.08, 0.88 + (luma - 0.5) * 0.38));
          data[idx] = Math.max(0, Math.min(255, Math.round(mR * metalShade)));
          data[idx + 1] = Math.max(0, Math.min(255, Math.round(mG * metalShade)));
          data[idx + 2] = Math.max(0, Math.min(255, Math.round(mB * metalShade)));
          continue;
        }

        // On lighting fixtures with an MR map, non-metallic pixels (luma > 0.28) are the fabric/opal lamp shade!
        if (comboRole === 'lighting_fixture' && luma > 0.28) {
          const shadeFactor = Math.max(0.76, Math.min(1.06, 0.95 + (luma - 0.68) * 0.42));
          data[idx] = Math.max(0, Math.min(255, Math.round(cerR * shadeFactor)));
          data[idx + 1] = Math.max(0, Math.min(255, Math.round(cerG * shadeFactor)));
          data[idx + 2] = Math.max(0, Math.min(255, Math.round(cerB * shadeFactor)));
          continue;
        }
      }

      // Soft Gaussian cluster membership for zero harsh aliasing edges between UV islands
      let w0 = 0;
      let w1 = 0;
      let w2 = 0;
      const d0 = (r - cR[0]) ** 2 + (g - cG[0]) ** 2 + (b - cB[0]) ** 2;
      const d1 = (r - cR[1]) ** 2 + (g - cG[1]) ** 2 + (b - cB[1]) ** 2;
      const d2 = (r - cR[2]) ** 2 + (g - cG[2]) ** 2 + (b - cB[2]) ** 2;
      const minD = Math.min(d0, d1, d2);

      w0 = Math.exp(-(d0 - minD) * sharpness);
      w1 = Math.exp(-(d1 - minD) * sharpness);
      w2 = Math.exp(-(d2 - minD) * sharpness);
      const wSum = w0 + w1 + w2 || 1;
      w0 /= wSum;
      w1 /= wSum;
      w2 /= wSum;

      const baseR = targetRgb[0][0] * w0 + targetRgb[1][0] * w1 + targetRgb[2][0] * w2;
      const baseG = targetRgb[0][1] * w0 + targetRgb[1][1] * w1 + targetRgb[2][1] * w2;
      const baseB = targetRgb[0][2] * w0 + targetRgb[1][2] * w1 + targetRgb[2][2] * w2;

      // Preserve within-cluster micro-detail (wood grain, fabric weave, stitched seams, AO)
      const expectedLuma =
        clusters[0].luma * w0 + clusters[1].luma * w1 + clusters[2].luma * w2;
      const detailDelta = luma - expectedLuma;
      const microFactor = Math.max(0.72, Math.min(1.12, 0.96 + detailDelta * 0.82));

      data[idx] = Math.max(0, Math.min(255, Math.round(baseR * microFactor)));
      data[idx + 1] = Math.max(0, Math.min(255, Math.round(baseG * microFactor)));
      data[idx + 2] = Math.max(0, Math.min(255, Math.round(baseB * microFactor)));
    }

    ctx.putImageData(imgData, 0, 0);

    const zonedTex = new THREE.CanvasTexture(canvas);
    zonedTex.colorSpace = THREE.SRGBColorSpace;
    zonedTex.wrapS = sourceTex.wrapS;
    zonedTex.wrapT = sourceTex.wrapT;
    zonedTex.repeat.copy(sourceTex.repeat);
    zonedTex.offset.copy(sourceTex.offset);
    zonedTex.rotation = sourceTex.rotation;
    zonedTex.center.copy(sourceTex.center);
    zonedTex.flipY = sourceTex.flipY;
    zonedTex.anisotropy = sourceTex.anisotropy;
    zonedTex.needsUpdate = true;

    if (!cache) {
      cache = new Map<string, THREE.Texture>();
      sourceTex.userData.__mimarMultiZoneCache = cache;
    }
    if (cache.size >= 10) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey) {
        cache.get(oldestKey)?.dispose();
        cache.delete(oldestKey);
      }
    }
    cache.set(cacheKey, zonedTex);
    return zonedTex;
  } catch {
    return null;
  }
}

/**
 * Generates and caches a luminance-normalized neutral grayscale detail texture from
 * an existing PBR albedo texture (used for legacy single-tone custom overrides & Phase 2 assets).
 */
function getOrCreateNeutralDetailTexture(sourceTex: THREE.Texture): THREE.Texture | null {
  if (sourceTex.userData.__mimarNeutralTex instanceof THREE.Texture) {
    return sourceTex.userData.__mimarNeutralTex;
  }

  const img = sourceTex.image as
    | HTMLImageElement
    | HTMLCanvasElement
    | ImageBitmap
    | { width?: number; height?: number }
    | undefined;
  if (!img || typeof document === 'undefined') return null;

  const w = Number((img as HTMLImageElement).naturalWidth || img.width || 0);
  const h = Number((img as HTMLImageElement).naturalHeight || img.height || 0);
  if (w < 4 || h < 4) return null;

  try {
    const targetW = Math.min(w, 512);
    const targetH = Math.min(h, 512);
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(img as CanvasImageSource, 0, 0, targetW, targetH);
    const imgData = ctx.getImageData(0, 0, targetW, targetH);
    const data = imgData.data;

    let sumLuma = 0;
    const pixelCount = targetW * targetH;
    const lumas = new Float32Array(pixelCount);

    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const l = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      lumas[p] = l;
      sumLuma += l;
    }

    const mean = Math.max(sumLuma / Math.max(pixelCount, 1), 0.01);

    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const delta = lumas[p] - mean;
      const neutral = Math.max(0.62, Math.min(1.0, 0.9 + delta * 0.72));
      const byte = Math.round(neutral * 255);
      data[i] = byte;
      data[i + 1] = byte;
      data[i + 2] = byte;
    }

    ctx.putImageData(imgData, 0, 0);

    const neutralTex = new THREE.CanvasTexture(canvas);
    neutralTex.colorSpace = THREE.SRGBColorSpace;
    neutralTex.wrapS = sourceTex.wrapS;
    neutralTex.wrapT = sourceTex.wrapT;
    neutralTex.repeat.copy(sourceTex.repeat);
    neutralTex.offset.copy(sourceTex.offset);
    neutralTex.rotation = sourceTex.rotation;
    neutralTex.center.copy(sourceTex.center);
    neutralTex.flipY = sourceTex.flipY;
    neutralTex.anisotropy = sourceTex.anisotropy;
    neutralTex.needsUpdate = true;

    sourceTex.userData.__mimarNeutralTex = neutralTex;
    return neutralTex;
  } catch {
    return null;
  }
}

function captureBaseline(
  obj: THREE.Mesh,
  mat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
): StoredMaterialBaseline {
  const existing = mat.userData.__mimarBaseline as StoredMaterialBaseline | undefined;
  if (existing) return existing;

  const baseColor = mat.color ? mat.color.clone() : new THREE.Color(0xffffff);
  const transmission =
    mat instanceof THREE.MeshPhysicalMaterial ? Number(mat.transmission || 0) : 0;
  const matName = mat.name || '';
  const meshName = obj.name || '';
  const combinedName = `${matName} ${meshName}`;

  const isTransparentGlass = (mat.transparent && mat.opacity < 0.85) || transmission > 0.12;
  const isNamedMirror =
    /mirror|ayna/i.test(combinedName) && mat.metalness > 0.8 && mat.roughness < 0.14;
  const isNamedGlass =
    GLASS_OR_MIRROR_RE.test(matName) &&
    (mat.transparent || transmission > 0.05 || mat.opacity < 0.92);
  const isGlassOrMirror = isTransparentGlass || isNamedMirror || isNamedGlass;

  const hasStrongEmission =
    mat.emissive &&
    mat.emissiveIntensity > 0.25 &&
    mat.emissive.r + mat.emissive.g + mat.emissive.b > 0.2;
  const isWaterOrIndicator =
    !isGlassOrMirror && (hasStrongEmission || WATER_OR_INDICATOR_RE.test(matName));

  const luma = 0.299 * baseColor.r + 0.587 * baseColor.g + 0.114 * baseColor.b;
  const isBrightCeramic =
    !isGlassOrMirror &&
    !isWaterOrIndicator &&
    mat.metalness < 0.18 &&
    mat.roughness < 0.36 &&
    luma > 0.8 &&
    !mat.map;
  const isOriginalMetal =
    !isGlassOrMirror &&
    !isWaterOrIndicator &&
    (mat.metalness >= 0.5 ||
      (METAL_NAME_RE.test(matName) && !/paint|ceramic|plastic|rubber/i.test(matName)));
  const isDarkRubber =
    !isGlassOrMirror &&
    !isWaterOrIndicator &&
    RUBBER_OR_SEAL_RE.test(matName) &&
    mat.metalness < 0.3;
  const isAlphaCutout = typeof mat.alphaTest === 'number' && mat.alphaTest > 0.05;
  const isGreenBotanicalColor =
    baseColor.g > baseColor.r * 1.12 &&
    baseColor.g > baseColor.b * 1.12 &&
    baseColor.g > 0.12 &&
    mat.metalness < 0.2;
  const isBotanicalFoliage =
    !isGlassOrMirror &&
    !isWaterOrIndicator &&
    (FOLIAGE_NAME_RE.test(combinedName) ||
      isAlphaCutout ||
      (!POT_OR_PLANTER_RE.test(combinedName) && isGreenBotanicalColor));

  const isPhys = mat instanceof THREE.MeshPhysicalMaterial;
  const baseline: StoredMaterialBaseline = {
    color: baseColor,
    map: mat.map ?? null,
    bumpMap: mat.bumpMap ?? null,
    bumpScale: typeof mat.bumpScale === 'number' ? mat.bumpScale : 0.01,
    roughnessMap: mat.roughnessMap ?? null,
    metalnessMap: mat.metalnessMap ?? null,
    roughness: typeof mat.roughness === 'number' ? mat.roughness : 0.5,
    metalness: typeof mat.metalness === 'number' ? mat.metalness : 0.0,
    normalScale: mat.normalScale ? mat.normalScale.clone() : new THREE.Vector2(1, 1),
    envMapIntensity: typeof mat.envMapIntensity === 'number' ? mat.envMapIntensity : 1.0,
    transparent: mat.transparent,
    opacity: mat.opacity,
    depthWrite: mat.depthWrite,
    transmission,
    sheen: isPhys ? Number(mat.sheen || 0) : 0,
    sheenColor: isPhys && mat.sheenColor ? mat.sheenColor.clone() : null,
    sheenColorMap: isPhys ? (mat.sheenColorMap ?? null) : null,
    luma,
    matName,
    meshName,
    isGlassOrMirror,
    isWaterOrIndicator,
    isBrightCeramic,
    isOriginalMetal,
    isDarkRubber,
    isBotanicalFoliage,
  };

  mat.userData.__mimarBaseline = baseline;
  return baseline;
}

/**
 * Collects per-material spatial geometry stats (relative Y height & volume within the model)
 * so multi-material GLBs can accurately distinguish legs/base vs tabletop vs cabinet vs hardware.
 */
function collectMaterialSpatialStats(root: THREE.Object3D): MaterialSpatialStats[] {
  root.updateMatrixWorld(true);
  const modelBox = new THREE.Box3().setFromObject(root);
  const modelSize = new THREE.Vector3();
  modelBox.getSize(modelSize);
  const modelHeight = Math.max(modelSize.y, 0.001);
  const modelVol = Math.max(modelSize.x * modelSize.y * modelSize.z, 0.0001);

  const byMat = new Map<
    THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
    {
      base: StoredMaterialBaseline;
      minY: number;
      maxY: number;
      vol: number;
      meshCount: number;
    }
  >();

  const meshBox = new THREE.Box3();
  const meshSize = new THREE.Vector3();

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    meshBox.setFromObject(obj);
    meshBox.getSize(meshSize);
    const vol = meshSize.x * meshSize.y * meshSize.z;

    for (const mat of mats) {
      if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
        const base = captureBaseline(obj, mat);
        const entry = byMat.get(mat);
        if (!entry) {
          byMat.set(mat, {
            base,
            minY: meshBox.min.y,
            maxY: meshBox.max.y,
            vol,
            meshCount: 1,
          });
        } else {
          entry.minY = Math.min(entry.minY, meshBox.min.y);
          entry.maxY = Math.max(entry.maxY, meshBox.max.y);
          entry.vol += vol;
          entry.meshCount += 1;
        }
      }
    }
  });

  const stats: MaterialSpatialStats[] = [];
  for (const [mat, entry] of byMat.entries()) {
    const relMinY = THREE.MathUtils.clamp((entry.minY - modelBox.min.y) / modelHeight, 0, 1);
    const relMaxY = THREE.MathUtils.clamp((entry.maxY - modelBox.min.y) / modelHeight, 0, 1);
    stats.push({
      mat,
      base: entry.base,
      relMinY,
      relMaxY,
      relHeight: Math.max(0, relMaxY - relMinY),
      relVolume: THREE.MathUtils.clamp(entry.vol / modelVol, 0, 1),
      meshCount: entry.meshCount,
    });
  }
  return stats;
}

type SemanticPartSlot = 'primary' | 'secondary' | 'accent' | 'ceramic' | 'preserve';

/**
 * Classifies every opaque material in a multi-material GLB into its real-world retail
 * part slot ('primary' | 'secondary' | 'accent' | 'ceramic' | 'preserve') so clicking
 * a finish NEVER turns a multi-part product flat white or flat black.
 */
function assignMultiMaterialSlots(
  opaqueStats: MaterialSpatialStats[],
  comboRole: RetailComboRole | undefined,
): Map<THREE.Material, SemanticPartSlot> {
  const result = new Map<THREE.Material, SemanticPartSlot>();
  if (opaqueStats.length === 0) return result;

  // Sort by volume descending so we know the hero body material
  const byVol = [...opaqueStats].sort((a, b) => b.relVolume - a.relVolume);
  const largestMat = byVol[0].mat;

  // Count how many metals & non-metals exist
  const metalMats = opaqueStats.filter((s) => s.base.isOriginalMetal);
  const nonMetalMats = opaqueStats.filter((s) => !s.base.isOriginalMetal);

  for (let idx = 0; idx < opaqueStats.length; idx++) {
    const st = opaqueStats[idx];
    const { base, relMinY, relMaxY, relVolume } = st;
    const name = `${base.matName} ${base.meshName}`;

    if (base.isWaterOrIndicator) {
      result.set(st.mat, 'preserve');
      continue;
    }

    switch (comboRole) {
      case 'vanity': {
        if (base.isDarkRubber) {
          result.set(st.mat, 'preserve');
        } else if (
          base.isBrightCeramic ||
          (CERAMIC_OR_TOP_NAME_RE.test(name) && !base.isOriginalMetal) ||
          (relMinY > 0.58 && st.relHeight < 0.38 && !base.isOriginalMetal && st.mat !== largestMat)
        ) {
          result.set(st.mat, 'ceramic');
        } else if (
          base.isOriginalMetal ||
          METAL_NAME_RE.test(name) ||
          (relVolume < 0.04 && st.mat !== largestMat)
        ) {
          result.set(st.mat, 'accent');
        } else if (st.mat === largestMat) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'secondary');
        }
        break;
      }

      case 'sanitary_ceramic': {
        if (base.isDarkRubber) {
          result.set(st.mat, 'preserve');
        } else if (
          base.isOriginalMetal ||
          METAL_NAME_RE.test(name) ||
          (relVolume < 0.05 && st.mat !== largestMat)
        ) {
          result.set(st.mat, 'accent');
        } else if (SEAT_OR_LID_NAME_RE.test(name) && st.mat !== largestMat) {
          result.set(st.mat, 'secondary');
        } else if (st.mat === largestMat) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'secondary');
        }
        break;
      }

      case 'bathtub': {
        if (base.isDarkRubber) {
          result.set(st.mat, 'preserve');
        } else if (base.isOriginalMetal || METAL_NAME_RE.test(name)) {
          result.set(st.mat, 'accent');
        } else if (nonMetalMats.length >= 2) {
          // Outer tub body -> primary, inner bright acrylic -> ceramic/secondary
          const brightestNonMetal = [...nonMetalMats].sort((a, b) => b.base.luma - a.base.luma)[0];
          result.set(st.mat, st.mat === brightestNonMetal.mat ? 'ceramic' : 'primary');
        } else {
          result.set(st.mat, 'primary');
        }
        break;
      }

      case 'shower_cabin': {
        if (
          (!base.isOriginalMetal &&
            (CERAMIC_OR_TOP_NAME_RE.test(name) || base.isBrightCeramic || relMaxY < 0.18))
        ) {
          result.set(st.mat, 'ceramic');
        } else if (/pivot|hinge|handle|roller|bright|chrome/i.test(name) && metalMats.length >= 2) {
          result.set(st.mat, 'accent');
        } else if (base.isDarkRubber || SEAT_OR_LID_NAME_RE.test(name)) {
          result.set(st.mat, 'secondary');
        } else if (st.mat === largestMat || base.isOriginalMetal) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'secondary');
        }
        break;
      }

      case 'faucet_hardware': {
        if (base.isDarkRubber || (!base.isOriginalMetal && metalMats.length >= 1)) {
          result.set(st.mat, 'secondary');
        } else if (metalMats.length >= 2 && st.mat !== metalMats[0].mat) {
          result.set(st.mat, 'accent');
        } else {
          result.set(st.mat, 'primary');
        }
        break;
      }

      case 'towel_hardware': {
        // Protect white toilet paper rolls / towels / white plastic inserts from turning black!
        if (
          !base.isOriginalMetal &&
          (base.isBrightCeramic ||
            base.luma > 0.72 ||
            /paper|roll|towel|havlu|plastic__glossy_white|indicator/i.test(name))
        ) {
          result.set(st.mat, 'ceramic');
        } else if (
          /dial|valve|vana|mount|bracket|rosette|cap/i.test(name) ||
          (metalMats.length >= 2 && st.mat !== largestMat && relVolume < 0.25)
        ) {
          result.set(st.mat, 'accent');
        } else if (st.mat === largestMat || base.isOriginalMetal) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'accent');
        }
        break;
      }

      case 'mirror_light': {
        // Mirror surface protection if not already caught as isGlassOrMirror
        if (base.metalness > 0.8 && base.roughness < 0.14 && opaqueStats.length >= 2) {
          result.set(st.mat, 'preserve');
        } else if (/diffuser|opal|bulb|shade|lamp|led|glow/i.test(name)) {
          result.set(st.mat, 'accent');
        } else if (st.mat === largestMat) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'accent');
        }
        break;
      }

      case 'seating': {
        if (
          base.isOriginalMetal ||
          METAL_NAME_RE.test(name) ||
          (relVolume < 0.03 && st.mat !== largestMat)
        ) {
          result.set(st.mat, 'accent');
        } else if (
          (LEG_OR_WOOD_NAME_RE.test(name) || relMaxY < 0.34 || base.roughness < 0.58) &&
          st.mat !== largestMat
        ) {
          result.set(st.mat, 'secondary');
        } else if (st.mat === largestMat) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'secondary');
        }
        break;
      }

      case 'table_console': {
        if (
          (METAL_NAME_RE.test(name) && relVolume < 0.05) ||
          (/handle|kulp|knob|hinge|brass|gold/i.test(name) && st.mat !== largestMat)
        ) {
          result.set(st.mat, 'accent');
        } else if (
          (base.isOriginalMetal ||
            /leg|base|frame|metal|steel|iron|ayak/i.test(name) ||
            (relMaxY < 0.72 && st.mat !== largestMat)) &&
          nonMetalMats.length >= 1
        ) {
          result.set(st.mat, 'secondary');
        } else if (st.mat === largestMat || relMinY > 0.55) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'secondary');
        }
        break;
      }

      case 'bath_accessory': {
        if (
          base.isOriginalMetal ||
          METAL_NAME_RE.test(name) ||
          (relMinY > 0.65 && relVolume < 0.18 && st.mat !== largestMat)
        ) {
          result.set(st.mat, 'accent');
        } else if (st.mat === largestMat) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'secondary');
        }
        break;
      }

      case 'bath_textile': {
        result.set(st.mat, st.mat === largestMat ? 'primary' : 'secondary');
        break;
      }

      case 'room_scene': {
        if (base.isOriginalMetal || METAL_NAME_RE.test(name)) {
          result.set(st.mat, 'accent');
        } else if (base.luma > 0.8 && !LEG_OR_WOOD_NAME_RE.test(name)) {
          result.set(st.mat, 'ceramic');
        } else if (LEG_OR_WOOD_NAME_RE.test(name) || base.luma < 0.45) {
          result.set(st.mat, 'secondary');
        } else {
          // For multi-material scenes (e.g. 20 generic blinn mats), distribute harmoniously
          const slotCycle: SemanticPartSlot[] = ['primary', 'secondary', 'ceramic', 'accent'];
          result.set(st.mat, slotCycle[idx % slotCycle.length]);
        }
        break;
      }

      case 'laundry_cabinet': {
        if (base.isDarkRubber) {
          result.set(st.mat, 'preserve');
        } else if (
          base.isBrightCeramic ||
          /sink|basin|washer|dryer|machine|ceramic|porcelain/i.test(name)
        ) {
          result.set(st.mat, 'ceramic');
        } else if (
          base.isOriginalMetal ||
          METAL_NAME_RE.test(name) ||
          (relVolume < 0.04 && st.mat !== largestMat)
        ) {
          result.set(st.mat, 'accent');
        } else if (
          /basket|hamper|counter|shelf|top|wood|oak|walnut/i.test(name) &&
          st.mat !== largestMat
        ) {
          result.set(st.mat, 'secondary');
        } else if (st.mat === largestMat) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'secondary');
        }
        break;
      }

      case 'appliance': {
        if (base.isDarkRubber) {
          result.set(st.mat, 'preserve');
        } else if (
          APPLIANCE_PANEL_RE.test(name) ||
          (!base.isOriginalMetal && base.luma < 0.26 && opaqueStats.length >= 2)
        ) {
          result.set(st.mat, 'secondary');
        } else if (
          /handle|kulp|trim|chrome|knob|dial|ring/i.test(name) ||
          (relVolume < 0.05 && st.mat !== largestMat)
        ) {
          result.set(st.mat, 'accent');
        } else if (st.mat === largestMat) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'secondary');
        }
        break;
      }

      case 'bed_frame': {
        if (
          BEDDING_NAME_RE.test(name) ||
          (!base.isOriginalMetal &&
            base.luma > 0.7 &&
            relMinY > 0.16 &&
            opaqueStats.length >= 2 &&
            !LEG_OR_WOOD_NAME_RE.test(name))
        ) {
          result.set(st.mat, 'ceramic');
        } else if (
          base.isOriginalMetal ||
          METAL_NAME_RE.test(name) ||
          (relVolume < 0.03 && st.mat !== largestMat)
        ) {
          result.set(st.mat, 'accent');
        } else if (st.mat === largestMat) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'secondary');
        }
        break;
      }

      case 'lighting_fixture': {
        if (
          LAMP_SHADE_RE.test(name) ||
          (!base.isOriginalMetal &&
            (base.luma > 0.68 || base.roughness > 0.6) &&
            opaqueStats.length >= 2)
        ) {
          result.set(st.mat, 'ceramic');
        } else if (
          (base.isOriginalMetal && metalMats.length >= 2 && relVolume < 0.14) ||
          (/socket|ring|brass|gold|collar|cap/i.test(name) && st.mat !== largestMat)
        ) {
          result.set(st.mat, 'accent');
        } else if (st.mat === largestMat || base.isOriginalMetal) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'secondary');
        }
        break;
      }

      case 'botanical_plant': {
        // Protect all natural green leaves, branches, flowers, and soil from recoloring!
        const hasExplicitFoliage = opaqueStats.some((s) => s.base.isBotanicalFoliage);
        const isUpperCanopyFallback =
          !hasExplicitFoliage &&
          opaqueStats.length >= 2 &&
          !POT_OR_PLANTER_RE.test(name) &&
          relMinY > 0.32 &&
          relMaxY > 0.72;
        if (base.isBotanicalFoliage || isUpperCanopyFallback) {
          result.set(st.mat, 'preserve');
        } else if (base.isOriginalMetal || METAL_NAME_RE.test(name)) {
          result.set(st.mat, 'accent');
        } else if (POT_OR_PLANTER_RE.test(name) || relMaxY <= 0.58) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'secondary');
        }
        break;
      }

      case 'arch_door_window': {
        if (base.isDarkRubber) {
          result.set(st.mat, 'preserve');
        } else if (
          /handle|kulp|lock|hinge|knob|latch|brass|chrome/i.test(name) ||
          (base.isOriginalMetal && nonMetalMats.length >= 1 && relVolume < 0.08) ||
          (relVolume < 0.03 && st.mat !== largestMat)
        ) {
          result.set(st.mat, 'accent');
        } else if (st.mat === largestMat) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'secondary');
        }
        break;
      }

      case 'exterior_outdoor': {
        if (base.isBotanicalFoliage) {
          result.set(st.mat, 'preserve');
        } else if (
          /cushion|pillow|fabric|cloth|minder|seat/i.test(name) ||
          (!base.isOriginalMetal && base.roughness > 0.72 && opaqueStats.length >= 2 && st.mat !== largestMat)
        ) {
          result.set(st.mat, 'secondary');
        } else if (
          base.isOriginalMetal && nonMetalMats.length >= 1 && st.mat !== largestMat
        ) {
          result.set(st.mat, 'accent');
        } else if (st.mat === largestMat) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'secondary');
        }
        break;
      }

      default: {
        if (base.isBrightCeramic && opaqueStats.length >= 2) {
          result.set(st.mat, 'ceramic');
        } else if (base.isOriginalMetal && nonMetalMats.length >= 1) {
          result.set(st.mat, 'accent');
        } else if (st.mat === largestMat) {
          result.set(st.mat, 'primary');
        } else {
          result.set(st.mat, 'secondary');
        }
      }
    }
  }

  return result;
}

function applyPartSpecToMaterial(
  mat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
  base: StoredMaterialBaseline,
  spec: PartMaterialSpec,
  pattern: PatternVariant,
  tactileSurface: ReturnType<typeof getArchitecturalSurfaceTextureSet>,
  isHeroPart: boolean,
): void {
  const partColor = new THREE.Color(spec.hex);
  const isMetalSpec = spec.metalness >= 0.6;

  if (tactileSurface && isHeroPart && !isMetalSpec) {
    mat.map = tactileSurface.map;
    mat.bumpMap = tactileSurface.bumpMap;
    mat.bumpScale = tactileSurface.bumpScale;
    mat.color.copy(partColor);
    mat.metalness =
      typeof tactileSurface.metalnessOverride === 'number'
        ? tactileSurface.metalnessOverride
        : THREE.MathUtils.clamp(spec.metalness, 0.0, 1.0);
    mat.roughness =
      typeof tactileSurface.roughnessOverride === 'number'
        ? tactileSurface.roughnessOverride
        : THREE.MathUtils.clamp(spec.roughness + pattern.roughnessDelta, 0.05, 0.96);
    mat.envMapIntensity = mat.metalness >= 0.7 ? 1.42 : mat.roughness < 0.2 ? 1.2 : 1.0;
  } else if (isMetalSpec) {
    mat.map = null;
    mat.roughnessMap = null;
    mat.metalnessMap = null;
    mat.bumpMap = tactileSurface && isHeroPart ? tactileSurface.bumpMap : base.bumpMap;
    mat.bumpScale = tactileSurface && isHeroPart ? tactileSurface.bumpScale : base.bumpScale;
    mat.color.copy(partColor);
    mat.metalness = THREE.MathUtils.clamp(spec.metalness, 0.0, 1.0);
    mat.roughness = THREE.MathUtils.clamp(spec.roughness + pattern.roughnessDelta, 0.05, 0.95);
    mat.envMapIntensity = spec.roughness < 0.25 ? 1.45 : 1.18;
  } else {
    if (base.map) {
      mat.map = getOrCreateNeutralDetailTexture(base.map);
    } else {
      mat.map = null;
    }
    mat.roughnessMap = base.roughnessMap;
    mat.metalnessMap = base.metalnessMap;
    mat.bumpMap = base.bumpMap;
    mat.bumpScale = base.bumpScale;
    mat.color.copy(partColor);
    mat.metalness = THREE.MathUtils.clamp(spec.metalness, 0.0, 1.0);
    mat.roughness = THREE.MathUtils.clamp(spec.roughness + pattern.roughnessDelta, 0.05, 0.98);
    mat.envMapIntensity = spec.roughness < 0.2 ? 1.22 : 1.0;
  }

  // Adapt KHR_materials_sheen on velvet/boucle MeshPhysicalMaterials so grazing sheen
  // glows softly in the chosen fabric color rather than washing rich colors out to white!
  if (mat instanceof THREE.MeshPhysicalMaterial && base.sheen > 0) {
    mat.sheenColorMap = null;
    if (isMetalSpec || spec.roughness < 0.35) {
      mat.sheen = 0;
    } else {
      mat.sheen = Math.min(base.sheen, 0.65);
      if (mat.sheenColor) {
        mat.sheenColor.copy(partColor).lerp(new THREE.Color(0xffffff), 0.16);
      }
    }
  }
}

function restorePhysicalSheen(
  mat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
  base: StoredMaterialBaseline,
): void {
  if (mat instanceof THREE.MeshPhysicalMaterial) {
    mat.sheen = base.sheen;
    if (base.sheenColor && mat.sheenColor) {
      mat.sheenColor.copy(base.sheenColor);
    }
    mat.sheenColorMap = base.sheenColorMap;
  }
}

/**
 * Applies architectural finish color, real-world multi-part retail combinations,
 * tri-tone woven rug designer palettes, pattern roughness/normal adjustments,
 * and wireframe cleanly to ANY loaded external GLTF/GLB model WITHOUT re-downloading it.
 */
export function applyFinishAndPatternToExternalModel(
  root: THREE.Object3D,
  finish: MaterialFinish,
  pattern: PatternVariant,
  wireframe: boolean,
): void {
  const primaryColor = new THREE.Color(finish.primaryHex);
  const secondaryColor = new THREE.Color(finish.secondaryHex || finish.primaryHex);
  const accentColor = new THREE.Color(finish.accentHex || finish.primaryHex);
  const preserveOriginal = Boolean(finish.preserveOriginalTextures);
  const isTriToneRug =
    !preserveOriginal &&
    (finish.paletteRecolorMode === 'tri-tone-rug' ||
      (finish.materialKind === 'rug' &&
        finish.secondaryHex &&
        finish.secondaryHex.toLowerCase() !== finish.primaryHex.toLowerCase()));
  const isMultiPartRetail =
    !preserveOriginal &&
    !isTriToneRug &&
    finish.paletteRecolorMode === 'multi-part-retail' &&
    Boolean(finish.partFinishes);

  // Collect per-material spatial + baseline info once
  const allStats = collectMaterialSpatialStats(root);
  const opaqueStats = allStats.filter(
    (s) => !s.base.isGlassOrMirror && !s.base.isWaterOrIndicator,
  );
  const totalOpaqueMats = opaqueStats.length;

  const slotMap = isMultiPartRetail
    ? assignMultiMaterialSlots(opaqueStats, finish.comboRole)
    : new Map<THREE.Material, SemanticPartSlot>();

  const hasWoodOrBodyMat = opaqueStats.some(
    (s) => !s.base.isBrightCeramic && !s.base.isOriginalMetal,
  );
  const isLegacyMultiPartVanity =
    !isMultiPartRetail && finish.materialKind === 'wood' && totalOpaqueMats >= 2 && hasWoodOrBodyMat;

  const tactileSurface = getArchitecturalSurfaceTextureSet(pattern.id);

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) {
      if (!mat) continue;
      if ('wireframe' in mat) {
        (mat as THREE.MeshStandardMaterial).wireframe = wireframe;
      }

      if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
        const base = captureBaseline(obj, mat);

        // Protect water, LED emission strips, and faucet hot/cold indicator dots
        if (base.isWaterOrIndicator) {
          mat.color.copy(base.color);
          mat.map = base.map;
          mat.roughnessMap = base.roughnessMap;
          mat.metalnessMap = base.metalnessMap;
          mat.bumpMap = base.bumpMap;
          mat.bumpScale = base.bumpScale;
          mat.roughness = base.roughness;
          mat.metalness = base.metalness;
          mat.envMapIntensity = base.envMapIntensity;
          mat.needsUpdate = true;
          continue;
        }

        // Glass & mirror handling: protect mirror/clear glass, or apply realistic glass tint on shower cabins!
        if (base.isGlassOrMirror) {
          if (isMultiPartRetail && finish.partFinishes?.glass && !/mirror|ayna/i.test(base.matName)) {
            const gSpec = finish.partFinishes.glass;
            mat.color.set(gSpec.hex);
            mat.map = null;
            mat.transparent = true;
            mat.opacity = gSpec.opacity;
            mat.depthWrite = false;
            mat.roughness = gSpec.roughness;
            mat.metalness = 0.08;
            mat.envMapIntensity = 1.25;
          } else {
            mat.color.copy(base.color);
            mat.map = base.map;
            mat.bumpMap = base.bumpMap;
            mat.bumpScale = base.bumpScale;
            mat.roughness = base.roughness;
            mat.metalness = base.metalness;
            mat.transparent = base.transparent;
            mat.opacity = base.opacity;
            mat.depthWrite = base.depthWrite;
            mat.envMapIntensity = base.envMapIntensity;
          }
          mat.needsUpdate = true;
          continue;
        }

        if (preserveOriginal && !tactileSurface) {
          mat.map = base.map;
          mat.roughnessMap = base.roughnessMap;
          mat.metalnessMap = base.metalnessMap;
          mat.bumpMap = base.bumpMap;
          mat.bumpScale = base.bumpScale;
          mat.color.copy(base.color);
          mat.metalness = base.metalness;
          mat.roughness = THREE.MathUtils.clamp(
            base.roughness + pattern.roughnessDelta,
            0.04,
            0.98,
          );
          mat.envMapIntensity = base.envMapIntensity;
          restorePhysicalSheen(mat, base);
        } else if (preserveOriginal && tactileSurface) {
          restorePhysicalSheen(mat, base);
          if (finish.materialKind === 'rug' && base.map) {
            mat.map = base.map;
            mat.bumpMap = tactileSurface.bumpMap;
            mat.bumpScale = tactileSurface.bumpScale;
            mat.color.copy(base.color);
            mat.metalness = 0.0;
            mat.roughness = THREE.MathUtils.clamp(
              base.roughness + pattern.roughnessDelta,
              0.78,
              0.98,
            );
            mat.envMapIntensity = 0.88;
          } else {
            mat.map = tactileSurface.map;
            mat.bumpMap = tactileSurface.bumpMap;
            mat.bumpScale = tactileSurface.bumpScale;
            mat.color.copy(base.color);
            mat.metalness =
              typeof tactileSurface.metalnessOverride === 'number'
                ? tactileSurface.metalnessOverride
                : base.metalness;
            mat.roughness =
              typeof tactileSurface.roughnessOverride === 'number'
                ? tactileSurface.roughnessOverride
                : THREE.MathUtils.clamp(base.roughness + pattern.roughnessDelta, 0.05, 0.96);
            mat.envMapIntensity = mat.metalness >= 0.7 ? 1.38 : 1.05;
          }
        } else if (isTriToneRug && base.map) {
          const triTex = getOrCreateTriToneRugTexture(
            base.map,
            finish.primaryHex,
            finish.secondaryHex || finish.primaryHex,
            finish.accentHex || finish.secondaryHex || finish.primaryHex,
          );
          if (triTex) {
            mat.map = triTex;
            mat.color.setHex(0xffffff);
          } else {
            mat.map = base.map;
            mat.color.copy(primaryColor);
          }
          mat.roughnessMap = base.roughnessMap;
          mat.metalnessMap = base.metalnessMap;
          mat.bumpMap = tactileSurface ? tactileSurface.bumpMap : base.bumpMap;
          mat.bumpScale = tactileSurface ? tactileSurface.bumpScale : base.bumpScale;
          mat.metalness = 0.0;
          mat.roughness = THREE.MathUtils.clamp(
            finish.roughness + pattern.roughnessDelta,
            0.78,
            0.98,
          );
          mat.envMapIntensity = 0.52;
        } else if (isMultiPartRetail && finish.partFinishes) {
          const parts = finish.partFinishes;

          // Case 1: Single-material textured GLB (e.g. ABO sofa/table/vanity/mirror or single-atlas room)
          if (totalOpaqueMats === 1 && base.map) {
            const zonedTex = getOrCreateMultiZonePartTexture(
              base.map,
              base.metalnessMap || base.roughnessMap,
              parts,
              finish.comboRole,
            );
            if (zonedTex) {
              mat.map = zonedTex;
              mat.color.setHex(0xffffff);
              mat.bumpMap = tactileSurface ? tactileSurface.bumpMap : base.bumpMap;
              mat.bumpScale = tactileSurface ? tactileSurface.bumpScale : base.bumpScale;
              // Preserve embedded MR maps (keeps metallic legs shiny while fabric stays matte!)
              if (base.roughnessMap || base.metalnessMap) {
                mat.roughnessMap = base.roughnessMap;
                mat.metalnessMap = base.metalnessMap;
                mat.roughness = THREE.MathUtils.clamp(
                  base.roughness + pattern.roughnessDelta,
                  0.14,
                  1.0,
                );
                mat.metalness = base.metalness;
                mat.envMapIntensity = 1.08;
              } else {
                mat.roughness = THREE.MathUtils.clamp(
                  parts.primary.roughness + pattern.roughnessDelta,
                  0.06,
                  0.98,
                );
                mat.metalness = THREE.MathUtils.clamp(parts.primary.metalness, 0.0, 1.0);
                mat.envMapIntensity = parts.primary.metalness >= 0.7 ? 1.38 : 1.0;
              }
              if (mat instanceof THREE.MeshPhysicalMaterial && base.sheen > 0) {
                mat.sheenColorMap = null;
                mat.sheen = Math.min(base.sheen, 0.65);
                if (mat.sheenColor) {
                  mat.sheenColor.copy(primaryColor).lerp(new THREE.Color(0xffffff), 0.16);
                }
              }
            } else {
              applyPartSpecToMaterial(mat, base, parts.primary, pattern, tactileSurface, true);
            }
          } else {
            // Case 2: Multi-material GLB (SimReady / USDCraft / Objaverse / Poly Haven / Khronos / Rooms)
            const slot = slotMap.get(mat) || 'primary';
            if (slot === 'preserve') {
              mat.map = base.map;
              mat.roughnessMap = base.roughnessMap;
              mat.metalnessMap = base.metalnessMap;
              mat.bumpMap = base.bumpMap;
              mat.bumpScale = base.bumpScale;
              mat.color.copy(base.color);
              mat.metalness = base.metalness;
              mat.roughness = base.roughness;
              mat.envMapIntensity = base.envMapIntensity;
              restorePhysicalSheen(mat, base);
            } else {
              const targetSpec =
                slot === 'ceramic'
                  ? parts.ceramic || parts.secondary
                  : slot === 'accent'
                    ? parts.accent
                    : slot === 'secondary'
                      ? parts.secondary
                      : parts.primary;
              applyPartSpecToMaterial(
                mat,
                base,
                targetSpec,
                pattern,
                tactileSurface,
                slot === 'primary',
              );
            }
          }
        } else {
          // Legacy Phase 2 single-finish fallback (will be upgraded in Phase 2)
          if (isLegacyMultiPartVanity && base.isBrightCeramic) {
            mat.map = base.map;
            mat.bumpMap = base.bumpMap;
            mat.bumpScale = base.bumpScale;
            mat.color.copy(secondaryColor);
            mat.metalness = 0.04;
            mat.roughness = 0.1;
            mat.envMapIntensity = 1.1;
          } else if (isLegacyMultiPartVanity && base.isOriginalMetal) {
            mat.map = null;
            mat.bumpMap = null;
            mat.color.copy(accentColor);
            mat.metalness = 0.88;
            mat.roughness = 0.28;
            mat.envMapIntensity = 1.25;
          } else {
            const isMetalFinish = finish.metalness >= 0.6;
            if (tactileSurface) {
              mat.map = tactileSurface.map;
              mat.bumpMap = tactileSurface.bumpMap;
              mat.bumpScale = tactileSurface.bumpScale;
              mat.color.copy(primaryColor);
              mat.metalness =
                typeof tactileSurface.metalnessOverride === 'number'
                  ? tactileSurface.metalnessOverride
                  : THREE.MathUtils.clamp(finish.metalness, 0.0, 1.0);
              mat.roughness =
                typeof tactileSurface.roughnessOverride === 'number'
                  ? tactileSurface.roughnessOverride
                  : THREE.MathUtils.clamp(finish.roughness + pattern.roughnessDelta, 0.05, 0.96);
              mat.envMapIntensity =
                mat.metalness >= 0.7 ? 1.42 : mat.roughness < 0.2 ? 1.2 : 1.0;
            } else if (isMetalFinish) {
              mat.map = null;
              mat.roughnessMap = null;
              mat.metalnessMap = null;
              mat.bumpMap = base.bumpMap;
              mat.bumpScale = base.bumpScale;
              mat.color.copy(primaryColor);
              mat.metalness = THREE.MathUtils.clamp(finish.metalness, 0.0, 1.0);
              mat.roughness = THREE.MathUtils.clamp(
                finish.roughness + pattern.roughnessDelta,
                0.05,
                0.95,
              );
              mat.envMapIntensity = finish.roughness < 0.25 ? 1.45 : 1.15;
            } else {
              if (base.map) {
                mat.map = getOrCreateNeutralDetailTexture(base.map);
              } else {
                mat.map = null;
              }
              mat.roughnessMap = base.roughnessMap;
              mat.metalnessMap = base.metalnessMap;
              mat.bumpMap = base.bumpMap;
              mat.bumpScale = base.bumpScale;
              mat.color.copy(primaryColor);
              mat.metalness = THREE.MathUtils.clamp(finish.metalness, 0.0, 1.0);
              mat.roughness = THREE.MathUtils.clamp(
                finish.roughness + pattern.roughnessDelta,
                0.05,
                0.98,
              );
              mat.envMapIntensity =
                finish.materialKind === 'ceramic' && finish.roughness < 0.2 ? 1.2 : 1.0;
            }
          }
          if (mat instanceof THREE.MeshPhysicalMaterial && base.sheen > 0) {
            mat.sheenColorMap = null;
            mat.sheen = finish.metalness >= 0.6 ? 0 : Math.min(base.sheen, 0.65);
            if (mat.sheenColor) {
              mat.sheenColor.copy(primaryColor).lerp(new THREE.Color(0xffffff), 0.16);
            }
          }
        }

        if (mat.normalScale && base.normalScale) {
          const factor = Math.max(0.5, Math.min(1.6, pattern.bumpScale || 1));
          mat.normalScale.set(base.normalScale.x * factor, base.normalScale.y * factor);
        }
        mat.needsUpdate = true;
      }
    }
  });
}

function disposeObjectTree(root: THREE.Object3D): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      if (obj.geometry) geometries.add(obj.geometry);
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const m of mats) {
        if (!m) continue;
        materials.add(m);
        const baseline = m.userData?.__mimarBaseline as StoredMaterialBaseline | undefined;
        if (baseline?.map) {
          textures.add(baseline.map);
          const neutral = baseline.map.userData?.__mimarNeutralTex;
          if (neutral instanceof THREE.Texture) {
            textures.add(neutral);
          }
          const triCache = baseline.map.userData?.__mimarTriToneCache as
            | Map<string, THREE.Texture>
            | undefined;
          if (triCache) {
            triCache.forEach((tex) => textures.add(tex));
            triCache.clear();
          }
          const multiZoneCache = baseline.map.userData?.__mimarMultiZoneCache as
            | Map<string, THREE.Texture>
            | undefined;
          if (multiZoneCache) {
            multiZoneCache.forEach((tex) => textures.add(tex));
            multiZoneCache.clear();
          }
        }
        for (const value of Object.values(m)) {
          if (value instanceof THREE.Texture) {
            textures.add(value);
          }
        }
      }
    }
  });

  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
  textures.forEach((t) => {
    if (!t.userData?.__mimarSharedProcedural) {
      t.dispose();
    }
  });
}

/**
 * Loads a genuine ready-made HF (USDCraft / SimReady / Objaverse), ABO, Poly Haven CC0,
 * or Khronos GLTF/GLB model, normalizes its pivot to bottom-center (y=0, x=0, z=0) and
 * scales it to true 1:1 architectural metric dimensions matching asset.dimensionsCm.
 */
export async function loadExternalArchitecturalModel(
  asset: ArchitecturalAsset,
  finish: MaterialFinish,
  pattern: PatternVariant,
  options: {
    isSoftwareGl: boolean;
    maxAnisotropy: number;
    wireframe: boolean;
    onProgress?: (loadedBytes: number, totalBytes: number) => void;
  },
  signal?: AbortSignal,
): Promise<BuiltAssetModel> {
  const rawGltfUrl = asset.modelSource?.gltfUrl;
  if (!rawGltfUrl) {
    throw new Error('Bu varlık için dış GLTF/GLB adresi tanımlı değil.');
  }

  const gltfUrl = resolveDirectGlbUrl(rawGltfUrl);

  const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Yükleme iptal edildi.', 'AbortError'));
      return;
    }
    sharedLoader.load(
      gltfUrl,
      (loaded) => resolve(loaded),
      (evt) => {
        if (!signal?.aborted && options.onProgress && evt.loaded > 0) {
          options.onProgress(evt.loaded, evt.total || 0);
        }
      },
      (err) => reject(err instanceof Error ? err : new Error('3D model dosyası yüklenemedi.')),
    );
  });

  if (signal?.aborted) {
    disposeObjectTree(gltf.scene);
    throw new DOMException('Yükleme iptal edildi.', 'AbortError');
  }

  const wrapper = new THREE.Group();
  wrapper.name = asset.slug || asset.id;

  const modelRoot = gltf.scene;

  if (asset.modelSource.frontRotationYDeg) {
    modelRoot.rotation.y = THREE.MathUtils.degToRad(asset.modelSource.frontRotationYDeg);
  }

  // Enable crisp texture anisotropy, shadows, and software-GL safe glass transmission fallback
  modelRoot.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = !options.isSoftwareGl;
      child.receiveShadow = !options.isSoftwareGl;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      for (const m of mats) {
        if (!m) continue;
        if (m instanceof THREE.MeshPhysicalMaterial && options.isSoftwareGl && m.transmission > 0.1) {
          m.transmission = 0;
          m.transparent = true;
          m.opacity = 0.42;
        }
        for (const val of Object.values(m)) {
          if (val instanceof THREE.Texture) {
            val.anisotropy = Math.min(options.maxAnisotropy, 8);
          }
        }
      }
    }
  });

  // Compute natural bounding box and normalize to true 1:1 metric scale & bottom-center pivot
  modelRoot.updateMatrixWorld(true);
  const rawBox = new THREE.Box3().setFromObject(modelRoot);
  const rawSize = new THREE.Vector3();
  const rawCenter = new THREE.Vector3();
  rawBox.getSize(rawSize);
  rawBox.getCenter(rawCenter);

  const rawMax = Math.max(rawSize.x, rawSize.y, rawSize.z, 0.001);
  const targetMax = Math.max(
    asset.dimensionsCm.width / 100,
    asset.dimensionsCm.depth / 100,
    asset.dimensionsCm.height / 100,
    0.16,
  );
  const scaleFactor = targetMax / rawMax;
  modelRoot.scale.multiplyScalar(scaleFactor);

  modelRoot.updateMatrixWorld(true);
  const scaledBox = new THREE.Box3().setFromObject(modelRoot);
  const scaledCenter = new THREE.Vector3();
  scaledBox.getCenter(scaledCenter);

  // Place cleanly at X=0, Z=0, bottom flush at Y=0 (or slightly elevated for ceiling fixtures)
  const liftY = asset.placement === 'ceiling' ? 0.24 : 0.0;
  modelRoot.position.x -= scaledCenter.x;
  modelRoot.position.z -= scaledCenter.z;
  modelRoot.position.y -= scaledBox.min.y - liftY;

  wrapper.add(modelRoot);
  applyFinishAndPatternToExternalModel(wrapper, finish, pattern, options.wireframe);

  return {
    group: wrapper,
    dispose: () => {
      disposeObjectTree(wrapper);
    },
  };
}
