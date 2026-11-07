import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, FileDown, Hammer, Wallet, CheckCircle, X, Loader2, Palette } from "lucide-react";
import Link from "next/link";
import { notFound, useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { jobsService_delete } from "@/actions/jobs.actions";
import { useProfile } from "@/hooks/use-profile";
import { getPublicLogoUrl } from "@/lib/storage-utils";
import type { PDFData } from "@/lib/pdf/generate-budget";
import type { PDFParams } from "@/lib/pdf/types";
import dynamic from "next/dynamic";

const PDFPreviewModal = dynamic(
  () => import("@/components/budgets/PDFPreviewModal").then((m) => ({ default: m.PDFPreviewModal })),
  { ssr: false }
);

import { ProgressBar } from "../[id]/components/progress-bar";
import { TaskList } from "../[id]/components/task-list";
import { useMaterials } from "../[id]/hooks/use-materials";
import { usePayments } from "../[id]/hooks/use-payments";
import { cn } from "@/lib/utils";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { MobilePageHeader } from "@/components/ui/mobile-page-header";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { TrabajoDetailSkeleton } from "@/components/ui/skeletons";
import { useTrabajoDetail } from "../[id]/hooks/use-trabajo-detail";
import { JobSummaryCards } from "../[id]/components/job-summary-cards";
import { EmitPdfDialog } from "../[id]/components/emit-pdf-dialog";
import { JobHeader } from "../[id]/components/job-header";
import { MaterialList } from "../[id]/components/material-list";
import { PaymentsDashboard } from "../[id]/components/payments-dashboard";
import { useConfirm } from "@/hooks/use-confirm";

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
    isLoadingTasks, 
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

  const { profile } = useProfile();

  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<PDFData | null>(null);
  const [pdfDownloading, setPdfDownloading] = useState(false);
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
  const viewParam = searchParams.get("view"); // "materiales" | "pagos"
  
  useEffect(() => {
    if (taskParam && jobTasks.some((t) => t.id === taskParam && t.trabajo_id === id)) {
      setSelectedTaskId(taskParam);
    } else if (!taskParam) {
      setSelectedTaskId(null);
    }
  }, [taskParam, jobTasks, id]);

  const handleViewClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("view");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleTaskSelect = (taskId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("task", taskId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleTaskClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("task");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const { materiales: jobMateriales, totalMateriales, isLoading: isLoadingMateriales } = useMaterials(id);
  const [ConfirmDialog, confirm] = useConfirm();

  const handleDownloadPDF = () => {
    setPdfError(null);
    setShowPdfDialog(true);
  };

  const handlePersonalizarPDF = () => {
    if (!job || !client) {
      setPdfError("Trabajo o cliente no encontrado");
      return;
    }
    const jobTasksWithPrice = jobTasks
      .filter((t) => t.precio !== null)
      .sort((a, b) => a.orden - b.orden);
    if (jobTasksWithPrice.length === 0 && jobMateriales.length === 0) {
      setPdfError("No hay tareas con precio ni materiales para generar el presupuesto");
      return;
    }
    const data: PDFData = {
      client,
      job,
      tasks: jobTasksWithPrice,
      materiales: jobMateriales,
      userProfile: {
        name: profile?.nombre || "Prestador de Servicios",
        company: profile?.nombre || "Mi Empresa",
        address: profile?.direccion || "Domicilio Comercial S/D",
        cuit: profile?.cuit || undefined,
        matricula: profile?.matricula,
        trade: job.titulo || profile?.rubro || "Servicios Profesionales",
        logo_url: profile?.logo_path ? getPublicLogoUrl(profile.logo_path) : undefined,
      },
    };
    setPreviewData(data);
    setShowPreviewModal(true);
  };

  const handleDownloadWithParams = useCallback(async (params: PDFParams) => {
    setPdfDownloading(true);
    try {
      await downloadPDF(id, params);
    } finally {
      setPdfDownloading(false);
    }
    setShowPreviewModal(false);
    setPreviewData(null);
  }, [id, downloadPDF]);

  const handleVerPDF = useCallback(async () => {
    setPdfError(null);
    setPdfDownloading(true);
    try {
      await downloadPDF(job.id);
    } finally {
      setPdfDownloading(false);
    }
  }, [job, downloadPDF]);

  const handleDeleteJob = useCallback(() => {
    if (!job) return;
    confirm({
      title: "Eliminar Trabajo",
      description: `¿Estás seguro de que querés eliminar el trabajo "${job.titulo}"? Todas sus tareas, visitas y materiales se borrarán, pero los cobros y transacciones registrados se conservarán.`,
      confirmText: "Eliminar",
      variant: "danger",
      action: async () => {
        await jobsService_delete(job.id);
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        if (isEmbedded && onBack) {
          onBack();
        } else {
          router.push("/trabajos");
        }
      }
    });
  }, [confirm, job, queryClient, router, isEmbedded, onBack]);

  useEffect(() => {
    const handleCustomDelete = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail === job?.id) {
        handleDeleteJob();
      }
    };
    document.addEventListener("delete-job", handleCustomDelete);
    return () => document.removeEventListener("delete-job", handleCustomDelete);
  }, [job?.id, handleDeleteJob]);

  const handleEmitPresupuesto = useCallback(() => { doGeneratePDF(true); }, [doGeneratePDF]);
  const handleGuardarPdf = useCallback(() => { doGeneratePDF(false); }, [doGeneratePDF]);

  if (!job) {
    if (isLoadingJob) {
      return <TrabajoDetailSkeleton isEmbedded={isEmbedded} />;
    }
    if (isEmbedded) return null;
    notFound();
  }

  const totalEstimado = jobTasks.reduce((sum, t) => sum + (t.precio ?? 0), 0);
  const hasTasksWithPrice = jobTasks.some((t) => t.precio !== null);

  const presupuestoTotal = job.total_estimado ?? 0;
  const hasItemsForBudget = hasTasksWithPrice || totalMateriales > 0;

  const backLabel = from === "/tareas" ? "Tareas" : from === "/clientes" && client ? client.nombre : "Trabajos";
  const backDest = from === "/tareas" ? "/tareas" : from === "/clientes" && client?.id ? `/clientes?clienteId=${client.id}` : "/trabajos";

  return (
    <div className={cn("relative w-full flex flex-col", isEmbedded ? "min-h-full h-full flex-1" : "min-h-screen")}>
      {!isEmbedded && (
        <>
          <AuroraBackground preset="trabajo" />
        </>
      )}
      
      {/* Show Aurora on mobile even if embedded in MasterDetail */}
      {isEmbedded && (
        <AuroraBackground preset="trabajo" className="md:hidden" />
      )}

      {!isEmbedded && !selectedTaskId && (
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

      {/* Task detail overlay (mobile) */}
      {selectedTaskId && (
        <div className="fixed inset-0 z-[60] bg-transparent overflow-y-auto md:hidden">
          <TaskDetailPanel
            jobId={job.id}
            taskId={selectedTaskId}
            onBack={handleTaskClose}
            onDelete={handleTaskClose}
          />
        </div>
      )}
      {/* View overlays (mobile) */}
      {!selectedTaskId && viewParam && (
        <div className="fixed inset-0 z-[60] bg-transparent overflow-y-auto md:hidden pt-28 px-4 pb-8">
          <MobilePageHeader 
            onBack={handleViewClose} 
            isEditing={false} 
            onCancel={() => {}} 
            onSave={() => {}} 
          />
          <div className="mt-2 mb-6">
            <h2 className="text-2xl font-black text-on-surface tracking-tight">
              {viewParam === "materiales" ? "Materiales" : "Cuentas a Cobrar"}
            </h2>
          </div>
          {viewParam === "materiales" && <MaterialList jobId={job.id} />}
          {viewParam === "pagos" && <PaymentsDashboard jobId={job.id} />}
        </div>
      )}

      <main className={cn(
        "relative flex-1 w-full mx-auto",
        (selectedTaskId || viewParam) ? "hidden md:block" : "",
        isEmbedded 
          ? "px-4 pt-28 pb-28 md:pt-6 md:px-8 max-w-full" 
          : "px-4 pt-28 pb-28 md:px-8 md:pt-8 md:pb-12 max-w-[1400px] md:mt-0"
      )}>
        <div className={cn(
          "w-full",
          (selectedTaskId || viewParam) ? "lg:grid lg:grid-cols-[1fr_260px] xl:grid-cols-[1fr_300px] lg:gap-6 xl:gap-10 lg:items-start" : "lg:grid lg:items-start",
          (!selectedTaskId && !viewParam) && (isEmbedded
            ? "xl:flex xl:flex-col 2xl:grid 2xl:grid-cols-[1fr_300px] gap-6"
            : "lg:grid-cols-[1fr_260px] xl:grid-cols-[1fr_300px] lg:gap-6 xl:gap-10")
        )}>
          {selectedTaskId ? (
            <div className="order-1 lg:col-start-1">
              <TaskDetailPanel
                jobId={job.id}
                taskId={selectedTaskId}
                onBack={handleTaskClose}
                onDelete={handleTaskClose}
              />
            </div>
          ) : viewParam === "materiales" ? (
            <div className="order-1 lg:col-start-1 space-y-6">
              <div className="hidden md:flex items-center gap-2 text-sm font-medium text-on-surface-variant/60">
                <button onClick={handleViewClose} className="flex items-center gap-1 hover:text-primary transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Volver al trabajo
                </button>
              </div>
              <div>
                <h2 className="text-display text-on-surface mb-2">Materiales</h2>
                <p className="text-sm font-medium text-on-surface-variant/60">Gestión de materiales e insumos</p>
              </div>
              <MaterialList jobId={job.id} />
            </div>
          ) : viewParam === "pagos" ? (
            <div className="order-1 lg:col-start-1 space-y-6">
              <div className="hidden md:flex items-center gap-2 text-sm font-medium text-on-surface-variant/60">
                <button onClick={handleViewClose} className="flex items-center gap-1 hover:text-primary transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Volver al trabajo
                </button>
              </div>
              <div>
                <h2 className="text-display text-on-surface mb-2">Cuentas a Cobrar</h2>
                <p className="text-sm font-medium text-on-surface-variant/60">Gestión de saldo pendiente y cobros recibidos</p>
              </div>
              <PaymentsDashboard jobId={job.id} />
            </div>
          ) : (
            <>
              {/* Item 1: Desktop Breadcrumb & JobHeader (Left column on desktop, 1st on mobile) */}
              <div className="order-1 lg:col-start-1 space-y-4">
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
              </div>

              {/* Item 2: Sidebar / Totals (Right column on desktop, 2nd on mobile) */}
              <div className={cn(
                "order-2 lg:col-start-2 lg:row-span-4", 
                isEmbedded ? "2xl:sticky 2xl:top-8" : "lg:sticky lg:top-32"
              )}>
                <div className="relative overflow-hidden bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                  
                  {/* Progress Section */}
                  <div className="p-4 md:p-5 flex flex-col gap-3">
                    <div className="flex items-end justify-between">
                      <h3 className="text-xs font-semibold text-on-surface-variant/70">Progreso</h3>
                      {isLoadingTasks ? (
                        <span className="w-20 h-4 bg-outline-variant/10 rounded animate-pulse" />
                      ) : (
                        <span className="text-xs font-bold text-on-surface-variant/50">
                          {jobTasks.filter(t => t.completada).length} / {jobTasks.length} completadas
                        </span>
                      )}
                    </div>
                    
                    {isLoadingTasks ? (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-outline-variant/10 rounded-full animate-pulse" />
                        <span className="w-8 h-4 bg-outline-variant/10 rounded animate-pulse" />
                      </div>
                    ) : (
                      (() => {
                        const total = jobTasks.length;
                        const completed = jobTasks.filter((t) => t.completada).length;
                        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
                        
                        return (
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-3 bg-on-surface/5 dark:bg-black/20 rounded-full overflow-hidden relative">
                              <div className="absolute top-0 left-0 h-full bg-primary transition-[width] duration-[600ms] ease-out" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-xs font-bold text-on-surface w-8 text-right">{percentage}%</span>
                          </div>
                        );
                      })()
                    )}
                  </div>

                  <div className="h-px w-full bg-outline-variant/10" />

                  {/* Total Section */}
                  <div className="p-4 md:p-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-on-surface-variant/70">
                        Total estimado
                      </span>
                      <span className="text-[28px] leading-none font-bold text-on-surface tracking-tight mt-1">
                        ${presupuestoTotal.toLocaleString("es-AR")}
                      </span>
                      
                      <div className="flex flex-col gap-1 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-on-surface-variant/70">Tareas</span>
                          {isLoadingTasks ? (
                            <span className="w-16 h-4 bg-outline-variant/10 rounded animate-pulse" />
                          ) : (
                            <span className="text-xs font-bold text-on-surface">${totalEstimado.toLocaleString("es-AR")}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-on-surface-variant/70">Materiales</span>
                          {isLoadingMateriales ? (
                            <span className="w-16 h-4 bg-outline-variant/10 rounded animate-pulse" />
                          ) : (
                            <span className="text-xs font-bold text-on-surface">${totalMateriales.toLocaleString("es-AR")}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      {job.estado === "borrador" ? (
                        <>
                          <button
                            onClick={handleDownloadPDF}
                            disabled={!hasItemsForBudget || generatingAction !== null}
                            className={cn(
                              "w-full py-3.5 rounded-xl font-bold text-[13px] transition-[background-color,transform] duration-200 ease-spring flex items-center justify-center gap-2",
                              hasItemsForBudget
                                ? "bg-primary text-white hover:bg-primary-dark active:scale-[0.96] ease-spring shadow-sm"
                                : "bg-surface-variant text-on-surface-variant/70 cursor-not-allowed"
                            )}
                          >
                            <FileDown className="w-4 h-4" strokeWidth={2.5} />
                            Generar Presupuesto
                          </button>
                          <button
                            onClick={handlePersonalizarPDF}
                            disabled={!hasItemsForBudget || generatingAction !== null}
                            className="w-full py-3 rounded-xl font-bold text-[12px] transition-[background-color,transform] duration-200 ease-spring flex items-center justify-center gap-2 bg-on-surface/5 text-on-surface-variant hover:bg-on-surface/10 active:scale-[0.96] ease-spring cursor-pointer mt-2"
                          >
                            <Palette className="w-3.5 h-3.5" strokeWidth={2.5} />
                            Personalizar PDF
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={handleVerPDF}
                            disabled={generatingAction !== null || pdfDownloading}
                            className="w-full py-3.5 rounded-xl font-bold text-[13px] transition-[background-color,transform] duration-200 ease-spring flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-dark active:scale-[0.96] ease-spring shadow-sm"
                          >
                            {pdfDownloading ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} /> : <FileDown className="w-4 h-4" strokeWidth={2.5} />}
                            {pdfDownloading ? "Generando..." : "Ver PDF"}
                          </button>
                          <button
                            onClick={handlePersonalizarPDF}
                            className="w-full py-3 rounded-xl font-bold text-[12px] transition-[background-color,transform] duration-200 ease-spring flex items-center justify-center gap-2 bg-on-surface/5 text-on-surface-variant hover:bg-on-surface/10 active:scale-[0.96] ease-spring cursor-pointer"
                          >
                            <Palette className="w-3.5 h-3.5" strokeWidth={2.5} />
                            Personalizar PDF
                          </button>
                        </div>
                      )}
                      
                      {pdfError && (
                        <p className="text-xs font-medium text-red-500 text-center mt-2">
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
                            await updateJobMutation.mutateAsync({ id: job.id, data: { estado: "pagado" } });
                          }}
                          className="mt-3 w-full py-3.5 rounded-xl font-bold text-[13px] transition-[background-color,transform] duration-200 ease-spring flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 active:scale-[0.96] ease-spring disabled:opacity-50"
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
                </div>
              </div>

              {/* Item 3: Summary Cards (Left column on desktop, 3rd on mobile) */}
              <div className="order-3 lg:col-start-1 mt-0 md:mt-2">
                <JobSummaryCards jobId={job.id} from={from} pushHistory={pushHistory} />
              </div>

              {/* Item 4: Task List (Left column on desktop, 4th on mobile) */}
              <div className="order-4 lg:col-start-1 mt-1 md:mt-4">
                <TaskList jobId={job.id} isJobPaid={job.estado === "pagado"} onSelectTask={handleTaskSelect} />
              </div>
            </>
          )}
        </div>
      </main>

      <EmitPdfDialog
        show={showPdfDialog}
        onClose={() => setShowPdfDialog(false)}
        generatingAction={generatingAction}
        onGuardar={handleGuardarPdf}
        onEmitir={handleEmitPresupuesto}
      />
      {showPreviewModal && previewData && (
        <PDFPreviewModal
          data={previewData}
          onCancel={() => { setShowPreviewModal(false); setPreviewData(null); }}
          onDownload={handleDownloadWithParams}
          loading={pdfDownloading}
        />
      )}
      <ConfirmDialog />
    </div>
  );
}
