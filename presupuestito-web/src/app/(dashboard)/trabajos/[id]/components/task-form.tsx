"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CalendarDays, CheckCircle } from "lucide-react";

interface TaskFormProps {
  initialData?: { 
    descripcion: string; 
    cantidad?: number;
    precio_unitario?: number;
    precio: number | null; 
    prioridad?: "alta" | "media" | "baja"; 
    fecha_vencimiento?: string 
  };
  onSave: (data: { 
    descripcion: string; 
    cantidad?: number;
    precio_unitario?: number;
    precio: number | null; 
    prioridad?: "alta" | "media" | "baja"; 
    fecha_vencimiento?: string 
  }) => Promise<void> | void;
  onCancel: () => void;
  isSaving?: boolean;
}

const PRIORIDADES = [
  { value: "alta" as const, label: "Urgente", sublabel: "resolver hoy", color: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20" },
  { value: "media" as const, label: "Próximo", sublabel: "en la cola", color: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20" },
  { value: "baja" as const, label: "Sin apuro", sublabel: "cuando puedas", color: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary border-primary/20" },
];

export function TaskForm({ initialData, onSave, onCancel, isSaving = false }: TaskFormProps) {
  const [descripcion, setDescripcion] = useState(initialData?.descripcion ?? "");
  const [cantidad, setCantidad] = useState(
    initialData?.cantidad ? String(initialData.cantidad) : "1"
  );
  const [precioUnitario, setPrecioUnitario] = useState(
    initialData?.precio_unitario !== undefined && initialData?.precio_unitario !== null
      ? String(initialData.precio_unitario)
      : initialData?.precio !== null && initialData?.precio !== undefined
      ? String(initialData.precio)
      : ""
  );
  const [prioridad, setPrioridad] = useState<"alta" | "media" | "baja" | undefined>(initialData?.prioridad);
  const [fechaVencimiento, setFechaVencimiento] = useState(initialData?.fecha_vencimiento ?? "");

  const canSave = descripcion.trim() !== "";

  const cant = cantidad !== "" ? Number(cantidad) : 1;
  const pUnit = precioUnitario !== "" ? Number(precioUnitario) : null;
  const precioTotal = pUnit !== null ? cant * pUnit : null;

  const handleSave = async () => {
    if (!canSave || isSaving) return;
    try {
      await onSave({
        descripcion: descripcion.trim(),
        cantidad: cant,
        precio_unitario: pUnit !== null ? pUnit : undefined,
        precio: precioTotal,
        prioridad,
        fecha_vencimiento: fechaVencimiento || undefined,
      });
      if (!initialData) {
        onCancel();
      }
    } catch {
      // error toast handled by parent
    }
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
          maxLength={300}
          className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <div className="flex gap-4">
        <div className="space-y-1.5 w-1/3">
          <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Cantidad</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="1"
            min={0.01}
            step="0.01"
            className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
          />
        </div>
        <div className="space-y-1.5 flex-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Precio Unitario</label>
          <input
            type="number"
            value={precioUnitario}
            onChange={(e) => setPrecioUnitario(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Opcional"
            min={0}
            className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
          />
        </div>
      </div>
      
      {precioTotal !== null && (
        <div className="flex justify-between items-center bg-on-surface/5 rounded-xl px-4 py-2 border border-outline-variant/10">
          <span className="text-xs font-medium text-on-surface-variant">Total Calculado:</span>
          <span className="text-sm font-black text-primary">${precioTotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
        </div>
      )}

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

      <div className="sticky bottom-0 bg-surface/95 dark:bg-surface/90 backdrop-blur-xl border-t border-outline-variant/10 -mx-5 px-5 sm:-mx-6 sm:px-6 py-4 flex gap-2 z-10 -mb-8 sm:-mb-6">
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="flex-1 py-3 rounded-xl bg-on-surface/5 text-on-surface font-black text-[10px] uppercase tracking-widest hover:bg-on-surface/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave || isSaving}
          className={cn(
            "flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2",
            canSave
              ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
              : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed",
            isSaving && "opacity-70 cursor-not-allowed"
          )}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {initialData ? "Guardando..." : "Agregando..."}
            </>
          ) : (
            initialData ? "Guardar" : "Agregar"
          )}
        </button>
      </div>
    </div>
  );
}
