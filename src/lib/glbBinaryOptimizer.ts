import sharp from 'sharp';
import { NodeIO } from '@gltf-transform/core';
import { prune, simplify, weld } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';

export const GLB_MAGIC = 0x46546c67; // 'glTF'
export const GLB_VERSION = 2;
export const GLB_CHUNK_JSON = 0x4e4f534a; // 'JSON'
export const GLB_CHUNK_BIN = 0x004e4942; // 'BIN\0'

export interface GltfBufferView {
  buffer: number;
  byteOffset?: number;
  byteLength: number;
  byteStride?: number;
  target?: number;
  name?: string;
  extensions?: Record<string, unknown>;
  extras?: unknown;
}

export interface GltfImage {
  uri?: string;
  mimeType?: string;
  bufferView?: number;
  name?: string;
  extensions?: Record<string, unknown>;
  extras?: unknown;
}

export interface GltfTexture {
  sampler?: number;
  source?: number;
  name?: string;
  extensions?: {
    EXT_texture_webp?: { source?: number };
    [key: string]: unknown;
  };
  extras?: unknown;
}

export interface GltfMaterial {
  name?: string;
  alphaMode?: 'OPAQUE' | 'MASK' | 'BLEND';
  pbrMetallicRoughness?: {
    baseColorTexture?: { index: number };
    metallicRoughnessTexture?: { index: number };
  };
  normalTexture?: { index: number };
  occlusionTexture?: { index: number };
  emissiveTexture?: { index: number };
  extensions?: Record<string, unknown>;
}

export interface GltfAccessor {
  bufferView?: number;
  sparse?: {
    indices?: { bufferView?: number };
    values?: { bufferView?: number };
  };
}

export interface GltfDocument {
  asset?: Record<string, unknown>;
  buffers?: Array<{ byteLength: number; uri?: string }>;
  bufferViews?: GltfBufferView[];
  accessors?: GltfAccessor[];
  images?: GltfImage[];
  textures?: GltfTexture[];
  materials?: GltfMaterial[];
  extensionsUsed?: string[];
  extensionsRequired?: string[];
  [key: string]: unknown;
}

export interface ParsedGlbContainer {
  json: GltfDocument;
  bin: Buffer;
}

export interface GlbImageRole {
  isNormal: boolean;
  isDataMap: boolean;
  requiresAlphaByMaterial: boolean;
  usedByWebpExt: boolean;
}

export interface GlbOptimizeOptions {
  /** Skip optimization if whole GLB <= this size AND no single image > singleImageThresholdBytes */
  skipThresholdBytes?: number;
  singleImageThresholdBytes?: number;
  /** Run automatic mesh simplification if GLB is STILL larger than this after texture compression */
  geometrySimplifyThresholdBytes?: number;
  /** Target triangle budget when simplifying ultra-high-poly raw scan/SimReady meshes */
  targetMaxTriangles?: number;
  maxBaseColorDim?: number;
  maxDataMapDim?: number;
  baseColorJpegQuality?: number;
  normalJpegQuality?: number;
  dataJpegQuality?: number;
}

export interface GlbOptimizeResult {
  buffer: Buffer;
  originalBytes: number;
  optimizedBytes: number;
  wasOptimized: boolean;
  imagesOptimized: number;
  geometrySimplified: boolean;
}

export const DEFAULT_GLB_OPTIMIZE_OPTIONS: Required<GlbOptimizeOptions> = {
  skipThresholdBytes: 4 * 1024 * 1024, // 4 MB
  singleImageThresholdBytes: 1.2 * 1024 * 1024, // 1.2 MB
  geometrySimplifyThresholdBytes: 5 * 1024 * 1024, // 5 MB
  targetMaxTriangles: 65_000,
  maxBaseColorDim: 1024,
  maxDataMapDim: 1024,
  baseColorJpegQuality: 86,
  normalJpegQuality: 90,
  dataJpegQuality: 88,
};

/**
 * Parses a glTF 2.0 binary (.glb) buffer into its JSON document and binary chunk.
 * Throws if header or chunk framing is invalid.
 */
