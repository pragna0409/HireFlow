import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  className,
  size = 'md',
}) {
  const sizes = { sm: 'h-9 text-sm', md: 'h-10 text-sm', lg: 'h-12 text-base' };
  return (
    <div className={cn('relative w-full', className)}>
      <Search
        size={size === 'lg' ? 18 : 16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-slate-900 placeholder:text-slate-400',
          'transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500',
          sizes[size],
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"
          aria-label="Clear"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
