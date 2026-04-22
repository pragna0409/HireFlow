import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(function Input(
  {
    label,
    error,
    helper,
    leftIcon,
    rightIcon,
    className,
    wrapperClassName,
    id,
    required,
    ...props
  },
  ref,
) {
  const auto = useId();
  const inputId = id || auto;
  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="ml-0.5 text-rose-500 dark:text-rose-400">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-10 rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500',
            'transition-all duration-200',
            'focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 dark:focus:ring-indigo-500/20',
            'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed dark:disabled:bg-slate-800 dark:disabled:text-slate-400',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15 dark:border-rose-500/50 dark:focus:border-rose-500'
              : 'border-slate-200 dark:border-slate-700',
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute inset-y-0 right-3 flex items-center text-slate-400">
            {rightIcon}
          </span>
        )}
      </div>
      {error ? (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      ) : helper ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helper}</p>
      ) : null}
    </div>
  );
});

export default Input;
