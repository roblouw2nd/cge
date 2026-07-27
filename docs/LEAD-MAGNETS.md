# CGE Lead Magnets — Specification & Build Guide

Reference document for the four free tools at `chiefgrowthengineer.com/tools/`. Written so any developer or AI model can rebuild, modify or extend them without prior context. Last updated: 2026-07-06 (v2 — interactive rebuild).

**v2 additions (all four tools; content, scoring, verdict copy and lead-capture contract unchanged):** the audit is now a one-question-at-a-time wizard (keyboard 1/2/3, back button, progress bar) ending in an animated count-up + SVG radar chart of the four pillars; the tracking check has a live semicircular "Tracking Trust Score" gauge (starts at 100, drops per ticked sign) with toggle-card signs; the waste finder has a log-scale spend slider, leak toggle cards, an always-live result and a real-time "burned while this page has been open" ticker; the ROI calculator has US/UK/UAE/ZA market presets, slider+number input pairs, and an animated SVG bar chart. All four support shareable result links via URL hash (restored on load), respect `prefers-reduced-motion`, expose `window.__toolSummary` after scoring for tests, and debounce high-frequency `tool_complete` events (ROI/waste). Former roadmap items #3 (debounce), #4 (shareable results) and #7 (localised defaults) are done.

---

## 1. Strategic context (read first)

**Business:** Chief Growth Engineer (CGE) — the fractional-growth-engineering practice of Rob Louw (rob@chiefgrowthengineer.com, Cape Town, GMT+2). Positioning: one senior operator who builds paid acquisition, conversion tracking, web and data systems hands-on, then hands them over. Target ranking phrase: **"fractional growth engineer"** and variants, in the US, UK/Ireland and Middle East markets.

**Purpose of the tools:** each one is a *diagnostic that qualifies the visitor while giving away real value*. The philosophy, which must be preserved in any rebuild:

1. **No signup wall.** The visitor always gets the full result on the page without giving an email. The email capture is a follow-up offer ("send me the fix-list"), never a gate. This is deliberate — it builds trust, gets shared, and gets cited by AI answer engines.
2. **The result is honest, sometimes uncomfortable.** Verdict copy never flatters and never overclaims. Waste estimates carry explicit caveats. The ROI calculator openly says when fractional is *not* the cheapest option. Authenticity is the brand.
3. **The captured lead arrives pre-qualified.** Every submission includes the visitor's own diagnostic results in the message body, so Rob opens the email already knowing their weakest pillar / spend level / leak count.
4. **Each tool maps to a service.** Audit → Growth Audit engagement; Tracking check → tracking/data work; Waste finder → PPC programme; ROI calculator → Fractional CGE seat.

**Funnel per tool:** organic/AI-referred visitor → completes tool on page → sees verdict → optional email form → POST to `/contact.php` → email to rob@chiefgrowthengineer.com → Rob replies personally within 24h. No autoresponders, no sequences (yet — see §7).

---

## 2. Shared technical architecture

All four tools follow the same pattern. Keep it when extending.

**Stack:** single self-contained HTML file per tool, vanilla JS (IIFE, no dependencies, no build step), shared site stylesheet `/assets/css/site.css`, hosted on Afrihost shared Linux (Apache + PHP 7+), deployed by GitHub Actions SFTP mirror on push to `main` (repo `roblouw2nd/cge`).

**File locations:**

| File | URL |
|---|---|
| `tools/index.html` | `/tools/` — hub page listing all four |
| `tools/growth-engine-audit.html` | `/tools/growth-engine-audit.html` |
| `tools/tracking-health-check.html` | `/tools/tracking-health-check.html` |
| `tools/ppc-waste-finder.html` | `/tools/ppc-waste-finder.html` |
| `tools/fractional-roi-calculator.html` | `/tools/fractional-roi-calculator.html` |

**Page skeleton (identical across tools):**
1. `<head>`: title/meta-description written for the tool's target query; canonical URL; OG + Twitter tags; favicon; Google Fonts (Instrument Serif, Archivo, JetBrains Mono); `site.css`; JSON-LD (see below); GA4 gtag `G-R9WM1Q42DN`; small `<style>` block for tool-specific controls.
2. Nav (`.nav-shell` pattern copied from other static pages; "Tools" link active).
3. Hero: `.section-label` eyebrow ("§ Tool 0N — Name"), `.display` h1 with red accent span, `.lede` intro that sets expectations and states the no-signup promise.
4. Tool body inside `.section.bg-cream > .container` (max-width 860px; calculator uses 1000px).
5. Result panel `#result` — hidden (`display:none`) until scored; white card with `border-top:4px solid var(--accent)`; big number + uppercase verdict + body copy; `scrollIntoView({behavior:'smooth'})` on reveal.
6. Email-capture form `#leadForm` inside the result panel (except ROI calculator — see its section).
7. Minimal footer (`.footer-bar` only) linking back to `/tools/`.

