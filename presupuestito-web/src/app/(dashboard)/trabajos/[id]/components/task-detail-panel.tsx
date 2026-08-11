"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, Pencil, Check, CalendarDays, ClipboardList, Flame, Loader2, Trash2 } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { jobsService_getById } from "@/actions/jobs.actions";
import { tasksService_getByJobId, tasksService_update, tasksService_delete } from "@/actions/tasks.actions";
import { visitsService_getAll, visitsService_getVisitaTareas } from "@/actions/visits.actions";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import { MobilePageHeader } from "@/components/ui/mobile-page-header";
import { TaskPhotos } from "./task-photos";
import { TareaDetailSkeleton } from "@/components/ui/skeletons";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

interface TaskDetailPanelProps {
  jobId: string;
  taskId: string;
  onBack: () => void;
  backLabel?: string;
  onDelete?: () => void;
}

export function TaskDetailPanel({ jobId, taskId, onBack, backLabel, onDelete }: TaskDetailPanelProps) {
  const { data: job, isLoading: isJobsLoading } = useQuery({ queryKey: ["jobs", jobId], queryFn: () => jobsService_getById(jobId) });
  const { data: tasks = [], isLoading: isTasksLoading } = useQuery({ queryKey: ["tasks", jobId], queryFn: () => tasksService_getByJobId(jobId) });
  const { data: visits = [], isLoading: isVisitsLoading } = useQuery({ queryKey: ["visits"], queryFn: visitsService_getAll });
  const { data: visitaTareas = [], isLoading: isVisitaTareasLoading } = useQuery({ queryKey: ["visitTasks"], queryFn: visitsService_getVisitaTareas });

  const isLoading = isJobsLoading || isTasksLoading || isVisitsLoading || isVisitaTareasLoading;

  const queryClient = useQueryClient();
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => tasksService_update(id, data),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(["tasks", jobId], (old: any[] | undefined) => {
        if (!old) return old;
        return old.map(t => t.id === updatedTask.id ? updatedTask : t);
      });
      queryClient.setQueryData(["tasks"], (old: any[] | undefined) => {
        if (!old) return old;
        return old.map(t => t.id === updatedTask.id ? updatedTask : t);
      });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const removeTaskMutation = useMutation({
    mutationFn: tasksService_delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Tarea eliminada");
      onDelete?.();
    },
  });

  const [ConfirmDialog, confirm] = useConfirm();

  const handleDelete = () => {
    if (!task) return;
    confirm({
      title: "Eliminar tarea",
      description: `¿Estás seguro de eliminar "${task.descripcion}"? Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      variant: "danger",
      action: async () => {
        await removeTaskMutation.mutateAsync(task.id);
      },
    });
  };

  const isTogglingComplete = updateTaskMutation.isPending && updateTaskMutation.variables?.data?.completada !== undefined;
  const isTogglingPriority = updateTaskMutation.isPending && updateTaskMutation.variables?.data?.prioridad !== undefined;

  const task = tasks.find((t) => t.id === taskId);

  const [isEditing, setIsEditing] = useState(false);
  const [descripcion, setDescripcion] = useState(task?.descripcion ?? "");
  const [cantidad, setCantidad] = useState(task?.cantidad ? String(task.cantidad) : "1");
  const [precioUnitario, setPrecioUnitario] = useState(
    task?.precio_unitario !== undefined && task?.precio_unitario !== null ? String(task.precio_unitario) : task?.precio !== null && task?.precio !== undefined ? String(task.precio) : ""
  );

  const cant = Number(cantidad) || 1;
  const pUnit = precioUnitario !== "" ? Number(precioUnitario) : null;
  const precioCalculado = pUnit !== null ? cant * pUnit : null;

  const taskProgresses = visitaTareas
    .filter((vt) => vt.tarea_id === taskId)
    .map((vt) => ({
      ...vt,
      visita: visits.find((v) => v.id === vt.visita_id),
    }))
    .filter((vt) => vt.visita !== undefined)
    .sort((a, b) => new Date(b.visita!.fecha).getTime() - new Date(a.visita!.fecha).getTime());

  const hasChanges =
    descripcion !== (task?.descripcion ?? "") ||
    (task?.cantidad ? String(task.cantidad) : "1") !== cantidad ||
    (task?.precio_unitario !== undefined && task?.precio_unitario !== null ? String(task.precio_unitario) : task?.precio !== null && task?.precio !== undefined ? String(task.precio) : "") !== precioUnitario;

  const handleSave = async () => {
    if (!task) return;
    await updateTaskMutation.mutateAsync({
      id: task.id,
      data: {
        descripcion: descripcion.trim(),
        cantidad: cant,
        precio_unitario: pUnit !== null ? pUnit : undefined,
        precio: precioCalculado,
      }
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!task) return;
    setDescripcion(task.descripcion);
    setCantidad(task.cantidad ? String(task.cantidad) : "1");
    setPrecioUnitario(task.precio_unitario !== undefined && task.precio_unitario !== null ? String(task.precio_unitario) : task.precio !== null ? String(task.precio) : "");
    setIsEditing(false);
  };

  const editRef = useRef<HTMLDivElement>(null);
  useClickOutside(editRef, () => {
    if (isEditing) {
      if (hasChanges) {
        handleSave();
      } else {
        handleCancel();
      }
    }
  });

  if (isLoading) return <TareaDetailSkeleton />;
  if (!job || !task) return null;

  return (
    <>
      {/* Mobile: header with back */}
      <div className="md:hidden">
        <MobilePageHeader
          onBack={onBack}
          isEditing={isEditing}
          hasChanges={hasChanges}
          onEditStart={() => setIsEditing(true)}
          onCancel={handleCancel}
          onSave={handleSave}
          onDelete={onDelete ? handleDelete : undefined}
        />
      </div>

      <main className="relative flex-1 px-4 pt-28 pb-24 space-y-6 max-w-4xl mx-auto w-full">
        {/* Desktop Breadcrumb */}
        <div className="hidden md:flex items-center mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant/60">
            <button
              onClick={onBack}
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver a {backLabel ?? job.titulo}
            </button>
          </div>
        </div>

        <div ref={editRef} className="space-y-4">
          {!isEditing ? (
            <div className="group flex items-start justify-between gap-4">
              <h1 className="text-xl md:text-5xl font-black text-on-surface leading-[1.1] tracking-tighter cursor-default select-none flex-1">
                {task.descripcion}
              </h1>
              <div className="hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-xl bg-on-surface/5 text-on-surface-variant/40 hover:text-primary hover:bg-primary/10 transition-colors active:scale-95"
                  title="Editar tarea"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-xl bg-on-surface/5 text-on-surface-variant/40 hover:text-red-500 hover:bg-red-500/10 transition-colors active:scale-95"
                    title="Eliminar tarea"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción de la tarea"
              rows={2}
              className="w-full bg-transparent border-b border-outline-variant/30 text-2xl md:text-5xl font-black text-on-surface leading-[1.1] tracking-tighter placeholder:text-on-surface-variant/25 outline-none focus:border-primary transition-colors resize-none py-1"
              autoFocus
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-8">
            <button
              onClick={() => !isEditing && !isTogglingComplete && updateTaskMutation.mutateAsync({ id: task.id, data: { completada: !task.completada }})}
              disabled={isTogglingComplete}
              className={cn(
                "relative overflow-hidden p-4 md:p-5 rounded-xl text-left transition-[background-color,border-color,box-shadow] duration-300 flex flex-col gap-2 group select-none",
                task.completada
                  ? "bg-primary/10 hover:bg-primary/15 border border-primary/20 shadow-inner"
                  : "bg-surface/40 dark:bg-surface/10 hover:bg-surface/60 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-lg",
                isTogglingComplete && "opacity-70 cursor-wait"
              )}
            >
              <span className="relative z-10 text-[11px] font-bold text-on-surface-variant/50">
                Estado Actual
              </span>
              <div className="relative z-10 flex items-center gap-3 mt-1">
                <div
                  className={cn(
                    "w-7 h-7 rounded-[10px] border-[2.5px] flex items-center justify-center shrink-0 transition-[background-color,border-color,box-shadow] duration-300 group-active:scale-75",
                    task.completada
                      ? "bg-primary border-primary shadow-[0_0_16px_rgba(61,139,110,0.4)]"
                      : "border-outline-variant/30 group-hover:border-primary/50 bg-surface/50"
                  )}
                >
                  {isTogglingComplete
                    ? <Loader2 className={cn("w-4 h-4 animate-spin", task.completada ? "text-white" : "text-primary")} strokeWidth={3} />
                    : task.completada
                      ? <Check className="w-4 h-4 text-white" strokeWidth={4} />
                      : null
                  }
                </div>
                <span className={cn(
                  "text-sm md:text-xl font-bold tracking-tight transition-colors duration-300",
                  task.completada ? "text-primary" : "text-on-surface group-hover:text-primary"
                )}>
                  {task.completada ? "Completada" : "En progreso"}
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                if (isEditing || isTogglingPriority) return;
                const next = task.prioridad === "alta" ? "baja" : task.prioridad === "media" ? "alta" : "media";
                updateTaskMutation.mutateAsync({ id: task.id, data: { prioridad: next }});
              }}
              disabled={isTogglingPriority}
              className={cn(
                "relative overflow-hidden p-4 md:p-5 rounded-xl text-left transition-[background-color,border-color,box-shadow] duration-300 flex flex-col gap-2 group select-none",
                task.prioridad === "alta"
                  ? "bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/20 shadow-inner"
                  : task.prioridad === "media"
                  ? "bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 shadow-inner"
                  : "bg-surface/40 dark:bg-surface/10 hover:bg-surface/60 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-lg",
                isTogglingPriority && "opacity-70 cursor-wait"
              )}
            >
              <span className={cn(
                "relative z-10 text-[11px] font-bold transition-colors duration-300",
                task.prioridad === "alta" ? "text-orange-500/70" : task.prioridad === "media" ? "text-amber-500/70" : "text-on-surface-variant/50"
              )}>
                Prioridad
              </span>
              <div className="relative z-10 flex items-center gap-3 mt-1">
                <div
                  className={cn(
                    "w-7 h-7 rounded-[10px] border-[2.5px] flex items-center justify-center shrink-0 transition-all duration-300 group-active:scale-75",
                    task.prioridad === "alta"
                      ? "bg-orange-500 border-orange-500 shadow-[0_0_16px_rgba(249,115,22,0.4)]"
                      : task.prioridad === "media"
                      ? "bg-amber-500 border-amber-500 shadow-[0_0_16px_rgba(245,158,11,0.4)]"
                      : "border-outline-variant/30 group-hover:border-orange-500/50 bg-surface/50 text-on-surface-variant/30 group-hover:text-orange-500/50"
                  )}
                >
                  {isTogglingPriority
                    ? <Loader2 className={cn("w-4 h-4 animate-spin", task.prioridad ? "text-white" : "text-orange-500/50")} strokeWidth={3} />
                    : <Flame className={cn("w-4 h-4", task.prioridad === "alta" || task.prioridad === "media" ? "text-white" : "fill-current")} strokeWidth={task.prioridad === "alta" ? 3 : 2} />
                  }
                </div>
                <span className={cn(
                  "text-sm md:text-xl font-bold tracking-tight transition-colors duration-300 capitalize",
                  task.prioridad === "alta" ? "text-orange-500" : task.prioridad === "media" ? "text-amber-500" : "text-on-surface group-hover:text-orange-500"
                )}>
                  {task.prioridad || "Baja"}
                </span>
              </div>
            </button>

            <div className="relative overflow-hidden p-4 md:p-5 rounded-xl bg-surface dark:bg-surface/10 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col gap-2">
              <span className={cn(
                "relative z-10 text-[11px] font-bold",
                task.precio !== null ? "text-primary/70" : "text-on-surface-variant/50"
              )}>
                {task.precio !== null ? "Línea Facturable" : "Costo / Nota"}
              </span>
              <div className="relative z-10 mt-1">
                {!isEditing ? (
                  <div className="flex flex-col">
                    {task.cantidad && task.precio_unitario && (
                      <span className="text-xs font-medium text-on-surface-variant/70">
                        {task.cantidad} x ${task.precio_unitario.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                      </span>
                    )}
                    <span className="text-base md:text-2xl font-bold tracking-tight text-on-surface flex items-center gap-1.5 cursor-default select-none">
                      {task.precio !== null ? `$${task.precio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}` : "Sin costo"}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[11px] font-bold text-on-surface-variant/50 block mb-1">Cant.</label>
                        <input
                          type="number"
                          inputMode="decimal"
                          aria-label="Cantidad"
                          value={cantidad}
                          onChange={(e) => setCantidad(e.target.value)}
                          className="w-full bg-transparent border-b-2 border-outline-variant/30 py-1 text-lg font-bold text-on-surface outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="flex-1 relative">
                        <label className="text-[11px] font-bold text-on-surface-variant/50 block mb-1">P. Unit.</label>
                        <span className="absolute left-0 bottom-2 text-sm font-bold text-on-surface-variant/40 pointer-events-none">$</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          aria-label="Precio unitario"
                          value={precioUnitario}
                          onChange={(e) => setPrecioUnitario(e.target.value)}
                          className="w-full bg-transparent border-b-2 border-outline-variant/30 pl-4 py-1 text-lg font-bold text-on-surface outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    {precioCalculado !== null && (
                      <div className="text-right text-xs font-bold text-primary mt-1">
                        Total: ${precioCalculado.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {taskProgresses.length > 0 && (
          <div className="relative bg-surface/80 rounded-xl p-6 border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-5 transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
            <div className="relative z-10 flex items-center justify-between">
              <h3 className="text-xs font-bold text-on-surface-variant/50">
                Historial de Avance
              </h3>
              <ClipboardList className="w-4 h-4 text-on-surface-variant/40" strokeWidth={2.5} />
            </div>
            <div className="relative z-10 space-y-3 cursor-default select-none">
              {taskProgresses.map((progress, idx) => (
                <div
                  key={`${progress.visita_id}-${idx}`}
                  className="group flex flex-col gap-2 p-4 bg-surface dark:bg-surface/20 rounded-xl border border-white/10 dark:border-white/5 transition-colors duration-300 hover:bg-surface/60"
                >
                  <div className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant/50">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(progress.visita!.fecha).toLocaleDateString('es-AR', {
                      weekday: 'long', day: 'numeric', month: 'short'
                    })}
                  </div>
                  <p className="text-sm font-semibold text-on-surface leading-snug">
                    {progress.nota_progreso || "Sin nota específica registrada en esta visita."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="relative bg-surface/80 rounded-xl p-6 border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-6 transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">

          <div className="relative z-10">
            <TaskPhotos tareaId={task.id} />
          </div>
        </div>
      </main>
      <ConfirmDialog />
    </>
  );
}
