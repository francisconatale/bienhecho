import { Star, CreditCard } from "lucide-react";
import { SectionLabel } from "./section-label";
import { Row } from "./row";

export function SubscriptionSection() {
  return (
    <section>
      <SectionLabel label="Suscripción" />
      <div className="bg-surface/80 rounded-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] border border-outline-variant/20 overflow-hidden">
        <Row
          type="nav"
          icon={<Star className="w-4 h-4 text-primary" strokeWidth={2} />}
          iconBg="bg-primary/10"
          label="Plan Actual"
          value="Pro"
        />
        <div className="flex items-center gap-4 px-5 py-3.5 min-h-[56px] opacity-50 cursor-not-allowed border-b border-outline-variant/10">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4 text-primary" strokeWidth={2} />
          </div>
          <span className="flex-1 font-medium text-on-surface">Facturación</span>
          <span className="text-xs text-on-surface-variant/60 italic">Próximamente</span>
        </div>
      </div>
    </section>
  );
}
