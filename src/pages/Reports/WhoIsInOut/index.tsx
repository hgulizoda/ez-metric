import { useState } from "react";
import clsx from "clsx";
import { LogIn, LogOut, Search, Users } from "lucide-react";
import { useThemeStore } from "@/app/store/themeStore";
import { MOCK_PUNCHES } from "@/services/api/punches";
import type { Department } from "@/types";

interface EmployeeStatus {
  employeeId: string;
  employeeName: string;
  department: Department;
  status: "IN" | "OUT";
  lastPunchTime: string;
  lastPunchType: "IN" | "OUT";
  source: string;
}

function buildStatusList(): EmployeeStatus[] {
  const byEmp: Record<string, typeof MOCK_PUNCHES> = {};
  MOCK_PUNCHES.forEach((p) => {
    if (!byEmp[p.employeeId]) byEmp[p.employeeId] = [];
    byEmp[p.employeeId].push(p);
  });

  return Object.entries(byEmp).map(([empId, records]) => {
    const sorted = [...records].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const latest = sorted[0];
    return {
      employeeId: empId,
      employeeName: latest.employeeName,
      department: latest.department,
      status: latest.type === "IN" ? "IN" : "OUT",
      lastPunchTime: latest.time,
      lastPunchType: latest.type,
      source: latest.source,
    };
  });
}

export default function WhoIsInOut() {
  const { isDark } = useThemeStore();
  const [filter, setFilter] = useState<"all" | "IN" | "OUT">("all");
  const [search, setSearch] = useState("");
  const cardBg = isDark ? "var(--bg-card)" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  const allStatuses = buildStatusList();
  const filtered = allStatuses
    .filter((e) => filter === "all" || e.status === filter)
    .filter(
      (e) =>
        !search ||
        e.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        e.department.toLowerCase().includes(search.toLowerCase())
    );

  const inCount = allStatuses.filter((e) => e.status === "IN").length;
  const outCount = allStatuses.filter((e) => e.status === "OUT").length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Employees", value: allStatuses.length, color: "#6366f1" },
          { label: "Clocked IN", value: inCount, color: "#10b981" },
          { label: "Clocked OUT", value: outCount, color: "#94a3b8" },
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

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 max-w-xs"
          style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
        >
          <Search size={14} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={clsx(
              "bg-transparent outline-none text-sm flex-1",
              isDark ? "text-gray-200 placeholder:text-gray-600" : "text-gray-700 placeholder:text-gray-400"
            )}
          />
        </div>
        <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
          {(["all", "IN", "OUT"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "px-3 py-2 text-xs font-medium transition-colors",
                filter === f
                  ? "bg-indigo-500/20 text-indigo-400"
                  : isDark
                  ? "text-gray-400 hover:bg-white/5"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {f === "all" ? "All" : f === "IN" ? "Clocked In" : "Clocked Out"}
            </button>
          ))}
        </div>
      </div>

      {/* Employee grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((emp) => {
          const isIn = emp.status === "IN";
          return (
            <div
              key={emp.employeeId}
              className="rounded-2xl p-4"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${isIn ? "rgba(16,185,129,0.25)" : border}`,
              }}
            >
              <div className="flex items-start gap-3">
                {/* Status indicator */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isIn
                      ? "rgba(16,185,129,0.12)"
                      : isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.04)",
                  }}
                >
                  {isIn ? (
                    <LogIn size={18} className="text-emerald-400" />
                  ) : (
                    <LogOut size={18} className="text-gray-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    className={clsx(
                      "font-semibold text-sm truncate",
                      isDark ? "text-gray-100" : "text-gray-800"
                    )}
                  >
                    {emp.employeeName}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">{emp.department}</p>
                </div>

                {/* Status badge */}
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                  style={
                    isIn
                      ? { backgroundColor: "rgba(16,185,129,0.12)", color: "#34d399" }
                      : { backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: "#94a3b8" }
                  }
                >
                  {isIn ? "IN" : "OUT"}
                </span>
              </div>

              {/* Last punch info */}
              <div
                className="flex items-center gap-2 mt-3 pt-3 text-xs text-gray-500"
                style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}
              >
                <Users size={11} />
                <span>
                  Last {emp.lastPunchType === "IN" ? "clock in" : "clock out"}: {emp.lastPunchTime}
                </span>
                <span className="text-gray-600">({emp.source})</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div
          className="rounded-2xl p-8 text-center"
          style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
        >
          <p className="text-sm text-gray-500">No employees match your filter.</p>
        </div>
      )}
    </div>
  );
}
