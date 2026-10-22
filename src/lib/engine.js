// Small shared engine: safe storage, device tier, scrolling,
// achievements, clipboard and the contact form.

// ── storage (can throw in private windows / sandboxed frames) ──
export const store = {
  get(key, fallback = null) {
    try {
      const v = window.localStorage.getItem(key);
      return v === null ? fallback : v;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* storage unavailable: feature just won't persist */
    }
  },
  session: {
    get(key) {
      try { return window.sessionStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { window.sessionStorage.setItem(key, value); } catch { /* ignore */ }
    },
  },
};

// ── device tier: full / lite / calm ──
// full  = 3D tilt, particles, shake
// lite  = 2D scale + fewer particles (mid/low-end phones)
// calm  = prefers-reduced-motion → simple crossfade
export function getTier() {
  try {
    const forced = new URLSearchParams(window.location.search).get('tier');
    if (forced === 'full' || forced === 'lite' || forced === 'calm') return forced;
  } catch { /* ignore */ }
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'calm';
  } catch { /* ignore */ }
  const mem = navigator.deviceMemory; // Chromium only; undefined elsewhere
  const cores = navigator.hardwareConcurrency || 8;
  let coarse = false;
  try { coarse = window.matchMedia('(pointer: coarse)').matches; } catch { /* ignore */ }
  if ((mem && mem <= 4) || cores <= 4) return 'lite';
  if (coarse && mem && mem < 6) return 'lite';
  return 'full';
}

export function prefersReducedMotion() {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
}

// ── scrolling ──
export function scrollToId(id, instant = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: instant || prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

// The section whose top has most recently passed ~35% of the viewport.
export function currentSection(ids) {
  let best = ids[0];
  let bestTop = -Infinity;
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top;
    if (top <= window.innerHeight * 0.35 && top > bestTop) {
      best = id;
      bestTop = top;
    }
  }
  return best;
}

// ── achievements (stored per visitor) ──
const achListeners = new Set();
let unlocked = new Set();
try { unlocked = new Set(JSON.parse(store.get('hp-achievements', '[]'))); } catch { unlocked = new Set(); }

export function unlockAchievement(id) {
  if (unlocked.has(id)) return false;
  unlocked.add(id);
  store.set('hp-achievements', JSON.stringify([...unlocked]));
  achListeners.forEach((fn) => fn(id));
  return true;
}
export function getAchievements() { return [...unlocked]; }
export function onAchievement(fn) {
  achListeners.add(fn);
  return () => achListeners.delete(fn);
}

let questsRead = new Set();
try { questsRead = new Set(JSON.parse(store.get('hp-quests-read', '[]'))); } catch { questsRead = new Set(); }
export function markQuestRead(id, total) {
  questsRead.add(id);
  store.set('hp-quests-read', JSON.stringify([...questsRead]));
  if (questsRead.size >= total) unlockAchievement('quests');
}

// ── resume download ──
export function downloadResume(href) {
  const a = document.createElement('a');
  a.href = href;
  a.download = 'Hanumanth_Raghavendra_Resume.pdf';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ── clipboard (call inside a click handler) ──
export async function copyText(text, fallbackEl) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    if (fallbackEl) {
      const range = document.createRange();
      range.selectNodeContents(fallbackEl);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    return false;
  }
}

// ── contact form → Web3Forms (free, no backend) ──
// Set VITE_WEB3FORMS_KEY in Vercel → Project → Settings → Environment Variables.
const FORM_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

export async function sendMessage({ name, email, message, botcheck }) {
  // Spam trap: humans never see or tick the hidden "botcheck" box; bots fill every field.
  // Pretend it worked so the bot moves on, and don't spend a Web3Forms submission on it.
  if (botcheck) return { ok: true, spam: true };
  if (!FORM_KEY) return { ok: false, reason: 'not-configured' };
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: FORM_KEY,
        subject: `Portfolio message from ${name}`,
        from_name: 'Portfolio site',
        name,
        email,
        message,
      }),
    });
    const data = await res.json();
    return data.success ? { ok: true } : { ok: false, reason: 'rejected' };
  } catch {
    return { ok: false, reason: 'network' };
  }
}

// ── load the anime side's fonts only when someone heads there ──
export function loadAnimeFonts() {
  if (document.getElementById('anime-fonts')) return;
  const link = document.createElement('link');
  link.id = 'anime-fonts';
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Zen+Dots&family=M+PLUS+Rounded+1c:wght@500;700;800&family=DotGothic16&family=Dela+Gothic+One&display=swap';
  document.head.appendChild(link);
}
