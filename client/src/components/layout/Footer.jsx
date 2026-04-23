import { Link } from 'react-router-dom';
import { Briefcase, Github, Twitter, Linkedin } from 'lucide-react';

const cols = [
  {
    title: 'Product',
    links: [
      { label: 'Browse Jobs', to: '/jobs' },
      { label: 'For Candidates', to: '/register' },
      { label: 'For Recruiters', to: '/register' },
      { label: 'Pricing', to: '/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/' },
      { label: 'Blog', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Press', to: '/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', to: '/' },
      { label: 'Community', to: '/' },
      { label: 'Guides', to: '/' },
      { label: 'API Docs', to: '/' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', to: '/' },
      { label: 'Terms', to: '/' },
      { label: 'Security', to: '/' },
      { label: 'Cookies', to: '/' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-glow">
                <Briefcase size={18} strokeWidth={2.5} />
              </span>
              <span className="text-lg font-bold tracking-tight">HireFlow</span>
            </Link>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
              The modern platform to connect talent with opportunity. Hire smarter. Apply faster.
            </p>
            <div className="mt-5 flex gap-2">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-800/60"
                  aria-label="social"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 dark:border-slate-800/60">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} HireFlow. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Made with care by the HireFlow team.</p>
        </div>
      </div>
    </footer>
  );
}
