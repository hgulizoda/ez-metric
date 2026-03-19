import clsx from "clsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Download } from "lucide-react";
import { useThemeStore } from "@/app/store/themeStore";
import { MOCK_PUNCHES } from "@/services/api/punches";
import { computePairs, groupByDate } from "@/utils/punch";

interface EmpSummary {
  name: string;
  department: string;
  regular: number;
  overtime: number;
  total: number;
  daysWorked: number;
}

function buildSummaries(): EmpSummary[] {
  const byEmp: Record<string, typeof MOCK_PUNCHES> = {};
  MOCK_PUNCHES.forEach((p) => {
    if (!byEmp[p.employeeName]) byEmp[p.employeeName] = [];
    byEmp[p.employeeName].push(p);
  });

  return Object.entries(byEmp).map(([name, records]) => {
    const byDate = groupByDate(records);
    let totalHours = 0;
    let otHours = 0;
    const daysWorked = Object.keys(byDate).length;

    Object.values(byDate).forEach((dayRecs) => {
      const pairs = computePairs(dayRecs);
      const dayH = pairs.reduce((s, p) => s + (p.hours ?? 0), 0);
      totalHours += dayH;
      if (dayH > 8) otHours += dayH - 8;
    });

    const regular = totalHours - otHours;
    return {
      name,
      department: records[0].department,
      regular: parseFloat(regular.toFixed(2)),
      overtime: parseFloat(otHours.toFixed(2)),
      total: parseFloat(totalHours.toFixed(2)),
      daysWorked,
    };
  });
}

export default function TotalsSummary() {
  const { isDark } = useThemeStore();
  const cardBg = isDark ? "var(--bg-card)" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";

  const summaries = buildSummaries();
  const grandRegular = summaries.reduce((s, e) => s + e.regular, 0);
  const grandOT = summaries.reduce((s, e) => s + e.overtime, 0);
  const grandTotal = summaries.reduce((s, e) => s + e.total, 0);

  return (
    <div className="space-y-4">
      {/* Summary metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Regular Hours", value: `${grandRegular.toFixed(1)}h`, color: "#6366f1" },
          { label: "Overtime Hours", value: `${grandOT.toFixed(1)}h`, color: "#f59e0b" },
          { label: "Total Hours", value: `${grandTotal.toFixed(1)}h`, color: "#10b981" },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
          >
            <div className="text-2xl font-bold" style={{ color: m.color }}>
              {m.value}
            </div>
            <div className={clsx("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Stacked bar chart */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={clsx("text-sm font-semibold", isDark ? "text-white" : "text-gray-900")}
          >
            Hours by Employee
          </h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors">
            <Download size={13} /> Export CSV
          </button>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={summaries} barCategoryGap="25%">
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="name"
              tick={{ fill: textColor, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fill: textColor, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}h`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1e2130" : "#fff",
                border: `1px solid ${border}`,
                borderRadius: "0.75rem",
                fontSize: 12,
              }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="regular" name="Regular" fill="#6366f1" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="overtime" name="Overtime" fill="#f59e0b" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
      >
        <h3
          className={clsx("text-sm font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}
        >
          Period Totals
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={clsx("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                <th className="text-left pb-3 font-medium">Employee</th>
                <th className="text-left pb-3 font-medium">Department</th>
                <th className="text-right pb-3 font-medium">Days</th>
                <th className="text-right pb-3 font-medium">Regular</th>
                <th className="text-right pb-3 font-medium">Overtime</th>
                <th className="text-right pb-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((e) => (
                <tr
                  key={e.name}
                  className={clsx("border-t", isDark ? "border-white/5" : "border-gray-100")}
                >
                  <td className={clsx("py-2.5 font-medium", isDark ? "text-gray-200" : "text-gray-700")}>
                    {e.name}
                  </td>
                  <td className="py-2.5 text-gray-500 text-xs">{e.department}</td>
                  <td className={clsx("py-2.5 text-right", isDark ? "text-gray-300" : "text-gray-600")}>
                    {e.daysWorked}
                  </td>
                  <td className={clsx("py-2.5 text-right", isDark ? "text-gray-300" : "text-gray-600")}>
                    {e.regular.toFixed(2)}h
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={e.overtime > 0 ? "text-amber-400 font-medium" : "text-gray-500"}>
                      {e.overtime.toFixed(2)}h
                    </span>
                  </td>
                  <td className={clsx("py-2.5 text-right font-semibold", isDark ? "text-white" : "text-gray-900")}>
                    {e.total.toFixed(2)}h
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={clsx("border-t-2", isDark ? "border-white/10" : "border-gray-200")}>
                <td colSpan={3} className={clsx("py-3 font-semibold", isDark ? "text-gray-300" : "text-gray-700")}>
                  Grand Total
                </td>
                <td className={clsx("py-3 text-right font-bold", isDark ? "text-white" : "text-gray-900")}>
                  {grandRegular.toFixed(2)}h
                </td>
                <td className="py-3 text-right font-bold text-amber-400">{grandOT.toFixed(2)}h</td>
                <td className={clsx("py-3 text-right font-bold", isDark ? "text-white" : "text-gray-900")}>
                  {grandTotal.toFixed(2)}h
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
