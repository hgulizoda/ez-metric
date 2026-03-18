import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useThemeStore } from '@/app/store/themeStore';
import type { OvertimeLineData } from '@/types';

interface OvertimeLineChartProps {
  data: OvertimeLineData[];
}

interface TooltipPayloadItem {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="text-xs text-gray-400 mb-2">{label}</p>
      {payload.map((item) => (
        <div key={item.name} className="flex items-center gap-2 text-xs mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-gray-300">{item.name}:</span>
          <span className="text-white font-semibold">{item.value.toFixed(1)}h</span>
        </div>
      ))}
    </div>
  );
}

export function OvertimeLineChart({ data }: OvertimeLineChartProps) {
  const { isDark } = useThemeStore();
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="overtimeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={gridColor} />
        <XAxis
          dataKey="date"
          tick={{ fill: textColor, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <YAxis
          tick={{ fill: textColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v}h`}
          domain={[0, 'auto']}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(99,102,241,0.2)', strokeWidth: 1 }} />
        <ReferenceLine
          y={40}
          stroke="#f59e0b"
          strokeDasharray="4 4"
          strokeWidth={1.5}
          label={{ value: 'OT Threshold', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }}
        />
        <Area
          type="monotone"
          dataKey="hours"
          name="Total Hours"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#hoursGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#6366f1' }}
        />
        <Area
          type="monotone"
          dataKey="overtime"
          name="Overtime"
          stroke="#f59e0b"
          strokeWidth={2}
          fill="url(#overtimeGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#f59e0b' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

