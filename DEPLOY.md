# Deploying chrisbyers.app to Netlify

Everything in this repo is ready to deploy. There is **no build step** — Netlify
publishes the `site/` directory as-is.

---

## What's already configured

| File | Purpose |
|---|---|
| `netlify.toml` | Publish dir, www→apex redirect, security headers, cache policy |
| `site/404.html` | Branded 404 (Netlify picks this up automatically) |
| `site/robots.txt` | Allows crawling, points at the sitemap |
| `site/sitemap.xml` | Single-page sitemap |

---

## Step 1 — Push to GitHub ✅ done

The repo lives at **github.com/rcxb559/chrisbyers** and `main` is pushed and
tracking `origin/main`. Nothing further is needed here.

To push later changes:

```bash
cd /Users/chrisbyers/Desktop/Projects/ChrisByers && git add -A && git commit -m "Describe the change" && git push
```

---

## Step 2a — Connect the repo in Netlify (recommended)

1. Log in at **app.netlify.com** → **Add new site** → **Import an existing project**.
2. Choose **GitHub**, authorise Netlify, and pick the repo you just pushed.
3. Netlify reads `netlify.toml`, so the build settings should auto-fill as:
   - **Build command:** *(empty)*
   - **Publish directory:** `site`
   - **Branch:** `main`
4. Click **Deploy**. First deploy takes about 30 seconds.

Every `git push` to `main` redeploys automatically. Pull requests get their own
preview URL.

## Step 2b — Or drag-and-drop (fastest, no Git)

Go to **app.netlify.com/drop** and drag the **`site`** folder onto the page.

Caveat: dropping the `site` folder alone means `netlify.toml` (which sits one
level up) is *not* applied, so you lose the redirect and headers. To keep them
with drag-and-drop, instead drag the **whole project folder**, then set the
publish directory to `site` in **Site configuration → Build & deploy**.

---

## Step 3 — Point chrisbyers.app at Netlify

Your domain is registered at **GoDaddy** (nameservers `ns65/ns66.domaincontrol.com`).

### ⚠️ Read this first — don't break your email

`chrisbyers.app` already has **Google Workspace email** configured (MX records
pointing at `aspmx.l.google.com` plus an SPF TXT record). When you edit DNS:

- **Only change the `A` record for `@` and the `CNAME` for `www`.**
- **Do not delete or modify the MX records or the `v=spf1` TXT record.**

If you delete those, `chris@chrisbyers.app` stops receiving mail.

### Add the domain in Netlify

1. In your new site: **Domain management** → **Add a domain you already own**.
2. Enter `chrisbyers.app`.
3. Netlify will ask whether to use **Netlify DNS** or **external DNS**. Pick the
   option that matches what you want:

### Option A — Keep DNS at GoDaddy (safest for your email)

This leaves your Google Workspace records completely untouched.

In Netlify, choose the external-DNS path. Then in **GoDaddy → My Products →
chrisbyers.app → DNS**:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `75.2.60.5` | 600 |
| CNAME | `www` | `YOUR-SITE-NAME.netlify.app` | 600 |

- Delete the two existing parked `A` records on `@` (`15.197.148.33` and
  `3.33.130.190`) — those are GoDaddy's parking page.
- Replace `YOUR-SITE-NAME` with the subdomain Netlify assigned you (shown at the
  top of your site dashboard, e.g. `chris-byers-portfolio.netlify.app`).
- Leave every MX and TXT record exactly as it is.

> Netlify's documented apex IP is `75.2.60.5`. Confirm it on the Netlify domain
> screen when you add the domain — it shows you the exact value to use, and that
> screen is authoritative if it ever differs from this doc.

### Option B — Move DNS to Netlify

Netlify gives you four nameservers to paste into GoDaddy. This gives you faster
DNS and automatic apex handling, **but you must re-create your Google Workspace
MX and SPF records in Netlify DNS first**, or email breaks the moment the
nameservers switch. Only pick this if you're comfortable doing that.

---

## Step 4 — HTTPS

Once DNS resolves (anywhere from a few minutes to a few hours), Netlify issues a
free Let's Encrypt certificate automatically. Check progress under
**Domain management → HTTPS**. If it stalls, click **Verify DNS configuration**
and then **Provision certificate**.

The `Strict-Transport-Security` header in `netlify.toml` only takes effect once
the certificate is live — that's expected.

---

## Step 5 — Verify

After the certificate is issued:

```bash
curl -sSI https://chrisbyers.app/ | head -20
```

Check that:
- `https://chrisbyers.app/` loads the site
- `https://www.chrisbyers.app/` 301-redirects to the apex
- `https://chrisbyers.app/nonsense` shows the branded 404
- Sending a test email to `chris@chrisbyers.app` still arrives

---

## Making changes later

```bash
cd /Users/chrisbyers/Desktop/Projects/ChrisByers && git add -A && git commit -m "Describe the change" && git push
```

Netlify redeploys within about a minute.

### Previewing locally

```bash
cd /Users/chrisbyers/Desktop/Projects/ChrisByers && npx --yes serve@14.2.4 site -l 4321
```

Then open `http://localhost:4321`.

---

## Optional extras

- **Analytics.** The CSP in `netlify.toml` is deliberately strict (`default-src 'self'`).
  Adding Plausible, Fathom, or GA means adding that host to `script-src` and
  `connect-src`, or the browser will silently block it.
- **Contact form.** The site uses `mailto:` links, which is fine. If you'd rather
  capture submissions, Netlify Forms works without a backend — add
  `netlify` and `name="contact"` to a real `<form>` element.
- **Deploy previews.** On by default for pull requests once the repo is connected.
