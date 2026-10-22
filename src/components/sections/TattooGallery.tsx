"use client";

import { useRef, useState } from "react";
import { tattoos, type Tier } from "@/data/content";
import { useGalleryReveal } from "@/hooks/useGalleryReveal";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { RevealText } from "@/components/ui/RevealText";
import { GalleryFrame } from "@/components/ui/GalleryFrame";
import { Lightbox } from "@/components/ui/Lightbox";

/** How many pieces the wall shows before "Show all". */
const INITIAL = 18;

const CELL: Record<Tier, string> = {
  feature: "col-span-2 row-span-2",
  standard: "",
  small: "",
};
const SIZES: Record<Tier, string> = {
  feature: "(min-width: 1280px) 32vw, (min-width: 768px) 48vw, 95vw",
  standard: "(min-width: 1280px) 16vw, (min-width: 768px) 24vw, 48vw",
  small: "(min-width: 1280px) 16vw, (min-width: 768px) 24vw, 48vw",
};

/**
 * TATTOO GALLERY: an editorial "flash wall". Strongest high-res pieces get 2×2 frames;
 * low-res originals stay in single cells. Staggered ink reveals, fullscreen lightbox.
 */
export function TattooGallery() {
  const root = useRef<HTMLElement>(null);
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const visible = showAll ? tattoos : tattoos.slice(0, INITIAL);
  useGalleryReveal(root, visible.length);

  return (
    <section ref={root} id="tattoos" aria-labelledby="tattoos-title" className="relative px-[var(--gutter)] py-[clamp(5rem,12vw,10rem)]">
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <SectionMarker index="04" title="Tattoos" />
          <RevealText as="h2" id="tattoos-title" mode="chars" className="t-mega mt-8">
            The wall
          </RevealText>
        </div>
        <div className="flex flex-col justify-end gap-3 xl:col-span-4">
          <RevealText className="t-lead max-w-md text-bone/75">
            Real work from our chairs: custom pieces, portraits, cover-ups and color. Tap any piece to see it in full color.
          </RevealText>
          <p className="label text-patina">{tattoos.length} pieces · Made at Absolute</p>
        </div>
      </div>

      <div className="flash-wall-wrap mt-12 md:mt-16">
        <ul className="flash-wall" aria-label="Tattoo gallery">
          {visible.map((item, i) => (
            <li key={item.id} className={CELL[item.tier]}>
              <GalleryFrame item={item} index={i} sizes={SIZES[item.tier]} onOpen={() => setOpen(i)} />
            </li>
          ))}
        </ul>
      </div>

      {!showAll && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="label flex min-h-12 items-center gap-3 rounded-full border border-bone/30 px-6 transition-colors hover:border-bone hover:bg-bone hover:text-ink"
          >
            Show all {tattoos.length} pieces <span aria-hidden>+</span>
          </button>
        </div>
      )}

      <Lightbox items={tattoos} index={open} onChange={setOpen} label="Tattoo gallery" />
    </section>
  );
}