export function parseGlbContainer(raw: Buffer): ParsedGlbContainer {
  if (raw.byteLength < 20) {
    throw new Error('Invalid GLB: buffer too short.');
  }
  const magic = raw.readUInt32LE(0);
  const version = raw.readUInt32LE(4);
  const totalLength = raw.readUInt32LE(8);
  if (magic !== GLB_MAGIC || version !== GLB_VERSION) {
    throw new Error(`Invalid GLB header: magic=0x${magic.toString(16)} version=${version}`);
  }
  if (totalLength > raw.byteLength) {
    throw new Error(`Truncated GLB: declared ${totalLength} bytes, got ${raw.byteLength}`);
  }

  let offset = 12;
  let json: GltfDocument | null = null;
  let bin: Buffer = Buffer.alloc(0);

  while (offset + 8 <= totalLength) {
    const chunkLength = raw.readUInt32LE(offset);
    const chunkType = raw.readUInt32LE(offset + 4);
    const dataStart = offset + 8;
    const dataEnd = dataStart + chunkLength;
    if (dataEnd > totalLength) {
      throw new Error('Invalid GLB: chunk exceeds file bounds.');
    }

    if (chunkType === GLB_CHUNK_JSON) {
      const jsonStr = raw.subarray(dataStart, dataEnd).toString('utf8').trim();
      json = JSON.parse(jsonStr) as GltfDocument;
    } else if (chunkType === GLB_CHUNK_BIN) {
      bin = raw.subarray(dataStart, dataEnd);
    }
    offset = dataEnd;
  }

  if (!json) {
    throw new Error('Invalid GLB: missing JSON chunk.');
  }
  return { json, bin };
}

/**
 * Packs a glTF 2.0 JSON document and BIN chunk into a strictly 4-byte-aligned .glb Buffer.
 */
export function packGlbContainer(json: GltfDocument, bin: Buffer): Buffer {
  const jsonRaw = Buffer.from(JSON.stringify(json), 'utf8');
  const jsonPad = (4 - (jsonRaw.byteLength % 4)) % 4;
  const jsonChunkLen = jsonRaw.byteLength + jsonPad;

  const binPad = (4 - (bin.byteLength % 4)) % 4;
  const binChunkLen = bin.byteLength + binPad;

  const hasBin = binChunkLen > 0;
  const totalLength = 12 + 8 + jsonChunkLen + (hasBin ? 8 + binChunkLen : 0);

  const out = Buffer.allocUnsafe(totalLength);
  out.writeUInt32LE(GLB_MAGIC, 0);
  out.writeUInt32LE(GLB_VERSION, 4);
  out.writeUInt32LE(totalLength, 8);

  // JSON chunk (padded with 0x20 ASCII spaces per glTF 2.0 spec)
  out.writeUInt32LE(jsonChunkLen, 12);
  out.writeUInt32LE(GLB_CHUNK_JSON, 16);
  jsonRaw.copy(out, 20);
  if (jsonPad > 0) {
    out.fill(0x20, 20 + jsonRaw.byteLength, 20 + jsonChunkLen);
  }

  // BIN chunk (padded with 0x00 zero bytes per glTF 2.0 spec)
  if (hasBin) {
    const binHeaderOffset = 20 + jsonChunkLen;
    out.writeUInt32LE(binChunkLen, binHeaderOffset);
    out.writeUInt32LE(GLB_CHUNK_BIN, binHeaderOffset + 4);
    bin.copy(out, binHeaderOffset + 8);
    if (binPad > 0) {
      out.fill(0x00, binHeaderOffset + 8 + bin.byteLength, binHeaderOffset + 8 + binChunkLen);
    }
  }

  return out;
}

/**
 * Inspects glTF materials & textures to classify every image index by PBR semantic role
 * (normal map, roughness/metalness/occlusion data map, or alpha-blended albedo).
 */
