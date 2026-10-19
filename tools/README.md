# tools

One-off generators. **Not part of the site** and not deployed — `site/` is the
only thing Netlify publishes. You only need these if you replace the source
photographs or change the brand mark.

They depend on packages that are deliberately *not* committed, so install them
into this folder when you need them:

```bash
cd tools && npm install sharp@0.33.5 wawoff2@2.0.1 opentype.js@1.3.4
```

## generate-images.mjs

Rebuilds `site/assets/img/r/` — the AVIF / WebP / JPEG variants referenced by
the `<picture>` elements — from the master JPEGs in `site/assets/img/`.

```bash
node tools/generate-images.mjs
```

AVIF settings are tuned (`quality: 50, effort: 9, chromaSubsampling: '4:2:0'`);
at sharp's defaults AVIF came out *larger* than WebP for these photos.

If you change the rendered size of either portrait in the CSS, update the
`sizes` attributes in `site/index.html` to match, or the browser will pick the
wrong variant.

## generate-favicon.mjs

Rebuilds `site/assets/favicon.svg`, converting the letters "CB" to an SVG path
using the project's own Archivo subset so the mark matches the header wordmark.

```bash
node tools/generate-favicon.mjs
```
