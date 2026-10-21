// Anime-style Hyderabad at golden hour: layered sky, sun, clouds,
// a distant skyline and the Charminar in silhouette.
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

export default function Skyline({ className = '' }) {
  return (
    <svg className={`skyline ${className}`} viewBox="0 0 1200 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2e2266" />
          <stop offset="0.36" stopColor="#6b4fb3" />
          <stop offset="0.62" stopColor="#c9739b" />
          <stop offset="0.82" stopColor="#f2a66b" />
          <stop offset="1" stopColor="#ffd39a" />
        </linearGradient>
        <radialGradient id="sun-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe7b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd39a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="600" fill="url(#sky-dusk)" />
      <circle cx="850" cy="440" r="170" fill="url(#sun-glow)" />
      <circle cx="850" cy="440" r="62" fill="#ffe7b0" />

      {/* clouds */}
      <g fill="#f6b4c9" opacity="0.55" className="sky-clouds">
        <ellipse cx="240" cy="170" rx="96" ry="20" />
        <ellipse cx="196" cy="182" rx="56" ry="15" />
        <ellipse cx="300" cy="178" rx="62" ry="16" />
        <ellipse cx="930" cy="120" rx="120" ry="18" />
        <ellipse cx="1010" cy="132" rx="70" ry="14" />
        <ellipse cx="640" cy="236" rx="80" ry="12" />
      </g>
      <g fill="#ffe0c2" opacity="0.6">
        <ellipse cx="236" cy="184" rx="70" ry="5" />
        <ellipse cx="930" cy="132" rx="90" ry="4" />
      </g>

      {/* far skyline */}
      <g fill="#8a4f86" opacity="0.6">
        {FAR.map(([x, y, w, h]) => <rect key={`f${x}`} x={x} y={y} width={w} height={h} />)}
      </g>

      {/* Charminar */}
      <g fill="#3a1d52">
        <rect x="480" y="560" width="240" height="40" />
        <rect x="512" y="448" width="176" height="114" />
        <rect x="518" y="418" width="164" height="32" />
        <rect x="512" y="410" width="176" height="9" />
        <ellipse cx="600" cy="404" rx="24" ry="15" />
        <rect x="598" y="372" width="4" height="22" />
        {/* minarets */}
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
      <path d="M562 562 L562 506 Q600 456 638 506 L638 562 Z" fill="#e9927c" />
      <g fill="#c9739b" opacity="0.85">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${532 + i * 25} 446 L${532 + i * 25} 432 Q${539 + i * 25} 422 ${546 + i * 25} 432 L${546 + i * 25} 446 Z`} />
        ))}
      </g>

      {/* near city */}
      <g fill="#2a1640">
        {NEAR.map(([x, y, w, h]) => <rect key={`n${x}`} x={x} y={y} width={w} height={h} />)}
        <rect x="0" y="584" width="1200" height="16" />
        <circle cx="470" cy="560" r="26" />
        <circle cx="742" cy="562" r="24" />
        <rect x="1100" y="496" width="3" height="26" />
        <rect x="228" y="500" width="3" height="22" />
      </g>
      <g fill="#ffd39a" opacity="0.9">
        {WINDOWS.map(([x, y]) => <rect key={`w${x}${y}`} x={x} y={y} width="6" height="8" />)}
      </g>
    </svg>
  );
}
