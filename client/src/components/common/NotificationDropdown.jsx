import { useEffect, useRef, useState } from 'react';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useNotifications from '../../hooks/useNotifications';
import { timeAgo } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export default function NotificationDropdown() {
  const { items, unreadCount, markRead, markAllRead, remove } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:text-slate-400"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[360px] rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden z-50 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800/60">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </p>
              </div>
              {items.length > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-[420px] overflow-y-auto">
              {items.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <Bell size={20} />
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No notifications</p>
                  <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
                    You will see updates about your applications here.
                  </p>
                </div>
              ) : (
                items.map((n) => {
                  const id = n._id || n.id;
                  return (
                    <div
                      key={id}
                      className={cn(
                        'group relative flex gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors dark:border-slate-800/50 dark:hover:bg-slate-800/50',
                        !n.read && 'bg-indigo-50/40 dark:bg-indigo-500/10',
                      )}
                    >
                      <div
                        className={cn(
                          'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                          n.read ? 'bg-slate-300 dark:bg-slate-600' : 'bg-indigo-500',
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate dark:text-white">
                          {n.title || n.message || 'Notification'}
                        </p>
                        {n.body && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 dark:text-slate-400">{n.body}</p>
                        )}
                        <p className="text-[11px] text-slate-400 mt-1 dark:text-slate-500">
                          {timeAgo(n.createdAt || n.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!n.read && (
                          <button
                            onClick={() => markRead(id)}
                            className="rounded-md p-1 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20"
                            aria-label="Mark read"
                          >
                            <Check size={13} />
                          </button>
                        )}
                        <button
                          onClick={() => remove(id)}
                          className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/20"
                          aria-label="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
