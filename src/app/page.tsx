import { Suspense } from "react";
import { shop, seo } from "@/data/content";
import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Services } from "@/components/sections/Services";
import { CleanCertified } from "@/components/sections/CleanCertified";
import { TattooGallery } from "@/components/sections/TattooGallery";
import { PiercingGallery } from "@/components/sections/PiercingGallery";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

/** LocalBusiness (TattooParlor) structured data with the real address, phone and coordinates. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  "@id": `${shop.siteUrl}/#business`,
  name: shop.name,
  description: seo.description,
  url: shop.siteUrl,
  telephone: shop.phone.e164,
  email: shop.email,
  image: `${shop.siteUrl}/og.jpg`,
  logo: `${shop.siteUrl}/logo.png`,
  foundingDate: shop.founded.iso,
  founder: { "@type": "Person", name: shop.owners },
  address: {
    "@type": "PostalAddress",
    streetAddress: shop.address.street,
    addressLocality: shop.address.city,
    addressRegion: shop.address.region,
    postalCode: shop.address.postalCode,
    addressCountry: shop.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: shop.geo.lat, longitude: shop.geo.lng },
  hasMap: shop.directionsUrl,
  areaServed: [
    { "@type": "City", name: "Bellevue, NE" },
    { "@type": "City", name: "Omaha, NE" },
    { "@type": "State", name: "Nebraska" },
    { "@type": "State", name: "Iowa" },
  ],
  knowsAbout: ["Custom tattoos", "Portrait tattoos", "Body piercing"],
  sameAs: shop.socials.map((s) => s.href),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <main id="main">
        <Hero />
        {/* Suspense boundaries let React hydrate below-the-fold sections in separate, smaller tasks. */}
        <Suspense>
          <Story />
        </Suspense>
        <Suspense>
          <Services />
        </Suspense>
        <Suspense>
          <CleanCertified />
        </Suspense>
        <Suspense>
          <TattooGallery />
        </Suspense>
        <Suspense>
          <PiercingGallery />
        </Suspense>
        <Suspense>
          <Process />
        </Suspense>
        <Suspense>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
