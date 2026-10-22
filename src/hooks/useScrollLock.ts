"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/**
 * Locks page scroll while an overlay (menu, lightbox) is open.
 * Stops Lenis on desktop and clips <html> overflow for native/touch scrolling.
 */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    // Avoid layout shift when the desktop scrollbar disappears.
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    lenis?.stop();
    return () => {
      root.style.overflow = prevOverflow;
      root.style.paddingRight = "";
      lenis?.start();
    };
  }, [locked, lenis]);
}
