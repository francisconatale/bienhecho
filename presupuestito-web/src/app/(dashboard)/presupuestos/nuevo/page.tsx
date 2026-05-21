"use client";

import { useState } from "react";
import Link from "next/link";
import { Save, Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { BudgetIdentity } from "./components/identity/budget-identity";
import { ConceptList } from "./components/concepts/concept-list";
import { TotalsSummary } from "./components/totals-summary";
import { NotesField } from "./components/notes-field";
import { useBudgetStore } from "./hooks/use-budget";
import { useDataStore } from "@/lib/store";

export default function NuevoPresupuestoPage() {
  const { step, setStep, clientId, budgetName, concepts } = useBudgetStore();
  const { clients } = useDataStore();
  const [isSaving, setIsSaving] = useState(false);

  const selectedClient = clients.find((c) => c.id === clientId);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 2000);
  };

  const canContinue = budgetName.length >= 2 && !!clientId;
  const canSave = concepts.length > 0;

  return (
    <>
      <main className="flex-1 pb-32 w-full pt-4 md:pt-10 transition-all max-w-2xl mx-auto px-4">
        {/* Breadcrumb Visual mejorado */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-md">
              Paso {step} de 2
            </span>
            <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
              {step === 1 ? "Título y cliente (2 pasos rápidos)" : "Detalle de conceptos"}
            </span>
          </div>
          <div className="h-1.5 w-full bg-surface-variant/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-700 ease-out" 
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Paso 1: Identidad */}
        {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tight text-on-surface mb-2">
                        Nuevo Presupuesto
                    </h1>
                    <p className="text-sm text-on-surface-variant/60 font-medium">
                        Completa la información básica para comenzar.
                    </p>
                </div>
                <BudgetIdentity />
                
                <div className="mt-8 flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-[11px] font-bold text-primary/80 leading-tight">
                        Tip: Puedes crear clientes y campañas directamente desde los selectores de arriba.
                    </p>
                </div>
            </div>
        )}

        {/* Paso 2: Conceptos y Resumen */}
        {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                {/* Contexto Persistente Compacto */}
                <div className="p-5 bg-surface rounded-2xl border border-outline-variant/30 flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">Cliente</span>
                        <h2 className="text-sm font-bold text-on-surface leading-none">
                            {selectedClient?.name}
                        </h2>
                    </div>
                    <div className="text-right space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">Presupuesto</span>
                        <h2 className="text-sm font-bold text-on-surface italic leading-none">
                            {budgetName}
                        </h2>
                    </div>
                </div>

                <div className="space-y-10">
                    <ConceptList />
                    <TotalsSummary />
                    
                    <div className="pt-4 border-t border-outline-variant/10">
                        <NotesField />
                    </div>
                </div>
            </div>
        )}
      </main>
      
      {/* Footer / Action Bar Optimizado */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 p-4 md:pb-8 pointer-events-none">
         <div className="max-w-2xl mx-auto flex items-center gap-4 p-2 bg-surface/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-outline-variant/20 rounded-3xl shadow-2xl pointer-events-auto">
            {step === 1 ? (
                <Link
                    href="/"
                    className="flex-1 py-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors text-center"
                >
                    Cancelar
                </Link>
            ) : (
                <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Atrás
                </button>
            )}

            <div className="flex-[2]">
                {step === 1 ? (
                    <button
                        onClick={() => setStep(2)}
                        disabled={!canContinue}
                        className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white bg-primary disabled:opacity-20 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
                    >
                        Continuar
                        <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleSave}
                        disabled={!canSave || isSaving}
                        className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white bg-primary disabled:opacity-20 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Guardar Presupuesto
                    </button>
                )}
            </div>
        </div>
      </footer>
    </>
  );
}
