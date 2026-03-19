import { useState } from 'react';
import { Clock, Users, AlertTriangle, BarChart2 } from 'lucide-react';
import { MetricTile } from '@/components/shared/MetricTile';
import { HoursBarChart } from '@/components/charts/HoursBarChart';
import { OvertimeLineChart } from '@/components/charts/OvertimeLineChart';
import { useHoursBarData, useOvertimeLineData, useDashboardMetrics } from '@/services/hooks/useMetrics';
import { useThemeStore } from '@/app/store/themeStore';
import clsx from 'clsx';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

const ATTENDANCE_DATA = [
  { day: 'Mon', present: 28, absent: 4 },
  { day: 'Tue', present: 30, absent: 2 },
  { day: 'Wed', present: 27, absent: 5 },
  { day: 'Thu', present: 31, absent: 1 },
  { day: 'Fri', present: 29, absent: 3 },
  { day: 'Sat', present: 18, absent: 14 },
];

const DEPT_HOURS = [
  { dept: 'Mech Floor', hours: 312, color: '#6366f1' },
  { dept: 'Office', hours: 128, color: '#8b5cf6' },
  { dept: 'Parts', hours: 96, color: '#10b981' },
  { dept: 'Management', hours: 80, color: '#f59e0b' },
];

const PERIOD_OPTIONS = ['This Week', 'Last Week', 'This Month', 'Last Month'];

export default function Analytics() {
  const { isDark } = useThemeStore();
  const [period, setPeriod] = useState('This Week');
  const { data: hoursBar, isLoading: hoursLoading } = useHoursBarData();
  const { data: overtimeLine, isLoading: overtimeLoading } = useOvertimeLineData();
  const { data: metrics } = useDashboardMetrics();

  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
            Analytics
          </h1>
          <p className={clsx('text-sm mt-0.5', isDark ? 'text-gray-500' : 'text-gray-400')}>
            Workforce insights & trends
          </p>
        </div>
        {/* Period selector */}
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
        >
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setPeriod(opt)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                period === opt
                  ? 'gradient-bg text-white shadow-sm'
                  : isDark
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Metric tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile
          label="Avg Daily Hours"
          value="8.4h"
          sub="Per active employee"
          icon={<Clock size={16} />}
          color="#6366f1"
          trend="up"
          trendValue="+0.3h vs last week"
        />
        <MetricTile
          label="Attendance Rate"
          value="91.2%"
          sub="This period"
          icon={<Users size={16} />}
          color="#10b981"
          trend="up"
          trendValue="+2.1% vs last week"
        />
        <MetricTile
          label="Total OT Hours"
          value={`${(overtimeLine?.reduce((s, d) => s + d.overtime, 0) ?? 0).toFixed(1)}h`}
          sub="Overtime this period"
          icon={<AlertTriangle size={16} />}
          color="#f59e0b"
          trend="down"
          trendValue="-5h vs last week"
        />
        <MetricTile
          label="Total Work Hours"
          value={`${metrics?.hoursThisWeek ?? 0}h`}
          sub="All departments"
          icon={<BarChart2 size={16} />}
          color="#8b5cf6"
          trend="up"
          trendValue="+12h vs last week"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{
            backgroundColor: isDark ? 'var(--bg-card)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          <h3 className={clsx('text-sm font-semibold mb-4', isDark ? 'text-gray-200' : 'text-gray-700')}>
            Overtime Trend — Last 14 Days
          </h3>
          {overtimeLoading ? (
            <div className="h-60 shimmer rounded-xl" />
          ) : (
            <OvertimeLineChart data={overtimeLine ?? []} />
          )}
        </div>

        {/* Attendance */}
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: isDark ? 'var(--bg-card)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          <h3 className={clsx('text-sm font-semibold mb-4', isDark ? 'text-gray-200' : 'text-gray-700')}>
            Daily Attendance
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ATTENDANCE_DATA} barCategoryGap="25%">
              <CartesianGrid vertical={false} stroke={gridColor} />
              <XAxis dataKey="day" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#1a1d2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hours by department */}
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: isDark ? 'var(--bg-card)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          <h3 className={clsx('text-sm font-semibold mb-4', isDark ? 'text-gray-200' : 'text-gray-700')}>
            Hours by Department
          </h3>
          <div className="space-y-3">
            {DEPT_HOURS.map((d) => {
              const total = DEPT_HOURS.reduce((s, x) => s + x.hours, 0);
              const pct = Math.round((d.hours / total) * 100);
              return (
                <div key={d.dept}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{d.dept}</span>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{d.hours}h ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: d.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Donut-style summary */}
          <div className="mt-5">
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={DEPT_HOURS} layout="vertical" barCategoryGap="30%">
                <XAxis type="number" tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}h`} />
                <YAxis dataKey="dept" type="category" tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip
                  contentStyle={{
                    background: '#1a1d2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                  {DEPT_HOURS.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hours by job (bar chart) */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{
            backgroundColor: isDark ? 'var(--bg-card)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          <h3 className={clsx('text-sm font-semibold mb-4', isDark ? 'text-gray-200' : 'text-gray-700')}>
            Hours by Job Type
          </h3>
          {hoursLoading ? (
            <div className="h-60 shimmer rounded-xl" />
          ) : (
            <HoursBarChart data={hoursBar ?? []} />
          )}
        </div>
      </div>

      {/* Weekly hours area chart */}
      <div
        className="rounded-2xl p-5"
        style={{
          backgroundColor: isDark ? 'var(--bg-card)' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={clsx('text-sm font-semibold', isDark ? 'text-gray-200' : 'text-gray-700')}>
            Weekly Hours Accumulation
          </h3>
          <span className={clsx('text-xs px-2 py-1 rounded-full', 'bg-indigo-500/15 text-indigo-400')}>
            Mar 14–20, 2026
          </span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart
            data={[
              { day: 'Sat 14', hours: 88 },
              { day: 'Sun 15', hours: 0 },
              { day: 'Mon 16', hours: 168 },
              { day: 'Tue 17', hours: 256 },
              { day: 'Wed 18', hours: 342 },
              { day: 'Thu 19', hours: 430 },
              { day: 'Fri 20', hours: 517 },
            ]}
          >
            <defs>
              <linearGradient id="cumulGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis dataKey="day" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}h`} />
            <Tooltip
              contentStyle={{
                background: '#1a1d2e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="hours"
              name="Cumulative Hours"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#cumulGrad)"
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
