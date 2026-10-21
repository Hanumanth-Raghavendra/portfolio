import { useMemo } from 'react';

// Drifting sakura petals. Count scales with the device tier.
export default function Petals({ count = 14, className = '' }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 37 + 11) % 100}%`,
        delay: `${-((i * 1.7) % 9)}s`,
        duration: `${7 + ((i * 13) % 6)}s`,
        size: 7 + ((i * 5) % 7),
        sway: `${((i % 2 ? 1 : -1) * (40 + ((i * 17) % 60)))}px`,
      })),
    [count],
  );
  return (
    <div className={`petals ${className}`} aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size * 0.62,
            '--sway': p.sway,
          }}
        />
      ))}
    </div>
  );
}
