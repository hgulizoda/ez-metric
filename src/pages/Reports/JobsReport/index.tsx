import clsx from "clsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Download } from "lucide-react";
import { useThemeStore } from "@/app/store/themeStore";
import { MOCK_PUNCHES } from "@/services/api/punches";
import { computePairs, groupByDate } from "@/utils/punch";

interface JobData {
  job: string;
  hours: number;
  employees: number;
  color: string;
}

const JOB_COLORS: Record<string, string> = {
  "Main Work": "#6366f1",
  "Lunch Break": "#f59e0b",
  Overtime: "#ef4444",
  Training: "#8b5cf6",
  "Parts Run": "#10b981",
};

function buildJobData(): JobData[] {
  const byEmp: Record<string, typeof MOCK_PUNCHES> = {};
  MOCK_PUNCHES.forEach((p) => {
    if (!byEmp[p.employeeName]) byEmp[p.employeeName] = [];
    byEmp[p.employeeName].push(p);
  });

  let totalRegular = 0;
  let totalOT = 0;
  const empCount = Object.keys(byEmp).length;

  Object.values(byEmp).forEach((records) => {
    const byDate = groupByDate(records);
    Object.values(byDate).forEach((dayRecs) => {
      const pairs = computePairs(dayRecs);
      const dayH = pairs.reduce((s, p) => s + (p.hours ?? 0), 0);
      if (dayH > 8) {
        totalRegular += 8;
        totalOT += dayH - 8;
      } else {
        totalRegular += dayH;
      }
    });
  });

  const lunchHours = empCount * 3 * 0.5;

  return [
    {
      job: "Main Work",
      hours: parseFloat(totalRegular.toFixed(1)),
      employees: empCount,
      color: "#6366f1",
    },
    {
      job: "Overtime",
      hours: parseFloat(totalOT.toFixed(1)),
      employees: Math.min(empCount, 4),
      color: "#ef4444",
    },
    {
      job: "Lunch Break",
      hours: parseFloat(lunchHours.toFixed(1)),
      employees: empCount,
      color: "#f59e0b",
    },
    {
      job: "Training",
      hours: 4.0,
      employees: 2,
      color: "#8b5cf6",
    },
    {
      job: "Parts Run",
      hours: 2.5,
      employees: 1,
      color: "#10b981",
    },
  ];
}

export default function JobsReport() {
  const { isDark } = useThemeStore();
  const cardBg = isDark ? "var(--bg-card)" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";

  const jobData = buildJobData();
  const totalHours = jobData.reduce((s, j) => s + j.hours, 0);

  return (
    <div className="space-y-4">
      {/* Summary metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Job Types", value: jobData.length, color: "#8b5cf6" },
          { label: "Total Hours", value: `${totalHours.toFixed(1)}h`, color: "#6366f1" },
          { label: "Employees", value: [...new Set(MOCK_PUNCHES.map((p) => p.employeeId))].length, color: "#10b981" },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar chart */}
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
        >
          <h3 className={clsx("text-sm font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>
            Hours by Job Type
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={jobData} barCategoryGap="30%">
              <CartesianGrid vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="job"
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
                contentStyle={{
                  backgroundColor: isDark ? "#1e2130" : "#fff",
                  border: `1px solid ${border}`,
                  borderRadius: "0.75rem",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="hours" name="Hours" radius={[4, 4, 0, 0]}>
                {jobData.map((j, i) => (
                  <Cell key={i} fill={j.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
        >
          <h3 className={clsx("text-sm font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>
            Distribution
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={jobData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="hours"
                nameKey="job"
              >
                {jobData.map((j, i) => (
                  <Cell key={i} fill={j.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip formatter={(v: unknown) => [`${Number(v ?? 0).toFixed(1)}h`, ""]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: textColor }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={clsx("text-sm font-semibold", isDark ? "text-white" : "text-gray-900")}>
            Job Breakdown
          </h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors">
            <Download size={13} /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={clsx("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                <th className="text-left pb-3 font-medium">Job Code</th>
                <th className="text-right pb-3 font-medium">Hours</th>
                <th className="text-right pb-3 font-medium">% of Total</th>
                <th className="text-right pb-3 font-medium">Employees</th>
              </tr>
            </thead>
            <tbody>
              {jobData.map((j) => (
                <tr
                  key={j.job}
                  className={clsx("border-t", isDark ? "border-white/5" : "border-gray-100")}
                >
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: j.color }}
                      />
                      <span className={clsx("font-medium", isDark ? "text-gray-200" : "text-gray-700")}>
                        {j.job}
                      </span>
                    </div>
                  </td>
                  <td className={clsx("py-2.5 text-right font-medium", isDark ? "text-gray-200" : "text-gray-700")}>
                    {j.hours.toFixed(1)}h
                  </td>
                  <td className="py-2.5 text-right text-gray-500">
                    {((j.hours / totalHours) * 100).toFixed(1)}%
                  </td>
                  <td className={clsx("py-2.5 text-right", isDark ? "text-gray-300" : "text-gray-600")}>
                    {j.employees}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={clsx("border-t-2", isDark ? "border-white/10" : "border-gray-200")}>
                <td className={clsx("py-3 font-semibold", isDark ? "text-gray-300" : "text-gray-700")}>
                  Total
                </td>
                <td className={clsx("py-3 text-right font-bold", isDark ? "text-white" : "text-gray-900")}>
                  {totalHours.toFixed(1)}h
                </td>
                <td className="py-3 text-right font-bold text-gray-500">100%</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
