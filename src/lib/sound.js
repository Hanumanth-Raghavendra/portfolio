// Every sound on the site is synthesised live with the Web Audio API:
// no audio files, so nothing to license and nothing to download.
//   · The pro side is silent.
//   · The anime side plays sounds by default (the "Get isekai'd" click unlocks audio).
//   · A tiny mute button silences everything, including the lo-fi music, and is remembered.
import { store } from './engine.js';

let ctx = null;
let master = null;
let muted = store.get('hp-mute', '0') === '1';
let active = false; // true while the anime side (or a transition into/out of it) is on screen
const listeners = new Set();

export function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch { return null; }
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

// Where every sound (and the lo-fi bus) connects, so mute silences all of it.
export function output() {
  return audio() ? master : null;
}

export function isMuted() { return muted; }
export function onMuteChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function setMuted(m) {
  muted = m;
  store.set('hp-mute', m ? '1' : '0');
  if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, 0.03);
  listeners.forEach((fn) => fn(m));
}

export function setSoundActive(on) { active = on; }
export function isSoundActive() { return active; }

// Call from inside a click/tap/keypress: browsers only allow audio after a user gesture.
export function unlockAudio() { audio(); }

function noiseBuffer(c, seconds) {
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function env(gainNode, peak, attack, release, start) {
  const g = gainNode.gain;
  g.setValueAtTime(0.0001, start);
  g.exponentialRampToValueAtTime(peak, start + attack);
  g.exponentialRampToValueAtTime(0.0001, start + attack + release);
}

function tone(c, out, { type = 'sine', from, to, peak, attack = 0.01, release = 0.2, at = 0 }) {
  const t = c.currentTime + at;
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + attack + release);
  const g = c.createGain();
  env(g, peak, attack, release, t);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + attack + release + 0.05);
}

function noise(c, out, { type = 'bandpass', freq = 1200, q = 1, peak = 0.2, attack = 0.005, release = 0.15, at = 0 }) {
  const t = c.currentTime + at;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, attack + release + 0.05);
  const f = c.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  env(g, peak, attack, release, t);
  src.connect(f).connect(g).connect(out);
  src.start(t);
}

const sounds = {
  whoosh(c, out) {
    const t = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c, 1.3);
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.4;
    filter.frequency.setValueAtTime(320, t);
    filter.frequency.exponentialRampToValueAtTime(2600, t + 0.55);
    filter.frequency.exponentialRampToValueAtTime(240, t + 1.2);
    const g = c.createGain();
    env(g, 0.5, 0.35, 0.85, t);
    src.connect(filter).connect(g).connect(out);
    src.start(t);
    src.stop(t + 1.3);
  },
  thud(c, out) { tone(c, out, { from: 140, to: 38, peak: 0.7, release: 0.4 }); },
  chime(c, out) {
    tone(c, out, { type: 'triangle', from: 880, peak: 0.2, release: 0.5 });
    tone(c, out, { type: 'triangle', from: 1318.5, peak: 0.2, release: 0.5, at: 0.09 });
  },
  blip(c, out) { tone(c, out, { type: 'square', from: 660, to: 990, peak: 0.06, attack: 0.005, release: 0.08 }); },
  // the cursor's click on the anime side: a tiny electric zap
  zap(c, out) {
    noise(c, out, { type: 'highpass', freq: 3200, peak: 0.05, release: 0.06 });
    tone(c, out, { type: 'sawtooth', from: 1800, to: 420, peak: 0.025, attack: 0.003, release: 0.07 });
  },
  rewind(c, out) {
    const t = c.currentTime;
    const osc = c.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.6);
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1400;
    const g = c.createGain();
    env(g, 0.12, 0.02, 0.6, t);
    osc.connect(lp).connect(g).connect(out);
    osc.start(t);
    osc.stop(t + 0.7);
  },
  // hackingPanda dozing off, and jolting awake
  doze(c, out) { tone(c, out, { type: 'sine', from: 520, to: 260, peak: 0.07, attack: 0.08, release: 0.9 }); },
  startle(c, out) {
    tone(c, out, { type: 'triangle', from: 300, to: 1100, peak: 0.12, attack: 0.01, release: 0.16 });
    tone(c, out, { type: 'square', from: 1200, peak: 0.03, attack: 0.005, release: 0.08, at: 0.12 });
  },
  // boss fight
  hit(c, out) {
    noise(c, out, { type: 'lowpass', freq: 1800, peak: 0.35, release: 0.18 });
    tone(c, out, { from: 180, to: 60, peak: 0.5, release: 0.22 });
  },
  hurt(c, out) { tone(c, out, { type: 'square', from: 440, to: 140, peak: 0.08, attack: 0.01, release: 0.35 }); },
  win(c, out) {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone(c, out, { type: 'triangle', from: f, peak: 0.16, release: 0.35, at: i * 0.1 }),
    );
  },
  lose(c, out) {
    [392, 329.63, 261.63].forEach((f, i) => tone(c, out, { type: 'triangle', from: f, peak: 0.14, release: 0.4, at: i * 0.16 }));
  },
};

export function play(name) {
  if (!active || muted) return;
  const c = audio();
  if (!c || !sounds[name]) return;
  try { sounds[name](c, master); } catch { /* audio is optional */ }
}
