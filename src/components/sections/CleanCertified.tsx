"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, MQ } from "@/lib/motion";
import { trust } from "@/data/content";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { RevealText } from "@/components/ui/RevealText";

/**
 * CLEAN & CERTIFIED: the calm beat. Lots of air, slower motion.
 * Signature moment: a stamp-like seal whose rings draw themselves closed, then the lettering inks in.
 */
export function CleanCertified() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const rings = gsap.utils.toArray<SVGPathElement>("[data-seal-ring]");
        gsap.set(rings, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-seal]", start: "top 80%", once: true } })
          .to(rings, { strokeDashoffset: 0, duration: 2, stagger: 0.25, ease: "power2.inOut" })
          .from("[data-seal-text]", { opacity: 0, duration: 1.2, ease: "power2.out" }, 0.9)
          .from("[data-seal-core]", { scale: 0.6, opacity: 0, duration: 1.2, ease: EASE.ink }, 1.1);

        // Slow, constant rotation of the outer lettering: calm, never flashy.
        gsap.to("[data-seal-spin]", {
          rotation: 360,
          duration: 60,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
          // Only spins while visible: no off-screen work.
          scrollTrigger: { trigger: "[data-seal]", start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" },
        });

        // Heading: outline → fill tied to scroll.
        gsap.fromTo(
          "[data-clean-fill]",
          { clipPath: "inset(0% 100% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            stagger: 0.3,
            scrollTrigger: { trigger: "[data-clean-heading]", start: "top 80%", end: "bottom 45%", scrub: 0.6 },
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-point]").forEach((p) => {
          gsap
            .timeline({ scrollTrigger: { trigger: p, start: "top 85%", once: true } })
            .from(p.querySelector("[data-point-rule]"), { scaleX: 0, transformOrigin: "left center", duration: 1.6, ease: EASE.line })
            .from(p.querySelectorAll("[data-point-in]"), { opacity: 0, y: 20, duration: 1.2, stagger: 0.1, ease: EASE.ink }, 0.2);
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="clean" aria-labelledby="clean-title" className="relative bg-ink-2 px-[var(--gutter)] py-[clamp(6rem,14vw,12rem)]">
      <div className="grid items-center gap-16 xl:grid-cols-12 xl:gap-10">
        <div className="xl:col-span-7">
          <SectionMarker index="03" title="Clean & certified" />
          <h2 id="clean-title" data-clean-heading className="t-huge mt-8">
            {trust.heading.map((line) => (
              <span key={line} className="relative block">
                <span className="text-outline block text-bone/70">{line}</span>
                <span data-clean-fill aria-hidden className="absolute inset-0 block text-bone">
                  {line}
                </span>
              </span>
            ))}
          </h2>
          <RevealText className="t-lead mt-8 max-w-xl text-bone/80">{trust.intro}</RevealText>
        </div>

        <div className="flex justify-center xl:col-span-5">
          <Seal />
        </div>
      </div>

      <ul className="mt-16 grid gap-10 md:mt-24 md:grid-cols-2 md:gap-8">
        {trust.points.map((p, i) => (
          <li key={p.title} data-point className="relative pt-8">
            <span data-point-rule aria-hidden className="absolute inset-x-0 top-0 h-px bg-patina/60" />
            <p data-point-in className="font-stencil text-lg font-bold tracking-[0.2em] text-patina">
              0{i + 1}
            </p>
            <h3 data-point-in className="t-lg mt-3">
              {p.title}
            </h3>
            <p data-point-in className="mt-4 max-w-md text-bone/75 md:text-lg">
              {p.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Circular stamp: two rings, lettering on a circle, "EST. 1994" core. Purely decorative. */
function Seal() {
  const ring = (r: number) => `M 150 ${150 - r} a ${r} ${r} 0 1 1 0 ${r * 2} a ${r} ${r} 0 1 1 0 ${-r * 2}`;
  return (
    <div data-seal className="w-[min(78vw,24rem)] text-patina" aria-hidden="true">
      <svg viewBox="0 0 300 300" fill="none" className="w-full overflow-visible">
        <defs>
          <path id="seal-text-path" d={ring(112)} />
        </defs>
        <path data-seal-ring d={ring(140)} stroke="currentColor" strokeWidth="1.5" pathLength={1} />
        <path data-seal-ring d={ring(92)} stroke="currentColor" strokeWidth="1" pathLength={1} />
        <g data-seal-spin>
          <text data-seal-text fill="currentColor" style={{ font: "500 13px var(--font-jetbrains), monospace", letterSpacing: "0.32em" }}>
            <textPath href="#seal-text-path" startOffset="0">
              AUTOCLAVE STERILIZED · STATE LICENSED · CERTIFIED ·
            </textPath>
          </text>
        </g>
        <g data-seal-core style={{ transformOrigin: "150px 150px" }}>
          <text
            x="150"
            y="146"
            textAnchor="middle"
            fill="#f2ece3"
            style={{ font: "900 46px var(--font-big-shoulders), sans-serif", letterSpacing: "0.02em" }}
          >
            CLEAN
          </text>
          <text x="150" y="176" textAnchor="middle" fill="currentColor" style={{ font: "700 15px var(--font-big-shoulders-stencil), sans-serif", letterSpacing: "0.3em" }}>
            EST. 1994
          </text>
        </g>
      </svg>
    </div>
  );
}
