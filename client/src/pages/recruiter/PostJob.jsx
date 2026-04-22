import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { jobApi } from '../../api/job.api';
import JobForm from '../../components/jobs/JobForm';
import Button from '../../components/ui/Button';
import Card, { CardHeader, CardTitle, CardBody } from '../../components/ui/Card';
import toast from 'react-hot-toast';

export default function PostJob() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      // Map frontend field names to server schema names
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
      await jobApi.create(data);
      toast.success('Job posted successfully!');
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(err?.message || 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

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
          <CardTitle className="text-lg">Post a New Job</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details below to create a new job posting.
          </p>
        </CardHeader>
        <CardBody>
          <JobForm
            onSubmit={handleSubmit}
            submitting={submitting}
            onCancel={() => navigate('/recruiter/jobs')}
          />
        </CardBody>
      </Card>
    </div>
  );
}
