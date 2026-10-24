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
  { group: 'Cloud & Tools', items: ['Docker', 'AWS', 'Git / GitHub', 'Maven', 'Vercel', 'Render', 'Neon'] },
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
      { name: 'React', detail: 'Redux Toolkit · MUI', host: 'Hosted on Vercel' },
      { name: 'Spring Boot API', detail: 'Spring Security · JWT', host: 'Hosted on Render', main: true },
      { name: 'PostgreSQL', detail: 'Flyway · JPA', host: 'Hosted on Neon' },
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
    live: 'https://hanumanth-ems.vercel.app',
    github: 'https://github.com/Hanumanth-Raghavendra/EMS_Full_Stack',
    deployNote: 'Deployed: React on Vercel, Spring Boot API on Render, PostgreSQL on Neon',
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

// hint = what the locked badge says; secret ones stay "???" until found
export const achievementList = [
  { id: 'portal', title: 'Found the other side', hint: "Get isekai'd" },
  { id: 'quests', title: 'Read every quest', hint: 'Open both quest logs' },
  { id: 'resume', title: 'Legendary drop', hint: 'Grab the resume' },
  { id: 'party', title: 'Party formed', hint: 'Send a party invite' },
  { id: 'voice', title: 'Spoke the incantation', hint: 'Use a voice command' },
  { id: 'nap', title: 'Caught napping', hint: 'Let him doze off, then wake him' },
  { id: 'boss', title: 'Bug squashed', hint: 'Win the boss fight' },
  { id: 'flawless', title: 'Flawless debug', hint: 'Win without losing a heart' },
  { id: 'lofi', title: 'Vibe check', hint: 'Turn on the lo-fi' },
  { id: 'night', title: 'Night owl', hint: 'Visit after dark' },
  { id: 'konami', title: 'Old-school code', hint: 'An old cheat code still works here', secret: true },
];

// The shelf (text only, no cover art). These lines are genres and games;
// swap in real titles any time, e.g. { title: 'Some Anime', note: 'rewatching' }.
export const shelf = [
  {
    id: 'watching',
    label: 'Watching',
    tag: 'ANIME',
    items: [{ title: 'Action' }, { title: 'Thriller' }, { title: 'Comedy' }, { title: 'Magic' }, { title: 'Adventure' }],
  },
  {
    id: 'reading',
    label: 'Reading',
    tag: 'WEBTOONS · MANGA',
    items: [{ title: 'Manhwa' }, { title: 'Manhua' }, { title: 'Manga' }],
  },
  {
    id: 'playing',
    label: 'Playing',
    tag: 'GAMES',
    items: [{ title: 'BGMI' }, { title: 'Call of Duty' }, { title: 'Chess', note: 'and cooking, off the board' }],
  },
];

