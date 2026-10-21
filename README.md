# Hanumanth Raghavendra · portfolio

A professional portfolio with a hidden second world. Click **Get isekai'd** and the page
falls through a portal into an anime version of the site (hackingPanda). **Wake up to
reality** brings you back to the same section you left.

Built with **React 18 + Vite + GSAP**. No backend.

---

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

Handy for testing the device tiers: add `?tier=full`, `?tier=lite` or `?tier=calm` to the URL.

## Deploy on Vercel (free)

1. Create a new GitHub repo and push this folder to it.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
   Vercel detects Vite automatically. Keep the defaults and click **Deploy**.
3. Name the project `hanumanth` to get `hanumanth.vercel.app` (if the name is taken,
   try `hanumanth-raghavendra`). You can rename it later under **Settings → General**.

### Turn on the contact form

The form sends email through [Web3Forms](https://web3forms.com) (free, no server needed).

1. Go to web3forms.com, enter `raghavendra.boienpally@gmail.com`, and copy the access key they email you.
2. In Vercel → your project → **Settings → Environment Variables**, add
   `VITE_WEB3FORMS_KEY` = your key.
3. Redeploy (Deployments → ⋯ → Redeploy).

Until the key is set, the form tells visitors to email you directly instead.

---

## Where everything lives

```
src/
  data/site.js          ← ALL the content (projects, skills, journey…). Edit this to update both worlds.
  App.jsx               ← switches worlds, runs the transitions, handles voice commands
  pro/ProWorld.jsx      ← the professional side (sections + contact form)
  anime/AnimeWorld.jsx  ← the anime side (loaded only when someone heads there)
  fx/timelines.js       ← the Portal Dive and Wake-up animations (GSAP)
  fx/TransitionLayer.jsx← the overlay pieces those animations move
  art/                  ← the hand-built SVG art: Hyderabad skyline, the school guy, the classroom
  lib/engine.js         ← device tiers, storage, achievements, scrolling, contact form
  lib/voice.js          ← Web Speech API voice commands
  lib/sound.js          ← every sound effect, synthesised with the Web Audio API (no audio files)
```

## How the interesting parts work (for interviews)

- **Two worlds, one data file.** Both sides render from `src/data/site.js`, so content never drifts apart.
- **Code splitting.** The anime side is a dynamic `import()`. Pro-side visitors never download it;
  hovering the toggle preloads it (and its fonts) so the landing is instant.
- **Portal Dive.** A GSAP timeline: impact flash → the button grows into a portal → the pro page
  tilts back with CSS 3D (`perspective` on the stage, `rotationX` on the page) → free-fall overlay →
  the anime side mounts *under* the overlay → landing with screen shake. The timeline pauses until
  the anime chunk has loaded, then waits two animation frames for React to paint.
- **Device tiers.** `getTier()` picks `full` (3D + particles), `lite` (2D, fewer particles, for
  weaker phones via `deviceMemory`/`hardwareConcurrency`) or `calm` (`prefers-reduced-motion` →
  simple crossfade).
- **Voice.** `SpeechRecognition` with `en-IN`, matched against a small command table with regexes.
  Hidden on browsers without support (Firefox). Click to talk on desktop, press-and-hold on phones.
- **Sound.** Off by default. Whoosh, thud, chime and rewind are generated live with oscillators and
  filtered noise, so there's nothing to license.
- **Achievements.** Stored in `localStorage` (wrapped in try/catch so private windows still work).

## Notes

- Voice needs HTTPS (Vercel gives you that) and a browser that supports speech recognition.
- The resume served by the site is `public/resume/Hanumanth_Raghavendra_Resume.pdf`. Replace that
  file to update it.
