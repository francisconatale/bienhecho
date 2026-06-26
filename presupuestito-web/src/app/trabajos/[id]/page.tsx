"use client";

import React, { useState } from "react";
import { ChevronLeft, FileDown } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useDataStore } from "@/lib/store";
import { useBudgetPDF } from "@/hooks/use-budget-pdf";
import { JobHeader } from "./components/job-header";
import { JobStatusSelector } from "./components/job-status";
import { ProgressBar } from "./components/progress-bar";
import { TaskList } from "./components/task-list";
import { cn } from "@/lib/utils";

interface TrabajoPageProps {
  params: Promise<{ id: string }>;
}

export default function TrabajoPage({ params }: TrabajoPageProps) {
  const { id } = React.use(params);
  const { jobs, clients, tasks } = useDataStore();
  const { downloadPDF } = useBudgetPDF();
  const [pdfError, setPdfError] = useState<string | null>(null);

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  const client = clients.find((c) => c.id === job.cliente_id);
  const jobTasks = tasks.filter((t) => t.trabajo_id === job.id);
  const totalEstimado = jobTasks.reduce((sum, t) => sum + (t.precio ?? 0), 0);
  const hasTasksWithPrice = jobTasks.some((t) => t.precio !== null);

  const handleDownloadPDF = () => {
    setPdfError(null);
    try {
      downloadPDF(job.id);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      setPdfError(error instanceof Error ? error.message : "Error al generar el PDF");
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Aurora Background */}
      <div
        className="absolute top-0 left-0 right-0 h-[400px] md:h-[1200px] pointer-events-none overflow-hidden transition-all duration-700"
        style={{
          zIndex: -1,
          WebkitMaskImage:
            "linear-gradient(to bottom, black 10%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
        }}
      >
        <div className="absolute top-[-50px] left-[-50px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/20 md:bg-primary/15 blur-[100px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700" />
        <div className="absolute top-[0px] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-container/20 md:bg-primary-container/15 blur-[120px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700" />
        <div className="hidden dark:block absolute top-[-50px] left-[-50px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/25 md:bg-primary/15 blur-[120px] md:blur-[180px] rounded-full transition-all duration-700" />
        <div className="hidden dark:block absolute top-[50px] right-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-primary-container/35 md:bg-primary-container/25 blur-[120px] md:blur-[160px] rounded-full transition-all duration-700" />
      </div>

      <main className="relative flex-1 px-5 md:px-8 lg:px-12 pt-16 pb-32 w-full transition-all max-w-4xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Link href="/trabajos">
              <button
                aria-label="Volver"
                className="w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-95"
              >
                <ChevronLeft className="w-6 h-6 text-on-surface" />
              </button>
            </Link>
            <h1 className="text-[28px] md:text-[34px] leading-tight font-extrabold text-on-surface tracking-tight">
              Detalle del Trabajo
            </h1>
          </div>
          <JobStatusSelector job={job} />
        </div>

        <JobHeader job={job} client={client} />

        <ProgressBar tasks={jobTasks} />

        {/* Total estimado + PDF button */}
        <div className="bg-surface rounded-[32px] p-6 border border-outline-variant/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
              Total estimado (tareas con precio)
            </span>
            <span className="text-xl font-black text-on-surface">
              ${totalEstimado.toLocaleString("es-AR")}
            </span>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={!hasTasksWithPrice}
            className={cn(
              "w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2",
              hasTasksWithPrice
                ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
                : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
            )}
          >
            <FileDown className="w-4 h-4" strokeWidth={2.5} />
            Generar Presupuesto
          </button>
          {!hasTasksWithPrice && (
            <p className="text-xs font-medium text-on-surface-variant/40 text-center">
              Agregá tareas con precio para generar el presupuesto
            </p>
          )}
          {pdfError && (
            <p className="text-xs font-medium text-red-500 text-center">
              {pdfError}
            </p>
          )}
        </div>

        <TaskList jobId={job.id} />
      </main>
    </div>
  );
}
