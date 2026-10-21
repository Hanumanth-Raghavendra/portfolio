import { useEffect, useRef, useState } from 'react';
import { profile, skills, projects, journey, now } from '../data/site.js';
import { copyText, downloadResume, sendMessage, store } from '../lib/engine.js';
import VoiceButton from '../ui/VoiceButton.jsx';
import { Arrow, Copy, Download, External, Menu, Close, Moon, Sun } from '../ui/Icons.jsx';
import './pro.css';

const NAV = [
  ['about', 'About'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['journey', 'Journey'],
  ['contact', 'Contact'],
];

export default function ProWorld({ rootRef, onIsekai, onPreload, voice, theme, onToggleTheme, notify }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isekai = (e) => {
    setMenuOpen(false);
    onIsekai(e.currentTarget);
  };

  return (
    <div className="pro" ref={rootRef}>
      <a className="skip-link" href="#about">Skip to content</a>

      <header className="pro-nav">
        <div className="wrap pro-nav-row">
          <a className="brand" href="#top" aria-label={`${profile.name}, back to top`}>
            <span className="brand-mark">{profile.monogram}</span>
            <span className="brand-name">{profile.name}</span>
          </a>
          <nav className="nav-links" aria-label="Sections">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`}>{label}</a>
            ))}
          </nav>
          <div className="nav-actions">
            <VoiceButton voice={voice} className="icon-btn hide-mobile" />
            <button
              type="button"
              className="icon-btn"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
            <button
              type="button"
              className="isekai-pill hide-mobile"
              onPointerEnter={onPreload}
              onFocus={onPreload}
              onClick={isekai}
            >
              Get isekai'd <Arrow width={16} height={16} />
            </button>
            <button
              type="button"
              className="icon-btn show-mobile"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
        <nav id="mobile-menu" className="mobile-menu" hidden={!menuOpen} aria-label="Sections">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <button type="button" className="isekai-pill" onPointerEnter={onPreload} onTouchStart={onPreload} onClick={isekai}>
            Get isekai'd <Arrow width={16} height={16} />
          </button>
        </nav>
      </header>

      <main>
        <Hero onIsekai={isekai} onPreload={onPreload} />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Now />
        <Contact notify={notify} />
      </main>

      <footer className="pro-footer">
        <div className="wrap footer-row">
          <span>© 2026 {profile.name}</span>
          <button type="button" className="footer-hint" onPointerEnter={onPreload} onFocus={onPreload} onClick={isekai}>
            There's another side to this site <Arrow width={14} height={14} />
          </button>
        </div>
      </footer>

      <VoiceButton voice={voice} className="voice-fab show-mobile" label="Hold to talk: voice commands" />
    </div>
  );
}

// ── hero ────────────────────────────────────────────────────
function Hero({ onIsekai, onPreload }) {
  const [nudge, setNudge] = useState(false);
  useEffect(() => {
    if (store.session.get('hp-nudged')) return undefined;
    const t = setTimeout(() => {
      setNudge(true);
      store.session.set('hp-nudged', '1');
    }, 15000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="top" className="hero wrap">
      <div className="hero-copy">
        <p className="eyebrow">{profile.role}</p>
        <h1 className="hero-name">
          <span>Hanumanth</span> <span>Raghavendra</span>
        </h1>
        <p className="hero-tagline">{profile.tagline}</p>
        <div className="hero-ctas">
          <a className="btn btn-primary" href="#projects">View projects</a>
          <a
            className="btn btn-ghost"
            href={profile.resume}
            download="Hanumanth_Raghavendra_Resume.pdf"
          >
            <Download width={18} height={18} /> Download resume
          </a>
        </div>
      </div>

      <div className="crack-card" onPointerEnter={onPreload} onTouchStart={onPreload}>
        <svg className="crack-svg" viewBox="0 0 380 420" preserveAspectRatio="none" aria-hidden="true">
          <path className="crack-glow-wide" d="M250 0 L228 92 L262 128 L214 196 L246 236 L196 300 L222 336 L188 420" />
          <path className="crack-glow" d="M250 0 L228 92 L262 128 L214 196 L246 236 L196 300 L222 336 L188 420" />
          <path className="crack-core" d="M250 0 L228 92 L262 128 L214 196 L246 236 L196 300 L222 336 L188 420" />
          <path className="crack-branch" d="M228 92 L196 104" />
          <path className="crack-branch" d="M214 196 L176 188" />
          <path className="crack-branch" d="M246 236 L272 246" />
        </svg>
        <span className="crack-petal p1" aria-hidden="true" />
        <span className="crack-petal p2" aria-hidden="true" />
        <span className="crack-petal p3" aria-hidden="true" />
        <span className="crack-petal p4" aria-hidden="true" />
        <div className="crack-cta">
          <span className="crack-label">there's another side to this site</span>
          <button type="button" className="isekai-pill isekai-big" onFocus={onPreload} onClick={onIsekai}>
            Get isekai'd <Arrow width={18} height={18} />
          </button>
        </div>
        {nudge && (
          <div className="nudge" role="note">
            psst… there's more.
            <button type="button" className="nudge-x" aria-label="Dismiss hint" onClick={() => setNudge(false)}>
              <Close width={14} height={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ── about ───────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="band">
      <div className="wrap about">
        <div className="about-copy">
          <SectionHead index="About" title="A developer who builds for real people" />
          {profile.about.map((p) => <p key={p.slice(0, 20)} className="lead">{p}</p>)}
        </div>
        <aside className="about-card" aria-label="Quick facts">
          <dl>
            <div><dt>Focus</dt><dd>Java · Spring Boot · React</dd></div>
            <div><dt>Education</dt><dd>MCA, Osmania University</dd></div>
            <div><dt>Currently</dt><dd>Intern, Winfo Solutions</dd></div>
            <div><dt>Also known as</dt><dd>{profile.handle}</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  );
}

function SectionHead({ index, title }) {
  return (
    <div className="section-head">
      <p className="eyebrow">{index}</p>
      <h2>{title}</h2>
    </div>
  );
}

// ── skills ──────────────────────────────────────────────────
function Skills() {
  return (
    <section id="skills" className="band">
      <div className="wrap">
        <SectionHead index="Skills" title="What I work with" />
        <div className="skill-table">
          {skills.map((g) => (
            <div key={g.group} className="skill-row">
              <span className="skill-group">{g.group}</span>
              <ul className="chips">
                {g.items.map((s) => <li key={s} className="chip">{s}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── projects ────────────────────────────────────────────────
function Projects() {
  const [bc, ems] = projects;
  return (
    <section id="projects" className="band">
      <div className="wrap">
        <SectionHead index="Projects" title="Selected work" />
        <div className="project-grid">
          <article className="project">
            <BlindCoderMock />
            <div className="project-head">
              <h3>{bc.name}</h3>
              <p>{bc.oneLiner}</p>
            </div>
            <ul className="feature-list">
              {bc.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <Challenge text={bc.challenge} />
            <ul className="tags">{bc.stack.map((s) => <li key={s}>{s}</li>)}</ul>
            <div className="project-links">
              <a className="btn btn-primary btn-sm" href={bc.live} target="_blank" rel="noreferrer">
                Live demo <External />
              </a>
              <span className="muted-note">{bc.sourceNote}</span>
            </div>
          </article>

          <article className="project">
            <div className="arch">
              <p className="arch-label">Architecture</p>
              <div className="arch-flow">
                {ems.architecture.map((n, i) => (
                  <div key={n.name} className="arch-step">
                    <div className={`arch-node ${n.main ? 'is-main' : ''}`}>
                      <strong>{n.name}</strong>
                      <span>{n.detail}</span>
                    </div>
                    {i < ems.architecture.length - 1 && <span className="arch-arrow" aria-hidden="true">→</span>}
                  </div>
                ))}
              </div>
              <div className="arch-stats">
                {ems.stats.map((s) => (
                  <div key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>
                ))}
              </div>
            </div>
            <div className="project-head">
              <h3>{ems.name}</h3>
              <p>{ems.oneLiner}</p>
            </div>
            <ul className="tags tags-outline">{ems.modules.map((m) => <li key={m}>{m}</li>)}</ul>
            <Challenge text={ems.challenge} />
            <div className="project-links">
              <a className="btn btn-ghost btn-sm" href={ems.github} target="_blank" rel="noreferrer">
                View on GitHub <External />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Challenge({ text }) {
  return (
    <div className="challenge">
      <p className="challenge-label">Hardest challenge</p>
      <p>{text}</p>
    </div>
  );
}

// A small, honest picture of what Blind Coder does: speak → code → read back.
function BlindCoderMock() {
  return (
    <div className="bc-mock" aria-hidden="true">
      <div className="bc-mic">
        <span className="bc-ring r1" />
        <span className="bc-ring r2" />
        <span className="bc-dot"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" /></svg></span>
      </div>
      <div className="bc-code">
        <span className="bc-said">“write a function that greets a user”</span>
        <code className="bc-line l1">function greet(name) {'{'}</code>
        <code className="bc-line l2">{'  return `Hello, ${name}!`;'}</code>
        <code className="bc-line l3">{'}'}</code>
        <span className="bc-status">Reading line 2 aloud</span>
      </div>
    </div>
  );
}

// ── journey ─────────────────────────────────────────────────
function Journey() {
  return (
    <section id="journey" className="band">
      <div className="wrap">
        <SectionHead index="Journey" title="Experience and education" />
        <ol className="timeline">
          {journey.map((j) => (
            <li key={j.when + j.org}>
              <span className="tl-dot" aria-hidden="true" />
              <span className="tl-when">{j.when}</span>
              <span className="tl-title">{j.title}</span>
              <span className="tl-org">{j.org}</span>
              <span className="tl-detail">{j.detail}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ── now ─────────────────────────────────────────────────────
function Now() {
  return (
    <section id="now" className="band">
      <div className="wrap">
        <div className="now-head">
          <SectionHead index="Now" title="What I'm up to" />
          <span className="now-updated">Last updated: {now.updated}</span>
        </div>
        <ul className="now-grid">
          {now.items.map((n) => (
            <li key={n.label}><span>{n.label}</span><strong>{n.text}</strong></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── contact ─────────────────────────────────────────────────
function Contact({ notify }) {
  const emailRef = useRef(null);
  const [status, setStatus] = useState('idle');

  const onCopy = async () => {
    const ok = await copyText(profile.email, emailRef.current);
    notify({ title: ok ? 'Email copied' : 'Email selected. Press Ctrl+C to copy' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus('sending');
    const res = await sendMessage({
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      message: String(fd.get('message') || ''),
    });
    if (res.ok) {
      setStatus('sent');
      e.target.reset?.();
    } else {
      setStatus(res.reason === 'not-configured' ? 'not-configured' : 'error');
    }
  };

  return (
    <section id="contact" className="band">
      <div className="wrap contact">
        <div className="contact-copy">
          <SectionHead index="Contact" title="Let's talk" />
          <p className="lead">Have a role, a project, or a question? Send a message and it lands straight in my inbox.</p>
          <p className="email-line">
            <span ref={emailRef} className="email-text">{profile.email}</span>
          </p>
          <div className="contact-links">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onCopy}>
              <Copy width={16} height={16} /> Copy email
            </button>
            <a className="btn btn-ghost btn-sm" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <External /></a>
            <a className="btn btn-ghost btn-sm" href={profile.github} target="_blank" rel="noreferrer">GitHub <External /></a>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => downloadResume(profile.resume)}>
              <Download width={16} height={16} /> Resume
            </button>
          </div>
        </div>
        <form className="contact-form" onSubmit={onSubmit}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="c-name">Name</label>
              <input id="c-name" name="name" type="text" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="c-email">Email</label>
              <input id="c-email" name="email" type="email" autoComplete="email" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="c-msg">Message</label>
            <textarea id="c-msg" name="message" rows={5} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          <FormStatus status={status} />
        </form>
      </div>
    </section>
  );
}

export function FormStatus({ status }) {
  if (status === 'sent') return <p className="form-status ok">Message sent. I'll get back to you soon.</p>;
  if (status === 'error') return <p className="form-status err">That didn't go through. Check your connection and try again, or email me directly.</p>;
  if (status === 'not-configured')
    return <p className="form-status err">The form isn't connected yet. Please email me directly at {profile.email}.</p>;
  return null;
}
