"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, MQ } from "@/lib/motion";

type DrawLineProps = {
  /** SVG path data, in viewBox units. Each path draws in sequence. */
  paths: string[];
  viewBox: string;
  className?: string;
  strokeWidth?: number;
  /** CSS selector of the scroll trigger element; defaults to the SVG itself. */
  trigger?: string;
  start?: string;
  end?: string;
  /** `true`/number = tied to scroll position; `false` = plays once on enter. */
  scrub?: boolean | number;
  /** Show the faint dashed "stencil" guide underneath the line. */
  guide?: boolean;
  duration?: number;
};

/**
 * LINEWORK: SVG strokes that draw themselves like a needle tracing a stencil.
 * pathLength="1" normalizes every path, so dash math never needs getTotalLength().
 * Without JS or with reduced motion, lines are simply shown complete.
 * (Straight responsive rules use a transform-scaled <div> instead. See Story/Process.)
 */
export function DrawLine({
  paths,
  viewBox,
  className = "",
  strokeWidth = 1.5,
  trigger,
  start = "top 75%",
  end = "bottom 60%",
  scrub = true,
  guide = true,
  duration = 1.8,
}: DrawLineProps) {
  const svg = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const el = svg.current;
      if (!el) return;
      const lines = el.querySelectorAll<SVGPathElement>("[data-line]");
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.to(lines, {
          strokeDashoffset: 0,
          ease: scrub ? "none" : EASE.line,
          duration: scrub ? undefined : duration,
          stagger: scrub ? 0 : 0.15,
          scrollTrigger: {
            trigger: trigger ? document.querySelector(trigger) : el,
            start,
            end,
            scrub: scrub === true ? 0.6 : scrub || false,
            once: !scrub,
          },
        });
      });
    },
    { scope: svg },
  );

  return (
    <svg
      ref={svg}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={`pointer-events-none overflow-visible ${className}`}
      fill="none"
      aria-hidden="true"
    >
      {guide &&
        paths.map((d, i) => (
          <path
            key={`g${i}`}
            d={d}
            stroke="currentColor"
            strokeOpacity={0.22}
            strokeWidth={strokeWidth}
            strokeDasharray={`${strokeWidth * 2} ${strokeWidth * 4}`}
          />
        ))}
      {paths.map((d, i) => (
        <path
          key={i}
          data-line
          d={d}
          pathLength={1}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
