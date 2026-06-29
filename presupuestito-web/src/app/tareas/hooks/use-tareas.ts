import { useState } from "react";
import { useDataStore } from "@/lib/store";

export type FilterType = "pendientes" | "completadas";

export function useTareas() {
  const { jobs, clients, tasks, updateTask, removeTask } = useDataStore();
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

  const togglePriority = (taskId: string, currentPriority: string | null) => {
    // Cycle priorities: baja -> media -> alta -> baja
    const next = currentPriority === "alta" ? "baja" : currentPriority === "media" ? "alta" : "media";
    updateTask(taskId, { prioridad: next });
  };

  const deleteTask = (taskId: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta tarea?")) {
      removeTask(taskId);
    }
  };

  return {
    filter,
    setFilter,
    pendingCount,
    completedCount,
    toggleTask,
    togglePriority,
    deleteTask,
    groupedTasks: { alta, media, baja, completadas },
  };
}
