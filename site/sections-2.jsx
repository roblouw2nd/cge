// Site sections — middle: method, case study spotlight, impact numbers, more case work.

// ─── METHOD ─────────────────────────────────────────────────────────
function Method() {
  const engagements = [
    {
      dur: '2 — 4', unit: 'weeks', name: 'Growth Audit', tag: 'Diagnose',
      body: 'A surgical look at your funnel, stack, and team. You leave with a prioritised 12-month roadmap and a clear go / no-go on the work that follows.',
    },
    {
      dur: '6', unit: 'months', name: 'Engine Build', tag: 'Build',
      body: 'Embedded delivery — web, tracking, paid, lifecycle, CRO — all hand-built. Bi-weekly demos, daily commits, and an operating manual at handover.',
      featured: true,
    },
    {
      dur: '12', unit: 'months', name: 'PPC Programme', tag: 'Compound',
      body: 'Ongoing paid-acquisition operatorship across Google, Meta, LinkedIn, and TikTok. Server-side tracking, creative testing systems, and quarterly reviews.',
    },
    {
      dur: '8 — 12', unit: 'weeks', name: 'CRO Sprint', tag: 'Optimize',
      body: 'A focused experimentation programme against the highest-leverage flows in your funnel — onboarding, checkout, pricing. Win-rate measured, results documented.',
    },
    {
      dur: '∞', unit: 'fractional', name: 'Fractional CGE', tag: 'Lead',
      body: 'One day a week, on retainer — strategy, senior hires, weekly accountability. For founders who want a CGE-shaped seat without the full-time hire.',
    },
  ];
  return (
    <SectionWrap id="method" bg={T.ink} fg={T.paper}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 60, gap: 40, flexWrap: 'wrap' }}>
        <div>
          <SectionLabel color="#ff6a6a">§ 03 — Engagements</SectionLabel>
          <h2 style={{
            fontFamily: T.display, fontWeight: 900, fontSize: 84, letterSpacing: '-.04em', lineHeight: .92,
            textTransform: 'uppercase', margin: '24px 0 0', color: T.paper,
          }}>
            Timelines that<br/>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
              <Bracket size={70} color={T.accent} weight={5} spaceRatio={.3} side="l" />
              <span style={{ color: T.accent }}>fit the work</span>
              <Bracket size={70} color={T.accent} weight={5} spaceRatio={.3} side="r" />
            </span>.
          </h2>
        </div>
        <p style={{ fontFamily: T.body, fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,.75)', margin: 0, maxWidth: 380 }}>
          Five engagement shapes. Different services need different rhythms — an audit is weeks, a paid programme is a year. Pick the shape that matches your stage; I'll fit the work to it.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        {engagements.map((p, i) => (
          <div key={p.name} style={{
            background: p.featured ? T.accent : 'rgba(255,255,255,.04)',
            border: `1px solid ${p.featured ? T.accent : 'rgba(255,255,255,.12)'}`,
            padding: 26, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 380, position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: p.featured ? T.paper : T.accent, opacity: p.featured ? .9 : 1 }}>
                №{String(i+1).padStart(2,'0')}
              </span>
              <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', opacity: .8 }}>
                {p.tag}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
              <span style={{ fontFamily: T.display, fontWeight: 900, fontSize: 56, letterSpacing: '-.05em', color: p.featured ? T.paper : T.accent, lineHeight: 1 }}>
                {p.dur}
              </span>
              <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', opacity: .75 }}>
                {p.unit}
              </span>
            </div>
            <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 22, letterSpacing: '-.02em', textTransform: 'uppercase', lineHeight: 1.02, color: T.paper }}>
              {p.name}
            </div>
            <p style={{ fontFamily: T.body, fontSize: 13, lineHeight: 1.55, margin: 0, color: p.featured ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.7)' }}>
              {p.body}
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '.18em', opacity: .55 }}>
                {String(i+1).padStart(2,'0')} / 05
              </span>
              <Arrow size={12} color={p.featured ? T.paper : T.accent} stroke={2.5} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 36, padding: 22, border: `1px dashed rgba(255,255,255,.18)`, fontFamily: T.body, fontSize: 14, color: 'rgba(255,255,255,.75)', display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <span>
          <strong style={{ color: T.paper }}>Note on exclusivity:</strong> I take a small handful of concurrent engagements, not one client at a time — I'm a senior operator, not a freelancer. Capacity is checked before booking.
        </span>
        <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: T.accent }}>
          Two Q3 slots open
        </span>
      </div>
    </SectionWrap>
  );
}

