"use client";

import { ClientSelector } from "./client-selector";
import { JobSelector } from "./job-selector";
import { EntityModals } from "./entity-modals";

export function BudgetIdentity() {
  return (
    <section className="space-y-3">
      <ClientSelector />
      <JobSelector />
      <EntityModals />
    </section>
  );
}
