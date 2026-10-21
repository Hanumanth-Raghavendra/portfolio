import { useEffect, useRef, useState } from 'react';
import {
  profile,
  projects,
  journey,
  status,
  skillTree,
  dialogue,
  achievementList,
} from '../data/site.js';
import {
  downloadResume,
  getAchievements,
  markQuestRead,
  onAchievement,
  prefersReducedMotion,
  scrollToId,
  sendMessage,
  unlockAchievement,
} from '../lib/engine.js';
import { isSoundOn, onSoundChange, play, setSound } from '../lib/sound.js';
import Skyline from '../art/Skyline.jsx';
import SchoolGuy from '../art/SchoolGuy.jsx';
import Petals from '../art/Petals.jsx';
import VoiceButton from '../ui/VoiceButton.jsx';
import { Close, External, SoundOff, SoundOn } from '../ui/Icons.jsx';
import './anime.css';

const NAV = [
  ['status', 'Status'],
  ['quests', 'Quests'],
  ['tree', 'Skill Tree'],
  ['log', 'Adventure Log'],
  ['party', 'Party Invite'],
];

export default function AnimeWorld({ rootRef, voice, onWake, notify, tier }) {
  const [soundOn, setSoundOn] = useState(isSoundOn());
  useEffect(() => onSoundChange(setSoundOn), []);

  const toggleSound = () => {
    setSound(!soundOn);
    if (!soundOn) setTimeout(() => play('blip'), 30);
  };

  return (
    <div className="anime" ref={rootRef}>
      <header className="hud">
        <div className="a-wrap hud-row">
          <a href="#a-top" className="hud-logo">{status.name}</a>
          <nav className="hud-nav" aria-label="Areas">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => play('blip')}>{label}</a>
            ))}
          </nav>
          <div className="hud-actions">
            <button
              type="button"
              className="hud-icon"
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={soundOn ? 'Sound is on. Turn sound off' : 'Sound is off. Turn sound on'}
            >
              {soundOn ? <SoundOn /> : <SoundOff />}
            </button>
            <VoiceButton voice={voice} className="hud-icon hud-mic a-hide-mobile" />
            <button type="button" className="wake-btn" onClick={(e) => onWake(e.currentTarget)}>
              <span className="a-hide-mobile">Wake up to reality</span>
              <span className="a-show-mobile">Wake up</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <Landing tier={tier} />
        <Status />
        <Quests />
        <Tree />
        <Log />
        <Achievements />
        <Party notify={notify} />
      </main>

      <footer className="a-wrap a-footer">
        {voice.supported && (
          <div className="voice-hints">
            <span className="hud-label">VOICE · try saying</span>
            <ul>
              <li>"show projects"</li>
              <li>"show skills"</li>
              <li>"download resume"</li>
              <li>"switch mode"</li>
            </ul>
          </div>
        )}
        <button type="button" className="wake-btn wake-big" onClick={(e) => onWake(e.currentTarget)}>
          Wake up to reality
        </button>
      </footer>

      <VoiceButton voice={voice} className="a-fab a-show-mobile-grid" label="Hold to talk: voice commands" />
    </div>
  );
}

