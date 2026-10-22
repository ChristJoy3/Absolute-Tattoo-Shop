"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { nav, shop } from "@/data/content";
import { scrollToHash } from "@/lib/scroll";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { CloseIcon, PhoneIcon, PinIcon } from "./icons";

type MenuOverlayProps = { open: boolean; onClose: () => void };

/**
 * Fullscreen menu. Oxblood ink floods down from the top, links rise in a stagger.
 * Links sit in the lower half on phones so they're reachable with one thumb.
 */
export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  useScrollLock(open);
  useFocusTrap(root, open, onClose);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const links = el.querySelectorAll("[data-menu-item]");
      if (open) {
        gsap.set(el, { visibility: "visible" });
        if (reduce) return;
        gsap
          .timeline()
          .fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" })
          .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.05, ease: "expo.out" }, 0.45)
          .fromTo("[data-menu-fade]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0.7);
      } else {
        if (reduce) {
          gsap.set(el, { visibility: "hidden" });
          return;
        }
        gsap.to(el, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.7,
          ease: "expo.inOut",
          onComplete: () => {
            gsap.set(el, { visibility: "hidden" });
          },
        });
      }
    },
    { dependencies: [open], scope: root },
  );

  const go = (href: string) => {
    onClose();
    // Wait for the scroll lock to release before scrolling.
    setTimeout(() => scrollToHash(href, lenis), 380);
  };

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
      className="invisible fixed inset-0 z-[70] flex flex-col bg-oxblood text-bone"
      style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      data-lenis-prevent
    >
      <div className="flex h-[var(--nav-h)] shrink-0 items-center justify-between px-[var(--gutter)]">
        <span data-menu-fade className="label text-bone/70">
          Est. 1994 / Bellevue, NE
        </span>
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          className="flex size-11 items-center justify-center rounded-full border border-bone/30 hover:border-bone"
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Auto margins (not justify-content) position the list: if it ever overflows, the top stays reachable. */}
      <nav aria-label="Sections" className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[var(--gutter)] py-4 md:py-6">
        <ol className="mt-auto space-y-1 md:mb-auto">
          {nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <a
                href={item.href}
                data-menu-item
                onClick={(e) => {
                  e.preventDefault();
                  go(item.href);
                }}
                className="group flex items-baseline gap-4 py-1 font-display text-[clamp(2rem,min(8.5vw,8.6svh),5.5rem)] leading-[0.95] font-black uppercase"
              >
                <span className="label w-7 shrink-0 text-patina">{String(i + 1).padStart(2, "0")}</span>
                <span className="transition-[color,-webkit-text-stroke] duration-500 group-hover:text-transparent group-hover:[-webkit-text-stroke:1.5px_var(--color-bone)]">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div
        data-menu-fade
        className="grid shrink-0 grid-cols-2 gap-px border-t border-bone/15 bg-bone/15"
        style={{ paddingBottom: "var(--safe-b)" }}
      >
        <a href={shop.phone.href} className="flex h-16 items-center justify-center gap-2 bg-oxblood font-display text-lg font-extrabold uppercase hover:bg-ember">
          <PhoneIcon /> {shop.phone.display}
        </a>
        <a
          href={shop.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-16 items-center justify-center gap-2 bg-oxblood font-display text-lg font-extrabold uppercase hover:bg-ember"
        >
          <PinIcon /> Directions
        </a>
      </div>
    </div>
  );
}
