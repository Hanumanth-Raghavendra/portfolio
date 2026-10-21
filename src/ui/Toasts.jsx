import { Trophy } from './Icons.jsx';

// Pro side: quiet status chips. Anime side: game-style toasts.
export default function Toasts({ toasts, world }) {
  return (
    <div className={`toasts toasts-${world}`} role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind}`}>
          {t.kind === 'achievement' && <Trophy className="toast-icon" />}
          <div className="toast-body">
            {t.eyebrow && <span className="toast-eyebrow">{t.eyebrow}</span>}
            <span className="toast-title">{t.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
