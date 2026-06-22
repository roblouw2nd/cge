// Site sections — bottom: thinking, about, testimonials, FAQ, pricing, CTA, footer.

// ─── THINKING ───────────────────────────────────────────────────────
function Thinking() {
  const notes = [
    { n: '004', date: '17 May 2026', cat: 'Operating', title: 'The best growth teams ship faster than they strategize.', dek: 'Three observations from years of growth work — and what makes the high-leverage teams different.' },
    { n: '003', date: '02 May 2026', cat: 'Tracking', title: 'You don\'t have a data problem. You have a definitions problem.', dek: 'Why "active user" means seven different things across your tools — and how to fix it in one afternoon.' },
    { n: '002', date: '18 Apr 2026', cat: 'Paid', title: 'Server-side conversion APIs aren\'t optional any more.', dek: 'iOS attrition, browser deprecations, and the work that recovers signal most accounts are quietly losing.' },
    { n: '001', date: '04 Apr 2026', cat: 'CRO', title: 'The five experiments every onboarding should run.', dek: 'A field-tested playbook — what to test, in what order, and why sequence beats volume.' },
  ];
  return (
    <SectionWrap id="thinking" bg={T.paper}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 50, gap: 40, flexWrap: 'wrap' }}>
        <div>
          <SectionLabel>§ 06 — Thinking</SectionLabel>
          <h2 style={{
            fontFamily: T.display, fontWeight: 900, fontSize: 84, letterSpacing: '-.04em', lineHeight: .92,
            textTransform: 'uppercase', margin: '24px 0 0',
          }}>
            Field notes.
          </h2>
        </div>
        <p style={{ fontFamily: T.body, fontSize: 16, lineHeight: 1.6, color: T.softInk, margin: 0, maxWidth: 380 }}>
          A few operating principles and playbooks I write up when there's something worth saying.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 18, alignItems: 'stretch' }}>
        {/* Featured note */}
        <div style={{ background: T.cream, padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 380 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
              <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.22em', color: T.accent }}>Field note · {notes[0].n}</span>
              <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', opacity: .55 }}>{notes[0].date}</span>
            </div>
            <h3 style={{ fontFamily: T.display, fontWeight: 900, fontSize: 36, letterSpacing: '-.03em', lineHeight: 1.02, textTransform: 'uppercase', margin: 0 }}>
              {notes[0].title.split('faster than they')[0]}
              <span style={{ color: T.accent }}>faster than they</span>
              {notes[0].title.split('faster than they')[1]}
            </h3>
            <p style={{ fontFamily: T.body, fontSize: 15, lineHeight: 1.6, color: T.softInk, marginTop: 20 }}>
              {notes[0].dek}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: T.accent }}>
              Read the note
            </span>
            <Arrow size={14} color={T.accent} stroke={3} />
          </div>
        </div>

        {/* 3 stacked side notes */}
        {notes.slice(1).map(n => (
          <article key={n.n} style={{ background: T.paper, border: `1px solid ${T.rule}`, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 380 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.22em', color: T.accent }}>№{n.n}</span>
              <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', opacity: .55 }}>{n.cat}</span>
            </div>
            <h3 style={{ fontFamily: T.display, fontWeight: 900, fontSize: 19, letterSpacing: '-.02em', lineHeight: 1.05, textTransform: 'uppercase', margin: 0 }}>
              {n.title}
            </h3>
            <p style={{ fontFamily: T.body, fontSize: 13, lineHeight: 1.55, color: T.softInk, margin: 0 }}>
              {n.dek}
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', opacity: .55 }}>{n.date}</span>
              <Arrow size={12} color={T.accent} stroke={2.5} />
            </div>
          </article>
        ))}
      </div>
    </SectionWrap>
  );
}

