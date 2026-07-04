import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  HeroOrbit,
  MetricGrid,
  PlatformButton,
  PlatformCard,
  PlatformLink,
  PlatformNav,
  PlatformSection,
  PlatformShell,
  SectionHeader,
} from '@pv/ui';
import '../portfolio.css';

interface Props {
  onLoginClick: () => void;
}

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      let current = 0;
      const step = Math.max(1, Math.ceil(target / 54));
      const timer = window.setInterval(() => {
        current = Math.min(current + step, target);
        setValue(current);
        if (current >= target) window.clearInterval(timer);
      }, 24);
    }, { threshold: 0.4 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{value}{suffix}</span>;
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.style.transitionDelay = `${delay}ms`;
      element.classList.add('pf-visible');
      observer.disconnect();
    }, { threshold: 0.16 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  return <div ref={ref} className={`pf-reveal ${className}`}>{children}</div>;
}

const skills = [
  ['Salesforce', ['Apex', 'LWC', 'SOQL', 'Flows', 'REST API', 'Experience Cloud', 'Admin']],
  ['Full Stack', ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Vite', 'Turborepo']],
  ['AI & Automation', ['LLM apps', 'Chatbots', 'Prompt engineering', 'Workflow AI', 'Smart dashboards']],
  ['Business Growth', ['CRM', 'Digital marketing', 'SEO', 'Agency support', 'Problem solving']],
] as const;

const projects = [
  {
    title: 'The PV Platform',
    type: 'Platform Vision',
    image: '/project3.png',
    problem: 'A scattered set of apps needed a stable foundation for auth, UI, business modules, and future developer collaboration.',
    solution: 'A platform-first monorepo with portfolio, API gateway, auth service, shared UI, BuildHub direction, and long-term PV Solution roadmap.',
    stack: ['React', 'Node.js', 'MongoDB', 'Turborepo', 'Shared UI'],
    demo: '#',
    github: 'https://github.com/Priyanshuverma8541/PV-Platform',
  },
  {
    title: 'BuildHub',
    type: 'Developer + Business Marketplace',
    image: '/project2.png',
    problem: 'Students, developers, and small businesses need one place to request, buy, and collaborate on practical projects.',
    solution: 'A marketplace and collaboration hub for ready-made projects, custom project requests, and developer teamwork.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Cloudinary'],
    demo: 'https://build-hub-lake.vercel.app/',
    github: 'https://github.com/Priyanshuverma8541',
  },
  {
    title: 'Savitri Livings',
    type: 'E-Commerce System',
    image: '/e-commerce.jpg',
    problem: 'A home decor business needed a digital storefront with scalable product, cart, and order flows.',
    solution: 'A modern commerce experience with product discovery, checkout direction, admin thinking, and growth-ready architecture.',
    stack: ['React', 'Node.js', 'MongoDB', 'Express'],
    demo: 'https://home-decor-inky.vercel.app/',
    github: 'https://github.com/Priyanshuverma8541/Home-Decor',
  },
];

const services = [
  ['Salesforce Solutions', 'Apex, LWC, Flow, Experience Cloud, REST integration, security, and admin automation.'],
  ['Business Portals', 'CRM, inventory, booking, employee portals, customer dashboards, analytics, and reports.'],
  ['AI Integration', 'Chatbots, workflow AI, prompt systems, smart assistants, and internal automation tools.'],
  ['Full Stack Development', 'MERN apps, APIs, auth, dashboards, deployment, maintenance, and scalable architecture.'],
  ['Digital Marketing', 'SEO direction, content systems, lead funnels, CRM strategy, and business growth support.'],
  ['Agency Team Support', 'DigiTech Champions provides development and marketing support for agencies and founders.'],
];

const roadmap = [
  ['Now', 'Stabilize PV Platform, portfolio, shared UI, auth, and BuildHub foundation.'],
  ['Next', 'Launch reusable CRM, dashboards, Salesforce modules, and project collaboration flows.'],
  ['Growth', 'Build DigiTech Champions into a dependable execution team for agencies and businesses.'],
  ['Long Term', 'Establish The PV Solution as a tech ecosystem for multiple business sectors.'],
];

