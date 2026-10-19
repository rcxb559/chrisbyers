import sharp from 'sharp';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
// Masters live outside site/ so they are never deployed; only the generated
// variants in site/assets/img/r/ are published.
const SRC = path.join(ROOT, 'masters');
const OUT = path.join(ROOT, 'site/assets/img/r');
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const jobs = [
  { src: 'chris-byers.jpg',        base: 'hero',   widths: [400, 688, 900] },
  { src: 'chris-byers-square.jpg', base: 'square', widths: [400, 784, 1000] },
];

let totalAvif = 0, totalOrig = 0;
for (const job of jobs) {
  const input = path.join(SRC, job.src);
  const meta = await sharp(input).metadata();
  totalOrig += meta.size || 0;
  for (const w of job.widths) {
    if (w > meta.width) continue;
    const pipe = () => sharp(input).resize({ width: w, withoutEnlargement: true });
    const a = await pipe().avif({ quality: 50, effort: 9, chromaSubsampling: '4:2:0' }).toFile(path.join(OUT, `${job.base}-${w}.avif`));
    const b = await pipe().webp({ quality: 74, effort: 6 }).toFile(path.join(OUT, `${job.base}-${w}.webp`));
    const c = await pipe().jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(path.join(OUT, `${job.base}-${w}.jpg`));
    console.log(`${job.base.padEnd(7)} ${String(w).padStart(4)}px  avif ${String(Math.round(a.size/1024)).padStart(3)}KB  webp ${String(Math.round(b.size/1024)).padStart(3)}KB  jpg ${String(Math.round(c.size/1024)).padStart(3)}KB`);
  }
}
