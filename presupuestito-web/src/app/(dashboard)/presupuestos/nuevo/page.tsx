"use client";

import { useState } from "react";
import Link from "next/link";
import { Save, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { BudgetIdentity } from "./components/budget-identity";
import { ConceptList } from "./components/concept-list";
import { TotalsSummary } from "./components/totals-summary";
import { NotesField } from "./components/notes-field";
import { useBudgetStore } from "./hooks/use-budget";

export default function NuevoPresupuestoPage() {
  const { clientId, concepts } = useBudgetStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Here you would typically call an API
    console.log("Saving budget...");
    setTimeout(() => {
      setIsSaving(false);
      // redirect or show success message
    }, 2000);
  };
  
  const canSave = !!clientId && concepts.length > 0;

  return (
    <>
      <Header title="Nuevo Presupuesto" />
      <main className="flex-1 px-4 py-6 space-y-8 mt-20 pb-32 max-w-3xl mx-auto w-full">
        <BudgetIdentity />
        <ConceptList />
        <TotalsSummary />
        <NotesField />
      </main>
      
      {/* Floating Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4 border-t border-outline-variant/10 z-10">
         <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Cancelar
            </Link>
            <button
              onClick={handleSave}
              disabled={!canSave || isSaving}
              className="px-6 py-3 rounded-xl font-bold text-white bg-primary disabled:bg-gray-300 disabled:text-gray-500 flex items-center justify-center gap-2 uppercase tracking-wider transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>Guardar</span>
            </button>
        </div>
      </footer>
    </>
  );
}
