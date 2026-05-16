import { PlusCircle } from "lucide-react";

export function QuickActions() {
  return (
    <section className="flex gap-4">
      <button className="flex-1 bg-surface rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-center gap-3 hover:bg-surface-variant transition-all active:scale-[0.98] duration-100 ease-in-out">
        <PlusCircle className="w-6 h-6 text-primary" strokeWidth={2} />
        <span className="font-semibold text-primary">Nuevo Presupuesto</span>
      </button>
    </section>
  );
}
