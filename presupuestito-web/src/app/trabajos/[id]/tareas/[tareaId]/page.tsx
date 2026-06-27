"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, Pencil, Check, CalendarDays, ClipboardList } from "lucide-react";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { MobilePageHeader } from "@/components/ui/mobile-page-header";
import { useDataStore } from "@/lib/store";
import { useClickOutside } from "@/hooks/use-click-outside";
import { TaskPhotos } from "../../components/task-photos";
import { cn } from "@/lib/utils";

interface TareaDetailPageProps {
  params: Promise<{ id: string; tareaId: string }>;
}

export default function TareaDetailPage({ params }: TareaDetailPageProps) {
  const { id, tareaId } = React.use(params);
  const searchParams = useSearchParams();
  const { jobs, tasks, updateTask, visits, visitaTareas } = useDataStore();

  const job = jobs.find((j) => j.id === id);
  const task = tasks.find((t) => t.id === tareaId && t.trabajo_id === id);

  if (!job || !task) {
    notFound();
  }

  const [isEditing, setIsEditing] = useState(false);
  const [descripcion, setDescripcion] = useState(task.descripcion);
  const [precio, setPrecio] = useState(
    task.precio !== null ? String(task.precio) : ""
  );

  const taskProgresses = visitaTareas
    .filter((vt) => vt.tarea_id === task.id)
    .map((vt) => ({
      ...vt,
      visita: visits.find((v) => v.id === vt.visita_id),
    }))
    .filter((vt) => vt.visita !== undefined)
    .sort((a, b) => new Date(b.visita!.fecha).getTime() - new Date(a.visita!.fecha).getTime());

  const hasChanges =
    descripcion !== task.descripcion ||
    (task.precio !== null ? String(task.precio) : "") !== precio;

  const handleSave = () => {
    updateTask(task.id, {
      descripcion: descripcion.trim(),
      precio: precio !== "" ? Number(precio) : null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
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

  const from = searchParams.get("from");
  const clienteId = searchParams.get("clienteId");
  const backHref = `/trabajos?id=${id}${from ? `&from=${from}${clienteId ? `&clienteId=${clienteId}` : ""}` : ""}`;

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

      {/* Mobile: back button + actions */}
      <MobilePageHeader
        backHref={backHref}
        isEditing={isEditing}
        hasChanges={hasChanges}
        onEditStart={() => setIsEditing(true)}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      <main className="relative flex-1 px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-4xl mx-auto w-full md:mt-0 space-y-6">
        {/* Desktop Breadcrumb */}
        <div className="hidden md:flex items-center mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant/60">
            <Link
              href={backHref}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver a {job.titulo}
            </Link>
          </div>
        </div>
        {/* Titular Principal / Edición */}
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

          {/* Intent Cards (Metadata Semántica) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {/* Estado Intent Card */}
            <button
              onClick={() => !isEditing && updateTask(task.id, { completada: !task.completada })}
              className={cn(
                "relative overflow-hidden p-5 rounded-[24px] text-left transition-all duration-500 flex flex-col gap-2 group select-none",
                task.completada
                  ? "bg-primary/10 hover:bg-primary/15 border border-primary/20 shadow-inner"
                  : "bg-surface/40 dark:bg-surface/10 hover:bg-surface/60 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-lg"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/50">
                Estado Actual
              </span>
              <div className="relative z-10 flex items-center gap-3 mt-1">
                <div
                  className={cn(
                    "w-7 h-7 rounded-[10px] border-[2.5px] flex items-center justify-center shrink-0 transition-all duration-300 group-active:scale-75",
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
                  {task.completada ? "Lista y finalizada" : "En progreso"}
                </span>
              </div>
            </button>

            {/* Price / Tipo Intent Card */}
            <div className="relative overflow-hidden p-5 rounded-[24px] bg-surface/40 dark:bg-surface/10 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col gap-2">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 pointer-events-none" />
              
              <span className={cn(
                "relative z-10 text-[10px] font-black uppercase tracking-[0.25em]",
                task.precio !== null ? "text-primary/70" : "text-on-surface-variant/50"
              )}>
                {task.precio !== null ? "Línea Facturable" : "Nota Descriptiva"}
              </span>
              
              <div className="relative z-10 mt-1">
                {!isEditing ? (
                  <span className="text-2xl font-bold tracking-tight text-on-surface flex items-center gap-1.5 cursor-default select-none">
                    {task.precio !== null ? `$${task.precio.toLocaleString("es-AR")}` : "Sin costo extra"}
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

        {/* Historial de Avance (Visitas) */}
        {taskProgresses.length > 0 && (
          <div className="relative bg-surface/30 dark:bg-surface/10 backdrop-blur-2xl rounded-[28px] p-6 border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-5 transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 dark:to-transparent pointer-events-none rounded-[28px]" />
            
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
                  className="group flex flex-col gap-2 p-4 bg-surface/40 dark:bg-surface/20 rounded-[20px] border border-white/10 dark:border-white/5 transition-all duration-300 hover:bg-surface/60"
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

        {/* Fotos - always visible */}
        <div className="relative bg-surface/30 dark:bg-surface/10 backdrop-blur-2xl rounded-[28px] p-6 border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-6 transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 dark:to-transparent pointer-events-none rounded-[28px]" />
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
    </div>
  );
}
