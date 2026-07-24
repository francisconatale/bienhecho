import { useQuery } from "@tanstack/react-query";
import { tasksService_getAll } from "@/actions/tasks.actions";
import { jobsService_getAll } from "@/actions/jobs.actions";
import { clientsService_getAll } from "@/actions/clients.actions";
import { visitsService_getAll } from "@/actions/visits.actions";
import { Task, Job, Visit } from "@/types";

export interface AgendaSuggestion {
  jobId: string;
  jobTitle: string;
  clientName: string;
  criticalTasksCount: number;
  criticalTasks: Task[];
}

export function useSmartScheduling() {
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({ queryKey: ["tasks"], queryFn: tasksService_getAll });
  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({ queryKey: ["jobs"], queryFn: jobsService_getAll });
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({ queryKey: ["clients"], queryFn: clientsService_getAll });
  const { data: visits = [], isLoading: isLoadingVisits } = useQuery({ queryKey: ["visits"], queryFn: visitsService_getAll });

  const getSuggestions = (): AgendaSuggestion[] => {
    // 1. Filter critical tasks that are incomplete
    const criticalTasks = tasks.filter(
      (t) => !t.completada && (t.prioridad === "alta" || t.prioridad === "media")
    );

    // 2. Group by job ID
    const groupedByJob = criticalTasks.reduce((acc, task) => {
      if (!acc[task.trabajo_id]) {
        acc[task.trabajo_id] = [];
      }
      acc[task.trabajo_id].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    // 3. Current date for comparison
    const today = new Date().toISOString().split("T")[0];

    // 4. Generate suggestions for jobs without future visits
    const suggestions: AgendaSuggestion[] = [];

    for (const jobId in groupedByJob) {
      const jobTasks = groupedByJob[jobId];
      const job = jobs.find((j) => j.id === jobId);
      if (!job) continue;

      const client = clients.find((c) => c.id === job.cliente_id);

      // Check if there is any scheduled visit for this job in the future or today
      const hasFutureVisit = visits.some(
        (v) => v.trabajo_id === jobId && v.fecha >= today && v.estado !== "cancelada"
      );

      if (!hasFutureVisit) {
        suggestions.push({
          jobId: job.id,
          jobTitle: job.titulo,
          clientName: client?.nombre || "Cliente Desconocido",
          criticalTasksCount: jobTasks.length,
          criticalTasks: jobTasks.sort((a, b) => {
            if (a.prioridad === "alta" && b.prioridad !== "alta") return -1;
            if (a.prioridad !== "alta" && b.prioridad === "alta") return 1;
            return 0;
          }),
        });
      }
    }

    // Sort suggestions: jobs with more critical tasks first, then by priority weight
    return suggestions.sort((a, b) => {
      const aAlta = a.criticalTasks.filter(t => t.prioridad === "alta").length;
      const bAlta = b.criticalTasks.filter(t => t.prioridad === "alta").length;
      if (aAlta !== bAlta) return bAlta - aAlta;
      return b.criticalTasksCount - a.criticalTasksCount;
    });
  };

  return {
    suggestions: getSuggestions(),
    isLoading: isLoadingTasks || isLoadingJobs || isLoadingClients || isLoadingVisits,
  };
}
