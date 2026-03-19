import { TrendingUp, TrendingDown } from 'lucide-react';
import { useThemeStore } from '@/app/store/themeStore';
import clsx from 'clsx';

export interface MetricTileProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function MetricTile({ label, value, sub, icon, color, trend, trendValue }: MetricTileProps) {
  const { isDark } = useThemeStore();
  return (
    <div
      className={clsx('rounded-2xl p-5 flex flex-col gap-3')}
      style={{
        backgroundColor: isDark ? 'var(--bg-card)' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className={clsx('text-xs font-semibold uppercase tracking-wider', isDark ? 'text-gray-400' : 'text-gray-500')}>
          {label}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {icon}
        </div>
      </div>
      <div>
        <div className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>{value}</div>
        <div className={clsx('text-xs mt-1', isDark ? 'text-gray-500' : 'text-gray-400')}>{sub}</div>
      </div>
      {trend && trendValue && (
        <div className="flex items-center gap-1">
          {trend === 'up' && <TrendingUp size={12} className="text-emerald-400" />}
          {trend === 'down' && <TrendingDown size={12} className="text-red-400" />}
          <span className={clsx('text-xs font-medium', trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-500')}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}