// ─── CASE SPOTLIGHT ─────────────────────────────────────────────────
function CaseSpotlight() {
  return (
    <SectionWrap id="work" bg={T.paper}>
      <SectionLabel>§ 04 — Work</SectionLabel>
      <h2 style={{
        fontFamily: T.display, fontWeight: 900, fontSize: 84, letterSpacing: '-.04em', lineHeight: .92,
        textTransform: 'uppercase', margin: '24px 0 50px',
      }}>
        Selected work.
      </h2>

      <div style={{ background: T.cream, padding: 60, display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 60, alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.32em', textTransform: 'uppercase', color: T.accent, marginBottom: 14 }}>
            Luxury transport · Europe
          </div>
          <h3 style={{
            fontFamily: T.display, fontWeight: 900, fontSize: 56, letterSpacing: '-.04em', lineHeight: .95,
            textTransform: 'uppercase', margin: 0,
          }}>
            Tripled the{' '}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <Bracket size={50} color={T.accent} weight={4} spaceRatio={.3} side="l" />
              <span style={{ color: T.accent }}>fleet</span>
              <Bracket size={50} color={T.accent} weight={4} spaceRatio={.3} side="r" />
            </span><br/>
            <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>for a transport operator.<Arrow size={40} color={T.accent} stroke={4} /></span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 40 }}>
            {[['3×','Fleet size, over the engagement'],['Google','PPC rebuilt on real demand'],['1st-party','Conversion tracking, fixed'],['EU','Multi-market operation']].map(([k,v]) => (
              <div key={k} style={{ borderTop: `2px solid ${T.accent}`, paddingTop: 10 }}>
                <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 30, letterSpacing: '-.03em' }}>{k}</div>
                <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', opacity: .65, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: T.accent, marginBottom: 8 }}>
              The problem
            </div>
            <p style={{ fontFamily: T.body, fontSize: 15, lineHeight: 1.6, color: T.softInk, margin: 0 }}>
              A European luxury-transport operator wanted more bookings and a bigger fleet — but paid spend wasn't tied to real demand, and the conversion tracking couldn't be trusted. No one knew which campaigns actually produced rides.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: T.accent, marginBottom: 8 }}>
              What we shipped
            </div>
            <p style={{ fontFamily: T.body, fontSize: 15, lineHeight: 1.6, color: T.softInk, margin: 0 }}>
              Rebuilt the Google Ads account around qualified, high-intent demand, fixed conversion tracking end-to-end for clean attribution, and tightened the booking funnel. The fleet tripled to meet the demand the system was generating.
            </p>
          </div>
          <div style={{ marginTop: 10 }}>
            <CTA href="#contact">Start a project</CTA>
          </div>
        </div>
      </div>

      {/* Smaller cases row */}
      <div style={{ marginTop: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <div style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.32em', textTransform: 'uppercase', opacity: .55 }}>
            Other recent work
          </div>
          <a href="#contact" style={{
            fontFamily: T.mono, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase',
            color: T.accent, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            See all <Arrow size={11} color={T.accent} stroke={2.5} />
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[
            { n: '03', name: 'Local retail brand', cat: 'PPC + Web', stat: 'National', label: 'Local brand taken nationwide' },
            { n: '02', name: 'Ecommerce build', cat: 'Web + Tracking', stat: 'Live', label: 'Online store + clean analytics' },
            { n: '01', name: 'Fractional CMO · ME', cat: 'Strategy + Systems', stat: 'Portfolio', label: 'Growth across multiple brands' },
          ].map(c => (
            <div key={c.n} style={{ background: T.paper, border: `1px solid ${T.rule}`, padding: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.22em', color: T.accent }}>№{c.n}</span>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', opacity: .55 }}>
                  {c.cat}
                </span>
              </div>
              <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 24, letterSpacing: '-.02em', textTransform: 'uppercase', marginTop: 14 }}>
                {c.name}
              </div>
              <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 46, letterSpacing: '-.04em', color: T.accent, lineHeight: 1, marginTop: 18 }}>
                {c.stat}
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', opacity: .65, marginTop: 4 }}>
                {c.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

// ─── TOOLS / STACK ──────────────────────────────────────────────────
function Stack() {
  const stacks = [
    { cat: 'Build', items: ['Next.js', 'Astro', 'TypeScript', 'Tailwind', 'Sanity', 'Vercel'] },
    { cat: 'Track', items: ['GTM Server', 'Amplitude', 'Mixpanel', 'GA4', 'Segment', 'BigQuery'] },
    { cat: 'Test', items: ['LaunchDarkly', 'Optimizely', 'GrowthBook', 'PostHog', 'Statsig', 'VWO'] },
    { cat: 'Reach', items: ['Google Ads', 'Meta', 'LinkedIn', 'TikTok', 'Reddit', 'Apple SA'] },
    { cat: 'Lifecycle', items: ['Customer.io', 'Braze', 'Iterable', 'Resend', 'Twilio', 'Loops'] },
    { cat: 'Ops', items: ['Retool', 'n8n', 'Zapier', 'Stripe', 'Linear', 'Slack'] },
  ];
  return (
    <SectionWrap id="stack" bg={T.warm}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 50, gap: 40, flexWrap: 'wrap' }}>
        <div>
          <SectionLabel>§ 05 — The stack</SectionLabel>
          <h2 style={{
            fontFamily: T.display, fontWeight: 900, fontSize: 64, letterSpacing: '-.04em', lineHeight: .92,
            textTransform: 'uppercase', margin: '24px 0 0',
          }}>
            Tools I bring<br/>to the table.
          </h2>
        </div>
        <p style={{ fontFamily: T.body, fontSize: 15, lineHeight: 1.6, color: T.softInk, margin: 0, maxWidth: 380 }}>
          Tool-agnostic where possible, opinionated where it matters. If you already have a stack, I plug in. If you don't, I'll bring one.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {stacks.map(g => (
          <div key={g.cat} style={{ background: T.paper, border: `1px solid ${T.rule}`, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 18 }}>
              <Bracket size={18} color={T.accent} weight={2.5} spaceRatio={.3} side="l" />
              <span style={{ fontFamily: T.display, fontWeight: 900, fontSize: 18, letterSpacing: '-.02em', textTransform: 'uppercase' }}>
                {g.cat}
              </span>
              <Bracket size={18} color={T.accent} weight={2.5} spaceRatio={.3} side="r" />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {g.items.map(it => (
                <div key={it} style={{
                  padding: '6px 10px', background: T.cream,
                  fontFamily: T.mono, fontSize: 11, letterSpacing: '.06em', color: T.ink,
                }}>{it}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

Object.assign(window, { Method, CaseSpotlight, Stack });
