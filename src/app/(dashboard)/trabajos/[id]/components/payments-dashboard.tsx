"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { usePayments } from "../hooks/use-payments";
import { useTransactions } from "../hooks/use-transactions";
import { CobroForm } from "./cobro-form";
import { TransactionsTimeline } from "./transactions-timeline";
import { cn } from "@/lib/utils";
import { Cobro } from "@/types";
import { Modal } from "@/components/ui/modal";

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
    isSaving,
  } = usePayments(jobId);

  const { transacciones, isLoading: isLoadingTransactions } = useTransactions(jobId);

  const [isAddingCobro, setIsAddingCobro] = useState(false);
  const [editingCobro, setEditingCobro] = useState<Cobro | null>(null);

  const handleSaveCobro = async (data: any) => {
    try {
      if (editingCobro) {
        await updateCobro(editingCobro.id, data);
        setEditingCobro(null);
      } else {
        await addCobro(data);
        setIsAddingCobro(false);
      }
    } catch {
      // Modal stays open; error is surfaced by the hook toast
    }
  };

  return (
    <div className="space-y-6 mt-8 relative z-10">
      {/* Saldo Pendiente Card */}
      <div className="relative overflow-hidden bg-primary/10 dark:bg-primary/5 bg-surface/80 rounded-xl p-6 border border-primary/20 shadow-[0_8px_32px_rgba(61,139,110,0.1)] transition-[background-color,box-shadow] duration-300">
        <div className="relative flex flex-col gap-1 z-10">
          <span className="text-[11px] font-bold text-primary/70">
            Saldo Pendiente
          </span>
          <span className={cn(
            "text-display tracking-tighter mt-1",
            saldoPendiente <= 0 ? "text-primary" : "text-on-surface"
          )}>
            ${Math.max(0, saldoPendiente).toLocaleString("es-AR")}
            {saldoPendiente < 0 && (
              <span className="text-sm font-bold text-primary ml-2 bg-primary/10 px-3 py-1 rounded-full">A favor</span>
            )}
          </span>
        </div>
      </div>

      {/* Cuenta Corriente */}
      <div className="space-y-4">
        <div className="flex items-end justify-between px-2">
          <h2 className="text-xs font-bold text-on-surface-variant/50">
            Cuenta Corriente
          </h2>
          <button
            onClick={() => setIsAddingCobro(true)}
            aria-label="Registrar nuevo cobro"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] border border-primary/30 hover:border-primary bg-primary/10 transition-[background-color,border-color,transform] duration-200 ease-spring text-[11px] font-bold text-primary active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 hit-padding"
          >
            <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90 duration-300" strokeWidth={2.5} />
            Registrar Cobro
          </button>
        </div>

        <div className="space-y-3">
          <Modal
            isOpen={isAddingCobro}
            onClose={() => setIsAddingCobro(false)}
            title="Registrar Cobro"
          >
            <CobroForm onSave={handleSaveCobro} onCancel={() => setIsAddingCobro(false)} isSaving={isSaving} />
          </Modal>

          <Modal
            isOpen={editingCobro !== null}
            onClose={() => setEditingCobro(null)}
            title="Editar Cobro"
          >
            {editingCobro && (
              <CobroForm
                initialData={editingCobro}
                onSave={handleSaveCobro}
                onCancel={() => setEditingCobro(null)}
                isSaving={isSaving}
              />
            )}
          </Modal>

          {isLoadingTransactions ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <TransactionsTimeline 
              transactions={transacciones} 
              cobros={cobros} 
              onEditCobro={setEditingCobro} 
              onDeleteCobro={removeCobro} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
