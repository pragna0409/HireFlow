import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  FileText,
  Bookmark,
  TrendingUp,
  ArrowRight,
  Clock,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { applicationApi } from '../../api/application.api';
import { jobApi } from '../../api/job.api';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { STATUS_STYLES } from '../../utils/constants';
import { timeAgo } from '../../utils/formatters';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      applicationApi.mine().catch(() => ({ data: [] })),
      jobApi.mySaved().catch(() => ({ data: [] })),
    ]).then(([appRes, savedRes]) => {
      const list = appRes?.data || appRes || [];
      setApps(Array.isArray(list) ? list : []);
      const saved = savedRes?.data || savedRes || [];
      setSavedCount(Array.isArray(saved) ? saved.length : 0);
      setLoading(false);
    });
  }, []);

  const statCards = [
    {
      label: 'Total Applications',
      value: apps.length,
      icon: FileText,
      color: 'from-indigo-500 to-violet-500',
      link: '/candidate/applications',
    },
    {
      label: 'Under Review',
      value: apps.filter((a) => a.status === 'under_review' || a.status === 'shortlisted').length,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      link: '/candidate/applications',
    },
    {
      label: 'Saved Jobs',
      value: savedCount,
      icon: Bookmark,
      color: 'from-emerald-500 to-teal-500',
      link: '/candidate/saved',
    },
    {
      label: 'Hired',
      value: apps.filter((a) => a.status === 'hired').length,
      icon: TrendingUp,
      color: 'from-sky-500 to-blue-500',
      link: '/candidate/applications',
    },
  ];

  const recentApps = apps.slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Here's what's happening with your applications.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <Link to={s.link}>
                  <Card hoverable className="p-5">
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
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Recent Applications */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Applications</h2>
              <Button
                as={Link}
                to="/candidate/applications"
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight size={14} />}
              >
                View all
              </Button>
            </div>

            {recentApps.length === 0 ? (
              <Card className="p-10 text-center">
                <Briefcase size={32} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No applications yet</p>
                <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Start browsing jobs and apply!</p>
                <Button
                  as={Link}
                  to="/jobs"
                  size="sm"
                  className="mt-4"
                  rightIcon={<ArrowRight size={14} />}
                >
                  Browse Jobs
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentApps.map((app) => {
                  const s = STATUS_STYLES[app.status] || STATUS_STYLES.applied;
                  const jobTitle = app.job?.title || 'Job';
                  const company =
                    app.job?.recruiter?.company || app.job?.company || '';
                  return (
                    <motion.div
                      key={app._id || app.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group"
                    >
                      <Card hoverable className="p-4 flex items-center gap-4">
                        <div
                          className={`h-2.5 w-2.5 rounded-full shrink-0 ${s.dot}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate dark:text-white">
                            {jobTitle}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{company}</p>
                        </div>
                        <Badge
                          className={`${s.bg} ${s.text} ${s.border}`}
                        >
                          {s.label}
                        </Badge>
                        <span className="text-xs text-slate-400 hidden sm:block">
                          {timeAgo(app.createdAt)}
                        </span>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Card hoverable className="p-5">
              <Briefcase size={20} className="text-indigo-600 mb-2" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Browse Jobs</h3>
              <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Discover new opportunities</p>
              <Button
                as={Link}
                to="/jobs"
                variant="subtle"
                size="sm"
                className="mt-3"
                rightIcon={<ArrowRight size={12} />}
              >
                Explore
              </Button>
            </Card>
            <Card hoverable className="p-5">
              <Bookmark size={20} className="text-emerald-600 mb-2" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Saved Jobs</h3>
              <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Review your saved listings</p>
              <Button
                as={Link}
                to="/candidate/saved"
                variant="subtle"
                size="sm"
                className="mt-3"
                rightIcon={<ArrowRight size={12} />}
              >
                View saved
              </Button>
            </Card>
            <Card hoverable className="p-5">
              <FileText size={20} className="text-violet-600 mb-2" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">My Profile</h3>
              <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Update skills & resume</p>
              <Button
                as={Link}
                to="/candidate/profile"
                variant="subtle"
                size="sm"
                className="mt-3"
                rightIcon={<ArrowRight size={12} />}
              >
                Edit profile
              </Button>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
