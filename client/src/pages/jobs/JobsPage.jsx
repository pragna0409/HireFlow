import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Search } from 'lucide-react';
import { jobApi } from '../../api/job.api';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import JobCard from '../../components/jobs/JobCard';
import JobFilters from '../../components/jobs/JobFilters';
import { SkeletonCard } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants';
import toast from 'react-hot-toast';

const defaultFilters = {
  search: '',
  location: '',
  jobTypes: [],
  experienceLevel: '',
  minSalary: 0,
  skills: '',
};

export default function JobsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [filters, setFilters] = useState(defaultFilters);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());

  const debouncedSearch = useDebounce(filters.search);
  const debouncedLocation = useDebounce(filters.location);
  const debouncedSkills = useDebounce(filters.skills);

  const fetchJobs = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (debouncedSearch) params.search = debouncedSearch;
        if (debouncedLocation) params.location = debouncedLocation;
        if (filters.jobTypes?.length) params.jobType = filters.jobTypes[0];
        if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;
        if (filters.minSalary > 0) params.minSalary = filters.minSalary;
        if (debouncedSkills) params.skills = debouncedSkills;

        const res = await jobApi.list(params);
        const data = res?.data || res;
        setJobs(data?.jobs || []);
        setPagination(data?.pagination || { page: 1, pages: 1, total: 0 });
      } catch {
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, debouncedLocation, filters.jobTypes, filters.experienceLevel, filters.minSalary, debouncedSkills],
  );

  useEffect(() => {
    fetchJobs(1);
  }, [fetchJobs]);

  // load saved jobs for logged-in candidates
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'candidate') return;
    jobApi
      .mySaved()
      .then((res) => {
        const list = res?.data || res || [];
        const ids = Array.isArray(list) ? list.map((j) => j._id || j.id) : [];
        setSavedIds(new Set(ids));
      })
      .catch(() => {});
  }, [isAuthenticated, user?.role]);

  const handleToggleSave = async (job) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save jobs');
      return;
    }
    try {
      const res = await jobApi.toggleSave(job._id || job.id);
      const saved = res?.data?.saved;
      setSavedIds((prev) => {
        const copy = new Set(prev);
        if (saved) copy.add(job._id || job.id);
        else copy.delete(job._id || job.id);
        return copy;
      });
      toast.success(saved ? 'Job saved' : 'Job unsaved');
    } catch (err) {
      toast.error(err?.message || 'Failed to save job');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 rounded-3xl bg-slate-900 p-8 sm:p-12 relative overflow-hidden dark:bg-slate-950">
        <div className="absolute inset-0 bg-grid-slate bg-[length:32px_32px] opacity-20" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-white tracking-tight mb-4">
            Discover high-quality roles built around real hiring needs.
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            Explore curated openings, compare locations and work modes, and submit a complete application that recruiters can actually review.
          </p>
          <div className="flex flex-wrap gap-6 sm:gap-10">
            <div>
              <div className="text-3xl font-extrabold text-white">{pagination.total || 5}</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mt-1">Open roles</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">10</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mt-1">Cities</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">3</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mt-1">Work modes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Search by role, company, or skill"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            leftIcon={<Search size={16} />}
          />
        </div>
        <Select
          options={[{ label: 'All Job Types', value: '' }, ...JOB_TYPES]}
          value={filters.jobTypes[0] || ''}
          onChange={(e) =>
            setFilters((f) => ({ ...f, jobTypes: e.target.value ? [e.target.value] : [] }))
          }
        />
        <Select
          options={[{ label: 'All Levels', value: '' }, ...EXPERIENCE_LEVELS]}
          value={filters.experienceLevel || ''}
          onChange={(e) => setFilters((f) => ({ ...f, experienceLevel: e.target.value }))}
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex-1">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs found"
              description="Try adjusting your filters or search terms."
              action={
                <Button variant="secondary" onClick={() => setFilters(defaultFilters)}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id || job.id}
                    job={job}
                    saved={savedIds.has(job._id || job.id)}
                    onToggleSave={isAuthenticated && user?.role === 'candidate' ? handleToggleSave : undefined}
                    onMessage={isAuthenticated && user?.role === 'candidate' && (job.recruiter?._id || job.recruiter?.id || job.recruiter) ? () => navigate(`/messages/${job.recruiter?._id || job.recruiter?.id || job.recruiter}`) : undefined}
                  />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => fetchJobs(pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
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
        </div>
      </div>
    </div>
  );
}
