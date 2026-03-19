import type { Punch } from "@/types";

export function tsToMinutes(ts: string): number {
  const d = new Date(ts);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

export function minutesToLabel(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  const ampm = h < 12 ? "AM" : "PM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(min).padStart(2, "0")} ${ampm}`;
}

export function groupByDate(records: Punch[]): Record<string, Punch[]> {
  return records.reduce<Record<string, Punch[]>>((acc, r) => {
    if (!acc[r.date]) acc[r.date] = [];
    acc[r.date].push(r);
    return acc;
  }, {});
}

export function computePairs(
  dayRecords: Punch[],
): { inTs: string; outTs: string | null; hours: number | null }[] {
  const sorted = [...dayRecords].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const pairs: { inTs: string; outTs: string | null; hours: number | null }[] =
    [];
  let i = 0;
  while (i < sorted.length) {
    if (sorted[i].type === "IN") {
      const inRec = sorted[i];
      const outRec = sorted[i + 1]?.type === "OUT" ? sorted[i + 1] : null;
      const hours = outRec
        ? (new Date(outRec.timestamp).getTime() -
            new Date(inRec.timestamp).getTime()) /
          3_600_000
        : null;
      pairs.push({
        inTs: inRec.timestamp,
        outTs: outRec?.timestamp ?? null,
        hours,
      });
      i += outRec ? 2 : 1;
    } else {
      i++;
    }
  }
  return pairs;
}
