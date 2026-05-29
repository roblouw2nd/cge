// Site tokens + primitives — Signal palette + Manual motifs.

const T = {
  ink: '#0a0a0a',
  paper: '#ffffff',
  cream: '#f4f1e8',
  warm: '#efece3',
  accent: '#d62828',
  softInk: '#2a2620',
  neutral: '#e8e6df',
  rule: 'rgba(10,10,10,.12)',
  ruleSoft: 'rgba(10,10,10,.08)',
  display: "'Archivo', sans-serif",
  body: "'Archivo', sans-serif",
  mono: "'JetBrains Mono', monospace",
  serif: "'Instrument Serif', serif",
};

function Bracket({ size = 24, color = T.accent, weight = 3, spaceRatio = .32, side = 'l', style = {} }) {
  const inner = 24 - 24 * spaceRatio;
  const d = side === 'l'
    ? `M${inner} 3 L4 3 L4 21 L${inner} 21`
    : `M${24 - inner} 3 L20 3 L20 21 L${24 - inner} 21`;
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size, flexShrink: 0, verticalAlign: 'middle', ...style }}>
      <path d={d} fill="none" stroke={color} strokeWidth={weight} strokeLinejoin="miter" />
    </svg>
  );
}

function Arrow({ size = 24, color = T.accent, stroke = 3, style = {} }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size, flexShrink: 0, verticalAlign: 'middle', ...style }}>
      <path d="M5 19 L19 5 M19 5 L19 14 M19 5 L10 5" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

// ─── LOGO LOCKUPS ───────────────────────────────────────────────────
function NavLogo({ color = T.ink, href = '#top' }) {
  return (
    <a href={href} style={{
      textDecoration: 'none', color,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: T.display, fontWeight: 900, fontSize: 18, letterSpacing: '-.03em', textTransform: 'uppercase', lineHeight: 1,
    }}>
      Chief
      <Bracket size={20} color={T.accent} weight={2.8} spaceRatio={.3} side="l" />
      <span style={{ color: T.accent }}>Growth</span>
      <Bracket size={20} color={T.accent} weight={2.8} spaceRatio={.3} side="r" />
      Engineer
      <Arrow size={14} color={T.accent} stroke={2.5} />
    </a>
  );
}

function HeroLockup({ accentColor = T.accent, textColor = T.ink, growthSize = 96 }) {
  return (
    <h1 style={{
      fontFamily: T.display, fontWeight: 900, fontSize: growthSize, letterSpacing: '-.045em',
      lineHeight: .9, margin: 0, textTransform: 'uppercase', color: textColor, textWrap: 'pretty',
    }}>
      <div>Build the</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <Bracket size={growthSize * .85} color={accentColor} weight={6} spaceRatio={.3} side="l" />
        <span style={{ color: accentColor }}>growth</span>
        <Bracket size={growthSize * .85} color={accentColor} weight={6} spaceRatio={.3} side="r" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        engine.<Arrow size={growthSize * .65} color={accentColor} stroke={6} />
      </div>
    </h1>
  );
}

// ─── BUTTONS ────────────────────────────────────────────────────────
function CTA({ children, href = '#contact', primary = true, color }) {
  const bg = primary ? T.accent : 'transparent';
  const fg = primary ? T.paper : (color || T.ink);
  const border = primary ? 'none' : `1.5px solid ${color || T.ink}`;
  return (
    <a href={href} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '14px 22px',
      background: bg, color: fg, border,
      fontFamily: T.display, fontWeight: 900, fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase',
      textDecoration: 'none', whiteSpace: 'nowrap',
      transition: 'transform .12s ease, background .12s ease, color .12s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translate(0,0)'; }}
    >
      {children}
      <Arrow size={12} color={fg} stroke={2.5} />
    </a>
  );
}

// ─── SECTION CHROME ─────────────────────────────────────────────────
function SectionLabel({ children, color = T.accent, style = {} }) {
  return (
    <div style={{
      fontFamily: T.mono, fontSize: 12, letterSpacing: '.32em', textTransform: 'uppercase',
      color, display: 'inline-flex', alignItems: 'center', gap: 10, ...style,
    }}>
      <span style={{ width: 8, height: 8, background: color, display: 'inline-block' }}/>
      {children}
    </div>
  );
}

function SectionWrap({ children, bg = T.paper, fg = T.ink, id, style = {}, pad = '120px 80px' }) {
  return (
    <section id={id} style={{ background: bg, color: fg, padding: pad, ...style }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        {children}
      </div>
    </section>
  );
}

function Rule({ color = T.ink, opacity = .15, style = {} }) {
  return <div style={{ height: 1, background: color, opacity, ...style }}/>;
}

Object.assign(window, {
  T, Bracket, Arrow, NavLogo, HeroLockup, CTA, SectionLabel, SectionWrap, Rule,
});
