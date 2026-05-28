// scenes-b.jsx — Beats 4, 5, 6
// (LLM-judge ensemble, Anti-pattern guardrails, Verdict)

// ─────────────────────────────────────────────────────────────────────────
// BEAT 4 — LLM-judge ensemble (12–16.4s)
// Three judge nodes; thin lines connect to a central "Review" node;
// consensus indicator fills.
// ─────────────────────────────────────────────────────────────────────────

const JUDGES = [
  { name: 'Claude Opus', x: 540,  y: 510, app: 0.35 },
  { name: 'GPT-5',       x: 960,  y: 510, app: 0.55 },
  { name: 'Gemini Pro',  x: 1380, y: 510, app: 0.75 },
];
const REVIEW = { x: 960, y: 820, r: 90 };

function JudgeNode({ x, y, name, appearAt }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - appearAt) / 0.5, 0, 1);
  const eased = Easing.easeOutCubic(t);
  const op = eased;
  const scale = 0.7 + 0.3 * eased;
  const r = 54;
  return (
    <div style={{
      position: 'absolute',
      left: x - r, top: y - r,
      width: r * 2, height: r * 2,
      opacity: op,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
    }}>
      <svg width={r * 2} height={r * 2} viewBox={`0 0 ${r * 2} ${r * 2}`}>
        <circle cx={r} cy={r} r={r - 1} fill={TOKENS.paper}
                stroke={TOKENS.ink} strokeWidth="1.25" />
        {/* tiny inner dot — visual weight */}
        <circle cx={r} cy={r} r={3} fill={TOKENS.ink} />
      </svg>
      {/* Label below */}
      <div style={{
        position: 'absolute',
        left: '50%', top: r * 2 + 14,
        transform: 'translateX(-50%)',
        fontFamily: TOKENS.serif,
        fontSize: 22,
        color: TOKENS.ink,
        whiteSpace: 'nowrap',
      }}>{name}</div>
      <div style={{
        position: 'absolute',
        left: '50%', top: r * 2 + 46,
        transform: 'translateX(-50%)',
        fontFamily: TOKENS.mono,
        fontSize: 11,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: TOKENS.ink3,
        whiteSpace: 'nowrap',
      }}>Judge</div>
    </div>
  );
}

function ConnectorLine({ from, to, start, color = TOKENS.ink2 }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - start) / 0.7, 0, 1);
  const p = Easing.easeInOutCubic(t);
  // path total length
  const dx = to.x - from.x, dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  // we trim the endpoints by the node radii (54 judges, 90 review)
  const trimFrom = 56, trimTo = 92;
  const ux = dx / len, uy = dy / len;
  const sx = from.x + ux * trimFrom;
  const sy = from.y + uy * trimFrom;
  const ex = to.x - ux * trimTo;
  const ey = to.y - uy * trimTo;
  const lineLen = Math.sqrt((ex - sx) ** 2 + (ey - sy) ** 2);
  return (
    <line x1={sx} y1={sy} x2={ex} y2={ey}
          stroke={color} strokeWidth="1"
          strokeDasharray={lineLen}
          strokeDashoffset={lineLen * (1 - p)} />
  );
}

function ReviewNode({ appearAt = 1.3, consensusAt = 2.6 }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - appearAt) / 0.5, 0, 1);
  const op = Easing.easeOutCubic(t);
  const scale = 0.7 + 0.3 * Easing.easeOutCubic(t);
  const r = REVIEW.r;

  // consensus arc fills around the review node
  const cT = clamp((localTime - consensusAt) / 1.0, 0, 1);
  const cP = Easing.easeInOutCubic(cT);
  const circumference = 2 * Math.PI * (r - 8);

  return (
    <div style={{
      position: 'absolute',
      left: REVIEW.x - r, top: REVIEW.y - r,
      width: r * 2, height: r * 2,
      opacity: op,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
    }}>
      <svg width={r * 2} height={r * 2} viewBox={`0 0 ${r * 2} ${r * 2}`}>
        <circle cx={r} cy={r} r={r - 1} fill={TOKENS.paper}
                stroke={TOKENS.ink} strokeWidth="1.5" />
        {/* consensus ring — orange */}
        <circle cx={r} cy={r} r={r - 8}
                fill="none"
                stroke={TOKENS.accent} strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - cP)}
                transform={`rotate(-90 ${r} ${r})`}
                strokeLinecap="round" />
        {/* center inner mark */}
        <circle cx={r} cy={r} r={4} fill={TOKENS.ink} />
      </svg>
      {/* Center label */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '50%',
        transform: 'translate(-50%, calc(-50% + 22px))',
        fontFamily: TOKENS.serifD,
        fontSize: 28,
        fontWeight: 500,
        color: TOKENS.ink,
        letterSpacing: '-0.01em',
      }}>Review</div>
      {/* Label beneath */}
      <div style={{
        position: 'absolute',
        left: '50%', top: r * 2 + 14,
        transform: 'translateX(-50%)',
        fontFamily: TOKENS.mono,
        fontSize: 11,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: TOKENS.ink3,
        whiteSpace: 'nowrap',
        opacity: cP,
      }}>Consensus &nbsp;·&nbsp; <span style={{ color: TOKENS.accent }}>3 / 3 agree</span></div>
    </div>
  );
}

