// Site sections — top half: nav, hero, marquee, manifesto, services.

// ─── NAV ────────────────────────────────────────────────────────────
function Nav() {
  const items = [
    ['Practice', '/#services'],
    ['Method', '/#method'],
    ['Work', '/#work'],
    ['Thinking', '/#thinking'],
    ['About', '/#about'],
  ];
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${T.rule}`,
    }}>
      <div style={{
        maxWidth: 1320, margin: '0 auto', padding: '18px 80px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        <NavLogo />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 32,
          fontFamily: T.body, fontSize: 13, fontWeight: 500, letterSpacing: '.04em', textTransform: 'uppercase',
        }}>
          {items.map(([l, h]) => (
            <a key={l} href={h} style={{ color: T.ink, textDecoration: 'none', opacity: .8 }}>{l}</a>
          ))}
        </div>
        <CTA href="/#contact">Book an intro</CTA>
      </div>
    </nav>
  );
}

// ─── HERO ───────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="top" style={{ position: 'relative', background: T.paper, color: T.ink, padding: '60px 80px 100px', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 60, alignItems: 'end' }}>
        <div>
          <SectionLabel style={{ marginBottom: 38 }}>Now booking · Q3 · 2026</SectionLabel>
          <HeroLockup growthSize={108} />
          <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: '1fr', gap: 18, maxWidth: 560 }}>
            <p style={{ fontFamily: T.body, fontSize: 19, lineHeight: 1.55, color: T.softInk, margin: 0 }}>
              I embed with founders for the time it takes — a 4-week audit, a 6-month engine build, a 12-month PPC programme. Whatever the engagement, the deliverable is a working system your team owns, not a deck.
            </p>
            <p style={{ fontFamily: T.body, fontSize: 16, lineHeight: 1.6, color: T.softInk, margin: 0, opacity: .85 }}>
              Web, PPC, analytics, automation, and the experiments that move the number. One operator, end-to-end, until the system is yours.
            </p>
          </div>
          <div style={{ marginTop: 38, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <CTA href="#contact">Start a project</CTA>
            <CTA href="#services" primary={false}>See the practice</CTA>
          </div>
        </div>

        {/* Right sidebar — stat strip */}
        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${T.rule}`, paddingLeft: 30 }}>
          {[
            ['$420M', 'Revenue compounded for clients'],
            ['12', 'Portfolio companies shipped'],
            ['7 yrs', 'Avg. operator experience'],
            ['Mixed', 'Engagement durations · 4 wks — 12 mo'],
          ].map(([k, v], i) => (
            <div key={k} style={{ padding: '20px 0', borderBottom: i < 3 ? `1px solid ${T.rule}` : 'none' }}>
              <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 38, letterSpacing: '-.03em', color: i === 0 ? T.accent : T.ink, lineHeight: 1 }}>
                {k}
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: T.softInk, opacity: .7, marginTop: 6 }}>
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── MARQUEE / CLIENTS ──────────────────────────────────────────────
function Marquee() {
  const names = ['Northstar Labs', 'Helix Capital', 'Atlas Robotics', 'Lume HQ', 'Cordon · BNPL', 'Spool', 'Forge Markets', 'Quanta Health', 'Reverb FM', 'Halftone'];
  return (
    <section style={{ background: T.ink, color: T.paper, padding: '28px 0', overflow: 'hidden', borderTop: `2px solid ${T.accent}` }}>
      <div style={{
        display: 'flex', gap: 60, whiteSpace: 'nowrap',
        animation: 'cge-marquee 38s linear infinite',
      }}>
        {[...names, ...names, ...names].map((n, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 60, flexShrink: 0,
            fontFamily: T.display, fontWeight: 900, fontSize: 32, letterSpacing: '-.03em', textTransform: 'uppercase',
          }}>
            {n}
            <Arrow size={22} color={T.accent} stroke={3.5} />
          </div>
        ))}
      </div>
      <style>{`@keyframes cge-marquee { to { transform: translateX(-33.333%); } }`}</style>
    </section>
  );
}

