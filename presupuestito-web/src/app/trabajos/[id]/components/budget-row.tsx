"use client";

import { Budget } from "@/types";
import { FileText, ChevronRight } from "lucide-react";

interface BudgetRowProps {
  budget: Budget;
}

export function BudgetRow({ budget }: BudgetRowProps) {
  return (
    <div className="flex items-center justify-between p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-500" />
        </div>
        <div>
            <h4 className="text-sm font-bold text-on-surface">Presupuesto {budget.type}</h4>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">
                Emitido el {new Date(budget.date).toLocaleDateString()}
            </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="font-black text-base text-on-surface tabular-nums">
          ${budget.total.toLocaleString("es-AR", { minimumFractionDigits: 0 })}
        </span>
        <ChevronRight className="w-4 h-4 text-on-surface-variant/20 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}
