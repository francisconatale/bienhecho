import { useState } from "react";
import { useDataStore } from "@/lib/store";

export type FilterType = "pendientes" | "completadas";
export type CategoryType = "resumen" | "alta" | "media" | "baja";

export function useTareas() {
  const { jobs, clients, tasks, updateTask, removeTask } = useDataStore();
  const [filter, setFilter] = useState<FilterType>("pendientes");
  const [category, setCategory] = useState<CategoryType>("resumen");

  const allTasks = tasks
    .map((t) => {
      const job = jobs.find((j) => j.id === t.trabajo_id);
      const client = job ? clients.find((c) => c.id === job.cliente_id) : null;
      return { ...t, job, client };
    })
    .filter((t) => t.job);

  const pendingCount = allTasks.filter((t) => !t.completada).length;
  const completedCount = allTasks.filter((t) => t.completada).length;

  const pendingAlta = allTasks.filter((t) => !t.completada && t.prioridad === "alta");
  const pendingMedia = allTasks.filter((t) => !t.completada && t.prioridad === "media");
  const pendingBaja = allTasks.filter((t) => !t.completada && (!t.prioridad || t.prioridad === "baja"));
  const completadas = allTasks.filter((t) => t.completada);

  let alta = pendingAlta;
  let media = pendingMedia;
  let baja = pendingBaja;

  if (filter === "pendientes") {
    if (category === "resumen") {
      const combined = [...pendingAlta, ...pendingMedia, ...pendingBaja].slice(0, 10);
      alta = combined.filter((t) => t.prioridad === "alta");
      media = combined.filter((t) => t.prioridad === "media");
      baja = combined.filter((t) => !t.prioridad || t.prioridad === "baja");
    } else if (category === "alta") {
      media = []; baja = [];
    } else if (category === "media") {
      alta = []; baja = [];
    } else if (category === "baja") {
      alta = []; media = [];
    }
  }

  const toggleTask = (taskId: string, current: boolean) => {
    updateTask(taskId, { completada: !current });
  };

  const togglePriority = (taskId: string, currentPriority: string | null) => {
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
    category,
    setCategory,
    pendingCount,
    completedCount,
    toggleTask,
    togglePriority,
    deleteTask,
    groupedTasks: { alta, media, baja, completadas },
    categoryCounts: { alta: pendingAlta.length, media: pendingMedia.length, baja: pendingBaja.length },
  };
}
