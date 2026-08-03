"use client";

import { generateBudgetPDF } from "@/lib/pdf/generate-budget";
import type { PDFData } from "@/lib/pdf/generate-budget";
import type { PDFParams } from "@/lib/pdf/types";
import { useQueryClient } from "@tanstack/react-query";
import { jobsService_getAll } from "@/actions/jobs.actions";
import { clientsService_getAll } from "@/actions/clients.actions";
import { tasksService_getByJobId } from "@/actions/tasks.actions";
import { materialsService_getByJobId } from "@/actions/materials.actions";
import { getPublicLogoUrl } from "@/lib/storage-utils";
import { useProfile } from "@/hooks/use-profile";

export function useBudgetPDF() {
  const queryClient = useQueryClient();
  const { profile } = useProfile();

  const getBudgetData = async (jobId: string): Promise<PDFData> => {
    const jobs = await queryClient.fetchQuery({ queryKey: ["jobs"], queryFn: jobsService_getAll });
    const clients = await queryClient.fetchQuery({ queryKey: ["clients"], queryFn: clientsService_getAll });
    
    const tasks = await queryClient.fetchQuery({ queryKey: ["tasks", jobId], queryFn: () => tasksService_getByJobId(jobId) });
    const materiales = await queryClient.fetchQuery({ queryKey: ["materials", jobId], queryFn: () => materialsService_getByJobId(jobId) });

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
      cuit: profile?.cuit || undefined,
      matricula: profile?.matricula || undefined,
      trade: job.titulo || profile?.rubro || "Servicios Profesionales",
      logo_url: profile?.logo_path ? getPublicLogoUrl(profile.logo_path) : undefined,
    };

    return { client, job, tasks: jobTasks, materiales: jobMateriales, userProfile };
  };

  const downloadPDF = async (jobId: string, params?: PDFParams) => {
    const data = await getBudgetData(jobId);
    await generateBudgetPDF(data, params);
  };

  return { downloadPDF, getBudgetData };
}
