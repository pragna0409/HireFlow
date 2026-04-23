import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, Menu, X, LayoutDashboard } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import NotificationDropdown from '../common/NotificationDropdown';
import ThemeToggle from '../ui/ThemeToggle';
import { cn } from '../../utils/cn';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const dashPath =
    user?.role === 'admin'
      ? '/admin/dashboard'
      : user?.role === 'recruiter'
        ? '/recruiter/dashboard'
        : '/candidate/dashboard';

  const links = [
    { to: '/', label: 'Home' },
    { to: '/jobs', label: 'Jobs' },
    ...(isAuthenticated ? [{ to: dashPath, label: 'Dashboard' }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 dark:border-slate-800/60 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-glow group-hover:scale-105 transition-transform">
            <Briefcase size={18} strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">HireFlow</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-500/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <NotificationDropdown />
              <Link
                to={dashPath}
                className="flex items-center gap-2 rounded-lg pl-1 pr-2.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Avatar name={user?.name} size="sm" />
                <div className="hidden lg:flex flex-col leading-tight">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                    {user?.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {user?.role}
                  </span>
                </div>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign in
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/register')}
                leftIcon={<LayoutDashboard size={14} />}
              >
                Get started
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="px-4 py-3 space-y-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block px-3 py-2 rounded-lg text-sm font-medium',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 dark:border-slate-800/60">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar name={user?.name} />
                    <div>
                      <div className="text-sm font-semibold dark:text-white">{user?.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</div>
                    </div>
                  </div>
                  <Button variant="secondary" fullWidth onClick={logout}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => {
                      setMobileOpen(false);
                      navigate('/login');
                    }}
                  >
                    Sign in
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      setMobileOpen(false);
                      navigate('/register');
                    }}
                  >
                    Get started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
