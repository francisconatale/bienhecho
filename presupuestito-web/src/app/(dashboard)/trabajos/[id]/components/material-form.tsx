"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MaterialFormValues } from "../hooks/use-materials";

interface MaterialFormProps {
  initialData?: MaterialFormValues;
  onSave: (data: MaterialFormValues) => void;
  onCancel: () => void;
}

export function MaterialForm({ initialData, onSave, onCancel }: MaterialFormProps) {
  const [nombre, setNombre] = useState(initialData?.nombre_material ?? "");
  const [cantidad, setCantidad] = useState(
    initialData?.cantidad !== undefined ? String(initialData.cantidad) : "1"
  );
  const [precioUnitario, setPrecioUnitario] = useState(
    initialData?.precio_unitario !== undefined ? String(initialData.precio_unitario) : ""
  );

  const canSave = nombre.trim() !== "" && Number(cantidad) > 0 && Number(precioUnitario) >= 0 && precioUnitario !== "";

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      nombre_material: nombre.trim(),
      cantidad: Number(cantidad),
      precio_unitario: Number(precioUnitario),
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
          {initialData ? "Editar material" : "Nuevo material"}
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
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nombre del material..."
        autoFocus
        className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
      />

      <div className="flex gap-3">
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Cantidad"
          min={0.01}
          step="any"
          className="w-1/3 bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
        />
        <input
          type="number"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Precio unitario"
          min={0}
          className="w-2/3 bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
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
