/**
 * Tiny handshake between the Preloader and the Hero.
 * The hero's entrance waits for the preloader's ink reveal (or starts at once when it is skipped).
 */
let done = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

/** Runs `fn` once the intro has finished. Returns an unsubscribe function. */
export function onIntroDone(fn: () => void): () => void {
  if (done) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** True when the inline head script decided not to show the preloader (repeat visit / reduced motion). */
export function introSkipped(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.intro === "skip";
}

export const INTRO_SESSION_KEY = "atbp-intro-seen";
