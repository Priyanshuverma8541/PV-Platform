import { Button } from '@pv/ui';

interface PVPlatformPageProps {
  userName: string;
  userEmail: string;
  onBackToPortfolio: () => void;
  onSignOut: () => void;
}

const buildHubUrl = 'https://build-hub-lake.vercel.app/';
const contactEmail = 'priyanshuverma62078@gmail.com';

const sectors = [
  'Startups',
  'Agencies',
  'Retail & Inventory',
  'CRM Teams',
  'Education',
  'Service Businesses',
  'Salesforce Clients',
  'AI Automation',
];

const roadmap = [
  {
    phase: 'Foundation',
    title: 'Platform Shell + Shared UI',
    text: 'One monorepo foundation, shared design system, centralized identity, and reusable platform components.',
  },
  {
    phase: 'Build Layer',
    title: 'BuildHub + Developer Collaboration',
    text: 'A place where developers can collaborate, build reusable modules, and support client projects together.',
  },
  {
    phase: 'Business Layer',
    title: 'PV Business Solutions',
    text: 'CRM, dashboards, customer portals, inventory, appointment systems, reports, analytics, and automation.',
  },
  {
    phase: 'Intelligence Layer',
    title: 'AI + Salesforce Automation',
    text: 'AI assistants, workflow automation, Salesforce integrations, smart reports, and sector-specific SaaS products.',
  },
];

const solutionCards = [
  ['CRM Systems', 'Customer management, lead pipelines, reports, reminders, and follow-up automation.'],
  ['Business Portals', 'Customer portals, employee portals, admin dashboards, and service booking systems.'],
  ['Salesforce Solutions', 'Apex, LWC, Flow, SOQL, REST APIs, Experience Cloud, and secure automation.'],
  ['AI Products', 'Chatbots, AI assistants, smart dashboards, workflow AI, and prompt-based automation.'],
  ['Digital Growth', 'Digital marketing, agency support, SEO direction, content systems, and customer acquisition.'],
  ['DigiTech Champions', 'A developer and marketing team model to help agencies deliver faster with reliable support.'],
];

function PVPlatformPage({ userName, userEmail, onBackToPortfolio, onSignOut }: PVPlatformPageProps) {
  return (
    <main className="pv-page">
      <div className="pv-page-bg" aria-hidden="true" />

      <header className="pv-page-header">
        <div className="pv-page-brand">
          <span>PV</span>
          <div>
            <strong>The PV Platform</strong>
            <small>Long-term vision dashboard</small>
          </div>
        </div>
        <nav className="pv-page-nav">
          <button onClick={onBackToPortfolio}>Main Portfolio</button>
          <a href={buildHubUrl} target="_blank" rel="noreferrer">BuildHub</a>
          <button onClick={onSignOut}>Sign Out</button>
        </nav>
      </header>

      <section className="pv-platform-hero">
        <div className="pv-platform-copy">
          <p className="pv-page-kicker">Welcome, {userName}</p>
          <h1>Building The PV Solution: a tech ecosystem for businesses, agencies, and developers.</h1>
          <p>
            You are signed in as <strong>{userEmail}</strong>. This page is the private platform vision zone: the place where The PV Platform, BuildHub, DigiTech Champions, Salesforce solutions, AI automation, and business systems connect into one long-term mission.
          </p>
          <div className="pv-platform-actions">
            <a href={buildHubUrl} target="_blank" rel="noreferrer">Open BuildHub</a>
            <a href={`mailto:${contactEmail}?subject=PV Platform Collaboration`}>Collaborate</a>
            <button onClick={onBackToPortfolio}>View Portfolio</button>
          </div>
        </div>
        <div className="pv-platform-orbit" aria-label="PV Platform ecosystem visual">
          <span className="orbit-ring ring-one" />
          <span className="orbit-ring ring-two" />
          <span className="orbit-ring ring-three" />
          <div className="orbit-core">PV</div>
          <em className="orbit-chip chip-a">CRM</em>
          <em className="orbit-chip chip-b">AI</em>
          <em className="orbit-chip chip-c">SaaS</em>
          <em className="orbit-chip chip-d">Salesforce</em>
        </div>
      </section>

      <section className="pv-platform-strip" aria-label="Platform sectors">
        {sectors.map((sector) => (
          <span key={sector}>{sector}</span>
        ))}
      </section>

      <section className="pv-platform-section">
        <p className="pv-page-kicker">Vision Roadmap</p>
        <h2>Platform-first growth, not feature-first chaos.</h2>
        <div className="pv-roadmap-grid">
          {roadmap.map((item, index) => (
            <article key={item.phase} className="pv-roadmap-card">
              <span>0{index + 1}</span>
              <p>{item.phase}</p>
              <h3>{item.title}</h3>
              <small>{item.text}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="pv-platform-section">
        <p className="pv-page-kicker">Solutions I want to provide</p>
        <h2>Technology for real business outcomes.</h2>
        <div className="pv-solution-grid">
          {solutionCards.map(([title, text]) => (
            <article key={title} className="pv-solution-card">
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pv-platform-statement">
        <p className="pv-page-kicker">Long-term mission</p>
        <blockquote>
          “The PV Platform is my foundation to establish The PV Solution — a technology solution ecosystem where developers collaborate, businesses get reliable systems, and every sector can access modern software, CRM, AI, and digital growth support.”
        </blockquote>
        <div className="pv-platform-actions center">
          <Button variant="primary" onClick={onBackToPortfolio}>Back to Portfolio</Button>
          <Button variant="secondary" onClick={onSignOut}>Sign Out</Button>
        </div>
      </section>
    </main>
  );
}

export default PVPlatformPage;
