import type { ImageId } from "@/data/content";
import { getImage, srcSet } from "@/lib/images";

type PictureProps = {
  id: ImageId;
  alt: string;
  /** `sizes` attribute: how wide the image renders at each breakpoint. */
  sizes: string;
  /** Above-the-fold hero image: eager + high fetch priority. Everything else lazy-loads. */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
};

/**
 * Responsive <picture>: AVIF → WebP → original JPEG fallback.
 * Explicit width/height give the browser the aspect ratio up front (no layout shift).
 */
export function Picture({ id, alt, sizes, priority, className, imgClassName }: PictureProps) {
  const meta = getImage(id);
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(id, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(id, "webp")} sizes={sizes} />
      <img
        src={meta.src}
        alt={alt}
        width={meta.width}
        height={meta.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={imgClassName}
        draggable={false}
      />
    </picture>
  );
}
