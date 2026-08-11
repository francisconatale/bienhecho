"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface BottomSheetOptions {
  onDismiss: () => void;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  enabled: boolean;
}

interface BottomSheetResult {
  sheetRef: React.RefObject<HTMLDivElement | null>;
  isClosing: boolean;
  isMobile: boolean;
  grabProps: {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
  };
  playExit: (cb?: () => void) => void;
}

const STIFFNESS = 420;
const DAMPING = 41;
const CLOSE_DISTANCE = 110;
const CLOSE_VELOCITY = 0.45;
const RUBBER = 0.55;
const MOBILE_QUERY = "(max-width: 639px)";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function useBottomSheet({ onDismiss, overlayRef, enabled }: BottomSheetOptions): BottomSheetResult {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const s = useRef({
    reduced: false,
    mobile: false,
    active: false,
    pointerId: -1,
    startY: 0,
    lastY: 0,
    lastT: 0,
    velocity: 0,
    y: 0,
    anim: 0,
  }).current;

  useEffect(() => {
    if (!enabled) return;
    s.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mq = window.matchMedia(MOBILE_QUERY);
    s.mobile = mq.matches;
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => {
      s.mobile = e.matches;
      setIsMobile(e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [enabled, s]);

  useLayoutEffect(() => {
    if (!enabled || !isMobile) return;
    const sheet = sheetRef.current;
    if (!sheet) return;

    s.y = 0;
    s.velocity = 0;
    s.active = false;
    setIsClosing(false);

    if (s.reduced) {
      sheet.style.transform = "translateY(0)";
      return;
    }

    sheet.style.transform = "translateY(100%)";
    const start = performance.now();
    const duration = 360;
    let raf = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      sheet.style.transform = `translateY(${((1 - eased) * window.innerHeight).toFixed(2)}px)`;
      setBackdrop((1 - eased) * window.innerHeight);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, isMobile, s]);

  const setBackdrop = (y: number) => {
    const ov = overlayRef.current;
    if (!ov) return;
    const dim = 0.4 * clamp(1 - y / (window.innerHeight * 0.5), 0, 1);
    ov.style.backgroundColor = `rgba(0,0,0,${dim.toFixed(3)})`;
  };

  const apply = (y: number) => {
    const sheet = sheetRef.current;
    if (sheet) sheet.style.transform = `translateY(${y.toFixed(2)}px)`;
    setBackdrop(y);
  };

  const springTo = (targetY: number, onDone?: () => void) => {
    cancelAnimationFrame(s.anim);
    let y = s.y;
    let vel = s.velocity;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const force = (targetY - y) * STIFFNESS - vel * DAMPING;
      vel += force * dt;
      y += vel * dt;
      s.y = y;
      s.velocity = vel;
      apply(y);

      if (targetY > 0) {
        if (y >= window.innerHeight * 0.85) {
          onDone?.();
          return;
        }
      } else if (Math.abs(y) < 0.5 && Math.abs(vel) < 20) {
        apply(0);
        s.y = 0;
        s.velocity = 0;
        onDone?.();
        return;
      }
      s.anim = requestAnimationFrame(step);
    };
    s.anim = requestAnimationFrame(step);
  };

  const playExit = (cb?: () => void) => {
    if (!enabled || !s.mobile || s.reduced) {
      cb?.();
      return;
    }
    setIsClosing(true);
    springTo(window.innerHeight * 1.1, cb);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!enabled || !s.mobile || s.reduced || s.active || isClosing) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    s.active = true;
    s.pointerId = e.pointerId;
    s.startY = e.clientY;
    s.lastY = e.clientY;
    s.lastT = performance.now();
    s.velocity = 0;
    cancelAnimationFrame(s.anim);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!s.active || s.pointerId !== e.pointerId) return;
    const dy = e.clientY - s.startY;
    if (dy <= 0) return;
    const now = performance.now();
    const dt = now - s.lastT;
    if (dt > 0) {
      const v = (e.clientY - s.lastY) / dt;
      s.velocity = 0.6 * v + 0.4 * s.velocity;
    }
    s.lastY = e.clientY;
    s.lastT = now;
    const h = window.innerHeight;
    s.y = (dy * h * RUBBER) / (h + RUBBER * dy);
    apply(s.y);
  };

  const endDrag = () => {
    if (!s.active) return;
    s.active = false;
    if (s.y > CLOSE_DISTANCE || s.velocity > CLOSE_VELOCITY) {
      playExit(onDismiss);
    } else {
      s.velocity = 0;
      springTo(0);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (s.pointerId === e.pointerId) endDrag();
  };

  const onPointerCancel = (e: React.PointerEvent) => {
    if (s.pointerId === e.pointerId) endDrag();
  };

  return {
    sheetRef,
    isClosing,
    isMobile,
    grabProps: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
    playExit,
  };
}
