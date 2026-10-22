"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useCurrentYear } from "@/hooks/useCurrentYear";
import { useScrollLock } from "@/hooks/useScrollLock";
import { INTRO_SESSION_KEY, introSkipped, markIntroDone } from "@/lib/intro";
import { FOUNDED_YEAR } from "@/lib/years";
import { Logo } from "./Logo";

/**
 * First-visit intro, played once per session:
 *   STENCIL  dashed guide frame around the logo on bone "paper"
 *   LINEWORK solid frame traces itself while the counter runs 1994 → this year
 *   INK      oxblood floods the screen from below
 *   HEALED   the curtain lifts to reveal the hero
 * Skipped instantly on repeat visits and with reduced motion (decided before paint in layout.tsx).
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const year = useCurrentYear();
  const [active, setActive] = useState(true);
  useScrollLock(active);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (introSkipped()) {
        markIntroDone();
        setActive(false);
        return;
      }
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);

      const n = { v: FOUNDED_YEAR };
      const frame = el.querySelector<SVGRectElement>("[data-frame]");
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          try {
            sessionStorage.setItem(INTRO_SESSION_KEY, "1");
          } catch {}
          setActive(false);
        },
      });

      tl.set(frame, { strokeDasharray: 1, strokeDashoffset: 1 })
        .from("[data-guide]", { autoAlpha: 0, duration: 0.6 })
        .to(frame, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 0.05)
        .fromTo(
          "[data-logo]",
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" },
          0.2,
        )
        .to(
          n,
          {
            v: year,
            duration: 1.15,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counter.current) counter.current.textContent = String(Math.round(n.v));
            },
          },
          0.1,
        )
        .from("[data-meta]", { autoAlpha: 0, y: 12, duration: 0.8, stagger: 0.1 }, 0.2)
        // INK: oxblood rises like ink filling a line
        .fromTo("[data-flood]", { yPercent: 101 }, { yPercent: 0, duration: 0.7, ease: "expo.inOut" }, 1.3)
        // The hero starts its entrance underneath while the curtain lifts.
        .add(() => markIntroDone(), 1.8)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut" }, 1.85);
    },
    { scope: root },
  );

  if (!active) return null;

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bone text-ink"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      role="status"
      aria-label="Loading Absolute Tattoos & Body Piercing"
    >
      <div className="relative w-[min(78vw,34rem)]">
        {/* Stencil guide + linework frame around the logo */}
        <svg className="absolute -inset-[9%] h-[118%] w-[118%] overflow-visible" viewBox="0 0 365 100" fill="none" aria-hidden="true">
          <rect data-guide x="1" y="1" width="363" height="98" rx="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.8" strokeDasharray="3 5" />
          <rect data-frame x="1" y="1" width="363" height="98" rx="6" stroke="currentColor" strokeWidth="1" pathLength={1} />
        </svg>
        <div data-logo>
          <Logo priority alt="Absolute Tattoos & Body Piercing, est. 1994" sizes="min(78vw, 34rem)" />
        </div>
      </div>

      <div className="mt-[clamp(3rem,9vh,6rem)] flex items-baseline gap-4 font-mono">
        <span data-meta className="label text-ink/60">
          Est.
        </span>
        <span ref={counter} className="font-display text-[clamp(3rem,10vw,6rem)] leading-none font-black tabular-nums" aria-hidden="true">
          {FOUNDED_YEAR}
        </span>
        <span data-meta className="label text-ink/60">
          Bellevue, NE
        </span>
      </div>

      <div data-flood className="absolute inset-0 translate-y-full bg-oxblood" aria-hidden="true" />
    </div>
  );
}
