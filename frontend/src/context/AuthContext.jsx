import { createContext, useContext, useEffect, useState } from 'react';
import {
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from '../api/client';
import { silentRefresh } from '../api/auth';

const AuthContext = createContext(null);

// Access tokens are kept in memory only (see client.js), so they don't
// survive a page reload. That means on every app startup we don't actually
// know yet whether the user is "logged in" — we only know whether a
// refresh token is sitting in localStorage. This provider resolves that
// ambiguity once, on mount, by attempting a silent refresh: if it succeeds,
// the user stays logged in across the reload; if it fails (no refresh
// token, or it's expired/blacklisted), they're treated as anonymous.
export function AuthProvider({ children }) {
  const [status, setStatus] = useState('checking'); // 'checking' | 'authenticated' | 'anonymous'

  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      setStatus('anonymous');
      return;
    }
    silentRefresh(refreshToken)
      .then((data) => {
        setAccessToken(data.access);
        if (data.refresh) setRefreshToken(data.refresh);
        setStatus('authenticated');
      })
      .catch(() => {
        clearTokens();
        setStatus('anonymous');
      });
  }, []);

  function login(accessToken, refreshToken) {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setStatus('authenticated');
  }

  function logout() {
    clearTokens();
    setStatus('anonymous');
  }

  return (
    <AuthContext.Provider value={{ status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
