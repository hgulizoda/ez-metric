import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PunchDonutData } from '@/types';

interface PunchDonutChartProps {
  data: PunchDonutData[];
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: { color: string };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="custom-tooltip">
      <div className="flex items-center gap-2 text-xs">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.payload.color }} />
        <span className="text-gray-300">{item.name}:</span>
        <span className="text-white font-semibold">{item.value}</span>
      </div>
    </div>
  );
}

export function PunchDonutChart({ data }: PunchDonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
        />
        {/* Center label */}
        <text x="50%" y="42%" textAnchor="middle" dominantBaseline="central">
          <tspan fontSize="24" fontWeight="bold" fill="#f1f5f9" x="50%" dy="0">
            {total}
          </tspan>
          <tspan fontSize="11" fill="#94a3b8" x="50%" dy="20">
            Employees
          </tspan>
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}

