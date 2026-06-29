import { useDataStore } from "@/lib/store";

export function useFinancialSummary() {
  const tasks = useDataStore((state) => state.tasks);
  const jobs = useDataStore((state) => state.jobs);

  const totalAFacturar = tasks
    .filter((task) => {
      // Solo tareas con precio e incompletas
      if (task.precio === null || task.completada) return false;
      
      // Solo de trabajos presupuestados
      const job = jobs.find((j) => j.id === task.trabajo_id);
      return job?.estado === "presupuestado";
    })
    .reduce((sum, task) => sum + (task.precio || 0), 0);

  return { totalAFacturar };
}
