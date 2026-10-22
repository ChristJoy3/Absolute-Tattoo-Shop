"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, MQ } from "@/lib/motion";
import { services, shop, tattoos, piercings, type GalleryItem } from "@/data/content";
import { useHoverCapable } from "@/hooks/useMediaQuery";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { RevealText } from "@/components/ui/RevealText";
import { Picture } from "@/components/ui/Picture";
import { ArrowIcon } from "@/components/ui/icons";

const allImages: GalleryItem[] = [...tattoos, ...piercings];
const imageFor = (id: string) => allImages.find((g) => g.id === id)!;

/**
 * SERVICES: three huge numbered rows.
 * Mouse / trackpad: rows stay open; a duotone preview follows the cursor (signature moment).
 * Touch: tap-to-expand rows with the image inline.
 */
export function Services() {
  const root = useRef<HTMLElement>(null);
  const hover = useHoverCapable();
  const [openIdx, setOpenIdx] = useState<number>(0);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      // Row hairlines draw in, row content rises.
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-row]").forEach((row) => {
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } })
            .from(row.querySelector("[data-row-rule]"), { scaleX: 0, transformOrigin: "left center", duration: 1.4, ease: EASE.line })
            .from(row.querySelectorAll("[data-row-in]"), { yPercent: 60, opacity: 0, duration: 1.1, stagger: 0.08, ease: EASE.ink }, 0.15);
        });
      });

      // Cursor-following preview (fine pointer + motion only).
      mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
        const preview = el.querySelector<HTMLElement>("[data-preview]");
        const list = el.querySelector<HTMLElement>("[data-rows]");
        if (!preview || !list) return;
        const frames = Array.from(preview.querySelectorAll<HTMLElement>("[data-preview-frame]"));
        const xTo = gsap.quickTo(preview, "x", { duration: 0.7, ease: "power3.out" });
        const yTo = gsap.quickTo(preview, "y", { duration: 0.7, ease: "power3.out" });
        const rTo = gsap.quickTo(preview, "rotation", { duration: 0.9, ease: "power3.out" });
        let lastX = 0;
        let row = -1;
        let slot = 0;
        let visible = false;
        let z = 1;
        const cycle = gsap.delayedCall(1.1, () => next()).pause();

        // Ink-wipe the requested gallery piece in on top of the previous one.
        const reveal = (r: number, sl: number) => {
          const f = frames.find((n) => n.dataset.row === String(r) && n.dataset.slot === String(sl));
          if (!f) return;
          gsap.set(f, { zIndex: ++z });
          gsap.fromTo(f, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: EASE.line, overwrite: true });
        };
        // While hovering a row, keep cycling through that service's gallery pieces.
        const next = () => {
          const count = frames.filter((n) => n.dataset.row === String(row)).length;
          if (row < 0 || count < 2) return;
          slot = (slot + 1) % count;
          reveal(row, slot);
          cycle.restart(true);
        };
        const setVisible = (on: boolean) => {
          if (on === visible) return;
          visible = on;
          gsap.to(preview, on ? { autoAlpha: 1, scale: 1, duration: 0.6, ease: EASE.ink } : { autoAlpha: 0, scale: 0.85, duration: 0.5, ease: "power3.out" });
          if (!on) {
            row = -1;
            cycle.pause();
          }
        };
        const show = (r: number) => {
          if (r === row) return;
          row = r;
          slot = 0;
          reveal(r, 0);
          cycle.restart(true);
        };
        // Visibility follows the pointer being over a row: robust to fast entries and scroll.
        const move = (e: PointerEvent) => {
          const r = list.getBoundingClientRect();
          xTo(e.clientX - r.left);
          yTo(e.clientY - r.top);
          rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.6));
          lastX = e.clientX;
          const target = (e.target as Element).closest<HTMLElement>("[data-row]");
          if (target) show(Number(target.dataset.index));
          setVisible(Boolean(target));
        };
        const leave = () => setVisible(false);
        gsap.set(preview, { autoAlpha: 0, scale: 0.85, xPercent: -50, yPercent: -50 });
        list.addEventListener("pointermove", move);
        list.addEventListener("pointerleave", leave);
        return () => {
          cycle.kill();
          list.removeEventListener("pointermove", move);
          list.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root, dependencies: [hover], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="services" aria-labelledby="services-title" className="relative px-[var(--gutter)] py-[clamp(5rem,12vw,10rem)]">
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <SectionMarker index="02" title="Services" />
          <RevealText as="h2" id="services-title" mode="chars" className="t-huge mt-8">
            What we do
          </RevealText>
        </div>
        <RevealText className="t-lead max-w-md self-end text-bone/75 xl:col-span-5 xl:justify-self-end">
          Three crafts, one standard: clean, careful and built to last. Not sure where to start? Call and talk it through.
        </RevealText>
      </div>

      <div data-rows className="relative mt-14 md:mt-20">
        <ol>
          {services.map((s, i) => {
            const img = imageFor(s.images[0]);
            const expanded = hover || openIdx === i;
            const panelId = `service-panel-${i}`;
            return (
              <li key={s.number} data-row data-index={i} className="relative">
                <span data-row-rule aria-hidden className="absolute inset-x-0 top-0 h-px bg-bone/20" />
                <h3>
                  {hover ? (
                    <div className={rowHeaderClass}>
                      <RowTitle number={s.number} title={s.title} />
                    </div>
                  ) : (
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                      className={`${rowHeaderClass} text-left`}
                    >
                      <RowTitle number={s.number} title={s.title} />
                      <span
                        aria-hidden
                        className={`flex size-11 shrink-0 items-center justify-center self-center rounded-full border border-bone/25 transition-transform duration-500 ${expanded ? "rotate-45" : ""}`}
                      >
                        <span className="relative block size-3.5">
                          <span className="absolute top-1/2 left-0 h-px w-full bg-bone" />
                          <span className="absolute top-0 left-1/2 h-full w-px bg-bone" />
                        </span>
                      </span>
                    </button>
                  )}
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-label={s.title}
                  className={`grid transition-[grid-template-rows] duration-700 ease-[var(--ease-ink)] ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-6 pb-8 pl-14 md:flex-row md:items-end md:justify-between md:pl-24 xl:pb-12">
                      <p data-row-in className="max-w-lg text-bone/75 md:text-lg">
                        {s.body}
                      </p>
                      {/* Inline image on touch devices */}
                      {!hover && (
                        <div className="duo is-color aspect-[4/3] w-full max-w-sm overflow-hidden md:w-72">
                          <Picture id={img.id} alt={img.alt} sizes="(min-width: 768px) 18rem, 80vw" imgClassName="h-full w-full object-cover" />
                        </div>
                      )}
                      <a href={shop.phone.href} data-row-in className="label link-line inline-flex min-h-11 shrink-0 items-center gap-2 text-bone">
                        Ask about {s.title.toLowerCase()} <ArrowIcon className="size-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <span aria-hidden className="block h-px w-full bg-bone/20" />

        {/* Cursor preview (hover devices only) */}
        {hover && (
          <div
            data-preview
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 z-10 aspect-[4/5] w-[clamp(14rem,20vw,20rem)] overflow-hidden opacity-0"
          >
            {services.flatMap((s, r) =>
              s.images.map((id, sl) => (
                <div
                  key={id}
                  data-preview-frame
                  data-row={r}
                  data-slot={sl}
                  className="duo absolute inset-0"
                  style={{ clipPath: "inset(100% 0% 0% 0%)" }}
                >
                  <Picture id={id} alt="" sizes="20vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
                </div>
              )),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

const rowHeaderClass = "group flex w-full items-baseline gap-4 py-6 md:gap-8 md:py-8 xl:py-10";

function RowTitle({ number, title }: { number: string; title: string }) {
  return (
    <>
      <span data-row-in className="font-stencil w-10 shrink-0 text-lg font-bold tracking-[0.2em] text-patina md:w-16 md:text-2xl">
        {number}
      </span>
      <span
        data-row-in
        className="t-xl flex-1 transition-[color,-webkit-text-stroke] duration-500 can-hover:group-hover:text-transparent can-hover:group-hover:[-webkit-text-stroke:1.5px_var(--color-bone)]"
      >
        {title}
      </span>
    </>
  );
}
