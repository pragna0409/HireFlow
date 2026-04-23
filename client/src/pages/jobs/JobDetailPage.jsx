import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Eye,
  Users,
  ArrowLeft,
  Bookmark,
  Send,
  Building2,
  Mail,
  MessageSquare,
  CheckCircle2,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { jobApi } from '../../api/job.api';
import { applicationApi } from '../../api/application.api';
import { resumeApi } from '../../api/resume.api';
import useAuth from '../../hooks/useAuth';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import Textarea from '../../components/ui/Textarea';
import { formatSalary, timeAgo } from '../../utils/formatters';
import { JOB_STATUS_STYLES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');

  useEffect(() => {
    setLoading(true);
    jobApi
      .get(id)
      .then((res) => {
        setJob(res?.data || res);
      })
      .catch(() => {
        toast.error('Job not found');
        navigate('/jobs', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // check saved
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'candidate') return;
    jobApi
      .mySaved()
      .then((res) => {
        const list = res?.data || res || [];
        if (Array.isArray(list)) {
          const ids = list.map((j) => j._id || j.id);
          setSaved(ids.includes(id));
        }
      })
      .catch(() => {});
    resumeApi.list().then((res) => {
      const list = res?.data || res || [];
      setResumes(Array.isArray(list) ? list : []);
      if (list.length > 0) setSelectedResume(list[0]._id);
    }).catch(() => {});
  }, [isAuthenticated, user?.role, id]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save jobs');
      return;
    }
    try {
      const res = await jobApi.toggleSave(id);
      setSaved(res?.data?.saved);
      toast.success(res?.data?.saved ? 'Job saved' : 'Job unsaved');
    } catch (err) {
      toast.error(err?.message || 'Failed');
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to apply');
      return;
    }
    setSubmitting(true);
    try {
      const chosen = resumes.find((r) => r._id === selectedResume);
      await applicationApi.apply({
        jobId: id,
        coverLetter,
        resumeUrl: chosen?.url || undefined,
      });
      setApplied(true);
      setApplyOpen(false);
      toast.success('Application submitted!');
    } catch (err) {
      toast.error(err?.message || 'Failed to apply');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" className="text-indigo-600" />
      </div>
    );
  }

  if (!job) return null;

  const company = job.company || job.recruiter?.company || 'Company';
  const recruiter = job.recruiter || {};
  const skills = Array.isArray(job.skillsRequired) ? job.skillsRequired : (Array.isArray(job.skills) ? job.skills : []);
  const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities : [];
  const status = JOB_STATUS_STYLES[job.status] || JOB_STATUS_STYLES.open;
  const salaryMin = job.salaryRange?.min || job.salaryMin;
  const salaryMax = job.salaryRange?.max || job.salaryMax;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Button
        as={Link}
        to="/jobs"
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft size={14} />}
        className="mb-4"
      >
        Back to jobs
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <Avatar name={company} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{job.title}</h1>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{company}</p>
                </div>
                <Badge
                  variant={job.status === 'open' ? 'emerald' : 'slate'}
                  className="text-xs"
                >
                  {status.label}
                </Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.location && (
                  <Badge variant="slate" leftIcon={<MapPin size={11} />}>
                    {job.location}
                  </Badge>
                )}
                {job.jobType && (
                  <Badge variant="indigo" leftIcon={<Briefcase size={11} />}>
                    {job.jobType}
                  </Badge>
                )}
                {(salaryMin || salaryMax) && (
                  <Badge variant="emerald" leftIcon={<DollarSign size={11} />}>
                    {formatSalary(salaryMin, salaryMax, job.currency || 'USD')}
                  </Badge>
                )}
                {job.experienceLevel && (
                  <Badge variant="violet">{job.experienceLevel}</Badge>
                )}
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {timeAgo(job.createdAt) || 'Recently'}
                </span>
                {job.views != null && (
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {job.views} views
                  </span>
                )}
                {job.applicationsCount != null && (
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {job.applicationsCount} applicants
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {isAuthenticated && user?.role === 'candidate' && (
              <>
                {applied ? (
                  <Button disabled leftIcon={<CheckCircle2 size={16} />} variant="subtle">
                    Applied
                  </Button>
                ) : (
                  <Button onClick={() => setApplyOpen(true)} leftIcon={<Send size={16} />}>
                    Apply Now
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={handleToggleSave}
                  leftIcon={<Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />}
                >
                  {saved ? 'Saved' : 'Save'}
                </Button>
              </>
            )}
            {!isAuthenticated && (
              <Button as={Link} to="/login" leftIcon={<Send size={16} />}>
                Sign in to Apply
              </Button>
            )}
            {isAuthenticated && user?.role === 'candidate' && (recruiter._id || recruiter.id || recruiter) && (
              <Button
                as={Link}
                to={`/messages/${recruiter._id || recruiter.id || recruiter}`}
                variant="ghost"
                leftIcon={<MessageSquare size={16} />}
              >
                Message recruiter
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Description</h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {responsibilities.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Responsibilities</h2>
                <ul className="space-y-2">
                  {responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={14} className="mt-0.5 text-emerald-500 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-lg text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20 transition-transform hover:-translate-y-0.5"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Posted by</h3>
              <div className="flex items-center gap-3">
                <Avatar name={recruiter.name || company} size="md" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{recruiter.name || company}</p>
                  {recruiter.company && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Building2 size={11} /> {recruiter.company}
                    </p>
                  )}
                </div>
              </div>
              {recruiter.bio && (
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{recruiter.bio}</p>
              )}
              {recruiter.location && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin size={11} /> {recruiter.location}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Apply Modal */}
      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title="Apply for this job"
        description={`${job.title} at ${company}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setApplyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} loading={submitting} leftIcon={<Send size={14} />}>
              Submit Application
            </Button>
          </>
        }
      >
        {/* Resume selector */}
        <div className="mb-4">
          <label className="block font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Resume
          </label>
          {resumes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-4 text-center">
              <FileText size={16} className="mx-auto mb-1.5 text-slate-300" />
              <p className="font-sans text-xs text-slate-400">No resumes uploaded yet.</p>
              <a href="/candidate/dashboard" className="mt-1 inline-block font-mono text-[11px] text-indigo-500 hover:underline">
                Upload from dashboard →
              </a>
            </div>
          ) : (
            <div className="relative">
              <select
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 pr-9 font-sans text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
                <option value="">Use profile resume (default)</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          )}
        </div>

        <Textarea
          label="Cover Letter (optional)"
          rows={5}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Tell the recruiter why you're a great fit for this role…"
        />
      </Modal>
    </div>
  );
}
