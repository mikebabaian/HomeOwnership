import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, MeResponse } from '../lib/api';

interface AuthState {
  /** The currently authenticated user, or null when logged out / unknown */
  user: MeResponse | null;
  /** True while the initial token check is in progress */
  loading: boolean;
  /** Log in and store the JWT — returns the user profile */
  login: (email: string, password: string) => Promise<MeResponse>;
  /** Register a new account — returns the newly created userId */
  register: (email: string, password: string) => Promise<string>;
  /** Clear the stored token and reset state */
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for an existing token and try to load the user profile
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.auth
      .me()
      .then(setUser)
      .catch(() => {
        // Token expired / invalid — clear it
        api.auth.logout();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await api.auth.login(email, password);      // stores token in localStorage
    const profile = await api.auth.me();
    setUser(profile);
    return profile;
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const { userId } = await api.auth.register(email, password);
    return userId;
  }, []);

  const logout = useCallback(() => {
    api.auth.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to access auth state and actions. Must be used inside <AuthProvider>. */
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
