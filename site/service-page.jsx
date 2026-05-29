// Service page template — takes a slug and renders the full service detail page.

function ServiceNav({ activeSlug }) {
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
        <NavLogo href="/" />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 22,
          fontFamily: T.body, fontSize: 12, fontWeight: 500, letterSpacing: '.04em', textTransform: 'uppercase',
        }}>
          {SERVICES.map(s => (
            <a key={s.slug} href={`/services/${s.slug}.html`} style={{
              color: T.ink, textDecoration: 'none',
              opacity: s.slug === activeSlug ? 1 : .55,
              borderBottom: s.slug === activeSlug ? `2px solid ${T.accent}` : '2px solid transparent',
              paddingBottom: 2,
            }}>
              {s.name.split(' ')[0].replace('&', '')}
            </a>
          ))}
        </div>
        <CTA href="/#contact">Book an intro</CTA>
      </div>
    </nav>
  );
}

function ServiceHero({ service, detail }) {
  return (
    <section style={{ padding: '70px 80px 90px', background: T.paper }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
          <a href="/#services" style={{
            fontFamily: T.mono, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase',
            color: T.softInk, textDecoration: 'none', opacity: .6,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            ← All services
          </a>
          <span style={{ opacity: .35 }}>·</span>
          <SectionLabel>{detail.eyebrow}</SectionLabel>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 60, alignItems: 'end' }}>
          <div>
            <h1 style={{
              fontFamily: T.display, fontWeight: 900, fontSize: 96, letterSpacing: '-.045em',
              lineHeight: .92, margin: 0, textTransform: 'uppercase', textWrap: 'pretty',
            }}>
              {detail.headline.map((line, i) => {
                const isAccent = i === detail.headline.length - 1;
                if (isAccent) {
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                      <Bracket size={76} color={T.accent} weight={6} spaceRatio={.3} side="l" />
                      <span style={{ color: T.accent }}>{line.replace('.', '')}</span>
                      <Bracket size={76} color={T.accent} weight={6} spaceRatio={.3} side="r" />
                      <Arrow size={56} color={T.accent} stroke={6} />
                    </div>
                  );
                }
                return <div key={i}>{line}</div>;
              })}
            </h1>
            <p style={{ fontFamily: T.body, fontSize: 18, lineHeight: 1.6, color: T.softInk, margin: '38px 0 0', maxWidth: 600 }}>
              {detail.intro}
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 36 }}>
              <CTA href="/#contact">Start a project</CTA>
              <CTA href="#process" primary={false}>How it works</CTA>
            </div>
          </div>

          {/* Engagement card */}
          <div style={{
            background: T.ink, color: T.paper, padding: 30, display: 'flex', flexDirection: 'column', gap: 18,
            borderTop: `4px solid ${T.accent}`,
          }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.32em', textTransform: 'uppercase', color: T.accent }}>
              The engagement
            </div>
            <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 52, letterSpacing: '-.04em', lineHeight: 1, color: T.paper }}>
              {detail.timeline.length}
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', opacity: .8 }}>
              {detail.timeline.shape}
            </div>
            <Rule color={T.paper} opacity={.18} style={{ margin: '4px 0' }}/>
            <p style={{ fontFamily: T.body, fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,.75)', margin: 0 }}>
              {detail.timeline.note}
            </p>
            <div style={{ marginTop: 8, padding: '10px 12px', background: 'rgba(214,40,40,.12)', border: `1px solid ${T.accent}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, background: T.accent, borderRadius: '50%' }}/>
              <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: T.accent }}>
                Booking Q3 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceDetail({ service }) {
  return (
    <SectionWrap bg={T.cream}>
      <SectionLabel>What's included</SectionLabel>
      <h2 style={{
        fontFamily: T.display, fontWeight: 900, fontSize: 64, letterSpacing: '-.04em', lineHeight: .94,
        textTransform: 'uppercase', margin: '24px 0 50px',
      }}>
        The work.
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
        {service.items.map(([k, v], i) => (
          <div key={k} style={{ background: T.paper, border: `1px solid ${T.rule}`, padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.22em', color: T.accent }}>
                №{String(i+1).padStart(2,'0')}
              </span>
            </div>
            <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 24, letterSpacing: '-.02em', textTransform: 'uppercase', lineHeight: 1.05 }}>
              {k}
            </div>
            <p style={{ fontFamily: T.body, fontSize: 14.5, lineHeight: 1.6, color: T.softInk, margin: 0 }}>
              {v}
            </p>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

function ServiceProcess({ detail }) {
  return (
    <SectionWrap id="process" bg={T.paper}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 50, gap: 40, flexWrap: 'wrap' }}>
        <div>
          <SectionLabel>The process</SectionLabel>
          <h2 style={{
            fontFamily: T.display, fontWeight: 900, fontSize: 64, letterSpacing: '-.04em', lineHeight: .94,
            textTransform: 'uppercase', margin: '24px 0 0',
          }}>
            How it's built.
          </h2>
        </div>
        <p style={{ fontFamily: T.body, fontSize: 15, lineHeight: 1.6, color: T.softInk, margin: 0, maxWidth: 380 }}>
          Same rhythm every engagement — clear phases, weekly demos, written deliverables. Nothing is "in review" forever.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
        {detail.process.map((p, i) => (
          <div key={p.n} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, paddingBottom: 12, borderBottom: `2px solid ${T.accent}` }}>
              <span style={{ fontFamily: T.display, fontWeight: 900, fontSize: 40, letterSpacing: '-.04em', color: T.accent, lineHeight: 1 }}>
                {p.n}
              </span>
              {i < detail.process.length - 1 && (
                <Arrow size={16} color={T.accent} stroke={3} style={{ marginLeft: 'auto', alignSelf: 'center' }}/>
              )}
            </div>
            <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 22, letterSpacing: '-.02em', textTransform: 'uppercase', lineHeight: 1 }}>
              {p.name}
            </div>
            <p style={{ fontFamily: T.body, fontSize: 14, lineHeight: 1.6, color: T.softInk, margin: 0 }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

function ServiceDeliverables({ detail }) {
  return (
    <SectionWrap bg={T.ink} fg={T.paper}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 70, alignItems: 'start' }}>
        <div>
          <SectionLabel color="#ff6a6a">Deliverables</SectionLabel>
          <h2 style={{
            fontFamily: T.display, fontWeight: 900, fontSize: 64, letterSpacing: '-.04em', lineHeight: .94,
            textTransform: 'uppercase', margin: '24px 0 0', color: T.paper,
          }}>
            What you<br/>walk away with.
          </h2>
          <div style={{ marginTop: 30, padding: 22, background: 'rgba(255,255,255,.05)', border: `1px solid rgba(255,255,255,.12)` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
              <Bracket size={20} color={T.accent} weight={2.5} spaceRatio={.4} side="l" />
              <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 36, letterSpacing: '-.03em', color: T.accent, lineHeight: 1 }}>
                {detail.stat.k}
              </div>
              <Bracket size={20} color={T.accent} weight={2.5} spaceRatio={.4} side="r" />
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', opacity: .75 }}>
              {detail.stat.label}
            </div>
          </div>
        </div>

        <div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {detail.deliverables.map((d, i) => (
              <li key={d} style={{
                display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 18, alignItems: 'baseline',
                padding: '20px 0',
                borderTop: i === 0 ? `1px solid rgba(255,255,255,.15)` : 'none',
                borderBottom: `1px solid rgba(255,255,255,.15)`,
              }}>
                <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.22em', color: T.accent }}>
                  ▸ {String(i+1).padStart(2,'0')}
                </span>
                <div style={{ fontFamily: T.body, fontSize: 16, lineHeight: 1.5 }}>{d}</div>
                <Arrow size={14} color={T.accent} stroke={2.5} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionWrap>
  );
}

function ServiceTools({ detail }) {
  return (
    <SectionWrap bg={T.warm}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 70, alignItems: 'center' }}>
        <div>
          <SectionLabel>Tools</SectionLabel>
          <h2 style={{
            fontFamily: T.display, fontWeight: 900, fontSize: 48, letterSpacing: '-.04em', lineHeight: .94,
            textTransform: 'uppercase', margin: '24px 0 0',
          }}>
            Tool-agnostic where possible. Opinionated where it matters.
          </h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {detail.tools.map(t => (
            <div key={t} style={{
              padding: '14px 20px', background: T.paper, border: `1px solid ${T.rule}`,
              fontFamily: T.display, fontWeight: 700, fontSize: 16, letterSpacing: '-.01em',
            }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

function ServiceFAQ({ detail }) {
  return (
    <SectionWrap bg={T.paper}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 70, alignItems: 'start' }}>
        <div>
          <SectionLabel>Common questions</SectionLabel>
          <h2 style={{
            fontFamily: T.display, fontWeight: 900, fontSize: 56, letterSpacing: '-.04em', lineHeight: .94,
            textTransform: 'uppercase', margin: '24px 0 24px',
          }}>
            Before you ask.
          </h2>
        </div>
        <div>
          {detail.faq.map((f, i) => (
            <details key={f.q} style={{
              borderTop: `1px solid ${T.rule}`,
              borderBottom: i === detail.faq.length - 1 ? `1px solid ${T.rule}` : 'none',
              padding: '22px 0',
            }}>
              <summary style={{
                cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24,
                fontFamily: T.display, fontWeight: 900, fontSize: 20, letterSpacing: '-.02em', textTransform: 'uppercase',
              }}>
                <span>{f.q}</span>
                <span style={{ color: T.accent, fontSize: 28, fontWeight: 400, fontFamily: T.serif }}>+</span>
              </summary>
              <p style={{ fontFamily: T.body, fontSize: 15, lineHeight: 1.65, color: T.softInk, margin: '14px 0 0', maxWidth: 720 }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

function ServiceRelated({ activeSlug }) {
  const others = SERVICES.filter(s => s.slug !== activeSlug).slice(0, 3);
  return (
    <SectionWrap bg={T.cream}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 30, gap: 20, flexWrap: 'wrap' }}>
        <h2 style={{
          fontFamily: T.display, fontWeight: 900, fontSize: 40, letterSpacing: '-.04em', lineHeight: .94,
          textTransform: 'uppercase', margin: 0,
        }}>
          Other services.
        </h2>
        <a href="/#services" style={{
          fontFamily: T.mono, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase',
          color: T.accent, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          See all seven <Arrow size={12} color={T.accent} stroke={2.5} />
        </a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {others.map(s => (
          <a key={s.slug} href={`/services/${s.slug}.html`} style={{
            background: T.paper, border: `1px solid ${T.rule}`, padding: 26, textDecoration: 'none', color: T.ink,
            display: 'flex', flexDirection: 'column', gap: 14, transition: 'border-color .15s, transform .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.rule; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.22em', color: T.accent }}>№{s.n}</span>
              <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', opacity: .55 }}>
                {s.dur}
              </span>
            </div>
            <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 22, letterSpacing: '-.02em', textTransform: 'uppercase', lineHeight: 1.05 }}>
              {s.name}
            </div>
            <p style={{ fontFamily: T.body, fontSize: 13, lineHeight: 1.5, color: T.softInk, margin: 0 }}>
              {s.pitch}
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontFamily: T.mono, fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: T.accent }}>
              Explore <Arrow size={11} color={T.accent} stroke={2.5} />
            </div>
          </a>
        ))}
      </div>
    </SectionWrap>
  );
}

function ServiceCTA({ detail }) {
  return (
    <section style={{ background: T.accent, color: T.paper, padding: '90px 80px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 60, alignItems: 'end' }}>
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.32em', textTransform: 'uppercase', color: T.paper, opacity: .85, marginBottom: 22 }}>
            Ready to ship?
          </div>
          <h2 style={{
            fontFamily: T.display, fontWeight: 900, fontSize: 72, letterSpacing: '-.045em', lineHeight: .9,
            textTransform: 'uppercase', margin: 0, color: T.paper,
          }}>
            Tell me about<br/>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
              <Bracket size={60} color={T.paper} weight={5} spaceRatio={.3} side="l" />
              <span>the work</span>
              <Bracket size={60} color={T.paper} weight={5} spaceRatio={.3} side="r" />
            </span>.
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a href="mailto:rob@chiefgrowthengineer.com" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            padding: '16px 22px', background: T.paper, color: T.accent,
            fontFamily: T.display, fontWeight: 900, fontSize: 15, letterSpacing: '.04em', textTransform: 'uppercase',
            textDecoration: 'none',
          }}>
            rob@chiefgrowthengineer.com
            <Arrow size={15} color={T.accent} stroke={3} />
          </a>
          <a href="tel:+27662127955" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            padding: '16px 22px', background: 'transparent', color: T.paper,
            border: `2px solid ${T.paper}`,
            fontFamily: T.display, fontWeight: 900, fontSize: 15, letterSpacing: '.04em', textTransform: 'uppercase',
            textDecoration: 'none',
          }}>
            +27 66 212 7955
            <Arrow size={15} color={T.paper} stroke={3} />
          </a>
        </div>
      </div>
    </section>
  );
}

function ServiceFooter() {
  return (
    <footer style={{ background: T.ink, color: T.paper, padding: '50px 80px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <NavLogo color={T.paper} />
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', opacity: .55, display: 'flex', gap: 24 }}>
          <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a>
          <a href="/#services" style={{ color: 'inherit', textDecoration: 'none' }}>All services</a>
          <a href="/#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
          <span>© MMXXVI · CGE Group</span>
        </div>
      </div>
    </footer>
  );
}

function ServicePage({ slug }) {
  const service = SERVICES.find(s => s.slug === slug);
  const detail = SERVICE_DETAILS[slug];
  if (!service || !detail) {
    return <div style={{ padding: 40 }}>Service not found: {slug}</div>;
  }
  return (
    <>
      <ServiceNav activeSlug={slug} />
      <ServiceHero service={service} detail={detail} />
      <ServiceDetail service={service} />
      <ServiceProcess detail={detail} />
      <ServiceDeliverables detail={detail} />
      <ServiceTools detail={detail} />
      <ServiceFAQ detail={detail} />
      <ServiceRelated activeSlug={slug} />
      <ServiceCTA detail={detail} />
      <ServiceFooter />
    </>
  );
}

Object.assign(window, { ServicePage });
