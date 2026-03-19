import { LogIn, LogOut, Clock, TrendingUp, Calendar } from "lucide-react";
import clsx from "clsx";

interface DailyMetricsProps {
  arrival: string;
  leaving: string;
  totalHours: number;
  avgHours: string;
  avgArrival: string;
  daysTracked: number;
  correctedCount: number;
  isDark: boolean;
  cardBg: string;
  border: string;
}

const metrics = (props: DailyMetricsProps) => [
  {
    label: "Arrival",
    value: props.arrival,
    icon: <LogIn size={14} />,
    color: "#10b981",
  },
  {
    label: "Leaving",
    value: props.leaving,
    icon: <LogOut size={14} />,
    color: "#6366f1",
  },
  {
    label: "Hours Today",
    value: props.totalHours > 0 ? `${props.totalHours.toFixed(2)}h` : "—",
    icon: <Clock size={14} />,
    color: "#f59e0b",
  },
  {
    label: "Avg Hours/Day",
    value: props.avgHours,
    icon: <TrendingUp size={14} />,
    color: "#8b5cf6",
  },
];

export default function DailyMetrics(props: DailyMetricsProps) {
  const { isDark, cardBg, border, avgArrival, daysTracked, correctedCount } =
    props;

  return (
    <>
      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics(props).map((m) => (
          <div
            key={m.label}
            className="rounded-xl p-4"
            style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
          >
            <div
              className="flex items-center gap-2 mb-2"
              style={{ color: m.color }}
            >
              {m.icon}
              <span className="text-xs font-medium text-gray-500">
                {m.label}
              </span>
            </div>
            <div
              className={clsx(
                "text-xl font-bold",
                isDark ? "text-white" : "text-gray-900",
              )}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Averages row */}
      <div
        className="flex items-center gap-6 px-4 py-3 rounded-xl"
        style={{
          backgroundColor: isDark
            ? "rgba(99,102,241,0.08)"
            : "rgba(99,102,241,0.05)",
          border: `1px solid rgba(99,102,241,0.2)`,
        }}
      >
        <Calendar size={15} className="text-indigo-400 flex-shrink-0" />
        <div className="flex gap-6 flex-wrap text-sm">
          <span className="text-gray-500">
            Avg Arrival:{" "}
            <span className="text-indigo-300 font-medium">{avgArrival}</span>
          </span>
          <span className="text-gray-500">
            Days Tracked:{" "}
            <span className="text-indigo-300 font-medium">{daysTracked}</span>
          </span>
          <span className="text-gray-500">
            Corrected:{" "}
            <span className="text-yellow-400 font-medium">
              {correctedCount}
            </span>
          </span>
        </div>
      </div>
    </>
  );
}