// ─── MANIFESTO ──────────────────────────────────────────────────────
function Manifesto() {
  return (
    <SectionWrap id="manifesto" bg={T.cream}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 80, alignItems: 'start' }}>
        <div>
          <SectionLabel>§ 01 — The practice</SectionLabel>
          <h2 style={{
            fontFamily: T.display, fontWeight: 900, fontSize: 64, letterSpacing: '-.04em', lineHeight: .92,
            textTransform: 'uppercase', margin: '30px 0 0',
          }}>
            A working studio<br/>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              for <Bracket size={56} color={T.accent} weight={5} spaceRatio={.3} side="l" />
              <span style={{ color: T.accent }}>growth</span>
              <Bracket size={56} color={T.accent} weight={5} spaceRatio={.3} side="r" />
            </span>
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 30 }}>
          <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 30, lineHeight: 1.35, margin: 0, color: T.ink }}>
            Most growth shops sell you a strategy. I build you a system.
          </p>
          <p style={{ fontFamily: T.body, fontSize: 17, lineHeight: 1.65, margin: 0, color: T.softInk }}>
            CGE is a single-operator practice — I plug into your team for the engagement duration that fits the work. Six months to build a complete growth engine. Twelve months to compound a PPC programme. A few weeks to audit and prescribe. The shape varies; the principle doesn't.
          </p>
          <p style={{ fontFamily: T.body, fontSize: 17, lineHeight: 1.65, margin: 0, color: T.softInk }}>
            No retainers padded with busywork. No twelve-person decks. No "alignment workshops." Just a working growth engine, hand-built, instrumented, and handed over.
          </p>
          <div style={{ display: 'flex', gap: 28, marginTop: 8, flexWrap: 'wrap' }}>
            {['No retainers', 'No decks', 'No theatre', 'Outcomes only'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bracket size={16} color={T.accent} weight={2.5} spaceRatio={.3} side="l" />
                <span style={{ fontFamily: T.display, fontWeight: 900, fontSize: 13, letterSpacing: '.04em', textTransform: 'uppercase' }}>{t}</span>
                <Bracket size={16} color={T.accent} weight={2.5} spaceRatio={.3} side="r" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

// ─── SERVICES ───────────────────────────────────────────────────────
const SERVICES = [
  {
    n: '01', slug: 'web-development', name: 'Web Development', t: 'Custom builds', dur: '6–8 weeks per build',
    pitch: 'Production-grade websites built to convert and ship fast. Marketing sites, app shells, landing pages.',
    items: [
      ['Next.js / Astro builds', 'Component-first, fast, SEO-ready'],
      ['Headless CMS integration', 'Sanity, Contentful, Notion-as-CMS'],
      ['Landing page systems', 'Templated, A/B-ready, single-source content'],
      ['Edge functions & APIs', 'Personalisation, geo, auth, paywalls'],
    ],
  },
  {
    n: '02', slug: 'ppc', name: 'PPC & Paid Acquisition', t: 'Performance media', dur: '12-month programme',
    pitch: 'Google, Meta, LinkedIn, and TikTok campaigns instrumented end-to-end. Built on offline conversions, not vanity metrics.',
    items: [
      ['Account architecture', 'Campaign hierarchy that scales past $100k/mo'],
      ['Creative testing systems', 'Frameworks for shipping 20+ ads/week'],
      ['Server-side conversion APIs', 'Recover signal lost to iOS / cookies'],
      ['MMM-lite attribution', 'Geo-holdouts and incrementality measurement'],
    ],
  },
  {
    n: '03', slug: 'tracking', name: 'Data Tracking & Implementation', t: 'Analytics infra', dur: '4–8 weeks per build',
    pitch: 'The plumbing — events, sources of truth, dashboards. Done once, properly, so every later decision has a foundation.',
    items: [
      ['GTM server-side container', 'First-party tracking on your own subdomain'],
      ['Amplitude · Mixpanel · GA4 setup', 'Event taxonomy + naming conventions'],
      ['Warehouse pipelines', 'BigQuery / Snowflake / DuckDB landing'],
      ['Identity resolution', 'Stitching anon → known user across devices'],
    ],
  },
  {
    n: '04', slug: 'business-software', name: 'Business Software', t: 'Internal tools', dur: '2–6 months per tool',
    pitch: 'The operational software a growing company needs but never has time to build — invoicing, admin, ops dashboards.',
    items: [
      ['Custom CRMs & dashboards', 'Built on Retool / Internal / bespoke'],
      ['Workflow automation', 'Zapier, n8n, custom backends'],
      ['Stripe & billing systems', 'Subscriptions, metering, invoicing'],
      ['Slack & ops integrations', 'Alerting, approvals, daily digests'],
    ],
  },
  {
    n: '05', slug: 'optimization', name: 'Optimization & Conversion', t: 'CRO', dur: '8–12 week sprints',
    pitch: 'Redesigning checkout flows, signup forms, and landing pages to turn more visitors into paying customers.',
    items: [
      ['Conversion Rate Optimization', 'Funnel teardowns + structured experimentation'],
      ['A/B Testing Implementation', 'LaunchDarkly · Optimizely · GrowthBook setup'],
      ['User Onboarding Engineering', 'Product tours, checklists, welcome flows'],
      ['Pricing page experiments', 'Tier framing, anchors, contract length tests'],
    ],
  },
  {
    n: '06', slug: 'analytics', name: 'Data & Analytics', t: 'Insight', dur: 'Quarterly engagements',
    pitch: 'Once tracking exists, someone has to read it. Funnel analysis, retention work, attribution, technical SEO.',
    items: [
      ['Funnel & drop-off analysis', 'Mapping the user journey to the leak'],
      ['Retention cohort work', 'D1/D7/D30, retention curves, root-cause'],
      ['SEO technical audits', 'Page speed, schema, sitemaps, indexation'],
      ['Quarterly insight reviews', 'What changed, why, what to ship next'],
    ],
  },
  {
    n: '07', slug: 'automation', name: 'Marketing Automation', t: 'Lifecycle', dur: '3–6 months per programme',
    pitch: 'The systems that make your product feel attentive — triggered messages, personalisation, viral loops.',
    items: [
      ['Behavior-triggered messaging', 'Email, SMS, push — based on real events'],
      ['Personalisation engines', 'Dynamic content by industry, geo, referrer'],
      ['Viral & referral systems', 'Invite mechanics, reward dashboards, tracking'],
      ['Lifecycle email design', 'Onboarding, reactivation, win-back sequences'],
    ],
  },
];

function ServiceCard({ s, idx }) {
  const big = idx === 0;
  return (
    <div style={{
      gridColumn: big ? '1 / -1' : 'auto',
      background: T.paper, border: `1px solid ${T.rule}`,
      padding: 36, display: 'flex', flexDirection: big ? 'row' : 'column',
      gap: big ? 60 : 20, position: 'relative',
      transition: 'transform .15s, border-color .15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = T.rule; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ flex: big ? '0 0 38%' : 'unset' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 18 }}>
          <span style={{ fontFamily: T.mono, fontSize: 13, letterSpacing: '.22em', color: T.accent }}>№{s.n}</span>
          <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', opacity: .55 }}>
            {s.t}
          </span>
        </div>
        <h3 style={{
          fontFamily: T.display, fontWeight: 900, fontSize: big ? 44 : 28, letterSpacing: '-.03em', lineHeight: 1,
          textTransform: 'uppercase', margin: 0,
        }}>
          {s.name}
        </h3>
        <p style={{ fontFamily: T.body, fontSize: big ? 17 : 14, lineHeight: 1.55, color: T.softInk, margin: '14px 0 0' }}>
          {s.pitch}
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {s.items.map(([k, v], i) => (
          <div key={k} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1.4fr', gap: 14, alignItems: 'baseline', borderTop: i === 0 ? `1px solid ${T.rule}` : 'none', paddingTop: i === 0 ? 14 : 0 }}>
            <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.18em', color: T.accent, opacity: .8 }}>
              0{i+1}
            </span>
            <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 14, letterSpacing: '-.01em' }}>
              {k}
            </div>
            <div style={{ fontFamily: T.body, fontSize: 13, color: T.softInk, lineHeight: 1.5 }}>
              {v}
            </div>
          </div>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${T.rule}` }}>
          <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', opacity: .6 }}>
            Engagement · {s.dur}
          </span>
          <a href={`/services/${s.slug}.html`} style={{
            fontFamily: T.mono, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: T.accent,
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            Explore <Arrow size={12} color={T.accent} stroke={2.5} />
          </a>
        </div>
      </div>
    </div>
  );
}

function Services() {
  return (
    <SectionWrap id="services" bg={T.warm}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 50, gap: 40, flexWrap: 'wrap' }}>
        <div>
          <SectionLabel>§ 02 — Services</SectionLabel>
          <h2 style={{
            fontFamily: T.display, fontWeight: 900, fontSize: 84, letterSpacing: '-.04em', lineHeight: .92,
            textTransform: 'uppercase', margin: '24px 0 0',
          }}>
            Seven things<br/>I build for you.
          </h2>
        </div>
        <p style={{ fontFamily: T.body, fontSize: 16, lineHeight: 1.6, color: T.softInk, margin: 0, maxWidth: 380 }}>
          End-to-end growth engineering. Pick one. Pick a few. Pick the whole stack — the offerings reinforce each other and the team rate stays the same.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
        {SERVICES.map((s, i) => <ServiceCard key={s.n} s={s} idx={i} />)}
      </div>
    </SectionWrap>
  );
}

Object.assign(window, { Nav, Hero, Marquee, Manifesto, Services, SERVICES });
