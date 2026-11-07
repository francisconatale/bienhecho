import { useQuery } from "@tanstack/react-query";
import { jobsService_getAll } from "@/actions/jobs.actions";
import { tasksService_getAll } from "@/actions/tasks.actions";
export function useFinancialSummary() {
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({ queryKey: ["tasks"], queryFn: tasksService_getAll });
  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({ queryKey: ["jobs"], queryFn: jobsService_getAll });

  const totalAFacturar = tasks
    .filter((task) => {
      // Solo tareas con precio e incompletas
      if (task.precio === null || task.completada) return false;
      
      // Solo de trabajos presupuestados
      const job = jobs.find((j) => j.id === task.trabajo_id);
      return job?.estado === "presupuestado";
    })
    .reduce((sum, task) => sum + (task.precio || 0), 0);

  return { totalAFacturar, isLoading: isLoadingTasks || isLoadingJobs };
}
