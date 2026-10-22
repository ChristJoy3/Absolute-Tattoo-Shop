/** The shop opened in July 1994. Years are always computed, never hard-coded. */
export const FOUNDED_YEAR = 1994;

/** Year at build time: used for the static HTML, then replaced on the client (see useCurrentYear). */
export const BUILD_YEAR = new Date().getFullYear();

export function yearsSince(founded: number, now: number): number {
  return now - founded;
}
