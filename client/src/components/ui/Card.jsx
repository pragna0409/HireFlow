import { cn } from '../../utils/cn';

export default function Card({ as: Tag = 'div', className, hoverable, ...props }) {
  return (
    <Tag
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800',
        hoverable && 'transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/60', className)} {...props} />;
}

export function CardBody({ className, ...props }) {
  return <div className={cn('px-6 py-5', className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn('px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl dark:border-slate-800/60 dark:bg-slate-800/30', className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn('text-base font-semibold tracking-tight text-slate-900 dark:text-white', className)}
      {...props}
    />
  );
}
