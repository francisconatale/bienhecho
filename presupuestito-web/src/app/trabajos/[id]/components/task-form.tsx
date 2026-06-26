"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  initialData?: { descripcion: string; precio: number | null };
  onSave: (data: { descripcion: string; precio: number | null }) => void;
  onCancel: () => void;
}

export function TaskForm({ initialData, onSave, onCancel }: TaskFormProps) {
  const [descripcion, setDescripcion] = useState(initialData?.descripcion ?? "");
  const [precio, setPrecio] = useState(
    initialData?.precio !== null && initialData?.precio !== undefined
      ? String(initialData.precio)
      : ""
  );

  const canSave = descripcion.trim() !== "";

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      descripcion: descripcion.trim(),
      precio: precio !== "" ? Number(precio) : null,
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
    <div className="bg-surface rounded-2xl p-4 border border-primary/20 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          {initialData ? "Editar tarea" : "Nueva tarea"}
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
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Descripción de la tarea..."
        autoFocus
        className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
      />

      <input
        type="number"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Precio (opcional)"
        min={0}
        className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
      />

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
