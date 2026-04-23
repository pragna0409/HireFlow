import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import NotificationDropdown from '../common/NotificationDropdown';
import Avatar from '../ui/Avatar';
import useAuth from '../../hooks/useAuth';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 dark:bg-slate-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-30 h-14 glass border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
          <button
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <NotificationDropdown />
            <Avatar name={user?.name} size="sm" />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
