// Every sound on the site is synthesised live with the Web Audio API:
// no audio files, so nothing to license and nothing to download.
// Sound is OFF by default; the visitor turns it on.
import { store } from './engine.js';

let ctx = null;
let enabled = store.get('hp-sound', 'off') === 'on';
const listeners = new Set();

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch { return null; }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

export function isSoundOn() { return enabled; }
export function onSoundChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function setSound(on) {
  enabled = on;
  store.set('hp-sound', on ? 'on' : 'off');
  if (on) audio(); // the toggle click itself unlocks audio on iOS
  listeners.forEach((fn) => fn(on));
}
// Call from any click: unlocks audio on iOS when sound is on.
export function unlockAudio() { if (enabled) audio(); }

function noiseBuffer(c, seconds) {
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function env(c, gainNode, peak, attack, release, start) {
  const g = gainNode.gain;
  g.setValueAtTime(0.0001, start);
  g.exponentialRampToValueAtTime(peak, start + attack);
  g.exponentialRampToValueAtTime(0.0001, start + attack + release);
}

const sounds = {
  whoosh(c) {
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
    env(c, g, 0.5, 0.35, 0.85, t);
    src.connect(filter).connect(g).connect(c.destination);
    src.start(t);
    src.stop(t + 1.3);
  },
  thud(c) {
    const t = c.currentTime;
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.35);
    const g = c.createGain();
    env(c, g, 0.7, 0.01, 0.4, t);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.45);
  },
  chime(c) {
    const t = c.currentTime;
    [880, 1318.5].forEach((f, i) => {
      const osc = c.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = f;
      const g = c.createGain();
      env(c, g, 0.22, 0.01, 0.5, t + i * 0.09);
      osc.connect(g).connect(c.destination);
      osc.start(t + i * 0.09);
      osc.stop(t + i * 0.09 + 0.6);
    });
  },
  blip(c) {
    const t = c.currentTime;
    const osc = c.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(660, t);
    osc.frequency.exponentialRampToValueAtTime(990, t + 0.06);
    const g = c.createGain();
    env(c, g, 0.08, 0.005, 0.09, t);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  },
  rewind(c) {
    const t = c.currentTime;
    const osc = c.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.6);
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1400;
    const g = c.createGain();
    env(c, g, 0.12, 0.02, 0.6, t);
    osc.connect(lp).connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.7);
  },
};

export function play(name) {
  if (!enabled) return;
  const c = audio();
  if (!c || !sounds[name]) return;
  try { sounds[name](c); } catch { /* audio is optional */ }
}
