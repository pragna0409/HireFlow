import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ChevronDown, ChevronUp, Mail, MapPin, Briefcase,
  CheckCircle2, XCircle, FileText, User, Zap, BarChart3,
  ExternalLink, Star, AlertTriangle, Info,
} from 'lucide-react';
import { applicationApi } from '../../api/application.api';
import { jobApi } from '../../api/job.api';
import { scoreAll } from '../../utils/ats';
import Avatar from '../../components/ui/Avatar';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { buildResumeUrl, timeAgo } from '../../utils/formatters';
import toast from 'react-hot-toast';

const COLOR = {
  emerald: { ring: 'ring-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' },
  sky:     { ring: 'ring-sky-400',     bg: 'bg-sky-50 dark:bg-sky-500/10',         text: 'text-sky-700 dark:text-sky-400',         bar: 'bg-sky-500',     badge: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300' },
  amber:   { ring: 'ring-amber-400',   bg: 'bg-amber-50 dark:bg-amber-500/10',     text: 'text-amber-700 dark:text-amber-400',     bar: 'bg-amber-500',   badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' },
  orange:  { ring: 'ring-orange-400',  bg: 'bg-orange-50 dark:bg-orange-500/10',   text: 'text-orange-700 dark:text-orange-400',   bar: 'bg-orange-500',  badge: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300' },
  rose:    { ring: 'ring-rose-400',    bg: 'bg-rose-50 dark:bg-rose-500/10',       text: 'text-rose-700 dark:text-rose-400',       bar: 'bg-rose-500',    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300' },
};

function ScoreRing({ score, color, grade, size = 96 }) {
  const c = COLOR[color] || COLOR.amber;
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth="7" className="text-slate-100 dark:text-slate-800" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth="7"
          className={`transition-all duration-1000 ${c.bar.replace('bg-', 'stroke-')}`}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`font-serif text-2xl font-bold ${c.text}`}>{score}</span>
        <span className={`font-mono text-[10px] font-bold ${c.text}`}>{grade}</span>
      </div>
    </div>
  );
}

function MiniBar({ score, max, color }) {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;
  const c = COLOR[color] || COLOR.amber;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
        <motion.div
          className={`h-1.5 rounded-full ${c.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="font-mono text-[10px] text-slate-400 w-10 text-right">{score}/{max}</span>
    </div>
  );
}

function CandidateCard({ app, rank, job }) {
  const [open, setOpen] = useState(false);
  const [showResumeViewer, setShowResumeViewer] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewName, setPreviewName] = useState('');
  const { ats } = app;
  const candidate = app.candidate || {};
  const c = COLOR[ats.color] || COLOR.amber;
  const bd = ats.breakdown;

  const handleOpenResume = (url, name) => {
    setPreviewUrl(url);
    setPreviewName(name || 'Resume');
    setShowResumeViewer(true);
  };

  const handleCloseResume = () => {
    setShowResumeViewer(false);
    setPreviewUrl('');
    setPreviewName('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: rank * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all duration-200 ${open ? `border-${ats.color}-200 dark:border-${ats.color}-800/50 shadow-md` : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
    >
      {/* Header row */}
      <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setOpen(!open)}>
        {/* Rank */}
        <div className="hidden sm:flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
          <span className="font-mono text-[11px] font-bold text-slate-500">#{rank + 1}</span>
        </div>

        <Avatar name={candidate.name} size="md" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-serif text-sm font-bold text-slate-900 dark:text-white">{candidate.name || 'Candidate'}</p>
            <span className={`inline-flex items-center rounded-lg px-2 py-0.5 font-mono text-[10px] font-semibold ${c.badge}`}>
              {ats.label}
            </span>
            {rank === 0 && (
              <span className="inline-flex items-center gap-0.5 rounded-lg bg-amber-100 dark:bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400">
                <Star size={9} fill="currentColor" /> Top Pick
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-[11px] text-slate-400 font-mono">
            {candidate.email && <span className="flex items-center gap-1"><Mail size={10} />{candidate.email}</span>}
            {candidate.location && <span className="flex items-center gap-1"><MapPin size={10} />{candidate.location}</span>}
            {candidate.experience != null && <span className="flex items-center gap-1"><Briefcase size={10} />{candidate.experience} yrs exp</span>}
          </div>
        </div>

        {/* Score ring */}
        <ScoreRing score={ats.total} color={ats.color} grade={ats.grade} size={72} />

        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Quick bars */}
      <div className="px-4 pb-3 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2">
        {[
          { label: 'Skills', ...bd.skills },
          { label: 'Experience', ...bd.experience },
          { label: 'Keywords', ...bd.keywords },
          { label: 'Profile', ...bd.profile },
        ].map((item) => (
          <div key={item.label}>
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
            <MiniBar score={item.score} max={item.max} color={ats.color} />
          </div>
        ))}
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 dark:border-slate-800 p-5 space-y-5">

              {/* Skills breakdown */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1">
                    <CheckCircle2 size={11} className="text-emerald-500" /> Matched Skills ({bd.skills.matched.length})
                  </p>
                  {bd.skills.matched.length === 0 ? (
                    <p className="font-sans text-xs text-slate-400 italic">None matched</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {bd.skills.matched.map((sk) => (
                        <span key={sk} className="rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-2.5 py-1 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1">
                    <XCircle size={11} className="text-rose-400" /> Missing Skills ({bd.skills.missing.length})
                  </p>
                  {bd.skills.missing.length === 0 ? (
                    <p className="font-sans text-xs text-emerald-600 dark:text-emerald-400 font-medium">All skills covered ✓</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {bd.skills.missing.map((sk) => (
                        <span key={sk} className="rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 px-2.5 py-1 font-mono text-[10px] text-rose-600 dark:text-rose-400">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Experience + Keywords */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className={`rounded-xl p-3.5 ${c.bg}`}>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-1">Experience</p>
                  <p className={`font-serif text-xl font-bold ${c.text}`}>{bd.experience.candidate} <span className="text-sm font-normal">yrs</span></p>
                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">Required: {bd.experience.required}+ yrs</p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/60 dark:bg-slate-900/40">
                    <motion.div
                      className={`h-1.5 rounded-full ${c.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, bd.experience.required > 0 ? (bd.experience.candidate / bd.experience.required) * 100 : 100)}%` }}
                      transition={{ duration: 0.9 }}
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3.5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-1">Keyword Coverage</p>
                  <p className="font-serif text-xl font-bold text-slate-800 dark:text-slate-200">
                    {bd.keywords.hits}<span className="text-sm font-normal text-slate-400">/{bd.keywords.total}</span>
                  </p>
                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">keywords found in cover letter & bio</p>
                </div>
              </div>

              {/* Cover letter preview */}
              {app.coverLetter && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1">
                    <FileText size={11} /> Cover Letter
                  </p>
                  <p className="font-sans text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 line-clamp-4">
                    {app.coverLetter}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                {(app.resumeUrl || candidate.resumeUrl) && (
                  <button
                    type="button"
                    onClick={() => handleOpenResume(
                      buildResumeUrl(app.resumeUrl || candidate.resumeUrl),
                      candidate.name || 'Resume',
                    )}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                  >
                    <ExternalLink size={11} /> View Resume
                  </button>
                )}
                {candidate.email && (
                  <a
                    href={`mailto:${candidate.email}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                  >
                    <Mail size={11} /> Email
                  </a>
                )}
                <span className="ml-auto font-mono text-[10px] text-slate-400">Applied {timeAgo(app.createdAt)}</span>
                <Modal
                  open={showResumeViewer}
                  onClose={handleCloseResume}
                  title={`Resume preview — ${previewName}`}
                  description="Preview the file directly in the dashboard."
                  size="xl"
                  footer={
                    <button
                      type="button"
                      onClick={() => window.open(previewUrl, '_blank', 'noopener')}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                    >
                      Open in new tab
                    </button>
                  }
                >
                  {previewUrl ? (
                    previewUrl.toLowerCase().endsWith('.pdf') ? (
                      <iframe
                        src={previewUrl}
                        title={previewName}
                        className="w-full h-[60vh] rounded-2xl border border-slate-200 dark:border-slate-700"
                      />
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">Preview not available for this file type.</p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Use the button below to open it in a new tab.</p>
                      </div>
                    )
                  ) : (
                    <div className="p-6 text-center text-slate-500">Loading resume...</div>
                  )}
                </Modal>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ATSChecker() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [scored, setScored] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    Promise.all([
      jobApi.get(jobId),
      applicationApi.byJob(jobId),
    ])
      .then(([jobRes, appRes]) => {
        const j = jobRes?.data || jobRes;
        const apps = appRes?.data || appRes || [];
        setJob(j);
        setScored(scoreAll(Array.isArray(apps) ? apps : [], j));
      })
      .catch(() => toast.error('Failed to load ATS data'))
      .finally(() => setLoading(false));
  }, [jobId]);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'excellent', label: 'Excellent (80+)' },
    { key: 'good', label: 'Good (65+)' },
    { key: 'weak', label: 'Weak (<50)' },
  ];

  const visible = scored.filter((a) => {
    if (filter === 'excellent') return a.ats.total >= 80;
    if (filter === 'good') return a.ats.total >= 65 && a.ats.total < 80;
    if (filter === 'weak') return a.ats.total < 50;
    return true;
  });

  const avgScore = scored.length > 0
    ? Math.round(scored.reduce((s, a) => s + a.ats.total, 0) / scored.length)
    : 0;

  const dist = { excellent: 0, good: 0, partial: 0, weak: 0 };
  scored.forEach((a) => {
    if (a.ats.total >= 80) dist.excellent++;
    else if (a.ats.total >= 65) dist.good++;
    else if (a.ats.total >= 50) dist.partial++;
    else dist.weak++;
  });

  return (
    <div className="space-y-6">

      {/* Back */}
      <button
        onClick={() => navigate(`/recruiter/jobs/${jobId}/applicants`)}
        className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft size={13} /> Back to Applicants
      </button>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl shadow-xl shadow-indigo-300/30 dark:shadow-indigo-950/50"
      >
        <img src="/eb5bc71066a7309a504af7b3db8413c1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/90 via-indigo-900/85 to-blue-900/90" />
        <div className="relative p-7 text-white flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-indigo-200 mb-1">ATS Checker</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
              {loading ? 'Loading…' : job?.title || 'Job'}
            </h1>
            <p className="mt-1.5 font-sans text-sm text-indigo-100/75">
              {scored.length} candidate{scored.length !== 1 ? 's' : ''} ranked by compatibility score
            </p>
          </div>
          {!loading && scored.length > 0 && (
            <div className="flex gap-4 shrink-0">
              <div className="text-center">
                <p className="font-serif text-4xl font-bold text-white">{avgScore}</p>
                <p className="font-mono text-[10px] text-indigo-200 uppercase tracking-wider">Avg Score</p>
              </div>
              <div className="w-px bg-white/20" />
              <div className="text-center">
                <p className="font-serif text-4xl font-bold text-emerald-300">{dist.excellent}</p>
                <p className="font-mono text-[10px] text-indigo-200 uppercase tracking-wider">Excellent</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} className="h-28" />)}
        </div>
      ) : scored.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-16 text-center">
          <BarChart3 size={32} className="mx-auto mb-3 text-slate-300" />
          <p className="font-serif text-lg font-semibold text-slate-600 dark:text-slate-400">No applicants yet</p>
          <p className="font-sans text-sm text-slate-400 mt-1">Share the job posting to start receiving applications.</p>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {[
              { label: 'Excellent', count: dist.excellent, color: 'emerald', icon: CheckCircle2 },
              { label: 'Good', count: dist.good, color: 'sky', icon: Star },
              { label: 'Partial', count: dist.partial, color: 'amber', icon: AlertTriangle },
              { label: 'Weak', count: dist.weak, color: 'rose', icon: XCircle },
            ].map((item) => {
              const c = COLOR[item.color];
              return (
                <div key={item.label} className={`rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center gap-3`}>
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${c.bg}`}>
                    <item.icon size={16} className={c.text} />
                  </div>
                  <div>
                    <p className={`font-serif text-2xl font-bold ${c.text}`}>{item.count}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Info note */}
          <div className="flex items-start gap-2.5 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-3">
            <Info size={14} className="mt-0.5 shrink-0 text-indigo-500" />
            <p className="font-sans text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
              Scores are calculated from <strong>skills match (40pts)</strong>, <strong>experience level (20pts)</strong>, <strong>keyword density in cover letter & bio (25pts)</strong>, and <strong>profile completeness (15pts)</strong>. Click any card to expand the full breakdown.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-xl px-3.5 py-1.5 font-mono text-xs font-semibold transition-all ${
                  filter === f.key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
                }`}
              >
                {f.label}
                {f.key === 'all' && <span className="ml-1.5 opacity-60">{scored.length}</span>}
              </button>
            ))}
          </div>

          {/* Candidate cards */}
          <div className="space-y-3">
            {visible.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-10 text-center">
                <p className="font-sans text-sm text-slate-400">No candidates in this range.</p>
              </div>
            ) : (
              visible.map((app, i) => (
                <CandidateCard key={app._id || app.id} app={app} rank={i} job={job} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
