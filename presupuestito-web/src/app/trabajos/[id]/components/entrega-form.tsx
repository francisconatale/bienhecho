"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EntregaParcialFormValues } from "../hooks/use-payments";

interface EntregaFormProps {
  initialData?: EntregaParcialFormValues;
  onSave: (data: EntregaParcialFormValues) => void;
  onCancel: () => void;
}

export function EntregaForm({ initialData, onSave, onCancel }: EntregaFormProps) {
  const [concepto, setConcepto] = useState(initialData?.concepto ?? "");
  const [montoEntrega, setMontoEntrega] = useState(
    initialData?.monto_entrega !== undefined ? String(initialData.monto_entrega) : ""
  );
  const [fechaEstimada, setFechaEstimada] = useState(initialData?.fecha_estimada ?? "");

  const canSave = Number(montoEntrega) > 0 && montoEntrega !== "";

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      concepto: concepto.trim() || undefined,
      monto_entrega: Number(montoEntrega),
      fecha_estimada: fechaEstimada || undefined,
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
    <div className="bg-surface/50 rounded-2xl p-4 border border-outline-variant/10 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">
          {initialData ? "Editar Hito / Cuota" : "Nuevo Hito / Cuota"}
        </span>
        <button
          onClick={onCancel}
          className="p-1 rounded-lg hover:bg-on-surface/5 text-on-surface-variant/40 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <input
        type="text"
        value={concepto}
        onChange={(e) => setConcepto(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Concepto (ej. Anticipo, Avance 50%)"
        autoFocus
        className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
      />

      <div className="flex gap-3">
        <input
          type="number"
          value={montoEntrega}
          onChange={(e) => setMontoEntrega(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Monto"
          min={0.01}
          step="any"
          className="w-1/2 bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
        />
        <input
          type="date"
          value={fechaEstimada}
          onChange={(e) => setFechaEstimada(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-1/2 bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
        />
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
              ? "bg-on-surface text-surface shadow-lg shadow-black/10 hover:bg-on-surface-variant"
              : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
          )}
        >
          {initialData ? "Guardar" : "Agregar"}
        </button>
      </div>
    </div>
  );
}
