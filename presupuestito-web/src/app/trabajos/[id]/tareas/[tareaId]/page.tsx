"use client";

import React, { useState } from "react";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useDataStore } from "@/lib/store";
import { TaskPhotos } from "../../components/task-photos";
import { cn } from "@/lib/utils";

interface TareaDetailPageProps {
  params: Promise<{ id: string; tareaId: string }>;
}

export default function TareaDetailPage({ params }: TareaDetailPageProps) {
  const { id, tareaId } = React.use(params);
  const { jobs, tasks, updateTask } = useDataStore();

  const job = jobs.find((j) => j.id === id);
  const task = tasks.find((t) => t.id === tareaId && t.trabajo_id === id);

  if (!job || !task) {
    notFound();
  }

  const [descripcion, setDescripcion] = useState(task.descripcion);
  const [notas, setNotas] = useState("");
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
      </div>

      <main className="relative flex-1 px-5 md:px-8 lg:px-12 pt-16 pb-32 w-full transition-all max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Link href={`/trabajos/${id}`}>
              <button
                aria-label="Volver"
                className="w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-95"
              >
                <ChevronLeft className="w-6 h-6 text-on-surface" />
              </button>
            </Link>
            <div>
              <h1 className="text-[24px] md:text-[28px] leading-tight font-extrabold text-on-surface tracking-tight">
                Detalle de Tarea
              </h1>
              <p className="text-xs font-medium text-on-surface-variant/50 mt-0.5">
                {job.titulo}
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95",
              hasChanges
                ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
                : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
            )}
          >
            <Save className="w-4 h-4" strokeWidth={2.5} />
            Guardar
          </button>
        </div>

        {/* Estado */}
        <div className="bg-surface rounded-[32px] p-5 border border-outline-variant/10 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                task.completada ? "bg-green-500" : "bg-amber-500"
              )}
            />
            <span className="text-sm font-bold text-on-surface">
              {task.completada ? "Completada" : "Pendiente"}
            </span>
          </div>
        </div>

        {/* Descripción */}
        <div className="bg-surface rounded-[32px] p-5 border border-outline-variant/10 shadow-sm space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="¿Qué se hizo en esta tarea?"
            rows={3}
            className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-4 py-3 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
          />
        </div>

        {/* Precio */}
        <div className="bg-surface rounded-[32px] p-5 border border-outline-variant/10 shadow-sm space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
            Precio
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-on-surface-variant/40">
              $
            </span>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="0"
              min={0}
              className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl pl-8 pr-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>
          <p className="text-[10px] font-medium text-on-surface-variant/30">
            Si el precio está vacío, la tarea es descriptiva y no va a la factura
          </p>
        </div>

        {/* Notas internas */}
        <div className="bg-surface rounded-[32px] p-5 border border-outline-variant/10 shadow-sm space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
            Notas internas
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Observaciones, materiales usados, tiempo invertido..."
            rows={4}
            className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-4 py-3 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
          />
          <p className="text-[10px] font-medium text-on-surface-variant/30">
            Estas notas son para tu referencia personal, no aparecen en facturas
          </p>
        </div>

        {/* Fotos */}
        <div className="bg-surface rounded-[32px] p-5 border border-outline-variant/10 shadow-sm space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
            Fotos del trabajo
          </label>
          <TaskPhotos tareaId={task.id} />
        </div>
      </main>
    </div>
  );
}
