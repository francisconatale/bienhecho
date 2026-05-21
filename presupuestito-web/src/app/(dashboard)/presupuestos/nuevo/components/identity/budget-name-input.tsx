"use client";

import { useBudgetStore } from "../../hooks/use-budget";
import { useDataStore } from "@/lib/store";
import { useUserStore } from "@/lib/user-store";
import { TRADES } from "@/lib/trades";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function BudgetNameInput() {
  const { budgetName, setBudgetName, clientId } = useBudgetStore();
  const { clients } = useDataStore();
  const { user } = useUserStore();
  const [showAllTrades, setShowAllTrades] = useState(false);

  const selectedClient = clients.find(c => c.id === clientId);
  const clientName = selectedClient ? selectedClient.name : "Cliente";

  const handleSuggest = (template: string) => {
    const suggestedName = template.replace("{clienteProject}", clientName);
    setBudgetName(suggestedName);
  };

  // Find user's specific trade
  const userTrade = TRADES.find(t => t.id === user?.tradeId);
  
  // Trades to show
  const suggestedTrades = showAllTrades 
    ? TRADES 
    : (userTrade ? [userTrade] : TRADES.slice(0, 3));

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#2563EB]/60 ml-1">
          Nombre del Presupuesto
        </label>
        <div className="relative">
          <input
            type="text"
            value={budgetName}
            onChange={(e) => setBudgetName(e.target.value)}
            placeholder="Ej: Diseño de Identidad Visual - Q2"
            className="w-full bg-surface-variant/5 border border-outline-variant/30 rounded-2xl px-6 py-4 text-xl font-black text-on-surface focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/5 outline-none transition-all placeholder:text-on-surface-variant/20 shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-[#2563EB]/40" />
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">
              {userTrade ? `Sugerencia para ${userTrade.label}` : "Sugerencias por rubro"}
            </span>
          </div>
          <button 
            type="button"
            onClick={() => setShowAllTrades(!showAllTrades)}
            className="text-[9px] font-black uppercase tracking-widest text-[#2563EB] hover:opacity-70 transition-opacity flex items-center gap-1"
          >
            {showAllTrades ? "Ver menos" : "Ver todos"}
            {showAllTrades ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
        
        <div className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {suggestedTrades.map((trade) => (
            <button
              key={trade.id}
              onClick={() => handleSuggest(trade.template)}
              type="button"
              className="whitespace-nowrap px-4 py-2 bg-surface border border-outline-variant/20 rounded-xl text-[11px] font-bold text-on-surface-variant hover:border-[#2563EB]/30 hover:bg-[#2563EB]/5 hover:text-[#2563EB] transition-all active:scale-95 shrink-0"
            >
              {trade.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
