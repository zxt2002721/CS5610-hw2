import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/user/isLoggedIn', { credentials: 'include' });
      const data = await res.json();
      if (data.loggedIn) {
        setUser({ username: data.username, wins: data.wins || 0 });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Session check failed', err);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const login = async (username, password) => {
    const res = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Unable to login');
    }
    const data = await res.json();
    setUser({ username: data.username, wins: data.wins || 0 });
  };

  const register = async (username, password) => {
    const res = await fetch('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Unable to register');
    }
    const data = await res.json();
    setUser({ username: data.username, wins: data.wins || 0 });
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  const value = {
    user,
    checking,
    login,
    register,
    logout,
    refreshSession: fetchSession,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
