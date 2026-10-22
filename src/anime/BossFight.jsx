import { useRef, useState } from 'react';
import { bossQuestions } from '../data/site.js';
import { play } from '../lib/sound.js';
import { unlockAchievement } from '../lib/engine.js';
import { track } from '../lib/analytics.js';

// A small quiz battle: Java / Spring / web questions.
// Five right answers squash the bug; three wrong ones and it escapes.
const BOSS_HP = 5;
const HEARTS = 3;

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// shuffle the options too, keeping track of where the right one went
function deal() {
  return shuffle(bossQuestions).map((q) => {
    const order = shuffle(q.options.map((_, i) => i));
    return { ...q, options: order.map((i) => q.options[i]), a: order.indexOf(q.a) };
  });
}

function retrigger(el, cls) {
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth; // restart the CSS animation
  el.classList.add(cls);
}

export default function BossFight() {
  const [phase, setPhase] = useState('intro'); // intro | ask | answered | won | lost
  const [deck, setDeck] = useState([]);
  const [i, setI] = useState(0);
  const [hp, setHp] = useState(BOSS_HP);
  const [hearts, setHearts] = useState(HEARTS);
  const [picked, setPicked] = useState(null);
  const [hits, setHits] = useState(0);
  const arena = useRef(null);
  const boss = useRef(null);
  const panel = useRef(null);
  const firstOption = useRef(null);
  const resultBtn = useRef(null);

  // when the fight ends, keep the result (and its button) in view and focused
  const showResult = () =>
    requestAnimationFrame(() => {
      resultBtn.current?.focus({ preventScroll: true });
      const r = panel.current?.getBoundingClientRect();
      if (r && (r.top < 90 || r.bottom > window.innerHeight)) {
        panel.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    });

  const start = () => {
    setDeck(deal());
    setI(0);
    setHp(BOSS_HP);
    setHearts(HEARTS);
    setPicked(null);
    setPhase('ask');
    play('blip');
    requestAnimationFrame(() => firstOption.current?.focus({ preventScroll: true }));
  };

  const q = deck[i];
  const over = hp === 0 || hearts === 0;

  const answer = (k) => {
    if (phase !== 'ask') return;
    setPicked(k);
    setPhase('answered');
    if (k === q.a) {
      setHp((h) => h - 1);
      setHits((n) => n + 1);
      retrigger(boss.current, 'is-hit');
      play('hit');
    } else {
      setHearts((h) => h - 1);
      retrigger(arena.current, 'is-hurt');
      play('hurt');
    }
  };

  const next = () => {
    if (hp === 0) {
      setPhase('won');
      play('win');
      unlockAchievement('boss');
      if (hearts === HEARTS) unlockAchievement('flawless');
      track('boss', { result: 'won', hearts });
      showResult();
      return;
    }
    if (hearts === 0) {
      setPhase('lost');
      play('lose');
      track('boss', { result: 'lost' });
      showResult();
      return;
    }
    setI((n) => (n + 1) % deck.length);
    setPicked(null);
    setPhase('ask');
    play('blip');
    requestAnimationFrame(() => firstOption.current?.focus({ preventScroll: true }));
  };

  const right = picked !== null && q && picked === q.a;

  return (
    <section id="boss" className="a-wrap a-section">
      <div className="boss-head">
        <h2 className="a-h2 on-dark">Boss Fight</h2>
        <span className="hud-label">JAVA · SPRING · WEB</span>
      </div>

      <div className="arena" ref={arena}>
        <div className="boss-side">
          <div className="boss-bar">
            <span className="boss-name">THE FINAL BUG</span>
            <div className="hp" role="meter" aria-label="Boss health" aria-valuemin={0} aria-valuemax={BOSS_HP} aria-valuenow={hp}>
              <div className="hp-fill" style={{ width: `${(hp / BOSS_HP) * 100}%` }} />
            </div>
            <span className="hp-num">{hp * 20} / 100</span>
          </div>
          <div className={`boss ${phase === 'won' ? 'is-down' : ''} ${phase === 'lost' ? 'is-gone' : ''}`} ref={boss}>
            <BugBoss defeated={phase === 'won'} />
            {phase === 'answered' && right && (
              <span className="dmg" key={hits} aria-hidden="true">−20</span>
            )}
          </div>
        </div>

        <div className="battle paper" ref={panel}>
          <div className="battle-top">
            <span className="hearts" aria-label={`${hearts} of ${HEARTS} hearts left`}>
              {Array.from({ length: HEARTS }, (_, n) => (
                <Heart key={n} full={n < hearts} />
              ))}
            </span>
            {(phase === 'ask' || phase === 'answered') && <span className="q-count">ROUND {i + 1}</span>}
          </div>

          {phase === 'intro' && (
            <div className="battle-body">
              <p className="battle-title">A wild bug crawled out of production.</p>
              <p>Answer Java, Spring and web questions to hit it. Five hits squash it; three wrong answers and it escapes.</p>
              <button type="button" className="a-btn a-btn-gold big" onClick={start}>Start the fight ⚔</button>
            </div>
          )}

          {(phase === 'ask' || phase === 'answered') && q && (
            <div className="battle-body">
              <p className="battle-q">{q.q}</p>
              <ol className="options">
                {q.options.map((opt, k) => {
                  const state = phase === 'answered' ? (k === q.a ? 'is-right' : k === picked ? 'is-wrong' : 'is-dim') : '';
                  return (
                    <li key={opt}>
                      <button
                        type="button"
                        ref={k === 0 ? firstOption : undefined}
                        className={`option ${state}`}
                        onClick={() => answer(k)}
                        disabled={phase === 'answered'}
                      >
                        <span className="opt-key">{'ABCD'[k]}</span>
                        <span>{opt}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div aria-live="polite">
                {phase === 'answered' && (
                  <div className={`verdict ${right ? 'ok' : 'bad'}`}>
                    <strong>{right ? (hp === 0 ? 'Final blow!' : 'Critical hit! −20 HP') : 'Ouch. The bug strikes back.'}</strong>
                    <p>{q.why}</p>
                    <button type="button" className="a-btn a-btn-ink" onClick={next} autoFocus>
                      {over ? 'See result ▶' : 'Next ▶'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {phase === 'won' && (
            <div className="battle-body" aria-live="polite">
              <p className="battle-title">Bug squashed! 🎉</p>
              <p>{hearts === HEARTS ? 'Flawless: not a single heart lost.' : `Won with ${hearts} heart${hearts === 1 ? '' : 's'} to spare.`}</p>
              <button type="button" className="a-btn a-btn-gold" ref={resultBtn} onClick={start}>Fight again</button>
            </div>
          )}

          {phase === 'lost' && (
            <div className="battle-body" aria-live="polite">
              <p className="battle-title">The bug escaped… for now.</p>
              <p>Every senior dev has lost to a bug. Rematch?</p>
              <button type="button" className="a-btn a-btn-gold" ref={resultBtn} onClick={start}>Try again</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Heart({ full }) {
  return (
    <svg className={`heart ${full ? 'is-full' : ''}`} viewBox="0 0 24 22" width="26" height="24" aria-hidden="true">
      <path d="M12 21 L2.6 11.6 A5.6 5.6 0 0 1 12 3.6 A5.6 5.6 0 0 1 21.4 11.6 Z" />
    </svg>
  );
}

// An original monster: a chunky purple beetle with a code glyph on its shell.
function BugBoss({ defeated }) {
  return (
    <svg className="bug" viewBox="0 0 240 220" aria-hidden="true">
      <ellipse className="bug-shadow" cx="120" cy="206" rx="78" ry="9" />
      <g className="bug-float">
        <g className="bug-legs" fill="none" stroke="#7c5cd6" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M68 104 L34 86 L18 104" />
          <path d="M62 128 L26 132 L14 154" />
          <path d="M70 152 L40 172 L36 194" />
          <path d="M172 104 L206 86 L222 104" />
          <path d="M178 128 L214 132 L226 154" />
          <path d="M170 152 L200 172 L204 194" />
        </g>
        <g className="bug-antennae" fill="none" stroke="#7c5cd6" strokeWidth="5" strokeLinecap="round">
          <path d="M104 48 Q92 22 70 16" />
          <path d="M136 48 Q148 22 170 16" />
        </g>
        <circle className="spark" cx="68" cy="15" r="7" fill="#22d3ee" stroke="#0e0820" strokeWidth="3" />
        <circle className="spark" cx="172" cy="15" r="7" fill="#22d3ee" stroke="#0e0820" strokeWidth="3" />
        {/* shell */}
        <ellipse cx="120" cy="132" rx="72" ry="62" fill="#3b1d6e" stroke="#0e0820" strokeWidth="5" />
        <path d="M120 74 L120 192" stroke="#0e0820" strokeWidth="4" />
        <path d="M66 112 Q78 86 112 80" fill="none" stroke="#8b5cf6" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
        <path d="M174 112 Q162 86 128 80" fill="none" stroke="#8b5cf6" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
        <text x="120" y="152" textAnchor="middle" fontFamily="ui-monospace, monospace" fontWeight="700" fontSize="30" fill="#7cf7c9">{'{ }'}</text>
        <circle cx="86" cy="168" r="6" fill="#f472b6" opacity="0.8" />
        <circle cx="154" cy="168" r="6" fill="#f472b6" opacity="0.8" />
        {/* head */}
        <ellipse cx="120" cy="66" rx="40" ry="28" fill="#2a1650" stroke="#0e0820" strokeWidth="5" />
        {defeated ? (
          <g stroke="#ff4d8d" strokeWidth="5" strokeLinecap="round">
            <path d="M96 56 L110 70 M110 56 L96 70" />
            <path d="M130 56 L144 70 M144 56 L130 70" />
          </g>
        ) : (
          <g>
            <ellipse className="bug-eye" cx="103" cy="64" rx="10" ry="8" fill="#ff4d8d" />
            <ellipse className="bug-eye" cx="137" cy="64" rx="10" ry="8" fill="#ff4d8d" />
            <circle cx="106" cy="61" r="2.6" fill="#fff" />
            <circle cx="140" cy="61" r="2.6" fill="#fff" />
            <path d="M90 50 L114 58 M150 50 L126 58" stroke="#0e0820" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}
        {/* mandibles */}
        <path d="M104 88 Q96 102 108 108" fill="none" stroke="#0e0820" strokeWidth="6" strokeLinecap="round" />
        <path d="M136 88 Q144 102 132 108" fill="none" stroke="#0e0820" strokeWidth="6" strokeLinecap="round" />
      </g>
    </svg>
  );
}