function Beat4() {
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
        Judged by ensemble.
      </div>

      <Beat4Sub />

      {/* Lines drawn beneath nodes */}
      <svg width="1920" height="1080"
           style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
        <ConnectorLine from={JUDGES[0]} to={REVIEW} start={1.7} />
        <ConnectorLine from={JUDGES[1]} to={REVIEW} start={2.0} />
        <ConnectorLine from={JUDGES[2]} to={REVIEW} start={2.3} />
      </svg>

      {JUDGES.map(j => (
        <JudgeNode key={j.name} x={j.x} y={j.y} name={j.name} appearAt={j.app} />
      ))}
      <ReviewNode appearAt={1.3} consensusAt={2.8} />
    </div>
  );
}

function Beat4Sub() {
  const { localTime } = useSprite();
  const op = Easing.easeOutCubic(clamp((localTime - 0.1) / 0.5, 0, 1));
  return (
    <div style={{
      position: 'absolute',
      left: 160, top: 310,
      opacity: op,
      fontFamily: TOKENS.serif,
      fontStyle: 'italic',
      fontSize: 24,
      color: TOKENS.ink2,
      maxWidth: 1080,
      lineHeight: 1.45,
    }}>
      Three independent frontier models score the signed outputs blind.
      Disagreements are surfaced, not averaged away.
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BEAT 5 — Anti-pattern guardrails (16–20.4s)
// Three lines fade in; each gets struck through in orange.
// ─────────────────────────────────────────────────────────────────────────

const GUARDRAILS = [
  'decode-only headlines',
  'vendor-blog citation',
  'random-token padding',
];

function GuardrailLine({ text, appearAt, top }) {
  const { localTime } = useSprite();
  // text fade in
  const inT = clamp((localTime - appearAt) / 0.45, 0, 1);
  const op = Easing.easeOutCubic(inT);
  const ty = (1 - op) * 8;

  // strike-through draw
  const strikeT = clamp((localTime - (appearAt + 0.55)) / 0.6, 0, 1);
  const strikeP = Easing.easeInOutCubic(strikeT);

  // refused tag fade in after strike
  const tagT = clamp((localTime - (appearAt + 1.0)) / 0.4, 0, 1);
  const tagOp = Easing.easeOutCubic(tagT);

  return (
    <div style={{
      position: 'absolute',
      left: 160, top,
      opacity: op,
      transform: `translateY(${ty}px)`,
      display: 'flex', alignItems: 'baseline',
      gap: 28,
    }}>
      {/* prefix "no" in italic */}
      <span style={{
        fontFamily: TOKENS.serif,
        fontStyle: 'italic',
        fontSize: 56,
        color: TOKENS.ink3,
        fontWeight: 400,
      }}>no</span>

      {/* the antipattern phrase, with overlayed strike-through */}
      <span style={{
        position: 'relative',
        fontFamily: TOKENS.serifD,
        fontSize: 64,
        fontWeight: 400,
        color: TOKENS.ink,
        letterSpacing: '-0.012em',
        lineHeight: 1.0,
      }}>
        {text}
        {/* strike */}
        <span style={{
          position: 'absolute',
          left: 0, top: '52%',
          width: `${strikeP * 100}%`,
          height: 2.5,
          background: TOKENS.accent,
          transformOrigin: 'left center',
        }} />
      </span>

      {/* "refused" tag */}
      <span style={{
        fontFamily: TOKENS.mono,
        fontSize: 12,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: TOKENS.accent,
        opacity: tagOp,
        border: `1px solid ${TOKENS.accent}`,
        padding: '4px 10px',
        marginLeft: 4,
        position: 'relative',
        top: -16,
      }}>Refused</span>
    </div>
  );
}

function Beat5() {
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
        Practices we refuse.
      </div>

      <Beat5Sub />

      <GuardrailLine text={GUARDRAILS[0]} appearAt={0.55} top={460} />
      <GuardrailLine text={GUARDRAILS[1]} appearAt={1.30} top={600} />
      <GuardrailLine text={GUARDRAILS[2]} appearAt={2.05} top={740} />
    </div>
  );
}

function Beat5Sub() {
  const { localTime } = useSprite();
  const op = Easing.easeOutCubic(clamp((localTime - 0.1) / 0.5, 0, 1));
  return (
    <div style={{
      position: 'absolute',
      left: 160, top: 310,
      opacity: op,
      fontFamily: TOKENS.serif,
      fontStyle: 'italic',
      fontSize: 24,
      color: TOKENS.ink2,
      maxWidth: 1080,
      lineHeight: 1.45,
    }}>
      Three habits that make benchmark numbers look good
      and make benchmark articles look bad.
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BEAT 6 — Verdict (20–25s)
// Single card center: "Silicon Logic" wordmark + "Auditable, not anecdotal."
// Holds for 2 seconds at the end. Fades on loop seam.
// ─────────────────────────────────────────────────────────────────────────

function Beat6() {
  const op = useBeatOpacity(0.7, 0.6);
  const { localTime } = useSprite();

  // Hairlines above & below: draw from center outward
  const ruleT = clamp((localTime - 0.5) / 0.9, 0, 1);
  const ruleP = Easing.easeOutCubic(ruleT);

  // Wordmark: fade up
  const wordT = clamp((localTime - 0.9) / 0.7, 0, 1);
  const wordOp = Easing.easeOutCubic(wordT);
  const wordTy = (1 - wordOp) * 12;

  // Tagline reveal
  const tagT = clamp((localTime - 1.7) / 0.7, 0, 1);
  const tagOp = Easing.easeOutCubic(tagT);

  // seal mark fade
  const sealT = clamp((localTime - 2.4) / 0.6, 0, 1);
  const sealOp = Easing.easeOutCubic(sealT);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      {/* Decorative top hairline */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 380,
        transform: 'translateX(-50%)',
        width: 720 * ruleP, height: 1,
        background: TOKENS.rule,
      }} />
      {/* Decorative bottom hairline */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 720,
        transform: 'translateX(-50%)',
        width: 720 * ruleP, height: 1,
        background: TOKENS.rule,
      }} />

      {/* Wordmark — large serif, centered */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 460,
        transform: `translate(-50%, ${wordTy}px)`,
        opacity: wordOp,
        fontFamily: TOKENS.serifD,
        fontSize: 132,
        fontWeight: 500,
        color: TOKENS.ink,
        letterSpacing: '-0.022em',
        lineHeight: 1.0,
        whiteSpace: 'nowrap',
      }}>
        Silicon Logic
      </div>

      {/* Tagline — italic, smaller */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 632,
        transform: 'translateX(-50%)',
        opacity: tagOp,
        fontFamily: TOKENS.serif,
        fontStyle: 'italic',
        fontSize: 36,
        color: TOKENS.ink2,
        letterSpacing: '-0.005em',
        whiteSpace: 'nowrap',
      }}>
        Auditable, not anecdotal.
      </div>

      {/* Small seal mark — accent, below tagline */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 800,
        transform: 'translateX(-50%)',
        opacity: sealOp,
      }}>
        <svg width="36" height="36" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="29" fill="none" stroke={TOKENS.accent} strokeWidth="1.5" />
          <circle cx="32" cy="32" r="23" fill="none" stroke={TOKENS.accent} strokeWidth="0.75" opacity="0.55" />
          <circle cx="32" cy="32" r="3.25" fill={TOKENS.accent} />
          <g stroke={TOKENS.accent} strokeWidth="0.85" opacity="0.7">
            <line x1="32" y1="6" x2="32" y2="10" />
            <line x1="32" y1="54" x2="32" y2="58" />
            <line x1="6" y1="32" x2="10" y2="32" />
            <line x1="54" y1="32" x2="58" y2="32" />
          </g>
        </svg>
      </div>
    </div>
  );
}

Object.assign(window, { Beat4, Beat5, Beat6 });
