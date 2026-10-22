import { useEffect, useId, useRef, useState } from 'react';
import { Close, Mic } from './Icons.jsx';
import { store } from '../lib/engine.js';

// A labelled voice control, because icon-only mics get ignored.
//   Mouse/keyboard: click to talk ("Try voice"), click again to stop.
//   Touch: press and hold to talk ("Hold to talk"), release to stop.
// While listening (and a few seconds after) a panel shows example commands;
// each one is also a button, so the commands work without a microphone too.
// A small bubble points the mic out once per world, on the first visit.
const CHIPS = {
  pro: [['projects', 'Show projects'], ['resume', 'Download resume'], ['switch', "Get isekai'd"]],
  anime: [['projects', 'Show quests'], ['boss', 'Boss fight'], ['resume', 'Download resume'], ['switch', 'Wake up']],
};
const HINT = { pro: 'show projects', anime: 'show quests' };

function touchFirst() {
  try { return window.matchMedia('(hover: none), (pointer: coarse)').matches; } catch { return false; }
}

export default function VoicePill({ voice, world, variant = 'nav', onCommand }) {
  const [panel, setPanel] = useState(false);
  const [hint, setHint] = useState(false);
  const [touch] = useState(touchFirst);
  const pointerType = useRef('mouse');
  const wrap = useRef(null);
  const closeTimer = useRef(0);
  const panelId = useId();

  // first visit: point the mic out once, then never again
  useEffect(() => {
    if (!voice.supported) return undefined;
    const key = `hp-vhint-${world}`;
    if (store.get(key)) return undefined;
    const show = setTimeout(() => {
      if (wrap.current?.offsetParent === null) return; // this copy is hidden at this screen size
      setHint(true);
      store.set(key, '1');
    }, world === 'pro' ? 3500 : 7000);
    const hide = setTimeout(() => setHint(false), world === 'pro' ? 14000 : 17500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [voice.supported, world]);

  // the panel lingers a little after listening ends, so the chips can be tapped
  useEffect(() => {
    clearTimeout(closeTimer.current);
    if (panel && !voice.listening) closeTimer.current = setTimeout(() => setPanel(false), touch ? 6000 : 4500);
    return () => clearTimeout(closeTimer.current);
  }, [panel, voice.listening, touch]);

  useEffect(() => {
    if (!panel) return undefined;
    const onDoc = (e) => {
      if (!wrap.current?.contains(e.target)) setPanel(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setPanel(false);
        voice.stop();
      }
    };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [panel, voice]);

  if (!voice.supported) return null;

  const begin = () => {
    setHint(false);
    setPanel(true);
    voice.start();
  };
  const onPointerDown = (e) => {
    pointerType.current = e.pointerType;
    if (e.pointerType === 'touch') {
      e.preventDefault();
      begin();
    }
  };
  const onPointerUp = (e) => {
    if (e.pointerType === 'touch') voice.stop();
  };
  const onClick = () => {
    if (pointerType.current === 'touch') return;
    if (voice.listening) voice.stop();
    else begin();
  };
  const runChip = (cmd) => {
    voice.stop();
    setPanel(false);
    onCommand(cmd);
  };

  const label = voice.listening ? 'Listening…' : touch ? 'Hold to talk' : 'Try voice';

  return (
    <div ref={wrap} className={`vp vp-${world} vp-${variant} ${hint ? 'has-hint' : ''}`}>
      <button
        type="button"
        className={`vp-btn voice-btn ${voice.listening ? 'is-listening' : ''}`}
        aria-pressed={voice.listening}
        aria-expanded={panel}
        aria-controls={panelId}
        aria-label={voice.listening ? 'Listening. Click to stop' : `${label}: voice commands`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onContextMenu={(e) => e.preventDefault()}
        onClick={onClick}
      >
        <Mic width={18} height={18} />
        <span className="vp-text">{label}</span>
      </button>

      {hint && !panel && (
        <div className="vp-hint" role="note">
          <span>
            Try saying <strong>“{HINT[world]}”</strong>
          </span>
          <button type="button" className="vp-hint-x" aria-label="Dismiss hint" onClick={() => setHint(false)}>
            <Close width={14} height={14} />
          </button>
        </div>
      )}

      {panel && (
        <div className="vp-panel" id={panelId}>
          <p className="vp-panel-title">{voice.listening ? 'Listening… say one of these:' : 'Say one, or tap it:'}</p>
          <ul className="vp-chips">
            {CHIPS[world].map(([cmd, text]) => (
              <li key={cmd}>
                <button type="button" className="vp-chip" onClick={() => runChip(cmd)}>
                  “{text}”
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
