"use client";

import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

interface CalendarMonthProps {
  year: number;
  month: number;
  selectedDay?: number | null;
  onSelectDay?: (day: number) => void;
  dayBadge?: (day: number, isSelected: boolean) => React.ReactNode;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isToday(year: number, month: number, day: number) {
  const d = new Date();
  return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
}

export function CalendarMonth({ year, month, selectedDay, onSelectDay, dayBadge }: CalendarMonthProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  return (
    <div>
      <div className="grid grid-cols-7 gap-0 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-wider text-center h-8 flex items-center justify-center"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const selected = selectedDay === day;
          const today = isToday(year, month, day);

          return (
            <button
              key={day}
              onClick={() => onSelectDay?.(day)}
              className={cn(
                "aspect-square rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all text-[13px] font-semibold relative cursor-pointer",
                selected
                  ? "bg-primary text-white shadow-sm shadow-primary/20"
                  : today
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface hover:bg-outline-variant/10"
              )}
            >
              <span>{day}</span>
              {dayBadge?.(day, selected)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
