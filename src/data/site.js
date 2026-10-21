// ─────────────────────────────────────────────────────────────
// Single source of truth. Both worlds read from this file:
// update a project here once and it changes on the pro side AND
// on the anime side.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Hanumanth Raghavendra',
  shortName: 'Hanumanth R.',
  monogram: 'HR',
  handle: 'hackingPanda',
  role: 'Full-Stack Developer · Java · Spring Boot · React',
  tagline: 'I build software that listens, speaks, and ships.',
  email: 'raghavendra.boienpally@gmail.com',
  linkedin: 'https://www.linkedin.com/in/hanumanth-raghavendra/',
  github: 'https://github.com/Hanumanth-Raghavendra',
  resume: './resume/Hanumanth_Raghavendra_Resume.pdf',
  about: [
    "I'm Hanumanth, a full-stack developer who likes building things that matter beyond the demo. I work mostly with Java, Spring Boot and React, and my favourite build so far is Blind Coder, an AI coding environment that visually impaired developers can use entirely by voice.",
    'Currently interning at Winfo Solutions and learning Azure. Off the clock: chess, manga, anime, and cooking.',
  ],
};

export const skills = [
  { group: 'Languages', items: ['Java', 'JavaScript', 'Python', 'SQL', 'C'] },
  { group: 'Frontend', items: ['React', 'Redux Toolkit', 'Material UI', 'HTML5', 'CSS3'] },
  { group: 'Backend', items: ['Spring Boot', 'Spring Security', 'JPA / Hibernate', 'Node.js', 'REST APIs', 'JWT'] },
  { group: 'Database', items: ['PostgreSQL', 'Flyway'] },
  { group: 'Cloud & Tools', items: ['Docker', 'AWS', 'Git / GitHub', 'Maven', 'Vercel'] },
  { group: 'AI & Voice', items: ['Gemini API', 'Web Speech API'] },
  { group: 'Learning', items: ['Azure'] },
];

export const projects = [
  {
    id: 'blind-coder',
    name: 'Blind Coder',
    oneLiner: 'An AI coding environment you can use without ever seeing the screen.',
    problem: 'Nearly every coding tool assumes you can see. Blind Coder removes that dependency.',
    features: [
      'Speak a prompt, and Gemini 3.5 Flash writes the code',
      'Reads code back line by line with speech synthesis',
      'Runs JavaScript in the browser and Python via Pyodide',
      'Explains errors out loud, with distinct success and error tones',
      'Saves code in any language as files to your device',
    ],
    challenge:
      'Orchestrating five browser and AI technologies, and managing speech state (listening, thinking, speaking, running) so the app never talks over itself or listens to its own voice.',
    stack: ['React', 'Node.js', 'Gemini API', 'Web Speech API', 'Web Audio API', 'Pyodide'],
    live: 'https://blindcoder.vercel.app',
    sourceNote: 'Source available on request',
    // anime-side flavour
    objective: 'Build a coding environment people can use without seeing the screen.',
  },
  {
    id: 'ems',
    name: 'EMS · Employee Management System',
    shortName: 'EMS',
    oneLiner:
      'A full-stack HR platform with JWT security, role-based access, and eight management modules, replacing scattered spreadsheets with one secure app.',
    problem: 'Brings employees, attendance, leave, projects and users into one secure app instead of scattered spreadsheets.',
    architecture: [
      { name: 'React', detail: 'Redux Toolkit · MUI' },
      { name: 'Spring Boot API', detail: 'Spring Security · JWT', main: true },
      { name: 'PostgreSQL', detail: 'Flyway · JPA' },
    ],
    stats: [
      { value: '49', label: 'REST endpoints' },
      { value: '10', label: 'database tables' },
      { value: '8', label: 'modules' },
    ],
    modules: ['Employees', 'Users', 'Departments', 'Designations', 'Projects', 'Attendance', 'Leave', 'Audit logs'],
    challenge:
      "After adding Spring Security, the browser's preflight requests from React were blocked before reaching the controllers. Fixed by configuring CORS at the Spring Security level.",
    stack: ['React', 'Redux Toolkit', 'Material UI', 'Spring Boot', 'Spring Security', 'JWT', 'JPA / Hibernate', 'Flyway', 'PostgreSQL'],
    github: 'https://github.com/Hanumanth-Raghavendra/EMS_Full_Stack',
    objective: 'Bring an entire HR department into one secure app.',
  },
];

