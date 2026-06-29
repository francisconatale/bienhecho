import { cn } from "@/lib/utils";
import type { FilterType } from "../hooks/use-tareas";
import { LayoutList, LayoutGrid } from "lucide-react";

interface TareasFilterProps {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  pendingCount: number;
  completedCount: number;
  viewMode?: "list" | "board";
  setViewMode?: (mode: "list" | "board") => void;
}

export function TareasFilter({
  filter,
  setFilter,
  pendingCount,
  completedCount,
  viewMode = "list",
  setViewMode,
}: TareasFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("pendientes")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all",
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
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all",
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

      {setViewMode && filter !== "completadas" && (
        <div className="hidden md:flex bg-surface border border-outline-variant/20 p-1 rounded-[16px] shadow-sm">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "px-3 py-1.5 rounded-[12px] flex items-center gap-2 text-sm font-semibold transition-all",
              viewMode === "list"
                ? "bg-primary/10 text-primary"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50"
            )}
            title="Vista de Lista"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("board")}
            className={cn(
              "px-3 py-1.5 rounded-[12px] flex items-center gap-2 text-sm font-semibold transition-all",
              viewMode === "board"
                ? "bg-primary/10 text-primary"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50"
            )}
            title="Vista de Tablero"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
