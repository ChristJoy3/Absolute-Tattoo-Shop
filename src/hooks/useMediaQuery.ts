"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query. `serverValue` is used for the static HTML and during
 * hydration, so markup never mismatches; the real value takes over right after.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** ≤767px: the phone layout. */
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");

/** Real hover + precise pointer (mouse / trackpad). Hover-only effects are gated on this. */
export const useHoverCapable = () => useMediaQuery("(hover: hover) and (pointer: fine)");
