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
    <section className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-primary text-on-primary rounded-[32px] p-8 shadow-2xl shadow-primary/20 relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Resumen</span>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="text-[10px] bg-white/10 border-none px-3 py-1 rounded-full font-bold focus:ring-0 outline-none cursor-pointer hover:bg-white/20 transition-colors"
            >
              <option value="€">EUR</option>
              <option value="$">USD</option>
              <option value="£">GBP</option>
              <option value="ARS">ARS</option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center opacity-80">
              <span className="text-[11px] font-bold">Subtotal</span>
              <span className="text-sm font-black tabular-nums">{formatAmount(subtotalNum)}</span>
            </div>
            <div className="flex justify-between items-center opacity-80">
              <span className="text-[11px] font-bold">IVA ({ivaRate}%)</span>
              <span className="text-sm font-black tabular-nums">{formatAmount(ivaNum)}</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-black uppercase tracking-widest">Total</span>
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tighter tabular-nums leading-none">
                    {formatAmount(totalNum)}
                  </span>
                  <span className="text-sm font-black opacity-40">{currency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
