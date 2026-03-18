import { useState, type ReactNode } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeStore } from '@/app/store/themeStore';
import clsx from 'clsx';
import type { SortConfig } from '@/types';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSort?: (sort: SortConfig) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string;
}

function SortIcon({ column, sort }: { column: string; sort: SortConfig | null }) {
  if (!sort || sort.key !== column) return <ChevronsUpDown size={13} className="opacity-40" />;
  return sort.direction === 'asc'
    ? <ChevronUp size={13} className="text-indigo-400" />
    : <ChevronDown size={13} className="text-indigo-400" />;
}

export function DataTable<T>({
  columns,
  data,
  total,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onSort,
  isLoading,
  emptyMessage = 'No records found',
  keyExtractor,
}: DataTableProps<T>) {
  const { isDark } = useThemeStore();
  const [sort, setSort] = useState<SortConfig | null>(null);

  const handleSort = (key: string) => {
    const newSort: SortConfig = {
      key,
      direction: sort?.key === key && sort.direction === 'asc' ? 'desc' : 'asc',
    };
    setSort(newSort);
    onSort?.(newSort);
  };

  const startRow = (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, total);

  return (
    <div>
      <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    'px-4 py-3 text-left font-semibold',
                    isDark ? 'text-gray-400' : 'text-gray-500',
                    col.sortable && 'cursor-pointer select-none hover:text-indigo-400 transition-colors'
                  )}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && <SortIcon column={col.key} sort={sort} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}` }}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="shimmer h-4 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className="transition-colors"
                  style={{
                    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor = isDark
                      ? 'rgba(255,255,255,0.02)'
                      : 'rgba(0,0,0,0.01)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
                  }}
                >
                  {columns.map((col) => {
                    const value = (row as Record<string, unknown>)[col.key];
                    return (
                      <td
                        key={col.key}
                        className={clsx('px-4 py-3', isDark ? 'text-gray-300' : 'text-gray-700')}
                      >
                        {col.render ? col.render(value, row) : String(value ?? '')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className={clsx('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>
            Showing {startRow}–{endRow} of {total} records
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className={clsx(
                'p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed',
                isDark ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              )}
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pg: number;
              if (totalPages <= 7) {
                pg = i + 1;
              } else if (page <= 4) {
                pg = i + 1;
              } else if (page >= totalPages - 3) {
                pg = totalPages - 6 + i;
              } else {
                pg = page - 3 + i;
              }
              return (
                <button
                  key={pg}
                  onClick={() => onPageChange(pg)}
                  className={clsx(
                    'w-7 h-7 rounded-lg text-xs font-medium transition-colors',
                    page === pg
                      ? 'gradient-bg text-white'
                      : isDark
                      ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className={clsx(
                'p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed',
                isDark ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              )}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
