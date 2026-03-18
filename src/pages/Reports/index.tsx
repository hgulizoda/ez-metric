import { FileText, Download, Eye, Clock, Users, AlertTriangle, DollarSign, BarChart2, Calendar } from 'lucide-react';
import { useThemeStore } from '@/app/store/themeStore';
import { notifications } from '@mantine/notifications';
import clsx from 'clsx';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  tags: string[];
  lastGenerated?: string;
}

const REPORTS: ReportCard[] = [
  {
    id: 'timecard',
    title: 'Timecard Detail',
    description: 'Full punch-in/out records per employee with hours worked, job code, and source.',
    icon: <Clock size={20} />,
    color: '#6366f1',
    bgColor: 'rgba(99,102,241,0.15)',
    tags: ['Punches', 'Hours'],
    lastGenerated: '03/18/2026',
  },
  {
    id: 'totals-summary',
    title: 'Totals Summary',
    description: 'Weekly and pay-period hour totals per employee including regular, overtime, and PTO.',
    icon: <BarChart2 size={20} />,
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.15)',
    tags: ['Summary', 'Hours', 'OT'],
    lastGenerated: '03/18/2026',
  },
  {
    id: 'jobs',
    title: 'Jobs Report',
    description: 'Hours breakdown by job type — Main Work, Lunch Time, and other job codes.',
    icon: <FileText size={20} />,
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.15)',
    tags: ['Jobs', 'Hours'],
    lastGenerated: '03/17/2026',
  },
  {
    id: 'authorization',
    title: 'Authorization Report',
    description: 'Timesheet authorization sheet per employee for signature and approval.',
    icon: <Users size={20} />,
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.15)',
    tags: ['Authorization', 'Payroll'],
    lastGenerated: '03/16/2026',
  },
  {
    id: 'missed-punches',
    title: 'Missed Punches',
    description: 'All employees with missing IN or OUT punches for the selected period.',
    icon: <AlertTriangle size={20} />,
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.15)',
    tags: ['Alerts', 'Compliance'],
    lastGenerated: '03/18/2026',
  },
  {
    id: 'exceptions',
    title: 'Exceptions Report',
    description: 'Late arrivals, early departures, and early clock-ins flagged by shift rules.',
    icon: <AlertTriangle size={20} />,
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.15)',
    tags: ['Exceptions', 'Shifts'],
    lastGenerated: '03/18/2026',
  },
  {
    id: 'who-is-in',
    title: "Who Is IN / Who Is OUT",
    description: 'Real-time view of which employees are currently clocked in or out.',
    icon: <Users size={20} />,
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.15)',
    tags: ['Live', 'Attendance'],
  },
  {
    id: 'payroll',
    title: 'Payroll Export',
    description: 'Export formatted payroll data compatible with ADP, QuickBooks, or custom CSV.',
    icon: <DollarSign size={20} />,
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.15)',
    tags: ['Payroll', 'Export'],
    lastGenerated: '03/14/2026',
  },
];

export default function Reports() {
  const { isDark } = useThemeStore();

  const handleView = (report: ReportCard) => {
    notifications.show({
      title: `Viewing: ${report.title}`,
      message: 'Report preview would open in a modal or new tab.',
      color: 'indigo',
    });
  };

  const handleExport = (report: ReportCard, format: string) => {
    notifications.show({
      title: `Exported: ${report.title}`,
      message: `Report exported as ${format}.`,
      color: 'green',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
            Reports
          </h1>
          <p className={clsx('text-sm mt-0.5', isDark ? 'text-gray-500' : 'text-gray-400')}>
            Generate and export workforce reports
          </p>
        </div>
        {/* Pay period badge */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{
            backgroundColor: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          <Calendar size={14} className="text-indigo-400" />
          <span className="text-indigo-300 font-medium">Mar 14 – Mar 20, 2026</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Reports', value: REPORTS.length, color: '#6366f1' },
          { label: 'Generated Today', value: 3, color: '#10b981' },
          { label: 'Pending Export', value: 2, color: '#f59e0b' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-4 text-center"
            style={{
              backgroundColor: isDark ? 'var(--bg-card)' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className={clsx('text-xs mt-1', isDark ? 'text-gray-500' : 'text-gray-400')}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Report cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {REPORTS.map((report) => (
          <div
            key={report.id}
            className={clsx('rounded-2xl p-5 flex flex-col gap-4 card-hover')}
            style={{
              backgroundColor: isDark ? 'var(--bg-card)' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            {/* Icon + Title */}
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: report.bgColor, color: report.color }}
              >
                {report.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={clsx('font-semibold text-sm', isDark ? 'text-gray-100' : 'text-gray-800')}>
                  {report.title}
                </h3>
                {report.lastGenerated && (
                  <div className={clsx('text-xs mt-0.5', isDark ? 'text-gray-500' : 'text-gray-400')}>
                    Last: {report.lastGenerated}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <p className={clsx('text-xs leading-relaxed flex-1', isDark ? 'text-gray-400' : 'text-gray-500')}>
              {report.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {report.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? '#94a3b8' : '#64748b',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
              <button
                onClick={() => handleView(report)}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors',
                  isDark
                    ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                <Eye size={13} />
                Preview
              </button>
              <button
                onClick={() => handleExport(report, 'PDF')}
                className={clsx(
                  'flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors',
                  isDark ? 'bg-white/5 text-gray-400 hover:text-gray-200' : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                )}
                title="Export PDF"
              >
                <Download size={13} />
                PDF
              </button>
              <button
                onClick={() => handleExport(report, 'CSV')}
                className={clsx(
                  'flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-emerald-400 hover:text-emerald-300',
                  'bg-emerald-500/10 hover:bg-emerald-500/15'
                )}
                title="Export CSV"
              >
                CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
