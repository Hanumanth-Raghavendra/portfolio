import { useMemo } from 'react';
import Classroom from '../art/Classroom.jsx';
import './fx.css';

// One fixed overlay holding every piece both transitions need.
// GSAP drives it; React only renders the pieces once.
export default function TransitionLayer({ fxRef, tier, onSkip, announce, withGuy }) {
  const set = (key) => (el) => {
    if (el) fxRef.current[key] = el;
  };
  const lineCount = tier === 'full' ? 28 : 12;
  const petalCount = tier === 'full' ? 18 : 7;

  const lines = useMemo(
    () =>
      Array.from({ length: lineCount }, (_, i) => ({
        left: `${(i * 41 + 7) % 100}%`,
        delay: `${-((i * 0.07) % 0.5)}s`,
        duration: `${0.32 + ((i * 7) % 5) * 0.04}s`,
        height: `${18 + ((i * 13) % 26)}vh`,
        width: i % 3 === 0 ? 3 : 1.5,
      })),
    [lineCount],
  );
  const petals = useMemo(
    () =>
      Array.from({ length: petalCount }, (_, i) => ({
        left: `${(i * 29 + 13) % 100}%`,
        delay: `${-((i * 0.13) % 0.9)}s`,
        duration: `${0.7 + ((i * 3) % 4) * 0.1}s`,
      })),
    [petalCount],
  );
  const rays = useMemo(() => Array.from({ length: 22 }, (_, i) => (i / 22) * Math.PI * 2), []);

  return (
    <div className="fx" ref={set('root')} onClick={onSkip} aria-hidden={announce ? undefined : true}>
      <p className="sr-only" aria-live="assertive">{announce}</p>

      <div className="fx-calm" ref={set('calm')} />
      <div className="fx-flash" ref={set('flash')} />

      <svg className="fx-burst" ref={set('burst')} viewBox="-500 -500 1000 1000" aria-hidden="true">
        {rays.map((a, i) => (
          <line
            key={i}
            x1={Math.cos(a) * 60}
            y1={Math.sin(a) * 60}
            x2={Math.cos(a) * 500}
            y2={Math.sin(a) * 500}
            stroke="#1a1033"
            strokeWidth={i % 2 ? 3 : 6}
            strokeLinecap="round"
          />
        ))}
      </svg>

      <div className="fx-portal" ref={set('portal')}>
        <span className="ring r1" />
        <span className="ring r2" />
        <span className="ring r3" />
        <span className="core" />
      </div>

      <div className="fx-fall" ref={set('fall')}>
        {lines.map((l, i) => (
          <span
            key={`l${i}`}
            className="fall-line"
            style={{ left: l.left, animationDelay: l.delay, animationDuration: l.duration, height: l.height, width: l.width }}
          />
        ))}
        {petals.map((p, i) => (
          <span key={`p${i}`} className="fall-petal" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration }} />
        ))}
      </div>

      <div className="fx-impact" ref={set('impact')}>
        <span className="impact-ring" />
        <span className="impact-word">DOOON</span>
      </div>

      <div className="fx-vhs" ref={set('vhs')}>
        <span className="vhs-bar" ref={set('vhsBar')} />
        <span className="vhs-label">◀◀ REW</span>
      </div>

      <div className="fx-classroom" ref={set('classroom')}>
        <Classroom withGuy={withGuy} />
        <span className="bubble" ref={set('bubble')}>…was that a dream?</span>
      </div>
    </div>
  );
}
