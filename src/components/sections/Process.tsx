"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, MQ } from "@/lib/motion";
import { processSteps } from "@/data/content";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { RevealText } from "@/components/ui/RevealText";

/**
 * THE PROCESS: Consult → Design → Session → Aftercare.
 * A single patina line travels from step to step (horizontal on tablet/desktop, vertical on phones);
 * each node fills with ember the moment the line reaches it.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add({ large: MQ.large, mobile: MQ.mobile }, (ctx) => {
        const large = Boolean(ctx.conditions?.large);
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
        const nodes = steps.map((s) => s.querySelector("[data-step-node]"));
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "[data-steps]",
            start: large ? "top 70%" : "top 75%",
            end: large ? "bottom 60%" : "bottom 65%",
            scrub: 0.6,
          },
        });
        // Line travels; each node inks in when the line reaches it.
        tl.fromTo(large ? "[data-process-h]" : "[data-process-v]", large ? { scaleX: 0 } : { scaleY: 0 }, large ? { scaleX: 1, duration: 1 } : { scaleY: 1, duration: 1 }, 0);
        nodes.forEach((node, i) => {
          tl.to(node, { backgroundColor: "#b43606", borderColor: "#b43606", scale: 1.15, duration: 0.05 }, i / (nodes.length - 1 || 1) * 0.98);
        });

        steps.forEach((step) => {
          gsap.from(step.querySelectorAll("[data-step-in]"), {
            opacity: 0,
            y: 30,
            duration: 1.1,
            stagger: 0.08,
            ease: EASE.ink,
            scrollTrigger: { trigger: step, start: "top 85%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" aria-labelledby="process-title" className="relative px-[var(--gutter)] py-[clamp(5rem,12vw,10rem)]">
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <SectionMarker index="06" title="The process" />
          <RevealText as="h2" id="process-title" mode="chars" className="t-huge mt-8">
            Stencil to healed
          </RevealText>
        </div>
        <RevealText className="t-lead max-w-md self-end text-bone/75 xl:col-span-4">
          No pressure, no surprises. Here&apos;s how a piece goes from an idea to healed skin.
        </RevealText>
      </div>

      <ol data-steps className="relative mt-16 grid gap-14 pl-10 md:mt-24 md:grid-cols-4 md:gap-6 md:pl-0">
        {/* Phones: vertical line */}
        <span aria-hidden className="absolute top-1 bottom-1 left-[0.4rem] w-px bg-bone/15 md:hidden">
          <span data-process-v className="block h-full w-full origin-top bg-patina" />
        </span>
        {/* Tablet / desktop: horizontal line through the nodes */}
        <span aria-hidden className="absolute top-[0.4rem] right-[12%] left-0 hidden h-px bg-bone/15 md:block">
          <span data-process-h className="block h-full w-full origin-left bg-patina" />
        </span>

        {processSteps.map((s) => (
          <li key={s.step} data-step className="relative">
            <span
              data-step-node
              aria-hidden
              className="absolute top-[0.05rem] -left-10 size-3.5 rounded-full border border-patina bg-ink md:static md:block"
            />
            <p data-step-in className="font-stencil mt-0 text-lg font-bold tracking-[0.2em] text-patina md:mt-8">
              {s.step}
            </p>
            <h3 data-step-in className="t-lg mt-2">
              {s.title}
            </h3>
            <p data-step-in className="mt-4 max-w-sm text-bone/75 md:text-lg">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
