import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Minus, Edit2, Trash2 } from "lucide-react";
import { TransaccionCuentaCorriente, Cobro } from "@/types";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";

interface TransactionsTimelineProps {
  transactions: TransaccionCuentaCorriente[];
  cobros: Cobro[];
  onEditCobro: (cobro: Cobro) => void;
  onDeleteCobro: (id: string) => void;
}

export function TransactionsTimeline({ transactions, cobros, onEditCobro, onDeleteCobro }: TransactionsTimelineProps) {
  const [ConfirmDialog, confirm] = useConfirm();

  if (transactions.length === 0) {
    return (
      <div className="py-6 px-4 text-center bg-surface/10 rounded-xl border border-dashed border-outline-variant/20">
        <p className="text-xs font-bold text-on-surface-variant/50">No hay movimientos registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant/20 before:to-transparent">
      {transactions.map((t) => {
        const isCargo = t.tipo === "cargo";
        const associatedCobro = t.referencia_cobro_id ? cobros.find(c => c.id === t.referencia_cobro_id) : null;
        
        return (
          <div key={t.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Icon */}
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-surface shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm",
              isCargo ? "text-on-surface-variant/70" : "text-primary"
            )}>
              {isCargo ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
            </div>
            
            {/* Card */}
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-surface/80 rounded-xl p-3 border border-outline-variant/10 shadow-sm flex items-center justify-between">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-on-surface-variant/60">
                    {format(new Date(t.fecha), "d MMM yyyy", { locale: es })}
                  </span>
                  <span className={cn(
                    "text-xs font-bold",
                    isCargo ? "text-on-surface" : "text-primary"
                  )}>
                    {isCargo ? "+" : "-"}${t.monto.toLocaleString("es-AR")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-medium text-on-surface-variant/80 truncate">
                    {t.concepto}
                  </p>
                  {associatedCobro && associatedCobro.forma_pago && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-on-surface/5 text-on-surface-variant/60 shrink-0">
                      {associatedCobro.forma_pago}
                    </span>
                  )}
                </div>
              </div>

              {associatedCobro && (
                <div className="flex flex-row md:flex-col gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-2 shrink-0 border-l border-outline-variant/10 pl-2">
                  <button onClick={() => onEditCobro(associatedCobro)} aria-label="Editar cobro" className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-on-surface hover:bg-on-surface/10 rounded-lg">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button onClick={() => {
                    confirm({
                      title: "Eliminar cobro",
                      description: "¿Estás seguro de eliminar este cobro? Esta acción no se puede deshacer.",
                      confirmText: "Eliminar",
                      variant: "danger",
                      action: async () => { onDeleteCobro(associatedCobro.id); },
                    });
                  }} aria-label="Eliminar cobro" className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-lg">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <ConfirmDialog />
    </div>
  );
}
