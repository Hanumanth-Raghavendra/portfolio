import SchoolGuy from './SchoolGuy.jsx';

// The wake-up scene: afternoon classroom, window light, and hackingPanda
// dozing at his desk (GSAP lifts his head and opens his eyes on cue).
export default function Classroom({ withGuy = true }) {
  return (
    <svg className="classroom-svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="800" height="500" fill="#fff1d6" />
      <rect y="430" width="800" height="70" fill="#e8c9a0" />
      {/* window + light */}
      <rect x="40" y="56" width="230" height="250" fill="#cde8f5" stroke="#b07a4c" strokeWidth="8" />
      <path d="M155 56 V306 M40 180 H270" stroke="#b07a4c" strokeWidth="6" />
      <ellipse cx="100" cy="120" rx="44" ry="12" fill="#ffffff" opacity="0.8" />
      <path d="M270 70 L610 500 L360 500 L270 300 Z" fill="#ffe2a8" opacity="0.5" />
      {/* chalkboard */}
      <rect x="520" y="56" width="250" height="150" fill="#2f4a3a" stroke="#8a5a33" strokeWidth="6" />
      <text x="540" y="104" fill="#edede0" opacity="0.85" fontFamily="ui-monospace, monospace" fontSize="17">while (awake) {'{'}</text>
      <text x="564" y="134" fill="#edede0" opacity="0.85" fontFamily="ui-monospace, monospace" fontSize="17">code();</text>
      <text x="540" y="164" fill="#edede0" opacity="0.85" fontFamily="ui-monospace, monospace" fontSize="17">{'}'}</text>
      {/* floor shadow + the guy at his desk */}
      <ellipse cx="440" cy="488" rx="190" ry="12" fill="#c9a57c" opacity="0.6" />
      <g className="cls-guy">
        {withGuy && <SchoolGuy mood="swap" x="288" y="70" width="289" height="421" />}
      </g>
    </svg>
  );
}
