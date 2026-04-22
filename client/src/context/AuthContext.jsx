import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth.api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('hireflow_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('hireflow_token'));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('hireflow_token')));

  const persist = useCallback((u, t) => {
    if (u) localStorage.setItem('hireflow_user', JSON.stringify(u));
    else localStorage.removeItem('hireflow_user');
    if (t) localStorage.setItem('hireflow_token', t);
    else localStorage.removeItem('hireflow_token');
  }, []);

  const hydrate = useCallback(async () => {
    const t = localStorage.getItem('hireflow_token');
    if (!t) {
      setLoading(false);
      return;
    }
    try {
      const res = await authApi.me();
      const u = res?.data?.user || res?.data || null;
      if (u) {
        setUser(u);
        persist(u, t);
      }
    } catch {
      setUser(null);
      setToken(null);
      persist(null, null);
    } finally {
      setLoading(false);
    }
  }, [persist]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = useCallback(
    async (email, password) => {
      const res = await authApi.login({ email, password });
      const payload = res?.data || {};
      const t = payload.token;
      const u = payload.user || payload;
      setUser(u);
      setToken(t);
      persist(u, t);
      toast.success(`Welcome back, ${u?.name?.split(' ')[0] || 'there'}!`);
      return u;
    },
    [persist],
  );

  const register = useCallback(
    async (data) => {
      const res = await authApi.register(data);
      const payload = res?.data || {};
      const t = payload.token;
      const u = payload.user || payload;
      if (t && u) {
        setUser(u);
        setToken(t);
        persist(u, t);
      }
      toast.success('Account created! Welcome to HireFlow.');
      return u;
    },
    [persist],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    setUser(null);
    setToken(null);
    persist(null, null);
    toast.success('Signed out.');
  }, [persist]);

  const updateProfile = useCallback(
    async (data) => {
      const res = await authApi.updateProfile(data);
      const updated = res?.data?.user || res?.data || null;
      if (updated) {
        setUser(updated);
        persist(updated, token);
      }
      toast.success('Profile updated.');
      return updated;
    },
    [persist, token],
  );

  const hasRole = useCallback(
    (role) => {
      if (!user) return false;
      if (Array.isArray(role)) return role.includes(user.role);
      return user.role === role;
    },
    [user],
  );

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    hasRole,
    login,
    register,
    logout,
    updateProfile,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
