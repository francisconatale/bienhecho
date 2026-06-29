"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

interface TaskFormProps {
  initialData?: { descripcion: string; precio: number | null; prioridad?: "alta" | "media" | "baja"; fecha_vencimiento?: string };
  onSave: (data: { descripcion: string; precio: number | null; prioridad?: "alta" | "media" | "baja"; fecha_vencimiento?: string }) => void;
  onCancel: () => void;
}

const PRIORIDADES = [
  { value: "alta" as const, label: "Urgente", sublabel: "resolver hoy", color: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20" },
  { value: "media" as const, label: "Próximo", sublabel: "en la cola", color: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20" },
  { value: "baja" as const, label: "Sin apuro", sublabel: "cuando puedas", color: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary border-primary/20" },
];

export function TaskForm({ initialData, onSave, onCancel }: TaskFormProps) {
  const [descripcion, setDescripcion] = useState(initialData?.descripcion ?? "");
  const [precio, setPrecio] = useState(
    initialData?.precio !== null && initialData?.precio !== undefined
      ? String(initialData.precio)
      : ""
  );
  const [prioridad, setPrioridad] = useState<"alta" | "media" | "baja" | undefined>(initialData?.prioridad);
  const [fechaVencimiento, setFechaVencimiento] = useState(initialData?.fecha_vencimiento ?? "");

  const canSave = descripcion.trim() !== "";

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      descripcion: descripcion.trim(),
      precio: precio !== "" ? Number(precio) : null,
      prioridad,
      fecha_vencimiento: fechaVencimiento || undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Qué hay que hacer</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ej: Instalar artefacto de luz..."
          autoFocus
          className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Cuánto cobrás</label>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Opcional — si no ponés precio, es descriptiva"
          min={0}
          className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Qué tan urgente</label>
        <div className="flex gap-2">
          {PRIORIDADES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPrioridad(prioridad === p.value ? undefined : p.value)}
              className={cn(
                "flex-1 py-2.5 rounded-xl border transition-all active:scale-95",
                prioridad === p.value
                  ? p.color
                  : "bg-on-surface/5 text-on-surface-variant/50 border-outline-variant/15 hover:bg-on-surface/10"
              )}
            >
              <span className="text-[11px] font-bold block">{p.label}</span>
              <span className="text-[9px] font-medium opacity-60 block">{p.sublabel}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Para cuándo</label>
        <div className="relative">
          <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 pointer-events-none" />
          <input
            type="date"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
            className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
        <p className="text-[10px] text-on-surface-variant/40">Fecha límite — opcional</p>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl bg-on-surface/5 text-on-surface font-black text-[10px] uppercase tracking-widest hover:bg-on-surface/10 transition-all active:scale-95"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={cn(
            "flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95",
            canSave
              ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
              : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
          )}
        >
          {initialData ? "Guardar" : "Agregar"}
        </button>
      </div>
    </div>
  );
}
