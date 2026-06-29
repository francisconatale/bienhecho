import { useState } from "react";
import { useDataStore } from "@/lib/store";
import { usePagination } from "@/hooks/use-pagination";

export type FilterType = "pendientes" | "completadas";

export function useTareas() {
  const { jobs, clients, tasks, updateTask } = useDataStore();
  const [filter, setFilter] = useState<FilterType>("pendientes");

  const allTasks = tasks
    .map((t) => {
      const job = jobs.find((j) => j.id === t.trabajo_id);
      const client = job ? clients.find((c) => c.id === job.cliente_id) : null;
      return { ...t, job, client };
    })
    .filter((t) => t.job);

  const pendingCount = allTasks.filter((t) => !t.completada).length;
  const completedCount = allTasks.filter((t) => t.completada).length;

  const filtered = allTasks.filter((t) =>
    filter === "pendientes" ? !t.completada : t.completada
  );

  const pag = usePagination(filtered, 10);

  const toggleTask = (taskId: string, current: boolean) => {
    updateTask(taskId, { completada: !current });
  };

  return {
    filter,
    setFilter,
    pendingCount,
    completedCount,
    toggleTask,
    paginatedItems: pag.paginatedItems,
    currentPage: pag.currentPage,
    totalPages: pag.totalPages,
    totalItems: pag.totalItems,
    pageSize: pag.pageSize,
    goToPage: pag.goToPage,
  };
}
