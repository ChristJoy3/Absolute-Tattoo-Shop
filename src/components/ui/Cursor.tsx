"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useHoverCapable } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Flowing-ink cursor (desktop / fine pointer only, never on touch or with reduced motion).
 *
 * A tapered brush stroke drawn on a canvas: a heavy, blunt head under the pointer and a
 * hairline tail that trails behind it. The tail is a chain of points; each one eases toward
 * the point ahead of it, so the stroke stretches with speed and pulls back into a drop when
 * the pointer rests. Easing is frame-rate independent and drawing sleeps once the ink settles.
 *
 * Over links/buttons the head swells into a blot; elements with `data-cursor-label` show a label.
 * The native cursor stays visible for accessibility.
 */
export function Cursor() {
  const hover = useHoverCapable();
  const reduce = useReducedMotion();
  if (!hover || reduce) return null;
  return <InkTrail />;
}

/** Points in the stroke: more = longer, silkier tail. */
const POINTS = 28;
/** How quickly the head catches the pointer (per 60fps frame). High = no perceived lag. */
const HEAD_EASE = 0.55;
/** How quickly each tail point follows the one ahead. Lower = longer, lazier ink. */
const TAIL_EASE = 0.38;
/** Head thickness in CSS px at rest, and when over an interactive element. */
const HEAD_W = 7;
const HEAD_W_HOVER = 22;

type Pt = { x: number; y: number };

function InkTrail() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const pts: Pt[] = Array.from({ length: POINTS }, () => ({ x: -100, y: -100 }));
    const mouse = { x: -100, y: -100 };
    const head = { w: HEAD_W, alpha: 0 };
    let started = false;
    let asleep = true;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(innerWidth * dpr);
      cv.height = Math.round(innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      wake();
    };

    /** Draws the stroke as one filled, tapered ribbon with a rounded, heavy head. */
    const draw = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      if (head.alpha <= 0.001) return;

      // Half-widths: full at the head, easing to a hairline at the tail (like a brush lifting off).
      const left: Pt[] = [];
      const right: Pt[] = [];
      for (let i = 0; i < POINTS; i++) {
        const p = pts[i];
        const a = pts[Math.max(0, i - 1)];
        const b = pts[Math.min(POINTS - 1, i + 1)];
        let nx = -(b.y - a.y);
        let ny = b.x - a.x;
        const len = Math.hypot(nx, ny) || 1;
        nx /= len;
        ny /= len;
        const t = i / (POINTS - 1);
        const hw = (head.w / 2) * Math.pow(1 - t, 1.6) + 0.35 * (1 - t);
        left.push({ x: p.x + nx * hw, y: p.y + ny * hw });
        right.push({ x: p.x - nx * hw, y: p.y - ny * hw });
      }

      ctx.globalAlpha = head.alpha;
      ctx.fillStyle = "#f2ece3";
      ctx.beginPath();
      // Down the left edge (smoothed through midpoints), to the tail tip, back up the right edge.
      ctx.moveTo(left[0].x, left[0].y);
      for (let i = 1; i < POINTS - 1; i++) {
        ctx.quadraticCurveTo(left[i].x, left[i].y, (left[i].x + left[i + 1].x) / 2, (left[i].y + left[i + 1].y) / 2);
      }
      ctx.lineTo(pts[POINTS - 1].x, pts[POINTS - 1].y);
      for (let i = POINTS - 2; i > 0; i--) {
        ctx.quadraticCurveTo(right[i].x, right[i].y, (right[i].x + right[i - 1].x) / 2, (right[i].y + right[i - 1].y) / 2);
      }
      ctx.lineTo(right[0].x, right[0].y);
      ctx.closePath();
      ctx.fill();
      // The loaded tip of the brush.
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, head.w / 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = (_time: number, deltaMs: number) => {
      if (asleep) return;
      // Frame-rate independent easing: same feel at 60, 120 or 144 Hz.
      const f = Math.min(deltaMs, 50) / (1000 / 60);
      const kHead = 1 - Math.pow(1 - HEAD_EASE, f);
      const kTail = 1 - Math.pow(1 - TAIL_EASE, f);

      pts[0].x += (mouse.x - pts[0].x) * kHead;
      pts[0].y += (mouse.y - pts[0].y) * kHead;
      let motion = Math.abs(mouse.x - pts[0].x) + Math.abs(mouse.y - pts[0].y);
      for (let i = 1; i < POINTS; i++) {
        const p = pts[i];
        const q = pts[i - 1];
        const dx = (q.x - p.x) * kTail;
        const dy = (q.y - p.y) * kTail;
        p.x += dx;
        p.y += dy;
        motion += Math.abs(dx) + Math.abs(dy);
      }
      draw();
      // Fully settled into a drop and nothing tweening: stop drawing until the next movement.
      if (motion < 0.05 && !gsap.isTweening(head)) asleep = true;
      if (label.current) label.current.style.transform = `translate3d(${pts[0].x}px, ${pts[0].y}px, 0)`;
    };

    const wake = () => {
      asleep = false;
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!started) {
        // First movement: start the whole stroke at the pointer (no streak in from a corner).
        started = true;
        pts.forEach((p) => {
          p.x = mouse.x;
          p.y = mouse.y;
        });
        gsap.to(head, { alpha: 1, duration: 0.4, onUpdate: wake });
      }
      wake();
    };

    let state: "idle" | "hover" | "label" = "idle";
    const set = (next: typeof state, text = "") => {
      if (next === state && next !== "label") return;
      state = next;
      gsap.to(head, {
        w: next === "idle" ? HEAD_W : next === "hover" ? HEAD_W_HOVER : HEAD_W_HOVER * 1.6,
        duration: 0.6,
        ease: "expo.out",
        onUpdate: wake,
      });
      if (label.current) {
        if (text) label.current.firstElementChild!.textContent = text;
        gsap.to(label.current.firstElementChild, { autoAlpha: next === "label" ? 1 : 0, duration: 0.3 });
      }
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element).closest<HTMLElement>("[data-cursor-label], a, button, [data-cursor]");
      if (!t) return set("idle");
      if (t.dataset.cursorLabel) return set("label", t.dataset.cursorLabel);
      set("hover");
    };
    const leaveWindow = () => gsap.to(head, { alpha: 0, duration: 0.3, onUpdate: wake });
    const enterWindow = () => started && gsap.to(head, { alpha: 1, duration: 0.3, onUpdate: wake });

    resize();
    gsap.ticker.add(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leaveWindow);
    document.documentElement.addEventListener("pointerenter", enterWindow);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leaveWindow);
      document.documentElement.removeEventListener("pointerenter", enterWindow);
    };
  });

  return (
    <>
      {/* Bone ink + difference blend: reads as light ink on dark sections and dark ink on the bone section. */}
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] h-full w-full mix-blend-difference" />
      <span ref={label} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[91] mix-blend-difference will-change-transform">
        <span className="label invisible absolute -translate-x-1/2 -translate-y-1/2 text-[0.6rem] whitespace-nowrap text-bone opacity-0" />
      </span>
    </>
  );
}
