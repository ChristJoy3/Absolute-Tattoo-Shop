"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MQ, START } from "@/lib/motion";

type RevealTextProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /**
   * "lines": masked line rise (default, used everywhere on mobile).
   * "chars": character stagger, reserved for big headlines on tablet/desktop only.
   */
  mode?: "lines" | "chars";
  delay?: number;
  start?: string;
  id?: string;
};

/**
 * Masked text reveal on scroll. Each line rises out of its own clip mask, like ink settling
 * into a fresh line. SplitText's autoSplit re-splits on resize / font load, and the tween returned
 * from onSplit is cleaned up automatically.
 */
export function RevealText({ as: Tag = "p", children, className, mode = "lines", delay = 0, start = START, id }: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ large: MQ.large, mobile: MQ.mobile }, (ctx) => {
        const useChars = mode === "chars" && Boolean(ctx.conditions?.large);
        const split = SplitText.create(el, {
          type: useChars ? "lines,chars" : "lines",
          mask: "lines",
          autoSplit: true,
          // aria-label is only valid on headings; plain line splits read fine as-is.
          aria: typeof Tag === "string" && /^h[1-6]$/.test(Tag) ? "auto" : "none",
          onSplit(self) {
            return gsap.from(useChars ? self.chars : self.lines, {
              yPercent: 115,
              duration: useChars ? DUR.base : DUR.base,
              ease: EASE.ink,
              stagger: useChars ? 0.018 : 0.09,
              delay,
              scrollTrigger: { trigger: el, start, once: true },
            });
          },
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
