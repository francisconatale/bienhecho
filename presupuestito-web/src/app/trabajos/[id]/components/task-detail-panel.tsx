"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, Pencil, Check, CalendarDays, ClipboardList, Flame } from "lucide-react";
import { useDataStore } from "@/lib/store";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import { MobilePageHeader } from "@/components/ui/mobile-page-header";
import { TaskPhotos } from "./task-photos";

interface TaskDetailPanelProps {
  jobId: string;
  taskId: string;
  onBack: () => void;
  backLabel?: string;
}

export function TaskDetailPanel({ jobId, taskId, onBack, backLabel }: TaskDetailPanelProps) {
  const { jobs, tasks, updateTask, visits, visitaTareas } = useDataStore();

  const job = jobs.find((j) => j.id === jobId);
  const task = tasks.find((t) => t.id === taskId && t.trabajo_id === jobId);

  const [isEditing, setIsEditing] = useState(false);
  const [descripcion, setDescripcion] = useState(task?.descripcion ?? "");
  const [precio, setPrecio] = useState(
    task?.precio !== null && task?.precio !== undefined ? String(task.precio) : ""
  );

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
    (task?.precio !== null && task?.precio !== undefined ? String(task.precio) : "") !== precio;

  const handleSave = () => {
    if (!task) return;
    updateTask(task.id, {
      descripcion: descripcion.trim(),
      precio: precio !== "" ? Number(precio) : null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!task) return;
    setDescripcion(task.descripcion);
    setPrecio(task.precio !== null ? String(task.precio) : "");
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
              <h1 className="text-4xl md:text-5xl font-black text-on-surface leading-[1.1] tracking-tighter cursor-default select-none flex-1">
                {task.descripcion}
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="hidden md:flex p-2 rounded-xl bg-on-surface/5 text-on-surface-variant/40 hover:text-primary hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100 active:scale-95 shrink-0"
                title="Editar tarea"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción de la tarea"
              rows={2}
              className="w-full bg-transparent border-b border-outline-variant/30 text-4xl md:text-5xl font-black text-on-surface leading-[1.1] tracking-tighter placeholder:text-on-surface-variant/25 outline-none focus:border-primary transition-all resize-none py-1"
              autoFocus
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            <button
              onClick={() => !isEditing && updateTask(task.id, { completada: !task.completada })}
              className={cn(
                "relative overflow-hidden p-5 rounded-xl text-left transition-[background-color,border-color,box-shadow] duration-500 flex flex-col gap-2 group select-none",
                task.completada
                  ? "bg-primary/10 hover:bg-primary/15 border border-primary/20 shadow-inner"
                  : "bg-surface/40 dark:bg-surface/10 hover:bg-surface/60 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-lg"
              )}
            >
              <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/50">
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
                  {task.completada && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                </div>
                <span className={cn(
                  "text-xl font-bold tracking-tight transition-colors duration-300",
                  task.completada ? "text-primary" : "text-on-surface group-hover:text-primary"
                )}>
                  {task.completada ? "Completada" : "En progreso"}
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                if (isEditing) return;
                const next = task.prioridad === "alta" ? "baja" : task.prioridad === "media" ? "alta" : "media";
                updateTask(task.id, { prioridad: next });
              }}
              className={cn(
                "relative overflow-hidden p-5 rounded-xl text-left transition-[background-color,border-color,box-shadow] duration-500 flex flex-col gap-2 group select-none",
                task.prioridad === "alta"
                  ? "bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/20 shadow-inner"
                  : task.prioridad === "media"
                  ? "bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 shadow-inner"
                  : "bg-surface/40 dark:bg-surface/10 hover:bg-surface/60 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-lg"
              )}
            >
              <span className={cn(
                "relative z-10 text-[10px] font-black uppercase tracking-[0.25em] transition-colors duration-300",
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
                  <Flame className={cn("w-4 h-4", task.prioridad === "alta" || task.prioridad === "media" ? "text-white" : "fill-current")} strokeWidth={task.prioridad === "alta" ? 3 : 2} />
                </div>
                <span className={cn(
                  "text-xl font-bold tracking-tight transition-colors duration-300 capitalize",
                  task.prioridad === "alta" ? "text-orange-500" : task.prioridad === "media" ? "text-amber-500" : "text-on-surface group-hover:text-orange-500"
                )}>
                  {task.prioridad || "Baja"}
                </span>
              </div>
            </button>

            <div className="relative overflow-hidden p-5 rounded-xl bg-surface dark:bg-surface/10 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col gap-2">
              <span className={cn(
                "relative z-10 text-[10px] font-black uppercase tracking-[0.25em]",
                task.precio !== null ? "text-primary/70" : "text-on-surface-variant/50"
              )}>
                {task.precio !== null ? "Línea Facturable" : "Costo / Nota"}
              </span>
              <div className="relative z-10 mt-1">
                {!isEditing ? (
                  <span className="text-2xl font-bold tracking-tight text-on-surface flex items-center gap-1.5 cursor-default select-none">
                    {task.precio !== null ? `$${task.precio.toLocaleString("es-AR")}` : "Sin costo"}
                  </span>
                ) : (
                  <div className="relative w-full max-w-[200px]">
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 text-lg font-bold text-on-surface-variant/40 pointer-events-none">
                      $
                    </span>
                    <input
                      type="number"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                      placeholder="0"
                      min={0}
                      className="w-full bg-transparent border-b-2 border-outline-variant/30 pl-6 pr-1 py-1 text-2xl font-bold text-on-surface outline-none focus:border-primary transition-all"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {taskProgresses.length > 0 && (
          <div className="relative bg-surface/80 rounded-xl p-6 border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-5 transition-shadow duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
            <div className="relative z-10 flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-on-surface-variant/50">
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
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">
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

        <div className="relative bg-surface/80 rounded-xl p-6 border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-6 transition-shadow duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-on-surface-variant/50">
              Fotos del trabajo
            </h3>
          </div>
          <div className="relative z-10">
            <TaskPhotos tareaId={task.id} />
          </div>
        </div>
      </main>
    </>
  );
}
