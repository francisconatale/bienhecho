"use client";

import { useCuentaCorriente } from "@/hooks/use-cuenta-corriente";
import { cn, formatCurrency } from "@/lib/utils";

export function TransaccionesList({ clienteId }: { clienteId: string }) {
  const { transacciones } = useCuentaCorriente(clienteId);

  return (
    <div className="flex flex-col mt-4">
      <h3 className="text-[13px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">Historial Detallado</h3>

      <div className="flex flex-col bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm">
        <div className="hidden md:flex items-center px-4 py-2 border-b border-outline-variant/20 bg-surface-variant/20">
          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex-1">Concepto</div>
          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest w-32">Fecha</div>
          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest w-32 text-right">Monto</div>
        </div>
        
        <div className="flex flex-col divide-y divide-outline-variant/10">
          {transacciones.length > 0 ? (
            transacciones.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col md:flex-row md:items-center px-4 py-3 hover:bg-primary/5 transition-colors gap-2 md:gap-0 group"
              >
                {/* Concept */}
                <div className="flex-1 min-w-0 pr-4 flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full shrink-0", tx.tipo === "cargo" ? "bg-error" : "bg-success")} />
                  <div className="flex flex-col min-w-0">
                    <p className="text-[14px] font-bold text-on-surface truncate group-hover:text-primary transition-colors">{tx.concepto}</p>
                    <div className="md:hidden flex items-center gap-2 mt-1">
                      <span className="text-[12px] text-on-surface-variant">
                        {new Date(tx.fecha + "T00:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Date Column */}
                <div className="hidden md:flex w-32 shrink-0 items-center">
                  <span className="text-[13px] font-medium text-on-surface-variant">
                    {new Date(tx.fecha + "T00:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>

                {/* Amount Column */}
                <div className="w-full md:w-32 shrink-0 flex flex-col md:text-right pt-2 md:pt-0 border-t border-outline-variant/10 md:border-0">
                  <span className={cn(
                    "text-[15px] font-bold tabular-nums block",
                    tx.tipo === "cargo" ? "text-error" : "text-success"
                  )}>
                    {tx.tipo === "cargo" ? "+" : "-"}{formatCurrency(tx.monto)}
                  </span>
                  <span className="text-[11px] font-medium text-on-surface-variant/70 mt-0.5 block">
                    Saldo {formatCurrency(tx.saldo_despues)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <p className="text-sm font-semibold text-on-surface-variant mb-1">No hay movimientos registrados</p>
              <p className="text-xs text-on-surface-variant/60 max-w-sm">
                Las transacciones aparecerán aquí a medida que agregues trabajos y registres cobros o ajustes manuales.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
