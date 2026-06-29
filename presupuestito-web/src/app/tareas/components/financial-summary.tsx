import { useState, useEffect } from "react";
import { useFinancialSummary } from "../hooks/use-financial-summary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function FinancialSummary() {
  const [mounted, setMounted] = useState(false);
  const { totalAFacturar } = useFinancialSummary();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-surface/10 border border-outline-variant/5 rounded-[24px] h-[124px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (totalAFacturar === 0) return null;

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-[24px] p-6 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-48 h-48 fill-primary">
          <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18,95.5,-3.1C94.1,11.8,85.4,26.1,75.1,38.6C64.8,51.1,52.8,61.8,39.6,70.5C26.4,79.2,11.9,85.9,-3.3,91.3C-18.5,96.7,-34.5,100.8,-47.8,94.1C-61.1,87.4,-71.7,70,-80.1,53.4C-88.5,36.8,-94.7,21,-95.7,5C-96.7,-11,-92.5,-26.2,-84.6,-39.7C-76.7,-53.2,-65,-64.9,-51.7,-72.4C-38.4,-79.9,-23.5,-83.2,-8.1,-79.1C7.3,-75,23.5,-63.5,30.5,-83.6" transform="translate(100 100) scale(1.1)" />
        </svg>
      </div>
      <div className="relative z-10">
        <p className="text-sm font-medium text-primary/80 mb-1">Al terminar podés facturar</p>
        <div className="text-3xl font-bold text-primary">
          ${totalAFacturar.toLocaleString("es-AR")}
        </div>
      </div>
    </div>
  );
}
