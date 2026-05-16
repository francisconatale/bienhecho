import { FileText, Banknote } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: "surface" | "primary";
}

function SummaryCard({ title, value, icon, variant = "surface" }: SummaryCardProps) {
  const containerClasses = variant === "primary"
    ? "bg-primary text-on-primary"
    : "bg-surface text-on-surface border border-outline-variant/30 shadow-sm";

  const iconWrapperClasses = variant === "primary"
    ? "bg-white/10 text-white"
    : "bg-primary-container/10 text-primary";

  const subTextClasses = variant === "primary"
    ? "text-white/80"
    : "text-on-surface-variant";

  return (
    <div className={`${containerClasses} rounded-2xl p-5 flex flex-col justify-between aspect-square`}>
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${iconWrapperClasses}`}>
          {icon}
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold">{value}</h2>
        <p className={`text-sm mt-1 font-medium uppercase tracking-wider ${subTextClasses}`}>
          {title}
        </p>
      </div>
    </div>
  );
}

export function SummarySection() {
  return (
    <section className="grid grid-cols-2 gap-4">
      <SummaryCard
        title="Activos"
        value="12"
        icon={<FileText className="w-6 h-6" strokeWidth={2} />}
      />
      <SummaryCard
        title="Pendiente"
        value="$4,500"
        variant="primary"
        icon={<Banknote className="w-6 h-6" strokeWidth={2} />}
      />
    </section>
  );
}
