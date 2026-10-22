import { nav, shop } from "@/data/content";
import { Logo } from "@/components/ui/Logo";
import { CurrentYear } from "@/components/ui/YearsInBusiness";

const MARQUEE = "Absolute Tattoos & Body Piercing · Est. 1994 · ";

/** Footer: slow marquee, logo, name/address/phone, socials, dynamic © year. */
export function Footer() {
  const { street, city, region, postalCode } = shop.address;
  return (
    <footer className="relative overflow-hidden bg-ink pt-16 pb-10 md:pt-24">
      {/* Marquee: two identical halves loop seamlessly via translateX(-50%) */}
      <div aria-hidden="true" className="overflow-hidden border-y border-bone/10 py-5 md:py-7">
        <div className="marquee-track flex w-max whitespace-nowrap">
          {[0, 1].map((half) => (
            <span key={half} className="flex">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className={`font-display text-[clamp(2.5rem,8vw,6.5rem)] leading-none font-black uppercase ${n % 2 ? "text-outline text-bone/50" : "text-bone"}`}
                >
                  {MARQUEE}&nbsp;
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-16 grid gap-12 px-[var(--gutter)] md:grid-cols-2 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <a href="#top" className="block w-[min(70vw,18rem)]" aria-label={`${shop.name}, back to top`}>
            <Logo alt="" sizes="min(70vw, 18rem)" />
          </a>
          <p className="mt-6 max-w-xs text-bone/60">An old school Mom &amp; Pop shop. Family-run in Bellevue, Nebraska since July 1994.</p>
        </div>

        <div className="xl:col-span-3">
          <p className="label text-patina">Visit</p>
          <address className="mt-4 text-lg not-italic">
            {shop.name}
            <br />
            {street}
            <br />
            {city}, {region} {postalCode}
          </address>
          <a href={shop.phone.href} className="link-line mt-3 inline-flex min-h-11 items-center text-lg">
            {shop.phone.display}
          </a>
          <p className="text-bone/60">{shop.hours}</p>
        </div>

        <nav aria-label="Footer" className="xl:col-span-3">
          <p className="label text-patina">Explore</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 xl:grid-cols-1">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="link-line inline-flex min-h-11 items-center text-bone/80 hover:text-bone xl:min-h-9">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="xl:col-span-2">
          <p className="label text-patina">Follow</p>
          <ul className="mt-4">
            {shop.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-line inline-flex min-h-11 items-center text-lg">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-2 px-[var(--gutter)] text-sm text-bone/50 md:flex-row md:justify-between">
        <p>
          © <CurrentYear /> {shop.name}. All rights reserved.
        </p>
        <p className="label">Tattoos · Portraits · Body piercing · Bellevue / Omaha, NE</p>
      </div>
    </footer>
  );
}
