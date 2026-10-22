import { shelf } from '../data/site.js';

// What I'm watching, reading and playing: text only, no cover art.
// Watching = tapes, reading = book spines, playing = game cartridges.
export default function Shelf() {
  return (
    <section id="shelf" className="a-wrap a-section">
      <h2 className="a-h2 on-dark">The Shelf</h2>
      <p className="shelf-sub">What's been keeping me up at night (besides bugs).</p>
      <div className="shelf">
        {shelf.map((g) => (
          <div key={g.id} className={`shelf-group shelf-${g.id}`}>
            <div className="shelf-label">
              <strong>{g.label}</strong>
              <span className="hud-label">{g.tag}</span>
            </div>
            <ul className="shelf-items">
              {g.items.map((it, n) => (
                <li key={it.title} className={`shelf-item c${n % 5}`}>
                  <span className="si-title">{it.title}</span>
                  {it.note && <span className="si-note">{it.note}</span>}
                </li>
              ))}
            </ul>
            <div className="shelf-plank" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
}
