// helpers.jsx — small reusable bits shared across beats
// Loaded after animations.jsx; assumes React, Easing, interpolate, clamp on window.

const TOKENS = {
  paper:   '#FBF8F2',
  ink:     '#1A1916',
  ink2:    '#4A4740',
  ink3:    '#7E7B71',
  ink4:    '#B3AFA2',
  rule:    '#D8D3C2',
  ruleSt:  '#98927F',
  accent:  '#C2410C',
  serifD:  '"Tiempos Headline", "Tiempos Text Web", Georgia, serif',
  serif:   '"Tiempos Text Web", "Tiempos Text", Georgia, serif',
  mono:    '"IBM Plex Mono", ui-monospace, Menlo, monospace',
};

// ── Letter-by-letter reveal ───────────────────────────────────────────────
// Reveals characters across [start, start+duration] linearly. Block cursor optional.
function LetterReveal({ text, start = 0, duration = 1.2, style = {}, cursor = false }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - start) / duration, 0, 1);
  const eased = Easing.easeOutCubic(t);
  const n = Math.floor(eased * text.length);
  const shown = text.slice(0, n);
  const showCursor = cursor && localTime > start && t < 1.0;
  // Reserve full width via invisible ghost so layout doesn't shift
  return (
    <span style={{ position: 'relative', whiteSpace: 'pre', ...style }}>
      <span style={{ visibility: 'hidden' }}>{text}</span>
      <span style={{ position: 'absolute', left: 0, top: 0 }}>{shown}</span>
    </span>
  );
}

// ── Number count-up ──────────────────────────────────────────────────────
// Counts from `from` → `to` over [start, end] (sprite-local). Eased.
function CountUp({ from = 0, to = 100, start = 0, end = 1.4, decimals = 1, style = {} }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - start) / (end - start), 0, 1);
  const eased = Easing.easeOutCubic(t);
  const v = from + (to - from) * eased;
  return <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{v.toFixed(decimals)}</span>;
}

// ── Cross-fade helper for whole beat sprites ──────────────────────────────
// Use inside <Sprite>: returns opacity 0→1 at start, 1→0 at end, with given fade durs.
function useBeatOpacity(fadeIn = 0.45, fadeOut = 0.5) {
  const { localTime, duration } = useSprite();
  const exit = duration - fadeOut;
  if (localTime < fadeIn) return Easing.easeOutCubic(clamp(localTime / fadeIn, 0, 1));
  if (localTime > exit) return 1 - Easing.easeInCubic(clamp((localTime - exit) / fadeOut, 0, 1));
  return 1;
}

// ── Hairline rule ─────────────────────────────────────────────────────────
function Hairline({ x = 160, y = 100, w = 1600, color = TOKENS.rule, weight = 1, progress = 1 }) {
  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width: w * progress, height: weight,
      background: color,
    }} />
  );
}

// ── Persistent chrome — section label, step counter, baseline rules ───────
// Beats overlap by 0.4s so labels cross-fade.
function Chrome() {
  const time = useTime();

  // Section data per beat
  const sections = [
    { start: 0,  end: 4.4,  num: '01', name: 'Pre-registration' },
    { start: 4,  end: 8.4,  num: '02', name: 'Measurement' },
    { start: 8,  end: 12.4, num: '03', name: 'Signed run hash' },
    { start: 12, end: 16.4, num: '04', name: 'LLM-judge ensemble' },
    { start: 16, end: 20.4, num: '05', name: 'Anti-pattern guardrails' },
    { start: 20, end: 25.0, num: '06', name: 'Verdict' },
  ];

  // Find which section(s) are active for cross-fade
  const items = sections.map(s => {
    let op = 0;
    const fadeIn = 0.4, fadeOut = 0.4;
    if (time < s.start) op = 0;
    else if (time < s.start + fadeIn) op = (time - s.start) / fadeIn;
    else if (time < s.end - fadeOut) op = 1;
    else if (time < s.end) op = 1 - (time - (s.end - fadeOut)) / fadeOut;
    else op = 0;
    return { ...s, op };
  });

  return (
    <React.Fragment>
      {/* Top hairline rule */}
      <div style={{
        position: 'absolute',
        left: 160, top: 96,
        width: 1600, height: 1,
        background: TOKENS.rule,
      }} />

      {/* Bottom hairline rule */}
      <div style={{
        position: 'absolute',
        left: 160, top: 984,
        width: 1600, height: 1,
        background: TOKENS.rule,
      }} />

      {/* Top-left: publication wordmark, always on */}
      <div style={{
        position: 'absolute',
        left: 160, top: 56,
        fontFamily: TOKENS.serifD,
        fontSize: 22,
        fontWeight: 500,
        color: TOKENS.ink,
        letterSpacing: '-0.005em',
      }}>
        Silicon Logic
      </div>

      {/* Top-right: meta line */}
      <div style={{
        position: 'absolute',
        right: 160, top: 60,
        fontFamily: TOKENS.mono,
        fontSize: 12,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: TOKENS.ink3,
      }}>
        Benchmark methodology &nbsp;·&nbsp; v2.1
      </div>

      {/* Bottom-left: section number + name (cross-fade) */}
      <div style={{ position: 'absolute', left: 160, top: 1004, height: 32 }}>
        {items.map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: 0, top: 0,
            opacity: s.op,
            fontFamily: TOKENS.mono,
            fontSize: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: TOKENS.ink3,
            whiteSpace: 'nowrap',
          }}>
            <span style={{ color: TOKENS.ink }}>{s.num}</span>
            <span style={{ margin: '0 14px', color: TOKENS.ink4 }}>/</span>
            <span style={{ color: TOKENS.ink2 }}>06</span>
            <span style={{ margin: '0 18px', color: TOKENS.ink4 }}>·</span>
            <span style={{ color: TOKENS.ink2 }}>{s.name}</span>
          </div>
        ))}
      </div>

      {/* Bottom-right: 6-segment progress */}
      <div style={{
        position: 'absolute',
        right: 160, top: 1014,
        display: 'flex', gap: 8,
      }}>
        {sections.map((s, i) => {
          const segDur = 25 / 6;
          const segStart = i * segDur;
          const p = clamp((time - segStart) / segDur, 0, 1);
          return (
            <div key={i} style={{
              width: 28, height: 2,
              background: TOKENS.rule,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0,
                width: `${p * 100}%`, height: '100%',
                background: TOKENS.ink,
              }} />
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}

// ── Master fade-in at t=0 and fade-out at t≈24.7 for clean loop ──────────
function LoopFade() {
  const time = useTime();
  let op = 1;
  if (time < 0.3) op = time / 0.3;            // fade up from black-ish at loop seam
  else if (time > 24.7) op = (25 - time) / 0.3;
  op = clamp(op, 0, 1);
  if (op >= 0.999) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: TOKENS.paper,
      opacity: 1 - op,
      pointerEvents: 'none',
    }} />
  );
}

Object.assign(window, {
  TOKENS, LetterReveal, CountUp, useBeatOpacity, Hairline, Chrome, LoopFade,
});
