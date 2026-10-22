"use client";

import { useId, type CSSProperties, type ReactNode } from "react";

/**
 * INK: organic mask made of ink-drop blobs inside an SVG <clipPath> (objectBoundingBox units).
 * The parent animates each `[data-ink-blob]` from scale 0 → 1 with `animateInk()` so the content
 * bleeds in from several points, like ink spreading into skin. Once healed, the clip is removed.
 *
 * The clip is only attached when the reveal starts (see animateInk): static HTML renders unclipped,
 * which keeps content visible without JS and lets the browser count the image for LCP right away.
 */

/** A slightly irregular drop shape around (0,0), radius ≈ 1. */
const DROP =
  "M0.92,0.06 C0.98,0.52 0.6,0.97 0.06,0.95 C-0.48,0.93 -0.97,0.55 -0.94,0.02 C-0.9,-0.5 -0.52,-0.96 0.02,-0.93 C0.55,-0.9 0.87,-0.42 0.92,0.06 Z";

/** Drop placements: [cx, cy, radius]. Together they cover the unit box at scale 1. */
const DROPS: [number, number, number][] = [
  [0.32, 0.38, 0.62],
  [0.74, 0.66, 0.6],
  [0.78, 0.18, 0.42],
  [0.2, 0.86, 0.45],
  [0.52, 0.52, 0.35],
];

type InkMaskProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function InkMask({ children, className = "", style }: InkMaskProps) {
  const id = `ink-${useId().replace(/[:«»]/g, "")}`;
  return (
    <div className={`relative ${className}`} data-ink-mask={id} style={style}>
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={id} clipPathUnits="objectBoundingBox">
            {DROPS.map(([cx, cy, r], i) => (
              <g key={i} transform={`translate(${cx} ${cy})`}>
                <path data-ink-blob data-r={r} d={DROP} transform={`scale(${r})`} />
              </g>
            ))}
          </clipPath>
        </defs>
      </svg>
      {children}
    </div>
  );
}

/**
 * Adds the ink-bleed reveal of an <InkMask> to a GSAP timeline.
 * Blobs are animated by rewriting their transform attribute (robust inside <clipPath>,
 * where getBBox-based transform origins are unreliable).
 */
export function animateInk(
  tl: gsap.core.Timeline,
  root: HTMLElement,
  { at = 0, duration = 1.6, stagger = 0.12 }: { at?: number; duration?: number; stagger?: number } = {},
) {
  const blobs = Array.from(root.querySelectorAll<SVGPathElement>("[data-ink-blob]"));
  // Attach the clip synchronously, in the same frame the blobs collapse to 0, so nothing flashes.
  root.style.clipPath = `url(#${root.dataset.inkMask})`;
  blobs.forEach((blob, i) => {
    const r = Number(blob.dataset.r);
    const state = { s: 0, rot: -25 + i * 12 };
    const apply = () => blob.setAttribute("transform", `scale(${state.s}) rotate(${state.rot})`);
    apply();
    tl.to(state, { s: r, rot: 0, duration, ease: "power3.out", onUpdate: apply }, at + i * stagger);
  });
  // HEALED: drop the mask entirely so the image is crisp and the clip costs nothing afterwards.
  tl.set(root, { clipPath: "none" }, at + duration + blobs.length * stagger);
}
