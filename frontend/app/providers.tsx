'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, clearApiToken, loadStoredApiToken, setApiToken } from '@/app/lib/api';

type AuthUser = {
  userId: string;
  username: string;
  email: string;
  riskPreference?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = LoginPayload & {
  username: string;
  riskPreference?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const persistSession = (nextToken: string, nextUser: AuthUser) => {
    setToken(nextToken);
    setUser(nextUser);
    setApiToken(nextToken);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cryptosentinel_token', nextToken);
      window.localStorage.setItem('cryptosentinel_user', JSON.stringify(nextUser));
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await api.profile();
      const profile = response.data as AuthUser;
      setUser(profile);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('cryptosentinel_user', JSON.stringify(profile));
      }
    } catch {
      clearApiToken();
      setToken(null);
      setUser(null);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('cryptosentinel_token');
        window.localStorage.removeItem('cryptosentinel_user');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedToken = loadStoredApiToken();
    const storedUser = window.localStorage.getItem('cryptosentinel_user');

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser) as AuthUser);
        } catch {
          window.localStorage.removeItem('cryptosentinel_user');
        }
      }
      void refreshProfile();
      return;
    }

    setLoading(false);
  }, []);

  const login = async (payload: LoginPayload) => {
    const response = await api.login(payload);
    persistSession(response.data.token, response.data.user as AuthUser);
  };

  const register = async (payload: RegisterPayload) => {
    await api.register(payload);
    await login({ email: payload.email, password: payload.password });
  };

  const logout = () => {
    clearApiToken();
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('cryptosentinel_token');
      window.localStorage.removeItem('cryptosentinel_user');
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}