"use client";

import { generateBudgetPDF } from "@/lib/pdf/generate-budget";
import { useQueryClient } from "@tanstack/react-query";
import { jobsService, clientsService, tasksService, materialsService } from "@/services";
import { useProfile } from "@/hooks/use-profile";

export function useBudgetPDF() {
  const queryClient = useQueryClient();
  const { profile } = useProfile();

  const downloadPDF = async (jobId: string) => {
    const jobs = await queryClient.fetchQuery({ queryKey: ["jobs"], queryFn: jobsService.getAll });
    const clients = await queryClient.fetchQuery({ queryKey: ["clients"], queryFn: clientsService.getAll });
    const tasks = await queryClient.fetchQuery({ queryKey: ["tasks"], queryFn: tasksService.getAll });
    const materiales = await queryClient.fetchQuery({ queryKey: ["materials"], queryFn: materialsService.getAll });

    const job = jobs.find((j) => j.id === jobId);
    const client = clients.find((c) => c.id === job?.cliente_id);

    if (!job || !client) {
      throw new Error("Trabajo o cliente no encontrado");
    }

    const jobTasks = tasks
      .filter((t) => t.trabajo_id === jobId && t.precio !== null)
      .sort((a, b) => a.orden - b.orden);

    const jobMateriales = materiales.filter(m => m.trabajo_id === jobId);

    if (jobTasks.length === 0 && jobMateriales.length === 0) {
      throw new Error("No hay tareas con precio ni materiales para generar el presupuesto");
    }

    const userProfile = {
      name: profile?.nombre || "Prestador de Servicios",
      company: profile?.nombre || "Mi Empresa",
      address: profile?.direccion || "Domicilio Comercial S/D",
      cuit: "00-00000000-0",
      matricula: profile?.numero_matricula,
      trade: job.titulo || profile?.rubro || "Servicios Profesionales",
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
