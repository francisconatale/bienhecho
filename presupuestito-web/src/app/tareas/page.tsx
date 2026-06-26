"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/store";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationButtons } from "@/components/ui/pagination-buttons";
import { Check, Circle, Briefcase } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TareasPage() {
  const { jobs, clients, tasks, updateTask } = useDataStore();
  const [filter, setFilter] = useState<"pendientes" | "completadas">("pendientes");

  const allTasks = tasks
    .map((t) => {
      const job = jobs.find((j) => j.id === t.trabajo_id);
      const client = job ? clients.find((c) => c.id === job.cliente_id) : null;
      return { ...t, job, client };
    })
    .filter((t) => t.job);

  const filtered = allTasks.filter((t) =>
    filter === "pendientes" ? !t.completada : t.completada
  );

  const pag = usePagination(filtered, 10);

  const pendingCount = allTasks.filter((t) => !t.completada).length;
  const completedCount = allTasks.filter((t) => t.completada).length;

  const toggleTask = (taskId: string, current: boolean) => {
    updateTask(taskId, { completada: !current });
  };

  return (
    <main className="flex-1 pb-32 w-full pt-10 transition-all max-w-4xl mx-auto px-4 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight text-on-surface mb-2">
          Tareas
        </h1>
        <p className="text-base text-on-surface-variant/60 font-medium">
          Seguimiento de tareas de todos tus trabajos.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
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

      {/* Tasks List */}
      <div className="bg-surface rounded-[32px] border border-outline-variant/10 shadow-sm overflow-hidden divide-y divide-outline-variant/10">
        {pag.paginatedItems.length > 0 ? (
          pag.paginatedItems.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTask(task.id, task.completada)}
                className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all active:scale-90",
                  task.completada
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-outline-variant/30 hover:border-primary/50"
                )}
              >
                {task.completada && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
              </button>

              {/* Content */}
              <Link href={`/trabajos/${task.trabajo_id}/tareas/${task.id}?from=tareas`} className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-bold transition-all",
                    task.completada
                      ? "text-on-surface-variant/40 line-through"
                      : "text-on-surface"
                  )}
                >
                  {task.descripcion}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-on-surface-variant/40 mt-0.5">
                  <Briefcase className="w-3 h-3" />
                  <span className="font-bold">{task.job?.titulo}</span>
                  <span className="opacity-30">•</span>
                  <span>{task.client?.nombre}</span>
                </div>
              </Link>

              {/* Price */}
              {task.precio !== null && (
                <span className="text-xs font-bold text-on-surface/50 shrink-0 cursor-default select-none">
                  ${task.precio.toLocaleString("es-AR")}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <div className="bg-on-surface/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              {filter === "pendientes" ? (
                <Check className="w-8 h-8 text-emerald-500/40" />
              ) : (
                <Circle className="w-8 h-8 text-on-surface-variant/20" />
              )}
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-1">
              {filter === "pendientes" ? "Todo completado" : "Sin completadas"}
            </h3>
            <p className="text-sm text-on-surface-variant/40">
              {filter === "pendientes"
                ? "No hay tareas pendientes."
                : "Aún no completaste ninguna tarea."}
            </p>
          </div>
        )}
      </div>

      <PaginationButtons
        currentPage={pag.currentPage}
        totalPages={pag.totalPages}
        totalItems={pag.totalItems}
        pageSize={pag.pageSize}
        onPageChange={pag.goToPage}
      />
    </main>
  );
}
