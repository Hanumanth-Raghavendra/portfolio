// Anime-style Hyderabad: layered sky, sun or moon, clouds, a distant skyline and
// the Charminar in silhouette. The look follows the visitor's local time:
// sunrise · day · golden hour · night (stars, a moon, lit arches and windows).
const FAR = [
  [20, 488, 60, 112], [90, 470, 46, 130], [146, 500, 70, 100], [230, 456, 40, 144], [280, 492, 64, 108],
  [360, 476, 50, 124], [420, 506, 44, 94], [760, 498, 52, 102], [822, 466, 44, 134], [878, 494, 70, 106],
  [960, 470, 40, 130], [1010, 500, 64, 100], [1086, 480, 50, 120], [1146, 496, 54, 104],
];
const NEAR = [
  [0, 530, 90, 70], [84, 512, 54, 88], [140, 540, 80, 60], [214, 520, 46, 80], [264, 548, 90, 52],
  [350, 528, 60, 72], [416, 552, 66, 48], [736, 548, 70, 52], [800, 524, 56, 76], [860, 544, 84, 56],
  [940, 516, 50, 84], [996, 538, 76, 62], [1068, 520, 60, 80], [1130, 542, 70, 58],
];
const WINDOWS = [
  [102, 530], [116, 548], [228, 536], [236, 560], [364, 546], [818, 540], [830, 560], [954, 534], [962, 556], [1082, 540], [1096, 566],
];
const NIGHT_WINDOWS = [
  [20, 548], [44, 560], [92, 520], [150, 552], [176, 566], [270, 560], [300, 572], [380, 540], [430, 566],
  [748, 560], [770, 572], [806, 534], [872, 556], [900, 568], [948, 524], [1004, 550], [1030, 566], [1074, 530], [1140, 554], [1166, 566],
];
// deterministic "random" stars
const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 173 + 37) % 1200,
  y: (i * 97 + 11) % 330,
  r: i % 7 === 0 ? 1.8 : i % 3 === 0 ? 1.2 : 0.8,
  d: `${-((i * 0.37) % 4).toFixed(2)}s`,
}));

const PALETTES = {
  dawn: {
    sky: ['#283768', '#6e5fa8', '#d98aa0', '#f7b38a', '#ffe2b0'],
    sun: { x: 300, y: 470, r: 56, fill: '#ffd9a8', glow: '#ffc48a' },
    cloud: '#f8c3c8', cloudOp: 0.6, cloudHi: '#ffe9d6',
    far: '#86628f', farOp: 0.6, mon: '#3b2350', arch: '#f0a98a', archTop: '#c98aa8', near: '#2c1a44',
    win: '#ffd8a0', winOp: 0.7,
  },
  day: {
    sky: ['#3d8fd6', '#5fb0e8', '#9bd3f2', '#cdeefc', '#f6f1dc'],
    sun: { x: 420, y: 118, r: 46, fill: '#fffbe8', glow: '#fff5c8' },
    cloud: '#ffffff', cloudOp: 0.9, cloudHi: '#ffffff',
    far: '#7ea3c4', farOp: 0.65, mon: '#4a5c80', arch: '#f2dcae', archTop: '#9db3cf', near: '#33445f',
    win: '#cfe3f5', winOp: 0.25,
  },
  golden: {
    sky: ['#2e2266', '#6b4fb3', '#c9739b', '#f2a66b', '#ffd39a'],
    sun: { x: 850, y: 440, r: 62, fill: '#ffe7b0', glow: '#ffe7b0' },
    cloud: '#f6b4c9', cloudOp: 0.55, cloudHi: '#ffe0c2',
    far: '#8a4f86', farOp: 0.6, mon: '#3a1d52', arch: '#e9927c', archTop: '#c9739b', near: '#2a1640',
    win: '#ffd39a', winOp: 0.9,
  },
  night: {
    sky: ['#05081c', '#0d1238', '#1b1d55', '#2c2466', '#3b2a6b'],
    moon: { x: 430, y: 110, r: 34 },
    cloud: '#2a2a60', cloudOp: 0.5, cloudHi: '#3a3a7a',
    far: '#211b4a', farOp: 0.9, mon: '#0f0b26', arch: '#ffb85c', archTop: '#ffcf7a', near: '#0b0820',
    win: '#ffd38a', winOp: 1, stars: true,
  },
};

export function phaseFor(hour) {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 16) return 'day';
  if (hour >= 16 && hour < 19) return 'golden';
  return 'night';
}

export function phaseLabel(phase, hour) {
  if (phase === 'dawn') return 'sunrise';
  if (phase === 'day') return hour < 12 ? 'morning' : 'afternoon';
  if (phase === 'golden') return 'golden hour';
  return 'night';
}

