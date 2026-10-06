# Absolute Tattoos & Body Piercing: website

Single-page, static redesign of absolutetattooshop.com ("Old School Soul, Future Ink").
Next.js 16 (App Router, static export) · Tailwind CSS v4 · GSAP + ScrollTrigger + SplitText · Lenis.

## Run

```bash
npm install
npm run dev                  # http://localhost:3000
npm run dev -- -H 0.0.0.0    # reachable from your phone on the same Wi-Fi
npm run build                # static site → out/
npm run preview              # serve out/ locally (gzip), like a real host
```

**Phone testing from WSL2:** WSL has its own IP, so the phone can't reach it directly. Either turn on
mirrored networking (`%UserProfile%\.wslconfig` → `[wsl2]` / `networkingMode=mirrored`, then `wsl --shutdown`)
and open `http://<your-PC-LAN-IP>:3000`, or forward the port from an admin PowerShell:
`netsh interface portproxy add v4tov4 listenport=3000 connectport=3000 connectaddress=$(wsl hostname -I)`
and allow port 3000 in Windows Firewall.

## Deploy

Upload the contents of `out/` to any static host (Netlify, Vercel, Cloudflare Pages, S3, shared hosting).
Update `shop.siteUrl` in `src/data/content.ts` if the domain changes (canonical URL, OG, sitemap, JSON-LD).

## Content

All copy and shop facts live in `src/data/content.ts`: phone, address, story, services, process, gallery
order, alt text and frame sizes. Years in business are always computed from 1994.

## Images

Gallery photos are the client's own, pulled from the old site's originals (`Image=o`, never the upscaled `Image=l`).

```bash
npm run images:fetch      # re-download originals → public/images/{tattoos,piercings}
npm run images:optimize   # AVIF + WebP at 480/720/960/1600 (never upscaled) + logo downscales
npm run images:og         # Open Graph image + app icons
```

`public/logo.png` is the untouched original. `logo-*.webp` are proportional downscales of it, used for speed.

## Structure

```
src/app/                  layout (fonts, metadata, pre-paint script), page (sections + JSON-LD), robots, sitemap
src/components/sections/  Hero, Story, Services, CleanCertified, TattooGallery, PiercingGallery, Process, Contact, Footer
src/components/ui/        Navbar, MenuOverlay, MobileActionBar, Preloader, Cursor, MagneticButton, RevealText,
                          RevealImage, InkMask, DrawLine, Lightbox, GalleryFrame, Picture, Logo
src/components/providers/ SmoothScroll (Lenis ↔ GSAP ticker ↔ ScrollTrigger)
src/hooks/                media queries, reduced motion, scroll lock, focus trap, current year, gallery reveal
src/lib/                  gsap registration, motion tokens, images, intro handshake, scroll helper
scripts/                  image fetch / optimize / OG generation
```