export default function Portfolio({ onLoginClick }: Props) {
  const [activeSkill, setActiveSkill] = useState(0);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <PlatformShell className="pf-root">
      <PlatformNav
        brand="PV."
        actions={[
          { label: 'About', onClick: () => scrollTo('about') },
          { label: 'Projects', onClick: () => scrollTo('projects') },
          { label: 'Skills', onClick: () => scrollTo('skills') },
          { label: 'Services', onClick: () => scrollTo('services') },
          { label: 'Vision', onClick: () => scrollTo('vision') },
          { label: 'Developer Zone', onClick: onLoginClick, primary: true },
        ]}
      />

      <section className="pf-hero" id="hero">
        <div className="pf-hero-copy">
          <p className="pv-eyebrow">Priyanshu Verma · Founder of The PV Platform</p>
          <h1>I build Salesforce solutions, AI apps, and business systems that help companies grow.</h1>
          <p className="pf-hero-sub">
            I combine full stack development, CRM thinking, Salesforce, automation, and digital marketing to solve real business problems — not just ship screens.
          </p>
          <div className="pf-hero-actions">
            <PlatformLink className="is-primary" href="https://drive.google.com/file/d/1Eqpv_HShVqn8t-8zLncK85F0A2XdaZ8r/view?usp=sharing" target="_blank" rel="noreferrer">Download Resume</PlatformLink>
            <PlatformButton onClick={() => scrollTo('contact')}>Hire Me</PlatformButton>
            <PlatformButton onClick={() => scrollTo('projects')}>View Projects</PlatformButton>
          </div>
        </div>

        <HeroOrbit
          imageSrc="/pho.png"
          imageAlt="Priyanshu Verma"
          title="PV Solution"
          subtitle="CRM · AI · Salesforce · Web"
          chips={['Salesforce', 'AI Automation', 'BuildHub', 'CRM']}
        />
      </section>

      <MetricGrid
        metrics={[
          { label: 'Projects', value: <Counter target={14} suffix="+" /> },
          { label: 'Tech Skills', value: <Counter target={28} suffix="+" /> },
          { label: 'Teaching', value: <Counter target={4} suffix="+ yrs" /> },
          { label: 'Vision', value: <Counter target={2030} /> },
        ]}
      />

      <PlatformSection id="about">
        <Reveal>
          <SectionHeader
            eyebrow="Value proposition"
            title="I help founders, agencies, and businesses turn messy operations into scalable digital systems."
          />
        </Reveal>
        <div className="pf-value-grid">
          {[
            ['Build faster', 'Launch MVPs, dashboards, portals, and automation workflows with clean architecture.'],
            ['Automate work', 'Reduce manual follow-ups with CRM, Salesforce Flow, APIs, and AI assistants.'],
            ['Improve customers', 'Create portals, reports, and experiences that make users trust the business.'],
            ['Scale teams', 'Support agencies with DigiTech Champions for development and delivery capacity.'],
          ].map(([title, text], index) => (
            <Reveal key={title} delay={index * 90}>
              <PlatformCard className="pf-value-card">
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </PlatformCard>
            </Reveal>
          ))}
        </div>
      </PlatformSection>

      <PlatformSection id="projects">
        <Reveal>
          <SectionHeader eyebrow="Featured projects" title="Project work explained like business case studies." />
        </Reveal>
        <div className="pf-project-grid">
          {projects.map((project, index) => (
            <Reveal key={project.title} delay={index * 100}>
              <PlatformCard className="pf-project-card">
                <img src={project.image} alt={`${project.title} preview`} />
                <div className="pf-project-body">
                  <span>{project.type}</span>
                  <h3>{project.title}</h3>
                  <p><strong>Problem:</strong> {project.problem}</p>
                  <p><strong>Solution:</strong> {project.solution}</p>
                  <div className="pf-tags">{project.stack.map((item) => <em key={item}>{item}</em>)}</div>
                  <div className="pf-card-actions">
                    <PlatformLink className="is-primary" href={project.demo} target="_blank" rel="noreferrer">Demo</PlatformLink>
                    <PlatformLink href={project.github} target="_blank" rel="noreferrer">GitHub</PlatformLink>
                  </div>
                </div>
              </PlatformCard>
            </Reveal>
          ))}
        </div>
      </PlatformSection>

      <PlatformSection id="skills">
        <Reveal>
          <SectionHeader eyebrow="Technical stack" title="A practical skill graph for business, product, and automation work." />
        </Reveal>
        <PlatformCard className="pf-skill-shell">
          <div className="pf-skill-tabs">
            {skills.map(([category], index) => (
              <button key={category} className={activeSkill === index ? 'active' : ''} onClick={() => setActiveSkill(index)}>
                {category}
              </button>
            ))}
          </div>
          <div className="pf-skill-cloud">
            {skills[activeSkill][1].map((item) => <span key={item}>{item}</span>)}
          </div>
        </PlatformCard>
      </PlatformSection>

      <PlatformSection id="services">
        <Reveal>
          <SectionHeader eyebrow="Hire me for" title="Services designed around outcomes, not buzzwords." />
        </Reveal>
        <div className="pf-service-grid">
          {services.map(([title, text]) => (
            <PlatformCard className="pf-service-card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </PlatformCard>
          ))}
        </div>
      </PlatformSection>

      <PlatformSection id="vision">
        <Reveal>
          <SectionHeader eyebrow="The PV Platform vision" title="From personal portfolio to a developer-powered solution ecosystem." />
        </Reveal>
        <div className="pf-roadmap">
          {roadmap.map(([phase, text], index) => (
            <PlatformCard key={phase}>
              <span>0{index + 1}</span>
              <h3>{phase}</h3>
              <p>{text}</p>
            </PlatformCard>
          ))}
        </div>
      </PlatformSection>

      <PlatformSection id="contact" className="pf-contact-section">
        <Reveal>
          <PlatformCard className="pf-contact">
            <SectionHeader
              eyebrow="Work with me"
              title="I do not just write code. I understand businesses, build products, automate processes, and solve real problems."
              description="Whether you are a startup founder, agency, recruiter, or business owner, I can help you create software that produces measurable value."
            />
            <div className="pf-contact-actions">
              <PlatformLink className="is-primary" href="mailto:priyanshuverma62078@gmail.com?subject=Project inquiry for Priyanshu Verma">Start a Project</PlatformLink>
              <PlatformLink href="https://github.com/Priyanshuverma8541" target="_blank" rel="noreferrer">GitHub</PlatformLink>
              <PlatformButton onClick={onLoginClick}>Open Developer Zone</PlatformButton>
            </div>
          </PlatformCard>
        </Reveal>
      </PlatformSection>
    </PlatformShell>
  );
}