export default function Skyline({ phase = 'golden', className = '' }) {
  const p = PALETTES[phase] || PALETTES.golden;
  const id = `sky-${phase}`;
  return (
    <svg className={`skyline sky-${phase} ${className}`} viewBox="0 0 1200 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {p.sky.map((c, i) => (
            <stop key={c} offset={[0, 0.36, 0.62, 0.82, 1][i]} stopColor={c} />
          ))}
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={p.sun?.glow || '#cfd8ff'} stopOpacity={p.moon ? 0.35 : 0.9} />
          <stop offset="1" stopColor={p.sun?.glow || '#cfd8ff'} stopOpacity="0" />
        </radialGradient>
        {p.moon && (
          <mask id={`${id}-crescent`}>
            <rect width="1200" height="600" fill="#fff" />
            <circle cx={p.moon.x + 15} cy={p.moon.y - 9} r={p.moon.r * 0.9} fill="#000" />
          </mask>
        )}
        <radialGradient id={`${id}-arch`} cx="0.5" cy="0.6" r="0.6">
          <stop offset="0" stopColor="#ffcf7a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffcf7a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="600" fill={`url(#${id})`} />

      {p.stars && (
        <g className="stars" fill="#f3f0ff">
          {STARS.map((s) => (
            <circle key={`${s.x}-${s.y}`} cx={s.x} cy={s.y} r={s.r} style={{ animationDelay: s.d }} />
          ))}
        </g>
      )}

      {p.sun && (
        <>
          <circle cx={p.sun.x} cy={p.sun.y} r={p.sun.r * 2.7} fill={`url(#${id}-glow)`} />
          <circle cx={p.sun.x} cy={p.sun.y} r={p.sun.r} fill={p.sun.fill} />
        </>
      )}
      {p.moon && (
        <g className="moon">
          <circle cx={p.moon.x} cy={p.moon.y} r={p.moon.r * 3.2} fill={`url(#${id}-glow)`} />
          <circle cx={p.moon.x} cy={p.moon.y} r={p.moon.r} fill="#f4f1ff" mask={`url(#${id}-crescent)`} />
        </g>
      )}

      {/* clouds */}
      <g fill={p.cloud} opacity={p.cloudOp} className="sky-clouds">
        <ellipse cx="240" cy="170" rx="96" ry="20" />
        <ellipse cx="196" cy="182" rx="56" ry="15" />
        <ellipse cx="300" cy="178" rx="62" ry="16" />
        <ellipse cx="930" cy="120" rx="120" ry="18" />
        <ellipse cx="1010" cy="132" rx="70" ry="14" />
        <ellipse cx="640" cy="236" rx="80" ry="12" />
      </g>
      <g fill={p.cloudHi} opacity="0.6">
        <ellipse cx="236" cy="184" rx="70" ry="5" />
        <ellipse cx="930" cy="132" rx="90" ry="4" />
      </g>

      {/* far skyline */}
      <g fill={p.far} opacity={p.farOp}>
        {FAR.map(([x, y, w, h]) => <rect key={`f${x}`} x={x} y={y} width={w} height={h} />)}
      </g>

      {/* Charminar */}
      {p.stars && <ellipse cx="600" cy="470" rx="190" ry="150" fill={`url(#${id}-arch)`} />}
      <g fill={p.mon}>
        <rect x="480" y="560" width="240" height="40" />
        <rect x="512" y="448" width="176" height="114" />
        <rect x="518" y="418" width="164" height="32" />
        <rect x="512" y="410" width="176" height="9" />
        <ellipse cx="600" cy="404" rx="24" ry="15" />
        <rect x="598" y="372" width="4" height="22" />
        {[507, 693].map((cx) => (
          <g key={cx}>
            <rect x={cx - 11} y="296" width="22" height="266" />
            <rect x={cx - 17} y="372" width="34" height="9" />
            <rect x={cx - 17} y="326" width="34" height="8" />
            <rect x={cx - 15} y="410" width="30" height="7" />
            <path d={`M${cx - 12} 298 Q${cx} 262 ${cx + 12} 298 Z`} />
            <rect x={cx - 1.5} y="246" width="3" height="22" />
            <circle cx={cx} cy="258" r="4" />
          </g>
        ))}
      </g>
      {/* light through the arches */}
      <path d="M562 562 L562 506 Q600 456 638 506 L638 562 Z" fill={p.arch} />
      <g fill={p.archTop} opacity="0.85">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${532 + i * 25} 446 L${532 + i * 25} 432 Q${539 + i * 25} 422 ${546 + i * 25} 432 L${546 + i * 25} 446 Z`} />
        ))}
      </g>
      {p.stars && (
        <g fill="#ffcf7a">
          {[507, 693].map((cx) => <circle key={cx} cx={cx} cy="258" r="2.5" />)}
        </g>
      )}

      {/* near city */}
      <g fill={p.near}>
        {NEAR.map(([x, y, w, h]) => <rect key={`n${x}`} x={x} y={y} width={w} height={h} />)}
        <rect x="0" y="584" width="1200" height="16" />
        <circle cx="470" cy="560" r="26" />
        <circle cx="742" cy="562" r="24" />
        <rect x="1100" y="496" width="3" height="26" />
        <rect x="228" y="500" width="3" height="22" />
      </g>
      <g fill={p.win} opacity={p.winOp} className={p.stars ? 'windows-lit' : undefined}>
        {WINDOWS.map(([x, y]) => <rect key={`w${x}${y}`} x={x} y={y} width="6" height="8" />)}
        {p.stars && NIGHT_WINDOWS.map(([x, y]) => <rect key={`nw${x}${y}`} x={x} y={y} width="6" height="8" />)}
      </g>
      {p.stars && (
        <g fill="#ff5a5a">
          <circle cx="1101.5" cy="494" r="2.2" className="beacon" />
          <circle cx="229.5" cy="498" r="2" className="beacon" />
        </g>
      )}
    </svg>
  );
}
