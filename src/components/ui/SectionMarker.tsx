type SectionMarkerProps = {
  /** Two-digit section number, e.g. "02". */
  index: string;
  title: string;
  className?: string;
};

/**
 * Serial-number style section label: "EST. 1994 / 02 — Our Story".
 * A quiet nod to the owners' military background: stencil numerals, mono caps.
 */
export function SectionMarker({ index, title, className = "" }: SectionMarkerProps) {
  return (
    <p className={`flex items-center gap-3 text-patina ${className}`}>
      <span className="font-stencil text-[0.95rem] font-bold tracking-[0.2em] uppercase">Est. 1994 / {index}</span>
      <span aria-hidden className="h-px w-8 bg-current opacity-60 md:w-12" />
      <span className="label">{title}</span>
    </p>
  );
}
