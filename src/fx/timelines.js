// The two signature transitions, as GSAP timelines.
//   portalDive → pro side falls away, you drop through a portal, land in the anime world
//   wakeUp     → VHS rewind, the guy wakes up at his desk, back on the pro side
// Each adapts to the device tier: full / lite / calm (reduced motion).
import gsap from 'gsap';
import { GUY } from '../art/SchoolGuy.jsx';

function begin(fx) {
  document.documentElement.classList.add('fx-lock');
  fx.root.classList.add('is-active');
}

function end(fx, extraReset) {
  document.documentElement.classList.remove('fx-lock');
  fx.root.classList.remove('is-active');
  gsap.set([fx.flash, fx.burst, fx.portal, fx.fall, fx.impact, fx.calm, fx.vhs, fx.classroom], { autoAlpha: 0 });
  gsap.set(fx.root, { autoAlpha: 0 });
  if (extraReset) extraReset();
}

// Pause the timeline until an async step (loading the anime side) finishes,
// then give React two frames to paint before continuing.
function waitFor(tl, fn) {
  return () => {
    tl.pause();
    Promise.resolve()
      .then(fn)
      .catch(() => {})
      .then(() => requestAnimationFrame(() => requestAnimationFrame(() => tl.resume())));
  };
}

export function shake(el) {
  gsap.fromTo(el, { x: -14, y: 9 }, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1.2, 0.25)', clearProps: 'transform' });
}

export function portalDive({ tier, origin, stage, proRoot, fx, swap, land, done }) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const cx = origin ? origin.x : W / 2;
  const cy = origin ? origin.y : H / 2;
  begin(fx);

  const tl = gsap.timeline({
    onComplete: () =>
      end(fx, () => {
        gsap.set(stage, { clearProps: 'perspective,perspectiveOrigin' });
        done();
      }),
  });

  if (tier === 'calm') {
    gsap.set(fx.calm, { backgroundColor: '#1a1033' });
    tl.set(fx.root, { autoAlpha: 1 })
      .fromTo(fx.calm, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
      .call(waitFor(tl, swap))
      .call(land)
      .to(fx.calm, { autoAlpha: 0, duration: 0.35 });
    return tl;
  }

  const sy = window.scrollY;
  const PORTAL = 120; // css size of the portal disc
  const cover = (Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) * 2.3) / PORTAL;

  gsap.set(fx.portal, { left: cx, top: cy, xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
  gsap.set(fx.burst, { left: cx, top: cy, xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
  gsap.set(stage, { perspective: 1100, perspectiveOrigin: `50% ${sy + H / 2}px` });
  if (proRoot) gsap.set(proRoot, { transformOrigin: `50% ${sy + H}px` });

  // 1 · impact frame
  tl.set(fx.root, { autoAlpha: 1 }, 0)
    .set([fx.flash, fx.burst], { autoAlpha: 1 }, 0)
    .to(fx.flash, { autoAlpha: 0, duration: 0.2, ease: 'power2.out' }, 0.07)
    .to(fx.burst, { scale: 1.8, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, 0.05)
    // 2 · the button becomes a portal
    .to(fx.portal, { autoAlpha: 1, scale: 1.3, duration: 0.26, ease: 'back.out(2.2)' }, 0.12);

  // 3 · the pro page tilts back and drops
  if (proRoot) {
    tl.to(
      proRoot,
      tier === 'full'
        ? { rotationX: 64, y: H * 0.95, opacity: 0, duration: 0.55, ease: 'power2.in' }
        : { scale: 0.8, opacity: 0, duration: 0.45, ease: 'power2.in' },
      0.34,
    );
  }

  // 4 · free-fall (anime side mounts underneath while the screen is covered)
  tl.to(fx.portal, { scale: cover, duration: 0.46, ease: 'power3.in' }, 0.42)
    .set(fx.fall, { autoAlpha: 1 }, 0.86)
    .to(fx.portal, { autoAlpha: 0, duration: 0.15 }, 0.88)
    .call(waitFor(tl, swap), null, 0.9)
    .to({}, { duration: 0.42 }, 0.9)
    // 5 · landing
    .addLabel('land', 1.32)
    .to(fx.fall, { autoAlpha: 0, duration: 0.2 }, 'land')
    .fromTo(
      fx.impact,
      { autoAlpha: 0, scale: 1.8, rotation: -14 },
      { autoAlpha: 1, scale: 1, rotation: -8, duration: 0.18, ease: 'back.out(3)' },
      'land',
    )
    .call(land, null, 'land')
    .to(fx.impact, { autoAlpha: 0, y: -30, duration: 0.3, ease: 'power1.in' }, 'land+=0.45')
    .set(fx.impact, { y: 0 });

  return tl;
}

export function wakeUp({ tier, animeRoot, fx, swap, done, calmColor }) {
  begin(fx);
  const tl = gsap.timeline({ onComplete: () => end(fx, done) });

  if (tier === 'calm') {
    gsap.set(fx.calm, { backgroundColor: calmColor || '#0b0f14' });
    tl.set(fx.root, { autoAlpha: 1 })
      .fromTo(fx.calm, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
      .call(swap)
      .to(fx.calm, { autoAlpha: 0, duration: 0.35 }, '+=0.05');
    return tl;
  }

  const guy = fx.classroom.querySelector('.cls-guy');
  const head = fx.classroom.querySelectorAll('.guy-head');
  const lids = fx.classroom.querySelectorAll('.guy-head-closed');
  const pivot = `${GUY.pivot.x} ${GUY.pivot.y}`;
  gsap.set(guy, { y: 0 });
  gsap.set(head, { rotation: 11, y: 10, svgOrigin: pivot });
  gsap.set(lids, { autoAlpha: 1 });
  gsap.set(fx.bubble, { autoAlpha: 0, scale: 0.6 });

  // 1 · VHS rewind over the anime world
  tl.set(fx.root, { autoAlpha: 1 }, 0)
    .fromTo(fx.vhs, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, 0)
    .fromTo(fx.vhsBar, { yPercent: -100 }, { yPercent: 1100, duration: 0.55, ease: 'none' }, 0);
  if (animeRoot && tier === 'full') {
    tl.to(animeRoot, { filter: 'saturate(0.15) contrast(1.25) hue-rotate(-20deg)', duration: 0.45 }, 0);
  }
  if (animeRoot) {
    tl.fromTo(animeRoot, { x: 0 }, { x: tier === 'full' ? 8 : 4, duration: 0.04, repeat: 9, yoyo: true, ease: 'none' }, 0.05);
  }

  // 2 · cut to the classroom; the pro side mounts behind it
  tl.fromTo(fx.classroom, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16 }, 0.56)
    .set(fx.vhs, { autoAlpha: 0 }, 0.74)
    .call(swap, null, 0.74)
    // 3 · he jolts awake
    .to(head, { rotation: 0, y: 0, duration: 0.28, ease: 'back.out(2.4)' }, 0.86)
    .to(guy, { y: -8, duration: 0.11, ease: 'power2.out', yoyo: true, repeat: 1 }, 0.86)
    .set(lids, { autoAlpha: 0 }, 0.92)
    .to(fx.bubble, { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'back.out(2)' }, 1.0)
    // 4 · back on the pro side
    .to(fx.classroom, { autoAlpha: 0, duration: 0.35, ease: 'power1.inOut' }, 1.6)
    .set(fx.bubble, { autoAlpha: 0 });

  return tl;
}
