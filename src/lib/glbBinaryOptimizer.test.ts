import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {
  classifyGlbImageRoles,
  optimizeGlbBuffer,
  packGlbContainer,
  parseGlbContainer,
  type GltfDocument,
} from './glbBinaryOptimizer';

async function createNoisyPng(width: number, height: number, withAlphaHole = false): Promise<Buffer> {
  const channels = withAlphaHole ? 4 : 3;
  const raw = Buffer.alloc(width * height * channels);
  let seed = 0x12345678;
  for (let y = 0; y < height; y++) {
    const waveY = Math.sin(y * 0.04) * 35;
    for (let x = 0; x < width; x++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const grain = ((seed >>> 24) & 31) - 16;
      const idx = (y * width + x) * channels;
      raw[idx] = Math.max(0, Math.min(255, Math.round(145 + waveY + Math.cos(x * 0.03) * 35 + grain)));
      raw[idx + 1] = Math.max(0, Math.min(255, Math.round(135 + Math.sin((x + y) * 0.025) * 30 + grain)));
      raw[idx + 2] = Math.max(0, Math.min(255, Math.round(190 + Math.cos((x - y) * 0.02) * 25 + grain)));
      if (withAlphaHole) {
        raw[idx + 3] = x < width / 4 && y < height / 4 ? 0 : 255;
      }
    }
  }
  return sharp(raw, { raw: { width, height, channels } }).png({ compressionLevel: 1 }).toBuffer();
}

function buildTestGlb(
  geometryBytes: Buffer,
  images: Array<{ data: Buffer; mimeType: string; name: string }>,
  materials: GltfDocument['materials'],
): Buffer {
  const chunks: Buffer[] = [];
  const bufferViews: NonNullable<GltfDocument['bufferViews']> = [];
  let offset = 0;

  const pushView = (buf: Buffer) => {
    const pad = (4 - (offset % 4)) % 4;
    if (pad > 0) {
      chunks.push(Buffer.alloc(pad));
      offset += pad;
    }
    const bvIdx = bufferViews.length;
    bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: buf.byteLength });
    chunks.push(buf);
    offset += buf.byteLength;
    return bvIdx;
  };

  const geoBvIdx = pushView(geometryBytes);
  const gltfImages: NonNullable<GltfDocument['images']> = [];
  const gltfTextures: NonNullable<GltfDocument['textures']> = [];

  for (let i = 0; i < images.length; i++) {
    const bvIdx = pushView(images[i].data);
    gltfImages.push({ bufferView: bvIdx, mimeType: images[i].mimeType, name: images[i].name });
    gltfTextures.push({ source: i });
  }

  const bin = Buffer.concat(chunks);
  const doc: GltfDocument = {
    asset: { version: '2.0' },
    buffers: [{ byteLength: bin.byteLength }],
    bufferViews,
    accessors: [{ bufferView: geoBvIdx }],
    images: gltfImages,
    textures: gltfTextures,
    materials,
  };
  return packGlbContainer(doc, bin);
}

test('packGlbContainer & parseGlbContainer round-trip preserves geometry bytes bit-for-bit', () => {
  const geo = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const doc: GltfDocument = {
    asset: { version: '2.0' },
    buffers: [{ byteLength: geo.byteLength }],
    bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: geo.byteLength }],
    accessors: [{ bufferView: 0 }],
  };
  const glb = packGlbContainer(doc, geo);
  const parsed = parseGlbContainer(glb);
  assert.equal(parsed.json.asset?.version, '2.0');
  assert.deepEqual(parsed.bin.subarray(0, geo.byteLength), geo);
});

test('classifyGlbImageRoles identifies baseColor, normal, orm, and alpha-blend materials', () => {
  const doc: GltfDocument = {
    textures: [{ source: 0 }, { source: 1 }, { source: 2 }],
    materials: [
      {
        alphaMode: 'BLEND',
        pbrMetallicRoughness: {
          baseColorTexture: { index: 0 },
          metallicRoughnessTexture: { index: 2 },
        },
        normalTexture: { index: 1 },
      },
    ],
  };
  const roles = classifyGlbImageRoles(doc);
  assert.equal(roles.get(0)?.requiresAlphaByMaterial, true);
  assert.equal(roles.get(1)?.isNormal, true);
  assert.equal(roles.get(2)?.isDataMap, true);
});

