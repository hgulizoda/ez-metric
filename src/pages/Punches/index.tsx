import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, LogIn, LogOut } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { useThemeStore } from '@/app/store/themeStore';
import { notifications } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import { apiGetPunches, MOCK_PUNCHES } from '@/services/api';
import clsx from 'clsx';
import type { Punch, PunchFilters } from '@/types';
import { getPunchColumns } from './columns';

const DEPARTMENTS = ['all', 'Mechanical Floor', 'Office', 'Parts', 'Management'] as const;
const CLOCK_TYPES = ['all', 'IN', 'OUT'] as const;
const CORRECTED_OPTS = [
  { value: 'all', label: 'All' },
  { value: 'false', label: 'Normal' },
  { value: 'true', label: 'Corrected' },
] as const;

// Derive the current simulated state from mock data for the logged-in user (emp-002)
const CURRENT_USER_ID = 'emp-002';
function getCurrentClockState() {
  const userRecords = MOCK_PUNCHES.filter((p) => p.employeeId === CURRENT_USER_ID)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const latest = userRecords[0];
  return latest?.type === 'IN' ? 'in' : 'out';
}

export default function ClockRecords() {
  const { isDark } = useThemeStore();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [clockType, setClockType] = useState<string>('all');
  const [corrected, setCorrected] = useState<string>('all');
  const [dept, setDept] = useState<string>('all');
  const [clockState, setClockState] = useState<'in' | 'out'>(getCurrentClockState);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const filters: Partial<PunchFilters> = {
    search: debouncedSearch,
    type: clockType as PunchFilters['type'],
    department: dept as PunchFilters['department'],
    corrected: corrected === 'all' ? 'all' : corrected === 'true',
  };

  const { data, isLoading } = useQuery({
    queryKey: ['clocks', filters, page],
    queryFn: () => apiGetPunches(filters, page, 15),
    staleTime: 30 * 1000,
  });

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 300);
  };

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setClockType('all');
    setCorrected('all');
    setDept('all');
    setPage(1);
  };

  const handleClockIn = () => {
    if (clockState === 'in') {
      notifications.show({ title: 'Already Clocked In', message: 'You must clock out before clocking in again.', color: 'red' });
      return;
    }
    setClockState('in');
    notifications.show({ title: 'Clocked In', message: `Welcome! Clocked in at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`, color: 'green' });
  };

  const handleClockOut = () => {
    if (clockState === 'out') {
      notifications.show({ title: 'Not Clocked In', message: 'You must clock in before clocking out.', color: 'red' });
      return;
    }
    setClockState('out');
    notifications.show({ title: 'Clocked Out', message: `See you! Clocked out at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`, color: 'indigo' });
  };

  const hasActiveFilters = debouncedSearch || clockType !== 'all' || dept !== 'all' || corrected !== 'all';

  const cardStyle = {
    backgroundColor: isDark ? 'var(--bg-card)' : '#ffffff',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
  };

  const columns = getPunchColumns(isDark, navigate);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
            Clock Records
          </h1>
          <p className={clsx('text-sm mt-0.5', isDark ? 'text-gray-500' : 'text-gray-400')}>
            Pay Period: Mar 14 – Mar 20, 2026 &nbsp;•&nbsp; {data?.total ?? 0} records
          </p>
        </div>

        {/* Clock In / Clock Out buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Status indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: clockState === 'in' ? '#10b981' : '#6b7280' }}
            />
            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              {clockState === 'in' ? 'Working' : 'Not Working'}
            </span>
          </div>
          <button
            onClick={handleClockIn}
            disabled={clockState === 'in'}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: clockState === 'in' ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.15)',
              color: clockState === 'in' ? '#6b7280' : '#34d399',
              border: `1px solid ${clockState === 'in' ? 'rgba(107,114,128,0.2)' : 'rgba(16,185,129,0.3)'}`,
              cursor: clockState === 'in' ? 'not-allowed' : 'pointer',
            }}
          >
            <LogIn size={14} />
            Clock In
          </button>
          <button
            onClick={handleClockOut}
            disabled={clockState === 'out'}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: clockState === 'out' ? 'rgba(239,68,68,0.05)' : 'rgba(239,68,68,0.12)',
              color: clockState === 'out' ? '#6b7280' : '#f87171',
              border: `1px solid ${clockState === 'out' ? 'rgba(107,114,128,0.2)' : 'rgba(239,68,68,0.3)'}`,
              cursor: clockState === 'out' ? 'not-allowed' : 'pointer',
            }}
          >
            <LogOut size={14} />
            Clock Out
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl p-4 flex flex-wrap gap-3" style={cardStyle}>
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search employee or date..."
            className={clsx(
              'w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-all',
              isDark
                ? 'bg-white/5 text-gray-200 placeholder-gray-600 border border-white/8 focus:border-indigo-500/50'
                : 'bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 focus:border-indigo-400'
            )}
          />
          {search && (
            <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Type filter */}
        <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}` }}>
          {CLOCK_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => { setClockType(t); setPage(1); }}
              className={clsx(
                'px-3 py-2 text-xs font-medium transition-colors flex items-center gap-1',
                clockType === t
                  ? 'gradient-bg text-white'
                  : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {t === 'IN' && <LogIn size={10} />}
              {t === 'OUT' && <LogOut size={10} />}
              {t === 'all' ? 'All Types' : t === 'IN' ? 'Clock In' : 'Clock Out'}
            </button>
          ))}
        </div>

        {/* Corrected filter */}
        <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}` }}>
          {CORRECTED_OPTS.map((o) => (
            <button
              key={o.value}
              onClick={() => { setCorrected(o.value); setPage(1); }}
              className={clsx(
                'px-3 py-2 text-xs font-medium transition-colors',
                corrected === o.value
                  ? o.value === 'true' ? 'bg-yellow-500/20 text-yellow-300' : 'gradient-bg text-white'
                  : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Department select */}
        <select
          value={dept}
          onChange={(e) => { setDept(e.target.value); setPage(1); }}
          className={clsx(
            'text-sm px-3 py-2 rounded-xl outline-none',
            isDark
              ? 'bg-white/5 text-gray-300 border border-white/8'
              : 'bg-gray-50 text-gray-700 border border-gray-200'
          )}
        >
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors px-2"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <DataTable<Punch>
        columns={columns}
        data={data?.data ?? []}
        total={data?.total ?? 0}
        page={page}
        pageSize={15}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        isLoading={isLoading}
        keyExtractor={(row) => row.id}
        emptyMessage="No clock records found."
      />

    </div>
  );
}
