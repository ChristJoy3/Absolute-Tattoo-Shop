import { shop } from "@/data/content";
import { PhoneIcon, PinIcon } from "./icons";

/**
 * Phones only: Call + Directions are always one thumb-tap away.
 * Sits above the home indicator via safe-area insets.
 */
export function MobileActionBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-px border-t border-bone/10 bg-bone/10 md:hidden"
      style={{ paddingBottom: "var(--safe-b)" }}
    >
      <a
        href={shop.phone.href}
        className="flex h-16 items-center justify-center gap-2.5 bg-ember font-display text-lg font-extrabold tracking-wide text-bone uppercase active:bg-oxblood"
      >
        <PhoneIcon /> Call to book
      </a>
      <a
        href={shop.directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-16 items-center justify-center gap-2.5 bg-ink font-display text-lg font-extrabold tracking-wide text-bone uppercase active:bg-ink-2"
      >
        <PinIcon /> Directions
      </a>
    </nav>
  );
}
