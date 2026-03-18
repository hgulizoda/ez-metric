import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Failed to load data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4 text-red-400">
        <AlertCircle size={28} />
      </div>
      <h3 className="text-base font-semibold text-gray-300 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl gradient-bg text-white hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      )}
    </div>
  );
}
