import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { notificationApi } from '../api/notification.api';
import { useAuthContext } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuthContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await notificationApi.list();
      const list = res?.data?.notifications || res?.data || [];
      setItems(Array.isArray(list) ? list : []);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    load();
    if (!isAuthenticated) return;
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [load, isAuthenticated]);

  const markRead = useCallback(async (id) => {
    setItems((s) => s.map((n) => ((n._id || n.id) === id ? { ...n, read: true } : n)));
    try {
      await notificationApi.markRead(id);
    } catch {
      /* ignore */
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setItems((s) => s.map((n) => ({ ...n, read: true })));
    try {
      await notificationApi.markAllRead();
    } catch {
      /* ignore */
    }
  }, []);

  const remove = useCallback(async (id) => {
    setItems((s) => s.filter((n) => (n._id || n.id) !== id));
    try {
      await notificationApi.remove(id);
    } catch {
      /* ignore */
    }
  }, []);

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ items, loading, unreadCount, refresh: load, markRead, markAllRead, remove }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationContext must be used within NotificationProvider');
  return ctx;
};
