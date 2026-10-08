import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi, setToken, clearToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verify stored session on startup
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await authApi.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          clearToken();
          setUser(null);
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err);
        clearToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authApi.login(email, password);
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: 'Login failed. Please check credentials.' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed.';
      return { success: false, error: message };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authApi.register(name, email, password);
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: 'Registration failed.' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed.';
      return { success: false, error: message };
    }
  };

  const loginAsDemo = async () => {
    try {
      setIsLoading(true);
      const res = await authApi.demoLogin();
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
      }
    } catch (err) {
      console.error('Demo login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
