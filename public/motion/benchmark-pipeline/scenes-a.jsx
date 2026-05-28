// scenes-a.jsx — Beats 1, 2, 3
// (Pre-registration, Measurement, Signed run hash)

// ─────────────────────────────────────────────────────────────────────────
// BEAT 1 — Pre-registration (0–4.4s)
// Document icon slides in from left; headline reveals letter-by-letter;
// commit SHA fades in beneath; small orange "locked" dot fades in.
// ─────────────────────────────────────────────────────────────────────────

function DocIcon({ slideIn = 0, lockAt = 3.2 }) {
  const { localTime } = useSprite();
  // slide in from x = -400 over [slideIn, slideIn+0.7]
  const slideT = clamp((localTime - slideIn) / 0.7, 0, 1);
  const tx = -400 + 400 * Easing.easeOutCubic(slideT);
  const op = Easing.easeOutCubic(slideT);

  // locked dot scale-in
  const lockT = clamp((localTime - lockAt) / 0.35, 0, 1);
  const lockScale = Easing.easeOutCubic(lockT);

  return (
    <div style={{
      position: 'absolute',
      left: 220, top: 360,
      transform: `translateX(${tx}px)`,
      opacity: op,
    }}>
      <svg width="240" height="300" viewBox="0 0 240 300" style={{ display: 'block' }}>
        {/* page body */}
        <path d="M 8 8 L 184 8 L 232 56 L 232 292 L 8 292 Z"
              fill="none" stroke={TOKENS.ink} strokeWidth="1.25" />
        {/* folded corner */}
        <path d="M 184 8 L 184 56 L 232 56"
              fill="none" stroke={TOKENS.ink} strokeWidth="1.25" />
        <path d="M 184 8 L 232 56" fill="none" stroke={TOKENS.ink} strokeWidth="1.25" opacity="0.35" />

        {/* "text" rules */}
        {[100, 124, 148, 172, 196, 220, 244].map((y, i) => (
          <line key={i}
                x1={28} y1={y}
                x2={i % 3 === 2 ? 156 : 212} y2={y}
                stroke={TOKENS.ink3} strokeWidth="1" opacity="0.55" />
        ))}

        {/* small heading bar */}
        <rect x="28" y="74" width="120" height="6" fill={TOKENS.ink} />

        {/* orange "locked" dot in top-right interior */}
        <g transform={`translate(208 32) scale(${lockScale})`} style={{ transformOrigin: 'center' }}>
          <circle r="7" fill={TOKENS.accent} />
        </g>
      </svg>
    </div>
  );
}

function Beat1() {
  const op = useBeatOpacity(0.4, 0.5);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <DocIcon slideIn={0.3} lockAt={3.2} />

      {/* Headline — letter by letter, large serif */}
      <div style={{
        position: 'absolute',
        left: 580, top: 412,
        fontFamily: TOKENS.serifD,
        fontSize: 92,
        fontWeight: 500,
        letterSpacing: '-0.018em',
        color: TOKENS.ink,
        lineHeight: 1.04,
      }}>
        <LetterReveal text="Pre-registered" start={0.9} duration={0.9} />
        <br />
        <LetterReveal text="methodology." start={1.7} duration={0.9} />
      </div>

      {/* Sub: commit hash */}
      <Sub1Beneath />

      {/* Tiny side caption */}
      <Caption1 />
    </div>
  );
}

function Sub1Beneath() {
  const { localTime } = useSprite();
  const t = clamp((localTime - 2.7) / 0.55, 0, 1);
  const op = Easing.easeOutCubic(t);
  const ty = (1 - op) * 8;
  return (
    <div style={{
      position: 'absolute',
      left: 580, top: 640,
      opacity: op,
      transform: `translateY(${ty}px)`,
      fontFamily: TOKENS.mono,
      fontSize: 22,
      color: TOKENS.ink2,
      letterSpacing: '0.02em',
    }}>
      <span style={{ color: TOKENS.ink3 }}>commit</span>
      &nbsp;&nbsp;
      <span style={{ color: TOKENS.ink }}>a3f9c1b8d2e4</span>
      <span style={{ color: TOKENS.ink4 }}>…</span>
      &nbsp;&nbsp;<span style={{ color: TOKENS.ink3 }}>·</span>&nbsp;&nbsp;
      <span style={{ color: TOKENS.ink2 }}>locked 2026-02-14 09:31Z</span>
    </div>
  );
}

