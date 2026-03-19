import { LogIn, LogOut, AlertTriangle } from "lucide-react";
import clsx from "clsx";
import type { Punch } from "@/types";

interface DayTimelineProps {
  dayRecords: Punch[];
  activeDate: string;
  isDark: boolean;
  cardBg: string;
  border: string;
}

export default function DayTimeline({
  dayRecords,
  activeDate,
  isDark,
  cardBg,
  border,
}: DayTimelineProps) {
  return (
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
        Day Timeline — {activeDate}
      </h3>
      <div className="relative pl-5">
        {dayRecords.length === 0 && (
          <p className="text-sm text-gray-500">No events for this day.</p>
        )}
        {dayRecords.map((r, i) => {
          const isIn = r.type === "IN";
          return (
            <div
              key={r.id}
              className="flex items-start gap-4 mb-4 last:mb-0 relative"
            >
              {i < dayRecords.length - 1 && (
                <div
                  className="absolute left-[-13px] top-5 bottom-[-16px] w-px"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.08)",
                  }}
                />
              )}
              <div
                className="absolute left-[-18px] top-1 w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: isIn ? "#10b981" : "#6366f1",
                  boxShadow: `0 0 0 3px ${isIn ? "rgba(16,185,129,0.2)" : "rgba(99,102,241,0.2)"}`,
                }}
              />
              <div className="flex items-center gap-3 flex-1">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                  style={
                    isIn
                      ? {
                          backgroundColor: "rgba(16,185,129,0.12)",
                          color: "#34d399",
                        }
                      : {
                          backgroundColor: "rgba(99,102,241,0.12)",
                          color: "#818cf8",
                        }
                  }
                >
                  {isIn ? <LogIn size={10} /> : <LogOut size={10} />}
                  {isIn ? "Clock In" : "Clock Out"}
                </span>
                <span
                  className={clsx(
                    "text-sm font-medium",
                    isDark ? "text-gray-200" : "text-gray-700",
                  )}
                >
                  {r.time}
                </span>
                <span className="text-xs text-gray-500">{r.source}</span>
                {r.isCorrected && (
                  <span className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 px-1.5 py-0.5 rounded-full">
                    <AlertTriangle size={9} /> Corrected
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
