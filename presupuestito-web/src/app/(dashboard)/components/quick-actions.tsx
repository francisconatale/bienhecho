import { PlusCircle, UserPlus, Briefcase } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <section className="transition-all w-full">
      <h2 className="text-[10px] md:text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1 hidden md:block">
        Acciones
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full">
        <Link 
          href="/trabajos/nuevo" 
          className="col-span-2 md:col-span-1 w-full h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-white text-[15px] bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          <PlusCircle className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
          <span>Nuevo Trabajo</span>
        </Link>
        <Link 
          href="/trabajos" 
          className="w-full h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-primary text-[15px] bg-primary/10 hover:bg-primary/20 active:scale-[0.98] transition-all border border-primary/20"
        >
          <Briefcase className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
          <span>Trabajos</span>
        </Link>
        <Link 
          href="/clientes" 
          className="w-full h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-on-surface-variant text-[15px] bg-surface-variant/30 hover:bg-surface-variant/40 active:scale-[0.98] transition-all border border-outline-variant/20"
        >
          <UserPlus className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
          <span>Clientes</span>
        </Link>
      </div>
    </section>
  );
}
