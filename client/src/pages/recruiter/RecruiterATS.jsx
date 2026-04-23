import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, BarChart3 } from 'lucide-react';
import { jobApi } from '../../api/job.api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { JOB_STATUS_STYLES } from '../../utils/constants';
import { timeAgo } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function RecruiterATS() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
            <BarChart3 size={14} /> ATS Checker
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">ATS Checker</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Review your posted jobs and jump directly into the scoring dashboard for each role. The ATS Checker ranks applicants by compatibility score and highlights top fit candidates.
          </p>
        </div>
        <Button as={Link} to="/recruiter/jobs/new" leftIcon={<Briefcase size={16} />}>
          Post a Job
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} className="h-28" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No jobs available for ATS review"
          description="Post a job to start using the ATS Checker for applicant ranking."
          action={
            <Button as={Link} to="/recruiter/jobs/new" leftIcon={<Briefcase size={14} />}>
              Post a Job
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((job, index) => {
            const status = JOB_STATUS_STYLES[job.status] || JOB_STATUS_STYLES.open;
            return (
              <motion.div
                key={job._id || job.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
              >
                <Card hoverable className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          to={`/jobs/${job._id || job.id}`}
                          className="text-sm font-semibold text-slate-900 hover:text-indigo-700 dark:text-white dark:hover:text-indigo-300 transition-colors"
                        >
                          {job.title}
                        </Link>
                        <Badge variant={job.status === 'open' ? 'emerald' : 'slate'}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <Briefcase size={11} /> {job.location}
                          </span>
                        )}
                        <span>{timeAgo(job.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        as={Link}
                        to={`/recruiter/jobs/${job._id || job.id}/ats`}
                        variant="subtle"
                        size="sm"
                        rightIcon={<ArrowRight size={14} />}
                      >
                        View ATS
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
