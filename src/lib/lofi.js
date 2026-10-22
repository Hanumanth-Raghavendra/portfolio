// Generative lo-fi, synthesised live (Web Audio API). No samples, no recordings:
// a ii–V–I–vi jazz progression on warm pads and keys, a lazy swung beat,
// a wandering pentatonic melody and vinyl crackle. Off until the visitor turns it on.
import { audio, output } from './sound.js';

const BPM = 72;
const STEP = 60 / BPM / 2; // eighth notes
const STEPS_PER_BAR = 8;
const BARS_PER_CHORD = 2;
const SWING = 0.17; // delay on the off-beats, as a fraction of a step

// MIDI voicings: Dm9 → G13 → Cmaj9 → Am9 (two bars each)
const CHORDS = [
  { bass: 38, notes: [53, 57, 60, 64, 65] },
  { bass: 43, notes: [53, 59, 64, 65, 69] },
  { bass: 36, notes: [52, 55, 59, 62, 64] },
  { bass: 45, notes: [55, 59, 60, 64, 67] },
];
const SCALE = [62, 65, 67, 69, 72, 74, 77, 79, 81]; // D minor pentatonic, upper register

// kick / snare / hat patterns over 16 eighths (two bars)
const KICK = [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0];
const SNARE = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1];

const hz = (m) => 440 * 2 ** ((m - 69) / 12);

let state = null; // running engine
let wanted = false; // the visitor's choice (survives tab switches)
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn(wanted));

export function isLofiOn() { return wanted; }
export function onLofiChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

