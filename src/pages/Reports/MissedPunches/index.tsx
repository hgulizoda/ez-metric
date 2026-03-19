import clsx from "clsx";
import { AlertTriangle, Download, Clock } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useThemeStore } from "@/app/store/themeStore";
import { MOCK_PUNCHES } from "@/services/api/punches";
import { groupByDate } from "@/utils/punch";
import type { Department } from "@/types";

interface MissedPunch {
  id: string;
  employeeName: string;
  department: Department;
  date: string;
  missingType: "IN" | "OUT";
  lastKnownTime: string;
  severity: "high" | "medium";
}

function findMissedPunches(): MissedPunch[] {
  const byEmp: Record<string, typeof MOCK_PUNCHES> = {};
  MOCK_PUNCHES.forEach((p) => {
    if (!byEmp[p.employeeName]) byEmp[p.employeeName] = [];
    byEmp[p.employeeName].push(p);
  });

  const missed: MissedPunch[] = [];
  let idCounter = 1;

  Object.entries(byEmp).forEach(([name, records]) => {
    const byDate = groupByDate(records);
    Object.entries(byDate).forEach(([date, dayRecs]) => {
      const sorted = [...dayRecs].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      const ins = sorted.filter((r) => r.type === "IN");
      const outs = sorted.filter((r) => r.type === "OUT");

      if (ins.length > outs.length) {
        missed.push({
          id: `miss-${idCounter++}`,
          employeeName: name,
          department: records[0].department,
          date,
          missingType: "OUT",
          lastKnownTime: ins[ins.length - 1].time,
          severity: "high",
        });
      }
    });
  });

  // Add some mock missed punches for demo purposes
  missed.push(
    {
      id: `miss-${idCounter++}`,
      employeeName: "Hernandez, Marco",
      department: "Parts",
      date: "03/18/2026",
      missingType: "OUT",
      lastKnownTime: "7:30 AM",
      severity: "high",
    },
    {
      id: `miss-${idCounter++}`,
      employeeName: "Garcia, Jesus",
      department: "Mechanical Floor",
      date: "03/15/2026",
      missingType: "OUT",
      lastKnownTime: "3:45 PM",
      severity: "medium",
    },
    {
      id: `miss-${idCounter++}`,
      employeeName: "Retana, Jose",
      department: "Mechanical Floor",
      date: "03/15/2026",
      missingType: "IN",
      lastKnownTime: "—",
      severity: "medium",
    }
  );

  return missed;
}

export default function MissedPunches() {
  const { isDark } = useThemeStore();
  const cardBg = isDark ? "var(--bg-card)" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  const missed = findMissedPunches();
  const highCount = missed.filter((m) => m.severity === "high").length;
  const medCount = missed.filter((m) => m.severity === "medium").length;
  const missingIn = missed.filter((m) => m.missingType === "IN").length;
  const missingOut = missed.filter((m) => m.missingType === "OUT").length;

  const pieData = [
    { name: "Missing OUT", value: missingOut, color: "#ef4444" },
    { name: "Missing IN", value: missingIn, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Missed", value: missed.length, color: "#ef4444" },
          { label: "High Severity", value: highCount, color: "#ef4444" },
          { label: "Medium Severity", value: medCount, color: "#f59e0b" },
          { label: "Affected Employees", value: [...new Set(missed.map((m) => m.employeeName))].length, color: "#6366f1" },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pie chart */}
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
        >
          <h3 className={clsx("text-sm font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>
            Missing Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((e, i) => (
                  <Cell key={i} fill={e.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip formatter={(v: unknown) => [Number(v ?? 0), ""]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: textColor }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl p-5 lg:col-span-2"
          style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={clsx("text-sm font-semibold", isDark ? "text-white" : "text-gray-900")}>
              Missed Punch Records
            </h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
              <Download size={13} /> Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={clsx("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                  <th className="text-left pb-3 font-medium">Employee</th>
                  <th className="text-left pb-3 font-medium">Department</th>
                  <th className="text-left pb-3 font-medium">Date</th>
                  <th className="text-center pb-3 font-medium">Missing</th>
                  <th className="text-left pb-3 font-medium">Last Known</th>
                  <th className="text-center pb-3 font-medium">Severity</th>
                </tr>
              </thead>
              <tbody>
                {missed.map((m) => (
                  <tr
                    key={m.id}
                    className={clsx("border-t", isDark ? "border-white/5" : "border-gray-100")}
                  >
                    <td className={clsx("py-2.5 font-medium", isDark ? "text-gray-200" : "text-gray-700")}>
                      {m.employeeName}
                    </td>
                    <td className="py-2.5 text-gray-500 text-xs">{m.department}</td>
                    <td className={clsx("py-2.5", isDark ? "text-gray-300" : "text-gray-600")}>
                      {m.date}
                    </td>
                    <td className="py-2.5 text-center">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: m.missingType === "OUT" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                          color: m.missingType === "OUT" ? "#f87171" : "#fbbf24",
                        }}
                      >
                        <Clock size={10} />
                        {m.missingType === "OUT" ? "Missing OUT" : "Missing IN"}
                      </span>
                    </td>
                    <td className={clsx("py-2.5", isDark ? "text-gray-300" : "text-gray-600")}>
                      {m.lastKnownTime}
                    </td>
                    <td className="py-2.5 text-center">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: m.severity === "high" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                          color: m.severity === "high" ? "#f87171" : "#fbbf24",
                        }}
                      >
                        <AlertTriangle size={10} />
                        {m.severity === "high" ? "High" : "Medium"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
