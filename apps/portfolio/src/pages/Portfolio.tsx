import { useEffect, useRef, useState } from 'react';
import '../portfolio.css';

interface Props { onLoginClick: () => void; }

/* ── animated counter ── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = Math.ceil(target / 60);
      const t = setInterval(() => {
        start = Math.min(start + step, target);
        setVal(start);
        if (start >= target) clearInterval(t);
      }, 24);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── scroll reveal ── */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.transitionDelay = `${delay}ms`; el.classList.add('pf-visible'); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className={`pf-reveal ${className}`}>{children}</div>;
}

const SKILLS = [
  { cat: 'Salesforce', items: ['Apex', 'LWC', 'SOQL', 'Flows', 'REST API', 'Experience Cloud', 'Admin', 'Automation'] },
  { cat: 'Full Stack', items: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'REST APIs', 'Vite', 'Turborepo'] },
  { cat: 'AI & Automation', items: ['Gemini AI', 'Prompt Eng.', 'AI Integration', 'Workflow AI', 'LLM Apps', 'Chatbots'] },
  { cat: 'Business & Growth', items: ['CRM', 'Digital Marketing', 'SEO', 'Agency Ops', 'Client Mgmt', 'B2B Solutions'] },
  { cat: 'Tools & Infra', items: ['Git', 'Docker', 'Render', 'Vercel', 'MongoDB Atlas', 'Cloudinary', 'pnpm', 'Linux'] },
];

const PROJECTS = [
  {
    name: 'Savitri Livings',
    tag: 'E-Commerce Platform',
    color: '#7C3AED',
    problem: 'Home décor brand needed a scalable online store with smart cart and payment flow.',
    stack: ['React', 'Node.js', 'MongoDB', 'Express'],
    features: ['Guest checkout', 'Cart sync', 'Payment integration', 'Admin dashboard'],
    link: 'https://home-decor-inky.vercel.app/',
    github: 'https://github.com/Priyanshuverma8541/Home-Decor',
  },
  {
    name: 'IntegroHub',
    tag: 'Salesforce SaaS',
    color: '#00F5D4',
    problem: 'Businesses needed multi-tenant Salesforce OAuth integration without SOAP complexity.',
    stack: ['React', 'Node.js', 'Salesforce OAuth2', 'PKCE'],
    features: ['OAuth 2.0 + PKCE', 'Multi-tenant', 'REST API sync', 'Vercel + Render deploy'],
    link: '#',
    github: 'https://github.com/Priyanshuverma8541',
  },
  {
    name: 'BuildHub',
    tag: 'Project Marketplace',
    color: '#8B5CF6',
    problem: 'Students needed affordable production-ready academic projects, while small businesses needed a trusted platform to request custom web and software solutions.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    features: [
      'Ready-made project marketplace',
      'Custom project request system',
      'Admin CRM dashboard',
      'Order & lead management',
      'Cloudinary media uploads',
      'Email automation'
    ],
    link: '#',
    github: 'https://github.com/Priyanshuverma8541',
  },
  {
    name: 'CardioSense',
    tag: 'ML Health App',
    color: '#EF4444',
    problem: 'Hospitals needed an affordable heart disease prediction tool using patient data.',
    stack: ['Python', 'Flask', 'Scikit-learn', 'Cleveland UCI'],
    features: ['4 ML models', 'LR / RF / SVM / KNN', 'Web dashboard', '85%+ accuracy'],
    link: '#',
    github: 'https://github.com/Priyanshuverma8541',
  },
  {
    name: 'Aradhya Beauty',
    tag: 'Business Portal',
    color: '#EC4899',
    problem: 'Beauty parlour needed a full digital presence with booking and JWT auth.',
    stack: ['React', 'Node.js', 'MongoDB', 'JWT'],
    features: ['16-page frontend', 'JWT auth', 'Booking system', 'Service catalogue'],
    link: '#',
    github: 'https://github.com/Priyanshuverma8541',
  },
  {
    name: 'PV Platform',
    tag: 'Personal OS / SaaS',
    color: '#00F5D4',
    problem: 'Needed a unified monorepo ecosystem to house all apps, services, and tools.',
    stack: ['pnpm', 'Turborepo', 'React', 'Node.js', 'MongoDB', 'Docker'],
    features: ['Monorepo', 'Auth service', 'API gateway', 'Portfolio', '15+ apps planned'],
    link: '#',
    github: 'https://github.com/Priyanshuverma8541/PV-Platform',
  },
];

const SERVICES = [
  { icon: '☁️', title: 'Salesforce Development', desc: 'Apex, LWC, Flows, REST API, Experience Cloud, Admin & automation solutions.' },
  { icon: '🌐', title: 'Full Stack Web Apps', desc: 'MERN stack applications — from MVPs to production-grade multi-tenant SaaS.' },
  { icon: '🤖', title: 'AI Integration', desc: 'Embed Gemini / OpenAI into your product. Chatbots, workflow AI, smart dashboards.' },
  { icon: '📈', title: 'CRM & Business Portals', desc: 'Customer portals, inventory, loan management, analytics dashboards built to scale.' },
  { icon: '📣', title: 'Digital Marketing', desc: 'SEO, social strategy, content marketing, and growth systems for your brand.' },
  { icon: '🤝', title: 'Agency & Team Support', desc: 'I run DigiTech Champions — providing dev talent to agencies on a project basis.' },
];

