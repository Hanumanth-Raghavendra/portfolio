import { useEffect, useRef, useState } from 'react';
import arrowUrl from './cursor-arrow.webp';
import { play } from '../lib/sound.js';
import './cursor.css';

// Custom cursors, mouse and trackpad only (phones and tablets keep their normal touch behaviour).
//   pro:   a precise dot + a ring that trails behind, tilts in 3D with your motion, grows over
//          links and turns into a tiny portal over the crack.
//          Leaves a faint comet trail; clicks send a ripple across the "floor".
//   anime: the flaming lightning arrow. Tilts in 3D as it moves, sheds embers and sparks,
//          flares over clickable things, and clicks fire a shockwave + lightning burst.
// Over text fields the normal text cursor comes back. Reduced motion: no trails or tilt.
const FINE = '(hover: hover) and (pointer: fine)';
const TEXT_SEL =
  'input:not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]):not([type=range]), textarea, [contenteditable=""], [contenteditable="true"]';
const LINK_SEL = 'a, button, [role="button"], label, summary, select';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);

function bolt(x, y, angle, len) {
  const pts = [[x, y]];
  const n = 5;
  for (let i = 1; i <= n; i++) {
    const d = (len * i) / n;
    const jitter = i === n ? 0 : rand(-9, 9);
    pts.push([x + Math.cos(angle) * d - Math.sin(angle) * jitter, y + Math.sin(angle) * d + Math.cos(angle) * jitter]);
  }
  return pts;
}

