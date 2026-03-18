import { useState, useRef } from 'react';
import { Search, Plus, X, Clock, LogIn, LogOut } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { useThemeStore } from '@/app/store/themeStore';
import { notifications } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import { apiGetPunches } from '@/services/api';
import clsx from 'clsx';
import type { Punch, PunchFilters } from '@/types';

const DEPARTMENTS = ['all', 'Mechanical Floor', 'Office', 'Parts', 'Management'] as const;
const PUNCH_TYPES = ['all', 'IN', 'OUT'] as const;

export default function Punches() {
  const { isDark } = useThemeStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [punchType, setPunchType] = useState<string>('all');
  const [dept, setDept] = useState<string>('all');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const filters: Partial<PunchFilters> = {
    search: debouncedSearch,
    type: punchType as PunchFilters['type'],
    department: dept as PunchFilters['department'],
  };

  const { data, isLoading } = useQuery({
    queryKey: ['punches', filters, page],
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
    setPunchType('all');
    setDept('all');
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || punchType !== 'all' || dept !== 'all';

  const columns = [
    {
      key: 'id',
      label: 'Punch ID',
      render: (_: unknown, row: Punch) => (
        <span className={clsx('text-xs font-mono', isDark ? 'text-gray-500' : 'text-gray-400')}>
          #{row.id.replace('pch-', '')}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (_: unknown, row: Punch) => (
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
          style={
            row.type === 'IN'
              ? { backgroundColor: 'rgba(16,185,129,0.15)', color: '#34d399' }
              : { backgroundColor: 'rgba(99,102,241,0.15)', color: '#818cf8' }
          }
        >
          {row.type === 'IN' ? <LogIn size={11} /> : <LogOut size={11} />}
          {row.type}
        </span>
      ),
    },
    {
      key: 'employeeName',
      label: 'Employee',
      sortable: true,
      render: (_: unknown, row: Punch) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {row.employeeName.charAt(0)}
          </div>
          <span className={clsx('text-sm', isDark ? 'text-gray-200' : 'text-gray-700')}>{row.employeeName}</span>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (_: unknown, row: Punch) => (
        <span className={clsx('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>{row.department}</span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (_: unknown, row: Punch) => (
        <span className={clsx('text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>{row.date}</span>
      ),
    },
    {
      key: 'time',
      label: 'Time',
      render: (_: unknown, row: Punch) => (
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-gray-500" />
          <span className={clsx('text-sm font-medium', isDark ? 'text-gray-200' : 'text-gray-700')}>{row.time}</span>
        </div>
      ),
    },
    {
      key: 'hoursWorked',
      label: 'Hours',
      render: (_: unknown, row: Punch) => (
        <div>
          {row.hoursWorked ? (
            <div className="flex items-center gap-1">
              <span className={clsx('text-sm font-medium', isDark ? 'text-gray-200' : 'text-gray-700')}>
                {row.hoursWorked.toFixed(2)}h
              </span>
              {row.isOvertime && (
                <span className="text-xs text-yellow-400 bg-yellow-500/10 px-1.5 py-0.5 rounded-full">OT</span>
              )}
            </div>
          ) : (
            <span className="text-gray-600">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'source',
      label: 'Source',
      render: (_: unknown, row: Punch) => (
        <span
          className={clsx(
            'text-xs px-2 py-0.5 rounded-full',
            row.source === 'Device'
              ? isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
              : 'bg-blue-500/10 text-blue-400'
          )}
        >
          {row.source}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_: unknown, row: Punch) => (
        <button
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-indigo-500/10"
          onClick={() => notifications.show({ title: 'Edit Punch', message: `Editing punch #${row.id}`, color: 'indigo' })}
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
            Punch Records
          </h1>
          <p className={clsx('text-sm mt-0.5', isDark ? 'text-gray-500' : 'text-gray-400')}>
            Pay Period: Mar 14 – Mar 20, 2026 &nbsp;•&nbsp; {data?.total ?? 0} records
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm gradient-bg text-white hover:opacity-90 transition-opacity self-start sm:self-auto"
          onClick={() => notifications.show({ title: 'Create Punch', message: 'Manual punch creation form would open', color: 'indigo' })}
        >
          <Plus size={15} />
          Create Punch
        </button>
      </div>

      {/* Filter bar */}
      <div
        className="rounded-2xl p-4 flex flex-wrap gap-3"
        style={{
          backgroundColor: isDark ? 'var(--bg-card)' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        }}
      >
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
          {PUNCH_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => { setPunchType(t); setPage(1); }}
              className={clsx(
                'px-3 py-2 text-xs font-medium transition-colors',
                punchType === t
                  ? 'gradient-bg text-white'
                  : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {t === 'all' ? 'All' : t}
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
        emptyMessage="No punch records found."
      />
    </div>
  );
}
