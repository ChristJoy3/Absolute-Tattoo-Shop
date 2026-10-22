"use client";

import { useRef } from "react";
import { preload } from "react-dom";
import { srcSet } from "@/lib/images";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, MQ } from "@/lib/motion";
import { onIntroDone } from "@/lib/intro";
import { scrollToHash } from "@/lib/scroll";
import { coordsLabel, heroImage, shop } from "@/data/content";
import { Picture } from "@/components/ui/Picture";
import { InkMask, animateInk } from "@/components/ui/InkMask";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PhoneIcon } from "@/components/ui/icons";

/** Headline, split into deliberate lines so each can go outline → fill independently. */
const LINES = ["Tattoos &", "piercing", "done right", "since 1994."];
const HERO_SIZES = "(min-width: 1280px) 30rem, (min-width: 768px) 52vw, 82vw";

/**
 * HERO. Signature moment: the headline arrives as hollow stencil outlines, then ink
 * floods each line left → right while the featured piece bleeds in through an ink-drop mask.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  // <link rel="preload"> in <head> for the hero piece (the LCP element), discovered before any JS.
  preload(srcSet(heroImage.id, "avif").split(" ")[0], {
    as: "image",
    type: "image/avif",
    imageSrcSet: srcSet(heroImage.id, "avif"),
    imageSizes: HERO_SIZES,
    fetchPriority: "high",
  });

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add({ motion: MQ.motion, large: MQ.large }, (ctx) => {
        const large = Boolean(ctx.conditions?.large);
        // The entrance (and its hidden "before" states) is built only when the intro hands off.
        // On first visits the hero meanwhile paints normally underneath the preloader, so the
        // hero image counts for LCP as soon as it loads instead of after the ink reveal.
        // Registered as a method of THIS matchMedia context (not useGSAP's contextSafe): whether it
        // runs now (intro skipped) or later (after the preloader), its tweens belong to one context
        // and are reverted with it. Mixing the two contexts made them reference each other.
        const enter = ctx.add("enter", () => {
          const tl = gsap.timeline({ defaults: { ease: EASE.ink } });
          const mask = el.querySelector<HTMLElement>("[data-ink-mask]")!;

          tl.set("[data-hero-hide]", { visibility: "visible" })
            // STENCIL: hollow lines rise into place
            .from("[data-line-outline]", { yPercent: 110, duration: 1.3, stagger: 0.08 }, 0)
            // INK: the fill wipes across each line
            .fromTo(
              "[data-line-fill]",
              { clipPath: "inset(0% 100% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, stagger: 0.12, ease: "power3.inOut" },
              0.75,
            )
            .from("[data-hero-label]", { opacity: 0, y: 14, duration: 1, stagger: 0.06 }, 0.2)
            .from("[data-hero-rule]", { scaleX: 0, transformOrigin: "left center", duration: 1.6, ease: EASE.line }, 0.3)
            .from("[data-hero-copy] > *", { opacity: 0, y: 24, duration: 1.1, stagger: 0.08 }, 1.1)
            .from("[data-hero-frame]", { opacity: 0, duration: 0.01 }, 0.3);
          animateInk(tl, mask, { at: 0.35, duration: large ? 1.8 : 1.4 });
          tl.from("[data-hero-img]", { scale: 1.25, duration: 2.6 }, 0.35);
        });

        const off = onIntroDone(enter as () => void);

        // Scroll: the image drifts and the headline lifts away (tablet + desktop only).
        if (large) {
          gsap.to("[data-hero-img-drift]", {
            yPercent: 12,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          });
          gsap.to("[data-hero-title]", {
            yPercent: -18,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          });
        }
        return () => off();
      });

      // Reduced motion: everything is simply visible, and the ink mask is never attached.
      mm.add(MQ.reduce, () => {
        gsap.set("[data-hero-hide]", { visibility: "visible" });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden px-[var(--gutter)] pt-[calc(var(--nav-h)+1.5rem)] pb-10 md:pb-14"
    >
      {/* Top meta row */}
      <div data-hero-hide className="relative z-10 flex items-center justify-between gap-4">
        <p data-hero-label className="font-stencil text-sm font-bold tracking-[0.22em] text-patina uppercase">
          Est. 1994
        </p>
        <p data-hero-label className="label hidden text-bone/60 md:block">
          {coordsLabel}
        </p>
        <p data-hero-label className="label text-bone/80">
          Bellevue, NE
        </p>
      </div>
      <div data-hero-hide data-hero-rule className="mt-4 h-px w-full bg-bone/20" />

      <div className="relative mt-8 grid flex-1 grid-cols-1 gap-10 md:mt-10 xl:mt-6 xl:grid-cols-12 xl:gap-6">
        {/* Headline */}
        <div className="relative z-10 xl:col-span-8 xl:self-center">
          <h1
            id="hero-title"
            data-hero-title
            className="t-mega text-bone [font-size:15.5vw] md:[font-size:min(14.5vw,15svh)] xl:[font-size:min(10.5vw,15.5svh)]"
          >
            <span className="sr-only">Tattoos and piercing done right since 1994, in Bellevue, Nebraska</span>
            <span aria-hidden="true" data-hero-hide className="block">
              {LINES.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.04em] whitespace-nowrap">
                  <span data-line-outline className={`relative block ${i === 3 ? "text-ember" : ""}`}>
                    <span className="text-outline block">{line}</span>
                    <span data-line-fill className="absolute inset-0 block">
                      {line}
                    </span>
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <div data-hero-copy data-hero-hide className="mt-8 flex max-w-xl flex-col gap-7 md:mt-10 xl:mt-7 xl:gap-6">
            <p className="t-lead text-bone/80">
              High-quality custom tattoos, portrait tattoos and body piercing for the Omaha metro and Iowa. Family-run on
              Mission Ave. since July 1994.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <MagneticButton
                href={shop.phone.href}
                className="h-14 items-center rounded-full bg-ember px-7 font-display text-xl font-extrabold tracking-wide text-bone uppercase transition-colors hover:bg-oxblood"
                aria-label={`Call to book: ${shop.phone.display}`}
              >
                <PhoneIcon /> Call to book
              </MagneticButton>
              <a
                href="#tattoos"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash("#tattoos", lenis);
                }}
                className="label link-line inline-flex min-h-11 items-center text-bone/80 hover:text-bone"
              >
                See the work ↓
              </a>
            </div>
          </div>
        </div>

        {/* Featured piece, framed like a gallery print */}
        <div
          data-hero-hide
          data-hero-frame
          className="relative mx-auto w-[min(82vw,26rem)] self-end md:w-[min(52vw,30rem)] xl:col-span-4 xl:mr-0 xl:w-full xl:max-w-[30rem] xl:self-center"
        >
          <InkMask className="aspect-[1545/2176] w-full overflow-hidden bg-ink-2">
            <div data-hero-img-drift className="absolute inset-x-0 -top-[6%] h-[112%]">
              <div data-hero-img className="duo h-full w-full">
                <Picture
                  id={heroImage.id}
                  alt={heroImage.alt}
                  priority
                  sizes={HERO_SIZES}
                  className="block h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
            </div>
          </InkMask>
          <div className="mt-3 flex items-center justify-between">
            <p className="label text-bone/50">No. 001 · {heroImage.style}</p>
            <p className="label text-bone/50">Made at Absolute</p>
          </div>
        </div>
      </div>
    </section>
  );
}
