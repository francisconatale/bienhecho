"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MaterialFormValues } from "../hooks/use-materials";

interface MaterialFormProps {
  initialData?: MaterialFormValues;
  onSave: (data: MaterialFormValues) => void;
  onCancel: () => void;
  hideFooter?: boolean;
}

export function MaterialForm({ initialData, onSave, onCancel, hideFooter = false }: MaterialFormProps) {
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
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-on-surface-variant/50">Nombre del Material</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ej: Cemento Loma Negra..."
          aria-label="Nombre del material"
          autoFocus
          className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-colors"
        />
      </div>

      <div className="flex gap-4">
        <div className="space-y-1.5 w-1/3">
          <label className="text-[11px] font-bold text-on-surface-variant/50">Cantidad</label>
          <input
            type="number"
            inputMode="decimal"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="1"
            aria-label="Cantidad"
            min={0.01}
            step="any"
            className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-1.5 flex-1">
          <label className="text-[11px] font-bold text-on-surface-variant/50">Precio Unitario</label>
          <input
            type="number"
            inputMode="decimal"
            value={precioUnitario}
            onChange={(e) => setPrecioUnitario(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0.00"
            aria-label="Precio unitario"
            min={0}
            className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {!hideFooter && (
        <div className="sticky bottom-0 bg-surface/95 dark:bg-surface/90 backdrop-blur-xl border-t border-outline-variant/10 -mx-5 px-5 sm:-mx-6 sm:px-6 py-4 flex gap-2 z-10 -mb-8 sm:-mb-6">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-full bg-on-surface/5 text-on-surface font-bold text-xs hover:bg-on-surface/10 transition-all active:scale-95 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={cn(
              "flex-1 py-3 rounded-full font-bold text-xs transition-all active:scale-95",
              canSave
                ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
                : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
            )}
          >
            {initialData ? "Guardar" : "Agregar"}
          </button>
        </div>
      )}
    </div>
  );
}
