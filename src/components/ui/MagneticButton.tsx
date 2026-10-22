"use client";

import { useRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";

type MagneticButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  /** 0–1: how far the button follows the pointer. */
  strength?: number;
};

/**
 * Link-button that leans toward the cursor on fine-pointer devices.
 * Touch devices get a normal, instantly tappable link.
 */
export function MagneticButton({ children, strength = 0.35, className = "", ...rest }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");
      const mm = gsap.matchMedia();
      mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" });
        const ixTo = inner && gsap.quickTo(inner, "x", { duration: 0.8, ease: "power3.out" });
        const iyTo = inner && gsap.quickTo(inner, "y", { duration: 0.8, ease: "power3.out" });

        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          xTo(dx * strength);
          yTo(dy * strength);
          ixTo?.(dx * strength * 0.4);
          iyTo?.(dy * strength * 0.4);
        };
        const leave = () => {
          gsap.to([el, inner].filter(Boolean), { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.4)" });
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <a ref={ref} className={`inline-flex will-change-transform ${className}`} data-cursor="hover" {...rest}>
      <span data-magnetic-inner className="inline-flex items-center gap-3">
        {children}
      </span>
    </a>
  );
}
