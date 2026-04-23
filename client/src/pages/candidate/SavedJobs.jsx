import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { jobApi } from '../../api/job.api';
import JobCard from '../../components/jobs/JobCard';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { SkeletonCard } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobApi
      .mySaved()
      .then((res) => {
        const list = res?.data || res || [];
        setJobs(Array.isArray(list) ? list : []);
      })
      .catch(() => toast.error('Failed to load saved jobs'))
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (job) => {
    try {
      await jobApi.toggleSave(job._id || job.id);
      setJobs((prev) => prev.filter((j) => (j._id || j.id) !== (job._id || job.id)));
      toast.success('Job removed from saved');
    } catch (err) {
      toast.error(err?.message || 'Failed');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Saved Jobs</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Jobs you've bookmarked for later
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs"
          description="Save jobs while browsing to review them later."
          action={
            <Button as={Link} to="/jobs">
              Browse Jobs
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <JobCard
              key={job._id || job.id}
              job={job}
              saved
              onToggleSave={handleUnsave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
