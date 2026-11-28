export type CardMediaSlide = 0 | 1;

export interface SwipeGestureInput {
  dx: number;
  dy: number;
  lockThresholdPx?: number;
}

export interface SwipeResolveInput {
  currentSlide: CardMediaSlide;
  dx: number;
  containerWidth: number;
  thresholdRatio?: number;
  minThresholdPx?: number;
}

/**
 * Determines whether a touch/pointer movement is clearly an intentional
 * horizontal swipe rather than vertical page scrolling.
 */
export function isHorizontalSwipeGesture({
  dx,
  dy,
  lockThresholdPx = 10,
}: SwipeGestureInput): boolean {
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  return absX >= lockThresholdPx && absX > absY * 1.15;
}

/**
 * Clamps live horizontal finger drag offset in pixels with soft rubber-band
 * resistance past the outer edges of the 2-slide track (0 = room, 1 = bare cutout).
 */
export function clampCardDragOffsetPx(
  currentSlide: CardMediaSlide,
  dx: number,
  containerWidth: number,
): number {
  const width = Math.max(1, containerWidth);
  const rubberBand = 0.22;

  if (currentSlide === 0 && dx > 0) {
    return Math.min(width * 0.22, dx * rubberBand);
  }
  if (currentSlide === 1 && dx < 0) {
    return Math.max(-width * 0.22, dx * rubberBand);
  }

  return Math.max(-width, Math.min(width, dx));
}

/**
 * Resolves the destination slide index after releasing a horizontal swipe.
 * Swiping left from slide 0 reveals slide 1 (bare 3D/model view).
 * Swiping right from slide 1 returns to slide 0 (in-room render).
 */
export function resolveSwipeTargetSlide({
  currentSlide,
  dx,
  containerWidth,
  thresholdRatio = 0.14,
  minThresholdPx = 28,
}: SwipeResolveInput): CardMediaSlide {
  const threshold = Math.max(minThresholdPx, containerWidth * thresholdRatio);

  if (currentSlide === 0 && dx <= -threshold) {
    return 1;
  }
  if (currentSlide === 1 && dx >= threshold) {
    return 0;
  }
  return currentSlide;
}
