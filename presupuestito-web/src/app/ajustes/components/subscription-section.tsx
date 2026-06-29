import { Star, CreditCard } from "lucide-react";
import { SectionLabel } from "./section-label";
import { Row } from "./row";

export function SubscriptionSection() {
  return (
    <section>
      <SectionLabel label="Suscripción" />
      <div className="bg-surface/80 rounded-[32px] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] border border-outline-variant/20 overflow-hidden">
        <Row
          type="nav"
          icon={<Star className="w-4 h-4 text-primary" strokeWidth={2} />}
          iconBg="bg-primary/10"
          label="Plan Actual"
          value="Pro"
        />
        <Row
          type="nav"
          icon={
            <CreditCard className="w-4 h-4 text-primary" strokeWidth={2} />
          }
          iconBg="bg-primary/10"
          label="Facturación"
        />
      </div>
    </section>
  );
}
