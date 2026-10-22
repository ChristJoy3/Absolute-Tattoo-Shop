// Builds the Open Graph image and app icons. The logo is only resized proportionally and
// placed on a plate, never recolored or redrawn. For icons only the PNG's empty transparent
// padding is trimmed; the artwork itself (box x118 y757 1763×483 @2000px) always stays whole.
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const LOGO = path.join(ROOT, "public/logo.png");
const BONE = "#f2ece3";

// --- OG 1200×630: bone plate with logo (left) + hero tattoo (right)
const W = 1200, H = 630, SPLIT = 640;
const LOGO_W = 600; // whole 2000px canvas → 600px (artwork ≈ 529px wide), fits the 640px plate untouched
const logo = await sharp(LOGO).resize({ width: LOGO_W }).toBuffer();
const hero = await sharp(path.join(ROOT, "public/images/tattoos/tattoo-37.jpg"))
  .rotate()
  .resize(W - SPLIT, H, { fit: "cover", position: "attention" })
  .toBuffer();
await sharp({ create: { width: W, height: H, channels: 3, background: BONE } })
  .composite([
    { input: logo, left: (SPLIT - LOGO_W) / 2, top: (H - LOGO_W) / 2 },
    { input: hero, left: SPLIT, top: 0 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

// --- Icons: whole logo canvas scaled onto a bone square (the wide logo stays intact)
for (const [file, size] of [["src/app/icon.png", 512], ["src/app/apple-icon.png", 180]]) {
  const inner = Math.round(size * 1.1); // artwork ≈ 97% of the icon width; only empty padding is trimmed
  const l = await sharp(LOGO).resize({ width: inner }).toBuffer();
  const off = Math.round((size - inner) / 2);
  await sharp({ create: { width: size, height: size, channels: 4, background: BONE } })
    .composite([{ input: await sharp(l).extract({ left: -off, top: -off, width: size, height: size }).toBuffer(), left: 0, top: 0 }])
    .png({ palette: true, quality: 90, effort: 10 })
    .toFile(path.join(ROOT, file));
}
console.log("og.jpg, icon.png, apple-icon.png written");
