import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampCardDragOffsetPx,
  isHorizontalSwipeGesture,
  resolveSwipeTargetSlide,
} from './cardSwipeLogic';

test('isHorizontalSwipeGesture distinguishes horizontal swipes from vertical scrolling', () => {
  assert.equal(isHorizontalSwipeGesture({ dx: -24, dy: 4 }), true);
  assert.equal(isHorizontalSwipeGesture({ dx: 18, dy: -6 }), true);
  // Mostly vertical scroll must NOT trigger horizontal card swipe
  assert.equal(isHorizontalSwipeGesture({ dx: 14, dy: 30 }), false);
  // Micro-jitter during tap must NOT trigger horizontal card swipe
  assert.equal(isHorizontalSwipeGesture({ dx: 6, dy: 1 }), false);
});

test('resolveSwipeTargetSlide switches cleanly between room render (0) and bare cutout (1)', () => {
  assert.equal(
    resolveSwipeTargetSlide({ currentSlide: 0, dx: -52, containerWidth: 320 }),
    1,
  );
  assert.equal(
    resolveSwipeTargetSlide({ currentSlide: 1, dx: 52, containerWidth: 320 }),
    0,
  );
  // Small drag below threshold rebounds to current slide
  assert.equal(
    resolveSwipeTargetSlide({ currentSlide: 0, dx: -15, containerWidth: 320 }),
    0,
  );
  assert.equal(
    resolveSwipeTargetSlide({ currentSlide: 1, dx: 12, containerWidth: 320 }),
    1,
  );
  // Swiping past outer boundaries stays clamped on current slide
  assert.equal(
    resolveSwipeTargetSlide({ currentSlide: 0, dx: 80, containerWidth: 320 }),
    0,
  );
  assert.equal(
    resolveSwipeTargetSlide({ currentSlide: 1, dx: -80, containerWidth: 320 }),
    1,
  );
});

test('clampCardDragOffsetPx tracks 1:1 inside bounds and applies rubber-band outside edges', () => {
  assert.equal(clampCardDragOffsetPx(0, -120, 300), -120);
  assert.equal(clampCardDragOffsetPx(1, 120, 300), 120);
  assert.ok(clampCardDragOffsetPx(0, 100, 300) > 0 && clampCardDragOffsetPx(0, 100, 300) < 30);
  assert.ok(clampCardDragOffsetPx(1, -100, 300) < 0 && clampCardDragOffsetPx(1, -100, 300) > -30);
});