export function classifyGlbImageRoles(doc: GltfDocument): Map<number, GlbImageRole> {
  const roles = new Map<number, GlbImageRole>();
  const textures = doc.textures ?? [];
  const materials = doc.materials ?? [];

  const getRole = (imgIdx: number): GlbImageRole => {
    let existing = roles.get(imgIdx);
    if (!existing) {
      existing = {
        isNormal: false,
        isDataMap: false,
        requiresAlphaByMaterial: false,
        usedByWebpExt: false,
      };
      roles.set(imgIdx, existing);
    }
    return existing;
  };

  const resolveTexImageIndex = (texIdx: number | undefined): number | null => {
    if (typeof texIdx !== 'number' || texIdx < 0 || texIdx >= textures.length) return null;
    const tex = textures[texIdx];
    const webpSrc = tex?.extensions?.EXT_texture_webp?.source;
    if (typeof webpSrc === 'number') {
      getRole(webpSrc).usedByWebpExt = true;
      return webpSrc;
    }
    if (typeof tex?.source === 'number') return tex.source;
    return null;
  };

  for (const tex of textures) {
    const webpSrc = tex?.extensions?.EXT_texture_webp?.source;
    if (typeof webpSrc === 'number') {
      getRole(webpSrc).usedByWebpExt = true;
    }
  }

  for (const mat of materials) {
    const alphaMode = mat.alphaMode || 'OPAQUE';
    const baseIdx = resolveTexImageIndex(mat.pbrMetallicRoughness?.baseColorTexture?.index);
    if (baseIdx !== null) {
      const r = getRole(baseIdx);
      if (alphaMode === 'BLEND' || alphaMode === 'MASK') {
        r.requiresAlphaByMaterial = true;
      }
    }

    const mrIdx = resolveTexImageIndex(mat.pbrMetallicRoughness?.metallicRoughnessTexture?.index);
    if (mrIdx !== null) {
      getRole(mrIdx).isDataMap = true;
    }

    const normIdx = resolveTexImageIndex(mat.normalTexture?.index);
    if (normIdx !== null) {
      getRole(normIdx).isNormal = true;
    }

    const occIdx = resolveTexImageIndex(mat.occlusionTexture?.index);
    if (occIdx !== null) {
      getRole(occIdx).isDataMap = true;
    }

    const emiIdx = resolveTexImageIndex(mat.emissiveTexture?.index);
    if (emiIdx !== null) {
      // Emissive is color-like; ensure entry exists
      getRole(emiIdx);
    }
  }

  return roles;
}

/**
 * Returns the set of bufferView indices referenced by geometry/animation accessors
 * so texture re-packing NEVER touches geometry bufferViews.
 */
export function collectAccessorBufferViewIndices(doc: GltfDocument): Set<number> {
  const used = new Set<number>();
  for (const acc of doc.accessors ?? []) {
    if (typeof acc.bufferView === 'number') used.add(acc.bufferView);
    if (typeof acc.sparse?.indices?.bufferView === 'number') {
      used.add(acc.sparse.indices.bufferView);
    }
    if (typeof acc.sparse?.values?.bufferView === 'number') {
      used.add(acc.sparse.values.bufferView);
    }
  }
  return used;
}

/**
 * Quick pre-check to determine whether a GLB container benefits from texture or geometry optimization.
 */
export function shouldOptimizeGlb(
  totalBytes: number,
  doc: GltfDocument,
  options: GlbOptimizeOptions = {},
): boolean {
  const cfg = { ...DEFAULT_GLB_OPTIMIZE_OPTIONS, ...options };
  const bufferViews = doc.bufferViews ?? [];
  if (bufferViews.length === 0) return false;

  if (totalBytes > cfg.skipThresholdBytes) return true;

  const images = doc.images ?? [];
  for (const img of images) {
    if (typeof img.bufferView !== 'number') continue;
    const bv = bufferViews[img.bufferView];
    if (bv && bv.byteLength > cfg.singleImageThresholdBytes) {
      return true;
    }
  }
  return false;
}

/**
 * Stage 2 optimizer: decimates ultra-high-poly meshes (e.g., 500k–1.2M triangle SimReady
 * folded towels) down to an architectural-grade triangle budget while preserving UVs, normals,
 * and standard glTF 2.0 compatibility (no custom decoder required in Blender/Three.js).
 */
