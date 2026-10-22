"use client";

import { useCallback, useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { shop } from "@/data/content";
import { scrollToHash } from "@/lib/scroll";
import { Logo } from "./Logo";
import { MenuOverlay } from "./MenuOverlay";

/**
 * Minimal sticky bar: logo, phone (tablet+), menu button.
 * Hides while scrolling down, returns on scroll up; always visible near the top.
 */
export function Navbar() {
  const lenis = useLenis();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - last;
        if (Math.abs(delta) > 6) {
          setHidden(delta > 0 && y > 160);
          last = y;
        }
        setSolid(y > 40);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color] duration-700 ease-[var(--ease-ink)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${solid ? "bg-ink/92 xl:bg-ink/80" : "bg-transparent"}`}
      >
        <div className="mx-auto flex h-[var(--nav-h)] items-center justify-between gap-4 px-[var(--gutter)]">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToHash("#top", lenis);
            }}
            className="-my-2 block w-[8.5rem] py-2 md:w-[10.5rem]"
            aria-label={`${shop.name}, back to top`}
          >
            <Logo priority alt="" sizes="(min-width: 768px) 10.5rem, 8.5rem" />
          </a>

          <div className="flex items-center gap-2 md:gap-6">
            <a href={shop.phone.href} className="label link-line hidden py-3 text-bone/80 hover:text-bone md:inline-block">
              {shop.phone.display}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group flex h-11 min-w-11 items-center gap-3 rounded-full border border-bone/25 px-4 transition-colors hover:border-bone/60"
            >
              <span className="label hidden sm:inline">Menu</span>
              <span aria-hidden className="flex w-5 flex-col gap-[5px]">
                <span className="h-px w-full bg-bone transition-transform duration-500 group-hover:scale-x-75" />
                <span className="h-px w-full bg-bone" />
              </span>
              <span className="sr-only sm:hidden">Open menu</span>
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay open={open} onClose={close} />
    </>
  );
}
