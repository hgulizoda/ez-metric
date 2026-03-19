import clsx from "clsx";
import { Download, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useThemeStore } from "@/app/store/themeStore";
import { MOCK_PUNCHES } from "@/services/api/punches";
import { computePairs, groupByDate } from "@/utils/punch";

interface AuthRow {
  name: string;
  department: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  daysWorked: number;
  status: "approved" | "pending" | "rejected";
  approvedBy: string | null;
}

function buildAuthData(): AuthRow[] {
  const byEmp: Record<string, typeof MOCK_PUNCHES> = {};
  MOCK_PUNCHES.forEach((p) => {
    if (!byEmp[p.employeeName]) byEmp[p.employeeName] = [];
    byEmp[p.employeeName].push(p);
  });

  const statuses: ("approved" | "pending" | "rejected")[] = [
    "approved",
    "approved",
    "pending",
    "approved",
    "pending",
    "rejected",
  ];
  const approvers = ["Admin", "Admin", null, "Admin", null, null];

  return Object.entries(byEmp).map(([name, records], i) => {
    const byDate = groupByDate(records);
    let totalHours = 0;
    let otHours = 0;

    Object.values(byDate).forEach((dayRecs) => {
      const pairs = computePairs(dayRecs);
      const dayH = pairs.reduce((s, p) => s + (p.hours ?? 0), 0);
      totalHours += dayH;
      if (dayH > 8) otHours += dayH - 8;
    });

    return {
      name,
      department: records[0].department,
      totalHours: parseFloat(totalHours.toFixed(2)),
      regularHours: parseFloat((totalHours - otHours).toFixed(2)),
      overtimeHours: parseFloat(otHours.toFixed(2)),
      daysWorked: Object.keys(byDate).length,
      status: statuses[i % statuses.length],
      approvedBy: approvers[i % approvers.length],
    };
  });
}

const STATUS_CONFIG = {
  approved: {
    label: "Approved",
    icon: <CheckCircle2 size={13} />,
    bg: "rgba(16,185,129,0.12)",
    color: "#34d399",
  },
  pending: {
    label: "Pending",
    icon: <Clock size={13} />,
    bg: "rgba(245,158,11,0.12)",
    color: "#fbbf24",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle size={13} />,
    bg: "rgba(239,68,68,0.12)",
    color: "#f87171",
  },
};

export default function AuthorizationReport() {
  const { isDark } = useThemeStore();
  const cardBg = isDark ? "var(--bg-card)" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  const authData = buildAuthData();
  const approved = authData.filter((a) => a.status === "approved").length;
  const pending = authData.filter((a) => a.status === "pending").length;
  const rejected = authData.filter((a) => a.status === "rejected").length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Approved", value: approved, color: "#10b981" },
          { label: "Pending", value: pending, color: "#f59e0b" },
          { label: "Rejected", value: rejected, color: "#ef4444" },
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

      {/* Authorization table */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={clsx("text-sm font-semibold", isDark ? "text-white" : "text-gray-900")}
          >
            Timesheet Authorization
          </h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors">
            <Download size={13} /> Export PDF
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={clsx("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                <th className="text-left pb-3 font-medium">Employee</th>
                <th className="text-left pb-3 font-medium">Department</th>
                <th className="text-right pb-3 font-medium">Days</th>
                <th className="text-right pb-3 font-medium">Regular</th>
                <th className="text-right pb-3 font-medium">OT</th>
                <th className="text-right pb-3 font-medium">Total</th>
                <th className="text-center pb-3 font-medium">Status</th>
                <th className="text-left pb-3 font-medium">Approved By</th>
              </tr>
            </thead>
            <tbody>
              {authData.map((row) => {
                const cfg = STATUS_CONFIG[row.status];
                return (
                  <tr
                    key={row.name}
                    className={clsx("border-t", isDark ? "border-white/5" : "border-gray-100")}
                  >
                    <td
                      className={clsx(
                        "py-3 font-medium",
                        isDark ? "text-gray-200" : "text-gray-700"
                      )}
                    >
                      {row.name}
                    </td>
                    <td className="py-3 text-gray-500 text-xs">{row.department}</td>
                    <td
                      className={clsx(
                        "py-3 text-right",
                        isDark ? "text-gray-300" : "text-gray-600"
                      )}
                    >
                      {row.daysWorked}
                    </td>
                    <td
                      className={clsx(
                        "py-3 text-right",
                        isDark ? "text-gray-300" : "text-gray-600"
                      )}
                    >
                      {row.regularHours.toFixed(2)}h
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={
                          row.overtimeHours > 0
                            ? "text-amber-400 font-medium"
                            : "text-gray-500"
                        }
                      >
                        {row.overtimeHours.toFixed(2)}h
                      </span>
                    </td>
                    <td
                      className={clsx(
                        "py-3 text-right font-semibold",
                        isDark ? "text-white" : "text-gray-900"
                      )}
                    >
                      {row.totalHours.toFixed(2)}h
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        {cfg.icon} {cfg.label}
                      </span>
                    </td>
                    <td
                      className={clsx(
                        "py-3 text-sm",
                        isDark ? "text-gray-400" : "text-gray-500"
                      )}
                    >
                      {row.approvedBy ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signature section */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
      >
        <h3
          className={clsx("text-sm font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}
        >
          Signatures
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {["Manager Signature", "Payroll Approval"].map((label) => (
            <div key={label}>
              <p className={clsx("text-xs mb-2", isDark ? "text-gray-500" : "text-gray-400")}>
                {label}
              </p>
              <div
                className="h-16 rounded-xl flex items-end justify-center pb-2"
                style={{
                  border: `1px dashed ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
                }}
              >
                <span className="text-xs text-gray-500">Sign here</span>
              </div>
              <div
                className="mt-2 flex items-center justify-between text-xs text-gray-500"
                style={{ borderTop: `1px solid ${border}`, paddingTop: 8 }}
              >
                <span>Name: _______________</span>
                <span>Date: _______________</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