export const journey = [
  {
    when: 'Aug 2026 – Present',
    title: 'Intern, Technology Delivery',
    org: 'Winfo Solutions',
    detail:
      'Building approval-workflow prototypes with Node.js and PostgreSQL: multi-database setups, role-based access, audit logging, and approval notifications. Setting up and migrating cloud-hosted Postgres databases.',
    arc: 'ARC 3 · ONGOING',
    arcWhen: 'Aug 2026 – now',
  },
  {
    when: 'Oct 2024 – Aug 2026',
    title: 'Master of Computer Applications (MCA)',
    org: 'University College of Engineering, Osmania University',
    detail: 'CGPA 8.8',
    arc: 'ARC 2',
    arcWhen: '2024 – 2026',
  },
  {
    when: 'Sep 2021 – Aug 2024',
    title: 'B.Sc Computer Science',
    org: 'A.V. College of Arts, Science and Commerce',
    detail: 'CGPA 8.8',
    arc: 'ARC 1',
    arcWhen: '2021 – 2024',
  },
  {
    when: 'Dec 2021',
    title: 'Intern',
    org: 'Kalyani Rafael Advanced Systems',
    detail: 'Worked on assembling, programming and packaging pulse oximeters for a DRDO project.',
    arc: 'SIDE EPISODE',
    arcWhen: 'Dec 2021',
    arcTitle: 'Intern on a DRDO project',
  },
];

export const now = {
  updated: 'Oct 2026',
  items: [
    { label: 'Working', text: 'Interning at Winfo Solutions' },
    { label: 'Learning', text: 'Azure' },
    { label: 'Building', text: "This site (you're looking at it)" },
    { label: 'Playing', text: 'Chess' },
  ],
};

// ── anime side only ──────────────────────────────────────────
export const status = {
  name: 'hackingPanda',
  className: 'Full-Stack Developer',
  level: 22,
  sideQuests: ['Chess', 'Cooking', 'Manhwa & Manhua', 'Manga', 'Anime'],
  arena: 'Battle royale & FPS veteran',
  equipped: ['Java', 'Spring Boot', 'Spring Security', 'JPA / Hibernate', 'JWT', 'React', 'Redux Toolkit', 'Material UI', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Gemini API', 'Web Speech API', 'Python', 'C'],
};

export const skillTree = [
  { branch: 'Java path', nodes: ['Java', 'Spring Boot', 'Spring Security + JWT', 'JPA / Hibernate'] },
  { branch: 'Web path', nodes: ['JavaScript', 'React', 'Redux Toolkit · Material UI'] },
  { branch: 'Server', nodes: ['Node.js', 'REST APIs'] },
  { branch: 'Data', nodes: ['SQL', 'PostgreSQL', 'Flyway'] },
  { branch: 'Cloud', nodes: ['Docker · AWS', 'Azure'], learning: ['Azure'] },
  { branch: 'AI & Voice', nodes: ['Web Speech API', 'Gemini API'] },
];

export const dialogue = [
  'Oh. You found the crack. Most people just read the resume.',
  'Same guy, different world. Everything here is real, just dressed differently.',
  'Quests are my projects. The status window is me. Have a look around.',
];

export const achievementList = [
  { id: 'portal', title: 'Found the other side' },
  { id: 'quests', title: 'Read every quest' },
  { id: 'resume', title: 'Legendary drop' },
  { id: 'party', title: 'Party formed' },
];

// Which section on one side matches which on the other, so
// switching worlds keeps you in the same place.
export const sectionMap = {
  toAnime: { top: 'a-top', about: 'status', skills: 'tree', projects: 'quests', journey: 'log', now: 'status', contact: 'party' },
  toPro: { 'a-top': 'top', status: 'about', quests: 'projects', tree: 'skills', log: 'journey', achievements: 'journey', party: 'contact' },
};