function Caption1() {
  const { localTime } = useSprite();
  const t = clamp((localTime - 3.0) / 0.55, 0, 1);
  const op = Easing.easeOutCubic(t);
  return (
    <div style={{
      position: 'absolute',
      left: 580, top: 690,
      opacity: op,
      fontFamily: TOKENS.serif,
      fontStyle: 'italic',
      fontSize: 22,
      color: TOKENS.ink3,
      maxWidth: 740,
      lineHeight: 1.5,
    }}>
      Hypotheses, model versions, and decoding settings are committed
      to the public repository before any silicon is touched.
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BEAT 2 — Measurement (4–8.4s)
// SoC line-drawing with power meter; three animated counters settle.
// ─────────────────────────────────────────────────────────────────────────

function SoCSchematic({ start = 0 }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - start) / 0.9, 0, 1);
  const op = Easing.easeOutCubic(t);

  // Trace pulse on the power line
  const pulseT = clamp((localTime - 0.9) / 1.2, 0, 1);
  const pulseX = 360 + pulseT * 220;

  return (
    <div style={{
      position: 'absolute',
      left: 220, top: 380,
      opacity: op,
    }}>
      <svg width="620" height="420" viewBox="0 0 620 420">
        {/* SoC outer package */}
        <rect x="40" y="40" width="320" height="240" fill="none"
              stroke={TOKENS.ink} strokeWidth="1.25" />
        {/* die outline */}
        <rect x="74" y="74" width="252" height="172" fill="none"
              stroke={TOKENS.ink} strokeWidth="0.75" opacity="0.55" />

        {/* compute cluster grid — 4×2 cores */}
        {Array.from({ length: 8 }).map((_, i) => {
          const col = i % 4, row = Math.floor(i / 4);
          return (
            <rect key={i}
                  x={94 + col * 46} y={94 + row * 40}
                  width={36} height={30}
                  fill="none" stroke={TOKENS.ink2} strokeWidth="0.75" />
          );
        })}
        {/* NPU block */}
        <rect x="94" y="178" width="120" height="56" fill="none"
              stroke={TOKENS.ink2} strokeWidth="0.75" />
        <text x="154" y="212" fontFamily={TOKENS.mono} fontSize="10"
              fill={TOKENS.ink3} textAnchor="middle" letterSpacing="0.05em">NPU</text>

        {/* Memory block */}
        <rect x="226" y="178" width="100" height="56" fill="none"
              stroke={TOKENS.ink2} strokeWidth="0.75" />
        <text x="276" y="212" fontFamily={TOKENS.mono} fontSize="10"
              fill={TOKENS.ink3} textAnchor="middle" letterSpacing="0.05em">UMA</text>

        {/* Pin marks (bottom edge) */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i}
                x1={64 + i * 22} y1={280}
                x2={64 + i * 22} y2={290}
                stroke={TOKENS.ink2} strokeWidth="0.75" />
        ))}

        {/* Caption */}
        <text x="200" y="316" fontFamily={TOKENS.mono} fontSize="11"
              fill={TOKENS.ink2} textAnchor="middle" letterSpacing="0.08em">
          SoC — APPLE SILICON M-SERIES
        </text>

        {/* Power line to meter */}
        <line x1="360" y1="160" x2="500" y2="160"
              stroke={TOKENS.ink} strokeWidth="1" />
        {/* Drop to meter */}
        <line x1="500" y1="160" x2="500" y2="210"
              stroke={TOKENS.ink} strokeWidth="1" />

        {/* Travelling pulse */}
        {pulseT > 0 && pulseT < 1 && (
          <circle cx={Math.min(pulseX, 500)} cy="160" r="3"
                  fill={TOKENS.accent} opacity={Math.sin(pulseT * Math.PI)} />
        )}

        {/* Power meter — gauge */}
        <circle cx="500" cy="260" r="46" fill="none"
                stroke={TOKENS.ink} strokeWidth="1.25" />
        <circle cx="500" cy="260" r="36" fill="none"
                stroke={TOKENS.ink3} strokeWidth="0.75" opacity="0.6" />
        {/* tick marks */}
        {Array.from({ length: 9 }).map((_, i) => {
          const a = (-Math.PI * 1.2) + i * (Math.PI * 1.4 / 8);
          const x1 = 500 + Math.cos(a) * 32;
          const y1 = 260 + Math.sin(a) * 32;
          const x2 = 500 + Math.cos(a) * 38;
          const y2 = 260 + Math.sin(a) * 38;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                       stroke={TOKENS.ink2} strokeWidth="0.75" />;
        })}
        {/* needle — sweeps to ~0.65 of arc */}
        {(() => {
          const sweep = clamp((localTime - 1.2) / 1.4, 0, 1);
          const eased = Easing.easeOutCubic(sweep);
          const a = (-Math.PI * 1.2) + eased * 0.7 * (Math.PI * 1.4);
          const nx = 500 + Math.cos(a) * 30;
          const ny = 260 + Math.sin(a) * 30;
          return (
            <React.Fragment>
              <line x1="500" y1="260" x2={nx} y2={ny}
                    stroke={TOKENS.accent} strokeWidth="1.5" />
              <circle cx="500" cy="260" r="2.5" fill={TOKENS.ink} />
            </React.Fragment>
          );
        })()}
        <text x="500" y="332" fontFamily={TOKENS.mono} fontSize="10"
              fill={TOKENS.ink3} textAnchor="middle" letterSpacing="0.08em">
          POWER METER · TYPE-C PASS-THRU
        </text>
      </svg>
    </div>
  );
}

