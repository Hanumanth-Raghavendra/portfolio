import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import ProWorld from './pro/ProWorld.jsx';
import TransitionLayer from './fx/TransitionLayer.jsx';
import Toasts from './ui/Toasts.jsx';
import { portalDive, wakeUp, shake } from './fx/timelines.js';
import {
  currentSection,
  downloadResume,
  getTier,
  loadAnimeFonts,
  onAchievement,
  scrollToId,
  store,
  unlockAchievement,
} from './lib/engine.js';
import { play, unlockAudio } from './lib/sound.js';
import { useVoice } from './lib/voice.js';
import { achievementList, profile, sectionMap } from './data/site.js';

// The anime side is its own JS chunk: pro-side visitors never download it.
let animeModule = null;
function loadAnime() {
  if (!animeModule) {
    loadAnimeFonts();
    animeModule = import('./anime/AnimeWorld.jsx');
  }
  return animeModule;
}

const ANIME_IDS = ['a-top', 'status', 'quests', 'tree', 'log', 'achievements', 'party'];
const VOICE_TARGETS = {
  projects: ['projects', 'quests'],
  skills: ['skills', 'tree'],
  about: ['about', 'status'],
  journey: ['journey', 'log'],
  contact: ['contact', 'party'],
  top: ['top', 'a-top'],
};
const VOICE_LINES = {
  pro: {
    projects: 'Showing projects',
    skills: 'Showing skills',
    about: 'Showing about',
    journey: 'Showing journey',
    contact: 'Showing contact',
    top: 'Back to top',
  },
  anime: {
    projects: 'Opening the quest board!',
    skills: 'Opening the skill tree!',
    about: 'Status window open!',
    journey: 'Opening the adventure log!',
    contact: 'Party invite ready!',
    top: 'Back to the start!',
  },
};

function systemTheme() {
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export default function App() {
  const tier = useMemo(getTier, []);
  const [world, setWorld] = useState('pro');
  // the classroom guy's images only load once someone has actually visited the anime side
  const metAnime = useRef(false);
  if (world === 'anime') metAnime.current = true;
  const [Anime, setAnime] = useState(null);
  const [theme, setTheme] = useState(() => store.get('hp-theme') || systemTheme());
  const [toasts, setToasts] = useState([]);
  const [announce, setAnnounce] = useState('');

  const stageRef = useRef(null);
  const proRoot = useRef(null);
  const animeRoot = useRef(null);
  const fx = useRef({});
  const tl = useRef(null);
  const busy = useRef(false);
  const worldRef = useRef(world);
  worldRef.current = world;

  // theme: follow the system until the visitor picks one
  useEffect(() => {
    const saved = store.get('hp-theme');
    if (saved) document.documentElement.dataset.theme = saved;
    let mq;
    try { mq = window.matchMedia('(prefers-color-scheme: light)'); } catch { return undefined; }
    const onChange = () => { if (!store.get('hp-theme')) setTheme(systemTheme()); };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    store.set('hp-theme', next);
  };

  useEffect(() => {
    document.documentElement.dataset.world = world;
  }, [world]);

  const notify = useCallback((t) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((ts) => [...ts.slice(-2), { kind: 'info', ...t, id }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 3600);
  }, []);

  // achievement toasts only appear in the anime world
  useEffect(
    () =>
      onAchievement((id) => {
        if (worldRef.current !== 'anime') return;
        const a = achievementList.find((x) => x.id === id);
        if (!a) return;
        play('chime');
        notify({ kind: 'achievement', eyebrow: 'ACHIEVEMENT UNLOCKED', title: a.title });
      }),
    [notify],
  );

  const skip = useCallback(() => {
    tl.current?.timeScale(6);
  }, []);

  // ── pro → anime ──
  const goAnime = useCallback(
    (originEl) => {
      if (busy.current) return skip();
      busy.current = true;
      unlockAudio();
      play('whoosh');
      setAnnounce('Entering the anime side');
      const pending = loadAnime();
      const r = originEl?.getBoundingClientRect?.();
      const origin = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;

      tl.current = portalDive({
        tier,
        origin,
        stage: stageRef.current,
        proRoot: proRoot.current,
        fx: fx.current,
        swap: () =>
          pending.then((m) => {
            flushSync(() => {
              setAnime(() => m.default);
              setWorld('anime');
            });
            window.scrollTo(0, 0);
          }),
        land: () => {
          play('thud');
          if (tier === 'full' && animeRoot.current) shake(animeRoot.current);
          unlockAchievement('portal');
        },
        done: () => {
          busy.current = false;
          tl.current = null;
          setAnnounce('');
        },
      });
      return undefined;
    },
    [tier, skip],
  );

  // ── anime → pro ──
  const goPro = useCallback(() => {
    if (busy.current) return skip();
    busy.current = true;
    unlockAudio();
    play('rewind');
    setAnnounce('Waking up. Back to the professional side');
    const target = sectionMap.toPro[currentSection(ANIME_IDS)] || 'top';
    const calmColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();

    tl.current = wakeUp({
      tier,
      animeRoot: animeRoot.current,
      fx: fx.current,
      calmColor,
      swap: () => {
        flushSync(() => setWorld('pro'));
        if (target === 'top') window.scrollTo(0, 0);
        else document.getElementById(target)?.scrollIntoView({ block: 'start' });
      },
      done: () => {
        busy.current = false;
        tl.current = null;
        setAnnounce('');
      },
    });
    return undefined;
  }, [tier, skip]);

  // ── voice ──
  const onVoice = useCallback(
    ({ command, heard, error }) => {
      if (error) {
        const blocked = error === 'not-allowed' || error === 'service-not-allowed';
        notify({
          kind: 'error',
          title: blocked ? 'Microphone is blocked. Allow it in your browser to use voice.' : "Voice isn't available right now.",
        });
        return;
      }
      const w = worldRef.current;
      if (!command) {
        notify({ title: heard ? `Heard "${heard}". Try "show projects".` : 'Try "show projects".' });
        return;
      }
      if (command === 'switch') {
        if (w === 'pro') goAnime(null);
        else goPro();
        return;
      }
      if (command === 'resume') {
        downloadResume(profile.resume);
        if (w === 'anime') unlockAchievement('resume');
        notify({ title: w === 'anime' ? 'Legendary item obtained: resume!' : 'Downloading resume' });
        return;
      }
      const [proId, animeId] = VOICE_TARGETS[command];
      scrollToId(w === 'pro' ? proId : animeId);
      if (w === 'anime') play('blip');
      notify({ title: VOICE_LINES[w][command] });
    },
    [goAnime, goPro, notify],
  );
  const voice = useVoice(onVoice);

  // keep the pro side honest about being mounted on first paint
  useEffect(() => {
    document.documentElement.dataset.world = 'pro';
  }, []);

  return (
    <>
      <div className="stage" ref={stageRef}>
        {world === 'pro' && (
          <ProWorld
            rootRef={proRoot}
            onIsekai={goAnime}
            onPreload={loadAnime}
            voice={voice}
            theme={theme}
            onToggleTheme={toggleTheme}
            notify={notify}
          />
        )}
        {world === 'anime' && Anime && (
          <Anime rootRef={animeRoot} voice={voice} onWake={goPro} notify={notify} tier={tier} />
        )}
      </div>
      <TransitionLayer fxRef={fx} tier={tier} onSkip={skip} announce={announce} withGuy={metAnime.current} />
      <Toasts toasts={toasts} world={world} />
    </>
  );
}
