import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Briefcase, LayoutDashboard, FileText, Bookmark, User,
  Users, BarChart3, LogOut, Plus, Shield, Building2,
  ChevronRight, MessageSquare,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import SuggestedJobs from '../sidebar/SuggestedJobs';
import { messageApi } from '../../api/message.api';
import { cn } from '../../utils/cn';

function navFor(role) {
  if (role === 'admin') {
    return [
      { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
      { to: '/admin/users', label: 'Users', icon: Users },
      { to: '/admin/jobs', label: 'Jobs', icon: Briefcase },
      { to: '/jobs', label: 'Browse Jobs', icon: Building2 },
      { to: '/messages', label: 'Messages', icon: MessageSquare, badge: true },
    ];
  }
  if (role === 'recruiter') {
    return [
      { to: '/recruiter/dashboard', label: 'Overview', icon: LayoutDashboard },
      { to: '/recruiter/jobs', label: 'My Jobs', icon: Briefcase },
      { to: '/recruiter/jobs/new', label: 'Post a Job', icon: Plus },
      { to: '/jobs', label: 'Browse Jobs', icon: Building2 },
      { to: '/messages', label: 'Messages', icon: MessageSquare, badge: true },
    ];
  }
  return [
    { to: '/candidate/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/candidate/applications', label: 'Applications', icon: FileText },
    { to: '/candidate/saved', label: 'Saved Jobs', icon: Bookmark },
    { to: '/candidate/profile', label: 'Profile', icon: User },
    { to: '/jobs', label: 'Browse Jobs', icon: Building2 },
    { to: '/messages', label: 'Messages', icon: MessageSquare, badge: true },
  ];
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navFor(user?.role);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetch = () =>
      messageApi.unreadCount().then((r) => setUnread(r?.data?.count || 0)).catch(() => {});
    fetch();
    const id = setInterval(fetch, 10000);
    return () => clearInterval(id);
  }, [user]);

  const RoleBadge = () => (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
      <Shield size={10} /> {user?.role}
    </span>
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden dark:bg-slate-950/80"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 flex h-screen w-[260px] shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="px-5 h-16 flex items-center border-b border-slate-100 dark:border-slate-800/60">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group" aria-label="Home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-glow group-hover:scale-105 transition-transform">
              <Briefcase size={18} strokeWidth={2.5} />
            </span>
            <span className="font-serif text-base font-bold tracking-tight dark:text-white">HireFlow</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {items.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to !== '/messages'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all font-sans',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-indigo-600" />
                  )}
                  <Icon size={17} className={cn(isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400')} />
                  <span className="flex-1">{label}</span>
                  {badge && unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 font-mono text-[10px] font-bold text-white">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                  {isActive && !badge && <ChevronRight size={14} className="text-indigo-500" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Suggested jobs — candidates only */}
        {user?.role === 'candidate' && <SuggestedJobs />}

        {/* User footer */}
        <div className="border-t border-slate-100 p-3 dark:border-slate-800/60">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <Avatar name={user?.name} src={user?.avatarUrl} size="md" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate font-sans dark:text-white">{user?.name}</div>
              <RoleBadge />
            </div>
            <button
              onClick={logout}
              className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-rose-600 transition-colors dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-400"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="mt-2 w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex items-center gap-2 transition-colors dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
            >
              <BarChart3 size={14} /> View analytics
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
