import * as THREE from 'three';

export type ExportTextureSlot =
  | 'map'
  | 'normalMap'
  | 'roughnessMap'
  | 'metalnessMap'
  | 'aoMap'
  | 'bumpMap'
  | 'emissiveMap'
  | 'alphaMap'
  | 'sheenColorMap'
  | 'clearcoatNormalMap';

export const DEFAULT_EXPORT_MAX_TEXTURE_SIZE = 1024;

export const EXPORT_TEXTURE_SLOTS: ExportTextureSlot[] = [
  'map',
  'normalMap',
  'roughnessMap',
  'metalnessMap',
  'aoMap',
  'bumpMap',
  'emissiveMap',
  'alphaMap',
  'sheenColorMap',
  'clearcoatNormalMap',
];

/**
 * Decides whether a texture slot in a Three.js material can be safely exported as compact JPEG
 * instead of Three.js GLTFExporter's default uncompressed lossless PNG.
 */
export function chooseExportTextureMimeType(
  slot: ExportTextureSlot,
  materialNeedsAlpha: boolean,
): 'image/jpeg' | 'image/png' {
  if (slot === 'alphaMap') return 'image/png';
  if (slot === 'map' && materialNeedsAlpha) return 'image/png';
  return 'image/jpeg';
}

/**
 * Checks whether an external URL points directly to a ready-made binary .glb
 * (including our Express optimizer endpoints for ABO and Hugging Face models).
 */
export function isDirectBinaryGlbUrl(rawUrl: string | undefined): boolean {
  if (!rawUrl) return false;
  if (/\.glb(\?.*)?$/i.test(rawUrl)) return true;
  if (/^\/api\/v1\/hf\/glb\/(usdcraft-glb|simready-glb|objaverse-clean-glb)\/[a-zA-Z0-9_-]+$/i.test(rawUrl)) {
    return true;
  }
  return false;
}

/**
 * Formats byte count into a human-readable Turkish MB/KB string.
 */
export function formatGlbByteSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Clones materials on an export-only Three.js scene tree and tags opaque textures with
 * `userData.mimeType = 'image/jpeg'` so GLTFExporter writes compact JPEG images instead of
 * giant lossless PNGs — without mutating any live viewport material or texture.
 */
export function prepareExportSceneForCompactGlb(root: THREE.Object3D): { cleanup: () => void } {
  const clonedMaterials = new Map<THREE.Material, THREE.Material>();
  const clonedTextures = new Map<string, THREE.Texture>();

  const wrapTextureForExport = (
    srcTex: THREE.Texture,
    mimeType: 'image/jpeg' | 'image/png',
  ): THREE.Texture => {
    const cacheKey = `${srcTex.uuid}|${mimeType}`;
    const existing = clonedTextures.get(cacheKey);
    if (existing) return existing;

    const texClone = srcTex.clone();
    // Preserve shared underlying image reference so GLTFExporter deduplicates ORM/shared maps
    texClone.image = srcTex.image;
    texClone.source = srcTex.source;
    texClone.userData = { mimeType };
    clonedTextures.set(cacheKey, texClone);
    return texClone;
  };

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const isArray = Array.isArray(obj.material);
    const mats = isArray ? (obj.material as THREE.Material[]) : [obj.material as THREE.Material];

    const nextMats = mats.map((mat) => {
      if (!mat) return mat;
      const cachedMat = clonedMaterials.get(mat);
      if (cachedMat) return cachedMat;

      const matClone = mat.clone();
      // Strip internal runtime caches/baselines before glTF serialization
      matClone.userData = {};

      const matAny = matClone as unknown as Record<string, unknown>;
      const isTransparent = Boolean(
        (matClone.transparent && matClone.opacity < 0.995) ||
          (typeof matClone.alphaTest === 'number' && matClone.alphaTest > 0.01) ||
          Boolean(matAny.alphaMap),
      );

      for (const slot of EXPORT_TEXTURE_SLOTS) {
        const tex = matAny[slot];
        if (tex instanceof THREE.Texture && tex.image) {
          const mimeType = chooseExportTextureMimeType(slot, isTransparent);
          matAny[slot] = wrapTextureForExport(tex, mimeType);
        }
      }

      clonedMaterials.set(mat, matClone);
      return matClone;
    });

    obj.material = isArray ? nextMats : nextMats[0];
  });

  return {
    cleanup: () => {
      clonedMaterials.forEach((m) => m.dispose());
      clonedMaterials.clear();
      // Do NOT dispose underlying shared GPU image sources; only drop texture wrapper references
      clonedTextures.clear();
    },
  };
}
