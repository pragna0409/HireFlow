import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { jobApi } from '../../api/job.api';
import JobForm from '../../components/jobs/JobForm';
import Button from '../../components/ui/Button';
import Card, { CardHeader, CardTitle, CardBody } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    jobApi
      .get(id)
      .then((res) => {
        const data = res?.data || res;
        // Normalize server schema → form schema
        setJob({
          ...data,
          skills: data.skillsRequired || data.skills || [],
          salaryMin: data.salaryRange?.min || data.salaryMin || '',
          salaryMax: data.salaryRange?.max || data.salaryMax || '',
        });
      })
      .catch(() => {
        toast.error('Job not found');
        navigate('/recruiter/jobs', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      const data = {
        title: payload.title,
        description: payload.description,
        location: payload.location,
        jobType: payload.jobType,
        experienceLevel: payload.experienceLevel,
        skillsRequired: payload.skills || [],
        salaryRange: {
          min: payload.salaryMin || 0,
          max: payload.salaryMax || 0,
        },
      };
      await jobApi.update(id, data);
      toast.success('Job updated!');
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(err?.message || 'Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" className="text-indigo-600" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-3xl">
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft size={14} />}
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Edit Job</CardTitle>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Update the job details below.
          </p>
        </CardHeader>
        <CardBody>
          <JobForm
            initial={job}
            onSubmit={handleSubmit}
            submitting={submitting}
            onCancel={() => navigate('/recruiter/jobs')}
          />
        </CardBody>
      </Card>
    </div>
  );
}
