// Downloads the client's gallery photos from the legacy WebFrame CMS.
// The old popup viewer (ViewPicture) shows displaypicture.asp?Image=l, which is
// frequently UPSCALED; Image=o returns the original upload, so we always take that.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "http://absolutetattooshop.com";
const ROOT = path.resolve(import.meta.dirname, "..");

/** Gallery pages in display order, mapped to output folder + file prefix. */
const GALLERIES = [
  { page: "/Tattoos/", dir: "tattoos", prefix: "tattoo" },
  { page: "/More_Tattoos/", dir: "tattoos", prefix: "tattoo" },
  { page: "/Piercings/", dir: "piercings", prefix: "piercing" },
];

const counters = {};
const manifest = [];
const failures = [];

for (const g of GALLERIES) {
  const html = await (await fetch(ORIGIN + g.page)).text();
  const ids = [...html.matchAll(/ViewPicture\('(\d+)'/g)].map((m) => m[1]);
  const outDir = path.join(ROOT, "public/images", g.dir);
  await mkdir(outDir, { recursive: true });

  for (const id of ids) {
    counters[g.prefix] = (counters[g.prefix] ?? 0) + 1;
    const name = `${g.prefix}-${String(counters[g.prefix]).padStart(2, "0")}`;
    const url = `${ORIGIN}/webframe/gallery/displaypicture.asp?PictureID=${id}&Image=o`;
    try {
      const res = await fetch(url);
      const buf = Buffer.from(await res.arrayBuffer());
      // Guard: must be a real JPEG, not an error page.
      if (!res.ok || buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error(`HTTP ${res.status} / not a JPEG`);
      await writeFile(path.join(outDir, `${name}.jpg`), buf);
      manifest.push({ name, dir: g.dir, origId: Number(id), source: g.page });
      console.log(`ok   ${name}  (id ${id})`);
    } catch (err) {
      failures.push({ name, id, error: String(err) });
      console.log(`FAIL ${name}  (id ${id}) ${err}`);
    }
  }
}

await writeFile(path.join(ROOT, "scripts/images.fetched.json"), JSON.stringify({ manifest, failures }, null, 2));
console.log(`\n${manifest.length} downloaded, ${failures.length} failed`);
