import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type NavAction = {
  label: string;
  onClick?: () => void;
  href?: string;
  primary?: boolean;
};

export function PlatformShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <main className={`pv-platform-shell ${className}`.trim()}>
      <div className="pv-platform-noise" aria-hidden="true" />
      {children}
    </main>
  );
}

export function PlatformNav({ brand = 'PV.', actions = [] }: { brand?: string; actions?: NavAction[] }) {
  return (
    <nav className="pv-platform-nav">
      <button className="pv-platform-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        {brand.endsWith('.') ? <>{brand.slice(0, -1)}<span>.</span></> : brand}
      </button>
      <div className="pv-platform-nav-links">
        {actions.map((action) => action.href ? (
          <a key={action.label} className={action.primary ? 'is-primary' : ''} href={action.href} target="_blank" rel="noreferrer">
            {action.label}
          </a>
        ) : (
          <button key={action.label} className={action.primary ? 'is-primary' : ''} onClick={action.onClick}>
            {action.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export function PlatformSection({ children, id, className = '' }: { children: ReactNode; id?: string; className?: string }) {
  return <section id={id} className={`pv-platform-section ${className}`.trim()}>{children}</section>;
}

export function SectionHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <header className="pv-section-header">
      {eyebrow && <p className="pv-eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </header>
  );
}

export function PlatformCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <article className={`pv-platform-card ${className}`.trim()}>{children}</article>;
}

export function MetricGrid({ metrics }: { metrics: Array<{ label: string; value: ReactNode }> }) {
  return (
    <div className="pv-metric-grid">
      {metrics.map((metric) => (
        <article key={metric.label} className="pv-platform-card pv-metric-card">
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
        </article>
      ))}
    </div>
  );
}

export function HeroOrbit({ imageSrc, imageAlt, title, subtitle, chips = [] }: { imageSrc: string; imageAlt: string; title: string; subtitle: string; chips?: string[] }) {
  return (
    <div className="pv-hero-orbit" aria-label="Platform orbit visual">
      <div className="pv-orbit pv-orbit-one"><span /></div>
      <div className="pv-orbit pv-orbit-two"><span /></div>
      <div className="pv-orbit pv-orbit-three"><span /></div>
      <div className="pv-avatar-card">
        <img src={imageSrc} alt={imageAlt} />
        <div>
          <strong>{title}</strong>
          <small>{subtitle}</small>
        </div>
      </div>
      {chips.map((chip, index) => (
        <em key={chip} className={`pv-orbit-chip pv-orbit-chip-${index + 1}`}>{chip}</em>
      ))}
    </div>
  );
}

export function PlatformLink({ children, className = '', ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={`pv-action ${className}`.trim()} {...props}>{children}</a>;
}

export function PlatformButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`pv-action ${className}`.trim()} {...props}>{children}</button>;
}
