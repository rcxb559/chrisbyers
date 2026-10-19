import { readFile, writeFile } from 'node:fs/promises';
import * as wawoff from 'wawoff2';
import opentype from 'opentype.js';

const woff2 = await readFile(new URL('../site/assets/fonts/archivo-latin.woff2', import.meta.url));
const ttf = await wawoff.decompress(woff2);
const font = opentype.parse(new Uint8Array(ttf).buffer);

const SIZE = 64, fs = 30;
const probe = font.getPath('CB', 0, 0, fs);
const bb = probe.getBoundingBox();
const dx = (SIZE - (bb.x2 - bb.x1)) / 2 - bb.x1;
const dy = (SIZE - (bb.y2 - bb.y1)) / 2 - bb.y1;
const d = font.getPath('CB', dx, dy, fs).toPathData(2);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Chris Byers">
  <title>Chris Byers</title>
  <rect width="64" height="64" rx="14" fill="#2C6BC4"/>
  <path d="${d}" fill="#FFFFFF"/>
</svg>
`;
await writeFile(new URL('../site/assets/favicon.svg', import.meta.url), svg);
console.log(svg.length, 'bytes written');
