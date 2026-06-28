import { createContext, ReactNode, useEffect, useState } from 'react';
import { AuthResponse, UserProfile } from '../types/auth';

interface AuthContextValue {
  user: UserProfile | null;
  signIn: (auth: AuthResponse) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'pv_auth_user';
const TOKEN_KEY = 'pv_auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const signIn = (auth: AuthResponse) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth.user));
    localStorage.setItem(TOKEN_KEY, auth.token);
    setUser(auth.user);
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export { AuthContext };
