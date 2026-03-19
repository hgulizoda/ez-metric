import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";
import { useThemeStore } from "@/app/store/themeStore";
import TimecardDetail from "../TimecardDetail";
import TotalsSummary from "../TotalsSummary";
import JobsReport from "../JobsReport";
import AuthorizationReport from "../AuthorizationReport";
import MissedPunches from "../MissedPunches";
import ExceptionsReport from "../ExceptionsReport";
import WhoIsInOut from "../WhoIsInOut";
import PayrollExport from "../PayrollExport";

const REPORT_COMPONENTS: Record<string, React.FC> = {
  timecard: TimecardDetail,
  "totals-summary": TotalsSummary,
  jobs: JobsReport,
  authorization: AuthorizationReport,
  "missed-punches": MissedPunches,
  exceptions: ExceptionsReport,
  "who-is-in": WhoIsInOut,
  payroll: PayrollExport,
};

const REPORT_TITLES: Record<string, string> = {
  timecard: "Timecard Detail",
  "totals-summary": "Totals Summary",
  jobs: "Jobs Report",
  authorization: "Authorization Report",
  "missed-punches": "Missed Punches",
  exceptions: "Exceptions Report",
  "who-is-in": "Who Is IN / Who Is OUT",
  payroll: "Payroll Export",
};

export default function ReportDetail() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { isDark } = useThemeStore();

  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const Component = reportId ? REPORT_COMPONENTS[reportId] : null;
  const title = reportId ? REPORT_TITLES[reportId] : "Report";

  if (!Component) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-500">Report not found.</p>
        <button
          onClick={() => navigate("/reports")}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Back to Reports
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/reports")}
          className={clsx(
            "p-2 rounded-xl transition-colors flex-shrink-0",
            isDark
              ? "hover:bg-white/10 text-gray-400 hover:text-white"
              : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
          )}
          style={{ border: `1px solid ${border}` }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1
            className={clsx(
              "text-2xl font-bold",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            {title}
          </h1>
          <p className="text-sm text-gray-500">Mar 14 – Mar 20, 2026</p>
        </div>
      </div>
      <Component />
    </div>
  );
}
