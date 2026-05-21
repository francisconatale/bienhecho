"use client";

import { pdf } from "@react-pdf/renderer";
import { BudgetPDF } from "@/lib/pdf/templates/afip-style";
import { useDataStore } from "@/lib/store";
import { useUserStore } from "@/lib/user-store";
import { Budget, Concept } from "@/types"; // Need to make sure Concept is accessible

export function useBudgetPDF() {
  const { clients, jobs } = useDataStore();
  const { user } = useUserStore();

  const downloadPDF = async (budget: Partial<Budget>, concepts: any[]) => {
    const client = clients.find((c) => c.id === budget.clientId);
    const job = jobs.find((j) => j.id === budget.jobId);

    if (!client) {
      console.error("Client not found for PDF generation");
      return;
    }

    const userProfile = {
      name: user?.name || "Prestador de Servicios",
      company: user?.name || "Mi Empresa",
      address: "Domicilio Comercial S/D",
      cuit: "00-00000000-0",
      trade: jobs.find(j => j.id === budget.jobId)?.name || "Servicios Profesionales",
    };

    const doc = (
      <BudgetPDF
        budget={budget}
        client={client}
        job={job}
        concepts={concepts}
        userProfile={userProfile}
      />
    );

    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `presupuesto-${client.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return { downloadPDF };
}
