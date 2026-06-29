"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, FileDown, Hammer, Wallet, CheckCircle, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound, useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBudgetPDF } from "@/hooks/use-budget-pdf";
import { jobsService, clientsService, tasksService, cobrosService } from "@/services";
import { JobHeader } from "../[id]/components/job-header";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

import { ProgressBar } from "../[id]/components/progress-bar";
import { TaskList } from "../[id]/components/task-list";
import { useMaterials } from "../[id]/hooks/use-materials";
import { usePayments } from "../[id]/hooks/use-payments";
import { cn } from "@/lib/utils";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { MobilePageHeader } from "@/components/ui/mobile-page-header";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { TaskDetailPanel } from "../[id]/components/task-detail-panel";

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
  const queryClient = useQueryClient();
  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({ queryKey: ["jobs"], queryFn: jobsService.getAll });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: clientsService.getAll });
  const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: tasksService.getAll });
  const { data: cobros = [] } = useQuery({ queryKey: ["cobros", id], queryFn: () => cobrosService.getByJobId(id) });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => jobsService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  const addCobroMutation = useMutation({
    mutationFn: cobrosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cobros", id] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
  const { downloadPDF } = useBudgetPDF();
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [headerHasChanges, setHeaderHasChanges] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showPdfDialog, setShowPdfDialog] = useState(false);
  const pdfGeneratedRef = useRef(false);

  useEffect(() => { setIsHeaderEditing(false); }, []);
  useEffect(() => {
    if (startEditing) {
      setIsHeaderEditing(true);
      onEditStarted?.();
    }
  }, [startEditing]);
  useEffect(() => { onEditingChange?.(isHeaderEditing); }, [isHeaderEditing]);



  const router = useRouter();
  const { popHistory, pushHistory } = useNavigationHistory();
  const from = searchParams.get("from");

  const taskParam = searchParams.get("task");
  const initialTaskHandled = useRef(false);
  useEffect(() => {
    if (initialTaskHandled.current) return;
    if (taskParam && tasks.some((t) => t.id === taskParam && t.trabajo_id === id)) {
      setSelectedTaskId(taskParam);
      initialTaskHandled.current = true;
      const url = new URL(window.location.href);
      url.searchParams.delete("task");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [taskParam, tasks, id]);

  const { totalMateriales, materiales } = useMaterials(id);
  const { saldoPendiente } = usePayments(id);
  const [generatingAction, setGeneratingAction] = useState<"guardar" | "emitir" | null>(null);
  const [ConfirmDialog, confirm] = useConfirm();

  const handleDownloadPDF = () => {
    setPdfError(null);
    setShowPdfDialog(true);
  };

  const job = jobs.find((j) => j.id === id);

  const handleDeleteJob = useCallback(() => {
    if (!job) return;
    confirm({
      title: "Eliminar Trabajo",
      description: `¿Estás seguro de que querés eliminar el trabajo "${job.titulo}"? Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      variant: "danger",
      action: async () => {
        await jobsService.delete(job.id);
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        toast.success("Trabajo eliminado correctamente");
        if (isEmbedded && onBack) {
          onBack();
        } else {
          router.push("/trabajos");
        }
      }
    });
  }, [confirm, job, queryClient, router, isEmbedded, onBack]);

  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail === id) {
        handleDeleteJob();
      }
    };
    document.addEventListener("delete-job", handleEvent);
    return () => document.removeEventListener("delete-job", handleEvent);
  }, [id, handleDeleteJob]);

  const doGeneratePDF = useCallback(async (emitir: boolean) => {
    setGeneratingAction(emitir ? "emitir" : "guardar");
    const currentJob = jobs.find((j) => j.id === id);
    if (!currentJob) {
      setGeneratingAction(null);
      return;
    }
    try {
      downloadPDF(currentJob.id);
      if (emitir && currentJob.estado !== "presupuestado") {
        await updateJobMutation.mutateAsync({
          id: currentJob.id,
          data: { estado: "presupuestado" },
        });
      }
      setShowPdfDialog(false);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      setPdfError(error instanceof Error ? error.message : "Error al generar el PDF");
      setShowPdfDialog(false);
    } finally {
      setGeneratingAction(null);
    }
  }, [id, downloadPDF, updateJobMutation, jobs]);

  const handleEmitPresupuesto = useCallback(() => {
    doGeneratePDF(true);
  }, [doGeneratePDF]);

  const handleGuardarPdf = useCallback(() => {
    doGeneratePDF(false);
  }, [doGeneratePDF]);

  if (!job) {
    if (isLoadingJobs) {
      return (
        <div className="flex-1 min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      );
    }
    if (isEmbedded) return null;
    notFound();
  }

  const client = clients.find((c) => c.id === job.cliente_id);
  const jobTasks = tasks.filter((t) => t.trabajo_id === job.id);
  const totalEstimado = jobTasks.reduce((sum, t) => sum + (t.precio ?? 0), 0);
  const hasTasksWithPrice = jobTasks.some((t) => t.precio !== null);
  
  const presupuestoTotal = totalEstimado + totalMateriales;
  const hasItemsForBudget = hasTasksWithPrice || totalMateriales > 0;

  const backLabel = from === "/tareas" ? "Tareas" : from === "/clientes" && client ? client.nombre : "Trabajos";
  const backDest = from === "/tareas" ? "/tareas" : from === "/clientes" && client?.id ? `/clientes?clienteId=${client.id}` : "/trabajos";

  return (
    <div className={cn("relative w-full", isEmbedded ? "" : "min-h-screen")}>
      {!isEmbedded && (
        <>
          <AuroraBackground preset="trabajo" />

          {!selectedTaskId && (
            <MobilePageHeader
              onBack={() => router.push(popHistory(backDest))}
              isEditing={isHeaderEditing}
              hasChanges={headerHasChanges}
              onEditStart={job.estado !== "pagado" ? () => setIsHeaderEditing(true) : undefined}
              onCancel={() => setIsHeaderEditing(false)}
              onSave={() => {
                document.querySelector<HTMLButtonElement>('[data-job-header-save]')?.click();
              }}
            />
          )}
        </>
      )}

      {/* Task detail overlay (mobile) */}
      {selectedTaskId && (
        <div className="fixed inset-0 z-[60] bg-transparent overflow-y-auto md:hidden">
          <TaskDetailPanel
            jobId={job.id}
            taskId={selectedTaskId}
            onBack={() => setSelectedTaskId(null)}
          />
        </div>
      )}

      <main className={cn(
        "relative flex-1 w-full mx-auto",
        selectedTaskId
          ? "hidden md:block"
          : "",
        isEmbedded 
          ? "px-4 pt-28 pb-28 md:pt-6 md:px-8 max-w-full" 
          : "px-4 pt-28 pb-28 md:px-8 md:pt-8 md:pb-12 max-w-7xl md:mt-0"
      )}>
        <div className={cn(
          "grid items-start",
          selectedTaskId
            ? "grid-cols-1 lg:grid-cols-[1fr_260px] xl:grid-cols-[1fr_300px] gap-6 xl:gap-10"
            : "",
          isEmbedded
            ? "grid-cols-1 xl:grid-cols-1 2xl:grid-cols-[1fr_300px] gap-6"
            : "grid-cols-1 lg:grid-cols-[1fr_260px] xl:grid-cols-[1fr_300px] gap-6 xl:gap-10"
        )}>
          {/* Columna Principal */}
          <div className="space-y-4">
            {selectedTaskId ? (
              <>
                <TaskDetailPanel
                  jobId={job.id}
                  taskId={selectedTaskId}
                  onBack={() => setSelectedTaskId(null)}
                />
              </>
            ) : (
              <>
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
                      <button onClick={() => router.push(popHistory(backDest))} className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                        <ChevronLeft className="w-4 h-4" />
                        Volver a {backLabel}
                      </button>
                    )}
                  </div>
                </div>

                <JobHeader job={job} client={client} isEditing={isHeaderEditing} onEditingChange={setIsHeaderEditing} onHasChanges={setHeaderHasChanges} />
                
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href={`/trabajos/${job.id}/materiales${from ? `?from=${from}` : ""}`} 
                    onClick={() => pushHistory(window.location.pathname + window.location.search)}
                    className="group relative overflow-hidden bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl p-5 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:scale-[1.02] flex flex-col gap-2"
                  >
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

                  <Link 
                    href={`/trabajos/${job.id}/pagos`} 
                    onClick={() => pushHistory(window.location.pathname + window.location.search)}
                    className="group relative overflow-hidden bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl p-5 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:scale-[1.02] flex flex-col gap-2"
                  >
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


              </>
            )}
          </div>

          {/* Columna Secundaria (Sidebar Sticky en Desktop) */}
          {!selectedTaskId && (
            <div className={cn("space-y-4", isEmbedded ? "2xl:sticky 2xl:top-8" : "lg:sticky lg:top-32")}>
              <ProgressBar tasks={jobTasks} />
              
              <div className="relative overflow-hidden bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl p-5 border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-4 transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">

                <div className="relative flex flex-col gap-1 z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/50">
                    Total estimado
                  </span>
                  <span className="text-2xl font-bold text-on-surface tracking-tight mt-1">
                    ${presupuestoTotal.toLocaleString("es-AR")}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.1em] text-on-surface-variant/40 uppercase">
                    Tareas + Materiales
                  </span>

                  <div className="flex flex-col gap-0.5 mt-2 pt-2 border-t border-white/10">
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

                {job.estado === "borrador" ? (
                  <>
                    <button
                      onClick={handleDownloadPDF}
                      disabled={!hasItemsForBudget || generatingAction !== null}
                      className={cn(
                        "relative w-full py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.25em] transition-all duration-500 flex items-center justify-center gap-2 overflow-hidden z-10 group",
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
                  </>
                ) : (
                  <button
                    onClick={() => { setPdfError(null); downloadPDF(job.id); }}
                    disabled={generatingAction !== null}
                    className="relative w-full py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.25em] transition-all duration-500 flex items-center justify-center gap-2 overflow-hidden z-10 group bg-primary text-white shadow-[0_8px_20px_rgba(61,139,110,0.25)] hover:shadow-[0_16px_40px_rgba(61,139,110,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                    <FileDown className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" strokeWidth={2.5} />
                    Ver PDF
                  </button>
                )}
                {pdfError && (
                  <p className="text-xs font-medium text-red-500 text-center">
                    {pdfError}
                  </p>
                )}

                {job.estado === "presupuestado" && (
                  <button
                    onClick={async () => {
                      const totalCobrado = cobros.reduce((s, c) => s + c.monto_cobrado, 0);
                      const restante = Math.max(0, presupuestoTotal - totalCobrado);
                      if (restante > 0) {
                        await addCobroMutation.mutateAsync({
                          trabajo_id: job.id,
                          monto_cobrado: restante,
                          fecha_cobro: new Date().toISOString().slice(0, 10),
                          forma_pago: "transferencia",
                          notas: "Pagado manualmente",
                        });
                      }
                      // update job state is handled via trigger, but we can do it explicitly just in case
                      await updateJobMutation.mutateAsync({ id: job.id, data: { estado: "pagado" } });
                    }}
                    className="relative w-full py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.25em] transition-all duration-500 flex items-center justify-center gap-2 overflow-hidden z-10 group bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:shadow-[0_8px_20px_rgba(61,139,110,0.15)] active:scale-[0.98]"
                  >
                    <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
                    Marcar como Pagado
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {!selectedTaskId && (
          <div className="mt-8">
            <TaskList jobId={job.id} isJobPaid={job.estado === "pagado"} onSelectTask={setSelectedTaskId} />
          </div>
        )}
      </main>

      {showPdfDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowPdfDialog(false)}>
          <div className="bg-surface/90 dark:bg-surface/70 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.3)] max-w-sm w-full mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-on-surface">¿Emitir presupuesto?</h3>
              <button
                onClick={() => setShowPdfDialog(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-on-surface/10 text-on-surface-variant transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-on-surface-variant/70 leading-relaxed">
              Vas a generar el PDF del presupuesto para este trabajo. ¿Querés emitirlo formalmente o solo guardar el PDF?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleGuardarPdf}
                disabled={generatingAction !== null}
                className="flex-1 px-4 py-3 rounded-xl bg-on-surface/5 text-on-surface font-bold text-sm hover:bg-on-surface/10 transition-all active:scale-95 cursor-pointer flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {generatingAction === "guardar" && <Loader2 className="w-4 h-4 animate-spin" />}
                Solo guardar PDF
              </button>
              <button
                onClick={handleEmitPresupuesto}
                disabled={generatingAction !== null}
                className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all active:scale-95 shadow-[0_4px_12px_rgba(61,139,110,0.3)] cursor-pointer flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {generatingAction === "emitir" && <Loader2 className="w-4 h-4 animate-spin" />}
                Emitir
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog />
    </div>
  );
}
