import { Star } from 'lucide-react';
import type { Employee } from '../types';
import Avatar from './Avatar';

interface PodiumProps {
  top3: Array<{ employee: Employee; rank: 1 | 2 | 3 }>;
}

const RANK_CONFIG = {
  1: {
    avatarSize: 112,
    avatarBackgroundColor: '#86efac',
    avatarBorder: '4px solid #fbbf24',
    avatarTextColor: '#166534',
    badgeColor: '#eab308',
    badgeTextColor: '#fff',
    badgeSize: 40,
    badgeFontSize: 18,
    nameFontSize: 24,
    platformStyle: {
      background: 'linear-gradient(180deg, #fef3c7, #fde68a)',
      borderTop: '2px solid #fde047',
      height: '160px',
    },
    blockTopColor: '#fde047',
    platformText: '1',
    rankNumberStyle: { color: 'rgba(234, 179, 8, 0.2)', fontSize: '112px' },
    scoreStyle: {
      background: '#fef9c3',
      borderColor: '#fde047',
      color: '#ca8a04',
      fontSize: '20px',
      padding: '8px 20px',
    },
    zIndex: 'z-10',
  },
  2: {
    avatarSize: 80,
    avatarBackgroundColor: '#cbd5e1',
    avatarBorder: '4px solid #fff',
    avatarTextColor: '#1e293b',
    badgeColor: '#94a3b8',
    badgeTextColor: '#fff',
    badgeSize: 32,
    badgeFontSize: 14,
    nameFontSize: 20,
    platformStyle: {
      background: 'linear-gradient(180deg, #e2e8f0, #cbd5e1)',
      borderTop: '2px solid #cbd5e1',
      height: '128px',
    },
    blockTopColor: '#cbd5e1',
    platformText: '2',
    rankNumberStyle: {},
    scoreStyle: {
      color: '#0ea5e9',
    },
    zIndex: 'z-0',
  },
  3: {
    avatarSize: 80,
    avatarBackgroundColor: '#5eead4',
    avatarBorder: '4px solid #fff',
    avatarTextColor: '#134e4a',
    badgeColor: '#92400e',
    badgeTextColor: '#fff',
    badgeSize: 32,
    badgeFontSize: 14,
    nameFontSize: 20,
    platformStyle: {
      background: 'linear-gradient(180deg, #e2e8f0, #cbd5e1)',
      borderTop: '2px solid #cbd5e1',
      height: '96px',
    },
    blockTopColor: '#cbd5e1',
    platformText: '3',
    rankNumberStyle: { top: '-16px' },
    scoreStyle: {
      color: '#0ea5e9',
    },
    zIndex: 'z-0',
  },
};

interface PodiumCardProps {
  employee: Employee;
  rank: 1 | 2 | 3;
}

function PodiumCard({ employee, rank }: PodiumCardProps) {
  const cfg = RANK_CONFIG[rank];

  return (
    <div className={`flex flex-col items-center w-full ${cfg.zIndex}`}>
      {/* User info */}
      <div className="flex flex-col items-center">
        {/* Avatar with ring and badge */}
        <div style={{ marginBottom: '12px', position: 'relative' }}>
          <Avatar
            name={employee.name}
            size={cfg.avatarSize}
            backgroundImage={employee.avatarUrl}
            backgroundColor={cfg.avatarBackgroundColor}
            border={cfg.avatarBorder}
            textColor={cfg.avatarTextColor}
          />
          {/* Rank badge */}
          <span
            style={{
              alignItems: 'center',
              background: cfg.badgeColor,
              boxSizing: 'content-box',
              border: '4px solid #fff',
              borderRadius: '50%',
              bottom: '-8px',
              color: cfg.badgeTextColor,
              display: 'flex',
              fontSize: `${cfg.badgeFontSize}px`,
              fontWeight: 700,
              height: `${cfg.badgeSize}px`,
              justifyContent: 'center',
              position: 'absolute',
              right: '-4px',
              width: `${cfg.badgeSize}px`,
            }}
          >
            {rank}
          </span>
        </div>

        {/* Name chip */}
        <span
          style={{
            color: '#0f172a',
            fontSize: `${cfg.nameFontSize}px`,
            fontWeight: 700,
            lineHeight: 'normal',
            margin: '0 0 4px',
            textAlign: 'center',
          }}
        >
          {employee.name}
        </span>

        {/* Position (department) chip */}
        <span
          style={{
            color: '#64748b',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: 'normal',
            margin: '0 0 8px',
          }}
        >
          {employee.position} ({employee.department})
        </span>

        {/* Score */}
        <div
          style={{
            alignItems: 'center',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            fontSize: '18px',
            fontWeight: 700,
            gap: '6px',
            marginBottom: '12px',
            padding: '6px 16px',
            ...cfg.scoreStyle,
          }}
        >
          <Star size={16} style={{ color: 'currentColor', fill: 'currentColor' }} />
          <span style={{ lineHeight: 'normal' }}>{employee.score}</span>
        </div>
      </div>

      {/* Platform block */}
      <div
        className="w-full"
        style={{
          ...cfg.platformStyle,
          boxSizing: 'content-box',
          borderRadius: '12px 12px 0 0',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          overflow: 'hidden',
          paddingTop: '16px',
          position: 'relative',
        }}
      >
        {/* Top accent bar */}
        <div style={{
          background: cfg.blockTopColor,
          height: '2px',
          inset: '0 0 auto 0',
          position: 'absolute',
        }} />
        <span
          style={{
            color: 'rgba(148, 163, 184, 0.2)',
            fontSize: '96px',
            fontWeight: 900,
            lineHeight: 'normal',
            position: 'relative',
            userSelect: 'none',
            ...cfg.rankNumberStyle,
          }}
        >{cfg.platformText}</span>
      </div>
    </div>
  );
}

export default function Podium({ top3 }: PodiumProps) {
  if (top3.length === 0) {
    return (
      <div className="py-16 text-center text-[#64748b] text-sm">
        No results match the selected filters.
      </div>
    );
  }

  const first = top3.find((item) => item.rank === 1)?.employee;
  const second = top3.find((item) => item.rank === 2)?.employee;
  const third = top3.find((item) => item.rank === 3)?.employee;
  const visibleCount = [first, second, third].filter(Boolean).length;

  return (
    <div className="mx-auto mb-8 flex max-w-[900px] flex-col items-center justify-center gap-6 px-2 py-8 md:mb-16 md:flex-row md:items-end">
      {/* 2nd place */}
      {second ? (
        <div className="relative order-2 flex w-full max-w-[280px] flex-col items-center md:order-1">
          <PodiumCard employee={second} rank={2} />
        </div>
      ) : null}

      {/* 1st place */}
      {first ? (
        <div
          className={`relative order-1 mt-0 flex w-full max-w-[280px] flex-col items-center md:order-2 ${
            visibleCount > 1 ? "md:-mt-8" : ""
          }`}
        >
          <PodiumCard employee={first} rank={1} />
        </div>
      ) : null}

      {/* 3rd place */}
      {third ? (
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', maxWidth: '280px', position: 'relative', width: '100%', order: 3 }}>
          <PodiumCard employee={third} rank={3} />
        </div>
      ) : null}
    </div>
  );
}
