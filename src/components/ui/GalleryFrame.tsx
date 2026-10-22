import type { GalleryItem } from "@/data/content";
import { Picture } from "./Picture";

type GalleryFrameProps = {
  item: GalleryItem;
  index: number;
  sizes: string;
  onOpen: () => void;
  className?: string;
  /** Light section variant (piercings). */
  tone?: "dark" | "light";
};

/**
 * One gallery piece framed like a flash-sheet cell: catalogue number, style tag on hover,
 * duotone at rest, full color on hover (mouse) and in the lightbox.
 */
export function GalleryFrame({ item, index, sizes, onOpen, className = "", tone = "dark" }: GalleryFrameProps) {
  const no = `No. ${String(index + 1).padStart(3, "0")}`;
  return (
    <button
      type="button"
      data-frame
      data-cursor-label="View"
      onClick={onOpen}
      className={`group relative block h-full w-full overflow-hidden text-left ${tone === "dark" ? "bg-ink-2" : "bg-ink/10"} ${className}`}
    >
      <span className="sr-only">Open larger view: </span>
      <span data-frame-img className="duo block h-full w-full">
        <Picture id={item.id} alt={item.alt} sizes={sizes} className="block h-full w-full" imgClassName="h-full w-full object-cover" />
      </span>
      <span aria-hidden className="label absolute top-2 left-2 z-[2] bg-ink/85 px-1.5 py-0.5 !text-[0.65rem] text-bone/80">
        {no}
      </span>
      {item.style && (
        <span
          aria-hidden
          className="label absolute inset-x-0 bottom-0 z-[2] flex items-center justify-between bg-gradient-to-t from-ink/90 to-transparent p-3 pt-8 text-bone transition-transform duration-500 ease-[var(--ease-ink)] can-hover:translate-y-full can-hover:group-hover:translate-y-0 can-hover:group-focus-visible:translate-y-0"
        >
          {item.style}
          <span className="text-ember">+</span>
        </span>
      )}
    </button>
  );
}
