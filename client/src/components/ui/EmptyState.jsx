import { Inbox } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6 rounded-xl border border-dashed border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-violet-200 blur-2xl opacity-40 dark:opacity-10" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-glow">
          <Icon size={28} />
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-900 tracking-tight dark:text-white">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-slate-500 max-w-md leading-relaxed dark:text-slate-400">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
