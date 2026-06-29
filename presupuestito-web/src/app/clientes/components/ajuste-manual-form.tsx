"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transaccionesService } from "@/services";
interface AjusteManualFormProps {
  clienteId: string;
  onClose: () => void;
}

export function AjusteManualForm({ clienteId, onClose }: AjusteManualFormProps) {
  const [tipo, setTipo] = useState<"cargo" | "abono">("cargo");
  const [monto, setMonto] = useState("");
  const [concepto, setConcepto] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const canSave = Number(monto) > 0 && monto !== "" && concepto.trim() !== "";

  const handleSubmit = () => {
    if (!canSave) return;
    setShowConfirm(true);
  };

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: transaccionesService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });

  const handleConfirm = async () => {
    await createMutation.mutateAsync({
      cliente_id: clienteId,
      tipo,
      monto: Number(monto),
      concepto: concepto.trim(),
      fecha: new Date().toISOString().slice(0, 10),
      referencia_trabajo_id: null,
      referencia_cobro_id: null,
      origen: "manual",
    });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      if (showConfirm) {
        setShowConfirm(false);
      } else {
        onClose();
      }
    }
  };

  if (showConfirm) {
    return (
      <div className="bg-surface/50 rounded-2xl p-4 border border-outline-variant/10 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">
            Confirmar Ajuste Manual
          </span>
          <button
            onClick={() => setShowConfirm(false)}
            className="p-1 rounded-lg hover:bg-on-surface/5 text-on-surface-variant/40 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-on-surface-variant/70 leading-relaxed cursor-default select-none">
          <p>¿Estás seguro de registrar este ajuste manual?</p>
          <div className="mt-2 space-y-1">
            <p><strong>Tipo:</strong> {tipo === "cargo" ? "Cargo" : "Abono"}</p>
            <p><strong>Monto:</strong> ${Number(monto).toLocaleString("es-AR")}</p>
            <p><strong>Concepto:</strong> {concepto}</p>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 py-2.5 rounded-xl bg-on-surface/5 text-on-surface font-black text-[10px] uppercase tracking-widest hover:bg-on-surface/10 transition-all active:scale-95 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl bg-amber-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-amber-700 transition-all active:scale-95 shadow-md cursor-pointer"
          >
            Confirmar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface/50 rounded-2xl p-4 border border-outline-variant/10 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">
          Nuevo Ajuste Manual
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-on-surface/5 text-on-surface-variant/40 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-3">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as "cargo" | "abono")}
          onKeyDown={handleKeyDown}
          className="w-1/2 bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
        >
          <option value="cargo">Cargo</option>
          <option value="abono">Abono</option>
        </select>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Monto"
          min={0.01}
          step="any"
          autoFocus
          className="w-1/2 bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <input
        type="text"
        value={concepto}
        onChange={(e) => setConcepto(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Concepto del ajuste"
        className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
      />

      <div className="flex gap-2 pt-1">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl bg-on-surface/5 text-on-surface font-black text-[10px] uppercase tracking-widest hover:bg-on-surface/10 transition-all active:scale-95 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSave}
          className={cn(
            "flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95",
            canSave
              ? "bg-on-surface text-surface shadow-lg shadow-black/10 hover:bg-on-surface-variant cursor-pointer"
              : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed"
          )}
        >
          Registrar Ajuste
        </button>
      </div>
    </div>
  );
}