**Design tokens (from `site.css` / `site/tokens.jsx`):** accent `#d62828` (red), ink `#0a0a0a`, soft-ink `#2a2620`, cream/warm backgrounds; display font Archivo 900 uppercase with negative letter-spacing; mono labels JetBrains Mono, uppercase, `.18–.32em` letter-spacing; brutalist flat cards, square corners, `border-top` accent bars. **No rounded corners, no shadows, no gradients** — matches CGE Brand Guidelines Vol I.

**Lead capture — contract with `/contact.php`:** POST `multipart/form-data` via `fetch` with header `Accept: application/json` (returns `{ok:true}` on success). Fields:

| Field | Value |
|---|---|
| `name` | visitor's name (required by handler) |
| `email` | visitor's email (required, validated server-side) |
| `budget` | `"Tool: <Tool Name>"` — used as the engagement tag in the email Rob receives |
| `message` | plain-text summary of the visitor's results (built in JS, stored on `window.__*Summary`), plus the ask (required) |
| `company_url` | **honeypot — must be sent empty.** Non-empty silently "succeeds" and drops the mail |

On success show inline confirmation ("Sent — I'll reply within 24 hours") **plus a link to the booking calendar (`https://calendar.app.google/vXohio54MnjJy57X7`)**; on failure show fallback text with `rob@chiefgrowthengineer.com`. Never redirect.

**Server side (since 2026-07-27):** `contact.php` also (a) appends every lead to `~/cge-leads.jsonl` outside `public_html` before mailing, (b) sends the visitor a branded thank-you email containing the booking link and a copy of their `message` (i.e. their own scorecard — "results-by-email" is now automatic), and (c) rate-limits 5 submissions/IP/hour. The `budget` prefix `"Tool: "` switches the thank-you subject to "Your {tool} results — and what happens next". Contract fields are unchanged.

**Analytics events (GA4, via `gtag`):**
- `tool_complete` — fired when a verdict is rendered. Params: `tool` (snake_case id) + tool-specific params listed per tool below.
- `generate_lead` — fired on successful form submit. Param: `tool`.
Guard every call with `if (typeof gtag === 'function')`.

**JSON-LD:** each tool page carries a `WebApplication` node — `applicationCategory: "BusinessApplication"`, `operatingSystem: "Web"`, `isAccessibleForFree: true`, `offers {price: "0"}`, `provider {@id: "https://chiefgrowthengineer.com/#business"}`. The ROI calculator additionally carries a `FAQPage` node (cost-related Q&As) because it targets "fractional growth engineer cost" queries.

**Discoverability wiring (update all of these when adding a tool):** `sitemap.xml`, `llms.txt` ("Free tools" section), nav links in every static page + `site/sections-1.jsx` Nav, footer "Free tools"/Tools columns, and the hub page `tools/index.html`.

---

## 3. Tool 01 — Growth Engine Audit

**URL:** `/tools/growth-engine-audit.html` · **GA id:** `growth_engine_audit` · **Maps to:** Growth Audit engagement (2–4 wk fixed fee).

**Exact purpose:** replicate the first-pass diagnostic Rob runs at the start of every engagement, so the visitor self-identifies their weakest growth pillar — and Rob's follow-up email can open with a prioritised fix-list for that pillar. Also the primary "start here" tool linked from the pillar article.

**Mechanics:** 12 yes/partly/no questions, 3 per pillar, in fixed order:

1. **Tracking & data** — channel/campaign attribution confidence; server-side or first-party tracking; platform-vs-CRM reconciliation.
2. **Paid acquisition** — optimising to revenue/qualified leads not clicks; search-terms/negatives reviewed in last 30 days; CAC known per channel.
3. **Website & conversion** — self-serve price/quote/booking available; <3s mobile load; deliberate conversion experiment in last quarter.
4. **Systems & process** — leads land in one CRM automatically; a weekly number owned by a named person; documentation survives the operator leaving.

