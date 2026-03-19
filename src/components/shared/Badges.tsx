import type { Employee } from '@/types';

export function StatusBadge({ status }: { status: Employee['status'] }) {
  const configs: Record<Employee['status'], { label: string; bg: string; text: string }> = {
    'active': { label: 'Active', bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
    'punched-in': { label: 'Punched In', bg: 'rgba(16,185,129,0.15)', text: '#34d399' },
    'punched-out': { label: 'Punched Out', bg: 'rgba(99,102,241,0.15)', text: '#818cf8' },
    'archived': { label: 'Archived', bg: 'rgba(107,114,128,0.15)', text: '#9ca3af' },
  };
  const c = configs[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {status === 'punched-in' && <span className="mr-1 pulse-dot" style={{ width: 6, height: 6 }} />}
      {c.label}
    </span>
  );
}

export function DeptBadge({ dept }: { dept: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    'Office': { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24' },
    'Mechanical Floor': { bg: 'rgba(99,102,241,0.15)', text: '#818cf8' },
    'Parts': { bg: 'rgba(16,185,129,0.15)', text: '#34d399' },
    'Management': { bg: 'rgba(139,92,246,0.15)', text: '#a78bfa' },
  };
  const c = colors[dept] ?? { bg: 'rgba(107,114,128,0.15)', text: '#9ca3af' };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {dept}
    </span>
  );
}