// ── landing scene + dialogue ────────────────────────────────
function Landing({ tier }) {
  const [line, setLine] = useState(0);
  const [shown, setShown] = useState('');
  const [open, setOpen] = useState(true);
  const text = dialogue[line];

  // typewriter, skipped for reduced motion
  useEffect(() => {
    if (prefersReducedMotion() || tier === 'calm') {
      setShown(text);
      return undefined;
    }
    setShown('');
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [text, tier]);

  const done = shown.length >= text.length;
  const last = line === dialogue.length - 1;

  const next = () => {
    play('blip');
    if (!done) {
      setShown(text);
      return;
    }
    if (last) {
      setOpen(false);
      scrollToId('status');
    } else {
      setLine((l) => l + 1);
    }
  };

  return (
    <section id="a-top" className="a-wrap landing">
      <div className="scene">
        <Skyline />
        <Petals count={tier === 'full' ? 18 : tier === 'lite' ? 8 : 0} />
        <div className="scene-guy">
          <SchoolGuy mood="idle" title="hackingPanda, a sleepy anime school guy with messy dark hair, sitting at his desk" />
        </div>
        <p className="scene-place">Hyderabad · golden hour</p>
        {open ? (
          <div className="dialogue">
            <span className="dialogue-name">{status.name}</span>
            <div className="dialogue-box">
              <p aria-live="polite">{shown}</p>
              <button type="button" className="a-btn a-btn-ink" onClick={next}>
                {!done ? 'Skip' : last ? 'Look around ↓' : 'Next ▶'}
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="a-btn a-btn-ink replay" onClick={() => { setLine(0); setOpen(true); }}>
            Talk again
          </button>
        )}
      </div>
    </section>
  );
}

// ── status window + lore ────────────────────────────────────
function Status() {
  const onResume = () => {
    downloadResume(profile.resume);
    unlockAchievement('resume');
  };
  return (
    <section id="status" className="a-wrap a-section status-row">
      <div className="status-window">
        <div className="status-head">
          <h2>STATUS</h2>
          <span>window</span>
        </div>
        <dl className="status-grid">
          <dt>NAME</dt><dd>{status.name}</dd>
          <dt>CLASS</dt><dd>{status.className}</dd>
          <dt>LEVEL</dt><dd>{status.level}</dd>
          <dt>SIDE QUESTS</dt><dd>{status.sideQuests.join(' · ')}</dd>
          <dt>ARENA</dt><dd>{status.arena}</dd>
        </dl>
        <div className="status-skills">
          <span className="hud-label">EQUIPPED SKILLS</span>
          <ul>
            {status.equipped.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      </div>
      <div className="paper lore">
        <h2 className="a-h2">Lore</h2>
        {profile.about.map((p) => <p key={p.slice(0, 16)}>{p}</p>)}
        <button type="button" className="a-btn a-btn-gold" onClick={onResume}>Download resume</button>
      </div>
    </section>
  );
}

// ── quest board + quest log ─────────────────────────────────
function Quests() {
  const dialogRef = useRef(null);
  const [active, setActive] = useState(null);

  const open = (p) => {
    play('blip');
    setActive(p);
    markQuestRead(p.id, projects.length);
    requestAnimationFrame(() => dialogRef.current?.showModal?.());
  };
  const close = () => dialogRef.current?.close?.();

  return (
    <section id="quests" className="a-wrap a-section">
      <div className="board">
        <h2 className="a-h2 on-dark">Guild Quest Board</h2>
        <div className="quest-row">
          {projects.map((p, i) => (
            <article key={p.id} className={`quest tilt-${i % 2 ? 'r' : 'l'}`}>
              <span className={`pin pin-${i % 2 ? 'cyan' : 'pink'}`} aria-hidden="true" />
              <span className="quest-badge">QUEST · CLEARED</span>
              <h3>{p.shortName || p.name}</h3>
              <div className="quest-field">
                <span className="quest-label">OBJECTIVE</span>
                <p>{p.objective}</p>
              </div>
              {p.stats ? (
                <div className="quest-loot">
                  {p.stats.map((s) => (
                    <div key={s.label}><strong>{s.value}</strong><span>{s.label.replace('REST ', '').replace('database ', '')}</span></div>
                  ))}
                </div>
              ) : (
                <div className="quest-field">
                  <span className="quest-label">GEAR USED</span>
                  <p>{p.stack.join(' · ')}</p>
                </div>
              )}
              <div className="quest-actions">
                <button type="button" className="a-btn a-btn-ink" onClick={() => open(p)}>Open quest log</button>
                {p.live && (
                  <a className="a-btn a-btn-cyan" href={p.live} target="_blank" rel="noreferrer">Live demo <External /></a>
                )}
                {p.github && (
                  <a className="a-btn a-btn-paper" href={p.github} target="_blank" rel="noreferrer">GitHub <External /></a>
                )}
                {p.sourceNote && <span className="quest-note">Source on request</span>}
              </div>
            </article>
          ))}
        </div>
      </div>

      <dialog ref={dialogRef} className="quest-log" aria-labelledby="quest-log-title" onClose={() => setActive(null)}>
        {active && (
          <div className="quest-log-inner">
            <div className="quest-log-head">
              <span className="quest-badge">QUEST LOG</span>
              <button type="button" className="hud-icon on-paper" onClick={close} aria-label="Close quest log">
                <Close />
              </button>
            </div>
            <h3 id="quest-log-title">{active.name}</h3>
            <p className="ql-lead">{active.oneLiner}</p>
            {active.features && (
              <div className="quest-field">
                <span className="quest-label">WHAT IT DOES</span>
                <ul>{active.features.map((f) => <li key={f}>{f}</li>)}</ul>
              </div>
            )}
            {active.modules && (
              <div className="quest-field">
                <span className="quest-label">MODULES · {active.stats.map((s) => `${s.value} ${s.label}`).join(' · ')}</span>
                <p>{active.modules.join(' · ')}</p>
              </div>
            )}
            <div className="quest-field boss">
              <span className="quest-label">BOSS FIGHT</span>
              <p>{active.challenge}</p>
            </div>
            <div className="quest-field">
              <span className="quest-label">GEAR USED</span>
              <p>{active.stack.join(' · ')}</p>
            </div>
            <div className="quest-actions">
              {active.live && <a className="a-btn a-btn-cyan" href={active.live} target="_blank" rel="noreferrer">Live demo <External /></a>}
              {active.github && <a className="a-btn a-btn-paper" href={active.github} target="_blank" rel="noreferrer">GitHub <External /></a>}
              {active.sourceNote && <span className="quest-note">{active.sourceNote}</span>}
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}

// ── skill tree ──────────────────────────────────────────────
function Tree() {
  return (
    <section id="tree" className="a-wrap a-section">
      <h2 className="a-h2 on-dark">Skill Tree</h2>
      <div className="tree">
        {skillTree.map((b) => (
          <div key={b.branch} className="branch">
            <span className="branch-name">{b.branch}</span>
            <ol className="branch-nodes">
              {b.nodes.map((n, i) => (
                <li key={n}>
                  <span className={`node ${b.learning?.includes(n) ? 'is-learning' : ''}`}>
                    {n}
                    {b.learning?.includes(n) && <span className="sr-only"> (still learning)</span>}
                  </span>
                  {i < b.nodes.length - 1 && <span className="node-arrow" aria-hidden="true">→</span>}
                </li>
              ))}
            </ol>
          </div>
        ))}
        <p className="tree-note">Dashed node = still learning.</p>
      </div>
    </section>
  );
}

// ── adventure log ───────────────────────────────────────────
function Log() {
  const arcs = [...journey].reverse(); // oldest first reads like a story
  const order = ['ARC 1', 'SIDE EPISODE', 'ARC 2', 'ARC 3 · ONGOING'];
  arcs.sort((a, b) => order.indexOf(a.arc) - order.indexOf(b.arc));
  return (
    <section id="log" className="a-wrap a-section">
      <h2 className="a-h2 on-dark">Adventure Log</h2>
      <ol className="arcs">
        {arcs.map((a) => (
          <li key={a.arc} className="paper arc">
            <span className="arc-chapter">{a.arc} · {a.arcWhen}</span>
            <strong>{a.arcTitle || a.title}</strong>
            <span>{a.org}</span>
            {a.detail.startsWith('CGPA') && <span className="arc-meta">{a.detail}</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}

// ── achievements shelf ──────────────────────────────────────
function Achievements() {
  const [got, setGot] = useState(getAchievements());
  useEffect(() => onAchievement(() => setGot(getAchievements())), []);
  return (
    <section id="achievements" className="a-wrap a-section">
      <div className="ach-head">
        <h2 className="a-h2 on-dark">Achievements</h2>
        <span className="ach-count">{got.length} / {achievementList.length}</span>
      </div>
      <ul className="ach-list">
        {achievementList.map((a) => {
          const has = got.includes(a.id);
          return (
            <li key={a.id} className={`ach ${has ? 'is-on' : ''}`}>
              <span className="ach-dot" aria-hidden="true" />
              <span>{has ? a.title : `${a.title} (locked)`}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ── party invite (contact) ──────────────────────────────────
function Party({ notify }) {
  const [state, setState] = useState('idle');
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState('sending');
    const res = await sendMessage({
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      message: String(fd.get('message') || ''),
    });
    if (res.ok) {
      setState('sent');
      form.reset();
      notify({ kind: 'info', eyebrow: 'PARTY INVITE', title: 'Quest accepted!' });
      unlockAchievement('party');
    } else {
      setState(res.reason === 'not-configured' ? 'not-configured' : 'error');
    }
  };

  return (
    <section id="party" className="a-wrap a-section party">
      <div className="party-copy">
        <h2 className="a-h2 on-dark">Send a party invite</h2>
        <p>Same contact form as the other side. It reaches the same inbox.</p>
        <p className="party-email">{profile.email}</p>
        <div className="party-links">
          <a className="a-btn a-btn-outline" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <External /></a>
          <a className="a-btn a-btn-outline" href={profile.github} target="_blank" rel="noreferrer">GitHub <External /></a>
        </div>
      </div>
      <form className="paper party-form" onSubmit={onSubmit}>
        <label htmlFor="p-name">Your name</label>
        <input id="p-name" name="name" type="text" autoComplete="name" required />
        <label htmlFor="p-email">Email</label>
        <input id="p-email" name="email" type="email" autoComplete="email" required />
        <label htmlFor="p-msg">Message</label>
        <textarea id="p-msg" name="message" rows={4} required />
        <button type="submit" className="a-btn a-btn-gold big" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send invite'}
        </button>
        {state === 'sent' && <p className="party-status ok">Invite sent. Expect a reply soon.</p>}
        {state === 'error' && <p className="party-status err">The invite didn't go through. Check your connection and try again.</p>}
        {state === 'not-configured' && (
          <p className="party-status err">The form isn't connected yet. Email {profile.email} instead.</p>
        )}
      </form>
    </section>
  );
}