async function simplifyHeavyGlbGeometry(
  glbBuffer: Buffer,
  cfg: Required<GlbOptimizeOptions>,
): Promise<{ buffer: Buffer; simplified: boolean }> {
  if (glbBuffer.byteLength <= cfg.geometrySimplifyThresholdBytes) {
    return { buffer: glbBuffer, simplified: false };
  }

  try {
    const io = new NodeIO();
    const doc = await io.readBinary(new Uint8Array(glbBuffer));

    let totalTriangles = 0;
    for (const mesh of doc.getRoot().listMeshes()) {
      for (const prim of mesh.listPrimitives()) {
        // mode 4 === TRIANGLES (default in glTF 2.0)
        if (prim.getMode() !== 4) continue;
        const indices = prim.getIndices();
        if (indices) {
          totalTriangles += Math.floor(indices.getCount() / 3);
        } else {
          const pos = prim.getAttribute('POSITION');
          if (pos) totalTriangles += Math.floor(pos.getCount() / 3);
        }
      }
    }

    if (totalTriangles <= cfg.targetMaxTriangles) {
      return { buffer: glbBuffer, simplified: false };
    }

    const ratio = Math.max(0.03, Math.min(0.85, cfg.targetMaxTriangles / totalTriangles));
    await MeshoptSimplifier.ready;
    await doc.transform(
      weld(),
      simplify({
        simplifier: MeshoptSimplifier,
        ratio,
        error: 0.0025,
      }),
      prune(),
    );

    const outBytes = await io.writeBinary(doc);
    const outBuf = Buffer.from(outBytes.buffer, outBytes.byteOffset, outBytes.byteLength);
    if (outBuf.byteLength < glbBuffer.byteLength * 0.88) {
      return { buffer: outBuf, simplified: true };
    }
    return { buffer: glbBuffer, simplified: false };
  } catch {
    return { buffer: glbBuffer, simplified: false };
  }
}

