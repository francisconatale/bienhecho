import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { useFinancialSummary } from "../hooks/use-financial-summary";

export function FinancialSummary() {
  const [mounted, setMounted] = useState(false);
  const { totalAFacturar } = useFinancialSummary();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-surface/10 border border-outline-variant/5 rounded-2xl h-12 flex items-center justify-center">
        <div className="w-48 h-4 bg-outline-variant/10 rounded animate-pulse" />
      </div>
    );
  }

  if (totalAFacturar === 0) return null;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-surface/60 backdrop-blur-xl border border-outline-variant/20 shadow-sm transition-colors hover:bg-surface/80">
      <div className="p-3 rounded-xl bg-primary/10 text-primary shadow-inner">
        <FileText className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="text-[12px] text-on-surface-variant font-medium tracking-wide uppercase">Al terminar podés facturar</p>
        <p className="text-2xl font-bold text-on-surface mt-0.5">
          ${totalAFacturar.toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
}
