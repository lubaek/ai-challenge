import { useState } from 'react';
import type { Employee } from '../types';
import LeaderboardItem from './LeaderboardItem';

interface LeaderboardListProps {
  employees: Employee[];
  startRank?: number;
  rankByEmployeeId?: Record<number, number>;
}

export default function LeaderboardList({
  employees,
  startRank = 1,
  rankByEmployeeId,
}: LeaderboardListProps) {
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<number | null>(null);

  if (employees.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4">
      {employees.map((emp, idx) => (
        <LeaderboardItem
          key={emp.id}
          employee={emp}
          rank={rankByEmployeeId?.[emp.id] ?? startRank + idx}
          expanded={expandedEmployeeId === emp.id}
          onToggle={() =>
            setExpandedEmployeeId((current) => (current === emp.id ? null : emp.id))
          }
        />
      ))}
    </div>
  );
}