export default function Cursor({ world, tier }) {
  const [fine, setFine] = useState(() => {
    try { return window.matchMedia(FINE).matches; } catch { return false; }
  });
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const worldRef = useRef(world);
  worldRef.current = world;
  const [metAnime, setMetAnime] = useState(world === 'anime');
  useEffect(() => { if (world === 'anime') setMetAnime(true); }, [world]);

  useEffect(() => {
    let mq;
    try { mq = window.matchMedia(FINE); } catch { return undefined; }
    const on = () => setFine(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);

  useEffect(() => {
    if (!fine) return undefined;
    const root = rootRef.current;
    const cv = canvasRef.current;
    const g = cv.getContext('2d');
    const html = document.documentElement;
    const reduced = tier === 'calm' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MAX = tier === 'lite' ? 70 : 160;

    const dot = root.querySelector('.cur-dot');
    const ring = root.querySelector('.cur-ring');
    const anime = root.querySelector('.cur-anime');
    const tilt = root.querySelector('.cur-tilt');

    let W = 0;
    let H = 0;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let mx = -200;
    let my = -200;
    let rx = mx;
    let ry = my;
    let px = mx;
    let py = my;
    let svx = 0;
    let svy = 0;
    let tx = 0;
    let ty = 0;
    let tz = 0;
    let seen = false;
    let travelled = 0;
    let idleEmit = 0;
    let dirty = false;
    let accent = '#22d3ee';
    const parts = [];
    const fx = [];

    const readAccent = () => {
      accent = getComputedStyle(html).getPropertyValue('--accent').trim() || accent;
    };
    readAccent();

    const setMode = (m) => {
      if (root.dataset.mode === m) return;
      root.dataset.mode = m;
    };

    const spawnTrail = (x, y) => {
      if (reduced || parts.length > MAX) return;
      if (worldRef.current === 'pro') {
        parts.push({ k: 'dot', x, y, vx: 0, vy: 0, life: 0.42, max: 0.42, r: 2.6 });
      } else {
        // embers shed from the arrow's flaming tail (down-right of the tip)
        const ox = x + rand(16, 34);
        const oy = y + rand(26, 50);
        if (Math.random() < 0.22) {
          parts.push({ k: 'spark', x: ox, y: oy, vx: rand(-90, 90) - svx * 4, vy: rand(-90, 60) - svy * 4, life: 0.28, max: 0.28, r: 1 });
        } else {
          parts.push({
            k: 'ember', x: ox, y: oy,
            vx: rand(-24, 24) - svx * 2.5, vy: rand(-40, 8) - svy * 2.5,
            life: rand(0.45, 0.95), max: 0.95, r: rand(1.2, 3.2), hue: rand(22, 48),
          });
        }
      }
    };

    const spawnClick = (x, y) => {
      if (reduced) return;
      if (worldRef.current === 'pro') {
        fx.push({ k: 'ripple', x, y, t: 0, dur: 0.6 });
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 + rand(-0.2, 0.2);
          const s = rand(70, 130);
          parts.push({ k: 'dot', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s * 0.55, life: 0.4, max: 0.4, r: 2, drag: 4 });
        }
      } else {
        fx.push({ k: 'shock', x, y, t: 0, dur: 0.5 });
        fx.push({ k: 'flash', x, y, t: 0, dur: 0.16 });
        const bolts = [];
        const n = tier === 'lite' ? 4 : 6;
        for (let i = 0; i < n; i++) bolts.push(bolt(x, y, (i / n) * Math.PI * 2 + rand(-0.3, 0.3), rand(34, 70)));
        fx.push({ k: 'bolts', bolts, t: 0, dur: 0.24 });
        for (let i = 0; i < (tier === 'lite' ? 12 : 26); i++) {
          const a = rand(0, Math.PI * 2);
          const s = rand(80, 280);
          parts.push({
            k: Math.random() < 0.3 ? 'spark' : 'ember', x, y,
            vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40,
            life: rand(0.35, 0.8), max: 0.8, r: rand(1.2, 3), hue: rand(25, 50), drag: 2.2,
          });
        }
      }
    };

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      mx = e.clientX;
      my = e.clientY;
      if (!seen) {
        seen = true;
        rx = px = mx;
        ry = py = my;
        html.classList.add('has-cursor');
        root.classList.add('is-on');
      }
      root.classList.remove('is-out');
      // the precise parts follow instantly, no frame of lag
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      anime.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    };

    const onOver = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest(TEXT_SEL)) return setMode('text');
      const card = t.closest('[data-cursor]');
      const link = t.closest(LINK_SEL);
      if (link && card && card.contains(link) && card !== link) return setMode(card.dataset.cursor === 'portal' ? 'portal' : 'link');
      if (card) return setMode(card.dataset.cursor);
      if (link) return setMode('link');
      return setMode('default');
    };

    const onDown = (e) => {
      if (e.pointerType === 'touch') {
        root.classList.add('is-out');
        return;
      }
      if (e.button !== 0) return;
      readAccent();
      root.classList.add('is-down');
      spawnClick(e.clientX, e.clientY);
      if (worldRef.current === 'anime') play('zap');
    };
    const onUp = () => root.classList.remove('is-down');
    const onLeave = () => root.classList.add('is-out');

    let raf = 0;
    let last = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000) || 0.016;
      last = now;
      const dx = mx - px;
      const dy = my - py;
      px = mx;
      py = my;
      svx += (dx - svx) * 0.3;
      svy += (dy - svy) * 0.3;
      const isPro = worldRef.current === 'pro';

      // ring: eases after the pointer and tilts like a disc in 3D
      const k = reduced ? 1 : 1 - Math.exp(-dt * 16);
      rx += (mx - rx) * k;
      ry += (my - ry) * k;
      const tiltK = reduced ? 0 : 1;
      tx += (clamp(-svy * 2.4, -42, 42) * tiltK - tx) * 0.18;
      ty += (clamp(svx * 2.4, -42, 42) * tiltK - ty) * 0.18;
      tz += (clamp(svx * 0.5, -12, 12) * tiltK - tz) * 0.15;
      if (isPro) {
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) perspective(260px) rotateX(${tx}deg) rotateY(${ty}deg)`;
      } else {
        tilt.style.transform = `perspective(280px) rotateX(${tx * 0.8}deg) rotateY(${ty * 0.8}deg) rotateZ(${tz}deg)`;
      }

      // trail particles, spaced by distance travelled
      const dist = Math.hypot(dx, dy);
      travelled += dist;
      const gap = isPro ? 7 : 4;
      while (travelled > gap && seen) {
        travelled -= gap;
        const f = travelled / Math.max(dist, 1);
        spawnTrail(mx - dx * f, my - dy * f);
      }
      // a living flame: the arrow smoulders even when still
      if (!isPro && seen && !reduced && !root.classList.contains('is-out')) {
        idleEmit += dt;
        if (idleEmit > 0.09) {
          idleEmit = 0;
          spawnTrail(mx, my);
        }
      }

      if (!parts.length && !fx.length) {
        if (dirty) {
          g.clearRect(0, 0, W, H);
          dirty = false;
        }
        return;
      }
      dirty = true;
      g.clearRect(0, 0, W, H);
      g.globalCompositeOperation = isPro ? 'source-over' : 'lighter';

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= dt;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        const drag = p.drag ? Math.exp(-p.drag * dt) : 1;
        p.vx *= drag;
        p.vy *= drag;
        if (p.k === 'ember') p.vy -= 70 * dt; // fire rises
        const ox = p.x;
        const oy = p.y;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const a = p.life / p.max;
        if (p.k === 'dot') {
          g.globalAlpha = a * 0.55;
          g.fillStyle = accent;
          g.beginPath();
          g.arc(p.x, p.y, Math.max(0.3, p.r * a), 0, Math.PI * 2);
          g.fill();
        } else if (p.k === 'ember') {
          g.globalAlpha = a * 0.28;
          g.fillStyle = `hsl(${p.hue}, 100%, 55%)`;
          g.beginPath();
          g.arc(p.x, p.y, p.r * 2.6 * a + 1, 0, Math.PI * 2);
          g.fill();
          g.globalAlpha = Math.min(1, a * 1.2);
          g.fillStyle = `hsl(${p.hue + 10}, 100%, ${62 + a * 25}%)`;
          g.beginPath();
          g.arc(p.x, p.y, Math.max(0.4, p.r * a), 0, Math.PI * 2);
          g.fill();
        } else {
          g.globalAlpha = a;
          g.strokeStyle = '#9fdcff';
          g.lineWidth = 1.4;
          g.beginPath();
          g.moveTo(ox, oy);
          g.lineTo(p.x, p.y);
          g.stroke();
        }
      }

      for (let i = fx.length - 1; i >= 0; i--) {
        const e = fx[i];
        e.t += dt;
        const t = e.t / e.dur;
        if (t >= 1) {
          fx.splice(i, 1);
          continue;
        }
        const ease = 1 - (1 - t) ** 3;
        if (e.k === 'ripple') {
          // a ring spreading across a tilted "floor", plus an upright echo
          g.globalAlpha = (1 - t) * 0.7;
          g.strokeStyle = accent;
          g.lineWidth = 2 * (1 - t) + 0.5;
          g.beginPath();
          g.ellipse(e.x, e.y + ease * 6, 12 + ease * 58, (12 + ease * 58) * 0.42, 0, 0, Math.PI * 2);
          g.stroke();
          g.globalAlpha = (1 - t) * 0.45;
          g.beginPath();
          g.arc(e.x, e.y, 8 + ease * 30, 0, Math.PI * 2);
          g.stroke();
        } else if (e.k === 'shock') {
          g.globalAlpha = (1 - t) * 0.9;
          g.lineWidth = 3 * (1 - t) + 0.6;
          g.strokeStyle = '#ffc861';
          g.beginPath();
          g.ellipse(e.x, e.y, 10 + ease * 80, (10 + ease * 80) * 0.5, -0.35, 0, Math.PI * 2);
          g.stroke();
          g.strokeStyle = '#6cc6ff';
          g.globalAlpha = (1 - t) * 0.6;
          g.beginPath();
          g.ellipse(e.x, e.y, 6 + ease * 52, (6 + ease * 52) * 0.5, -0.35, 0, Math.PI * 2);
          g.stroke();
        } else if (e.k === 'flash') {
          const r = 10 + ease * 26;
          const grd = g.createRadialGradient(e.x, e.y, 0, e.x, e.y, r);
          grd.addColorStop(0, 'rgba(255,248,220,0.95)');
          grd.addColorStop(1, 'rgba(255,170,60,0)');
          g.globalAlpha = 1 - t;
          g.fillStyle = grd;
          g.beginPath();
          g.arc(e.x, e.y, r, 0, Math.PI * 2);
          g.fill();
        } else if (e.k === 'bolts') {
          const flick = Math.random() < 0.85 ? 1 : 0.3;
          for (const pts of e.bolts) {
            g.beginPath();
            g.moveTo(pts[0][0], pts[0][1]);
            for (let j = 1; j < pts.length; j++) g.lineTo(pts[j][0], pts[j][1]);
            g.globalAlpha = (1 - t) * 0.45 * flick;
            g.strokeStyle = '#5ab8ff';
            g.lineWidth = 5;
            g.stroke();
            g.globalAlpha = (1 - t) * flick;
            g.strokeStyle = '#f4fbff';
            g.lineWidth = 1.4;
            g.stroke();
          }
        }
      }
      g.globalAlpha = 1;
      g.globalCompositeOperation = 'source-over';
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    html.addEventListener('mouseleave', onLeave);
    window.addEventListener('blur', onLeave);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerover', onOver);
      html.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('resize', resize);
      html.classList.remove('has-cursor');
      root.classList.remove('is-on');
    };
  }, [fine, tier]);

  if (!fine) return null;
  return (
    <div className="cursor" ref={rootRef} data-world={world} data-mode="default" aria-hidden="true">
      <canvas className="cur-fx" ref={canvasRef} />
      <div className="cur-ring">
        <div className="cur-shape" />
      </div>
      <div className="cur-dot" />
      <div className="cur-anime">
        <div className="cur-tilt">
          <span className="cur-aura" />
          {metAnime && <img className="cur-arrow" src={arrowUrl} alt="" draggable="false" />}
        </div>
      </div>
    </div>
  );
}