// Boss fight question pool (Java / Spring / web). `a` = index of the right answer.
export const bossQuestions = [
  {
    q: 'Which Java collection refuses duplicate elements?',
    options: ['ArrayList', 'HashSet', 'LinkedList', 'ArrayDeque'],
    a: 1,
    why: 'A Set keeps only unique elements. HashSet uses hashCode() and equals() to spot duplicates.',
  },
  {
    q: 'What does final on a Java variable guarantee?',
    options: ["It can't be reassigned", "The object it points to can't change", "It's shared by all threads", "It's stored on the heap"],
    a: 0,
    why: 'final stops reassignment. The object itself can still be changed unless it is immutable.',
  },
  {
    q: "How do you compare two Strings' contents in Java?",
    options: ['a == b', 'a.equals(b)', 'a.compareTo(b) == 1', 'a.hashCode() == b.hashCode()'],
    a: 1,
    why: '== compares references; equals() compares the characters. Equal hash codes don’t guarantee equal strings.',
  },
  {
    q: 'Which Spring annotation writes every handler’s return value straight to the response body?',
    options: ['@Controller', '@RestController', '@Service', '@Repository'],
    a: 1,
    why: '@RestController is @Controller + @ResponseBody, so returned objects are serialised, usually to JSON.',
  },
  {
    q: 'What does @Autowired ask Spring to do?',
    options: ['Inject a matching bean', 'Create a database table', 'Start a new thread', "Cache the method's result"],
    a: 0,
    why: 'It’s dependency injection: Spring finds a bean of the required type and wires it in.',
  },
  {
    q: 'Which HTTP status code means a new resource was created?',
    options: ['200', '201', '204', '302'],
    a: 1,
    why: '201 Created. 204 means success with no response body.',
  },
  {
    q: "Which JPA annotation marks an entity's primary key?",
    options: ['@Id', '@Key', '@Primary', '@Column'],
    a: 0,
    why: '@Id marks the primary key (often with @GeneratedValue). @Primary is Spring’s way to prefer one bean.',
  },
  {
    q: 'Which SQL clause filters groups after GROUP BY?',
    options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'],
    a: 1,
    why: 'WHERE filters rows before grouping; HAVING filters the groups, e.g. HAVING COUNT(*) > 5.',
  },
  {
    q: 'Which React hook is meant for side effects like fetching data?',
    options: ['useState', 'useMemo', 'useEffect', 'useRef'],
    a: 2,
    why: 'useEffect runs after render, so it’s where fetching, subscriptions and timers go.',
  },
  {
    q: "What does a JWT's signature protect against?",
    options: ['Anyone reading the payload', 'Anyone tampering with the payload', 'The token ever expiring', 'SQL injection'],
    a: 1,
    why: 'A signed JWT’s payload is only Base64URL-encoded, so anyone can read it. The signature proves nobody changed it.',
  },
  {
    q: 'After adding Spring Security, the browser’s CORS preflights were blocked. Why?',
    options: [
      "Browsers don't allow CORS with JWT",
      'The OPTIONS preflight hit the security filters before reaching the controllers',
      'PostgreSQL blocked the port',
      "React can't send JSON headers",
    ],
    a: 1,
    why: 'Security filters ran first and rejected the preflight. Enabling CORS inside the Spring Security config fixed it: the real EMS boss fight.',
  },
  {
    q: 'Which of these is NOT a Java primitive type?',
    options: ['int', 'boolean', 'String', 'char'],
    a: 2,
    why: 'String is a class (java.lang.String). Java has 8 primitives, including int, boolean and char.',
  },
  {
    q: 'Average time complexity of HashMap.get()?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    a: 0,
    why: 'Constant time on average with a decent hash. Heavy collisions slow it down (Java 8+ turns long buckets into trees).',
  },
  {
    q: 'Which of these is a checked exception?',
    options: ['NullPointerException', 'IOException', 'ArithmeticException', 'ArrayIndexOutOfBoundsException'],
    a: 1,
    why: 'Checked exceptions must be caught or declared with throws. The other three extend RuntimeException.',
  },
  {
    q: 'Which HTTP method fully replaces a resource and is idempotent?',
    options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
    a: 1,
    why: 'Sending the same PUT twice has the same effect as once. POST isn’t idempotent; PATCH applies partial changes.',
  },
  {
    q: 'In Docker, what is a container?',
    options: ['A running instance of an image', 'A VM with its own kernel', 'A zipped source-code archive', 'A Kubernetes cluster'],
    a: 0,
    why: 'An image is the read-only template; a container is a running instance of it, sharing the host’s kernel.',
  },
];

// Which section on one side matches which on the other, so
// switching worlds keeps you in the same place.
export const sectionMap = {
  toAnime: { top: 'a-top', about: 'status', skills: 'tree', projects: 'quests', journey: 'log', now: 'shelf', contact: 'party' },
  toPro: {
    'a-top': 'top',
    status: 'about',
    quests: 'projects',
    boss: 'skills',
    tree: 'skills',
    log: 'journey',
    shelf: 'now',
    achievements: 'now',
    party: 'contact',
  },
};
