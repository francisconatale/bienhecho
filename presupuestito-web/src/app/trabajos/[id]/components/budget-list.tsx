"use client";

import { BudgetRow } from "./budget-row";
import { ListGroup } from "@/components/ui/list-group";
import { useDataStore } from "@/lib/store";

import { useShallow } from 'zustand/react/shallow';

interface BudgetListProps {
  jobId: string;
}

export function BudgetList({ jobId }: BudgetListProps) {
  const budgets = useDataStore(
    useShallow((state) => state.budgets.filter((b) => b.jobId === jobId))
  );

  return (
    <div className="bg-surface rounded-[32px] border border-outline-variant/30 shadow-sm overflow-hidden divide-y divide-outline-variant/10">
      {budgets.length > 0 ? (
        budgets.map((budget) => <BudgetRow key={budget.id} budget={budget} />)
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
          <p className="text-sm font-bold opacity-40">No hay presupuestos generados para este trabajo.</p>
        </div>
      )}
    </div>
  );
}
