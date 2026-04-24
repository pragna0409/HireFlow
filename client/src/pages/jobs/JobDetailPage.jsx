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
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
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
        title="Application form"
        description={`${job.title} | ${company} | ${job.location || 'Remote'} | ${job.jobType || 'Full-time'}`}
        size="xl"
        footer={
          <div className="flex w-full justify-between items-center">
            <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">18% complete</div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setApplyOpen(false)}>
                Close
              </Button>
              <Button onClick={handleApply} loading={submitting} leftIcon={<Send size={14} />}>
                Submit Application
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-8">
          {/* Section 1: Personal Information */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">Personal Information</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Basic identity and contact details used for the application.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" required placeholder="John Doe" />
              <Input label="Date of Birth" required type="date" placeholder="dd-mm-yyyy" />
              <Select label="Gender" required options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
                { value: 'prefer_not_to_say', label: 'Prefer not to say' }
              ]} placeholder="Select gender" />
              <Input label="Mobile Number" required placeholder="+91 xxxxxxxxxx" />
              <Input label="Email Address" required type="email" placeholder="john@example.com" />
              <Input label="Nationality" required placeholder="Indian" defaultValue="Indian" />
              <div className="md:col-span-2">
                <Textarea label="Address" required rows={2} placeholder="Full address" />
              </div>
              <Input label="PAN / Aadhaar" required placeholder="ID Number" />
            </div>
          </section>

          {/* Section 2: Preferences */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">Preferences</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Choose your preferred work setup.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Preferred Job Location" required placeholder="Bangalore" />
              <Select label="Work Mode" required options={[
                { value: 'remote', label: 'Remote' },
                { value: 'hybrid', label: 'Hybrid' },
                { value: 'onsite', label: 'On-site' }
              ]} placeholder="Select work mode" />
            </div>
          </section>

          {/* Section 3: Education */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">Education</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Academic background and certifications.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Highest Qualification" required placeholder="e.g. B.Tech in Computer Science" />
              <Input label="College / University" required placeholder="Name of institution" />
              <Input label="Year of Passing" required placeholder="YYYY" />
              <Input label="CGPA / Percentage" required placeholder="e.g. 8.5 or 85%" />
              <div className="md:col-span-2">
                <Input label="Certifications / Courses" placeholder="AWS Cloud Practitioner, React Bootcamp, Data Structures..." />
              </div>
            </div>
          </section>

          {/* Section 4: Work Experience */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">Work Experience</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Experience details, responsibilities, and capability summary.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Previous Companies" placeholder="List previous employers" />
              <Input label="Role / Designation" placeholder="e.g. Software Engineer" />
              <Input label="Duration" placeholder="e.g. 2 years 6 months" />
              <Input label="Skills" placeholder="React, Python, SQL" />
              <Input label="Tools" placeholder="Excel, SAP, Figma" />
              <div className="md:col-span-2">
                <Textarea label="Key Responsibilities & Achievements" rows={3} placeholder="Describe your key contributions" />
              </div>
              <div className="md:col-span-2">
                <Input label="Certificate Uploads" type="file" />
              </div>
            </div>
          </section>

          {/* Section 5: Documents */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">Documents</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Upload the required candidate documents.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Resume Upload (PDF/DOC)*</label>
                {resumes.length === 0 ? (
                  <div className="flex items-center gap-2">
                    <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-500/10 dark:file:text-indigo-400" />
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedResume}
                      onChange={(e) => setSelectedResume(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 pr-9 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                label="Cover Letter (Optional)"
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the recruiter why you're a great fit for this role…"
              />
            </div>
          </section>

          {/* Section 6: Additional Questions */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">Additional Questions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Recruiter screening questions for better fit and intent.</p>
            <div className="space-y-4">
              <Textarea label="Why do you want this job?" required rows={2} />
              <Textarea label="Why this company?" required rows={2} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select label="Relevant experience?" options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]} />
                <Select label="Can join within 30 days?" options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]} />
                <Select label="Willing to relocate?" options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]} />
              </div>
            </div>
          </section>
        </div>
      </Modal>
    </div>
  );
}
