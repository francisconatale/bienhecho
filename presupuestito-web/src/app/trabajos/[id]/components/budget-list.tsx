"use client";

import { BudgetRow } from "./budget-row";
import { ListGroup } from "@/components/ui/list-group";
import { MOCK_BUDGETS } from "@/mocks";

interface BudgetListProps {
  workId: string;
}

export function BudgetList({ workId }: BudgetListProps) {
  const budgets = MOCK_BUDGETS.filter((b) => b.workId === workId);

  return (
    <ListGroup>
      {budgets.length > 0 ? (
        budgets.map((budget) => <BudgetRow key={budget.id} budget={budget} />)
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-on-surface-variant">
          <p className="text-sm font-medium">No hay presupuestos generados.</p>
        </div>
      )}
    </ListGroup>
  );
}