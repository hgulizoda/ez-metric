import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  rounded?: string;
}

export function Skeleton({ className, height, width, rounded = 'rounded-lg' }: SkeletonProps) {
  return (
    <div
      className={clsx('shimmer', rounded, className)}
      style={{ height, width }}
    />
  );
}

export function KPICardSkeleton() {
  return (
    <div className="rounded-2xl p-5 border border-white/5 bg-white/3">
      <div className="flex justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-20 mb-3" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <div className="rounded-2xl p-5 border border-white/5 bg-white/3">
      <Skeleton className="h-5 w-40 mb-4" />
      <Skeleton style={{ height }} className="w-full rounded-xl" />
    </div>
  );
}
