import { useQuery } from "@tanstack/react-query";
import { jobsService } from "@/services/jobs.service";
import { clientsService } from "@/services/clients.service";
import { tasksService } from "@/services/tasks.service";;
export interface ClientAlert {
  id: string;
  jobId: string;
  clienteNombre: string;
  mensaje: string;
  tipo: "borrador" | "demorado";
}

export function useClientAlerts() {
  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({ queryKey: ["jobs"], queryFn: jobsService.getAll });
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({ queryKey: ["clients"], queryFn: clientsService.getAll });
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({ queryKey: ["tasks"], queryFn: tasksService.getAll });

  const alerts: ClientAlert[] = [];

  jobs.forEach((job) => {
    const cliente = clients.find((c) => c.id === job.cliente_id);
    const nombre = cliente?.nombre || "Cliente desconocido";

    if (job.estado === "borrador") {
      alerts.push({
        id: `alert-borrador-${job.id}`,
        jobId: job.id,
        clienteNombre: nombre,
        mensaje: `Te falta emitirle el presupuesto a ${nombre}.`,
        tipo: "borrador",
      });
    }

    if (job.estado === "presupuestado" && job.fecha_inicio) {
      const today = new Date().toISOString().slice(0, 10);
      const hasCompletedTasks = tasks.some(
        (t) => t.trabajo_id === job.id && t.completada
      );

      if (today > job.fecha_inicio && !hasCompletedTasks) {
        alerts.push({
          id: `alert-demorado-${job.id}`,
          jobId: job.id,
          clienteNombre: nombre,
          mensaje: `Trabajo demorado con ${nombre}.`,
          tipo: "demorado",
        });
      }
    }
  });

  return { alerts, isLoading: isLoadingJobs || isLoadingClients || isLoadingTasks };
}
