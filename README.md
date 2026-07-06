# Chief Growth Engineer — chiefgrowthengineer.com

The marketing site for CGE — built as static HTML/CSS/JS with a small PHP contact handler.
Designed to be hosted on Afrihost Linux (shared) and auto-deployed via GitHub Actions over FTP.

## Stack

- **HTML / CSS / vanilla JS** for the standalone pages (About, Work, Blog, Contact, 404)
- **React 18 + Babel-in-browser** for the marketing pages that render from JSX (`/index.html`, `/services/*.html`). Source lives in `/site/*.jsx`. Loads React from unpkg.
- **PHP 7+** for the contact-form handler (`/contact.php`) — uses `mail()`, no extensions required.
- **.htaccess** for pretty URLs, security headers, caching, and gzip.

## Repo layout

```
.
├── index.html                  # Home (renders all sections from JSX)
├── about.html
├── work.html
├── contact.html
├── 404.html
├── contact.php                 # Form handler
├── .htaccess                   # Apache config
├── robots.txt
├── sitemap.xml
├── site/                       # JSX source (React components)
│   ├── tokens.jsx              # Design tokens + primitives
│   ├── sections-1.jsx          # Nav, Hero, Marquee, Manifesto, Services
│   ├── sections-2.jsx          # Method, CaseSpotlight, Stack
│   ├── sections-3.jsx          # Thinking, About, Testimonials, Pricing, FAQ, BigCTA, Footer
│   ├── service-data.jsx        # SERVICE_DETAILS dictionary
│   ├── service-page.jsx        # ServicePage template
│   └── app.jsx                 # Home composition
├── services/
│   ├── web-development.html    # Each renders <ServicePage slug="..."/>
│   ├── ppc.html
│   ├── tracking.html
│   ├── business-software.html
│   ├── optimization.html
│   ├── analytics.html
│   └── automation.html
├── blog/
│   ├── index.html              # Field-notes index
│   └── the-best-growth-teams-ship-faster.html
├── assets/
│   ├── css/site.css
│   ├── js/contact.js
│   └── img/favicon.svg
└── .github/workflows/deploy.yml
```

## Local preview

The site is static — any HTTP server will do.

```bash
# from the repo root
python3 -m http.server 8000
# or
npx serve .
```

Open <http://localhost:8000/>. Note: `contact.php` needs a PHP-capable server to submit:

```bash
php -S localhost:8000
```

## Deployment — Afrihost via GitHub Actions

Every push to `main` triggers `.github/workflows/deploy.yml`, which mirrors the repo to your Afrihost
`public_html/` over **SFTP** (port 22) using `lftp`. Afrihost's firewall blocks plain passive FTP, so
SFTP is the supported transport. This GitHub Action is the **single** deploy mechanism — there is no
cPanel auto-deploy (the old `.cpanel.yml` was removed to avoid two systems writing to `public_html`).

### One-time setup

1. **Push this repo to GitHub** (see the next section).

2. **Get FTP credentials from Afrihost.** Log into the Afrihost ClientZone → cPanel for `chiefgrowthengineer.com`. Either use the main cPanel FTP account or create a dedicated one:
   - **Server:** usually `ftp.chiefgrowthengineer.com` (or the Afrihost server hostname shown in cPanel)
   - **Username:** typically `youraccount@chiefgrowthengineer.com` for an additional account, or your main cPanel user
   - **Password:** as set
   - **Target dir:** usually `public_html/` (Afrihost shared default). If your account routes the domain to a different folder, note that path.

3. **Add the secrets to the GitHub repo** at <https://github.com/roblouw2nd/cge/settings/secrets/actions>:
   - `FTP_SERVER` — the SFTP/cPanel host (e.g. the Afrihost server hostname, or `chiefgrowthengineer.com`)
   - `FTP_USERNAME` — your cPanel username
   - `FTP_PASSWORD` — the cPanel password
   - *(optional)* `FTP_PORT` — defaults to `22`. Override if Afrihost uses a custom SSH/SFTP port.
   - *(optional)* `FTP_TARGET_DIR` — defaults to `public_html`. Override if the domain routes elsewhere.

4. **Trigger a deploy:** push any commit to `main`, or go to the **Actions** tab → "Deploy to Afrihost" → "Run workflow".

### Notes
- Transport is SFTP over port 22 (set `FTP_PORT` to override). SFTP/SSH access must be enabled on the
  Afrihost account — if it isn't, request it via Afrihost support, otherwise the connection step fails.
- `mirror --reverse --delete` makes the server match the repo, so files removed from the repo are also
  removed from `public_html`. Anything that must live only on the server should sit outside `public_html`.
- The `exclude` block keeps `.git/`, `.github/`, `README.md`, `node_modules/`, etc. off the live server.

## Push to GitHub

The remote is `https://github.com/roblouw2nd/cge`. From this folder:

```bash
git init
git add .
git commit -m "Initial CGE site"
git branch -M main
git remote add origin https://github.com/roblouw2nd/cge.git
git push -u origin main
```

After the push, configure the FTP secrets (above) and the next push will deploy automatically.

## Contact form

`contact.php` validates input, runs a honeypot check (`company_url` field), and sends an email
to `rob@chiefgrowthengineer.com` via PHP `mail()`. Reply-To is set to the sender.

If Afrihost requires SMTP authentication instead of `sendmail`, swap the `mail()` call for
PHPMailer with SMTP creds — see Afrihost's docs on the right SMTP host/port for your account.

## Editing content

- **Marketing/services copy** — edit the JSX files in `/site/`. The browser will Babel-transform on reload.
- **Static pages (About, Work, Blog, Contact)** — edit the corresponding `.html` directly.
- **New blog post** — copy `blog/the-best-growth-teams-ship-faster.html` to a new file with a clean URL slug, edit the content, and add it to `blog/index.html` + `sitemap.xml`.

## Going faster (later)

Babel-in-browser is fine for launch but slower on first paint than pre-rendered HTML.
When the site has traffic worth optimising for, swap the JSX pages for either:
- An Astro / Next.js static build (export the same components, `astro build` → `dist/` → FTP)
- Server-side render the React components once via `react-dom/server` in a Node build step.

Either way, no Afrihost config changes needed — the deploy target stays static `public_html/`.

---

© CGE Group · chiefgrowthengineer.com
