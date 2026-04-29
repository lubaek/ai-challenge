import { useState, useMemo } from "react";
import { Info } from "lucide-react";
import type { FilterState, Employee } from "./types";
import { employees } from "./data/employees";
import Filters from "./components/Filters";
import Podium from "./components/Podium";
import LeaderboardList from "./components/LeaderboardList";

const DEFAULT_FILTERS: FilterState = {
  year: "All Years",
  quarter: "All Quarters",
  category: "All Categories",
  search: "",
};
const MIN_SEARCH_LENGTH = 2;

function filterEmployees(list: Employee[], filters: FilterState): Employee[] {
  return list.filter((emp) => {
    if (filters.year !== "All Years") {
      const y = parseInt(filters.year, 10);
      if (!emp.years.includes(y)) return false;
    }
    if (filters.quarter !== "All Quarters") {
      const quarterMatch = filters.quarter.match(/\d+/);
      const q = quarterMatch ? parseInt(quarterMatch[0], 10) : NaN;
      if (Number.isNaN(q) || !emp.quarters.includes(q)) return false;
    }
    if (filters.category !== "All Categories") {
      if (!emp.categories.includes(filters.category)) return false;
    }
    const searchQuery = filters.search.trim();
    if (searchQuery.length >= MIN_SEARCH_LENGTH) {
      const q = searchQuery.toLowerCase();
      if (
        !emp.name.toLowerCase().includes(q) &&
        !emp.position.toLowerCase().includes(q) &&
        !emp.department.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });
}

export default function App() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const filtersWithoutSearch = useMemo(
    () => ({ ...filters, search: "" }),
    [filters],
  );

  const sortedWithoutSearch = useMemo(() => {
    const filtered = filterEmployees(employees, filtersWithoutSearch);
    return [...filtered].sort((a, b) => b.score - a.score);
  }, [filtersWithoutSearch]);

  const sorted = useMemo(() => {
    const filtered = filterEmployees(employees, filters);
    return [...filtered].sort((a, b) => b.score - a.score);
  }, [filters]);

  const rankByEmployeeId = useMemo(
    () =>
      sortedWithoutSearch.reduce<Record<number, number>>((acc, employee, index) => {
        acc[employee.id] = index + 1;
        return acc;
      }, {}),
    [sortedWithoutSearch],
  );

  const top3WithRanks = useMemo(
    () =>
      sortedWithoutSearch.slice(0, 3).map((employee, index) => ({
        employee,
        rank: (index + 1) as 1 | 2 | 3,
      })),
    [sortedWithoutSearch],
  );
  const hasSearch = filters.search.trim().length >= MIN_SEARCH_LENGTH;
  const visibleEmployeeIds = useMemo(
    () => new Set(sorted.map((employee) => employee.id)),
    [sorted],
  );
  const podiumWinners = hasSearch
    ? top3WithRanks.filter(({ employee }) => visibleEmployeeIds.has(employee.id))
    : top3WithRanks;
  const shouldShowPodium = podiumWinners.length > 0;

  return (
    <div className="min-h-screen bg-[#ebebed] py-10 px-4">
      <div className="w-full max-w-[1204px] mx-auto bg-[#f8fafc] shadow-sm overflow-hidden p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0f172a]">Leaderboard</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Top performers based on contributions and activity
          </p>
        </div>

        {/* Filters */}
        <Filters filters={filters} onChange={setFilters} />

        {sorted.length === 0 ? (
          <div className="mb-8 flex items-center gap-3 border border-[#e5e7eb] bg-[rgb(235,235,237)] px-0 py-0 text-[#3f3f46]">
            <Info size={18} className="ml-2" />
            <div
              className="m-[8px_12px_8px_8px] flex min-w-0 flex-grow text-xs font-normal"
              style={{
                WebkitFontSmoothing: "antialiased",
                fontFamily:
                  '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
              }}
            >
              <span style={{ lineHeight: "16px" }}>
                No activities found matching the current filters.
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Podium */}
            {shouldShowPodium ? <Podium top3={podiumWinners} /> : null}

            {/* Ranked list (includes winners) */}
          <div className="pb-8">
            <LeaderboardList
              employees={sorted}
              startRank={1}
              rankByEmployeeId={rankByEmployeeId}
            />
          </div>
          </>
        )}
      </div>
    </div>
  );
}
