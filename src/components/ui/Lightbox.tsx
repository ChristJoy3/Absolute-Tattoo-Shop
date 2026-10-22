"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap, useGSAP } from "@/lib/gsap";
import type { GalleryItem } from "@/data/content";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { Picture } from "./Picture";
import { ArrowIcon, CloseIcon } from "./icons";

type LightboxProps = {
  items: GalleryItem[];
  /** Open index, or null when closed. */
  index: number | null;
  onChange: (index: number | null) => void;
  label: string;
};

/**
 * Fullscreen viewer: images in full color, uncropped.
 * Keyboard: ← → Esc. Touch: swipe left/right. Focus is trapped and restored; background scroll locked.
 */
export function Lightbox({ items, index, onChange, label }: LightboxProps) {
  const open = index !== null;
  if (!open || typeof document === "undefined") return null;
  return createPortal(<LightboxDialog items={items} index={index} onChange={onChange} label={label} />, document.body);
}

function LightboxDialog({ items, index, onChange, label }: LightboxProps & { index: number }) {
  const root = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const item = items[index];
  const total = items.length;

  const close = useCallback(() => onChange(null), [onChange]);
  const step = useCallback((dir: 1 | -1) => onChange((index + dir + total) % total), [index, total, onChange]);

  useScrollLock(true);
  useFocusTrap(root, true, close);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [step]);

  // Open: ink wipe up. Each image change: quick fade/settle.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(root.current, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" });
    },
    { scope: root },
  );
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo("[data-lb-image]", { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "expo.out" });
    },
    { scope: root, dependencies: [index] },
  );

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={`${label}: image ${index + 1} of ${total}`}
      className="fixed inset-0 z-[80] flex flex-col bg-ink/97 text-bone"
      data-lenis-prevent
      onTouchStart={(e) => {
        const t = e.touches[0];
        touch.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        if (!start) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
        else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close(); // swipe down to dismiss
      }}
    >
      <div className="flex h-[var(--nav-h)] shrink-0 items-center justify-between px-[var(--gutter)]">
        <p className="label text-bone/70" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          {item.style ? <span className="ml-3 text-patina">{item.style}</span> : null}
        </p>
        <button
          type="button"
          onClick={close}
          data-autofocus
          className="flex size-11 items-center justify-center rounded-full border border-bone/30 hover:border-bone"
          aria-label="Close gallery"
        >
          <CloseIcon />
        </button>
      </div>

      <figure className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-[var(--gutter)] pb-4">
        <div data-lb-image key={item.id} className="flex min-h-0 w-full flex-1 items-center justify-center">
          <Picture
            id={item.id}
            alt={item.alt}
            sizes="(min-width: 1280px) 70vw, 100vw"
            className="flex h-full w-full items-center justify-center"
            imgClassName="max-h-full max-w-full object-contain select-none"
          />
        </div>
        <figcaption className="mt-4 max-w-2xl text-center text-sm text-bone/70 md:text-base">{item.alt}</figcaption>
      </figure>

      <div className="flex shrink-0 items-center justify-between gap-4 px-[var(--gutter)] pb-[calc(1rem+var(--safe-b))]">
        <button
          type="button"
          onClick={() => step(-1)}
          className="flex h-12 min-w-12 items-center gap-2 rounded-full border border-bone/30 px-4 hover:border-bone"
          aria-label="Previous image"
        >
          <ArrowIcon className="size-5 rotate-180" />
          <span className="label hidden md:inline">Prev</span>
        </button>
        <p className="label hidden text-bone/50 md:block">← → to browse · Esc to close</p>
        <button
          type="button"
          onClick={() => step(1)}
          className="flex h-12 min-w-12 items-center gap-2 rounded-full border border-bone/30 px-4 hover:border-bone"
          aria-label="Next image"
        >
          <span className="label hidden md:inline">Next</span>
          <ArrowIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
