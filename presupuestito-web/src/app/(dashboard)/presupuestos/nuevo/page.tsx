"use client";

import { useState } from "react";
import Link from "next/link";
import { Save, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { BudgetIdentity } from "./components/budget-identity";
import { ConceptList } from "./components/concept-list";
import { TotalsSummary } from "./components/totals-summary";
import { NotesField } from "./components/notes-field";
import { useBudgetStore } from "./hooks/use-budget";

export default function NuevoPresupuestoPage() {
  const { step, setStep, clientId, concepts } = useBudgetStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    console.log("Saving budget...");
    setTimeout(() => {
      setIsSaving(false);
    }, 2000);
  };
  
  const canContinue = !!clientId;
  const canSave = canContinue && concepts.length > 0;

  return (
    <>
      <main className="flex-1 px-4 pt-12 pb-40 max-w-3xl mx-auto w-full space-y-8">
        <div className="text-center mb-8 animate-in fade-in duration-300">
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
                {step === 1 ? 'Identificación del Presupuesto' : 'Conceptos y Totales'}
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
                {step === 1 ? 'Define el nombre, cliente y proyecto asociado.' : 'Añade los conceptos que forman el presupuesto.'}
            </p>
        </div>

        {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <BudgetIdentity />
            </div>
        )}

        {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ConceptList />
                <TotalsSummary />
                <NotesField />
            </div>
        )}
      </main>
      
      {/* Barra de Acciones Minimalista */}
      <footer className="fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none">
         <div className="max-w-2xl mx-auto flex items-center justify-between p-3 bg-surface/80 dark:bg-zinc-900/80 backdrop-blur-lg border border-outline-variant/10 rounded-2xl shadow-xl pointer-events-auto">
            {step === 1 ? (
                <Link
                href="/"
                className="px-4 py-2 text-[13px] font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
                >
                Cancelar
                </Link>
            ) : (
                <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-[13px] font-semibold text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1.5"
                >
                <ArrowLeft className="w-3.5 h-3.5" />
                Volver
                </button>
            )}

            {step === 1 ? (
                <button
                    onClick={() => setStep(2)}
                    disabled={!canContinue}
                    className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-white bg-primary disabled:opacity-30 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    Continuar
                    <ArrowRight className="w-4 h-4" />
                </button>
            ) : (
                <button
                    onClick={handleSave}
                    disabled={!canSave || isSaving}
                    className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-white bg-primary disabled:opacity-30 flex items-center justify-center gap-2 transition-all active:scale-95"
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
      </footer>
    </>
  );
}
