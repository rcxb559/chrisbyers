# chrisbyers.app — design & code review

> **Status (19 Oct 2026):** the five quick wins — **A1, A2, A4, B5, B6** — are
> implemented and verified in the browser. **A3 (dark mode)** and everything in
> **B1–B4** are still open. Items below are annotated with ✅ where applied.

**Verdict first:** this is a genuinely good site. The typographic system
(Archivo display + IBM Plex Sans + Plex Mono for metadata) is confident, the
navy/blue/sand palette is cohesive, the hero is strong, and the HTML is more
accessible than most hand-built portfolios — skip link, `aria-pressed` filters,
live regions, `prefers-reduced-motion` handling, real `<details>` semantics.

So the notes below are mostly refinements, not rescues. They're grouped by
whether they're **bugs**, **high-value**, or **editorial judgement**.

---

## A. Things that are actually wrong

### ✅ A1. The three biggest career entries aren't headings *(fixed)*
The timeline roles — IntelliStack, Blue Door Ministries, Foundation Surgery
Affiliates — are built from `<summary>` + `<span>`. But the *minor* roles below
them (UBS, Bottled Software, Anderson University) are `<h3>`.

So the document outline currently reads: `h2 "A record of building"` → `h3 "Independent
Financial Advisor"` — and your 13-year CEO role is invisible to it.

This hurts screen-reader navigation (heading jump-list skips your headline
roles) and SEO (search engines weight headings). **Fix:** wrap the company name
in an `<h3>` inside the `<summary>`. That's valid and keeps the disclosure
behaviour intact.

**Effort:** 10 minutes. **Impact:** high.

### ✅ A2. Hero image is ~2.5× larger than it ever renders *(fixed)*
`chris-byers.jpg` is 900×1125 and 279 KB, but it displays at 344 CSS px (so 688 px
on a 2× screen). It's also `fetchpriority="high"` and preloaded, so it's
competing for bandwidth during the Largest Contentful Paint.

**Fix:** serve AVIF/WebP with a JPEG fallback via `<picture>`, at 2–3 widths with
a `sizes` attribute. Realistically 279 KB → ~45 KB with no visible difference.
Same applies to `chris-byers-square.jpg` (231 KB).

**Effort:** 30 minutes. **Impact:** high — this is most of your page weight.

### ⬜ A3. No dark mode *(not started)*
`<meta name="color-scheme" content="light">` explicitly opts out, and there's
not a single `prefers-color-scheme` rule in 2,026 lines of CSS.

For an audience of founders and engineers — who skew heavily toward dark OS
themes — a site that flashes bright white is a small but real friction. The
palette is already more than halfway there: the hero, contact band, and Vibecore
card are all dark navy. A dark theme is mostly a matter of remapping ~12 custom
properties, because the CSS is properly tokenised.

**Effort:** 2–3 hours. **Impact:** medium-high, and it signals craft.

### ✅ A4. Hero animation is load-timed, not viewport-timed *(fixed)*
`.hero h1`, `.hero-lede`, `.stats` etc. animate via CSS `animation: rise … both`
on page load. On a slow connection the CSS arrives late and the sequence plays
against already-painted content, which reads as a stutter. (It also made the
hero appear blank in automated screenshots — harmless, but a symptom.)

**Fix:** either drop the stagger on the hero and let it paint instantly, or
gate it behind the same `IntersectionObserver` the rest of the page uses.

**Effort:** 20 minutes. **Impact:** low-medium.

---

## B. High-value enhancements

### B1. Give the stat row more weight
`25+ yrs / 13 yrs / $500M+ / 32,000+` is the most persuasive content on the page
and it currently sits in a quiet bordered row below the fold. Consider: larger
numerals, a subtle count-up on first view (respecting `prefers-reduced-motion`),
or moving one stat into the hero itself.

### B2. The Besti Co. card is visibly thinner than its siblings
Cards 01 and 02 have description, dates, location, and an outbound link. Card 03
has one sentence and a date, so it reads as an afterthought in a 3-up grid where
all cards are forced to equal height. Either add a line about the advisory work,
or move Besti Co. down next to "Recently concluded" as an advisory list and let
the grid be a confident 2-up.

### B3. Press section is a long undifferentiated list
Thirteen rows at equal visual weight. The Journal Record op-ed from Aug 2026 is
your most recent and most locally relevant piece, and it looks identical to a
2017 interview. Consider featuring the top 1–2 items as cards above the list,
and collapsing everything older than ~2020 behind a "Show earlier coverage"
toggle.

### B4. No visual proof of the work
The site talks about IntelliStack, Alpinist Studios, and Vibecore but never shows
them. Even small logo marks or a single screenshot per venture would make the
"Now" section concrete rather than descriptive.

### ✅ B5. Inline link tap targets are under 44 px *(fixed)*
Four links (the email and LinkedIn links in the About sidebar and contact list)
are 19–21 px tall. They're inline text links so this is a soft miss rather than a
WCAG failure, but adding vertical padding on touch viewports is cheap.

### ✅ B6. Favicon uses a system font *(fixed)*
`favicon.svg` renders "CB" in Helvetica/Arial, so it won't match the Archivo
wordmark in the header. Converting the two letters to a `<path>` makes it render
identically everywhere and removes the font dependency.

