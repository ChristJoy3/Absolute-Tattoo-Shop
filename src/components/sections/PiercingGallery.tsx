"use client";

import { useRef, useState } from "react";
import { piercings } from "@/data/content";
import { useGalleryReveal } from "@/hooks/useGalleryReveal";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { RevealText } from "@/components/ui/RevealText";
import { GalleryFrame } from "@/components/ui/GalleryFrame";
import { Lightbox } from "@/components/ui/Lightbox";

/**
 * PIERCING GALLERY: the lighter counterpart. Bone "paper" background, ink type.
 * Phones: native CSS scroll-snap carousel. Tablet/desktop: a compact grid.
 */
export function PiercingGallery() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  useGalleryReveal(root, piercings.length);

  return (
    <section
      ref={root}
      id="piercings"
      aria-labelledby="piercings-title"
      className="relative bg-bone py-[clamp(5rem,12vw,10rem)] text-ink [&_.text-patina]:text-[#2f6b65]"
    >
      <div className="grid gap-6 px-[var(--gutter)] xl:grid-cols-12">
        <div className="xl:col-span-8">
          <SectionMarker index="05" title="Body piercing" />
          <RevealText as="h2" id="piercings-title" mode="chars" className="t-mega mt-8">
            Piercing
          </RevealText>
        </div>
        <div className="flex flex-col justify-end gap-3 xl:col-span-4">
          <RevealText className="t-lead max-w-md text-ink/75">
            Ears, nose, lip and navel, placed with care by a state-licensed, certified piercer using autoclave-sterilized tools.
          </RevealText>
        </div>
      </div>

      <ul
        aria-label="Piercing gallery"
        className="no-scrollbar mt-12 flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-3 overflow-x-auto px-[var(--gutter)] md:mt-16 md:grid md:snap-none md:grid-cols-4 md:gap-2.5 md:overflow-visible xl:grid-cols-6 xl:gap-3"
      >
        {piercings.map((item, i) => (
          <li key={item.id} className="aspect-[4/5] w-[72vw] max-w-[22rem] shrink-0 snap-start md:w-auto md:max-w-none">
            <GalleryFrame
              item={item}
              index={i}
              tone="light"
              sizes="(min-width: 1280px) 16vw, (min-width: 768px) 24vw, 72vw"
              onOpen={() => setOpen(i)}
            />
          </li>
        ))}
      </ul>
      <p className="label mt-5 px-[var(--gutter)] text-ink/60 md:hidden" aria-hidden>
        Swipe → {piercings.length} pieces
      </p>

      <Lightbox items={piercings} index={open} onChange={setOpen} label="Piercing gallery" />
    </section>
  );
}
