"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, MQ } from "@/lib/motion";
import { story } from "@/data/content";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { RevealText } from "@/components/ui/RevealText";
import { YearsInBusiness } from "@/components/ui/YearsInBusiness";

/**
 * OUR STORY: Army → Europe → Bellevue → the "For Rent" sign → still here.
 * Desktop: the beats travel horizontally in a pinned track while a patina line draws beneath them.
 * Mobile / tablet: a vertical flow with a line drawing down the left edge (no pin, native scroll).
 * Signature moment: the "For Rent" sign is traced as linework, then inks in.
 */
export function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      // Desktop: horizontal pinned timeline.
      mm.add(MQ.desktop, () => {
        const track = el.querySelector<HTMLElement>("[data-track]")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "[data-pin]",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        tl.to(track, { x: () => -distance() }, 0).fromTo("[data-rule-h]", { scaleX: 0 }, { scaleX: 1 }, 0);

        // Each beat's node inks in as it reaches the middle of the screen.
        gsap.utils.toArray<HTMLElement>("[data-beat]").forEach((beat) => {
          gsap.from(beat.querySelectorAll("[data-beat-in]"), {
            opacity: 0,
            y: 40,
            stagger: 0.08,
            duration: 1,
            ease: EASE.ink,
            scrollTrigger: { trigger: beat, containerAnimation: tl, start: "left 75%", once: true },
          });
          gsap.to(beat.querySelector("[data-node]"), {
            backgroundColor: "#b43606",
            borderColor: "#b43606",
            scrollTrigger: { trigger: beat, containerAnimation: tl, start: "left 55%", toggleActions: "play none none reverse" },
          });
        });
        drawSign(el, { trigger: el.querySelector("[data-sign]")!, containerAnimation: tl, start: "left 70%" });
      });

      // Mobile + tablet: vertical flow, line scrubs down the left edge.
      mm.add(`(max-width: 1279px) and (prefers-reduced-motion: no-preference)`, () => {
        gsap.fromTo(
          "[data-rule-v]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-track]", start: "top 70%", end: "bottom 70%", scrub: 0.5 },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-beat]").forEach((beat) => {
          gsap.from(beat.querySelectorAll("[data-beat-in]"), {
            opacity: 0,
            y: 28,
            stagger: 0.07,
            duration: 1,
            ease: EASE.ink,
            scrollTrigger: { trigger: beat, start: "top 82%", once: true },
          });
          gsap.to(beat.querySelector("[data-node]"), {
            backgroundColor: "#b43606",
            borderColor: "#b43606",
            scrollTrigger: { trigger: beat, start: "top 70%", toggleActions: "play none none reverse" },
          });
        });
        drawSign(el, { trigger: el.querySelector("[data-sign]")!, start: "top 80%" });
      });

      // Big years counter: outline → fill as it scrolls through.
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-years-fill]",
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: "[data-years]", start: "top 80%", end: "bottom 55%", scrub: 0.6 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="story" aria-labelledby="story-title" className="relative bg-oxblood-2">
      {/* Intro */}
      <div className="px-[var(--gutter)] pt-[clamp(5rem,12vw,10rem)]">
        <SectionMarker index="01" title="Our story" />
        <div className="mt-8 grid gap-10 xl:grid-cols-12 xl:items-end">
          <RevealText as="h2" id="story-title" mode="chars" className="t-huge xl:col-span-8">
            From the Army to Mission Ave.
          </RevealText>
          <div data-years className="xl:col-span-4 xl:justify-self-end">
            <p className="relative font-display text-[clamp(7rem,26vw,16rem)] leading-[0.8] font-black text-ember" aria-hidden="true">
              <span className="text-outline block">
                <YearsInBusiness countUp />
              </span>
              <span data-years-fill className="absolute inset-0 block">
                <YearsInBusiness countUp />
              </span>
            </p>
            <p className="label mt-3 text-bone/80">
              <span className="sr-only">
                <YearsInBusiness />{" "}
              </span>
              years in business, since July 1994
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div data-pin className="relative xl:flex xl:h-[100svh] xl:items-center xl:overflow-hidden">
        <ol
          data-track
          className="relative mt-16 flex flex-col gap-14 pl-[calc(var(--gutter)+2.25rem)] pr-[var(--gutter)] pb-[clamp(4rem,10vw,8rem)] md:gap-20 xl:mt-0 xl:w-max xl:flex-row xl:gap-0 xl:pb-0 xl:pl-[var(--gutter)]"
        >
          {/* Vertical rule (mobile/tablet) */}
          <span aria-hidden className="absolute top-2 bottom-0 left-[calc(var(--gutter)+0.4rem)] w-px bg-bone/15 xl:hidden">
            <span data-rule-v className="block h-full w-full origin-top bg-patina" />
          </span>
          {/* Horizontal rule (desktop) */}
          <span aria-hidden className="absolute top-[3.15rem] right-0 left-0 hidden h-px bg-bone/15 xl:block">
            <span data-rule-h className="block h-full w-full origin-left bg-patina" />
          </span>

          {story.beats.map((beat, i) => (
            <li
              key={beat.marker}
              data-beat
              className="relative md:max-w-xl xl:w-[min(34vw,32rem)] xl:max-w-none xl:shrink-0 xl:pr-[6vw]"
            >
              <span
                data-node
                aria-hidden
                className="absolute top-[0.45rem] -left-[2.2rem] size-3.5 rounded-full border border-patina bg-oxblood-2 xl:static xl:mb-0 xl:block xl:translate-y-[2.7rem]"
              />
              <div className="xl:pt-[5.5rem]">
                <p data-beat-in className="flex items-center gap-3">
                  <span className="font-stencil text-lg font-bold tracking-[0.2em] text-patina">{beat.marker}</span>
                  <span className="label text-bone/60">{beat.kicker}</span>
                </p>
                <h3 data-beat-in className="t-lg mt-3 text-bone">
                  {beat.title}
                </h3>
                <p data-beat-in className="mt-4 max-w-md text-bone/75 md:text-lg">
                  {beat.body}
                </p>
                {i === 3 && <ForRentSign />}
                {i === 4 && (
                  <p data-beat-in className="label mt-5 text-ember">
                    <YearsInBusiness /> years and counting
                  </p>
                )}
              </div>
            </li>
          ))}

          {/* Owners' quote closes the track */}
          <li data-beat className="relative xl:flex xl:w-[min(52vw,52rem)] xl:shrink-0 xl:items-center xl:pr-[var(--gutter)]">
            <span data-node aria-hidden className="sr-only" />
            <figure className="xl:pt-[5.5rem]">
              <blockquote data-beat-in className="t-xl text-bone">
                “{story.quote}”
              </blockquote>
              <figcaption data-beat-in className="label mt-6 text-patina">
                {story.quoteBy}
              </figcaption>
            </figure>
          </li>
        </ol>
      </div>
    </section>
  );
}

