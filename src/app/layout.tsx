import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Big_Shoulders_Stencil, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { seo, shop } from "@/data/content";
import { INTRO_SESSION_KEY } from "@/lib/intro";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Preloader } from "@/components/ui/Preloader";
import { Navbar } from "@/components/ui/Navbar";
import { MobileActionBar } from "@/components/ui/MobileActionBar";
import { Cursor } from "@/components/ui/Cursor";

/* Fonts: self-hosted at build time by next/font (no requests to Google at runtime). */
// Big Shoulders has no metric overrides in next/font, so we supply our own condensed fallback.
const display = Big_Shoulders({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-big-shoulders",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "sans-serif"],
});
const stencil = Big_Shoulders_Stencil({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-big-shoulders-stencil",
  display: "swap",
  preload: false, // used only for small markers below the fold
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "sans-serif"],
});
const sans = Hanken_Grotesk({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-hanken", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: "400", variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(shop.siteUrl),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  applicationName: shop.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: shop.name,
    title: seo.title,
    description: seo.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${shop.name}, Bellevue, NE. Est. 1994` }],
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: ["/og.jpg"] },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: "#0e0b0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // enables env(safe-area-inset-*)
};

/**
 * Runs before first paint: records motion preference and whether the preloader should be skipped
 * (repeat visit this session, or reduced motion). Prevents any flash of the intro or the hero.
 */
const PRE_PAINT = `try{var d=document.documentElement,r=matchMedia('(prefers-reduced-motion: reduce)').matches;d.dataset.motion=r?'reduce':'ok';if(r||sessionStorage.getItem('${INTRO_SESSION_KEY}'))d.dataset.intro='skip'}catch(e){document.documentElement.dataset.intro='skip'}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning // data-motion / data-intro are set by PRE_PAINT before React hydrates
      className={`${display.variable} ${stencil.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
        <noscript>
          <style>{`.preloader{display:none!important}[data-hero-hide]{visibility:visible!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-bone focus:px-5 focus:py-3 focus:text-ink"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Preloader />
          <Navbar />
          {children}
          <MobileActionBar />
          <Cursor />
        </SmoothScroll>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
