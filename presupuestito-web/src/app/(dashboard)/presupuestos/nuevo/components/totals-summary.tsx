"use client";

import { useBudgetStore } from "../hooks/use-budget";

export function TotalsSummary() {
  const { concepts, currency } = useBudgetStore();
  
  // Helper to parse "150,00" to 150.00
  const parseAmount = (amountStr: string) => {
    const cleanStr = amountStr.replace(/\./g, "").replace(",", ".");
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  // Helper to format 150.00 to "150,00"
  const formatAmount = (num: number) => {
    return num.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const subtotalNum = concepts.reduce((acc, concept) => acc + parseAmount(concept.amount), 0);
  const ivaRate = 21; // Could also be in store later
  const ivaNum = subtotalNum * (ivaRate / 100);
  const totalNum = subtotalNum + ivaNum;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-surface-container-low/50 dark:bg-white/5 rounded-[28px] border border-outline-variant/20 p-6 space-y-4">
        <div className="flex justify-between items-center px-1">
          <span className="font-black text-[11px] text-on-surface-variant/60 uppercase tracking-widest">Subtotal</span>
          <span className="font-black text-[15px] text-on-surface tabular-nums">
            {formatAmount(subtotalNum)} <span className="opacity-20 text-[10px] font-bold">{currency}</span>
          </span>
        </div>
        <div className="flex justify-between items-center px-1">
          <span className="font-black text-[11px] text-on-surface-variant/60 uppercase tracking-widest">IVA ({ivaRate}%)</span>
          <span className="font-black text-[15px] text-on-surface tabular-nums">
            {formatAmount(ivaNum)} <span className="opacity-20 text-[10px] font-bold">{currency}</span>
          </span>
        </div>
        <div className="pt-5 mt-1 border-t border-outline-variant/10 flex justify-between items-end px-1">
          <div className="space-y-0.5">
            <span className="font-black text-[12px] text-primary uppercase tracking-widest leading-none">Total Presupuesto</span>
            <p className="text-[10px] font-bold text-on-surface-variant/40 lowercase italic">Impuestos incluidos</p>
          </div>
          <div className="text-right">
            <span className="block font-black text-3xl text-primary tracking-tighter tabular-nums leading-none">
              {formatAmount(totalNum)}
            </span>
            <span className="text-[11px] font-black text-primary opacity-30 uppercase tracking-[0.2em] mt-1.5 block">{currency}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
