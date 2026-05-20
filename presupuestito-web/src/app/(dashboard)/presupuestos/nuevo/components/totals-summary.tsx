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
    <section>
      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="flex justify-between px-4 py-3 border-b border-outline-variant/10">
          <span className="text-on-surface">Subtotal</span>
          <span className="text-on-surface font-medium">{formatAmount(subtotalNum)} {currency}</span>
        </div>
        <div className="flex justify-between px-4 py-3 border-b border-outline-variant/10">
          <span className="text-on-surface">IVA ({ivaRate}%)</span>
          <span className="text-on-surface font-medium">{formatAmount(ivaNum)} {currency}</span>
        </div>
        <div className="flex justify-between px-4 py-4">
          <span className="font-bold text-lg text-on-surface">Total</span>
          <span className="font-bold text-lg text-primary">{formatAmount(totalNum)} {currency}</span>
        </div>
      </div>
    </section>
  );
}
