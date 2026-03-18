import { Users, Clock, AlertTriangle, BarChart2, Wifi, LogIn, LogOut, Activity } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { HoursBarChart } from '@/components/charts/HoursBarChart';
import { OvertimeLineChart } from '@/components/charts/OvertimeLineChart';
import { PunchDonutChart } from '@/components/charts/PunchDonutChart';
import {
  useDashboardMetrics,
  useHoursBarData,
  useOvertimeLineData,
  usePunchDonutData,
  useActivityFeed,
} from '@/services/hooks/useMetrics';
import { useThemeStore } from '@/app/store/themeStore';
import clsx from 'clsx';
import type { ActivityEvent } from '@/types';

function SectionCard({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  const { isDark } = useThemeStore();
  return (
    <div
      className={clsx('rounded-2xl p-5', className)}
      style={{
        backgroundColor: isDark ? 'var(--bg-card)' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      }}
    >
      {title && (
        <h3
          className={clsx('text-sm font-semibold mb-4', isDark ? 'text-gray-200' : 'text-gray-700')}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function ActivityItem({ event }: { event: ActivityEvent }) {
  const { isDark } = useThemeStore();
  const isIn = event.type === 'IN';
  const isOut = event.type === 'OUT';
  const isSystem = event.type === 'system';

  const time = new Date(event.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="flex items-start gap-3 py-2.5">
      <div
        className={clsx(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
          isIn && 'bg-emerald-500/15',
          isOut && 'bg-indigo-500/15',
          isSystem && 'bg-gray-500/15',
          !isIn && !isOut && !isSystem && 'bg-yellow-500/15'
        )}
      >
        {isIn && <LogIn size={14} className="text-emerald-400" />}
        {isOut && <LogOut size={14} className="text-indigo-400" />}
        {isSystem && <Wifi size={14} className="text-gray-400" />}
        {!isIn && !isOut && !isSystem && <AlertTriangle size={14} className="text-yellow-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className={clsx('text-xs font-medium truncate', isDark ? 'text-gray-200' : 'text-gray-800')}>
          {event.employeeName}
        </div>
        <div className={clsx('text-xs mt-0.5 truncate', isDark ? 'text-gray-500' : 'text-gray-400')}>
          {event.message}
        </div>
      </div>
      <div className="text-xs text-gray-600 flex-shrink-0">{time}</div>
    </div>
  );
}

export default function Dashboard() {
  const { isDark } = useThemeStore();
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: hoursBar, isLoading: hoursLoading } = useHoursBarData();
  const { data: overtimeLine, isLoading: overtimeLoading } = useOvertimeLineData();
  const { data: donutData, isLoading: donutLoading } = usePunchDonutData();
  const { data: activity, isLoading: activityLoading } = useActivityFeed();

  const kpis = [
    {
      label: 'Total Employees',
      value: metrics?.totalEmployees ?? 0,
      icon: <Users size={18} />,
      color: '#6366f1',
      bgColor: 'rgba(99,102,241,0.15)',
      change: 2,
      changeType: 'increase' as const,
      changeLabel: 'vs last month',
      delay: 0,
    },
    {
      label: 'Punched In Now',
      value: metrics?.punchedInCount ?? 0,
      icon: <Activity size={18} />,
      color: '#10b981',
      bgColor: 'rgba(16,185,129,0.15)',
      delay: 100,
    },
    {
      label: 'Missed Punches',
      value: metrics?.missedPunches ?? 0,
      icon: <AlertTriangle size={18} />,
      color: '#ef4444',
      bgColor: 'rgba(239,68,68,0.15)',
      change: -2,
      changeType: 'decrease' as const,
      changeLabel: 'vs yesterday',
      delay: 200,
    },
    {
      label: 'Hours This Week',
      value: metrics?.hoursThisWeek ?? 0,
      icon: <Clock size={18} />,
      color: '#f59e0b',
      bgColor: 'rgba(245,158,11,0.15)',
      suffix: 'hrs',
      isDecimal: true,
      delay: 300,
    },
    {
      label: 'Approaching OT',
      value: metrics?.approachingOvertime ?? 0,
      icon: <BarChart2 size={18} />,
      color: '#8b5cf6',
      bgColor: 'rgba(139,92,246,0.15)',
      delay: 400,
    },
    {
      label: 'Devices Online',
      value: metrics?.devicesOnline ?? 0,
      icon: <Wifi size={18} />,
      color: '#3b82f6',
      bgColor: 'rgba(59,130,246,0.15)',
      delay: 500,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
            Dashboard
          </h1>
          <p className={clsx('text-sm mt-0.5', isDark ? 'text-gray-500' : 'text-gray-400')}>
            Pay Period: Mar 14 – Mar 20, 2026
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="pulse-dot" />
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Live</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) =>
          metricsLoading ? (
            <div
              key={kpi.label}
              className="rounded-2xl p-5 h-28 shimmer"
              style={{ backgroundColor: isDark ? 'var(--bg-card)' : '#fff' }}
            />
          ) : (
            <KPICard key={kpi.label} {...kpi} />
          )
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hours by Job */}
        <div className="lg:col-span-2">
          <SectionCard title="Total Hours by Job — This Week">
            {hoursLoading ? (
              <div className="h-60 shimmer rounded-xl" />
            ) : (
              <HoursBarChart data={hoursBar ?? []} />
            )}
          </SectionCard>
        </div>

        {/* Punch Distribution Donut */}
        <SectionCard title="Who is IN / OUT">
          {donutLoading ? (
            <div className="h-60 shimmer rounded-xl" />
          ) : (
            <>
              <PunchDonutChart data={donutData ?? []} />
              <div className="flex gap-4 justify-center mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className={clsx('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>
                    Punched In: {metrics?.punchedInCount ?? 0}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className={clsx('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>
                    Punched Out: {metrics?.punchedOutCount ?? 0}
                  </span>
                </div>
              </div>
            </>
          )}
        </SectionCard>
      </div>

      {/* Overtime trend + Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Overtime trend */}
        <div className="lg:col-span-2">
          <SectionCard title="Hours Trend — Last 14 Days">
            {overtimeLoading ? (
              <div className="h-60 shimmer rounded-xl" />
            ) : (
              <OvertimeLineChart data={overtimeLine ?? []} />
            )}
          </SectionCard>
        </div>

        {/* Activity Feed */}
        <SectionCard title="Live Activity">
          {activityLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 shimmer rounded-lg" />
              ))}
            </div>
          ) : (
            <div
              className="divide-y overflow-y-auto max-h-64 scrollbar-thin pr-1"
              style={{ '--tw-divide-color': isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)' } as React.CSSProperties}
            >
              {(activity ?? []).map((event) => (
                <ActivityItem key={event.id} event={event} />
              ))}
            </div>
          )}
          <button
            className="w-full mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors py-1"
          >
            View all activity →
          </button>
        </SectionCard>
      </div>

      {/* Missed Punches Alert */}
      {(metrics?.missedPunches ?? 0) > 0 && (
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
          <span className={clsx('text-sm', isDark ? 'text-red-300' : 'text-red-600')}>
            <strong>{metrics?.missedPunches} employees</strong> have missed punch records this pay period.
            Review the{' '}
            <a href="/punches" className="underline hover:no-underline">
              Punch Records
            </a>{' '}
            page.
          </span>
        </div>
      )}
    </div>
  );
}
