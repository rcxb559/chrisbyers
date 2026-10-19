# chrisbyers.app

Personal site for Chris Byers — founder, operator, and advisor.

Static HTML/CSS/JS. No framework, no build step, no dependencies.

## Layout

```
site/              <- Netlify publish directory
  index.html
  404.html
  robots.txt
  sitemap.xml
  assets/
    css/site.css
    js/site.js
    fonts/         <- self-hosted, subsetted woff2
    img/
      r/           <- generated AVIF/WebP/JPEG variants (these are the ones served)
      og-*.jpg     <- Open Graph card
    favicon.svg
netlify.toml       <- redirects, headers, cache policy
masters/           <- full-size source photos; NOT deployed
tools/             <- image + favicon generators; NOT deployed
reference/         <- original design export; NOT deployed
```

## Local preview

```bash
npx --yes serve@14.2.4 site -l 4321
```

## Deploying

See [DEPLOY.md](DEPLOY.md). Short version: push to GitHub, connect the repo in
Netlify, point GoDaddy DNS at Netlify — **without touching the MX records**, or
`chris@chrisbyers.app` stops working.

## Review notes

See [DESIGN-REVIEW.md](DESIGN-REVIEW.md) for the audit and prioritised fix list.
