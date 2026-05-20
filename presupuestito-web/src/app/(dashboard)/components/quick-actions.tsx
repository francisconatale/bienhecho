import { PlusCircle } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <section className="px-4">
      <Link href="/presupuestos/nuevo" className="block">
        <button
          className="w-full h-14 rounded-full flex items-center justify-center gap-3 font-semibold text-white text-base hover:opacity-90 active:scale-[0.98] transition-all duration-100 ease-in-out"
          style={{
            background: "linear-gradient(90deg, #3A7BD5 0%, #1E3A8A 100%)",
            boxShadow: "0 0 24px rgba(59, 130, 246, 0.35)",
          }}
        >
          <PlusCircle className="w-6 h-6" strokeWidth={2} />
          Nuevo Presupuesto
        </button>
      </Link>
    </section>
  );
}
