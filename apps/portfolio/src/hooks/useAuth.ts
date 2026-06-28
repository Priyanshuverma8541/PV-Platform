import { useState } from 'react';
import { AuthResponse } from '../types/auth';

const STORAGE_KEY = 'pv_auth_token';

export function useAuth() {
  const [user, setUser] = useState<AuthResponse['user'] | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const signIn = (auth: AuthResponse) => {
    setUser(auth.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth.user));
    localStorage.setItem('pv_auth_token', auth.token);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('pv_auth_token');
  };

  return { user, signIn, signOut };
}
