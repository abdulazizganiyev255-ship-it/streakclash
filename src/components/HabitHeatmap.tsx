import React from 'react';
import { getLastNDays, getTodayDateStr } from '../storage';

interface HabitHeatmapProps {
  completedDates: string[];
  color: string;
  daysCount?: number;
  onToggleDate?: (dateStr: string) => void;
  interactive?: boolean;
}

export const HabitHeatmap: React.FC<HabitHeatmapProps> = ({
  completedDates,
  color,
  daysCount = 77, // 11 weeks of 7 days
  onToggleDate,
  interactive = false,
}) => {
  const dates = getLastNDays(daysCount);
  const today = getTodayDateStr();

  // Group into columns of 7 days (weeks)
  const weeks: string[][] = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  return (
    <div className="w-full overflow-x-auto py-1.5 scrollbar-none">
      <div className="flex gap-[5px] min-w-max items-center">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-[5px]">
            {week.map((dateStr) => {
              const isCompleted = completedDates.includes(dateStr);
              const isToday = dateStr === today;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => interactive && onToggleDate && onToggleDate(dateStr)}
                  disabled={!interactive}
                  title={`${dateStr}: ${isCompleted ? '✓ Bajarilgan' : '— Bajarilmagan'}${
                    interactive ? ' (Bosib o\'zgartiring)' : ''
                  }`}
                  style={{
                    backgroundColor: isCompleted ? color : '#13151f',
                    boxShadow: isCompleted ? `0 0 10px ${color}99, inset 0 1px 0 rgba(255,255,255,0.25)` : 'none',
                    borderColor: isToday ? '#ffffff' : isCompleted ? `${color}44` : 'rgba(255,255,255,0.03)',
                  }}
                  className={`w-[13px] h-[13px] rounded-[3px] transition-all duration-200 border ${
                    interactive ? 'cursor-pointer hover:scale-135 hover:z-10' : 'cursor-default'
                  } ${isCompleted ? 'scale-100' : 'hover:bg-slate-700/80'}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
