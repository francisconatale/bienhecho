import { useQuery } from "@tanstack/react-query";
import { jobsService } from "@/services/jobs.service";
import { tasksService } from "@/services/tasks.service";;
export function useFinancialSummary() {
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({ queryKey: ["tasks"], queryFn: tasksService.getAll });
  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({ queryKey: ["jobs"], queryFn: jobsService.getAll });

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
