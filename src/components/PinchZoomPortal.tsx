import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  computePinchDistance,
  computePinchMidpoint,
  computePinchTransform,
  type RectBox,
  type TouchPoint,
} from '../lib/pinchZoomLogic';

export interface PinchZoomOverlayProps {
  /** Ref to the container element that receives two-finger pinch touch gestures */
  targetRef: React.RefObject<HTMLElement | null>;
  /** Currently visible image source to float outside its card box during pinch */
  imageSrc: string | undefined;
  /** Accessible alt text for the floating zoomed image */
  imageAlt: string;
  /** Optional class for image fit/background (e.g. object-cover vs object-contain p-3 bg-white) */
  imageClassName?: string;
  /** Background color behind the floating frame (e.g. white for bare cutouts) */
  frameBgClassName?: string;
  /** Disable pinch breakout (e.g. when image failed to load) */
  disabled?: boolean;
  /** Callback fired when pinch state toggles (lets parent hide source & cancel 1-finger swipe) */
  onPinchStateChange?: (active: boolean) => void;
}

interface ActivePinchVisual {
  rect: RectBox;
  scale: number;
  tx: number;
  ty: number;
  originX: number;
  originY: number;
  backdropOpacity: number;
  releasing: boolean;
}

const RELEASE_ANIMATION_MS = 240;

/**
 * Instagram / Facebook-style pinch-to-zoom breakout overlay.
 * When two fingers pinch on the target image container, the image physically lifts out
 * of its card via a fixed document.body portal, scales and pans smoothly around the
 * exact pinch focal point over a dimming scrim, and springs smoothly back into place
 * the moment the user releases their fingers.
 */
