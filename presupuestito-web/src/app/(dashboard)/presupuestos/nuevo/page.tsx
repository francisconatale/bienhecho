"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { ClientSelector } from "./components/client-selector";
import { ConceptList } from "./components/concept-list";
import { TotalsSummary } from "./components/totals-summary";
import { NotesField } from "./components/notes-field";
import { useBudgetStore } from "./hooks/use-budget";

export default function NuevoPresupuestoPage() {
  const { step, setStep, workId } = useBudgetStore();

  return (
    <div className="relative w-full min-h-screen">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 right-0 h-[450px] md:h-[1200px] pointer-events-none overflow-hidden transition-all duration-700"
           style={{ zIndex: -1, WebkitMaskImage: 'linear-gradient(to bottom, black 15%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 15%, transparent 100%)' }}>
        <div className="absolute top-[-50px] right-[10%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-blue-500/20 md:bg-blue-500/15 blur-[100px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700" />
        <div className="absolute top-[80px] left-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/20 md:bg-indigo-500/15 blur-[110px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700" />
        <div className="hidden dark:block absolute top-[50px] left-1/2 -translate-x-1/2 w-[800px] md:w-[1200px] h-[300px] md:h-[600px] bg-[#3B82F6]/25 md:bg-[#3B82F6]/15 blur-[140px] md:blur-[180px] rounded-[100%] transition-all duration-700" />
      </div>

      <main className="relative flex-1 px-5 pt-14 md:pt-20 pb-32 md:pb-16 max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto w-full space-y-6 transition-all">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          {step === 1 ? (
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition-colors pb-1 text-[15px] select-none flex items-center gap-1"
            >
              Cancelar
            </Link>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="text-gray-600 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition-colors pb-1 text-[15px] select-none flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
          )}

          <h1 className="text-[20px] leading-tight font-bold text-gray-900 dark:text-white tracking-tight absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
            {step === 1 ? "Seleccionar Cliente" : "Detalles del Presupuesto"}
          </h1>

          {step === 2 && (
            <button
              className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors pb-1 text-[15px] select-none flex items-center gap-1"
            >
              <Save className="w-4 h-4" /> Guardar
            </button>
          )}
        </div>

        {/* Step 1: Selection */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <ClientSelector />
            <div className="pt-4">
              <button
                disabled={!workId}
                onClick={() => setStep(2)}
                className={`w-full py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
                  workId 
                    ? "bg-primary hover:bg-primary/90 shadow-primary/20" 
                    : "bg-gray-300 dark:bg-gray-800 cursor-not-allowed text-gray-500"
                }`}
              >
                Continuar <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Content */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <ConceptList />
            <TotalsSummary />
            <NotesField />
          </div>
        )}
      </main>
    </div>
  );
}
