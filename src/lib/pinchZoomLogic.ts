export interface TouchPoint {
  x: number;
  y: number;
}

export interface RectBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface PinchTransformInput {
  startDist: number;
  currentDist: number;
  startMid: TouchPoint;
  currentMid: TouchPoint;
  originRect: RectBox;
  minScale?: number;
  maxScale?: number;
}

export interface PinchTransformResult {
  scale: number;
  tx: number;
  ty: number;
  originX: number;
  originY: number;
  backdropOpacity: number;
}

export const DEFAULT_PINCH_MIN_SCALE = 0.92;
export const DEFAULT_PINCH_MAX_SCALE = 3.5;

/**
 * Euclidean distance between two touch points in viewport CSS pixels.
 */
export function computePinchDistance(p1: TouchPoint, p2: TouchPoint): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

/**
 * Midpoint between two touch points in viewport CSS pixels.
 */
export function computePinchMidpoint(p1: TouchPoint, p2: TouchPoint): TouchPoint {
  return {
    x: (p1.x + p2.x) * 0.5,
    y: (p1.y + p2.y) * 0.5,
  };
}

/**
 * Smoothly clamps pinch scale with subtle rubber-band resistance past soft limits,
 * matching Instagram / Facebook native pinch-to-zoom feel.
 */
export function clampPinchScale(
  rawScale: number,
  minScale = DEFAULT_PINCH_MIN_SCALE,
  maxScale = DEFAULT_PINCH_MAX_SCALE,
): number {
  if (!Number.isFinite(rawScale) || rawScale <= 0) return 1;
  if (rawScale < 1) {
    // Gentle rubber-band when pinching slightly inward
    const under = 1 - rawScale;
    return Math.max(minScale, 1 - under * 0.35);
  }
  if (rawScale > maxScale) {
    // Gentle rubber-band past maxScale
    const over = rawScale - maxScale;
    return Math.min(maxScale + 0.45, maxScale + over * 0.18);
  }
  return rawScale;
}

/**
 * Maps current zoom scale to a smooth full-screen dark scrim opacity (0 -> 0.86).
 */
export function computePinchBackdropOpacity(scale: number): number {
  if (!Number.isFinite(scale) || scale <= 1.01) return 0;
  const t = Math.min(1, Math.max(0, (scale - 1.01) / 1.15));
  return Number((t * 0.86).toFixed(3));
}

/**
 * Computes exact CSS transform parameters so the image:
 *  1. Scales around the exact initial 2-finger midpoint inside the image rect
 *  2. Follows 2-finger midpoint dragging anywhere outside the original card box
 *  3. Smoothly fades in the full-screen backdrop scrim as scale grows
 */
export function computePinchTransform(input: PinchTransformInput): PinchTransformResult {
  const safeStartDist = Math.max(input.startDist, 8);
  const rawScale = input.currentDist / safeStartDist;
  const scale = clampPinchScale(
    rawScale,
    input.minScale ?? DEFAULT_PINCH_MIN_SCALE,
    input.maxScale ?? DEFAULT_PINCH_MAX_SCALE,
  );

  // Transform origin local to the image box (clamped slightly inside/around box for stability)
  const localOriginX = Math.min(
    input.originRect.width * 1.15,
    Math.max(-input.originRect.width * 0.15, input.startMid.x - input.originRect.left),
  );
  const localOriginY = Math.min(
    input.originRect.height * 1.15,
    Math.max(-input.originRect.height * 0.15, input.startMid.y - input.originRect.top),
  );

  // Pure midpoint drag keeps the exact pinched pixel anchored under the user's fingers
  const tx = input.currentMid.x - input.startMid.x;
  const ty = input.currentMid.y - input.startMid.y;

  return {
    scale,
    tx,
    ty,
    originX: localOriginX,
    originY: localOriginY,
    backdropOpacity: computePinchBackdropOpacity(scale),
  };
}
