"use client";

import { useBudgetStore, Currency } from "../hooks/use-budget";

export function TotalsSummary() {
  const { concepts, currency, setCurrency } = useBudgetStore();

  const parseAmount = (amountStr: string) => {
    const cleanStr = amountStr.replace(/\./g, "").replace(",", ".");
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  const formatAmount = (num: number) => {
    return num.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const subtotalNum = concepts.reduce((acc, concept) => acc + parseAmount(concept.amount), 0);
  const ivaRate = 21;
  const ivaNum = subtotalNum * (ivaRate / 100);
  const totalNum = subtotalNum + ivaNum;

  return (
    <section className="bg-surface rounded-xl md:rounded-2xl border border-outline-variant/30 p-4 md:p-5">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <span className="text-xs md:text-sm font-medium text-on-surface-variant">Resumen</span>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
          className="text-[10px] md:text-xs bg-surface-container-low border border-outline-variant/20 px-2 md:px-3 py-1 md:py-1.5 rounded font-medium text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="€">EUR</option>
          <option value="$">USD</option>
          <option value="£">GBP</option>
          <option value="ARS">ARS</option>
        </select>
      </div>

      <div className="space-y-2 md:space-y-2.5">
        <div className="flex justify-between text-xs md:text-sm">
          <span className="text-on-surface-variant/60">Subtotal</span>
          <span className="font-medium tabular-nums text-on-surface">{formatAmount(subtotalNum)}</span>
        </div>
        <div className="flex justify-between text-xs md:text-sm">
          <span className="text-on-surface-variant/60">IVA {ivaRate}%</span>
          <span className="font-medium tabular-nums text-on-surface">{formatAmount(ivaNum)}</span>
        </div>
        <div className="h-px bg-outline-variant/20 my-2 md:my-3" />
        <div className="flex justify-between">
          <span className="text-xs md:text-sm font-medium text-on-surface-variant">Total</span>
          <div className="text-right">
            <span className="text-xl md:text-2xl font-semibold tabular-nums text-on-surface">{formatAmount(totalNum)}</span>
            <span className="text-[10px] md:text-xs text-on-surface-variant/60 ml-1">{currency}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
