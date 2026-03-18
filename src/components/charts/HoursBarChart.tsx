import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useThemeStore } from '@/app/store/themeStore';
import type { HoursBarData } from '@/types';

interface HoursBarChartProps {
  data: HoursBarData[];
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

export function HoursBarChart({ data }: HoursBarChartProps) {
  const { isDark } = useThemeStore();
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barCategoryGap="30%" barGap={2}>
        <CartesianGrid vertical={false} stroke={gridColor} />
        <XAxis
          dataKey="job"
          tick={{ fill: textColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: textColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v}h`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: textColor }}
          iconType="circle"
          iconSize={8}
        />
        <Bar dataKey="regular" name="Regular" fill="#6366f1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="overtime" name="Overtime" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
