import { useState, useMemo } from "react";
import { useDataStore } from "@/lib/store";

export type FilterType = "pendientes" | "completadas";
export type CategoryType = "resumen" | "alta" | "media" | "baja";

export function useTareas() {
  const { jobs, clients, tasks, updateTask, removeTask } = useDataStore();
  const [filter, setFilter] = useState<FilterType>("pendientes");
  const [category, setCategory] = useState<CategoryType>("resumen");

  const { groupedTasks, categoryCounts, pendingCount, completedCount } = useMemo(() => {
    const allTasks = tasks
      .map((t) => {
        const job = jobs.find((j) => j.id === t.trabajo_id);
        const client = job ? clients.find((c) => c.id === job.cliente_id) : null;
        return { ...t, job, client };
      })
      .filter((t) => t.job);

    const allPending = allTasks.filter((t) => !t.completada);
    const allCompleted = allTasks.filter((t) => t.completada);

    const pendingAlta = allPending.filter((t) => t.prioridad === "alta");
    const pendingMedia = allPending.filter((t) => t.prioridad === "media");
    const pendingBaja = allPending.filter((t) => !t.prioridad || t.prioridad === "baja");

    let alta = pendingAlta;
    let media = pendingMedia;
    let baja = pendingBaja;

    if (filter === "pendientes") {
      if (category === "resumen") {
        alta = pendingAlta.slice(0, 5);
        media = pendingMedia.slice(0, 5);
        baja = pendingBaja.slice(0, 5);
      } else if (category === "alta") {
        media = []; baja = [];
      } else if (category === "media") {
        alta = []; baja = [];
      } else if (category === "baja") {
        alta = []; media = [];
      }
    }

    return {
      groupedTasks: { alta, media, baja, completadas: allCompleted },
      categoryCounts: { alta: pendingAlta.length, media: pendingMedia.length, baja: pendingBaja.length },
      pendingCount: allPending.length,
      completedCount: allCompleted.length,
    };
  }, [tasks, jobs, clients, filter, category]);

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
    isLoading: false,
    filter,
    setFilter,
    category,
    setCategory,
    pendingCount,
    completedCount,
    toggleTask,
    togglePriority,
    deleteTask,
    groupedTasks,
    categoryCounts,
  };
}
