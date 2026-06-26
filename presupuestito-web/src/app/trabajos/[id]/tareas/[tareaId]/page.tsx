"use client";

import React, { useState } from "react";
import { ChevronLeft, Save, Pencil, X, Check } from "lucide-react";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { useDataStore } from "@/lib/store";
import { Header } from "@/components/layout/header";
import { TaskPhotos } from "../../components/task-photos";
import { cn } from "@/lib/utils";

interface TareaDetailPageProps {
  params: Promise<{ id: string; tareaId: string }>;
}

export default function TareaDetailPage({ params }: TareaDetailPageProps) {
  const { id, tareaId } = React.use(params);
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const clienteId = searchParams.get("clienteId");
  const { jobs, tasks, updateTask } = useDataStore();

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

  const leftAction = (
    <Link href={from === "tareas" ? "/tareas" : from && clienteId ? `/trabajos/${id}?from=${from}&clienteId=${clienteId}` : `/trabajos/${id}`}>
      <button
        aria-label="Volver"
        className="w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-95"
      >
        <ChevronLeft className="w-6 h-6 text-on-surface" />
      </button>
    </Link>
  );

  const rightAction = isEditing ? (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCancel}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-on-surface/10 text-on-surface-variant transition-all active:scale-95"
      >
        <X className="w-5 h-5" />
      </button>
      <button
        onClick={handleSave}
        disabled={!hasChanges}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95",
          hasChanges
            ? "bg-primary text-white shadow-md hover:bg-primary-dark"
            : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
        )}
      >
        <Save className="w-4 h-4" />
      </button>
    </div>
  ) : (
    <button
      onClick={() => setIsEditing(true)}
      className="w-10 h-10 rounded-full flex items-center justify-center bg-on-surface/5 hover:bg-on-surface/10 transition-all active:scale-95"
      title="Editar tarea"
    >
      <Pencil className="w-4 h-4 text-on-surface" />
    </button>
  );

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

      <div className="md:hidden">
        <Header
          title="Tarea"
          leftAction={leftAction}
          rightAction={rightAction}
          actionContainerClassName="flex items-center shrink-0 w-auto min-w-[40px]"
        />
      </div>

      <main className="relative flex-1 px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-4xl mx-auto w-full mt-20 md:mt-0 space-y-6">
        {/* Desktop Breadcrumb & Actions */}
        <div className="hidden md:flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant/60">
            <Link 
              href={from === "tareas" ? "/tareas" : from && clienteId ? `/trabajos/${id}?from=${from}&clienteId=${clienteId}` : `/trabajos/${id}`}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver a {job.titulo}
            </Link>
          </div>
          <div>{rightAction}</div>
        </div>
        {/* Titular Principal / Edición */}
        <div className="space-y-4">
          {!isEditing ? (
            <h1 className="text-2xl md:text-3xl font-black text-on-surface leading-tight tracking-tight">
              {task.descripcion}
            </h1>
          ) : (
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción de la tarea"
              rows={2}
              className="w-full bg-surface border border-outline-variant/20 rounded-2xl px-4 py-3 text-xl font-black text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              autoFocus
            />
          )}

          {/* Metadata Chips (Estado, Precio) */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => !isEditing && updateTask(task.id, { completada: !task.completada })}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                task.completada
                  ? "bg-green-500/15 text-green-600 dark:text-green-400"
                  : "bg-on-surface/5 text-on-surface hover:bg-on-surface/10"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all",
                  task.completada
                    ? "bg-green-500 border-green-500"
                    : "border-on-surface-variant/40"
                )}
              >
                {task.completada && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
              {task.completada ? "Completada" : "Pendiente"}
            </button>

            {!isEditing ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-on-surface/5 text-xs font-bold text-on-surface">
                {task.precio !== null ? `$${task.precio.toLocaleString("es-AR")}` : "Sin precio"}
              </div>
            ) : (
              <div className="relative w-32">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant/40 pointer-events-none">
                  $
                </span>
                <input
                  type="number"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="0"
                  min={0}
                  className="w-full bg-surface border border-outline-variant/20 rounded-xl pl-6 pr-3 py-1.5 text-xs font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            )}
          </div>
        </div>

        {/* Fotos - always visible */}
        <div className="bg-surface rounded-2xl p-4 md:p-5 border border-outline-variant/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-on-surface-variant/50">
              Fotos del trabajo
            </h3>
          </div>
          <TaskPhotos tareaId={task.id} />
        </div>
      </main>
    </div>
  );
}
