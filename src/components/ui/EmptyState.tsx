import { Inbox } from 'lucide-react';
import clsx from 'clsx';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'No data found',
  description = 'There are no records to display at this time.',
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={clsx('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400">
        {icon ?? <Inbox size={28} />}
      </div>
      <h3 className="text-base font-semibold text-gray-300 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
