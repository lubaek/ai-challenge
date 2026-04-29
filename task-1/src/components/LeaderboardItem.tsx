import {
  Activity,
  ChevronUp,
  ChevronDown,
  HeartPulse,
  ScanEye,
  Sparkles,
  Swords,
  Star,
} from "lucide-react";
import { useMemo } from "react";
import type { Employee } from "../types";

interface LeaderboardItemProps {
  employee: Employee;
  rank: number;
  expanded: boolean;
  onToggle: () => void;
}

interface ActivityRow {
  activity: string;
  category: string;
  date: string;
  points: number;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function toMobileMultiline(text: string, maxLineLength = 14) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLineLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.join("\n");
}

export default function LeaderboardItem({
  employee,
  rank,
  expanded,
  onToggle,
}: LeaderboardItemProps) {
  const categoryIcons = useMemo(() => {
    return employee.categories.map((category, index) => {
      const normalized = category.toLowerCase();
      const baseCount = Math.floor(
        employee.presentations / employee.categories.length,
      );
      const remainder = employee.presentations % employee.categories.length;
      const count = baseCount + (index < remainder ? 1 : 0);

      if (normalized === "ninjutsu")
        return { name: category, Icon: Sparkles, count };
      if (normalized === "taijutsu")
        return { name: category, Icon: Swords, count };
      if (normalized === "genjutsu")
        return { name: category, Icon: ScanEye, count };
      if (normalized === "medical")
        return { name: category, Icon: HeartPulse, count };
      return { name: category, Icon: Activity, count };
    });
  }, [employee.categories, employee.presentations]);

  const recentActivity = useMemo<ActivityRow[]>(() => {
    const currentYear = Math.max(...employee.years);
    const currentQuarter = Math.max(...employee.quarters);
    const totalActivities = categoryIcons.reduce((sum, item) => sum + item.count, 0);
    const basePoints = totalActivities > 0 ? Math.floor(employee.score / totalActivities) : 0;
    let pointsRemainder = totalActivities > 0 ? employee.score % totalActivities : 0;
    let rowIndex = 0;

    return categoryIcons.flatMap(({ name, count }) =>
      Array.from({ length: count }, () => {
        const category = name;
        rowIndex += 1;
        const points = basePoints + (pointsRemainder > 0 ? 1 : 0);
        if (pointsRemainder > 0) {
          pointsRemainder -= 1;
        }
        const monthIndex = ((currentQuarter - 1) * 3 + rowIndex - 1) % 12;
        const day = Math.min(28, 6 + rowIndex * 2);
        const date = new Date(currentYear, monthIndex, day);

        return {
          activity: `${category} contribution by ${employee.name}`,
          category,
          date: formatDate(date),
          points,
        };
      }),
    );
  }, [categoryIcons, employee]);

  return (
    <div
      className={`overflow-visible rounded-xl border bg-white transition-all duration-200 ${
        expanded
          ? "border-[#0ea5e9] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
          : "border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_10px_rgba(15,23,42,0.09)]"
      }`}
      style={{ boxSizing: "content-box" }}
    >
      <div className="px-6 py-5 max-md:p-4">
        <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-6 max-md:w-full max-md:gap-4">
            <span className="min-w-8 shrink-0 text-center text-2xl font-bold text-[#94a3b8]">
              {rank}
            </span>
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#fbbf24] bg-cover bg-center text-[20px] font-bold text-white"
              style={{ backgroundImage: `url(${employee.avatarUrl})` }}
            >
              {!employee.avatarUrl ? getInitials(employee.name) : null}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p
                className="text-[18px] font-bold text-[#0f172a]"
                style={{ lineHeight: "normal", margin: 0 }}
              >
                {employee.name}
              </p>
              <p
                className="text-sm text-[#64748b]"
                style={{ lineHeight: "normal", margin: 0 }}
              >
                {employee.position} ({employee.department})
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-6 max-md:w-full max-md:justify-between max-md:border-t max-md:border-[#e2e8f0] max-md:pt-3">
            <div className="flex items-center gap-6 max-md:gap-4">
              {categoryIcons.map(({ name, Icon, count }) => (
                <div
                  key={name}
                  className="group relative flex flex-col items-center gap-1"
                >
                  <div className="pointer-events-none absolute -top-14 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-[rgb(235,235,237)] px-4 py-2 text-xs font-normal text-[#0f172a] opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-opacity duration-200 group-hover:opacity-100">
                    {name}
                    <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-[rgb(235,235,237)]" />
                  </div>
                  <Icon size={20} className="text-[#0ea5e9]" />
                  <span
                    className="text-xs font-semibold text-[#475569]"
                    style={{ lineHeight: "normal" }}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-end gap-1 border-l border-[#e2e8f0] pl-6 max-md:hidden">
              <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
                Total
              </span>
              <div className="flex items-center gap-1.5 text-2xl font-bold text-[#0ea5e9]">
                <Star size={28} className="text-[#0ea5e9] fill-[#0ea5e9]" />
                <span>{employee.score}</span>
              </div>
            </div>

            <button
              type="button"
              className={`flex items-center justify-center rounded-full border-none p-2 text-[#0ea5e9] transition-colors duration-200 ${
                expanded
                  ? "bg-[#e0f2fe]"
                  : "bg-[#f1f5f9] hover:bg-[#e2e8f0]"
              }`}
              style={{ fontFamily: "inherit" }}
              onClick={onToggle}
              aria-label="Expand details"
            >
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#e2e8f0] bg-[#f8fafc] p-6 max-md:p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.05em] text-[#64748b]">
            Recent activity
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse max-md:min-w-0">
              <thead>
                <tr className="border-b-2 border-[#e2e8f0] text-left">
                  <th className="px-2 py-3 text-xs font-semibold uppercase tracking-[0.05em] text-[#64748b]">
                    Activity
                  </th>
                  <th className="px-2 py-3 text-xs font-semibold uppercase tracking-[0.05em] text-[#64748b]">
                    Category
                  </th>
                  <th className="px-2 py-3 text-xs font-semibold uppercase tracking-[0.05em] text-[#64748b]">
                    Date
                  </th>
                  <th className="px-2 py-3 text-right text-xs font-semibold uppercase tracking-[0.05em] text-[#64748b]">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((row) => (
                  <tr
                    key={`${row.activity}-${row.date}`}
                    className="transition-colors duration-200"
                  >
                    <td className="border-b border-[#e2e8f0] px-2 py-4 text-sm font-medium text-[#0f172a]">
                      <span className="hidden md:inline">{row.activity}</span>
                      <span className="whitespace-pre-line md:hidden">
                        {toMobileMultiline(row.activity)}
                      </span>
                    </td>
                    <td className="border-b border-[#e2e8f0] px-2 py-4">
                      <span className="inline-flex items-center rounded-xl bg-[#e2e8f0] px-3 py-1 text-xs font-semibold text-[#475569]">
                        {row.category}
                      </span>
                    </td>
                    <td className="border-b border-[#e2e8f0] px-2 py-4 text-sm text-[#64748b]">
                      {row.date}
                    </td>
                    <td className="border-b border-[#e2e8f0] px-2 py-4 text-right text-sm font-bold text-[#0ea5e9]">
                      +{row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
