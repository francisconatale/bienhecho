import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="px-6 py-24 md:py-32 border-t border-outline-variant/20">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-on-surface mb-6 leading-[1.05]">
          Tu trabajo es profesional.<br className="hidden md:block" />
          Tu presupuesto también.
        </h2>
        
        <p className="text-lg md:text-xl text-on-surface-variant mb-10 max-w-xl font-medium">
          Dejá de perder tiempo con mensajes informales. Hacelo bien, rápido y desde el celular.
        </p>
        
        <Link
          href="/dashboard"
          className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary font-semibold rounded-full transition-all hover:bg-primary-dark active:scale-[0.98] w-full sm:w-auto"
        >
          Crear mi primer presupuesto
          <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>
    </section>
  );
}
