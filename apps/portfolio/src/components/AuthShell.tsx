import { ReactNode } from 'react';

interface AuthShellProps {
  children: ReactNode;
}

function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="auth-shell">
      <div className="auth-shell-bg" aria-hidden="true" />
      <section className="auth-card">{children}</section>
    </main>
  );
}

export default AuthShell;
