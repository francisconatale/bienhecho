import { requireAuth } from "@/utils/supabase/require-auth";
import { ClientAlert } from "@/app/(dashboard)/tareas/hooks/use-client-alerts";

export const alertsService = {
  getDashboardAlerts: async (): Promise<ClientAlert[]> => {
    const { supabase, user } = await requireAuth();
    
    // Traer trabajos en borrador o presupuestados
    const { data: jobs, error } = await supabase
      .from("trabajos")
      .select("id, estado, fecha_inicio, clientes(nombre)")
      .eq("user_id", user.id)
      .in("estado", ["borrador", "presupuestado"]);

    if (error) throw new Error(error.message);
    if (!jobs) return [];

    const alerts: ClientAlert[] = [];
    const today = new Date().toISOString().slice(0, 10);
    
    const presupuestadosAtrasados = jobs.filter(
      (job) => job.estado === "presupuestado" && job.fecha_inicio && today > job.fecha_inicio
    );

    let delayedTaskCounts: Record<string, number> = {};

    // Si hay trabajos atrasados, revisar si tienen tareas completadas
    if (presupuestadosAtrasados.length > 0) {
      const jobIds = presupuestadosAtrasados.map(j => j.id);
      const { data: tasks, error: tasksError } = await supabase
        .from("tareas")
        .select("trabajo_id, completada")
        .eq("user_id", user.id)
        .in("trabajo_id", jobIds)
        .eq("completada", true);
        
      if (!tasksError && tasks) {
        tasks.forEach(t => {
          delayedTaskCounts[t.trabajo_id] = (delayedTaskCounts[t.trabajo_id] || 0) + 1;
        });
      }
    }

    const borradorJobs = jobs.filter((job) => job.estado === "borrador");
    if (borradorJobs.length > 3) {
      alerts.push({
        id: "alert-borrador-multiple",
        jobId: "multiple",
        clienteNombre: "Varios",
        mensaje: `Te falta emitir el presupuesto de ${borradorJobs.length} trabajos.`,
        tipo: "borrador",
      });
    } else {
      borradorJobs.forEach((job) => {
        // @ts-ignore
        const nombre = job.clientes?.nombre || "Cliente desconocido";
        alerts.push({
          id: `alert-borrador-${job.id}`,
          jobId: job.id,
          clienteNombre: nombre,
          mensaje: `Te falta emitirle el presupuesto a ${nombre}.`,
          tipo: "borrador",
        });
      });
    }

    jobs.forEach((job) => {
      // @ts-ignore
      const nombre = job.clientes?.nombre || "Cliente desconocido";

      if (job.estado === "presupuestado" && job.fecha_inicio) {
        if (today > job.fecha_inicio && !delayedTaskCounts[job.id]) {
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

    return alerts;
  }
};
