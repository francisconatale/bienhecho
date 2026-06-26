import { PlusCircle, UserPlus, Briefcase } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <section className="px-5 md:px-8 lg:px-12 mt-8 mb-8 transition-all">
      <h3 className="text-xs md:text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4 px-1">
        Acciones Rápidas
      </h3>
      <div className="grid grid-cols-1 md:flex md:flex-row gap-3 md:gap-4">
        <Link href="/trabajos/nuevo" className="flex-1 md:max-w-[280px]">
          <button
            className="w-full h-[52px] md:h-14 rounded-2xl flex items-center justify-center gap-2 font-semibold text-white text-[14px] md:text-[15px] bg-primary hover:bg-primary-dark dark:bg-primary dark:hover:bg-primary-dark active:scale-[0.98] transition-all"
            style={{
              boxShadow: '0 6px 20px -6px rgba(37,99,235,0.4)'
            }}
          >
            <PlusCircle className="w-5 h-5 md:w-[22px] md:h-[22px]" strokeWidth={2} />
            <span className="truncate">Nuevo Trabajo</span>
          </button>
        </Link>
        <Link href="/trabajos" className="flex-1 md:max-w-[220px]">
          <button
            className="w-full h-[52px] md:h-14 rounded-2xl flex items-center justify-center gap-2 font-semibold text-primary dark:text-primary bg-primary/10 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 active:scale-[0.98] transition-all border border-primary/10 dark:border-primary/20"
          >
            <Briefcase className="w-5 h-5 md:w-[22px] md:h-[22px]" strokeWidth={2} />
            <span className="truncate">Ver Trabajos</span>
          </button>
        </Link>
        <Link href="/clientes" className="flex-1 md:max-w-[220px]">
          <button
            className="w-full h-[52px] md:h-14 rounded-2xl flex items-center justify-center gap-2 font-semibold text-on-surface-variant bg-surface-variant/10 hover:bg-surface-variant/20 active:scale-[0.98] transition-all border border-outline-variant/10"
          >
            <UserPlus className="w-5 h-5 md:w-[22px] md:h-[22px]" strokeWidth={2} />
            <span className="truncate">Nuevo Cliente</span>
          </button>
        </Link>
      </div>
    </section>
  );
}
