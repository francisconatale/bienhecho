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
    <div className="bg-surface rounded-[32px] p-6 border border-outline-variant/10 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
          Progreso
        </h3>
        <span className="text-xs font-black text-on-surface">
          {completed}/{total}
        </span>
      </div>

      <div className="w-full h-3 bg-on-surface/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs font-bold text-on-surface-variant/50">
        {total === 0
          ? "Sin tareas aún"
          : `${percentage}% completado`}
      </p>
    </div>
  );
}
