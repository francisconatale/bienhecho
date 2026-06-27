"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { usePayments } from "../hooks/use-payments";
import { CobroForm } from "./cobro-form";
import { cn } from "@/lib/utils";
import { Cobro } from "@/types";

interface PaymentsDashboardProps {
  jobId: string;
}

export function PaymentsDashboard({ jobId }: PaymentsDashboardProps) {
  const {
    cobros,
    saldoPendiente,
    addCobro,
    updateCobro,
    removeCobro,
  } = usePayments(jobId);

  const [isAddingCobro, setIsAddingCobro] = useState(false);
  const [editingCobro, setEditingCobro] = useState<Cobro | null>(null);

  const handleSaveCobro = (data: any) => {
    if (editingCobro) {
      updateCobro(editingCobro.id, data);
      setEditingCobro(null);
    } else {
      addCobro(data);
      setIsAddingCobro(false);
    }
  };

  return (
    <div className="space-y-6 mt-8 relative z-10">
      {/* Saldo Pendiente Card */}
      <div className="relative overflow-hidden bg-primary/10 dark:bg-primary/5 bg-surface/80 rounded-[28px] p-6 border border-primary/20 shadow-[0_8px_32px_rgba(61,139,110,0.1)] transition-all duration-500">
        <div className="relative flex flex-col gap-1 z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">
            Saldo Pendiente
          </span>
          <span className={cn(
            "text-4xl lg:text-5xl font-black tracking-tighter mt-1",
            saldoPendiente <= 0 ? "text-primary" : "text-on-surface"
          )}>
            ${Math.max(0, saldoPendiente).toLocaleString("es-AR")}
            {saldoPendiente < 0 && (
              <span className="text-sm font-bold text-primary ml-2 uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">A favor</span>
            )}
          </span>
        </div>
      </div>

      {/* Pagos Recibidos */}
      <div className="space-y-4">
        <div className="flex items-end justify-between px-2">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-on-surface-variant/50">
            Pagos Recibidos
          </h3>
          <button
            onClick={() => setIsAddingCobro(true)}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] border border-primary/30 hover:border-primary bg-primary/10 transition-all duration-300 text-[10px] font-bold text-primary uppercase tracking-wider active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90 duration-300" strokeWidth={2.5} />
            Registrar Cobro
          </button>
        </div>

        <div className="space-y-3">
          {isAddingCobro && (
            <CobroForm onSave={handleSaveCobro} onCancel={() => setIsAddingCobro(false)} />
          )}
          {editingCobro && (
            <CobroForm
              initialData={editingCobro}
              onSave={handleSaveCobro}
              onCancel={() => setEditingCobro(null)}
            />
          )}

          {cobros.length > 0 ? (
            cobros.map((cobro) => (
              <div key={cobro.id} className="group relative bg-surface/80 rounded-[16px] p-3 border border-primary/20 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-on-surface">
                      ${cobro.monto_cobrado.toLocaleString("es-AR")}
                    </p>
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-on-surface/5 text-on-surface-variant/60">
                      {cobro.forma_pago || "Sin especificar"}
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-on-surface-variant/60 mt-0.5">
                    {new Date(cobro.fecha_cobro).toLocaleDateString("es-AR")}
                  </p>
                </div>

                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingCobro(cobro)} className="p-1.5 text-on-surface hover:bg-on-surface/10 rounded-lg">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button onClick={() => removeCobro(cobro.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            !isAddingCobro && !editingCobro && (
              <div className="py-6 px-4 text-center bg-surface/10 rounded-[16px] border border-dashed border-outline-variant/20">
                <p className="text-xs font-bold text-on-surface-variant/50">Aún no hay cobros registrados</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
