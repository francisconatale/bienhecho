"use client";

import { useCuentaCorriente } from "@/hooks/use-cuenta-corriente";
import { cn, formatCurrency } from "@/lib/utils";
import { FileText } from "lucide-react";
import { useState } from "react";
import { AjusteManualForm } from "../../../components/ajuste-manual-form";

export function MetricasCuenta({ clienteId }: { clienteId: string }) {
  const { saldo: deudaTotal, transacciones } = useCuentaCorriente(clienteId);
  const [showAjuste, setShowAjuste] = useState(false);

  const totalCargos = transacciones.filter(t => t.tipo === "cargo").reduce((acc, t) => acc + t.monto, 0);
  const totalAbonos = transacciones.filter(t => t.tipo === "abono").reduce((acc, t) => acc + t.monto, 0);
  const totalCobrosCount = transacciones.filter(t => t.tipo === "abono").length;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-xl p-6 border border-outline-variant/20 dark:border-white/5 shadow-sm flex flex-col gap-1 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant/60">Balance</span>
              <button
                type="button"
                onClick={() => setShowAjuste(true)}
                className="w-8 h-8 rounded-full bg-surface/50 hover:bg-surface flex items-center justify-center border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                title="Ajuste Manual"
              >
                <FileText className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <span className={cn("text-[32px] font-bold tracking-tight mt-1 leading-none", deudaTotal > 0 ? "text-error" : deudaTotal < 0 ? "text-success" : "text-on-surface")}>
              {formatCurrency(Math.abs(deudaTotal))}
            </span>
            <div className="flex items-center gap-2 mt-4 text-[13px] text-on-surface-variant/80">
              <div className={cn("w-2 h-2 rounded-full", deudaTotal > 0 ? "bg-error" : deudaTotal < 0 ? "bg-success" : "bg-on-surface-variant/40")} />
              {deudaTotal > 0 ? "En deuda" : deudaTotal < 0 ? "A favor" : "Al día"}
            </div>
          </div>
          
          <div className={cn(
            "absolute -right-12 -bottom-12 w-40 h-40 rounded-full blur-2xl pointer-events-none transition-transform duration-300",
            deudaTotal > 0 ? "bg-error/10" : deudaTotal < 0 ? "bg-success/10" : "bg-primary/10",
            "group-hover:scale-110"
          )} />
        </div>

        <div className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-xl p-6 border border-outline-variant/20 dark:border-white/5 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-on-surface-variant/60">Total Facturado</span>
          <span className="text-[32px] font-bold tracking-tight mt-1 text-on-surface leading-none">
            {formatCurrency(totalCargos)}
          </span>
          <div className="flex items-center gap-2 mt-4 text-[13px] text-on-surface-variant/80">
            Histórico acumulado
          </div>
        </div>

        <div className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-xl p-6 border border-outline-variant/20 dark:border-white/5 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-on-surface-variant/60">Total Cobrado</span>
          <span className="text-[32px] font-bold tracking-tight mt-1 text-success leading-none">
            {formatCurrency(totalAbonos)}
          </span>
          <div className="flex items-center gap-2 mt-4 text-[13px] text-on-surface-variant/80">
            <div className="w-2 h-2 rounded-full bg-success" />
            {totalCobrosCount} cobros registrados
          </div>
        </div>
      </div>

      {showAjuste && (
        <AjusteManualForm clienteId={clienteId} onClose={() => setShowAjuste(false)} />
      )}
    </>
  );
}
