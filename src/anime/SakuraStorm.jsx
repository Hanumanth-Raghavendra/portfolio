import { useMemo } from 'react';

// The secret-code reward: a burst of sakura across the whole screen.
export default function SakuraStorm() {
  const petals = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        left: `${(i * 37 + 7) % 100}%`,
        delay: `${((i * 0.071) % 1.6).toFixed(2)}s`,
        duration: `${(2.2 + ((i * 13) % 10) / 6).toFixed(2)}s`,
        size: 8 + ((i * 5) % 9),
        sway: `${(i % 2 ? 1 : -1) * (60 + ((i * 17) % 120))}px`,
      })),
    [],
  );
  return (
    <div className="storm" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="storm-petal"
          style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, width: p.size, height: p.size * 0.62, '--sway': p.sway }}
        />
      ))}
      <div className="storm-banner">SECRET UNLOCKED</div>
    </div>
  );
}
