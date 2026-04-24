import { cn } from '../../utils/cn';
import { initials } from '../../utils/formatters';

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

export default function Avatar({ name = '', src, size = 'md', className, gradient = true }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden font-semibold text-white',
        gradient ? 'bg-gradient-to-br from-zinc-600 to-zinc-900' : 'bg-slate-200 text-slate-700',
        sizes[size],
        className,
      )}
      aria-label={name}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials(name) || '?'}</span>
      )}
    </span>
  );
}
