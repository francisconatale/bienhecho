"use client";

import { useBudgetStore } from "../../hooks/use-budget";

export function BudgetNameInput() {
  const { budgetName, setBudgetName } = useBudgetStore();

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">
        Nombre del Presupuesto
      </label>
      <div className="relative">
        <input
          type="text"
          value={budgetName}
          onChange={(e) => setBudgetName(e.target.value)}
          placeholder="Ej: Diseño de Identidad Visual - Q2"
          className="w-full bg-surface-variant/5 border border-outline-variant/30 rounded-2xl px-6 py-4 text-xl font-black text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-on-surface-variant/20 shadow-sm"
        />
      </div>
    </div>
  );
}
