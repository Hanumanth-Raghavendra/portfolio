import { useRef } from 'react';
import { Mic } from './Icons.jsx';

// Mouse/keyboard: click to start, click again to stop.
// Touch: press and hold to talk, release to stop.
export default function VoiceButton({ voice, className = '', label = 'Voice commands' }) {
  const pointerType = useRef('mouse');
  if (!voice.supported) return null;

  const onPointerDown = (e) => {
    pointerType.current = e.pointerType;
    if (e.pointerType === 'touch') {
      e.preventDefault();
      voice.start();
    }
  };
  const onPointerUp = (e) => {
    if (e.pointerType === 'touch') voice.stop();
  };
  const onClick = () => {
    if (pointerType.current === 'touch') return;
    if (voice.listening) voice.stop();
    else voice.start();
  };

  return (
    <button
      type="button"
      className={`voice-btn ${voice.listening ? 'is-listening' : ''} ${className}`}
      aria-label={voice.listening ? 'Listening. Click to stop' : label}
      aria-pressed={voice.listening}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onContextMenu={(e) => e.preventDefault()}
      onClick={onClick}
    >
      <Mic />
    </button>
  );
}
