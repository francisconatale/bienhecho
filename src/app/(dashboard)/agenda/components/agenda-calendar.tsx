import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarMonth, CalendarStrip } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { MONTHS } from "../hooks/use-agenda";

interface AgendaCalendarProps {
  year: number;
  month: number;
  selectedDay: number | null;
  onSelectDay: (day: number | null) => void;
  onSelectDate: (y: number, m: number, d: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToday: () => void;
  visitCountForDay: (day: number) => number;
  visitCountForDate: (y: number, m: number, d: number) => number;
}

export function AgendaCalendar({
  year,
  month,
  selectedDay,
  onSelectDay,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onGoToday,
  visitCountForDay,
  visitCountForDate,
}: AgendaCalendarProps) {
  return (
    <div className="bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
      {/* Month nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.04] dark:border-white/[0.04]">
        <button
          onClick={onGoToday}
          aria-label="Ir a la fecha de hoy"
          className="text-xs font-bold text-primary hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg"
        >
          Hoy
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevMonth}
            aria-label="Mes anterior"
            className="w-8 h-8 rounded-xl hover:bg-outline-variant/10 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg"
          >
            <ChevronLeft className="w-4 h-4 text-on-surface-variant" />
          </button>
          <span className="text-sm font-extrabold text-on-surface min-w-[140px] text-center" aria-live="polite">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={onNextMonth}
            aria-label="Mes siguiente"
            className="w-8 h-8 rounded-xl hover:bg-outline-variant/10 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg"
          >
            <ChevronRight className="w-4 h-4 text-on-surface-variant" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Desktop View */}
        <div className="hidden md:block">
          <CalendarMonth
            year={year}
            month={month}
            selectedDay={selectedDay}
            onSelectDay={onSelectDay}
            dayBadge={(day, isSelected) => {
              const count = visitCountForDay(day);
              if (count === 0) return null;
              return (
                <div className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white" : "bg-primary")} />
              );
            }}
          />
        </div>
        {/* Mobile View */}
        <div className="md:hidden">
          <CalendarStrip
            year={year}
            month={month}
            selectedDay={selectedDay}
            onSelectDay={onSelectDate}
            dayBadge={(day, isSelected, y, m) => {
              const count = y !== undefined && m !== undefined 
                ? visitCountForDate(y, m, day) 
                : visitCountForDay(day);
              if (count === 0) return null;
              return (
                <div className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white" : "bg-primary")} />
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
