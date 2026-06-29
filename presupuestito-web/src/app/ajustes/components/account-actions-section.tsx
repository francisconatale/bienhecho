"use client";

import { Row } from "./row";

export function AccountActionsSection() {
  return (
    <section>
      <div className="bg-surface/80 rounded-[32px] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] border border-error/20 overflow-hidden">
        <Row type="destructive" label="Cerrar Sesión" />
      </div>
    </section>
  );
}
