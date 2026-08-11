"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CobroFormValues } from "../hooks/use-payments";

interface CobroFormProps {
  initialData?: CobroFormValues;
  onSave: (data: CobroFormValues) => void;
  onCancel: () => void;
  hideFooter?: boolean;
}

export function CobroForm({ initialData, onSave, onCancel, hideFooter = false }: CobroFormProps) {
  const todayStr = new Date().toISOString().split("T")[0];

  const [montoCobrado, setMontoCobrado] = useState(
    initialData?.monto_cobrado !== undefined ? String(initialData.monto_cobrado) : ""
  );
  const [fechaCobro, setFechaCobro] = useState(initialData?.fecha_cobro ?? todayStr);
  const [formaPago, setFormaPago] = useState(initialData?.forma_pago ?? "");
  const [notas, setNotas] = useState(initialData?.notas ?? "");

  const canSave = Number(montoCobrado) > 0 && montoCobrado !== "" && fechaCobro !== "";

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      monto_cobrado: Number(montoCobrado),
      fecha_cobro: fechaCobro,
      forma_pago: formaPago || undefined,
      notas: notas || undefined,
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
        <span className="text-[11px] font-bold text-on-surface-variant/70">
          {initialData ? "Editar Cobro" : "Nuevo Cobro"}
        </span>
        <button
          onClick={onCancel}
          aria-label="Cerrar formulario de cobro"
          className="p-1 rounded-lg hover:bg-on-surface/5 text-on-surface-variant/40 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-3">
        <input
          type="number"
          inputMode="decimal"
          aria-label="Monto cobrado"
          value={montoCobrado}
          onChange={(e) => setMontoCobrado(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Monto"
          min={0.01}
          step="any"
          autoFocus
          className="w-1/2 bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-colors"
        />
        <input
          type="date"
          value={fechaCobro}
          onChange={(e) => setFechaCobro(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          className="w-1/2 bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-colors"
        />
      </div>

      <div className="flex gap-3">
        <select
          value={formaPago}
          onChange={(e) => setFormaPago(e.target.value)}
          aria-label="Forma de pago"
          className="w-1/2 bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-colors appearance-none"
        >
          <option value="">Forma de pago</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Cheque">Cheque</option>
          <option value="Tarjeta">Tarjeta</option>
          <option value="Otro">Otro</option>
        </select>
        <input
          type="text"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Notas (opcional)"
          className="w-1/2 bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-colors"
        />
      </div>

      {!hideFooter && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-on-surface/5 text-on-surface font-bold text-xs hover:bg-on-surface/10 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={cn(
              "flex-1 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
              canSave
                ? "bg-on-surface text-surface shadow-lg shadow-black/10 hover:bg-on-surface-variant"
                : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
            )}
          >
            {initialData ? "Guardar" : "Registrar"}
          </button>
        </div>
      )}
    </div>
  );
}
