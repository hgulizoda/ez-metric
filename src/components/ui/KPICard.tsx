import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useThemeStore } from '@/app/store/themeStore';
import clsx from 'clsx';

interface KPICardProps {
  label: string;
  value: number;
  displayValue?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  changeLabel?: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  suffix?: string;
  isDecimal?: boolean;
  delay?: number;
}

function useCountUp(target: number, duration = 1500, delay = 0, isDecimal = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        setCount(isDecimal ? parseFloat(current.toFixed(2)) : Math.floor(current));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setCount(target);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay, isDecimal]);

  return count;
}

export function KPICard({
  label,
  value,
  change,
  changeType = 'neutral',
  changeLabel,
  icon,
  color,
  bgColor,
  suffix = '',
  isDecimal = false,
  delay = 0,
}: KPICardProps) {
  const { isDark } = useThemeStore();
  const animatedValue = useCountUp(value, 1200, delay, isDecimal);

  const displayVal = isDecimal
    ? animatedValue.toFixed(2)
    : animatedValue.toString();

  return (
    <div
      className={clsx(
        'relative rounded-2xl p-5 overflow-hidden card-hover',
        isDark ? 'glass-card' : 'glass-card-light'
      )}
      style={{
        backgroundColor: isDark ? 'var(--bg-card)' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      }}
    >
      {/* Subtle gradient bg from card color */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-8 translate-x-8 opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
      />

      {/* Top row: label + icon */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={clsx('text-xs font-semibold uppercase tracking-wider', isDark ? 'text-gray-400' : 'text-gray-500')}
        >
          {label}
        </span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: bgColor, color }}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className="mb-2">
        <span
          className="text-3xl font-bold tracking-tight"
          style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}
        >
          {displayVal}
        </span>
        {suffix && (
          <span className={clsx('text-sm ml-1', isDark ? 'text-gray-400' : 'text-gray-500')}>{suffix}</span>
        )}
      </div>

      {/* Change indicator */}
      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          {changeType === 'increase' && <TrendingUp size={13} className="text-green-400" />}
          {changeType === 'decrease' && <TrendingDown size={13} className="text-red-400" />}
          {changeType === 'neutral' && <Minus size={13} className="text-gray-500" />}
          <span
            className={clsx(
              'text-xs font-medium',
              changeType === 'increase' && 'text-green-400',
              changeType === 'decrease' && 'text-red-400',
              changeType === 'neutral' && 'text-gray-500'
            )}
          >
            {change > 0 ? '+' : ''}{change}%
          </span>
          {changeLabel && (
            <span className={clsx('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
