"use client";

import { BudgetNameInput } from "./budget-name-input";
import { ClientSelector } from "./client-selector";
import { ProjectSelector } from "./project-selector";
import { EntityModals } from "./entity-modals";

export function BudgetIdentity() {
  return (
    <section className="space-y-8">
      <div className="pb-4">
        <BudgetNameInput />
      </div>
      
      <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden divide-y divide-outline-variant/10">
        <ClientSelector />
        <ProjectSelector />
      </div>

      <EntityModals />
    </section>
  );
}
