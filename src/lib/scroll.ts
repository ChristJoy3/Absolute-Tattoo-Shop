import type Lenis from "lenis";

/**
 * Smoothly scroll to an in-page anchor. Uses Lenis when it's running (desktop),
 * otherwise falls back to native scrolling (touch devices / reduced motion).
 */
export function scrollToHash(hash: string, lenis?: Lenis) {
  const el = hash === "#top" ? document.body : document.querySelector<HTMLElement>(hash);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis && !reduce) {
    lenis.scrollTo(hash === "#top" ? 0 : el, { duration: 1.6, offset: 0 });
  } else {
    if (hash === "#top") window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
  // Move focus for keyboard / screen-reader users without a second jump.
  if (hash !== "#top") {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
  history.replaceState(null, "", hash === "#top" ? location.pathname : hash);
}