const ROADMAP = [
  { phase: 'Now', color: '#00F5D4', items: ['PV Platform monorepo', 'Auth + API Gateway', 'Portfolio v2', 'Freelance clients'] },
  { phase: 'Next 6 Months', color: '#7C3AED', items: ['IntegroHub v2 launch', 'BuildHub marketplace', 'PV CRM module', 'Salesforce certifications'] },
  { phase: 'Year 1', color: '#F59E0B', items: ['PV Solutions agency', 'DigiTech Champions team', 'AI Studio module', '10+ business clients'] },
  { phase: 'Long-term', color: '#EC4899', items: ['PV Platform public launch', 'Sector-specific SaaS', 'Developer ecosystem', 'Series A vision'] },
];

export default function Portfolio({ onLoginClick }: Props) {
  const [activeSkill, setActiveSkill] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  /* smooth scroll */
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="pf-root">

      {/* ── NAV ── */}
      <nav className="pf-nav">
        <span className="pf-logo" onClick={() => scrollTo('hero')}>PV<span>.</span></span>
        <div className={`pf-nav-links ${menuOpen ? 'open' : ''}`}>
          {['hero', 'about', 'skills', 'projects', 'services', 'vision', 'contact'].map(s => (
            <button key={s} onClick={() => scrollTo(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
          <button className="pf-nav-cta" onClick={onLoginClick}>Login</button>
        </div>
        <button className="pf-hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="pf-hero" id="hero">
        {/* orbit rings */}
        <div className="pf-orbit-wrap" aria-hidden>
          <div className="pf-orbit pf-orbit-1"><div className="pf-dot" /></div>
          <div className="pf-orbit pf-orbit-2"><div className="pf-dot" /></div>
          <div className="pf-orbit pf-orbit-3"><div className="pf-dot" /></div>
          <div className="pf-avatar">
            <img src="/pho.png" alt="Priyanshu Verma" />
          </div>
        </div>

        <div className="pf-hero-text">
          <p className="pf-eyebrow">👋 Hey, I'm Priyanshu Verma</p>
          <h1 className="pf-hero-h1">
            I build <span className="pf-grad">Salesforce solutions</span>,<br />
            AI-powered apps &amp;<br />
            <span className="pf-grad">scalable business systems.</span>
          </h1>
          <p className="pf-hero-sub">
            Full-Stack Developer · Salesforce Dev · Digital Marketer · Founder of{' '}
            <strong>DigiTech Champions</strong> &amp; <strong>The PV Platform</strong>
          </p>
          <div className="pf-hero-btns">
            <a href="https://drive.google.com/file/d/1Eqpv_HShVqn8t-8zLncK85F0A2XdaZ8r/view?usp=sharing" className="pf-btn-primary" download>Download Resume</a>
            <button className="pf-btn-outline" onClick={() => scrollTo('contact')}>Hire Me</button>
            <button className="pf-btn-ghost" onClick={() => scrollTo('projects')}>View Projects</button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="pf-stats">
        {[
          { label: 'Projects Delivered', val: 10, suffix: '+' },
          { label: 'Years Experience', val: 3, suffix: '+' },
          { label: 'Years Teaching', val: 4, suffix: '+' },
          { label: 'Technologies', val: 20, suffix: '+' },
        ].map(s => (
          <div className="pf-stat" key={s.label}>
            <strong><Counter target={s.val} suffix={s.suffix} /></strong>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── VALUE PROP ── */}
      <section className="pf-value" id="about">
        <Reveal>
          <p className="pf-section-tag">What I solve</p>
          <h2 className="pf-section-h2">I help startups &amp; businesses</h2>
          <div className="pf-value-grid">
            {[
              { icon: '⚡', t: 'Build Faster', d: 'Ship production-ready apps in weeks, not months, with clean architecture from day one.' },
              { icon: '🔄', t: 'Automate Operations', d: 'Replace manual processes with Salesforce Flows, AI agents, and custom automation pipelines.' },
              { icon: '📊', t: 'Grow Revenue', d: 'CRM systems, customer portals, and data dashboards that drive real business results.' },
              { icon: '🌍', t: 'Scale Globally', d: 'Multi-tenant SaaS architecture that grows with your user base without re-writing the codebase.' },
            ].map((v, i) => (
              <Reveal key={v.t} delay={i * 80}>
                <div className="pf-value-card">
                  <span className="pf-val-icon">{v.icon}</span>
                  <h3>{v.t}</h3>
                  <p>{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── SKILLS ── */}
      <section className="pf-skills" id="skills">
        <Reveal>
          <p className="pf-section-tag">Tech Arsenal</p>
          <h2 className="pf-section-h2">Skills &amp; Technologies</h2>
        </Reveal>
        <div className="pf-skills-layout">
          <div className="pf-skill-cats">
            {SKILLS.map((s, i) => (
              <button
                key={s.cat}
                className={`pf-skill-cat ${activeSkill === i ? 'active' : ''}`}
                onClick={() => setActiveSkill(i)}
              >{s.cat}</button>
            ))}
          </div>
          <div className="pf-skill-tags">
            {SKILLS[activeSkill].items.map(item => (
              <span key={item} className="pf-tag">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="pf-projects" id="projects">
        <Reveal>
          <p className="pf-section-tag">Featured Work</p>
          <h2 className="pf-section-h2">Projects that solve real problems</h2>
        </Reveal>
        <div className="pf-proj-grid">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 60}>
              <div className="pf-proj-card" style={{ '--accent': p.color } as React.CSSProperties}>
                <div className="pf-proj-top">
                  <span className="pf-proj-tag" style={{ color: p.color }}>{p.tag}</span>
                  <h3>{p.name}</h3>
                  <p className="pf-proj-problem">{p.problem}</p>
                </div>
                <div className="pf-proj-stack">
                  {p.stack.map(t => <span key={t} className="pf-proj-tech">{t}</span>)}
                </div>
                <ul className="pf-proj-features">
                  {p.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <div className="pf-proj-links">
                  <a href={p.github} target="_blank" rel="noreferrer">GitHub →</a>
                  <a href={p.link} target="_blank" rel="noreferrer">Live →</a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="pf-services" id="services">
        <Reveal>
          <p className="pf-section-tag">What I offer</p>
          <h2 className="pf-section-h2">Services</h2>
        </Reveal>
        <div className="pf-svc-grid">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <div className="pf-svc-card">
                <span className="pf-svc-icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── VISION ── */}
      <section className="pf-vision" id="vision">
        <Reveal>
          <p className="pf-section-tag">The Big Picture</p>
          <h2 className="pf-section-h2">The PV Platform Vision</h2>
          <p className="pf-vision-sub">
            A unified tech ecosystem — built by developers, for businesses — across every sector.
          </p>
        </Reveal>
        <div className="pf-roadmap">
          {ROADMAP.map((r, i) => (
            <Reveal key={r.phase} delay={i * 100}>
              <div className="pf-rm-col">
                <div className="pf-rm-badge" style={{ background: r.color }}>{r.phase}</div>
                <div className="pf-rm-line" style={{ borderColor: r.color }} />
                <ul className="pf-rm-items">
                  {r.items.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="pf-digi-banner">
            <div>
              <h3>DigiTech Champions</h3>
              <p>My team providing development, marketing &amp; digital solutions to agencies and businesses worldwide.</p>
            </div>
            <button className="pf-btn-primary" onClick={() => scrollTo('contact')}>Collaborate With Us</button>
          </div>
        </Reveal>
      </section>

      {/* ── WHY ME ── */}
      <section className="pf-why">
        <Reveal>
          <blockquote className="pf-manifesto">
            "I don't just write code.<br />
            I understand businesses.<br />
            I build products.<br />
            I automate processes.<br />
            I solve <span className="pf-grad">real problems.</span>"
          </blockquote>
          <p className="pf-why-sub">
            Whether you're a startup founder, enterprise, agency, recruiter, or business owner —
            I focus on building software that creates <strong>measurable value</strong>.
          </p>
        </Reveal>
      </section>

      {/* ── CONTACT ── */}
      <section className="pf-contact" id="contact">
        <Reveal>
          <p className="pf-section-tag">Let's build together</p>
          <h2 className="pf-section-h2">Get in Touch</h2>
          <div className="pf-contact-grid">
            {[
              { label: 'Hire Me', icon: '💼', desc: 'Full-time or contract roles' },
              { label: 'Start a Project', icon: '🚀', desc: 'Have an idea? Let\'s build it' },
              { label: 'Salesforce Consulting', icon: '☁️', desc: 'Apex, LWC, integrations' },
              { label: 'Collaboration', icon: '🤝', desc: 'Dev partnerships & agency work' },
              { label: 'Digital Marketing', icon: '📣', desc: 'SEO, growth, content strategy' },
              { label: 'Book a Meeting', icon: '📅', desc: 'Let\'s schedule a call' },
            ].map(c => (
              <a key={c.label} href="mailto:priyanshuverma62078@gmail.com" className="pf-contact-card">
                <span>{c.icon}</span>
                <strong>{c.label}</strong>
                <p>{c.desc}</p>
              </a>
            ))}
          </div>
          <div className="pf-socials">
            <a href="https://github.com/Priyanshuverma8541" target="_blank" rel="noreferrer">GitHub</a>
            <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="#" target="_blank" rel="noreferrer">Twitter</a>
            <a href="mailto:priyanshuverma62078@gmail.com">Email</a>
          </div>
        </Reveal>
      </section>

      <footer className="pf-footer">
        <span>© 2025 Priyanshu Verma · The PV Platform</span>
        <span>DigiTech Champions 🚀</span>
      </footer>
    </div>
  );
}
