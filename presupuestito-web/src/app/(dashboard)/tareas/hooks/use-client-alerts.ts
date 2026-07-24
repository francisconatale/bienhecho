import { useQuery } from "@tanstack/react-query";
import { jobsService_getAll } from "@/actions/jobs.actions";
import { clientsService_getAll } from "@/actions/clients.actions";
import { tasksService_getAll } from "@/actions/tasks.actions";
export interface ClientAlert {
  id: string;
  jobId: string;
  clienteNombre: string;
  mensaje: string;
  tipo: "borrador" | "demorado";
}

export function useClientAlerts() {
  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({ queryKey: ["jobs"], queryFn: jobsService_getAll });
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({ queryKey: ["clients"], queryFn: clientsService_getAll });
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({ queryKey: ["tasks"], queryFn: tasksService_getAll });

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