**Scoring:** No=0, Partly=1, Yes=2. Total /24; per-pillar /6. All 12 required before scoring (button shows progress "N / 12 answered" and refuses otherwise). Weakest pillar = lowest per-pillar score (first on tie, in the order above).

**Verdict bands (keep copy tone if rewording):**
- 20–24 · "Engineered." — top tier; compounding wins (incrementality, lead-quality loops), second opinion not rebuild.
- 14–19 · "Running, leaking." — names the weakest pillar; fixing it "usually pays for itself within a quarter".
- 8–13 · "Held together." — parts exist but no system; "start with tracking; everything else depends on it".
- 0–7 · "Pre-engine." — running on intuition; "every month of paid spend without instrumentation is tuition you don't get back".

**Result panel:** score (e.g. `17/24`), verdict, body, then a 4-up grid of per-pillar scores (`N/6` with accent top-border).

**Lead form ask:** "Want the fix-list?" — Rob replies with a prioritised fix-list for the weakest pillar. `message` = total, verdict, per-pillar scores, weakest pillar.

**GA `tool_complete` params:** `score` (int), `weakest_pillar` (string).

---

## 4. Tool 02 — Tracking Health Check

**URL:** `/tools/tracking-health-check.html` · **GA id:** `tracking_health_check` · **Maps to:** tracking/data-integrity work; free 20-min teardown call as the offer.

**Exact purpose:** play directly to CGE's core specialism (data integrity). Convert the visceral suspicion "my numbers feel wrong" into a concrete count, then convert 3+ ticks into a live teardown call — CGE's highest-converting entry offer because Rob demonstrates competence on the visitor's own setup.

**Mechanics:** 12 checkboxes, each a "sign your tracking is lying" with a bold title + one-line explanation: platform-vs-reality mismatch; GA4 disagrees with everything; conversions without revenue; "direct/none" top channel; browser-only pixels; forms firing on click not success; no offline conversion loop; thank-you page reachable directly; duplicate/ghost tags; setup person left; iOS traffic looks dead; can't answer "which campaign made money last month".

**Scoring:** count of ticks /12. No minimum — zero ticks is a valid result.

**Verdict bands:**
- 0 · "Either excellent — or unexamined." — challenges the visitor to reconcile platforms vs revenue first.
- 1–2 · "Trust, but verify." — fixable in days; bad-data decisions multiply cost.
- 3–5 · "Your numbers are lying." — "fiction with confidence intervals"; stop budget decisions until fixed.
- 6–12 · "Flying blind." — rebuild not patches (first-party, server-side, revenue-reconciled); best ROI in the marketing budget.

**Lead form ask:** "Free 20-minute teardown" — explicitly framed "if you ticked three or more"; live call, no charge, "it's how I find good clients". `message` = count + names of ticked signs.

**GA `tool_complete` params:** `signs` (int).

---

## 5. Tool 03 — PPC Waste Finder

**URL:** `/tools/ppc-waste-finder.html` · **GA id:** `ppc_waste_finder` · **Maps to:** PPC Programme; free 48-hour read-only account audit as the offer.

**Exact purpose:** attach a currency figure to account neglect. The monetary estimate creates urgency the other tools can't, and the follow-up offer (read-only access, real number from search-terms/placement data, "yours to act on with or without me") is a naturally reciprocal step toward an engagement.

