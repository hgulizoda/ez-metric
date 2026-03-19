import clsx from "clsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { minutesToLabel } from "@/utils/punch";

interface DailyDataPoint {
  date: string;
  hours: number;
  arrivalMin: number | null;
}

interface PieDataPoint {
  name: string;
  value: number;
  color: string;
}

interface PunchChartsProps {
  dailyData: DailyDataPoint[];
  pieInOut: PieDataPoint[];
  pieCorrected: PieDataPoint[];
  isDark: boolean;
  textColor: string;
  gridColor: string;
  cardBg: string;
  border: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      {label && <p className="text-xs text-gray-400 mb-1">{label}</p>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-gray-300">{p.name}:</span>
          <span className="text-white font-semibold">
            {typeof p.value === "number" && p.name.includes("Arrival")
              ? minutesToLabel(p.value)
              : `${Number(p.value).toFixed(2)}h`}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PunchCharts({
  dailyData,
  pieInOut,
  pieCorrected,
  isDark,
  textColor,
  gridColor,
  cardBg,
  border,
}: PunchChartsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Hours per day */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
      >
        <h3
          className={clsx(
            "text-sm font-semibold mb-4",
            isDark ? "text-white" : "text-gray-900",
          )}
        >
          Hours Per Day
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={dailyData} barCategoryGap="35%">
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="date"
              tick={{ fill: textColor, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: textColor, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}h`}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "rgba(99,102,241,0.05)" }}
            />
            <Bar
              dataKey="hours"
              name="Hours"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Arrival trend */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
      >
        <h3
          className={clsx(
            "text-sm font-semibold mb-4",
            isDark ? "text-white" : "text-gray-900",
          )}
        >
          Arrival Time Trend
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={dailyData.filter((d) => d.arrivalMin !== null)}>
            <defs>
              <linearGradient id="arrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="date"
              tick={{ fill: textColor, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: textColor, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
              tickFormatter={(v: number) => minutesToLabel(v)}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="arrivalMin"
              name="Arrival"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#arrGrad)"
              dot={{ r: 3, fill: "#10b981" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* In vs Out ratio */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
      >
        <h3
          className={clsx(
            "text-sm font-semibold mb-4",
            isDark ? "text-white" : "text-gray-900",
          )}
        >
          In / Out Ratio
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={pieInOut}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
            >
              {pieInOut.map((e, i) => (
                <Cell key={i} fill={e.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip formatter={(v: unknown) => [Number(v ?? 0), ""]} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, color: textColor }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Corrected entries */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
      >
        <h3
          className={clsx(
            "text-sm font-semibold mb-4",
            isDark ? "text-white" : "text-gray-900",
          )}
        >
          Corrected Entries
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={pieCorrected}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
            >
              {pieCorrected.map((e, i) => (
                <Cell key={i} fill={e.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip formatter={(v: unknown) => [Number(v ?? 0), ""]} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, color: textColor }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
