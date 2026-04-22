import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  MapPin,
  FileText,
  Clock,
  Briefcase,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { applicationApi } from '../../api/application.api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { APPLICATION_STATUSES, STATUS_STYLES } from '../../utils/constants';
import { timeAgo } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function JobApplicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    applicationApi
      .byJob(id)
      .then((res) => {
        const list = res?.data || res || [];
        setApplicants(Array.isArray(list) ? list : []);
      })
      .catch(() => toast.error('Failed to load applicants'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdating(appId);
    try {
      const res = await applicationApi.updateStatus(appId, newStatus);
      const updated = res?.data || res;
      setApplicants((prev) =>
        prev.map((a) =>
          (a._id || a.id) === appId ? { ...a, status: updated.status || newStatus } : a,
        ),
      );
      toast.success('Status updated');
    } catch (err) {
      toast.error(err?.message || 'Failed to update');
    } finally {
      setUpdating(null);
    }
  };

  const jobTitle = applicants[0]?.job?.title || 'Job';

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft size={14} />}
        className="mb-4"
        onClick={() => navigate('/recruiter/jobs')}
      >
        Back to My Jobs
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Applicants
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {applicants.length} applicant{applicants.length !== 1 ? 's' : ''} for{' '}
          <span className="font-medium text-slate-900">{jobTitle}</span>
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : applicants.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applicants yet"
          description="Once candidates apply to this job, they'll appear here."
        />
      ) : (
        <div className="space-y-3">
          {applicants.map((app, i) => {
            const candidate = app.candidate || {};
            const s = STATUS_STYLES[app.status] || STATUS_STYLES.applied;
            const skills = Array.isArray(candidate.skills) ? candidate.skills : [];
            return (
              <motion.div
                key={app._id || app.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <Card className="p-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Avatar name={candidate.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">
                            {candidate.name || 'Candidate'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                            {candidate.email && (
                              <a
                                href={`mailto:${candidate.email}`}
                                className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                              >
                                <Mail size={11} /> {candidate.email}
                              </a>
                            )}
                            {candidate.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={11} /> {candidate.location}
                              </span>
                            )}
                            {candidate.experience != null && (
                              <span className="flex items-center gap-1">
                                <Briefcase size={11} /> {candidate.experience} yrs
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> Applied {timeAgo(app.createdAt)}
                            </span>
                          </div>
                        </div>
                        <Badge className={`${s.bg} ${s.text} ${s.border}`}>
                          <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </Badge>
                      </div>

                      {candidate.bio && (
                        <p className="mt-2 text-xs text-slate-600 line-clamp-2">{candidate.bio}</p>
                      )}

                      {skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {skills.slice(0, 6).map((sk) => (
                            <span
                              key={sk}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-600 bg-slate-100"
                            >
                              {sk}
                            </span>
                          ))}
                          {skills.length > 6 && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-400">
                              +{skills.length - 6}
                            </span>
                          )}
                        </div>
                      )}

                      {app.coverLetter && (
                        <details className="mt-3 group">
                          <summary className="text-xs font-medium text-indigo-600 cursor-pointer inline-flex items-center gap-1 hover:text-indigo-700">
                            <FileText size={12} /> Cover Letter
                            <ChevronDown
                              size={12}
                              className="transition-transform group-open:rotate-180"
                            />
                          </summary>
                          <p className="mt-2 text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-3">
                            {app.coverLetter}
                          </p>
                        </details>
                      )}

                      <div className="mt-3 flex items-center gap-2">
                        <Select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id || app.id, e.target.value)}
                          options={APPLICATION_STATUSES}
                          className="!h-8 text-xs max-w-[180px]"
                          disabled={updating === (app._id || app.id)}
                        />
                        {updating === (app._id || app.id) && (
                          <Spinner size="sm" className="text-indigo-600" />
                        )}
                        {candidate.resumeUrl && (
                          <Button
                            as="a"
                            href={candidate.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="ghost"
                            size="sm"
                            leftIcon={<ExternalLink size={12} />}
                          >
                            Resume
                          </Button>
                        )}
                      </div>
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