/** The sign they saw from City Hall's steps, drawn as linework: hangers → board → ink. */
function ForRentSign() {
  return (
    <div data-sign data-beat-in className="mt-8 w-[min(70vw,17rem)] text-bone" aria-hidden="true">
      <svg viewBox="0 0 240 150" fill="none" className="w-full overflow-visible">
        {/* hangers */}
        <path data-sign-line d="M60 2 L60 38" stroke="currentColor" strokeWidth="2" pathLength={1} />
        <path data-sign-line d="M180 2 L180 38" stroke="currentColor" strokeWidth="2" pathLength={1} />
        <path data-sign-line d="M20 2 L220 2" stroke="currentColor" strokeWidth="2.5" pathLength={1} strokeLinecap="round" />
        {/* board */}
        <path
          data-sign-line
          d="M14 40 H226 Q232 40 232 46 V136 Q232 142 226 142 H14 Q8 142 8 136 V46 Q8 40 14 40 Z"
          stroke="currentColor"
          strokeWidth="2.5"
          pathLength={1}
        />
        <rect data-sign-fill x="8" y="40" width="224" height="102" rx="6" fill="#b43606" />
        <text
          data-sign-text
          x="120"
          y="104"
          textAnchor="middle"
          fill="#f2ece3"
          style={{ font: "900 44px var(--font-big-shoulders-stencil), sans-serif", letterSpacing: "0.08em" }}
        >
          FOR RENT
        </text>
      </svg>
    </div>
  );
}

type SignTrigger = { trigger: Element; start: string; containerAnimation?: gsap.core.Animation };

function drawSign(scope: HTMLElement, st: SignTrigger) {
  const lines = scope.querySelectorAll("[data-sign-line]");
  gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap
    .timeline({ scrollTrigger: { ...st, once: true } })
    .to(lines, { strokeDashoffset: 0, duration: 1.2, stagger: 0.15, ease: "power2.inOut" })
    .fromTo("[data-sign-fill]", { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "power2.out" }, "-=0.2")
    .fromTo("[data-sign-text]", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.9, ease: EASE.ink }, "-=0.5");
}
