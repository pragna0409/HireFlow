import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { jobApi } from '../../api/job.api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { JOB_STATUS_STYLES } from '../../utils/constants';
import { timeAgo } from '../../utils/formatters';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobApi
      .myPosted()
      .then((res) => {
        const list = res?.data || res || [];
        setJobs(Array.isArray(list) ? list : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalApps = jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);
  const totalViews = jobs.reduce((sum, j) => sum + (j.views || 0), 0);
  const openJobs = jobs.filter((j) => j.status === 'open').length;

  const statCards = [
    { label: 'Total Jobs', value: jobs.length, icon: Briefcase, color: 'from-indigo-500 to-violet-500' },
    { label: 'Open Positions', value: openJobs, icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
    { label: 'Total Applications', value: totalApps, icon: Users, color: 'from-amber-500 to-orange-500' },
    { label: 'Total Views', value: totalViews, icon: Eye, color: 'from-sky-500 to-blue-500' },
  ];

  const recentJobs = jobs.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome, {user?.name?.split(' ')[0] || 'Recruiter'}! 🚀
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage your job postings and applicants.
          </p>
        </div>
        <Button as={Link} to="/recruiter/jobs/new" leftIcon={<Plus size={16} />}>
          Post a Job
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                        {s.label}
                      </p>
                      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                    </div>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-md`}
                    >
                      <s.icon size={20} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Jobs</h2>
              <Button
                as={Link}
                to="/recruiter/jobs"
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight size={14} />}
              >
                View all
              </Button>
            </div>

            {recentJobs.length === 0 ? (
              <Card className="p-10 text-center">
                <Briefcase size={32} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No jobs posted yet</p>
                <Button
                  as={Link}
                  to="/recruiter/jobs/new"
                  size="sm"
                  className="mt-4"
                  leftIcon={<Plus size={14} />}
                >
                  Post your first job
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentJobs.map((job) => {
                  const st = JOB_STATUS_STYLES[job.status] || JOB_STATUS_STYLES.open;
                  return (
                    <motion.div
                      key={job._id || job.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card hoverable className="p-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/recruiter/jobs/${job._id || job.id}/applicants`}
                            className="text-sm font-semibold text-slate-900 hover:text-indigo-700 transition-colors dark:text-white dark:hover:text-indigo-300"
                          >
                            {job.title}
                          </Link>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Users size={11} /> {job.applicationsCount || 0} applicants
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye size={11} /> {job.views || 0} views
                            </span>
                            <span>{timeAgo(job.createdAt)}</span>
                          </div>
                        </div>
                        <Badge
                          variant={job.status === 'open' ? 'emerald' : 'slate'}
                        >
                          {st.label}
                        </Badge>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