---

## C. Editorial / judgement calls

These are opinions, not defects — take or leave them.

- **"Press & media" outlet strip** lists seven outlets as plain text. Real logos
  would carry far more authority, but need permission and careful greyscale
  treatment to not look cluttered.
- **The pull quote** ("Oklahoma doesn't need to become the next Silicon Valley,
  and we certainly don't want the traffic!") is the most human line on the page
  and it's buried at the bottom of About. It might earn a more prominent slot.
- **"A full CV is available on request"** adds a step. A downloadable PDF would
  remove friction for the journalists and investors you're targeting.
- **No `/now` or writing section.** The nav says "Now", but it points to a
  ventures grid rather than a genuine now-page. If you ever want to publish
  short notes, the structure is already implied.
- **Single-page architecture** is right for this content volume. Don't split it
  up unless you add writing.

---

## D. What's already good (don't regress these)

- Skip link, visible focus states (8 `:focus-visible` rules), semantic landmarks
- `aria-pressed` + `aria-live` on the press filters, with counts computed from
  the DOM rather than hardcoded
- `prefers-reduced-motion` handled in both CSS and JS
- Clipboard copy with a genuine `execCommand` fallback and failure messaging
- Person schema (JSON-LD), complete OG/Twitter tags, correct 1200×630 OG image
- Self-hosted subsetted woff2 fonts with `font-display: swap` — no third-party
  font requests, no layout shift
- Zero dependencies, zero build step, 800 KB total
- No horizontal overflow at 375 px; mobile nav works correctly

---

## Suggested order

1. **A1** heading structure — 10 min, biggest accessibility/SEO win per minute
2. **A2** responsive images — 30 min, most of your page weight
3. **A4** hero animation — 20 min
4. **B6** favicon path — 15 min
5. **B5** tap targets — 15 min
6. **A3** dark mode — 2–3 hrs, the big one
7. **B1–B4** — content-dependent, needs your input

Items 1–5 are about 90 minutes total and are all low-risk. Item 6 is the one
that most changes how the site feels. Items in B2–B4 need decisions from you
about content I don't have.


---

## Appendix — what was actually changed (19 Oct 2026)

### A1 — heading structure
The three `<span class="role-company">` elements in the timeline became `<h3>`.
Verified pixel-identical: the element box, the `(formerly Formstack)` alias
position, font size and margins are byte-for-byte the same before and after,
because `.role-company` already set `display: block` and the stylesheet resets
heading margins to 0. The document outline now reads h1 → h2 → h3 with
IntelliStack, Blue Door Ministries and Foundation Surgery Affiliates included.

### A2 — responsive images
Generated AVIF / WebP / JPEG at three widths each for both portraits
(`site/assets/img/r/`), wired up with `<picture>` + `srcset` + `sizes`, and
repointed the `<link rel="preload">` at the AVIF srcset.

AVIF needed tuning to be worth including — at default settings WebP was
*smaller*. With `quality: 50, effort: 9, chromaSubsampling: '4:2:0'` AVIF wins
clearly (34 KB vs 46 KB at 688 px).

The `sizes` values are measured, not guessed: the hero portrait is 34.2% of the
1320 px container and the About portrait is 39%, which works out to ~31vw and
~35vw between 980–1432 px, and fixed 451 px / 515 px above that.

| | before | after (2× desktop) | after (2× mobile) |
|---|---|---|---|
| Hero portrait | 279 KB | 65 KB | 34 KB |
| About portrait | 231 KB | 48 KB | 26 KB |
| **Total** | **510 KB** | **113 KB** | **60 KB** |

The originals are kept in `site/assets/img/` as the source masters. They are no
longer referenced by the page, so they aren't downloaded — but keep them, since
regenerating the variants needs them.

### A4 — hero animation
The `h1` and the portrait are the LCP candidates, so animating them from
`opacity: 0` was delaying Largest Contentful Paint by the animation duration
plus its delay. Both now paint immediately; the stagger moved to the supporting
copy and stats, with slightly tightened timings.

### B5 — tap targets
Added a `@media (pointer: coarse)` block padding the inline links in the About
sidebar, contact list and press card. Measured 19–21 px → **44–48 px** on a
375 px touch viewport, with negative margins so desktop layout is untouched.

### B6 — favicon
The "CB" monogram is now a real `<path>`, extracted from the project's own
`archivo-latin.woff2` (via `wawoff2` + `opentype.js`), so it matches the header
wordmark instead of falling back to Helvetica. Note the subset's default
instance is Archivo SemiBold (600) rather than the header's 700 — indistinguishable
at favicon sizes.

### Verified
No console errors. Press filters still work (6 podcasts / 13 all) with the
`aria-live` status updating. `<details>` disclosures still work. No horizontal
overflow at 375 px. Initial desktop payload is 7 requests / 131 KB.

### Regenerating the images and favicon
The generators are committed under `tools/` (outside the published `site/`
directory, so they are never deployed). Their dependencies are not committed,
so install them first:

```bash
cd tools && npm install sharp@0.33.5 wawoff2@2.0.1 opentype.js@1.3.4
```

Then `node tools/generate-images.mjs` and `node tools/generate-favicon.mjs`.
Both are deterministic — re-running them reproduces the committed files exactly.
See `tools/README.md`.
