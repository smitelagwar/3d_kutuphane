import test from 'node:test';
import assert from 'node:assert/strict';
import {
  chooseExportTextureMimeType,
  formatGlbByteSize,
  isDirectBinaryGlbUrl,
} from './glbExportOptimization';

test('chooseExportTextureMimeType uses JPEG for opaque PBR maps and PNG only for alpha', () => {
  assert.equal(chooseExportTextureMimeType('map', false), 'image/jpeg');
  assert.equal(chooseExportTextureMimeType('normalMap', false), 'image/jpeg');
  assert.equal(chooseExportTextureMimeType('roughnessMap', false), 'image/jpeg');
  assert.equal(chooseExportTextureMimeType('metalnessMap', false), 'image/jpeg');
  assert.equal(chooseExportTextureMimeType('bumpMap', false), 'image/jpeg');
  assert.equal(chooseExportTextureMimeType('map', true), 'image/png');
  assert.equal(chooseExportTextureMimeType('alphaMap', false), 'image/png');
  assert.equal(chooseExportTextureMimeType('normalMap', true), 'image/jpeg');
});

test('isDirectBinaryGlbUrl recognizes .glb paths and HF binary proxy endpoints', () => {
  assert.equal(isDirectBinaryGlbUrl('/api/v1/abo/glb/3/B07QHL2CX3.glb'), true);
  assert.equal(isDirectBinaryGlbUrl('/api/v1/hf/glb/simready-glb/toilet_a01'), true);
  assert.equal(isDirectBinaryGlbUrl('/api/v1/hf/glb/usdcraft-glb/ds_r228_04'), true);
  assert.equal(isDirectBinaryGlbUrl('/api/v1/polyhaven/sofa_01/model.gltf'), false);
  assert.equal(isDirectBinaryGlbUrl(undefined), false);
});

test('formatGlbByteSize formats KB and MB cleanly', () => {
  assert.equal(formatGlbByteSize(0), '0 KB');
  assert.equal(formatGlbByteSize(512_000), '500 KB');
  assert.equal(formatGlbByteSize(1_572_864), '1.5 MB');
});
