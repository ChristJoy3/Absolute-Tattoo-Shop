/**
 * Motion vocabulary. Every animation in the site follows the tattoo process:
 * STENCIL (outline / dashed guide) → LINEWORK (stroke draws) → INK (fill / mask bleed) → HEALED (crisp, at rest).
 */
export const EASE = {
  /** Default for reveals: slow, confident settle. */
  ink: "expo.out",
  /** Line draws and mask wipes. */
  line: "power4.out",
  /** Symmetric transitions (menu, lightbox). */
  inOut: "expo.inOut",
} as const;

export const DUR = {
  fast: 0.6,
  base: 1.2,
  slow: 1.8,
} as const;

/** gsap.matchMedia conditions: three layouts × motion preference. */
export const MQ = {
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
  tablet: "(min-width: 768px) and (max-width: 1279px) and (prefers-reduced-motion: no-preference)",
  desktop: "(min-width: 1280px) and (prefers-reduced-motion: no-preference)",
  /** Tablet + desktop together, for shared "large screen" choreography. */
  large: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

/** Standard scroll start for "enter" reveals. */
export const START = "top 85%";
