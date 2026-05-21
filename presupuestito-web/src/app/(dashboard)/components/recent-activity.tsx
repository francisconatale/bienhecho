"use client";

import { ListGroup } from "@/components/ui/list-group";
import { ListItem } from "@/components/ui/list-item";
import { useDataStore } from "@/lib/store";
import { useBudgetPDF } from "@/hooks/use-budget-pdf";
import { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";

export function RecentActivity() {
  const { budgets, clients, jobs } = useDataStore();
  const { downloadPDF } = useBudgetPDF();
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleDownload = async (budget: any) => {
    setIsDownloading(budget.id);
    try {
      await downloadPDF(budget, budget.concepts);
    } finally {
      setIsDownloading(null);
    }
  };

  const recentBudgets = budgets.slice(0, 5); // Show last 5

  return (
    <section className="px-5 md:px-8 lg:px-12 md:mt-12 transition-all">
      <div className="flex items-center justify-between mb-3 md:mb-5 px-1">
        <h3 className="text-xs md:text-sm font-bold text-on-surface-variant uppercase tracking-widest">
          Actividad Reciente
        </h3>
      </div>

      <ListGroup>
        {recentBudgets.length > 0 ? (
          recentBudgets.map((budget) => {
            const client = clients.find(c => c.id === budget.clientId);
            return (
              <ListItem
                key={budget.id}
                icon={client?.name.charAt(0) || "P"}
                title={client?.name || "Cliente desconocido"}
                subtitle={`${budget.name} • ${new Date(budget.date).toLocaleDateString()}`}
                onClick={() => handleDownload(budget)}
                trailing={
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-on-surface text-sm">
                      ${budget.total.toLocaleString()}
                    </span>
                    <div className="p-2 text-on-surface-variant/20 hover:text-[#2563EB] transition-colors">
                      {isDownloading === budget.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    </div>
                  </div>
                }
              />
            );
          })
        ) : (
          <div className="py-10 text-center bg-surface rounded-2xl border border-outline-variant/10">
            <p className="text-sm font-medium text-on-surface-variant/40 italic">No hay actividad reciente.</p>
          </div>
        )}
      </ListGroup>
    </section>
  );
}
