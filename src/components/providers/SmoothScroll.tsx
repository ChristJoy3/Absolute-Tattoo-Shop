"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis share one RAF.
 * - Touch devices keep native scrolling (syncTouch: false).
 * - Reduced motion: lerp 1 = no smoothing.
 * - ScrollTrigger is refreshed after fonts and all images have loaded, and on orientation change.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reduce = useReducedMotion();

  // GSAP's ticker drives Lenis. The instance is created by <ReactLenis> after mount,
  // so it's read from the ref on every tick rather than captured once.
  useEffect(() => {
    const tick = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(tick);
  }, []);

  // Re-measure trigger positions once layout is final.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });
    const onOrientation = () => setTimeout(refresh, 300);
    window.addEventListener("orientationchange", onOrientation);
    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("orientationchange", onOrientation);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      autoRaf={false}
      options={{
        lerp: reduce ? 1 : 0.1,
        smoothWheel: !reduce,
        syncTouch: false,
        anchors: false, // anchors are handled by scrollToHash (focus management + fallback)
      }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}

/** Keeps ScrollTrigger in step with Lenis' virtual scroll position. */
function ScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}
