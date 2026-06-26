"use client";

import React, { useState, Suspense } from "react";
import { ChevronLeft, FileDown } from "lucide-react";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { useDataStore } from "@/lib/store";
import { useBudgetPDF } from "@/hooks/use-budget-pdf";
import { Header } from "@/components/layout/header";
import { JobHeader } from "./components/job-header";
import { JobStatusSelector } from "./components/job-status";
import { ProgressBar } from "./components/progress-bar";
import { TaskList } from "./components/task-list";
import { cn } from "@/lib/utils";

interface TrabajoPageProps {
  params: Promise<{ id: string }>;
}

function TrabajoDetail({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const { jobs, clients, tasks } = useDataStore();
  const { downloadPDF } = useBudgetPDF();
  const [pdfError, setPdfError] = useState<string | null>(null);

  const fromClientes = searchParams.get("from") === "clientes";
  const clienteId = searchParams.get("clienteId");
  const backHref = fromClientes && clienteId
    ? `/clientes?clienteId=${clienteId}`
    : fromClientes
      ? "/clientes"
      : "/trabajos";

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
      {/* Grain / Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-[100] dark:opacity-[0.06]" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

      {/* Aurora Background */}
      <div
        className="absolute top-0 left-0 right-0 h-[400px] md:h-[1200px] pointer-events-none overflow-hidden transition-all duration-1000"
        style={{
          zIndex: -1,
          WebkitMaskImage:
            "linear-gradient(to bottom, black 10%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
        }}
      >
        <div className="absolute top-[-50px] left-[-50px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/30 md:bg-primary/20 blur-[100px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[0px] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-container/30 md:bg-primary-container/20 blur-[120px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000" />
        <div className="hidden dark:block absolute top-[-50px] left-[-50px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/35 md:bg-primary/25 blur-[120px] md:blur-[180px] rounded-full transition-all duration-1000" />
        <div className="hidden dark:block absolute top-[50px] right-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-primary-container/40 md:bg-primary-container/30 blur-[120px] md:blur-[160px] rounded-full transition-all duration-1000" />
      </div>

      <div className="md:hidden relative z-10">
        <Header 
          title="Detalle del Trabajo" 
          leftAction={
            <Link href={backHref}>
              <button
                aria-label="Volver"
                className="w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-95"
              >
                <ChevronLeft className="w-6 h-6 text-on-surface" />
              </button>
            </Link>
          }
          rightAction={<JobStatusSelector job={job} />}
          actionContainerClassName="flex items-center shrink-0 w-auto min-w-[40px]"
        />
      </div>

      <main className="relative flex-1 px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-7xl mx-auto w-full mt-20 md:mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] xl:grid-cols-[1fr_300px] gap-6 xl:gap-10 items-start">
          {/* Columna Principal */}
          <div className="space-y-4">
            {/* Desktop Breadcrumb & Status */}
            <div className="hidden md:flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant/60">
                <Link href={backHref} className="flex items-center gap-1 hover:text-primary transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Volver a {fromClientes && client ? client.nombre : "Trabajos"}
                </Link>
              </div>
              <JobStatusSelector job={job} />
            </div>

            <JobHeader job={job} client={client} />
            <TaskList jobId={job.id} />
          </div>

          {/* Columna Secundaria (Sidebar Sticky en Desktop) */}
          <div className="space-y-4 lg:sticky lg:top-32">
            <ProgressBar tasks={jobTasks} />
            
            {/* Card de Total + Acciones con Glassmorphism */}
            <div className="relative overflow-hidden bg-surface/30 dark:bg-surface/10 backdrop-blur-2xl rounded-[28px] p-6 border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-6 transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 dark:to-transparent pointer-events-none" />
              
              <div className="relative flex flex-col gap-1 z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/50">
                  Total estimado
                </span>
                <span className="text-4xl lg:text-5xl font-black text-on-surface tracking-tighter mt-1">
                  ${totalEstimado.toLocaleString("es-AR")}
                </span>
                <span className="text-[10px] font-bold tracking-[0.1em] text-on-surface-variant/40 uppercase mt-1">
                  Tareas con precio
                </span>
              </div>

              <button
                onClick={handleDownloadPDF}
                disabled={!hasTasksWithPrice}
                className={cn(
                  "relative w-full py-4 rounded-[20px] font-black text-[11px] uppercase tracking-[0.25em] transition-all duration-500 flex items-center justify-center gap-2 overflow-hidden z-10 group",
                  hasTasksWithPrice
                    ? "bg-primary text-white shadow-[0_8px_20px_rgba(61,139,110,0.25)] hover:shadow-[0_16px_40px_rgba(61,139,110,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-on-surface/5 text-on-surface-variant/30 cursor-not-allowed"
                )}
              >
                {hasTasksWithPrice && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                )}
                <FileDown className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" strokeWidth={2.5} />
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
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TrabajoPage({ params }: TrabajoPageProps) {
  const { id } = React.use(params);
  return (
    <Suspense>
      <TrabajoDetail id={id} />
    </Suspense>
  );
}
