import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { DatePickerInput } from "@mantine/dates";
import clsx from "clsx";
import { useThemeStore } from "@/app/store/themeStore";
import { MOCK_PUNCHES } from "@/services/api/punches";
import {
  tsToMinutes,
  minutesToLabel,
  groupByDate,
  computePairs,
} from "@/utils/punch";
import DayTimeline from "./DayTimeline";
import DailyMetrics from "./DailyMetrics";
import PunchCharts from "./PunchCharts";

export default function PunchDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark } = useThemeStore();

  const record = MOCK_PUNCHES.find((p) => p.id === id);

  const textColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  const cardBg = isDark ? "var(--bg-card)" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  const empRecords = useMemo(
    () =>
      record
        ? MOCK_PUNCHES.filter((p) => p.employeeId === record.employeeId)
        : [],
    [record],
  );

  const byDate = useMemo(() => groupByDate(empRecords), [empRecords]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const activeDate = useMemo(() => {
    if (selectedDate) {
      const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const dd = String(selectedDate.getDate()).padStart(2, "0");
      const yyyy = selectedDate.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    }
    return record?.date ?? "";
  }, [selectedDate, record]);

  const dayRecords = useMemo(
    () =>
      activeDate
        ? [...(byDate[activeDate] ?? [])].sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          )
        : [],
    [byDate, activeDate],
  );

  const dayPairs = useMemo(() => computePairs(dayRecords), [dayRecords]);

  const arrival = dayRecords.find((r) => r.type === "IN")?.time ?? "—";
  const leaving =
    [...dayRecords].reverse().find((r) => r.type === "OUT")?.time ?? "—";
  const totalHoursDay = dayPairs.reduce((s, p) => s + (p.hours ?? 0), 0);

  const dailyData = useMemo(() => {
    return Object.entries(byDate)
      .map(([date, recs]) => {
        const pairs = computePairs(recs);
        const hours = pairs.reduce((s, p) => s + (p.hours ?? 0), 0);
        const firstIn = recs
          .filter((r) => r.type === "IN")
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          )[0];
        const arrivalMin = firstIn ? tsToMinutes(firstIn.timestamp) : null;
        const shortDate = date.slice(0, 5);
        return {
          date: shortDate,
          hours: parseFloat(hours.toFixed(2)),
          arrivalMin,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [byDate]);

  const avgArrival = useMemo(() => {
    const vals = dailyData
      .map((d) => d.arrivalMin)
      .filter((v): v is number => v !== null);
    if (!vals.length) return "—";
    return minutesToLabel(
      Math.round(vals.reduce((s, v) => s + v, 0) / vals.length),
    );
  }, [dailyData]);

  const avgHours = useMemo(() => {
    const vals = dailyData.map((d) => d.hours).filter((v) => v > 0);
    if (!vals.length) return "—";
    return (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2) + "h";
  }, [dailyData]);

  const inCount = empRecords.filter((r) => r.type === "IN").length;
  const outCount = empRecords.filter((r) => r.type === "OUT").length;
  const correctedCount = empRecords.filter((r) => r.isCorrected).length;

  const pieInOut = [
    { name: "Clock In", value: inCount, color: "#10b981" },
    { name: "Clock Out", value: outCount, color: "#6366f1" },
  ];
  const pieCorrected = [
    {
      name: "Normal",
      value: empRecords.length - correctedCount,
      color: "#6366f1",
    },
    { name: "Corrected", value: correctedCount, color: "#f59e0b" },
  ];

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-500">Record not found.</p>
        <button
          onClick={() => navigate("/punches")}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Back to Clock Records
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/punches")}
          className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white flex-shrink-0"
          style={{ border: `1px solid ${border}` }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1
            className={clsx(
              "text-2xl font-bold",
              isDark ? "text-white" : "text-gray-900",
            )}
          >
            {record.employeeName}
          </h1>
          <p className="text-sm text-gray-500">{record.department}</p>
        </div>
      </div>

      {/* Date selector */}
      <DatePickerInput
        value={selectedDate ?? new Date(record.date)}
        onChange={(v) => setSelectedDate(v ? new Date(v) : null)}
        leftSection={<Calendar size={14} className="text-gray-400" />}
        size="sm"
        w={200}
        valueFormat="MM/DD/YYYY"
        maxDate={new Date()}
        popoverProps={{
          styles: {
            dropdown: {
              backgroundColor: isDark ? "#252836" : "#ffffff",
              border: `1px solid ${border}`,
              borderRadius: "0.75rem",
            },
          },
        }}
        styles={{
          input: {
            backgroundColor: cardBg,
            border: `1px solid ${border}`,
            borderRadius: "0.75rem",
            color: isDark ? "#fff" : "#111827",
            cursor: "pointer",
          },
        }}
      />

      <DailyMetrics
        arrival={arrival}
        leaving={leaving}
        totalHours={totalHoursDay}
        avgHours={avgHours}
        avgArrival={avgArrival}
        daysTracked={Object.keys(byDate).length}
        correctedCount={correctedCount}
        isDark={isDark}
        cardBg={cardBg}
        border={border}
      />

      <DayTimeline
        dayRecords={dayRecords}
        activeDate={activeDate}
        isDark={isDark}
        cardBg={cardBg}
        border={border}
      />

      <PunchCharts
        dailyData={dailyData}
        pieInOut={pieInOut}
        pieCorrected={pieCorrected}
        isDark={isDark}
        textColor={textColor}
        gridColor={gridColor}
        cardBg={cardBg}
        border={border}
      />
    </div>
  );
}
