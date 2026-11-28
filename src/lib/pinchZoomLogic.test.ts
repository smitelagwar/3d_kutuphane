import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampPinchScale,
  computePinchBackdropOpacity,
  computePinchDistance,
  computePinchMidpoint,
  computePinchTransform,
} from './pinchZoomLogic';

test('computePinchDistance and computePinchMidpoint compute exact Euclidean geometry', () => {
  const p1 = { x: 100, y: 200 };
  const p2 = { x: 160, y: 280 };
  assert.equal(computePinchDistance(p1, p2), 100);
  assert.deepEqual(computePinchMidpoint(p1, p2), { x: 130, y: 240 });
});

test('clampPinchScale preserves 1:1 range and applies rubber-band outside bounds', () => {
  assert.equal(clampPinchScale(1.8), 1.8);
  const under = clampPinchScale(0.4);
  assert.ok(under >= 0.92 && under < 1, `Expected soft rubber-band under 1, got ${under}`);
  const over = clampPinchScale(6.0);
  assert.ok(over > 3.5 && over <= 3.95, `Expected soft rubber-band past max, got ${over}`);
});

test('computePinchBackdropOpacity ramps smoothly from 0 to 0.86', () => {
  assert.equal(computePinchBackdropOpacity(1.0), 0);
  const mid = computePinchBackdropOpacity(1.55);
  assert.ok(mid > 0.3 && mid < 0.55, `Expected mid scrim opacity, got ${mid}`);
  assert.equal(computePinchBackdropOpacity(2.6), 0.86);
});

test('computePinchTransform anchors focal origin and tracks two-finger pan outside card box', () => {
  const res = computePinchTransform({
    startDist: 80,
    currentDist: 160,
    startMid: { x: 180, y: 310 },
    currentMid: { x: 210, y: 270 },
    originRect: { left: 20, top: 200, width: 350, height: 262 },
  });
  assert.equal(res.scale, 2);
  assert.equal(res.originX, 160);
  assert.equal(res.originY, 110);
  assert.equal(res.tx, 30);
  assert.equal(res.ty, -40);
  assert.ok(res.backdropOpacity > 0.7, `Expected strong scrim at 2x scale, got ${res.backdropOpacity}`);
});
