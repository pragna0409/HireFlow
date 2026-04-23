import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Clock, DollarSign, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { formatSalary, timeAgo } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export default function JobCard({ job, saved, onToggleSave, onApply, compact }) {
  if (!job) return null;
  const company = job.company || job.recruiter?.company || job.postedBy?.company || 'Company';
  const recruiterName = job.recruiter?.name || job.postedBy?.name || company;
  const skills = Array.isArray(job.skills) ? job.skills : [];
  const extraSkills = skills.length - 3;

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <Avatar name={company} size="md" />
          <div className="min-w-0">
            <Link
              to={`/jobs/${job._id || job.id}`}
              className="text-base font-semibold tracking-tight text-slate-900 hover:text-indigo-700 transition-colors line-clamp-1 dark:text-white dark:hover:text-indigo-400 dark:hover:text-indigo-300"
            >
              {job.title}
            </Link>
            <div className="mt-0.5 text-sm text-slate-500 truncate dark:text-slate-400">{company}</div>
          </div>
        </div>
        {onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleSave(job);
            }}
            className={cn(
              'rounded-lg p-1.5 transition-colors',
              saved
                ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20'
                : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-500 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10',
            )}
            aria-label={saved ? 'Unsave' : 'Save'}
          >
            <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.location && (
          <Badge variant="slate" leftIcon={<MapPin size={11} />}>
            {job.location}
          </Badge>
        )}
        {job.jobType && (
          <Badge variant="indigo" leftIcon={<Briefcase size={11} />}>
            {job.jobType}
          </Badge>
        )}
        {(job.salaryMin || job.salaryMax) && (
          <Badge variant="emerald" leftIcon={<DollarSign size={11} />}>
            {formatSalary(job.salaryMin, job.salaryMax, job.currency || 'USD')}
          </Badge>
        )}
        {job.experienceLevel && (
          <Badge variant="violet">{job.experienceLevel}</Badge>
        )}
      </div>

      {!compact && job.description && (
        <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed dark:text-slate-400">
          {job.description}
        </p>
      )}

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-md text-xs font-medium text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800 dark:text-slate-400"
            >
              {s}
            </span>
          ))}
          {extraSkills > 0 && (
            <span className="px-2 py-0.5 rounded-md text-xs font-medium text-slate-500 bg-slate-50 border border-slate-100 dark:text-slate-400 dark:bg-slate-800/50 dark:border-slate-700 dark:border-slate-800/60 dark:bg-slate-900">
              +{extraSkills} more
            </span>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Clock size={12} />
          <span>{timeAgo(job.createdAt || job.postedAt) || 'Recently'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            as={Link}
            to={`/jobs/${job._id || job.id}`}
            variant="secondary"
            size="sm"
          >
            Details
          </Button>
          {onApply ? (
            <Button size="sm" onClick={() => onApply(job)}>
              Apply
            </Button>
          ) : (
            <Button as={Link} to={`/jobs/${job._id || job.id}`} size="sm">
              Apply
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
