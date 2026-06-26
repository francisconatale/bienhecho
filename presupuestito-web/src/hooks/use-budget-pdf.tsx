"use client";

import { generateBudgetPDF } from "@/lib/pdf/generate-budget";
import { useDataStore } from "@/lib/store";
import { useUserStore } from "@/lib/user-store";

export function useBudgetPDF() {
  const { clients, jobs, tasks } = useDataStore();
  const { user } = useUserStore();

  const downloadPDF = async (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    const client = clients.find((c) => c.id === job?.cliente_id);

    if (!job || !client) {
      throw new Error("Trabajo o cliente no encontrado");
    }

    const jobTasks = tasks
      .filter((t) => t.trabajo_id === jobId && t.precio !== null)
      .sort((a, b) => a.orden - b.orden);

    const jobMateriales = useDataStore.getState().materiales.filter(m => m.trabajo_id === jobId);

    if (jobTasks.length === 0 && jobMateriales.length === 0) {
      throw new Error("No hay tareas con precio ni materiales para generar el presupuesto");
    }

    const userProfile = {
      name: user?.name || "Prestador de Servicios",
      company: user?.name || "Mi Empresa",
      address: "Domicilio Comercial S/D",
      cuit: "00-00000000-0",
      trade: job.titulo || "Servicios Profesionales",
    };

    generateBudgetPDF({
      client,
      job,
      tasks: jobTasks,
      materiales: jobMateriales,
      userProfile,
    });
  };

  return { downloadPDF };
}
