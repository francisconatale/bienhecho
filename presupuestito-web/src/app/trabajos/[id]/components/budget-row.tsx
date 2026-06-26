"use client";

import { Budget } from "@/types";
import { FileText, ChevronRight, Download, Loader2 } from "lucide-react";
import { useBudgetPDF } from "@/hooks/use-budget-pdf";
import { useState } from "react";

interface BudgetRowProps {
  budget: Budget;
}

export function BudgetRow({ budget }: BudgetRowProps) {
  const { downloadPDF } = useBudgetPDF();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      await downloadPDF(budget, budget.concepts);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-between p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
      onClick={handleDownload}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
            <h4 className="text-sm font-bold text-on-surface">{budget.name || `Presupuesto ${budget.type}`}</h4>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">
                Emitido el {new Date(budget.date).toLocaleDateString()}
            </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-6">
            <span className="font-black text-base text-on-surface tabular-nums">
              ${budget.total.toLocaleString("es-AR", { minimumFractionDigits: 0 })}
            </span>
            
            <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="p-2.5 bg-surface border border-outline-variant/20 rounded-xl text-on-surface-variant/40 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all active:scale-90"
                title="Descargar PDF"
            >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            </button>
        </div>
        <ChevronRight className="w-4 h-4 text-on-surface-variant/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}