**Mechanics:** one spend input (number, default 10000) + currency select (`$ £ € AED R` — chosen to cover CGE's markets) + 8 leak checkboxes, each displaying its waste range:

| Leak | Range (% of monthly spend) |
|---|---|
| No search-terms review (30+ days) | 5–12% |
| Thin negative keyword lists | 4–10% |
| Broad match without guardrails | 5–15% |
| Optimising to clicks / raw leads | 8–20% |
| Display / search-partner drift | 3–8% |
| Geo bleed | 2–8% |
| Brand cannibalisation | 3–10% |
| Broken / double-firing conversions | 5–15% |

**Calculation:** sum lows and highs of ticked leaks, then **cap low at 35% and high at 45% of spend** (leaks overlap; the cap keeps the estimate defensible). Monthly range = spend × [low, high]; also show ×12 annual line. Output formatted with `toLocaleString`, e.g. `$1,300 – $3,100 / mo`.

**Integrity requirement:** the page must keep the caveat that ranges are field estimates and "your search terms report holds the truth". If ranges are ever tuned, tune from real audit data.

**Verdict bands (on capped high%):** 0 ticked → "search terms report will settle it in ten minutes"; <15% → modest, an afternoon of cleanup; <30% → meaningful, mostly configuration fixes, recoverable in weeks; ≥30% → structure is working against you, rebuild foundations before adding budget (conversions → match types/negatives → bidding targets).

**Lead form ask:** "Want the real number?" — 48h read-only access, actual figure returned free. `message` = spend, ticked leak names, estimated range.

**GA `tool_complete` params:** `leaks` (int), `spend` (number).

---

## 6. Tool 04 — Fractional ROI Calculator

**URL:** `/tools/fractional-roi-calculator.html` · **GA id:** `fractional_roi_calculator` · **Maps to:** Fractional CGE seat (ongoing day-rate).

**Exact purpose:** own the commercial-intent query cluster "fractional growth engineer cost / vs agency / vs hiring". Unlike the other three it has **no email form** — it's a trust asset and SEO/AIO landing page; its CTA is a direct link to `/contact.html` ("Talk through your numbers · 20 minutes · no pitch if it's not a fit"). Do not add a gate to this page.

**Mechanics:** 8 editable assumption inputs, all recalculating live on `input` (no button):

| Input | id | Default |
|---|---|---|
| Currency symbol | `cur` | `$` |
| FT salary (annual) | `salary` | 140000 |
| FT overhead % | `overhead` | 30 |
| Agency monthly retainer | `retainer` | 6000 |
| Agency % of ad spend | `pctSpend` | 10 |
| Monthly ad spend | `adspend` | 20000 |
| Fractional day rate | `dayrate` | 1200 |
| Fractional days/week | `days` | 1 (0.5–3) |

**Formulas:**
- Full-time: `salary × (1 + overhead/100)`
- Agency: `retainer × 12 + adspend × 12 × pctSpend/100`
- Fractional: `dayrate × days × 48` (48 working weeks/year)

**Output:** three side-by-side cards (FT / Agency / Fractional, fractional visually featured) each with annual cost + 4 qualitative bullets, then a dynamically written summary sentence with % deltas. **Honesty rule (must survive any rewrite):** if fractional is not the cheapest at the visitor's settings, the summary says so plainly; the "Fair caveats" block (cost ≠ value; hire full-time at 40+ h/wk of proven playbook) stays on the page.

**GA:** `tool_complete` on every recalc (no params beyond `tool`; accept the noise or debounce later). No `generate_lead` — contact clicks are tracked as normal page navigation.

---

## 7. Known gaps / future enhancements (in priority order)

1. **Email notification hygiene** — ~~leads rely on PHP `mail()` alone~~ *partly done 2026-07-27:* `contact.php` prefers authenticated Google Workspace SMTP when `~/cge-mail-config.php` exists and logs every lead to `~/cge-leads.jsonl` as a backstop. Still to do: create that config on the server and test deliverability with a real submission.
2. **Results-by-email option** — ~~add "email me my scorecard"~~ *done 2026-07-27:* every submitter automatically receives a branded confirmation containing their own results and the booking link. Honeypot kept.
3. **Debounce ROI calculator analytics** — currently fires `tool_complete` per keystroke.
4. **Shareable results** — encode answers in the URL hash (e.g. `#a=201102...`) so verdicts can be shared/bookmarked; no backend needed.
5. **PDF export of audit results** — client-side (e.g. print stylesheet) rather than server-side.
6. **A/B the lead-form asks** — the ask copy per tool is a first draft; test "fix-list" vs "teardown call" framings.
7. **Localised defaults** — ROI calculator could set currency + salary defaults from `navigator.language` or a country dropdown (US/UK/UAE/ZA presets).
8. **Nurture** — Rob replies personally today; if volume grows, add a single plain-text follow-up email, not a sequence. The no-spam promise is on the pages ("No sequence, no spam") — honour it.

## 8. Invariants — do not break

- Result always shown on-page without email. Email is optional follow-up.
- Honeypot `company_url` sent empty on every programmatic submit.
- Verdict copy stays blunt, specific and non-salesy; caveats stay visible.
- Single-file, dependency-free HTML per tool; no build step; works on Afrihost shared hosting.
- Brand: Archivo 900 uppercase display, JetBrains Mono labels, `#d62828` accent, flat square cards.
- Every new tool gets: sitemap entry, llms.txt entry, hub-page card, nav/footer links, `WebApplication` JSON-LD, `tool_complete` + `generate_lead` events.
