"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { useCurrentYear } from "@/hooks/useCurrentYear";
import { FOUNDED_YEAR, yearsSince } from "@/lib/years";

type Props = {
  className?: string;
  /** Count up from 0 when scrolled into view. */
  countUp?: boolean;
};

/** Years in business, always computed from 1994. Never hard-coded. */
export function YearsInBusiness({ className, countUp = false }: Props) {
  const year = useCurrentYear();
  const years = yearsSince(FOUNDED_YEAR, year);
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!countUp || !el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const n = { v: 0 };
        gsap.to(n, {
          v: years,
          duration: 2.2,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = String(Math.round(n.v));
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        return () => {
          el.textContent = String(years);
        };
      });
    },
    { dependencies: [years, countUp] },
  );

  return (
    <span ref={ref} className={className}>
      {years}
    </span>
  );
}

/** Just the current year (footer ©, preloader counter target). */
export function CurrentYear({ className }: { className?: string }) {
  return <span className={className}>{useCurrentYear()}</span>;
}
