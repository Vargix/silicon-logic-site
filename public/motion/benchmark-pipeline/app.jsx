// app.jsx — root composition for the Silicon Logic benchmark pipeline motion graphic
// Loads after animations.jsx, helpers.jsx, scenes-a.jsx, scenes-b.jsx.

// Beat windows. Beats overlap their fade with adjacent beats to read as one piece.
// Each Beat component internally fades in/out (useBeatOpacity).
const BEATS = [
  { start: 0,    end: 4.4,  Comp: Beat1 },
  { start: 4.0,  end: 8.4,  Comp: Beat2 },
  { start: 8.0,  end: 12.4, Comp: Beat3 },
  { start: 12.0, end: 16.4, Comp: Beat4 },
  { start: 16.0, end: 20.4, Comp: Beat5 },
  { start: 20.0, end: 25.0, Comp: Beat6 },
];

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
      <Stage width={1920} height={1080} duration={25}
             background={TOKENS.paper}
             persistKey="sl-benchmark-v1"
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
