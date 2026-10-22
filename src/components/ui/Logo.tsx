/**
 * The client's logo, used EXACTLY as supplied (public/logo.png, 2000×2000 with transparent padding).
 * We never edit the file: a wrapper with the artwork's aspect ratio and overflow:hidden simply
 * frames the visible part, and the PNG is scaled proportionally inside it.
 *
 * Artwork bounding box inside the PNG (measured with sharp.trim): x 118, y 757, 1763×483.
 */
const CANVAS = 2000;
const BOX = { x: 118, y: 757, w: 1763, h: 483 };

type LogoProps = {
  className?: string;
  /** Rendered width of the visible artwork, for `sizes`. */
  sizes?: string;
  /** Eager-load when the logo is above the fold (navbar, preloader). */
  priority?: boolean;
  alt?: string;
};

export function Logo({ className = "", priority, sizes = "20rem", alt = "Absolute Tattoos & Body Piercing, est. 1994" }: LogoProps) {
  // The <img> box is the full 2000px canvas scaled up by CANVAS/BOX.w, so `sizes` is scaled to match.
  const canvasSizes = `calc((${sizes}) * ${(CANVAS / BOX.w).toFixed(4)})`;
  return (
    <picture
      className={`relative block overflow-hidden ${className}`}
      style={{ aspectRatio: `${BOX.w} / ${BOX.h}` }}
    >
      {/* Proportional downscales of logo.png (scripts/optimize-images.mjs); the original PNG is the fallback. */}
      <source type="image/webp" srcSet="/logo-480.webp 480w, /logo-960.webp 960w, /logo-1600.webp 1600w" sizes={canvasSizes} />
      <img
        src="/logo.png"
        alt={alt}
        width={CANVAS}
        height={CANVAS}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        draggable={false}
        className="absolute max-w-none select-none"
        style={{
          width: `${(CANVAS / BOX.w) * 100}%`,
          height: "auto",
          left: `${(-BOX.x / BOX.w) * 100}%`,
          top: `${(-BOX.y / BOX.h) * 100}%`,
        }}
      />
    </picture>
  );
}