function Beat2() {
  const op = useBeatOpacity(0.45, 0.5);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      {/* Headline */}
      <div style={{
        position: 'absolute',
        left: 160, top: 200,
        fontFamily: TOKENS.serifD,
        fontSize: 84,
        fontWeight: 500,
        letterSpacing: '-0.018em',
        color: TOKENS.ink,
      }}>
        Direct measurement.
      </div>

      {/* Sub */}
      <Beat2Sub />

      <SoCSchematic start={0.1} />

      {/* Three counters on right side */}
      <Counters />
    </div>
  );
}

function Beat2Sub() {
  const { localTime } = useSprite();
  const op = Easing.easeOutCubic(clamp((localTime - 0.55) / 0.5, 0, 1));
  return (
    <div style={{
      position: 'absolute',
      left: 160, top: 310,
      opacity: op,
      fontFamily: TOKENS.serif,
      fontStyle: 'italic',
      fontSize: 24,
      color: TOKENS.ink2,
      maxWidth: 920,
      lineHeight: 1.45,
    }}>
      Throughput, energy, and quality recorded under a two-hour thermal soak —
      not synthesized, not vendor-reported.
    </div>
  );
}

function CounterRow({ label, value, unit, decimals, start, top, accent = false }) {
  const { localTime } = useSprite();
  const op = Easing.easeOutCubic(clamp((localTime - start) / 0.45, 0, 1));
  const ty = (1 - op) * 10;
  return (
    <div style={{
      position: 'absolute',
      right: 220, top,
      width: 480,
      opacity: op,
      transform: `translateY(${ty}px)`,
      textAlign: 'right',
    }}>
      <div style={{
        fontFamily: TOKENS.mono,
        fontSize: 12,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: TOKENS.ink3,
        marginBottom: 8,
      }}>{label}</div>
      <div style={{
        fontFamily: TOKENS.serifD,
        fontSize: 88,
        fontWeight: 400,
        letterSpacing: '-0.02em',
        color: accent ? TOKENS.ink : TOKENS.ink,
        lineHeight: 1.0,
        fontVariantNumeric: 'tabular-nums',
      }}>
        <CountUp from={0} to={value} start={start + 0.05} end={start + 1.3} decimals={decimals} />
        <span style={{
          fontFamily: TOKENS.mono,
          fontSize: 22,
          fontWeight: 400,
          color: TOKENS.ink3,
          marginLeft: 10,
          letterSpacing: '0.02em',
        }}>{unit}</span>
      </div>
    </div>
  );
}

