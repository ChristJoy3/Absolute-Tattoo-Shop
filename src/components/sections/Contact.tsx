"use client";

import { useRef, useState, type FormEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, MQ } from "@/lib/motion";
import { shop } from "@/data/content";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/ui/icons";

const STATEMENT = ["Come see us", "on Mission", "Ave."];

/**
 * VISIT US: giant closing statement, the big magnetic call button, address + directions,
 * email, socials, and a visual-only form that hands off to the visitor's email app (mailto).
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-statement]", start: "top 80%", once: true } })
          .from("[data-statement-line]", { yPercent: 110, duration: 1.4, stagger: 0.1, ease: EASE.ink })
          .fromTo(
            "[data-statement-fill]",
            { clipPath: "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, stagger: 0.12, ease: "power3.inOut" },
            0.6,
          );
        gsap.from("[data-visit-in]", {
          opacity: 0,
          y: 30,
          duration: 1.1,
          stagger: 0.07,
          ease: EASE.ink,
          scrollTrigger: { trigger: "[data-visit-grid]", start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  const { street, city, region, postalCode } = shop.address;

  return (
    <section ref={root} id="visit" aria-labelledby="visit-title" className="relative bg-oxblood px-[var(--gutter)] py-[clamp(5rem,12vw,10rem)]">
      <SectionMarker index="07" title="Visit us" />

      <h2 id="visit-title" data-statement className="t-mega mt-8">
        <span className="sr-only">Come see us on Mission Ave.</span>
        <span aria-hidden="true">
          {STATEMENT.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.04em]">
              <span data-statement-line className="relative block">
                <span className="text-outline block">{line}</span>
                <span data-statement-fill className="absolute inset-0 block">
                  {line}
                </span>
              </span>
            </span>
          ))}
        </span>
      </h2>

      <div data-visit-grid className="mt-14 grid gap-14 md:mt-20 xl:grid-cols-12 xl:gap-10">
        {/* Info */}
        <div className="flex flex-col gap-10 xl:col-span-6">
          <div data-visit-in>
            <MagneticButton
              href={shop.phone.href}
              strength={0.25}
              className="h-20 items-center rounded-full bg-bone px-8 font-display text-[clamp(1.5rem,5vw,2.5rem)] font-black tracking-wide text-ink transition-colors hover:bg-ember hover:text-bone md:h-24 md:px-12"
              aria-label={`Call ${shop.phone.display}`}
            >
              <PhoneIcon className="size-7" /> {shop.phone.display}
            </MagneticButton>
            <p className="label mt-4 text-bone/70">{shop.hours} · tap to call</p>
          </div>

          <dl className="grid gap-8 sm:grid-cols-2">
            <div data-visit-in>
              <dt className="label text-patina">Address</dt>
              <dd className="mt-3 text-lg">
                <address className="not-italic">
                  {street}
                  <br />
                  {city}, {region} {postalCode}
                </address>
                <a
                  href={shop.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label link-line mt-3 inline-flex min-h-11 items-center gap-2 text-bone"
                >
                  <PinIcon className="size-4" /> Get directions
                </a>
              </dd>
            </div>
            <div data-visit-in>
              <dt className="label text-patina">Hours</dt>
              <dd className="mt-3 text-lg">
                {shop.hours}
                <a href={shop.phone.href} className="block text-bone/70 link-line w-fit">
                  {shop.phone.display}
                </a>
              </dd>
            </div>
            <div data-visit-in>
              <dt className="label text-patina">Email</dt>
              <dd className="mt-3 text-lg break-all">
                <a href={`mailto:${shop.email}`} className="link-line inline-flex min-h-11 items-center gap-2">
                  <MailIcon className="size-4 shrink-0" /> {shop.email}
                </a>
              </dd>
            </div>
            <div data-visit-in>
              <dt className="label text-patina">Follow</dt>
              <dd className="mt-3 flex gap-6 text-lg">
                {shop.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="link-line inline-flex min-h-11 items-center">
                    {s.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
          <p data-visit-in className="max-w-md text-bone/70">
            Serving Bellevue, Omaha, the rest of the metro and Iowa since 1994.
          </p>
        </div>

        {/* Form */}
        <div data-visit-in className="xl:col-span-5 xl:col-start-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

/** Visual-only form: no backend. Submitting opens the visitor's email app with everything filled in. */
function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const subject = `Tattoo / piercing inquiry from ${get("name")}`;
    const body = [`Name: ${get("name")}`, `Phone: ${get("phone")}`, `Email: ${get("email")}`, "", get("message")].join("\n");
    window.location.href = `mailto:${shop.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field =
    "peer w-full border-0 border-b border-bone/30 bg-transparent px-0 pt-6 pb-3 text-base text-bone placeholder-transparent outline-none transition-colors focus:border-bone";
  const label =
    "label pointer-events-none absolute top-6 left-0 text-bone/60 transition-all duration-300 peer-focus:top-0 peer-focus:text-[0.65rem] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[0.65rem]";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-7" aria-describedby="form-note">
      <p className="t-lg">Send us a note</p>
      <div className="relative">
        <input id="f-name" name="name" required autoComplete="name" placeholder="Name" className={field} />
        <label htmlFor="f-name" className={label}>
          Name *
        </label>
      </div>
      <div className="grid gap-7 sm:grid-cols-2">
        <div className="relative">
          <input id="f-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="Phone" className={field} />
          <label htmlFor="f-phone" className={label}>
            Phone *
          </label>
        </div>
        <div className="relative">
          <input id="f-email" name="email" type="email" autoComplete="email" placeholder="Email" className={field} />
          <label htmlFor="f-email" className={label}>
            Email
          </label>
        </div>
      </div>
      <div className="relative">
        <textarea id="f-message" name="message" required rows={4} placeholder="Message" className={`${field} resize-none`} />
        <label htmlFor="f-message" className={label}>
          Your idea, placement, size *
        </label>
      </div>
      <button
        type="submit"
        className="group flex h-14 items-center justify-between rounded-full border border-bone/40 px-7 font-display text-xl font-extrabold tracking-wide uppercase transition-colors hover:border-bone hover:bg-bone hover:text-ink"
      >
        Send message
        <ArrowIcon className="size-5 transition-transform duration-500 group-hover:translate-x-1" />
      </button>
      <p id="form-note" className="text-sm text-bone/60" aria-live="polite">
        {sent
          ? "Your email app should open with your message ready to send. If it didn't, email us directly or just call."
          : "This opens your email app. Fastest answer? Call the shop."}
      </p>
    </form>
  );
}