function makeNoise(c, seconds) {
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

function voice(c, dest, { freq, type = 'triangle', t, dur, peak, attack = 0.02, detune = 0 }) {
  const o = c.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  o.detune.value = detune;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function schedule(s, step, t) {
  const { c, bus, keysBus, drumBus, noise } = s;
  const inLoop = step % (STEPS_PER_BAR * BARS_PER_CHORD * CHORDS.length);
  const chord = CHORDS[Math.floor(inLoop / (STEPS_PER_BAR * BARS_PER_CHORD))];
  const pos = inLoop % (STEPS_PER_BAR * BARS_PER_CHORD); // 0..15 within the chord

  // pad: whole chord, swelling in, held for two bars
  if (pos === 0) {
    const dur = STEP * 16 + 0.6;
    chord.notes.forEach((m) => {
      voice(c, bus, { freq: hz(m), type: 'triangle', t, dur, peak: 0.022, attack: 0.9, detune: -7 });
      voice(c, bus, { freq: hz(m), type: 'sine', t, dur, peak: 0.022, attack: 0.9, detune: 6 });
    });
    voice(c, bus, { freq: hz(chord.bass), type: 'sine', t, dur: STEP * 7, peak: 0.12, attack: 0.04 });
    voice(c, bus, { freq: hz(chord.bass + 12), type: 'triangle', t, dur: STEP * 6, peak: 0.03, attack: 0.04 });
  }
  if (pos === 8) {
    voice(c, bus, { freq: hz(chord.bass), type: 'sine', t, dur: STEP * 7, peak: 0.1, attack: 0.04 });
  }
  // keys: soft electric-piano stabs on the upper chord tones
  if (pos === 0 || pos === 3 || pos === 11) {
    chord.notes.slice(-3).forEach((m, i) =>
      voice(c, keysBus, { freq: hz(m + 12), type: 'sine', t: t + i * 0.012, dur: 1.1, peak: 0.03, attack: 0.008 }),
    );
  }
  // melody: a sparse random walk on the pentatonic scale
  if (Math.random() < (pos % 2 ? 0.14 : 0.24)) {
    s.mel = Math.max(0, Math.min(SCALE.length - 1, s.mel + Math.round((Math.random() - 0.5) * 3)));
    voice(c, keysBus, { freq: hz(SCALE[s.mel]), type: 'triangle', t, dur: 0.9, peak: 0.035, attack: 0.01 });
  }
  // drums
  if (KICK[pos]) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.setValueAtTime(110, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.18);
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    o.connect(g).connect(drumBus);
    o.start(t);
    o.stop(t + 0.3);
  }
  if (SNARE[pos] && (pos !== 15 || Math.random() < 0.35)) {
    const src = c.createBufferSource();
    src.buffer = noise;
    const f = c.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1800;
    f.Q.value = 0.8;
    const g = c.createGain();
    const peak = pos === 15 ? 0.05 : 0.14;
    g.gain.setValueAtTime(peak, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    src.connect(f).connect(g).connect(drumBus);
    src.start(t, Math.random());
    src.stop(t + 0.2);
  }
  // hats on every eighth, quieter on the off-beats
  {
    const src = c.createBufferSource();
    src.buffer = noise;
    const f = c.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 7000;
    const g = c.createGain();
    g.gain.setValueAtTime(pos % 2 ? 0.018 : 0.035, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    src.connect(f).connect(g).connect(drumBus);
    src.start(t, Math.random());
    src.stop(t + 0.06);
  }
}

export function startLofi() {
  wanted = true;
  notify();
  if (state || document.hidden) return;
  const c = audio();
  const out = output();
  if (!c || !out) return;

  const music = c.createGain();
  music.gain.setValueAtTime(0.0001, c.currentTime);
  music.gain.exponentialRampToValueAtTime(0.55, c.currentTime + 1.6);
  const warm = c.createBiquadFilter();
  warm.type = 'lowpass';
  warm.frequency.value = 2600;
  warm.Q.value = 0.4;
  music.connect(warm).connect(out);

  const bus = c.createGain();
  bus.connect(music);
  const keysBus = c.createGain();
  const delay = c.createDelay(1);
  delay.delayTime.value = STEP * 3;
  const fb = c.createGain();
  fb.gain.value = 0.28;
  keysBus.connect(music);
  keysBus.connect(delay).connect(fb).connect(delay);
  fb.connect(music);
  const drumBus = c.createGain();
  drumBus.gain.value = 0.8;
  drumBus.connect(music);

  // vinyl: soft hiss + occasional crackle
  const noise = makeNoise(c, 2);
  const hiss = c.createBufferSource();
  hiss.buffer = noise;
  hiss.loop = true;
  const hf = c.createBiquadFilter();
  hf.type = 'bandpass';
  hf.frequency.value = 5200;
  hf.Q.value = 0.6;
  const hg = c.createGain();
  hg.gain.value = 0.012;
  hiss.connect(hf).connect(hg).connect(music);
  hiss.start();

  const s = { c, music, bus, keysBus, drumBus, noise, hiss, step: 0, next: c.currentTime + 0.1, mel: 4 };
  s.timer = setInterval(() => {
    while (s.next < c.currentTime + 0.15) {
      const swing = s.step % 2 ? STEP * SWING : 0;
      schedule(s, s.step, s.next + swing);
      if (Math.random() < 0.07) {
        const src = c.createBufferSource();
        src.buffer = noise;
        const g = c.createGain();
        g.gain.setValueAtTime(0.05 + Math.random() * 0.05, s.next);
        g.gain.exponentialRampToValueAtTime(0.0001, s.next + 0.012);
        src.connect(g).connect(music);
        src.start(s.next, Math.random());
        src.stop(s.next + 0.02);
      }
      s.next += STEP;
      s.step += 1;
    }
  }, 25);
  state = s;
}

function halt() {
  if (!state) return;
  const s = state;
  state = null;
  clearInterval(s.timer);
  const t = s.c.currentTime;
  s.music.gain.cancelScheduledValues(t);
  s.music.gain.setValueAtTime(Math.max(s.music.gain.value, 0.0001), t);
  s.music.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
  setTimeout(() => {
    try { s.hiss.stop(); } catch { /* already stopped */ }
    s.music.disconnect();
  }, 650);
}

export function stopLofi() {
  wanted = false;
  notify();
  halt();
}

// Pause in background tabs (timers get throttled there), resume when the visitor is back.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) halt();
    else if (wanted) startLofi();
  });
}
