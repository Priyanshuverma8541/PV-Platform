import { ReactNode } from 'react';

interface AuthShellProps {
  children: ReactNode;
}

function AuthShell({ children }: AuthShellProps) {
  return (
    <main>
      <section>{children}</section>
    </main>
  );
}

export default AuthShell;
