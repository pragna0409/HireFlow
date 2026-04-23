import { Filter, X } from 'lucide-react';
import SearchBar from '../common/SearchBar';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants';

export default function JobFilters({ filters, setFilters, onReset }) {
  const toggleJobType = (value) => {
    const set = new Set(filters.jobTypes || []);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    setFilters((f) => ({ ...f, jobTypes: Array.from(set) }));
  };

  return (
    <aside className="w-full lg:w-[280px] shrink-0">
      <div className="rounded-xl border border-slate-200 bg-white p-5 sticky top-20 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Filters</h3>
          </div>
          <button
            onClick={onReset}
            className="text-xs font-medium text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 dark:text-slate-400 dark:hover:text-white"
          >
            <X size={12} /> Clear
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-slate-300">
              Search
            </label>
            <div className="mt-2">
              <SearchBar
                value={filters.search || ''}
                onChange={(v) => setFilters((f) => ({ ...f, search: v }))}
                placeholder="Job title, keyword…"
                size="sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-slate-300">
              Location
            </label>
            <div className="mt-2">
              <Input
                value={filters.location || ''}
                onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                placeholder="City, country, or Remote"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-slate-300">
              Job Type
            </label>
            <div className="mt-2 space-y-1.5">
              {JOB_TYPES.map((t) => {
                const checked = (filters.jobTypes || []).includes(t.value);
                return (
                  <label
                    key={t.value}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-sm text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:bg-slate-800/60"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleJobType(t.value)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700"
                    />
                    <span>{t.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-slate-300">
              Experience Level
            </label>
            <div className="mt-2 space-y-1.5">
              <label className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-sm text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:bg-slate-800/60">
                <input
                  type="radio"
                  name="exp"
                  checked={!filters.experienceLevel}
                  onChange={() => setFilters((f) => ({ ...f, experienceLevel: '' }))}
                  className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700"
                />
                <span>Any</span>
              </label>
              {EXPERIENCE_LEVELS.map((e) => (
                <label
                  key={e.value}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-sm text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:bg-slate-800/60"
                >
                  <input
                    type="radio"
                    name="exp"
                    checked={filters.experienceLevel === e.value}
                    onChange={() => setFilters((f) => ({ ...f, experienceLevel: e.value }))}
                    className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700"
                  />
                  <span>{e.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-slate-300">
              Minimum Salary
            </label>
            <div className="mt-2">
              <input
                type="range"
                min="0"
                max="300000"
                step="10000"
                value={filters.minSalary || 0}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, minSalary: Number(e.target.value) }))
                }
                className="w-full accent-indigo-600"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>$0</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ${Number(filters.minSalary || 0).toLocaleString()}+
                </span>
                <span>$300k</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-slate-300">
              Skills
            </label>
            <div className="mt-2">
              <Input
                value={filters.skills || ''}
                onChange={(e) => setFilters((f) => ({ ...f, skills: e.target.value }))}
                placeholder="e.g. React, Node"
                helper="Comma separated"
              />
            </div>
          </div>

          <Button variant="secondary" fullWidth onClick={onReset}>
            Reset filters
          </Button>
        </div>
      </div>
    </aside>
  );
}
