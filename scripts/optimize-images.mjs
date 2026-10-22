// Generates responsive AVIF + WebP renditions for every gallery JPEG.
// Widths are clamped to the original width: we never upscale.
// Output: public/images/<dir>/<name>-<w>.{avif,webp}  +  src/data/images.generated.json
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIRS = ["tattoos", "piercings"];
const TARGET_WIDTHS = [480, 720, 960, 1600];

/** Widths to emit: every target below the original, plus the native width (capped at the largest target). */
function widthsFor(origW) {
  const max = TARGET_WIDTHS.at(-1);
  return [...new Set([...TARGET_WIDTHS.filter((w) => w < origW), Math.min(origW, max)])].sort((a, b) => a - b);
}

const out = {};
for (const dir of DIRS) {
  const abs = path.join(ROOT, "public/images", dir);
  const files = (await readdir(abs)).filter((f) => /^[a-z]+-\d+\.jpg$/.test(f)).sort();
  for (const file of files) {
    const name = file.replace(/\.jpg$/, "");
    const src = sharp(path.join(abs, file)).rotate(); // honor EXIF orientation
    const { width, height } = await src.clone().metadata().then(async (m) => {
      // metadata() reports pre-rotation dims; swap for 90° orientations.
      const swap = m.orientation && m.orientation >= 5;
      return { width: swap ? m.height : m.width, height: swap ? m.width : m.height };
    });
    const widths = widthsFor(width);
    for (const w of widths) {
      const resized = src.clone().resize({ width: w, withoutEnlargement: true });
      await resized.clone().avif({ quality: 50, effort: 5 }).toFile(path.join(abs, `${name}-${w}.avif`));
      await resized.clone().webp({ quality: 78 }).toFile(path.join(abs, `${name}-${w}.webp`));
    }
    out[name] = { src: `/images/${dir}/${file}`, dir, width, height, widths };
    console.log(`${name.padEnd(12)} ${String(width).padStart(4)}×${String(height).padEnd(4)}  → ${widths.join(", ")}`);
  }
}

await writeFile(path.join(ROOT, "src/data/images.generated.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`\n${Object.keys(out).length} images optimized`);

// --- Logo: proportional downscales of public/logo.png (same pixels, just fewer of them).
// The original file stays untouched and remains the <img> fallback.
const LOGO = path.join(ROOT, "public/logo.png");
for (const w of [480, 960, 1600]) {
  await sharp(LOGO).resize({ width: w }).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(path.join(ROOT, `public/logo-${w}.webp`));
}
console.log("logo-480/960/1600.webp written");
