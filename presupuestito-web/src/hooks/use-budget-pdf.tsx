"use client";

import { generateBudgetPDF } from "@/lib/pdf/generate-budget";
import type { PDFData } from "@/lib/pdf/generate-budget";
import type { PDFParams } from "@/lib/pdf/types";
import { useQueryClient } from "@tanstack/react-query";
import { jobsService, clientsService, tasksService, materialsService } from "@/services";
import { storageService } from "@/services/storage.service";
import { useProfile } from "@/hooks/use-profile";

export function useBudgetPDF() {
  const queryClient = useQueryClient();
  const { profile } = useProfile();

  const getBudgetData = async (jobId: string): Promise<PDFData> => {
    const jobs = await queryClient.fetchQuery({ queryKey: ["jobs"], queryFn: jobsService.getAll });
    const clients = await queryClient.fetchQuery({ queryKey: ["clients"], queryFn: clientsService.getAll });
    
    const tasks = await queryClient.fetchQuery({ queryKey: ["tasks", jobId], queryFn: () => tasksService.getByJobId(jobId) });
    const materiales = await queryClient.fetchQuery({ queryKey: ["materials", jobId], queryFn: () => materialsService.getByJobId(jobId) });

    const job = jobs.find((j) => j.id === jobId);
    const client = clients.find((c) => c.id === job?.cliente_id);

    if (!job || !client) {
      throw new Error("Trabajo o cliente no encontrado");
    }

    const jobTasks = tasks
      .filter((t) => t.precio !== null)
      .sort((a, b) => a.orden - b.orden);

    const jobMateriales = materiales;

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
      logo_url: profile?.logo_path ? storageService.getPublicUrl(profile.logo_path) : undefined,
    };

    return { client, job, tasks: jobTasks, materiales: jobMateriales, userProfile };
  };

  const downloadPDF = async (jobId: string, params?: PDFParams) => {
    const data = await getBudgetData(jobId);
    await generateBudgetPDF(data, params);
  };

  return { downloadPDF, getBudgetData };
}
