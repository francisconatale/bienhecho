"use client";

import { Task } from "@/types";

interface ProgressBarProps {
  tasks: Task[];
}

export function ProgressBar({ tasks }: ProgressBarProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completada).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="relative overflow-hidden bg-surface/80 rounded-[28px] p-6 border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-5 transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">

      <div className="relative flex flex-col gap-2 z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/50">
          Progreso
        </h3>
        <div className="flex items-end justify-between mt-1">
          <span className="text-sm font-semibold text-on-surface-variant/80">Completadas</span>
          <span className="text-2xl font-black text-on-surface tracking-tighter leading-none">
            {completed} <span className="text-base text-on-surface-variant/40 font-bold">/ {total}</span>
          </span>
        </div>
      </div>

      <div className="relative w-full h-4 bg-on-surface/5 dark:bg-black/20 rounded-full overflow-hidden shadow-inner z-10">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        >
           <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] translate-x-[-100%] skew-x-12 mix-blend-overlay" />
        </div>
      </div>

      <p className="relative text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-widest z-10 text-right">
        {total === 0
          ? "Sin tareas aún"
          : `${percentage}% completado`}
      </p>
    </div>
  );
}
