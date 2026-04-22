import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const Select = forwardRef(function Select(
  {
    label,
    error,
    helper,
    options = [],
    placeholder,
    className,
    wrapperClassName,
    id,
    required,
    children,
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
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-10 appearance-none rounded-lg border bg-white px-3 pr-9 text-sm text-slate-900 dark:bg-slate-900 dark:text-white',
            'transition-all duration-200',
            'focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 dark:focus:ring-indigo-500/20',
            'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed dark:disabled:bg-slate-800 dark:disabled:text-slate-400',
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15 dark:border-rose-500/50 dark:focus:border-rose-500'
              : 'border-slate-200 dark:border-slate-700',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children ||
            options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          size={16}
        />
      </div>
      {error ? (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      ) : helper ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helper}</p>
      ) : null}
    </div>
  );
});

export default Select;
