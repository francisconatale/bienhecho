import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, FileDown, Hammer, Wallet, CheckCircle, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound, useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { jobsService } from "@/services";
import { useBudgetPDF } from "@/hooks/use-budget-pdf";

import { ProgressBar } from "../[id]/components/progress-bar";
import { TaskList } from "../[id]/components/task-list";
import { useMaterials } from "../[id]/hooks/use-materials";
import { usePayments } from "../[id]/hooks/use-payments";
import { cn } from "@/lib/utils";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { MobilePageHeader } from "@/components/ui/mobile-page-header";
import { AuroraBackground } from "@/components/ui/aurora-background";
import dynamic from "next/dynamic";
import { useTrabajoDetail } from "../[id]/hooks/use-trabajo-detail";
import { JobSummaryCards } from "../[id]/components/job-summary-cards";
import { EmitPdfDialog } from "../[id]/components/emit-pdf-dialog";
import { JobHeader } from "../[id]/components/job-header";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

const TaskDetailPanel = dynamic(
  () => import("../[id]/components/task-detail-panel").then((m) => m.TaskDetailPanel),
  {
    ssr: false,
    loading: () => (
      <div className="bg-surface/60 backdrop-blur-xl rounded-2xl border border-outline-variant/15 p-6 shadow-sm">
        <div className="w-40 h-5 bg-outline-variant/10 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-outline-variant/10 animate-pulse" />
              <div className="flex-1 h-3 bg-outline-variant/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    ),
  }
);

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
  onEditingChange?: (isEditing: boolean) => void;
}) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { 
    job, 
    isLoadingJob, 
    client, 
    jobTasks, 
    cobros, 
    updateJobMutation, 
    addCobroMutation, 
    pdfError, 
    setPdfError, 
    showPdfDialog, 
    setShowPdfDialog, 
    generatingAction, 
    doGeneratePDF, 
    downloadPDF 
  } = useTrabajoDetail(id);

  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [headerHasChanges, setHeaderHasChanges] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => { setIsHeaderEditing(false); }, []);
  useEffect(() => {
    if (startEditing) {
      setIsHeaderEditing(true);
      onEditStarted?.();
    }
  }, [startEditing]);
  useEffect(() => { onEditingChange?.(isHeaderEditing); }, [isHeaderEditing]);

  const router = useRouter();
  const pathname = usePathname();
  const { popHistory, pushHistory } = useNavigationHistory();
  const from = searchParams.get("from");

  const taskParam = searchParams.get("task");
  const initialTaskHandled = useRef(false);
  useEffect(() => {
    if (initialTaskHandled.current) return;
    if (taskParam && jobTasks.some((t) => t.id === taskParam && t.trabajo_id === id)) {
      setSelectedTaskId(taskParam);
      initialTaskHandled.current = true;
      const params = new URLSearchParams(searchParams.toString());
      params.delete("task");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [taskParam, jobTasks, id, pathname, router, searchParams]);

  const { totalMateriales } = useMaterials(id);
  const [ConfirmDialog, confirm] = useConfirm();

  const handleDownloadPDF = () => {
    setPdfError(null);
    setShowPdfDialog(true);
  };

  const handleDeleteJob = useCallback(() => {
    if (!job) return;
    confirm({
      title: "Eliminar Trabajo",
      description: `¿Estás seguro de que querés eliminar el trabajo "${job.titulo}"? Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      variant: "danger",
      action: async () => {
        // jobsService is imported through useTrabajoDetail or directly. But here we don't need jobsService if we use deleteJobMutation. Actually we still need jobsService. Let me just use jobsService.delete(job.id) directly. 
        // Oh wait, I didn't export deleteJobMutation in useTrabajoDetail? I did, but I didn't extract it from the hook here. Let's just import jobsService if not present. It is not in imports since I removed it. I will restore it in a sec if needed, wait, I didn't remove it from imports, I removed the whole line.
        // Wait, the hook has deleteJobMutation, I'll use it or add it later. I will just leave the delete logic unchanged since it works but needs jobsService, which I might have removed. I'll add `import { jobsService } from "@/services"` at the top.
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

  // Expose delete handler for external calls via ref if needed, but we removed event bus.
  // Instead, the parent should trigger it or handle it.
  // We'll leave it attached to a known window function for legacy or use a ref,
  // but since we want to remove the event bus, we remove it completely.

  const handleEmitPresupuesto = useCallback(() => { doGeneratePDF(true); }, [doGeneratePDF]);
  const handleGuardarPdf = useCallback(() => { doGeneratePDF(false); }, [doGeneratePDF]);

  if (!job) {
    if (isLoadingJob) {
      return (
        <div className="flex-1 min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      );
    }
    if (isEmbedded) return null;
    notFound();
  }

  const totalEstimado = jobTasks.reduce((sum, t) => sum + (t.precio ?? 0), 0);
  const hasTasksWithPrice = jobTasks.some((t) => t.precio !== null);
  
  const presupuestoTotal = totalEstimado + totalMateriales;
  const hasItemsForBudget = hasTasksWithPrice || totalMateriales > 0;

  const backLabel = from === "/tareas" ? "Tareas" : from === "/clientes" && client ? client.nombre : "Trabajos";
  const backDest = from === "/tareas" ? "/tareas" : from === "/clientes" && client?.id ? `/clientes?clienteId=${client.id}` : "/trabajos";

  return (
    <div className={cn("relative w-full flex flex-col", isEmbedded ? "min-h-full h-full flex-1" : "min-h-screen")}>
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
                <JobSummaryCards jobId={job.id} from={from} pushHistory={pushHistory} />
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
                    disabled={addCobroMutation.isPending || updateJobMutation.isPending}
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
                    className="relative w-full py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.25em] transition-all duration-500 flex items-center justify-center gap-2 overflow-hidden z-10 group bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:shadow-[0_8px_20px_rgba(61,139,110,0.15)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {addCobroMutation.isPending || updateJobMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                    ) : (
                      <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
                    )}
                    {addCobroMutation.isPending || updateJobMutation.isPending ? "Procesando..." : "Marcar como Pagado"}
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

      <EmitPdfDialog
        show={showPdfDialog}
        onClose={() => setShowPdfDialog(false)}
        generatingAction={generatingAction}
        onGuardar={handleGuardarPdf}
        onEmitir={handleEmitPresupuesto}
      />
      <ConfirmDialog />
    </div>
  );
}
