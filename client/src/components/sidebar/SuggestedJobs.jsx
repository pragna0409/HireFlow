import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, ArrowRight, ChevronRight } from 'lucide-react';
import { jobApi } from '../../api/job.api';
import useAuth from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

export default function SuggestedJobs({ collapsed }) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.skills?.length) { setLoading(false); return; }
    // Search using first 3 skills as query
    const q = user.skills.slice(0, 3).join(' ');
    jobApi.list({ q, limit: 4, status: 'open' })
      .then((res) => {
        const list = res?.data?.jobs || res?.data || res || [];
        setJobs(Array.isArray(list) ? list.slice(0, 4) : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.skills]);

  if (collapsed) return null;

  return (
    <div className="mx-3 mb-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 pt-3 pb-2">
        <Sparkles size={12} className="text-amber-500 shrink-0" />
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Suggested for you</p>
      </div>

      {loading ? (
        <div className="space-y-2 px-3 pb-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="px-3 pb-3">
          <p className="font-sans text-[11px] text-slate-400 leading-relaxed">
            Add skills to your profile to get job suggestions.
          </p>
          <Link to="/candidate/profile" className="mt-1.5 inline-flex items-center gap-0.5 font-mono text-[10px] text-indigo-500 hover:text-indigo-700">
            Update profile <ChevronRight size={10} />
          </Link>
        </div>
      ) : (
        <div className="space-y-1 px-2 pb-2">
          {jobs.map((job) => (
            <Link
              key={job._id}
              to={`/jobs/${job._id}`}
              className="group flex flex-col rounded-xl px-2.5 py-2 hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              <p className="font-sans text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {job.title}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {job.location && (
                  <span className="flex items-center gap-0.5 font-mono text-[9px] text-slate-400">
                    <MapPin size={8} />{job.location}
                  </span>
                )}
                {job.jobType && (
                  <span className="font-mono text-[9px] text-indigo-400">{job.jobType}</span>
                )}
              </div>
            </Link>
          ))}
          <Link
            to="/jobs"
            className="flex items-center gap-1 px-2.5 py-1.5 font-mono text-[10px] text-indigo-500 hover:text-indigo-700 transition-colors"
          >
            Browse all <ArrowRight size={10} />
          </Link>
        </div>
      )}
    </div>
  );
}
