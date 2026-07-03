import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, login, register, getCurrentUser } from '@pv/api-client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('pv_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('pv_token');
      if (storedToken) {
        try {
          const response = await getCurrentUser();
          setUser(response.data.user);
        } catch (error) {
          // Token invalid, clear it
          localStorage.removeItem('pv_token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login({ email, password });
      const { user: userData, token: newToken } = response.data;
      
      setUser(userData);
      setToken(newToken);
      localStorage.setItem('pv_token', newToken);
      localStorage.setItem('pv_user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await register({ email, password, firstName, lastName });
      const { user: userData, token: newToken } = response.data;
      
      setUser(userData);
      setToken(newToken);
      localStorage.setItem('pv_token', newToken);
      localStorage.setItem('pv_user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pv_token');
    localStorage.removeItem('pv_user');
  };

  const value = {
    user,
    token,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};