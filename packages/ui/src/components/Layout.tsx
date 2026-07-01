import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className || ''}`}>
      {children}
    </div>
  );
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function Container({ children, className, maxWidth = 'xl' }: ContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 ${className || ''}`}>
      {children}
    </div>
  );
}

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            {title && <h1 className="text-3xl font-bold text-gray-900">{title}</h1>}
            {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
          </div>
          {children && <div>{children}</div>}
        </div>
      </div>
    </header>
  );
}

interface FooterProps {
  children?: React.ReactNode;
  className?: string;
}

export function Footer({ children, className }: FooterProps) {
  return (
    <footer className={`bg-white border-t border-gray-200 mt-auto ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children || (
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} PV Platform. All rights reserved.
          </p>
        )}
      </div>
    </footer>
  );
}

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function Section({ children, title, description, className }: SectionProps) {
  return (
    <section className={`py-12 ${className || ''}`}>
      {(title || description) && (
        <div className="mb-8">
          {title && <h2 className="text-3xl font-bold text-gray-900">{title}</h2>}
          {description && <p className="mt-2 text-lg text-gray-600">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 4 | 6 | 8;
}

export function Grid({ children, className, cols = 3, gap = 6 }: GridProps) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
  };

  const gapClasses = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <div className={`grid ${colsClasses[cols]} ${gapClasses[gap]} ${className || ''}`}>
      {children}
    </div>
  );
}