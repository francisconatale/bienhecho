"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowRight, ArrowLeft, FileText } from "lucide-react";
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

  return (
    <>
      <main className="flex-1 w-full transition-all max-w-3xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30">
          <div className="flex items-center justify-between px-6 md:px-8 pt-5 md:pt-6 pb-4 md:pb-5">
            <div className="flex items-center gap-3">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="p-1.5 -ml-1.5 hover:bg-surface-variant/20 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-on-surface-variant" />
                </button>
              )}
              <div>
                <h1 className="text-lg md:text-xl font-semibold text-on-surface tracking-tight">
                  {step === 1 ? "Nuevo Presupuesto" : budgetName}
                </h1>
                {step === 2 && selectedClient && (
                  <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">{selectedClient.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {step === 2 && (
                <>
                  <button
                    onClick={handleDownloadPreview}
                    disabled={isDownloading || !canSave}
                    className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-30"
                  >
                    {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                    Preview
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!canSave || isSaving}
                    className="px-3 md:px-4 py-1.5 md:py-2 bg-primary text-on-primary text-xs md:text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-1.5 disabled:opacity-30"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Guardar
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="px-6 md:px-8 pb-4 md:pb-5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      s <= step ? "bg-primary w-8 md:w-10" : "bg-outline-variant w-4 md:w-5"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] md:text-xs font-medium text-on-surface-variant/60">
                {step === 1 ? "Identidad" : "Conceptos"}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 md:px-8 py-6 md:py-8">
          {/* Step 1: Identity */}
          {step === 1 && (
            <div className="space-y-5 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Title */}
              <div>
                <label className="text-xs md:text-sm font-medium text-on-surface-variant mb-1.5 md:mb-2 block">
                  Nombre del presupuesto
                </label>
                <input
                  type="text"
                  value={budgetName}
                  onChange={(e) => useBudgetStore.getState().setBudgetName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-on-surface-variant/40"
                  placeholder="Ej: Rediseño Web - Q2"
                />
              </div>

              <BudgetIdentity />

              {/* Continue */}
              <button
                onClick={() => setStep(2)}
                disabled={!canContinue}
                className="w-full py-2.5 md:py-3 bg-primary text-on-primary text-sm md:text-base font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-30"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Concepts */}
          {step === 2 && (
            <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ConceptList />
              <TotalsSummary />
              <NotesField />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Footer */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
        <div className="max-w-2xl mx-auto px-0">
          <div className="bg-surface/95 backdrop-blur-xl border border-outline-variant/30 rounded-2xl shadow-2xl pointer-events-auto p-3">
            <div className="flex items-center gap-3">
              {step === 1 ? (
                <Link
                  href="/"
                  className="py-2.5 px-4 text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Cancelar
                </Link>
              ) : (
                <button
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Atrás
                </button>
              )}

              {step === 2 && (
                <button
                  onClick={handleDownloadPreview}
                  disabled={isDownloading || !canSave}
                  className="py-2.5 px-4 rounded-lg text-xs font-medium text-on-surface-variant bg-surface-variant/20 hover:bg-surface-variant/30 transition-colors flex items-center gap-1.5 disabled:opacity-30"
                >
                  {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                  Preview
                </button>
              )}

              {step === 1 ? (
                <button
                  onClick={() => setStep(2)}
                  disabled={!canContinue}
                  className="flex-[2] py-2.5 rounded-lg bg-primary text-on-primary text-xs font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  Continuar
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={!canSave || isSaving}
                  className="flex-[2] py-2.5 rounded-lg bg-primary text-on-primary text-xs font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Guardar
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
