import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import Spinner from './Spinner';

const variants = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-violet-500 text-white hover:from-indigo-700 hover:to-violet-600 shadow-sm hover:shadow-md focus-visible:ring-indigo-500',
  secondary:
    'bg-white text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-700 shadow-sm focus-visible:ring-indigo-500',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white focus-visible:ring-indigo-500',
  danger:
    'bg-rose-500 text-white hover:bg-rose-600 shadow-sm focus-visible:ring-rose-500',
  outline:
    'bg-transparent text-indigo-600 border border-indigo-200 hover:bg-indigo-50 dark:border-indigo-500/30 dark:hover:bg-indigo-500/10 focus-visible:ring-indigo-500',
  subtle:
    'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 focus-visible:ring-indigo-500',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  icon: 'h-10 w-10 justify-center',
};

const Button = forwardRef(function Button(
  {
    as: Tag = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    className,
    children,
    leftIcon,
    rightIcon,
    fullWidth,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <Tag
      ref={ref}
      disabled={Tag === 'button' ? isDisabled : undefined}
      className={cn(
        'inline-flex items-center rounded-lg font-medium transition-all duration-200 select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full justify-center',
        className,
      )}
      {...props}
    >
      {loading ? (
        <Spinner size={size === 'lg' ? 'md' : 'sm'} />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span className={cn(size === 'icon' && 'sr-only')}>{children}</span>
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </Tag>
  );
});

export default Button;
