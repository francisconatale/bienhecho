import { cn } from "@/lib/utils";
import type { FilterType } from "../hooks/use-tareas";
import { LayoutList, LayoutGrid } from "lucide-react";

interface TareasFilterProps {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  pendingCount: number;
  completedCount: number;
}

export function TareasFilter({
  filter,
  setFilter,
  pendingCount,
  completedCount,
}: TareasFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("pendientes")}
          aria-pressed={filter === "pendientes"}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-[background-color,box-shadow,color,border-color] duration-[180ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            filter === "pendientes"
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-surface border border-outline-variant/30 text-on-surface-variant hover:border-primary/30"
          )}
        >
          Pendientes
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20">
            {pendingCount}
          </span>
        </button>
        <button
          onClick={() => setFilter("completadas")}
          aria-pressed={filter === "completadas"}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-[background-color,box-shadow,color,border-color] duration-[180ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            filter === "completadas"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "bg-surface border border-outline-variant/30 text-on-surface-variant hover:border-primary/30"
          )}
        >
          Completadas
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20">
            {completedCount}
          </span>
        </button>
      </div>
    </div>
  );
}
