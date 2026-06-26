"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function NuevoTrabajoPage() {
  const router = useRouter();
  const { clients, addJob } = useDataStore();

  const [clienteId, setClienteId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinEstimada, setFechaFinEstimada] = useState("");

  const canSave = clienteId.trim() !== "" && titulo.trim() !== "";

  const handleSave = () => {
    if (!canSave) return;

    const newJob = addJob({
      cliente_id: clienteId,
      titulo: titulo.trim(),
      direccion: direccion.trim(),
      descripcion: descripcion.trim() || undefined,
      presupuesto: presupuesto ? Number(presupuesto) : 0,
      fecha_inicio: fechaInicio || undefined,
      fecha_fin_estimada: fechaFinEstimada || undefined,
    });

    router.push(`/trabajos/${newJob.id}`);
  };

  return (
    <main className="flex-1 pb-32 w-full pt-10 transition-all max-w-4xl mx-auto px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/trabajos">
          <button
            aria-label="Volver"
            className="w-10 h-10 rounded-full bg-surface border border-outline-variant/30 flex items-center justify-center hover:bg-on-surface/5 transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-on-surface" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-on-surface">
            Nuevo Trabajo
          </h1>
          <p className="text-sm text-on-surface-variant/60 font-medium mt-1">
            Completá los datos para crear un nuevo trabajo.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-surface rounded-[32px] p-6 md:p-8 border border-outline-variant/10 shadow-sm space-y-6">
        {/* Cliente */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
            Cliente *
          </label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none"
          >
            <option value="">Seleccionar cliente...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Título */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
            Título *
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Reforma integral"
            className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
          />
        </div>

        {/* Dirección */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
            Dirección
          </label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Ej: Av. Corrientes 1234"
            className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
          />
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Detalles del trabajo..."
            rows={3}
            className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
          />
        </div>

        {/* Presupuesto */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
            Presupuesto ($)
          </label>
          <input
            type="number"
            value={presupuesto}
            onChange={(e) => setPresupuesto(e.target.value)}
            placeholder="0"
            min={0}
            className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
          />
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
              Fecha de inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
              Fecha fin estimada
            </label>
            <input
              type="date"
              value={fechaFinEstimada}
              onChange={(e) => setFechaFinEstimada(e.target.value)}
              className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl px-5 py-4 text-base font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="mt-8">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={cn(
            "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98]",
            canSave
              ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
              : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
          )}
        >
          Crear Trabajo
        </button>
      </div>
    </main>
  );
}
