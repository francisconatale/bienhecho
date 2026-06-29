import { useState } from "react";
import { useDataStore } from "@/lib/store";

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

  // Agrupamos
  const alta = allTasks.filter((t) => !t.completada && t.prioridad === "alta");
  const media = allTasks.filter((t) => !t.completada && t.prioridad === "media");
  const baja = allTasks.filter((t) => !t.completada && (!t.prioridad || t.prioridad === "baja"));
  const completadas = allTasks.filter((t) => t.completada);

  const toggleTask = (taskId: string, current: boolean) => {
    updateTask(taskId, { completada: !current });
  };

  return {
    filter,
    setFilter,
    pendingCount,
    completedCount,
    toggleTask,
    groupedTasks: { alta, media, baja, completadas },
  };
}
