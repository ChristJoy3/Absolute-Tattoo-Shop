"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MQ, START } from "@/lib/motion";

type RevealImageProps = {
  children: ReactNode;
  /** Classes for the outer frame (size, aspect ratio, borders). */
  className?: string;
  /** Scroll-linked inner drift (tablet/desktop only). */
  parallax?: boolean;
  /** Direction the "ink" wipes in from. */
  from?: "bottom" | "left" | "right";
  delay?: number;
};

const CLIP_FROM = {
  bottom: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * Image frame that "inks in": a clip-path wipe plus a slow settle of scale (transform + clip-path only).
 * With `parallax`, an extra inner layer drifts on scroll for depth.
 */
export function RevealImage({ children, className = "", parallax = false, from = "bottom", delay = 0 }: RevealImageProps) {
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = frame.current;
      if (!el) return;
      const drift = el.querySelector<HTMLElement>("[data-drift]");
      const settle = el.querySelector<HTMLElement>("[data-settle]");
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: START, once: true }, delay })
          .fromTo(el, { clipPath: CLIP_FROM[from] }, { clipPath: "inset(0% 0% 0% 0%)", duration: DUR.slow, ease: EASE.line })
          .from(settle, { scale: 1.25, duration: DUR.slow * 1.2, ease: EASE.ink }, 0);
      });

      if (parallax) {
        mm.add(MQ.large, () => {
          gsap.fromTo(
            drift,
            { yPercent: -7 },
            { yPercent: 7, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      }
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={`relative overflow-hidden ${className}`}>
      <div data-drift className={parallax ? "absolute inset-x-0 -inset-y-[8%]" : "absolute inset-0"}>
        <div data-settle className="h-full w-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_picture]:block [&_picture]:h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
