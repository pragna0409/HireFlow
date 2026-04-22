import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Trash2,
  MapPin,
  Users,
  Eye,
} from 'lucide-react';
import { jobApi } from '../../api/job.api';
import { adminApi } from '../../api/admin.api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/common/SearchBar';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { JOB_STATUS_STYLES } from '../../utils/constants';
import { timeAgo } from '../../utils/formatters';
import useDebounce from '../../hooks/useDebounce';
import toast from 'react-hot-toast';

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search);

  const fetchJobs = useCallback(
    (page = 1) => {
      setLoading(true);
      const params = { page, limit: 15 };
      if (debouncedSearch) params.search = debouncedSearch;
      params.status = ''; // show all

      jobApi
        .list(params)
        .then((res) => {
          const data = res?.data || res;
          setJobs(data?.jobs || []);
          setPagination(data?.pagination || { page: 1, pages: 1, total: 0 });
        })
        .catch(() => toast.error('Failed to load jobs'))
        .finally(() => setLoading(false));
    },
    [debouncedSearch],
  );

  useEffect(() => {
    fetchJobs(1);
  }, [fetchJobs]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.removeJob(deleteId);
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">All Jobs</h1>
        <p className="mt-1 text-sm text-slate-600">
          {pagination.total} total jobs on the platform
        </p>
      </div>

      <div className="mb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search jobs…"
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="Try adjusting your search."
        />
      ) : (
        <>
          <div className="space-y-3">
            {jobs.map((job, i) => {
              const st = JOB_STATUS_STYLES[job.status] || JOB_STATUS_STYLES.open;
              const company = job.company || job.recruiter?.company || '';
              return (
                <motion.div
                  key={job._id || job.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <Card hoverable className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          to={`/jobs/${job._id || job.id}`}
                          className="text-sm font-semibold text-slate-900 hover:text-indigo-700 transition-colors"
                        >
                          {job.title}
                        </Link>
                        <Badge variant={job.status === 'open' ? 'emerald' : 'slate'}>
                          {st.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                        {company && <span>{company}</span>}
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users size={11} /> {job.applicationsCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={11} /> {job.views || 0}
                        </span>
                        <span>{timeAgo(job.createdAt)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(job._id || job.id)}
                      title="Delete job"
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchJobs(pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-slate-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchJobs(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Modal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Delete Job?"
        description="This will permanently remove this job and all its applications."
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
