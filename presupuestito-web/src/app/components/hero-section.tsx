import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="px-6 pt-28 pb-16 md:pt-32 md:pb-24 min-h-[100dvh] md:min-h-[80vh] flex flex-col justify-center max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Copy & CTA */}
        <div className="flex flex-col items-start text-left">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter text-on-background mb-6 leading-[1.05]">
            Presupuestos profesionales. <br className="hidden lg:block" />
            <span className="text-on-surface-variant">Sin vueltas.</span>
          </h1>

          <p className="text-lg text-on-surface-variant max-w-lg font-medium leading-relaxed mb-8">
            Armá y enviá una cotización en PDF desde tu celular en 2 minutos. La herramienta ideal para el trabajador en la calle.
          </p>

          <div className="w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-full font-semibold transition-all hover:bg-primary-dark active:scale-[0.98] w-full sm:w-auto"
            >
              Crear mi primer presupuesto
              <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Mockup */}
        <div className="relative w-full flex justify-center lg:justify-end">
          {/* Abstract background shape */}
          <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-3 scale-105 -z-10" />
          
          {/* Mockup Card (Simulating a PDF/Ticket) */}
          <div className="w-full max-w-md bg-surface rounded-2xl shadow-xl border border-outline-variant/20 overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/20 flex items-center gap-4">
              <Image 
                src="/icon.svg" 
                alt="Bien Hecho" 
                width={40} 
                height={40} 
                className="w-10 h-10 drop-shadow-sm" 
              />
              <div>
                <div className="text-sm font-bold text-on-surface">Presupuesto #0042</div>
                <div className="text-xs text-on-surface-variant">Para: Juan Pérez</div>
              </div>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/10">
                <span className="text-sm text-on-surface-variant">Instalación eléctrica</span>
                <span className="text-sm font-semibold text-on-surface">$150.000</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/10">
                <span className="text-sm text-on-surface-variant">Materiales (cables, llaves)</span>
                <span className="text-sm font-semibold text-on-surface">$85.000</span>
              </div>
              
              <div className="pt-4 flex justify-between items-center">
                <span className="text-base font-bold text-on-surface">Total</span>
                <span className="text-xl font-bold text-primary-dark">$235.000</span>
              </div>
            </div>

            {/* Footer / Action */}
            <div className="bg-surface-container px-6 py-4 border-t border-outline-variant/20 text-center">
              <div className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-primary-dark bg-primary/10 px-4 py-2 rounded-full w-full">
                Enviado por WhatsApp
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
