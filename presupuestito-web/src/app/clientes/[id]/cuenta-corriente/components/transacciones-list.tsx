"use client";

import { useCuentaCorriente } from "@/hooks/use-cuenta-corriente";
import { cn, formatCurrency } from "@/lib/utils";

export function TransaccionesList({ clienteId }: { clienteId: string }) {
  const { transacciones } = useCuentaCorriente(clienteId);

  return (
    <div className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-[24px] p-6 border border-outline-variant/20 dark:border-white/5 shadow-sm">
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-6">Historial Detallado</h3>

      <div className="space-y-3">
        {transacciones.length > 0 ? (
          transacciones.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between gap-4 p-4 md:p-5 bg-surface/40 dark:bg-white/[0.03] rounded-[16px] border border-outline-variant/10 dark:border-white/5 hover:bg-surface/80 dark:hover:bg-white/[0.06] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-2 h-2 rounded-full shrink-0 mt-1 self-start", tx.tipo === "cargo" ? "bg-[#EF4444]" : "bg-[#22C55E]")} />
                <div className="flex flex-col gap-1.5">
                  <p className="text-[15px] font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">{tx.concepto}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-medium text-on-surface-variant/80">
                      {new Date(tx.fecha + "T00:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md",
                      tx.tipo === "cargo" ? "bg-amber-100 text-amber-700 dark:bg-[#EF4444]/20 dark:text-[#EF4444]" : "bg-[#E8F5E9] text-[#2E7D32] dark:bg-[#22C55E]/20 dark:text-[#81C784]"
                    )}>
                      {tx.tipo === "cargo" ? "Cargo" : "Abono"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={cn(
                  "text-lg font-bold tracking-tight block",
                  tx.tipo === "cargo" ? "text-[#EF4444]" : "text-[#22C55E]"
                )}>
                  {tx.tipo === "cargo" ? "+" : "-"}{formatCurrency(tx.monto)}
                </span>
                <span className="text-[12px] font-medium text-on-surface-variant/70 mt-1 block">
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
  );
}
