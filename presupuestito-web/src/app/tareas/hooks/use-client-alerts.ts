import { useDataStore } from "@/lib/store";

export interface ClientAlert {
  id: string;
  jobId: string;
  clienteNombre: string;
  mensaje: string;
  tipo: "borrador" | "demorado";
}

export function useClientAlerts() {
  const jobs = useDataStore((state) => state.jobs);
  const clients = useDataStore((state) => state.clients);
  const tasks = useDataStore((state) => state.tasks);

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

  return { alerts };
}
