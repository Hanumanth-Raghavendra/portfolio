import baseUrl from './guy/base.webp';
import headUrl from './guy/head.webp';
import headClosedUrl from './guy/head-closed.webp';

// hackingPanda's anime self, built from three aligned layers so he can move:
//   base        – body, chair, desk (head cut away, neck extended underneath)
//   head        – eyes open
//   head-closed – same head, eyes closed (blinks and sleep)
// The head rotates around the neck pivot, so tilting never shows a gap.
//   mood: 'idle'  – breathes, sways a little, blinks
//         'sleep' – head drooped, eyes closed, zzz
//         'awake' – upright, eyes open
//         'swap'  – both heads rendered; GSAP drives the wake-up
export const GUY = { w: 655, vw: 672, h: 978, head: { x: 194, y: -2, w: 210, h: 224 }, pivot: { x: 276, y: 206 } };

// asleep / waking (idle mood only): he dozes off when the visitor goes quiet,
// and jolts awake when they come back. The outer "pose" group handles that,
// so it never fights the idle sway on the inner head group.
export default function SchoolGuy({ mood = 'idle', asleep = false, waking = false, className = '', title, ...rest }) {
  const { head } = GUY;
  const showClosed = mood === 'sleep' || mood === 'swap' || mood === 'idle';
  const showZzz = mood === 'sleep' || mood === 'idle';
  return (
    <svg
      className={`school-guy mood-${mood} ${asleep ? 'is-asleep' : ''} ${waking ? 'is-waking' : ''} ${className}`}
      viewBox={`0 0 ${GUY.vw} ${GUY.h}`}
      overflow="visible"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {/* the source art crops the desk's right end; finish it (tabletop, side, back leg) */}
      <g className="guy-desk-end" stroke="#171214" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M653 532 L668 531 L667 912 L657 913 Z" fill="#4b4b53" />
        <path d="M662 540 L663 905" stroke="#6a6a72" strokeWidth="2" />
        <path d="M655 909 L668 908 L668 916 Q662 919 655 916 Z" fill="#232326" />
        <path d="M646 489 L667 487 L667 529 L646 539 Z" fill="#3a3a43" />
        <path d="M646 474 L669 472 L669 486 L646 489 Z" fill="#4e3f3c" />
        <path d="M646 448 L663 449 Q669 450 669 455 L669 472 L646 474 Z" fill="#8f7563" />
      </g>
      <image className="guy-base" href={baseUrl} width={GUY.w} height={GUY.h} />
      <g className="guy-pose">
        <g className="guy-head">
          <image href={headUrl} x={head.x} y={head.y} width={head.w} height={head.h} />
          {showClosed && (
            <image className="guy-head-closed" href={headClosedUrl} x={head.x} y={head.y} width={head.w} height={head.h} />
          )}
        </g>
      </g>
      {showZzz && (
        <g className="guy-zzz" fill="#f8f4ff" stroke="#1a1033" strokeWidth="5" paintOrder="stroke" fontFamily="var(--font-anime-display)" fontWeight="700">
          <text x="420" y="80" fontSize="64">z</text>
          <text x="470" y="30" fontSize="46">z</text>
          <text x="512" y="-12" fontSize="34">z</text>
        </g>
      )}
    </svg>
  );
}
