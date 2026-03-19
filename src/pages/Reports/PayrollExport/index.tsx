import { useState } from "react";
import clsx from "clsx";
import { Download, DollarSign, FileText } from "lucide-react";
import { useThemeStore } from "@/app/store/themeStore";
import { MOCK_PUNCHES } from "@/services/api/punches";
import { computePairs, groupByDate } from "@/utils/punch";
import { notifications } from "@mantine/notifications";

interface PayrollRow {
  employeeId: string;
  employeeName: string;
  department: string;
  regularHours: number;
  overtimeHours: number;
  regularRate: number;
  otRate: number;
  regularPay: number;
  overtimePay: number;
  grossPay: number;
}

const RATES: Record<string, number> = {
  "Mechanical Floor": 22.5,
  Office: 28.0,
  Parts: 20.0,
  Management: 35.0,
};

function buildPayroll(): PayrollRow[] {
  const byEmp: Record<string, typeof MOCK_PUNCHES> = {};
  MOCK_PUNCHES.forEach((p) => {
    if (!byEmp[p.employeeId]) byEmp[p.employeeId] = [];
    byEmp[p.employeeId].push(p);
  });

  return Object.entries(byEmp).map(([empId, records]) => {
    const byDate = groupByDate(records);
    let totalHours = 0;
    let otHours = 0;

    Object.values(byDate).forEach((dayRecs) => {
      const pairs = computePairs(dayRecs);
      const dayH = pairs.reduce((s, p) => s + (p.hours ?? 0), 0);
      totalHours += dayH;
      if (dayH > 8) otHours += dayH - 8;
    });

    const dept = records[0].department;
    const rate = RATES[dept] ?? 20;
    const regular = totalHours - otHours;
    const regularPay = regular * rate;
    const otPay = otHours * rate * 1.5;

    return {
      employeeId: empId,
      employeeName: records[0].employeeName,
      department: dept,
      regularHours: parseFloat(regular.toFixed(2)),
      overtimeHours: parseFloat(otHours.toFixed(2)),
      regularRate: rate,
      otRate: parseFloat((rate * 1.5).toFixed(2)),
      regularPay: parseFloat(regularPay.toFixed(2)),
      overtimePay: parseFloat(otPay.toFixed(2)),
      grossPay: parseFloat((regularPay + otPay).toFixed(2)),
    };
  });
}

export default function PayrollExport() {
  const { isDark } = useThemeStore();
  const [exportFormat, setExportFormat] = useState<"csv" | "adp" | "quickbooks">("csv");
  const cardBg = isDark ? "var(--bg-card)" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  const payroll = buildPayroll();
  const totalRegPay = payroll.reduce((s, r) => s + r.regularPay, 0);
  const totalOTPay = payroll.reduce((s, r) => s + r.overtimePay, 0);
  const totalGross = payroll.reduce((s, r) => s + r.grossPay, 0);

  const handleExport = () => {
    notifications.show({
      title: "Payroll Exported",
      message: `Payroll data exported as ${exportFormat.toUpperCase()}.`,
      color: "green",
    });
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Regular Pay", value: `$${totalRegPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color: "#6366f1" },
          { label: "Overtime Pay", value: `$${totalOTPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color: "#f59e0b" },
          { label: "Gross Pay", value: `$${totalGross.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color: "#10b981" },
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

      {/* Export options */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
      >
        <h3 className={clsx("text-sm font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>
          Export Options
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          {([
            { value: "csv", label: "Custom CSV", icon: <FileText size={14} /> },
            { value: "adp", label: "ADP Format", icon: <DollarSign size={14} /> },
            { value: "quickbooks", label: "QuickBooks", icon: <DollarSign size={14} /> },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setExportFormat(opt.value)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                exportFormat === opt.value
                  ? "bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/30"
                  : isDark
                  ? "bg-white/5 text-gray-400 hover:bg-white/10"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
          <button
            onClick={handleExport}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
          >
            <Download size={14} />
            Export {exportFormat.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Payroll table */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
      >
        <h3 className={clsx("text-sm font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>
          Payroll Data
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={clsx("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                <th className="text-left pb-3 font-medium">Employee</th>
                <th className="text-left pb-3 font-medium">Dept</th>
                <th className="text-right pb-3 font-medium">Reg Hrs</th>
                <th className="text-right pb-3 font-medium">OT Hrs</th>
                <th className="text-right pb-3 font-medium">Rate</th>
                <th className="text-right pb-3 font-medium">OT Rate</th>
                <th className="text-right pb-3 font-medium">Reg Pay</th>
                <th className="text-right pb-3 font-medium">OT Pay</th>
                <th className="text-right pb-3 font-medium">Gross</th>
              </tr>
            </thead>
            <tbody>
              {payroll.map((row) => (
                <tr
                  key={row.employeeId}
                  className={clsx("border-t", isDark ? "border-white/5" : "border-gray-100")}
                >
                  <td className={clsx("py-2.5 font-medium", isDark ? "text-gray-200" : "text-gray-700")}>
                    {row.employeeName}
                  </td>
                  <td className="py-2.5 text-gray-500 text-xs">{row.department}</td>
                  <td className={clsx("py-2.5 text-right", isDark ? "text-gray-300" : "text-gray-600")}>
                    {row.regularHours.toFixed(2)}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={row.overtimeHours > 0 ? "text-amber-400 font-medium" : "text-gray-500"}>
                      {row.overtimeHours.toFixed(2)}
                    </span>
                  </td>
                  <td className={clsx("py-2.5 text-right", isDark ? "text-gray-300" : "text-gray-600")}>
                    ${row.regularRate.toFixed(2)}
                  </td>
                  <td className={clsx("py-2.5 text-right", isDark ? "text-gray-300" : "text-gray-600")}>
                    ${row.otRate.toFixed(2)}
                  </td>
                  <td className={clsx("py-2.5 text-right", isDark ? "text-gray-200" : "text-gray-700")}>
                    ${row.regularPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={row.overtimePay > 0 ? "text-amber-400 font-medium" : "text-gray-500"}>
                      ${row.overtimePay.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className={clsx("py-2.5 text-right font-semibold", isDark ? "text-white" : "text-gray-900")}>
                    ${row.grossPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={clsx("border-t-2", isDark ? "border-white/10" : "border-gray-200")}>
                <td colSpan={6} className={clsx("py-3 font-semibold", isDark ? "text-gray-300" : "text-gray-700")}>
                  Grand Total
                </td>
                <td className={clsx("py-3 text-right font-bold", isDark ? "text-white" : "text-gray-900")}>
                  ${totalRegPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 text-right font-bold text-amber-400">
                  ${totalOTPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 text-right font-bold text-emerald-400">
                  ${totalGross.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
