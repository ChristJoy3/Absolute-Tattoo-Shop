"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EASE, MQ } from "@/lib/motion";

/**
 * Staggered "ink" reveals for gallery frames, batched so frames entering together cascade.
 * Re-runs when `count` changes (e.g. "Show all"), animating only frames it hasn't seen yet.
 */
export function useGalleryReveal(scope: RefObject<HTMLElement | null>, count: number) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const fresh = Array.from(root.querySelectorAll<HTMLElement>("[data-frame]:not([data-seen])"));
      fresh.forEach((f) => f.setAttribute("data-seen", ""));
      if (!fresh.length) return;

      const mm = gsap.matchMedia();
      mm.add({ large: MQ.large, mobile: MQ.mobile }, (ctx) => {
        const large = Boolean(ctx.conditions?.large);
        gsap.set(fresh, { clipPath: "inset(100% 0% 0% 0%)" });
        if (large) gsap.set(fresh.map((f) => f.querySelector("[data-frame-img]")), { scale: 1.2 });

        ScrollTrigger.batch(fresh, {
          start: "top 92%",
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: EASE.line, stagger: 0.09 });
            if (large)
              gsap.to(
                batch.map((f) => f.querySelector("[data-frame-img]")),
                { scale: 1, duration: 1.8, ease: EASE.ink, stagger: 0.09 },
              );
          },
        });
      });
      ScrollTrigger.refresh();
    },
    { scope, dependencies: [count] },
  );
}
