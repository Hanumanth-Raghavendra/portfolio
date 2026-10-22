// Voice commands with the browser's Web Speech API.
// Chrome, Edge and Safari support it; Firefox doesn't, so the mic hides there.
import { useCallback, useEffect, useRef, useState } from 'react';

const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

// Checked in order, so "wake up" wins over "up", "show status" maps to about, etc.
const COMMANDS = [
  ['switch', /\b(switch|isekai|wake up|other side|change mode|anime mode|normal mode)\b/],
  ['resume', /\b(resume|cv|curriculum)\b/],
  ['boss', /\b(boss|fight|battle|quiz)\b/],
  ['projects', /\b(projects?|quests?|work|portfolio)\b/],
  ['skills', /\b(skills?|skill tree|stack|tech)\b/],
  ['contact', /\b(contact|invite|email|message|hire|reach)\b/],
  ['journey', /\b(journey|experience|education|adventure|log|timeline)\b/],
  ['about', /\b(about|status|who are you|yourself)\b/],
  ['top', /\b(top|home|start|beginning)\b/],
];

export function matchCommand(phrases) {
  for (const p of phrases) {
    for (const [cmd, re] of COMMANDS) if (re.test(p)) return cmd;
  }
  return null;
}

export const voiceSupported = !!SR;

export function useVoice(onResult) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  const cbRef = useRef(onResult);
  useEffect(() => { cbRef.current = onResult; }, [onResult]);

  const stop = useCallback(() => {
    try { recRef.current?.stop(); } catch { /* already stopped */ }
  }, []);

  const start = useCallback(() => {
    if (!SR || recRef.current) return;
    let rec;
    try {
      rec = new SR();
    } catch {
      cbRef.current({ error: 'unavailable' });
      return;
    }
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    rec.continuous = false;
    rec.onresult = (e) => {
      const alts = Array.from(e.results[0]).map((a) => a.transcript.toLowerCase().trim());
      cbRef.current({ command: matchCommand(alts), heard: alts[0] || '' });
    };
    rec.onerror = (e) => {
      if (e.error !== 'aborted' && e.error !== 'no-speech') cbRef.current({ error: e.error });
    };
    rec.onend = () => {
      recRef.current = null;
      setListening(false);
    };
    try {
      rec.start();
      recRef.current = rec;
      setListening(true);
    } catch {
      cbRef.current({ error: 'unavailable' });
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { supported: !!SR, listening, start, stop };
}
