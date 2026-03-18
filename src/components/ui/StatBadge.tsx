import clsx from 'clsx';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';

interface StatBadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  success: 'bg-green-500/15 text-green-400 border-green-500/20',
  warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  error: 'bg-red-500/15 text-red-400 border-red-500/20',
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  neutral: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
  primary: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
};

const DOT_COLORS: Record<BadgeVariant, string> = {
  success: 'bg-green-400',
  warning: 'bg-yellow-400',
  error: 'bg-red-400',
  info: 'bg-blue-400',
  neutral: 'bg-gray-400',
  primary: 'bg-indigo-400',
};

export function StatBadge({ label, variant = 'neutral', dot = false, size = 'sm', className }: StatBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        VARIANT_STYLES[variant],
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1',
        className
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', DOT_COLORS[variant])} />}
      {label}
    </span>
  );
}