export const PinchZoomPortal: React.FC<PinchZoomOverlayProps> = ({
  targetRef,
  imageSrc,
  imageAlt,
  imageClassName = 'w-full h-full object-cover',
  frameBgClassName = 'bg-white',
  disabled = false,
  onPinchStateChange,
}) => {
  const [visual, setVisual] = useState<ActivePinchVisual | null>(null);

  const sessionRef = useRef<{
    active: boolean;
    startDist: number;
    startMid: TouchPoint;
    rect: RectBox;
    releaseTimer: number | null;
  }>({
    active: false,
    startDist: 0,
    startMid: { x: 0, y: 0 },
    rect: { left: 0, top: 0, width: 0, height: 0 },
    releaseTimer: null,
  });

  const propsRef = useRef({ imageSrc, disabled, onPinchStateChange });
  propsRef.current = { imageSrc, disabled, onPinchStateChange };

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const clearReleaseTimer = () => {
      if (sessionRef.current.releaseTimer !== null) {
        window.clearTimeout(sessionRef.current.releaseTimer);
        sessionRef.current.releaseTimer = null;
      }
    };

    const getTwoPoints = (touches: TouchList): [TouchPoint, TouchPoint] => [
      { x: touches[0].clientX, y: touches[0].clientY },
      { x: touches[1].clientX, y: touches[1].clientY },
    ];

    const startPinch = (e: TouchEvent) => {
      if (propsRef.current.disabled || !propsRef.current.imageSrc) return;
      if (e.touches.length < 2) return;

      clearReleaseTimer();
      e.preventDefault();
      e.stopPropagation();

      const [p1, p2] = getTwoPoints(e.touches);
      const startDist = Math.max(computePinchDistance(p1, p2), 8);
      const startMid = computePinchMidpoint(p1, p2);
      const domRect = el.getBoundingClientRect();
      const rect: RectBox = {
        left: domRect.left,
        top: domRect.top,
        width: domRect.width,
        height: domRect.height,
      };

      sessionRef.current.active = true;
      sessionRef.current.startDist = startDist;
      sessionRef.current.startMid = startMid;
      sessionRef.current.rect = rect;

      propsRef.current.onPinchStateChange?.(true);

      setVisual({
        rect,
        scale: 1,
        tx: 0,
        ty: 0,
        originX: startMid.x - rect.left,
        originY: startMid.y - rect.top,
        backdropOpacity: 0,
        releasing: false,
      });
    };

    const movePinch = (e: TouchEvent) => {
      if (!sessionRef.current.active) {
        // Handle second finger arriving mid-gesture
        if (e.touches.length >= 2 && !propsRef.current.disabled && propsRef.current.imageSrc) {
          startPinch(e);
        }
        return;
      }
      if (e.touches.length < 2) return;

      e.preventDefault();
      e.stopPropagation();

      const [p1, p2] = getTwoPoints(e.touches);
      const currentDist = computePinchDistance(p1, p2);
      const currentMid = computePinchMidpoint(p1, p2);

      const next = computePinchTransform({
        startDist: sessionRef.current.startDist,
        currentDist,
        startMid: sessionRef.current.startMid,
        currentMid,
        originRect: sessionRef.current.rect,
      });

      setVisual({
        rect: sessionRef.current.rect,
        scale: next.scale,
        tx: next.tx,
        ty: next.ty,
        originX: next.originX,
        originY: next.originY,
        backdropOpacity: next.backdropOpacity,
        releasing: false,
      });
    };

    const finishPinch = (e: TouchEvent) => {
      if (!sessionRef.current.active) return;
      if (e.touches.length >= 2) return;

      sessionRef.current.active = false;
      clearReleaseTimer();

      // Spring smoothly back to the exact original card rect
      setVisual((prev) =>
        prev
          ? {
              ...prev,
              scale: 1,
              tx: 0,
              ty: 0,
              backdropOpacity: 0,
              releasing: true,
            }
          : null,
      );

      sessionRef.current.releaseTimer = window.setTimeout(() => {
        sessionRef.current.releaseTimer = null;
        setVisual(null);
        propsRef.current.onPinchStateChange?.(false);
      }, RELEASE_ANIMATION_MS);
    };

    // Non-passive listeners are mandatory so mobile Chrome/Safari let us preventDefault() native page zoom
    el.addEventListener('touchstart', startPinch, { passive: false });
    el.addEventListener('touchmove', movePinch, { passive: false });
    el.addEventListener('touchend', finishPinch, { passive: true });
    el.addEventListener('touchcancel', finishPinch, { passive: true });

    return () => {
      clearReleaseTimer();
      el.removeEventListener('touchstart', startPinch);
      el.removeEventListener('touchmove', movePinch);
      el.removeEventListener('touchend', finishPinch);
      el.removeEventListener('touchcancel', finishPinch);
    };
  }, [targetRef]);

  if (!visual || !imageSrc || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      data-testid="pinch-zoom-portal"
      data-zoom-scale={visual.scale.toFixed(2)}
      data-releasing={visual.releasing ? 'true' : 'false'}
      aria-hidden="true"
      className="fixed inset-0 z-[9999] pointer-events-none touch-none"
    >
      {/* Dynamic full-screen dark scrim */}
      <div
        className="absolute inset-0 bg-[#09090B]"
        style={{
          opacity: visual.backdropOpacity,
          transition: visual.releasing
            ? `opacity ${RELEASE_ANIMATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
            : 'none',
        }}
      />

      {/* Floating breakout image frame aligned 1:1 with the source box */}
      <div
        data-testid="pinch-zoom-frame"
        className={`fixed overflow-hidden ${frameBgClassName}`}
        style={{
          left: `${visual.rect.left}px`,
          top: `${visual.rect.top}px`,
          width: `${visual.rect.width}px`,
          height: `${visual.rect.height}px`,
          borderRadius: visual.scale > 1.04 && !visual.releasing ? '10px' : '0px',
          boxShadow:
            visual.scale > 1.04 && !visual.releasing
              ? '0 24px 64px rgba(0, 0, 0, 0.52)'
              : '0 0 0 rgba(0, 0, 0, 0)',
          transformOrigin: `${visual.originX}px ${visual.originY}px`,
          transform: `translate3d(${visual.tx}px, ${visual.ty}px, 0) scale(${visual.scale})`,
          transition: visual.releasing
            ? `transform ${RELEASE_ANIMATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow ${RELEASE_ANIMATION_MS}ms ease-out, border-radius ${RELEASE_ANIMATION_MS}ms ease-out`
            : 'none',
          willChange: 'transform',
        }}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          draggable={false}
          referrerPolicy="no-referrer"
          className={imageClassName}
        />
      </div>
    </div>,
    document.body,
  );
};
