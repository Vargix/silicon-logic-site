// app.jsx — root composition for the Silicon Logic benchmark pipeline motion graphic
// Loads after animations.jsx, helpers.jsx, scenes-a.jsx, scenes-b.jsx.

// Beat windows. Beats overlap their fade with adjacent beats to read as one piece.
// Each Beat component internally fades in/out (useBeatOpacity).
const BEAT_COMPONENTS = [Beat1, Beat2, Beat3, Beat4, Beat5, Beat6];
const BEATS = window.MOTION_SECTIONS.map((section, index) => ({
  start: section.start,
  end: section.end,
  Comp: BEAT_COMPONENTS[index],
}));

// Live timestamp label updater for the inline motion root.
function TimestampLabel() {
  const time = useTime();
  React.useEffect(() => {
    const root = document.getElementById('motion-root');
    if (root) {
      const sec = Math.floor(time);
      root.setAttribute('data-screen-label', `t=${String(sec).padStart(2, '0')}s`);
    }
  }, [Math.floor(time)]);
  return null;
}

function App() {
  return (
    <div id="motion-root" data-screen-label="t=00s"
         style={{ position: 'absolute', inset: 0 }}>
      <Stage width={1920} height={1080} duration={window.MOTION_DURATION}
             background={TOKENS.paper}
             persistKey="sl-benchmark-v2"
             controls={false}
             loop={true}>
        <TimestampLabel />

        {BEATS.map((b, i) => (
          <Sprite key={i} start={b.start} end={b.end}>
            <b.Comp />
          </Sprite>
        ))}

        <Chrome />
        <LoopFade />
      </Stage>
    </div>
  );
}

const rootEl = document.getElementById('sl-motion-root') || document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<App />);
}
