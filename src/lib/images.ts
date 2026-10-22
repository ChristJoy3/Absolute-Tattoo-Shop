import generated from "@/data/images.generated.json";
import type { ImageId } from "@/data/content";

/** One optimized image: original JPEG fallback + AVIF/WebP renditions (see scripts/optimize-images.mjs). */
export type ImageMeta = {
  src: string;
  dir: string;
  width: number;
  height: number;
  widths: number[];
};

const table = generated as Record<string, ImageMeta>;

export function getImage(id: ImageId): ImageMeta {
  const meta = table[id];
  if (!meta) throw new Error(`Unknown image id: ${id}`);
  return meta;
}

/** Builds a srcset string like "/images/tattoos/tattoo-01-480.avif 480w, …". */
export function srcSet(id: ImageId, ext: "avif" | "webp"): string {
  const { dir, widths } = getImage(id);
  return widths.map((w) => `/images/${dir}/${id}-${w}.${ext} ${w}w`).join(", ");
}

/** Largest rendition URL, e.g. for the lightbox or link previews. */
export function largest(id: ImageId, ext: "avif" | "webp" = "webp"): string {
  const { dir, widths } = getImage(id);
  return `/images/${dir}/${id}-${widths[widths.length - 1]}.${ext}`;
}

/** Images narrower than this shouldn't be shown large. */
export const LOW_RES_WIDTH = 500;
export const isLowRes = (id: ImageId) => Math.max(getImage(id).width, getImage(id).height) < LOW_RES_WIDTH;
