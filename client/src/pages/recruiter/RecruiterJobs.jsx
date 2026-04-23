import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Eye,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { jobApi } from '../../api/job.api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { JOB_STATUS_STYLES } from '../../utils/constants';
import { timeAgo } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    jobApi
      .myPosted()
      .then((res) => {
        const list = res?.data || res || [];
        setJobs(Array.isArray(list) ? list : []);
      })
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleStatus = async (job) => {
    try {
      const res = await jobApi.updateStatus(job._id || job.id);
      const updated = res?.data || res;
      setJobs((prev) =>
        prev.map((j) => ((j._id || j.id) === (job._id || job.id) ? { ...j, status: updated.status } : j)),
      );
      toast.success(`Job marked as ${updated.status}`);
    } catch (err) {
      toast.error(err?.message || 'Failed');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await jobApi.remove(deleteId);
      setJobs((prev) => prev.filter((j) => (j._id || j.id) !== deleteId));
      toast.success('Job deleted');
    } catch (err) {
      toast.error(err?.message || 'Failed');
    } finally {
      setDeleteId(null);
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Jobs</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} posted
          </p>
        </div>
        <Button as={Link} to="/recruiter/jobs/new" leftIcon={<Plus size={16} />}>
          Post a Job
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          description="Create your first job posting to start attracting talent."
          action={
            <Button as={Link} to="/recruiter/jobs/new" leftIcon={<Plus size={14} />}>
              Post a Job
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((job, i) => {
            const st = JOB_STATUS_STYLES[job.status] || JOB_STATUS_STYLES.open;
            return (
              <motion.div
                key={job._id || job.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <Card hoverable className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          to={`/jobs/${job._id || job.id}`}
                          className="text-sm font-semibold text-slate-900 hover:text-indigo-700 transition-colors dark:text-white dark:hover:text-indigo-300"
                        >
                          {job.title}
                        </Link>
                        <Badge variant={job.status === 'open' ? 'emerald' : 'slate'}>
                          {st.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users size={11} /> {job.applicationsCount || 0} applicants
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={11} /> {job.views || 0} views
                        </span>
                        <span>{timeAgo(job.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        as={Link}
                        to={`/recruiter/jobs/${job._id || job.id}/applicants`}
                        variant="subtle"
                        size="sm"
                        leftIcon={<Users size={13} />}
                      >
                        Applicants
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(job)}
                        title={job.status === 'open' ? 'Close job' : 'Reopen job'}
                      >
                        {job.status === 'open' ? (
                          <ToggleRight size={16} className="text-emerald-600" />
                        ) : (
                          <ToggleLeft size={16} className="text-slate-400" />
                        )}
                      </Button>
                      <Button
                        as={Link}
                        to={`/recruiter/jobs/${job._id || job.id}/edit`}
                        variant="ghost"
                        size="icon"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(job._id || job.id)}
                        title="Delete"
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Delete Job?"
        description="This will permanently delete the job posting and all associated applications."
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
          </>
        }
      />
    </div>
  );
}