test('optimizeGlbBuffer drastically shrinks oversized PNG textures while preserving geometry', async () => {
  const geo = Buffer.from('GEOMETRY_VERTEX_BUFFER_0123456789ABCDEF');
  const bigBaseColorPng = await createNoisyPng(1600, 1600, false);
  const bigNormalPng = await createNoisyPng(1600, 1600, false);

  const glb = buildTestGlb(
    geo,
    [
      { data: bigBaseColorPng, mimeType: 'image/png', name: 'Base_Color.png' },
      { data: bigNormalPng, mimeType: 'image/png', name: 'Normal.png' },
    ],
    [
      {
        alphaMode: 'OPAQUE',
        pbrMetallicRoughness: { baseColorTexture: { index: 0 } },
        normalTexture: { index: 1 },
      },
    ],
  );

  const result = await optimizeGlbBuffer(glb, {
    skipThresholdBytes: 500_000,
    singleImageThresholdBytes: 200_000,
    maxBaseColorDim: 1024,
    maxDataMapDim: 1024,
  });

  assert.equal(result.wasOptimized, true);
  assert.equal(result.imagesOptimized, 2);
  assert.ok(
    result.optimizedBytes < result.originalBytes * 0.25,
    `Expected >75% reduction, got ${result.originalBytes} -> ${result.optimizedBytes}`,
  );

  const parsed = parseGlbContainer(result.buffer);
  assert.equal(parsed.json.images?.[0]?.mimeType, 'image/jpeg');
  assert.equal(parsed.json.images?.[1]?.mimeType, 'image/jpeg');

  // Verify geometry bufferView is byte-for-byte intact
  const geoBv = parsed.json.bufferViews![0];
  const recoveredGeo = parsed.bin.subarray(geoBv.byteOffset!, geoBv.byteOffset! + geoBv.byteLength);
  assert.deepEqual(recoveredGeo, geo);
});

test('optimizeGlbBuffer preserves PNG alpha channel for BLEND materials', async () => {
  const geo = Buffer.from('ALPHA_GEO_DATA_1234');
  const alphaPng = await createNoisyPng(1200, 1200, true);

  const glb = buildTestGlb(
    geo,
    [{ data: alphaPng, mimeType: 'image/png', name: 'Leaf_Alpha.png' }],
    [
      {
        alphaMode: 'BLEND',
        pbrMetallicRoughness: { baseColorTexture: { index: 0 } },
      },
    ],
  );

  const result = await optimizeGlbBuffer(glb, {
    skipThresholdBytes: 100_000,
    singleImageThresholdBytes: 100_000,
    maxBaseColorDim: 512,
  });

  assert.equal(result.wasOptimized, true);
  const parsed = parseGlbContainer(result.buffer);
  assert.equal(parsed.json.images?.[0]?.mimeType, 'image/png');
});

test('optimizeGlbBuffer simplifies ultra-high-poly geometry when file remains oversized', async () => {
  const { Document, NodeIO } = await import('@gltf-transform/core');
  const doc = new Document();
  const buf = doc.createBuffer();
  const segs = 120; // 120x120 grid = 28,800 triangles
  const verts = (segs + 1) * (segs + 1);
  const positions = new Float32Array(verts * 3);
  const normals = new Float32Array(verts * 3);
  let p = 0;
  for (let y = 0; y <= segs; y++) {
    for (let x = 0; x <= segs; x++) {
      const fx = x / segs;
      const fy = y / segs;
      positions[p] = fx;
      positions[p + 1] = 0.03 * Math.sin(fx * Math.PI * 2) * Math.cos(fy * Math.PI * 2);
      positions[p + 2] = fy;
      normals[p] = 0;
      normals[p + 1] = 1;
      normals[p + 2] = 0;
      p += 3;
    }
  }
  const indices = new Uint32Array(segs * segs * 6);
  let k = 0;
  for (let y = 0; y < segs; y++) {
    for (let x = 0; x < segs; x++) {
      const a = y * (segs + 1) + x;
      const b = a + 1;
      const c = a + (segs + 1);
      const d = c + 1;
      indices[k++] = a;
      indices[k++] = c;
      indices[k++] = b;
      indices[k++] = b;
      indices[k++] = c;
      indices[k++] = d;
    }
  }
  const prim = doc
    .createPrimitive()
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(positions).setBuffer(buf))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(normals).setBuffer(buf))
    .setIndices(doc.createAccessor().setType('SCALAR').setArray(indices).setBuffer(buf));
  const mesh = doc.createMesh('DenseGrid').addPrimitive(prim);
  const node = doc.createNode('GridNode').setMesh(mesh);
  doc.createScene('Scene').addChild(node);

  const io = new NodeIO();
  const rawBytes = await io.writeBinary(doc);
  const rawGlb = Buffer.from(rawBytes.buffer, rawBytes.byteOffset, rawBytes.byteLength);

  const result = await optimizeGlbBuffer(rawGlb, {
    skipThresholdBytes: 50_000,
    geometrySimplifyThresholdBytes: 50_000,
    targetMaxTriangles: 3_000,
  });

  assert.equal(result.wasOptimized, true);
  assert.equal(result.geometrySimplified, true);
  assert.ok(
    result.optimizedBytes < result.originalBytes * 0.4,
    `Expected >60% geometry reduction, got ${result.originalBytes} -> ${result.optimizedBytes}`,
  );
  const reparsed = parseGlbContainer(result.buffer);
  assert.equal(reparsed.json.asset?.version, '2.0');
});

