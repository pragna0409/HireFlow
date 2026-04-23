import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, FileText, Bookmark, TrendingUp, ArrowRight,
  Clock, Upload, Trash2, ChevronRight,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { applicationApi } from '../../api/application.api';
import { resumeApi } from '../../api/resume.api';
import Badge from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { STATUS_STYLES } from '../../utils/constants';
import { timeAgo } from '../../utils/formatters';
import toast from 'react-hot-toast';

const up = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d, ease: [0.22, 1, 0.36, 1] },
});

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef();

  useEffect(() => {
    Promise.all([
      applicationApi.mine().catch(() => ({ data: [] })),
      resumeApi.list().catch(() => ({ data: [] })),
    ]).then(([appRes, resumeRes]) => {
      const list = appRes?.data || appRes || [];
      setApps(Array.isArray(list) ? list : []);
      const rv = resumeRes?.data || resumeRes || [];
      setResumes(Array.isArray(rv) ? rv : []);
      setLoading(false);
    });
  }, []);

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = file.name.replace(/\.[^.]+$/, '');
    setUploading(true);
    try {
      const res = await resumeApi.upload(file, name);
      setResumes(res?.data || []);
      toast.success('Resume uploaded');
    } catch (err) {
      toast.error(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteResume = async (id) => {
    try {
      const res = await resumeApi.remove(id);
      setResumes(res?.data || []);
      toast.success('Resume removed');
    } catch {
      toast.error('Failed to remove');
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'there';
  const recentApps = apps.slice(0, 4);

  const waitlistCount = apps.filter((a) => a.status === 'waitlist').length;

  const stats = [
    { label: 'Applied',   value: apps.length, icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'In Review', value: apps.filter((a) => ['under_review','shortlisted'].includes(a.status)).length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Waitlisted', value: waitlistCount, icon: Bookmark, color: 'text-slate-700', bg: 'bg-slate-100 dark:bg-slate-800/40' },
    { label: 'Hired',     value: apps.filter((a) => a.status === 'hired').length, icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} className="h-28" />)}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-auto">

        {/* [1] Hero — 8 cols */}
        <motion.div {...up(0)}
          className="col-span-2 lg:col-span-8 row-span-2 relative overflow-hidden rounded-3xl shadow-xl shadow-indigo-300/30 dark:shadow-indigo-950/50 min-h-[180px]"
        >
          <img src="/fdae61d27dc882e6f0cd48d9552bba9c.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/85 via-violet-900/75 to-indigo-900/80" />
          <div className="relative p-7 flex flex-col justify-between h-full text-white">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-indigo-200 mb-2">
                Candidate · Overview
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Hey, <span className="italic text-violet-200">{firstName}</span> 👋
              </h1>
              <p className="mt-2 font-sans text-sm text-indigo-100/75 max-w-xs">
                {apps.length === 0
                  ? 'Your journey starts here. Browse jobs and fire off that first application.'
                  : `You've got ${apps.length} application${apps.length > 1 ? 's' : ''} out there. Keep the momentum going.`}
              </p>
            </div>
            <div className="mt-5 flex gap-2 flex-wrap">
              <Link to="/jobs">
                <button className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white transition-all">
                  Browse Jobs <ArrowRight size={14} />
                </button>
              </Link>
              <Link to="/candidate/applications">
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 hover:bg-white/10 px-4 py-2 text-sm font-medium text-white/80 transition-all">
                  My Applications
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* [2] Stat tiles — 2 cols each, 2×2 */}
        {stats.map((s, i) => (
          <motion.div key={s.label} {...up(0.05 + i * 0.05)}
            className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-100 bg-white dark:bg-slate-900 dark:border-slate-800 p-4 flex flex-col gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${s.bg}`}>
              <s.icon size={15} className={s.color} />
            </div>
            <p className={`font-serif text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{s.label}</p>
          </motion.div>
        ))}

        {/* [3] Recent Applications — 7 cols */}
        <motion.div {...up(0.2)}
          className="col-span-2 lg:col-span-7 rounded-3xl border border-slate-100 bg-white dark:bg-slate-900 dark:border-slate-800 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white">Recent Applications</h2>
              <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Latest activity</p>
            </div>
            <Link to="/candidate/applications" className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
              View all <ChevronRight size={13} />
            </Link>
          </div>

          {recentApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Briefcase size={20} className="text-slate-400" />
              </div>
              <p className="font-serif text-base font-semibold text-slate-600 dark:text-slate-400">No applications yet</p>
              <p className="font-sans text-xs text-slate-400 mt-1">Start browsing and apply!</p>
              <Link to="/jobs" className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors">
                Browse Jobs <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentApps.map((app, idx) => {
                const s = STATUS_STYLES[app.status] || STATUS_STYLES.applied;
                return (
                  <motion.div key={app._id} {...up(0.22 + idx * 0.04)}
                    className="flex items-center gap-3 rounded-xl border border-slate-50 bg-slate-50/60 dark:bg-slate-800/40 dark:border-slate-800 px-4 py-3 hover:border-indigo-100 dark:hover:border-indigo-900 transition-all"
                  >
                    <div className={`h-2 w-2 rounded-full shrink-0 ${s.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-semibold text-slate-900 dark:text-white truncate">{app.job?.title || 'Job'}</p>
                      <p className="font-mono text-[10px] text-slate-400">{app.job?.recruiter?.company || app.job?.company || ''}</p>
                    </div>
                    <Badge className={`${s.bg} ${s.text} ${s.border} font-mono text-[10px] shrink-0`}>{s.label}</Badge>
                    <span className="font-mono text-[10px] text-slate-400 hidden sm:block shrink-0">{timeAgo(app.createdAt)}</span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* [4] Resume Vault — 5 cols */}
        <motion.div {...up(0.25)}
          className="col-span-2 lg:col-span-5 rounded-3xl border border-slate-100 bg-white dark:bg-slate-900 dark:border-slate-800 p-5 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white">Resume Vault</h2>
              <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                {resumes.length} version{resumes.length !== 1 ? 's' : ''} stored
              </p>
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
            >
              <Upload size={12} /> {uploading ? 'Uploading…' : 'Upload'}
            </button>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto max-h-52 pr-1">
            {resumes.length === 0 ? (
              <div
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 py-8 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <Upload size={20} className="text-slate-300 mb-2" />
                <p className="font-sans text-xs text-slate-400">Drop a PDF or Word file</p>
                <p className="font-mono text-[10px] text-slate-300 mt-0.5">Max 5MB</p>
              </div>
            ) : (
              resumes.map((r, i) => (
                <motion.div key={r._id} {...up(0.27 + i * 0.04)}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 group"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/20">
                    <FileText size={14} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{r.name}</p>
                    <p className="font-mono text-[10px] text-slate-400">{timeAgo(r.uploadedAt)}</p>
                  </div>
                  <a href={r.url} target="_blank" rel="noreferrer"
                    className="text-[10px] font-mono text-indigo-500 hover:text-indigo-700 hidden group-hover:block transition-all"
                  >View</a>
                  <button onClick={() => handleDeleteResume(r._id)}
                    className="rounded-lg p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* [5] Skills strip — full width */}
        {user?.skills?.length > 0 && (
          <motion.div {...up(0.3)}
            className="col-span-2 lg:col-span-12 rounded-3xl border border-slate-100 bg-white dark:bg-slate-900 dark:border-slate-800 px-5 py-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Your Skills</p>
              <Link to="/candidate/profile" className="font-mono text-[10px] text-indigo-500 hover:text-indigo-700">Edit →</Link>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.skills.map((sk) => (
                <span key={sk} className="rounded-lg bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 font-mono text-[10px] text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                  {sk}
                </span>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
