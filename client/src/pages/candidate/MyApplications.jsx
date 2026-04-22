import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Trash2, ExternalLink, Building2, MapPin } from 'lucide-react';
import { applicationApi } from '../../api/application.api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { SkeletonCard } from '../../components/ui/Skeleton';
import Avatar from '../../components/ui/Avatar';
import { STATUS_STYLES } from '../../utils/constants';
import { timeAgo, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    applicationApi
      .mine()
      .then((res) => {
        const list = res?.data || res || [];
        setApps(Array.isArray(list) ? list : []);
      })
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async () => {
    setDeleting(true);
    try {
      await applicationApi.remove(deleteId);
      setApps((prev) => prev.filter((a) => (a._id || a.id) !== deleteId));
      toast.success('Application withdrawn');
    } catch (err) {
      toast.error(err?.message || 'Failed to withdraw');
    } finally {
      setDeleteId(null);
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Applications</h1>
        <p className="mt-1 text-sm text-slate-600">
          Track and manage all your job applications
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Start exploring jobs and submit your first application!"
          action={
            <Button as={Link} to="/jobs">
              Browse Jobs
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {apps.map((app, i) => {
            const s = STATUS_STYLES[app.status] || STATUS_STYLES.applied;
            const job = app.job || {};
            const company =
              job.recruiter?.company || job.company || '';
            return (
              <motion.div
                key={app._id || app.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <Card hoverable className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Avatar name={company || job.title || 'J'} size="md" />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/jobs/${job._id || job.id || ''}`}
                        className="text-sm font-semibold text-slate-900 hover:text-indigo-700 transition-colors"
                      >
                        {job.title || 'Job'}
                      </Link>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                        {company && (
                          <span className="flex items-center gap-1">
                            <Building2 size={11} /> {company}
                          </span>
                        )}
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {job.location}
                          </span>
                        )}
                        <span>Applied {timeAgo(app.createdAt)}</span>
                      </div>

                      {/* Status History */}
                      {app.statusHistory?.length > 1 && (
                        <div className="mt-2 flex items-center gap-1 flex-wrap">
                          {app.statusHistory.map((sh, idx) => {
                            const hs = STATUS_STYLES[sh.status] || STATUS_STYLES.applied;
                            return (
                              <span
                                key={idx}
                                className={`inline-flex items-center gap-1 text-[10px] font-medium rounded-full px-2 py-0.5 ${hs.bg} ${hs.text}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${hs.dot}`} />
                                {hs.label}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={`${s.bg} ${s.text} ${s.border}`}>
                        <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </Badge>
                      <Button
                        as={Link}
                        to={`/jobs/${job._id || job.id || ''}`}
                        variant="ghost"
                        size="icon"
                        title="View job"
                      >
                        <ExternalLink size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(app._id || app.id)}
                        title="Withdraw"
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
        title="Withdraw Application?"
        description="This action cannot be undone. Your application will be permanently removed."
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleWithdraw} loading={deleting}>
              Withdraw
            </Button>
          </>
        }
      />
    </div>
  );
}