function Counters() {
  return (
    <React.Fragment>
      <CounterRow label="Throughput"  value={47.3} unit="tok/s" decimals={1} start={1.2} top={380} />
      <CounterRow label="Sustained power" value={38.2} unit="W"  decimals={1} start={1.7} top={550} />
      <CounterRow label="Perplexity"  value={6.41} unit="ppl"   decimals={2} start={2.2} top={720} />
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BEAT 3 — Signed run hash (8–12.4s)
// Three hairline manifest blocks; checkmarks fade in sequentially.
// ─────────────────────────────────────────────────────────────────────────

function ManifestBlock({ label, hash, start, x }) {
  const { localTime } = useSprite();
  // Block enters with slide-up
  const enterT = clamp((localTime - start) / 0.6, 0, 1);
  const op = Easing.easeOutCubic(enterT);
  const ty = (1 - op) * 14;

  // Hash typing reveal
  const hashStart = start + 0.35;
  const hashEnd = hashStart + 0.7;

  // Checkmark
  const checkT = clamp((localTime - (start + 1.1)) / 0.45, 0, 1);
  const checkOp = Easing.easeOutCubic(checkT);
  const checkScale = checkT;

  return (
    <div style={{
      position: 'absolute',
      left: x, top: 460,
      width: 480, height: 320,
      opacity: op,
      transform: `translateY(${ty}px)`,
      border: `1px solid ${TOKENS.rule}`,
      background: 'transparent',
      padding: '28px 32px',
      boxSizing: 'border-box',
    }}>
      {/* Top label */}
      <div style={{
        fontFamily: TOKENS.mono,
        fontSize: 12,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: TOKENS.ink3,
        marginBottom: 30,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>Manifest</span>
        <span>SHA-256</span>
      </div>

      {/* Hash (mono, broken into two lines like a print receipt) */}
      <div style={{
        fontFamily: TOKENS.mono,
        fontSize: 26,
        color: TOKENS.ink,
        letterSpacing: '0.01em',
        lineHeight: 1.4,
        marginBottom: 36,
      }}>
        <LetterReveal text={hash.slice(0, 16)} start={hashStart - start} duration={0.45} />
        <br />
        <LetterReveal text={hash.slice(16)}   start={hashStart - start + 0.25} duration={0.45} />
      </div>

      {/* hairline separator */}
      <div style={{
        position: 'absolute',
        left: 32, right: 32, top: 220,
        height: 1, background: TOKENS.rule,
      }} />

      {/* Bottom: label + checkmark */}
      <div style={{
        position: 'absolute',
        left: 32, right: 32, top: 246,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{
          fontFamily: TOKENS.serif,
          fontStyle: 'italic',
          fontSize: 22,
          color: TOKENS.ink2,
        }}>{label}</span>

        <div style={{
          width: 28, height: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: checkOp,
          transform: `scale(${0.6 + 0.4 * checkScale})`,
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="12.5" fill="none"
                    stroke={TOKENS.accent} strokeWidth="1.25" />
            <path d="M 9 14.5 L 12.5 18 L 19.5 10.5"
                  fill="none" stroke={TOKENS.accent}
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="14"
                  strokeDashoffset={14 * (1 - checkT)} />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Beat3() {
  const op = useBeatOpacity(0.45, 0.5);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <div style={{
        position: 'absolute',
        left: 160, top: 200,
        fontFamily: TOKENS.serifD,
        fontSize: 84,
        fontWeight: 500,
        letterSpacing: '-0.018em',
        color: TOKENS.ink,
      }}>
        Each artifact is signed.
      </div>

      <Beat3Sub />

      <ManifestBlock label="raw outputs"
                     hash="7d4e1b9a2c8f0e35d8c7b6a91f4e0d2c"
                     start={0.6} x={160} />
      <ManifestBlock label="configuration"
                     hash="b1f9c0d3a78e6219404abe55c0f9d11a"
                     start={0.9} x={720} />
      <ManifestBlock label="power telemetry"
                     hash="3a02e7f8c91d5b4708bce92a16d3f5e0"
                     start={1.2} x={1280} />
    </div>
  );
}

function Beat3Sub() {
  const { localTime } = useSprite();
  const op = Easing.easeOutCubic(clamp((localTime - 0.55) / 0.5, 0, 1));
  return (
    <div style={{
      position: 'absolute',
      left: 160, top: 310,
      opacity: op,
      fontFamily: TOKENS.serif,
      fontStyle: 'italic',
      fontSize: 24,
      color: TOKENS.ink2,
      maxWidth: 1100,
      lineHeight: 1.45,
    }}>
      Outputs, configuration, and power telemetry are hashed and committed
      to an append-only ledger before review begins.
    </div>
  );
}

Object.assign(window, { Beat1, Beat2, Beat3 });