// ─── ABOUT ──────────────────────────────────────────────────────────
function About() {
  return (
    <SectionWrap id="about" bg={T.cream}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'start' }}>
        <div>
          <SectionLabel>§ 07 — About</SectionLabel>
          <h2 style={{
            fontFamily: T.display, fontWeight: 900, fontSize: 84, letterSpacing: '-.04em', lineHeight: .92,
            textTransform: 'uppercase', margin: '24px 0 30px',
          }}>
            Rob Louw.
          </h2>

          {/* Portrait placeholder */}
          <div style={{
            width: '100%', maxWidth: 320, aspectRatio: '4 / 5', background: T.ink, position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              fontFamily: T.display, fontWeight: 900, fontSize: 120, letterSpacing: '-.08em', color: T.accent, opacity: .5,
            }}>RL</div>
            <div style={{ position: 'absolute', bottom: 14, left: 16, fontFamily: T.mono, fontSize: 9, letterSpacing: '.2em', color: T.paper, opacity: .55, textTransform: 'uppercase' }}>
              Portrait · placeholder
            </div>
            <div style={{ position: 'absolute', top: 14, right: 14 }}>
              <Bracket size={20} color={T.accent} weight={2.5} spaceRatio={.4} side="l" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 60 }}>
          <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 28, lineHeight: 1.4, margin: 0 }}>
            Engineer by training. Operator by trade.
          </p>
          <p style={{ fontFamily: T.body, fontSize: 17, lineHeight: 1.65, color: T.softInk, margin: 0 }}>
            I trained as an engineer at the University of Cape Town, then spent the last eight years in marketing — most of it deep in performance: Google Ads, conversion tracking, and the data integrity that makes both worth trusting.
          </p>
          <p style={{ fontFamily: T.body, fontSize: 17, lineHeight: 1.65, color: T.softInk, margin: 0 }}>
            I've held fractional CMO roles at notable companies across the Middle East, taken local brands national, built online stores and the systems behind them, and tripled the fleet for a luxury-transport operator in Europe. CGE is where I do that work now — for a small number of clients at a time, and the deliverable is always a system your team can run without me.
          </p>

          {/* Quick facts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 18 }}>
            {[
              ['Based in', 'Cape Town · South Africa'],
              ['Working hours', 'GMT+2 · flexible to US & Asia'],
              ['Specialism', 'PPC, tracking & data integrity'],
              ['Background', 'Engineering · UCT'],
            ].map(([k, v]) => (
              <div key={k} style={{ borderTop: `1px solid ${T.rule}`, paddingTop: 10 }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: T.accent, opacity: .85 }}>
                  {k}
                </div>
                <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 15, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

// ─── PRICING / ENGAGEMENT MODELS ────────────────────────────────────
function Pricing() {
  const tiers = [
    {
      n: '01', name: 'Growth Audit', dur: '2 — 4 weeks', price: 'Fixed fee',
      best: 'Best for: pre-engagement clarity sprint',
      includes: ['Full funnel teardown', 'Stack & tracking audit', '12-month prioritised roadmap', 'On-site working session'],
    },
    {
      n: '02', name: 'Engine Build', dur: '6 months', price: 'Project', featured: true,
      best: 'Best for: founders with PMF, ready to compound',
      includes: ['Embedded, full-stack delivery', 'Web, tracking, paid, lifecycle, CRO', 'Bi-weekly demos, daily commits', 'Operating manual + team training'],
    },
    {
      n: '03', name: 'PPC Programme', dur: '12 months', price: 'Monthly + perf',
      best: 'Best for: scaling paid spend past $30k/mo',
      includes: ['Google, Meta, LinkedIn, TikTok', 'Server-side conversions', 'Weekly creative shipping', 'Quarterly incrementality tests'],
    },
    {
      n: '04', name: 'Fractional CGE', dur: 'Ongoing', price: 'Day rate',
      best: 'Best for: post-engagement leverage',
      includes: ['One day a week, on-site or async', 'Strategy + senior hires', 'Weekly accountability', 'Direct access to my network'],
    },
  ];

  return (
    <SectionWrap id="pricing" bg={T.warm}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 50, gap: 40, flexWrap: 'wrap' }}>
        <div>
          <SectionLabel>§ 09 — Engagement</SectionLabel>
          <h2 style={{
            fontFamily: T.display, fontWeight: 900, fontSize: 84, letterSpacing: '-.04em', lineHeight: .92,
            textTransform: 'uppercase', margin: '24px 0 0',
          }}>
            Four ways<br/>to work together.
          </h2>
        </div>
        <p style={{ fontFamily: T.body, fontSize: 16, lineHeight: 1.6, color: T.softInk, margin: 0, maxWidth: 380 }}>
          Different services, different shapes. An audit is weeks. An engine build is months. A paid programme is a year. Pricing on request — exact numbers depend on scope.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {tiers.map(tier => (
          <div key={tier.n} style={{
            background: tier.featured ? T.ink : T.paper, color: tier.featured ? T.paper : T.ink,
            border: tier.featured ? `1px solid ${T.ink}` : `1px solid ${T.rule}`,
            padding: 26, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 480,
            position: 'relative',
          }}>
            {tier.featured && (
              <div style={{
                position: 'absolute', top: -12, right: 24,
                background: T.accent, color: T.paper,
                padding: '5px 12px', fontFamily: T.display, fontWeight: 900, fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase',
              }}>
                Most chosen
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.22em', color: T.accent }}>№{tier.n}</span>
              <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', opacity: .65 }}>
                {tier.dur}
              </span>
            </div>
            <h3 style={{ fontFamily: T.display, fontWeight: 900, fontSize: 26, letterSpacing: '-.03em', lineHeight: 1, textTransform: 'uppercase', margin: 0 }}>
              {tier.name}
            </h3>
            <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 18, letterSpacing: '-.02em', color: T.accent }}>
              {tier.price}
            </div>
            <p style={{ fontFamily: T.body, fontSize: 13, lineHeight: 1.5, margin: 0, opacity: tier.featured ? .85 : .75 }}>
              {tier.best}
            </p>
            <Rule color={tier.featured ? T.paper : T.ink} opacity={tier.featured ? .25 : .15} />
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tier.includes.map(inc => (
                <li key={inc} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontFamily: T.body, fontSize: 13.5, lineHeight: 1.5 }}>
                  <span style={{ color: T.accent, fontFamily: T.mono, fontSize: 10 }}>▸</span>
                  {inc}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 'auto' }}>
              <CTA href="#contact" primary={tier.featured} color={tier.featured ? T.paper : T.ink}>
                {tier.featured ? 'Start a project' : 'Enquire'}
              </CTA>
            </div>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────
function FAQ() {
  const qs = [
    { q: 'Are you actually one person?', a: 'Effectively, yes — CGE is me, Rob. I take a small number of concurrent engagements and run every part personally. For specialist work (design, copy, dev) I bring in trusted collaborators on a per-project basis. You\'ll always know exactly who you\'re working with.' },
    { q: 'How long are your engagements?', a: 'It depends on the service. An audit is 2–4 weeks. A full engine build is six months. A PPC programme typically runs twelve. A CRO sprint is 8–12 weeks. Fractional CGE work is ongoing. Pick the shape that fits the work, not the other way round.' },
    { q: 'What if it\'s not working?', a: 'Every engagement carries a no-fault out-clause at the first natural checkpoint — 30 days for sprints, 60 days for builds, 90 days for year-long programmes. Bad work billed in full is worse for both of us. I\'d rather you walk.' },
    { q: 'Who do you work best with?', a: 'Growth-stage businesses with real demand that needs building properly — ecommerce and local brands scaling up, founders formalising paid acquisition, and teams whose tracking and data can no longer be trusted. If you want senior, hands-on help instead of a big agency, that\'s the fit.' },
    { q: 'Where are you based, and which hours?', a: 'Cape Town, South Africa — GMT+2. I work flexibly across US and Asian hours and have run engagements across Europe, the Middle East and South Africa. Remote by default, on-site when it earns its travel.' },
    { q: 'Will you sign an NDA?', a: 'Happily. Send yours over. I keep client identities confidential by default and only feature work publicly with written permission.' },
    { q: 'How do you handle handover?', a: 'The handover is the deliverable. By the final fortnight of any build, your team will have written runbooks for every system, pair-programmed sessions on the live tooling, and a 60-day check-in scheduled. I don\'t walk away — I just stop charging.' },
  ];
  return (
    <SectionWrap id="faq" bg={T.paper}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
        <div>
          <SectionLabel>§ 10 — FAQ</SectionLabel>
          <h2 style={{
            fontFamily: T.display, fontWeight: 900, fontSize: 64, letterSpacing: '-.04em', lineHeight: .92,
            textTransform: 'uppercase', margin: '24px 0 24px',
          }}>
            Questions<br/>founders ask.
          </h2>
          <p style={{ fontFamily: T.body, fontSize: 15, lineHeight: 1.6, color: T.softInk, margin: 0 }}>
            If yours isn't here, the fastest answer is a 20-minute call. <a href="#contact" style={{ color: T.accent, textDecoration: 'underline' }}>Book one</a>.
          </p>
        </div>
        <div>
          {qs.map((q, i) => (
            <details key={q.q} style={{
              borderTop: `1px solid ${T.rule}`,
              borderBottom: i === qs.length - 1 ? `1px solid ${T.rule}` : 'none',
              padding: '22px 0',
            }}>
              <summary style={{
                cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24,
                fontFamily: T.display, fontWeight: 900, fontSize: 22, letterSpacing: '-.02em', textTransform: 'uppercase',
              }}>
                <span>{q.q}</span>
                <span style={{ color: T.accent, fontSize: 28, fontWeight: 400, fontFamily: T.serif }}>+</span>
              </summary>
              <p style={{ fontFamily: T.body, fontSize: 15, lineHeight: 1.65, color: T.softInk, margin: '14px 0 0', maxWidth: 720 }}>
                {q.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

// ─── BIG CTA ────────────────────────────────────────────────────────
function BigCTA() {
  return (
    <section id="contact" style={{ background: T.accent, color: T.paper, padding: '140px 80px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 60, alignItems: 'end' }}>
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.32em', textTransform: 'uppercase', color: T.paper, opacity: .85, marginBottom: 30 }}>
            Now booking · Two Q3 slots open
          </div>
          <h2 style={{
            fontFamily: T.display, fontWeight: 900, fontSize: 124, letterSpacing: '-.045em', lineHeight: .88,
            textTransform: 'uppercase', margin: 0, color: T.paper, textWrap: 'pretty',
          }}>
            Let's build the<br/>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}>
              <Bracket size={100} color={T.paper} weight={7} spaceRatio={.3} side="l" />
              <span>engine</span>
              <Bracket size={100} color={T.paper} weight={7} spaceRatio={.3} side="r" />
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}>
              together.<Arrow size={70} color={T.paper} stroke={7} />
            </span>
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 14 }}>
          <p style={{ fontFamily: T.body, fontSize: 17, lineHeight: 1.55, color: T.paper, margin: 0 }}>
            Tell me about the company, the team, and what's stuck. I'll reply within 24 hours with whether I'm the right fit — and if not, who is.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
            <a href="mailto:rob@chiefgrowthengineer.com" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              padding: '18px 22px', background: T.paper, color: T.accent,
              fontFamily: T.display, fontWeight: 900, fontSize: 16, letterSpacing: '.04em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>
              rob@chiefgrowthengineer.com
              <Arrow size={16} color={T.accent} stroke={3} />
            </a>
            <a href="tel:+27662127955" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              padding: '18px 22px', background: 'transparent', color: T.paper,
              border: `2px solid ${T.paper}`,
              fontFamily: T.display, fontWeight: 900, fontSize: 16, letterSpacing: '.04em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>
              +27 66 212 7955
              <Arrow size={16} color={T.paper} stroke={3} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: T.ink, color: T.paper, padding: '80px 80px 40px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 40, paddingBottom: 60, borderBottom: `1px solid rgba(255,255,255,.15)` }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: T.display, fontWeight: 900, fontSize: 22, letterSpacing: '-.03em', textTransform: 'uppercase',
            }}>
              Chief
              <Bracket size={22} color={T.accent} weight={3} spaceRatio={.3} side="l" />
              <span style={{ color: T.accent }}>Growth</span>
              <Bracket size={22} color={T.accent} weight={3} spaceRatio={.3} side="r" />
              Engineer
              <Arrow size={16} color={T.accent} stroke={2.8} />
            </div>
            <p style={{ fontFamily: T.body, fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,.7)', marginTop: 18, maxWidth: 360 }}>
              A founder-led growth studio. Run from Cape Town, working with clients worldwide.
            </p>
            <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, background: '#27c93f', borderRadius: '50%' }}/>
              <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', opacity: .7 }}>
                Booking Q3 · 2026
              </span>
            </div>
          </div>
          {[
            { h: 'Practice', items: ['Web Development', 'PPC & Paid', 'Tracking & Analytics', 'CRO', 'Marketing Automation'] },
            { h: 'Studio', items: ['About Rob', 'The method', 'Field notes', 'Engagement models', 'FAQ'] },
            { h: 'Contact', items: ['rob@chiefgrowthengineer.com', '+27 66 212 7955', 'Cape Town · GMT+2', 'LinkedIn · Rob Louw'] },
          ].map(col => (
            <div key={col.h}>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.32em', textTransform: 'uppercase', color: T.accent, marginBottom: 18 }}>
                {col.h}
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.items.map(i => (
                  <li key={i} style={{ fontFamily: T.body, fontSize: 13.5, color: 'rgba(255,255,255,.8)' }}>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 26, flexWrap: 'wrap', gap: 14 }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', opacity: .55 }}>
            © MMXXVI · CGE Group · All rights reserved.
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', opacity: .55, display: 'flex', gap: 20 }}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>chiefgrowthengineer.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Thinking, About, Pricing, FAQ, BigCTA, Footer });
