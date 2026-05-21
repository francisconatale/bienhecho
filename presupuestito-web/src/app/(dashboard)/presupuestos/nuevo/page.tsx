"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowRight, ArrowLeft, CheckCircle2, FileText } from "lucide-react";
import { BudgetIdentity } from "./components/identity/budget-identity";
import { ConceptList } from "./components/concepts/concept-list";
import { TotalsSummary } from "./components/totals-summary";
import { NotesField } from "./components/notes-field";
import { useBudgetStore } from "./hooks/use-budget";
import { useDataStore } from "@/lib/store";
import { useBudgetPDF } from "@/hooks/use-budget-pdf";

export default function NuevoPresupuestoPage() {
  const router = useRouter();
  const { step, setStep, clientId, jobId, budgetName, concepts, currency, reset } = useBudgetStore();
  const { clients, addBudget } = useDataStore();
  const { downloadPDF } = useBudgetPDF();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedClient = clients.find((c) => c.id === clientId);

  const parseAmount = (amountStr: string) => {
    const cleanStr = amountStr.replace(/\./g, "").replace(",", ".");
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  const handleDownloadPreview = async () => {
    if (!mounted) return;
    setIsDownloading(true);
    try {
      await downloadPDF({ clientId, jobId, total: 0 }, concepts);
    } catch (err) {
      console.error("PDF Error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSave = () => {
    if (!clientId || concepts.length === 0) return;
    
    setIsSaving(true);
    
    const subtotal = concepts.reduce((acc, concept) => acc + parseAmount(concept.amount), 0);
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    // Simulate API delay
    setTimeout(() => {
      addBudget({
        clientId,
        jobId: jobId || "",
        name: budgetName,
        concepts: [...concepts],
        type: "Presupuesto",
        total: total,
      });
      
      reset();
      setIsSaving(false);
      router.push("/");
    }, 1500);
  };

  const canContinue = budgetName.length >= 2 && !!clientId;
  const canSave = concepts.length > 0;

  // Componente de botones para reutilizar en el flujo
  const NavigationActions = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-4 ${className}`}>
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

      <div className="flex-[2] flex gap-3">
        {step === 2 && (
            <button
                onClick={handleDownloadPreview}
                disabled={isDownloading || !canSave}
                className="flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                <span className="hidden md:inline">Vista Previa</span>
            </button>
        )}
        
        {step === 1 ? (
          <button
            onClick={() => setStep(2)}
            disabled={!canContinue}
            className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] disabled:bg-[#2563EB]/40 disabled:text-white/60 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#2563EB]/20"
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={!canSave || isSaving}
            className="flex-[2] py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] disabled:bg-[#2563EB]/40 disabled:text-white/60 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#2563EB]/20"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Guardar
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <main className="flex-1 pb-44 w-full pt-4 md:pt-10 transition-all max-w-2xl mx-auto px-4">
        {/* Breadcrumb Visual */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-[#2563EB]/10 text-[#2563EB] text-[10px] font-black uppercase tracking-widest rounded-md">
              Paso {step} de 2
            </span>
            <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
              {step === 1 ? "Título y cliente" : "Detalle de conceptos"}
            </span>
          </div>
          <div className="h-1.5 w-full bg-surface-variant/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#2563EB] transition-all duration-700 ease-out" 
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
                
                <div className="mt-8 flex items-center gap-3 p-4 bg-[#2563EB]/5 rounded-2xl border border-[#2563EB]/10">
                    <div className="w-8 h-8 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <p className="text-[11px] font-bold text-[#2563EB]/80 leading-tight">
                        Tip: Puedes crear clientes y trabajos directamente desde los selectores de abajo.
                    </p>
                </div>

                {/* Acciones integradas en desktop */}
                <div className="hidden md:block mt-12 pt-8 border-t border-outline-variant/10">
                    <NavigationActions />
                </div>
            </div>
        )}

        {/* Paso 2: Conceptos y Resumen */}
        {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                {/* Contexto Persistente Compacto */}
                <div className="p-5 bg-surface rounded-2xl border border-outline-variant/30 flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#2563EB]/60">Cliente</span>
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

                {/* Acciones integradas en desktop */}
                <div className="hidden md:block mt-12 pt-8 border-t border-outline-variant/10">
                    <NavigationActions />
                </div>
            </div>
        )}
      </main>
      
      {/* Footer / Action Bar - Solo visible en móvil */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
         <div className="max-w-2xl mx-auto px-0">
            <div className="bg-surface/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-outline-variant/20 rounded-[28px] shadow-2xl pointer-events-auto p-2">
                <NavigationActions />
            </div>
         </div>
      </footer>
    </>
  );
}
