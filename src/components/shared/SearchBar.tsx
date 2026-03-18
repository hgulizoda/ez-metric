import { Search, X } from 'lucide-react';
import { useThemeStore } from '@/app/store/themeStore';
import clsx from 'clsx';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...', className }: SearchBarProps) {
  const { isDark } = useThemeStore();

  return (
    <div className={clsx('relative', className)}>
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          'w-full pl-9 pr-8 py-2 text-sm rounded-xl border outline-none transition-colors',
          isDark
            ? 'bg-white/5 border-white/8 text-gray-200 placeholder-gray-500 focus:border-indigo-500/50 focus:bg-white/8'
            : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:bg-white'
        )}
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : undefined }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