async function compressEmbeddedImage(
  imgBytes: Buffer,
  currentMime: string | undefined,
  role: GlbImageRole | undefined,
  cfg: Required<GlbOptimizeOptions>,
): Promise<{ data: Buffer; mimeType: string; changed: boolean }> {
  // Already tiny images don't need recompression
  if (imgBytes.byteLength <= 180 * 1024 && currentMime === 'image/jpeg') {
    return { data: imgBytes, mimeType: currentMime, changed: false };
  }

  // Skip KTX2 / Basis / non-raster formats
  if (currentMime && !/^image\/(png|jpeg|jpg|webp)$/i.test(currentMime)) {
    return { data: imgBytes, mimeType: currentMime, changed: false };
  }

  const pipeline = sharp(imgBytes, { failOn: 'none', limitInputPixels: false });
  const meta = await pipeline.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (width < 4 || height < 4) {
    return { data: imgBytes, mimeType: currentMime || 'image/png', changed: false };
  }

  const isNormal = Boolean(role?.isNormal);
  const isDataMap = Boolean(role?.isDataMap);
  const maxDim = isNormal || isDataMap ? cfg.maxDataMapDim : cfg.maxBaseColorDim;
  const needsResize = width > maxDim || height > maxDim;

  // Check real transparency: many 4K ABO PNGs are saved as RGBA even when alpha is 255 everywhere!
  let hasRealTransparency = false;
  if (meta.hasAlpha && !isNormal && !isDataMap) {
    if (role?.requiresAlphaByMaterial) {
      hasRealTransparency = true;
    } else {
      try {
        const stats = await sharp(imgBytes, { failOn: 'none', limitInputPixels: false }).stats();
        const alphaChannel = stats.channels[3];
        if (alphaChannel && alphaChannel.min < 250) {
          hasRealTransparency = true;
        }
      } catch {
        hasRealTransparency = false;
      }
    }
  }

  // Keep already-compact WebP unless it's genuinely oversized (> 1024px or > 800 KB)
  if (currentMime === 'image/webp' && !needsResize && imgBytes.byteLength <= 800 * 1024) {
    return { data: imgBytes, mimeType: currentMime, changed: false };
  }

  let work = sharp(imgBytes, { failOn: 'none', limitInputPixels: false });
  if (needsResize) {
    work = work.resize({
      width: maxDim,
      height: maxDim,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  let encoded: Buffer;
  let outMime: string;

  if (hasRealTransparency) {
    encoded = await work
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: false,
      })
      .toBuffer();
    outMime = 'image/png';
  } else {
    const quality = isNormal
      ? cfg.normalJpegQuality
      : isDataMap
        ? cfg.dataJpegQuality
        : cfg.baseColorJpegQuality;
    // Use 4:4:4 chroma subsampling for normal & metallicRoughness data maps to preserve channel precision
    const chromaSubsampling = isNormal || isDataMap ? '4:4:4' : '4:2:0';
    encoded = await work
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg({
        quality,
        chromaSubsampling,
        mozjpeg: true,
      })
      .toBuffer();
    outMime = 'image/jpeg';
  }

  // Only adopt the compressed image if it actually saves space OR downscales an oversized texture
  if (encoded.byteLength < imgBytes.byteLength * 0.96 || (needsResize && encoded.byteLength < imgBytes.byteLength)) {
    return { data: encoded, mimeType: outMime, changed: true };
  }
  return { data: imgBytes, mimeType: currentMime || 'image/png', changed: false };
}

/**
 * Optimizes an oversized binary .glb buffer:
 *  Stage 1: Downscales & compresses embedded 2K/4K lossless PNG textures into crisp <=1024px JPEG
 *           (preserving real alpha PNGs and leaving geometry untouched).
 *  Stage 2: If the file is STILL >5 MB due to ultra-high-poly raw geometry (e.g. 1M+ triangle
 *           SimReady scans), simplifies geometry to ~65k triangles via MeshoptSimplifier.
 */
export async function optimizeGlbBuffer(
  rawGlb: Buffer,
  options: GlbOptimizeOptions = {},
): Promise<GlbOptimizeResult> {
  const cfg = { ...DEFAULT_GLB_OPTIMIZE_OPTIONS, ...options };
  const originalBytes = rawGlb.byteLength;

  let parsed: ParsedGlbContainer;
  try {
    parsed = parseGlbContainer(rawGlb);
  } catch {
    return {
      buffer: rawGlb,
      originalBytes,
      optimizedBytes: originalBytes,
      wasOptimized: false,
      imagesOptimized: 0,
      geometrySimplified: false,
    };
  }

  const { json, bin } = parsed;
  if (!shouldOptimizeGlb(originalBytes, json, cfg)) {
    return {
      buffer: rawGlb,
      originalBytes,
      optimizedBytes: originalBytes,
      wasOptimized: false,
      imagesOptimized: 0,
      geometrySimplified: false,
    };
  }

  const bufferViews = json.bufferViews ?? [];
  const images = json.images ?? [];
  const accessorViews = collectAccessorBufferViewIndices(json);
  const imageRoles = classifyGlbImageRoles(json);

  // Map bufferViewIndex -> list of image indices referencing it
  const bvToImages = new Map<number, number[]>();
  for (let i = 0; i < images.length; i++) {
    const bvIdx = images[i].bufferView;
    if (typeof bvIdx === 'number' && bvIdx >= 0 && bvIdx < bufferViews.length) {
      const list = bvToImages.get(bvIdx) ?? [];
      list.push(i);
      bvToImages.set(bvIdx, list);
    }
  }

  // Stage 1: Compress eligible image bufferViews
  const replacedBvData = new Map<number, { data: Buffer; mimeType: string }>();
  let imagesOptimized = 0;

  for (const [bvIdx, imgIndices] of bvToImages.entries()) {
    if (accessorViews.has(bvIdx)) continue; // Safety: never alter accessor-backed bufferViews
    const bv = bufferViews[bvIdx];
    if (!bv || bv.buffer !== 0) continue;

    const start = bv.byteOffset ?? 0;
    const end = start + bv.byteLength;
    if (start < 0 || end > bin.byteLength || bv.byteLength <= 0) continue;

    // Combine roles if multiple images share a bufferView
    const combinedRole: GlbImageRole = {
      isNormal: imgIndices.some((idx) => imageRoles.get(idx)?.isNormal),
      isDataMap: imgIndices.some((idx) => imageRoles.get(idx)?.isDataMap),
      requiresAlphaByMaterial: imgIndices.some((idx) => imageRoles.get(idx)?.requiresAlphaByMaterial),
      usedByWebpExt: imgIndices.some((idx) => imageRoles.get(idx)?.usedByWebpExt),
    };

    const currentMime = images[imgIndices[0]].mimeType;
    const rawSlice = bin.subarray(start, end);

    try {
      const res = await compressEmbeddedImage(rawSlice, currentMime, combinedRole, cfg);
      if (res.changed) {
        replacedBvData.set(bvIdx, { data: res.data, mimeType: res.mimeType });
        imagesOptimized += imgIndices.length;
      }
    } catch {
      // Keep original image bytes on any decode error
    }
  }

  let workingGlb = rawGlb;

  if (replacedBvData.size > 0) {
    // Rebuild BIN chunk: preserve all non-replaced bufferViews intact and pack replaced image views cleanly at 4-byte offsets
    const newJson: GltfDocument = JSON.parse(JSON.stringify(json)) as GltfDocument;
    const newBufferViews = newJson.bufferViews ?? [];
    const newImages = newJson.images ?? [];
    const newTextures = newJson.textures ?? [];

    const chunks: Buffer[] = [];
    let cursor = 0;

    const appendAligned = (slice: Buffer): number => {
      const pad = (4 - (cursor % 4)) % 4;
      if (pad > 0) {
        chunks.push(Buffer.alloc(pad));
        cursor += pad;
      }
      const offset = cursor;
      chunks.push(slice);
      cursor += slice.byteLength;
      return offset;
    };

    for (let bvIdx = 0; bvIdx < newBufferViews.length; bvIdx++) {
      const bv = newBufferViews[bvIdx];
      if (bv.buffer !== 0) continue;

      const replaced = replacedBvData.get(bvIdx);
      if (replaced) {
        const newOffset = appendAligned(replaced.data);
        bv.byteOffset = newOffset;
        bv.byteLength = replaced.data.byteLength;

        const imgIndices = bvToImages.get(bvIdx) ?? [];
        for (const imgIdx of imgIndices) {
          if (newImages[imgIdx]) {
            newImages[imgIdx].mimeType = replaced.mimeType;
            // If this image was converted from WebP to JPEG/PNG, migrate EXT_texture_webp textures to standard source
            if (replaced.mimeType !== 'image/webp') {
              for (const tex of newTextures) {
                if (tex.extensions?.EXT_texture_webp?.source === imgIdx) {
                  tex.source = imgIdx;
                  delete tex.extensions.EXT_texture_webp;
                  if (Object.keys(tex.extensions).length === 0) {
                    delete tex.extensions;
                  }
                }
              }
            }
          }
        }
      } else {
        const origStart = bv.byteOffset ?? 0;
        const origEnd = origStart + bv.byteLength;
        const origSlice = bin.subarray(origStart, origEnd);
        const newOffset = appendAligned(origSlice);
        bv.byteOffset = newOffset;
      }
    }

    // Clean up EXT_texture_webp extension declaration if no textures reference it anymore
    const anyWebpLeft = newTextures.some((t) => Boolean(t.extensions?.EXT_texture_webp));
    if (!anyWebpLeft) {
      if (Array.isArray(newJson.extensionsUsed)) {
        newJson.extensionsUsed = newJson.extensionsUsed.filter((e) => e !== 'EXT_texture_webp');
        if (newJson.extensionsUsed.length === 0) delete newJson.extensionsUsed;
      }
      if (Array.isArray(newJson.extensionsRequired)) {
        newJson.extensionsRequired = newJson.extensionsRequired.filter(
          (e) => e !== 'EXT_texture_webp',
        );
        if (newJson.extensionsRequired.length === 0) delete newJson.extensionsRequired;
      }
    }

    const newBin = Buffer.concat(chunks);
    if (Array.isArray(newJson.buffers) && newJson.buffers[0]) {
      newJson.buffers[0].byteLength = newBin.byteLength;
    }

    const texPacked = packGlbContainer(newJson, newBin);
    if (texPacked.byteLength < rawGlb.byteLength) {
      workingGlb = texPacked;
    } else {
      imagesOptimized = 0;
    }
  }

  // Stage 2: If GLB is still heavy (>5 MB) due to ultra-high-poly raw geometry, simplify meshes
  let geometrySimplified = false;
  if (workingGlb.byteLength > cfg.geometrySimplifyThresholdBytes) {
    const geoRes = await simplifyHeavyGlbGeometry(workingGlb, cfg);
    if (geoRes.simplified && geoRes.buffer.byteLength < workingGlb.byteLength) {
      workingGlb = geoRes.buffer;
      geometrySimplified = true;
    }
  }

  // Never return a larger file than we started with
  if (workingGlb.byteLength >= originalBytes) {
    return {
      buffer: rawGlb,
      originalBytes,
      optimizedBytes: originalBytes,
      wasOptimized: false,
      imagesOptimized: 0,
      geometrySimplified: false,
    };
  }

  return {
    buffer: workingGlb,
    originalBytes,
    optimizedBytes: workingGlb.byteLength,
    wasOptimized: true,
    imagesOptimized,
    geometrySimplified,
  };
}
