"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Check, FileDown, Hammer, Wallet, X, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { useDataStore } from "@/lib/store";
import { useBudgetPDF } from "@/hooks/use-budget-pdf";
import { JobHeader } from "../[id]/components/job-header";
import { JobStatusSelector } from "../[id]/components/job-status";
import { ProgressBar } from "../[id]/components/progress-bar";
import { TaskList } from "../[id]/components/task-list";
import { useMaterials } from "../[id]/hooks/use-materials";
import { usePayments } from "../[id]/hooks/use-payments";
import { cn } from "@/lib/utils";
import { buildBackHref, buildForwardParams } from "@/lib/nav";

export function TrabajoDetail({
  id,
  isEmbedded = false,
  onBack,
  startEditing,
  onEditStarted,
  onEditingChange,
}: {
  id: string;
  isEmbedded?: boolean;
  onBack?: () => void;
  startEditing?: boolean;
  onEditStarted?: () => void;
  onEditingChange?: (editing: boolean) => void;
}) {
  const searchParams = useSearchParams();
  const { jobs, clients, tasks } = useDataStore();
  const { downloadPDF } = useBudgetPDF();
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);

  useEffect(() => { setIsHeaderEditing(false); }, []);
  useEffect(() => {
    if (startEditing) {
      setIsHeaderEditing(true);
      onEditStarted?.();
    }
  }, [startEditing]);
  useEffect(() => { onEditingChange?.(isHeaderEditing); }, [isHeaderEditing]);

  const backHref = buildBackHref(searchParams);
  const from = searchParams.get("from");

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    if (isEmbedded) return null;
    notFound();
  }

  const client = clients.find((c) => c.id === job.cliente_id);
  const jobTasks = tasks.filter((t) => t.trabajo_id === job.id);
  const totalEstimado = jobTasks.reduce((sum, t) => sum + (t.precio ?? 0), 0);
  const hasTasksWithPrice = jobTasks.some((t) => t.precio !== null);
  
  const { totalMateriales, materiales } = useMaterials(job.id);
  const presupuestoTotal = totalEstimado + totalMateriales;
  const hasItemsForBudget = hasTasksWithPrice || totalMateriales > 0;
  
  const { saldoPendiente } = usePayments(job.id);

  const backParams = buildForwardParams(searchParams, job.id);

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
    <div className={cn("relative w-full", isEmbedded ? "min-h-full" : "min-h-screen")}>
      {!isEmbedded && (
        <>
          {/* Grain / Noise Overlay */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-[100] dark:opacity-[0.06]" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

          {/* Aurora Background */}
          <div
            className="absolute top-0 left-0 right-0 h-[400px] md:h-[1200px] pointer-events-none overflow-hidden transition-all duration-1000"
            style={{
              zIndex: -1,
              WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
            }}
          >
            <div className="absolute top-[-50px] left-[-50px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/30 md:bg-primary/20 blur-[100px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000 animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute top-[0px] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-container/30 md:bg-primary-container/20 blur-[120px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000" />
            <div className="hidden dark:block absolute top-[-50px] left-[-50px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/35 md:bg-primary/25 blur-[120px] md:blur-[180px] rounded-full transition-all duration-1000" />
            <div className="hidden dark:block absolute top-[50px] right-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-primary-container/40 md:bg-primary-container/30 blur-[120px] md:blur-[160px] rounded-full transition-all duration-1000" />
          </div>

          {/* Mobile: back button */}
          <div className="md:hidden relative z-10 px-4 pt-2.5 pb-6 flex items-center justify-between">
            <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant font-medium hover:text-on-surface transition-colors active:scale-95">
              <ChevronLeft className="w-4 h-4" />
              Volver
            </Link>
            {isHeaderEditing ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsHeaderEditing(false)}
                  className="w-10 h-10 rounded-full bg-on-surface/5 flex items-center justify-center text-on-surface-variant hover:bg-on-surface/10 transition-all active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    document.querySelector<HTMLButtonElement>('[data-job-header-save]')?.click();
                  }}
                  className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary-dark transition-all active:scale-95"
                >
                  <Check className="w-5 h-5" strokeWidth={3} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsHeaderEditing(true)}
                className="w-10 h-10 rounded-full bg-on-surface/5 flex items-center justify-center text-on-surface-variant hover:bg-on-surface/10 transition-all active:scale-95"
                title="Editar trabajo"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </div>
        </>
      )}

      <main className={cn(
        "relative flex-1 w-full mx-auto",
        isEmbedded 
          ? "px-6 py-6 pb-28 md:px-8 max-w-full" 
          : "px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-7xl md:mt-0"
      )}>
        <div className={cn(
          "grid items-start",
          isEmbedded
            ? "grid-cols-1 xl:grid-cols-1 2xl:grid-cols-[1fr_300px] gap-6"
            : "grid-cols-1 lg:grid-cols-[1fr_260px] xl:grid-cols-[1fr_300px] gap-6 xl:gap-10"
        )}>
          {/* Columna Principal */}
          <div className="space-y-4">
            {/* Desktop Breadcrumb */}
            <div className="hidden md:flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant/60">
                {isEmbedded ? (
                  onBack && (
                    <button onClick={onBack} className="xl:hidden flex items-center gap-1 hover:text-primary transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                      Volver
                    </button>
                  )
                ) : (
                  <Link href={backHref} className="flex items-center gap-1 hover:text-primary transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    Volver a {from === "/clientes" && client ? client.nombre : "Trabajos"}
                  </Link>
                )}
              </div>
            </div>

            <JobHeader job={job} client={client} isEditing={isHeaderEditing} onEditingChange={setIsHeaderEditing} />
            
            <div className="grid grid-cols-2 gap-4">
              <Link href={`/trabajos/${job.id}/materiales${backParams}`} className="group relative overflow-hidden bg-surface/30 dark:bg-surface/10 backdrop-blur-2xl rounded-[24px] p-5 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:scale-[1.02] flex flex-col gap-2">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 dark:to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50">
                    Materiales
                  </span>
                  <Hammer className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="relative z-10 mt-1">
                  <span className="text-2xl font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors">
                    ${totalMateriales.toLocaleString("es-AR")}
                  </span>
                  <p className="text-[10px] font-medium text-on-surface-variant/40 mt-1 uppercase tracking-wider">
                    {materiales.length} ítem{materiales.length !== 1 && 's'}
                  </p>
                </div>
              </Link>

              <Link href={`/trabajos/${job.id}/pagos${backParams}`} className="group relative overflow-hidden bg-surface/30 dark:bg-surface/10 backdrop-blur-2xl rounded-[24px] p-5 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:scale-[1.02] flex flex-col gap-2">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 dark:to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50">
                    Cuentas a Cobrar
                  </span>
                  <Wallet className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="relative z-10 mt-1">
                  <span className={cn(
                    "text-2xl font-bold tracking-tight transition-colors",
                    saldoPendiente <= 0 ? "text-primary" : "text-on-surface group-hover:text-primary"
                  )}>
                    ${Math.max(0, saldoPendiente).toLocaleString("es-AR")}
                  </span>
                  <p className="text-[10px] font-medium text-on-surface-variant/40 mt-1 uppercase tracking-wider">
                    Saldo pendiente
                  </p>
                </div>
              </Link>
            </div>

            <TaskList jobId={job.id} />
          </div>

          {/* Columna Secundaria (Sidebar Sticky en Desktop) */}
          <div className={cn("space-y-4", isEmbedded ? "2xl:sticky 2xl:top-8" : "lg:sticky lg:top-32")}>
            <ProgressBar tasks={jobTasks} />
            
            {/* Job Status Card */}
            <JobStatusSelector job={job} variant="card" />
            
            {/* Card de Total + Acciones con Glassmorphism */}
            <div className="relative overflow-hidden bg-surface/30 dark:bg-surface/10 backdrop-blur-2xl rounded-[28px] p-6 border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-6 transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 dark:to-transparent pointer-events-none" />
              
              <div className="relative flex flex-col gap-1 z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/50">
                  Total estimado
                </span>
                <span className="text-4xl lg:text-5xl font-black text-on-surface tracking-tighter mt-1">
                  ${presupuestoTotal.toLocaleString("es-AR")}
                </span>
                <span className="text-[10px] font-bold tracking-[0.1em] text-on-surface-variant/40 uppercase mt-1">
                  Tareas + Materiales
                </span>

                <div className="flex flex-col gap-0.5 mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-on-surface-variant/60">Tareas</span>
                    <span className="text-[11px] font-bold text-on-surface">${totalEstimado.toLocaleString("es-AR")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-on-surface-variant/60">Materiales</span>
                    <span className="text-[11px] font-bold text-on-surface">${totalMateriales.toLocaleString("es-AR")}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownloadPDF}
                disabled={!hasItemsForBudget}
                className={cn(
                  "relative w-full py-4 rounded-[20px] font-black text-[11px] uppercase tracking-[0.25em] transition-all duration-500 flex items-center justify-center gap-2 overflow-hidden z-10 group",
                  hasItemsForBudget
                    ? "bg-primary text-white shadow-[0_8px_20px_rgba(61,139,110,0.25)] hover:shadow-[0_16px_40px_rgba(61,139,110,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-on-surface/5 text-on-surface-variant/30 cursor-not-allowed"
                )}
              >
                {hasItemsForBudget && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                )}
                <FileDown className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" strokeWidth={2.5} />
                Generar Presupuesto
              </button>
              {!hasItemsForBudget && (
                <p className="text-xs font-medium text-on-surface-variant/40 text-center">
                  Agregá tareas o materiales con precio para generar el presupuesto
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
