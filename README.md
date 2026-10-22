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
Both forms include a hidden spam trap (a "honeypot" box only bots tick), so bot submissions are dropped
before they use up your Web3Forms quota.

### Analytics (optional)

- **Vercel Web Analytics:** in Vercel → your project → **Analytics** → **Enable**. The free Hobby plan
  records page views. The custom events the site sends (`isekai`, `wake`, `pro_scroll`, `resume`,
  `contact_sent`, `voice`, `boss`, `lofi_on`) are only recorded on Vercel's paid plans.
- **Umami Cloud (free Hobby plan, records custom events):** create a site at umami.is, then add
  `VITE_UMAMI_WEBSITE_ID` = your website ID in Vercel's environment variables and redeploy.

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

## What's on each side

**Pro side:** hero, about, skills, projects, journey, now, contact. Only two doors lead
to the anime side (the crack in the hero and the footer), plus a one-time nudge after someone reads down to
Contact. Custom cursor: a dot and a trailing ring that tilts in 3D, grows over links and turns into a
tiny portal over the crack. Silent by default.

**Anime side:** day/night Hyderabad scene (follows the visitor's local time; test with `?time=dawn|day|golden|night`),
hackingPanda dozes off after 20 s of idling and jolts awake, Status, Quests, **Boss Fight** (Java/Spring quiz),
Skill Tree, Adventure Log, **The Shelf**, 11 achievements (one secret: ↑↑↓↓←→←→ B A, or tap the logo 5 times),
Party invite. Sounds play by default with a tiny mute; optional generative **lo-fi** music. Custom cursor:
the flaming lightning arrow with ember trail, 3D tilt and a lightning-burst click.

**Voice:** a labelled "Try voice" / "Hold to talk" pill, a one-time hint bubble, and example commands that also
work as buttons.

## Notes
- The shelf currently lists genres and games. Edit `shelf` in `src/data/site.js` to add real titles.
- Custom cursors only run with a mouse or trackpad; phones and tablets are untouched.

- Voice needs HTTPS (Vercel gives you that) and a browser that supports speech recognition.
- The resume served by the site is `public/resume/Hanumanth_Raghavendra_Resume.pdf`. Replace that
  file to update it.
