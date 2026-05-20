"use client";

import { Budget } from "@/types";
import { ListItem } from "@/components/ui/list-item";
import { Receipt } from "lucide-react";

interface BudgetRowProps {
  budget: Budget;
}

export function BudgetRow({ budget }: BudgetRowProps) {
  return (
    <ListItem
      icon={<Receipt className="w-5 h-5 opacity-70" />}
      title={`Presupuesto de ${budget.type}`}
      onClick={() => {}}
      trailing={
        <span className="font-semibold text-on-surface">
          ${budget.total.toLocaleString()}
        </span>
      }
    />
  );
}