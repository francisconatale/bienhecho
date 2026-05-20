"use client";

import { User, ChevronRight, PlusCircle } from "lucide-react";

export function NuevoPresupuestoContent() {
  return (
    <div className="space-y-6">
      {/* Section: CLIENTE */}
      <section>
        <h2 className="px-4 pb-2 font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
          Cliente
        </h2>
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-variant/30 transition-colors text-left group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <User className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <span className="font-semibold text-on-surface">Seleccionar Cliente</span>
            </div>
            <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors" strokeWidth={2.5} />
          </button>
        </div>
      </section>

      {/* Section: CONCEPTOS */}
      <section>
        <h2 className="px-4 pb-2 font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
          Conceptos
        </h2>
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden mb-3">
          {/* Concept Item 1 */}
          <div className="flex flex-col gap-1 px-4 py-3 border-b border-outline-variant/10 last:border-0">
            <div className="flex justify-between w-full">
              <span className="font-semibold text-on-surface">Diseño de Interfaz UX/UI</span>
              <span className="font-semibold text-on-surface">850,00 €</span>
            </div>
            <span className="text-xs text-on-surface-variant">Proyecto completo de rediseño móvil</span>
          </div>
          
          {/* Concept Item 2 */}
          <div className="flex flex-col gap-1 px-4 py-3 border-b border-outline-variant/10 last:border-0">
            <div className="flex justify-between w-full">
              <span className="font-semibold text-on-surface">Consultoría Técnica</span>
              <span className="font-semibold text-on-surface">120,00 €</span>
            </div>
            <span className="text-xs text-on-surface-variant">2 horas de auditoría de sistema</span>
          </div>
        </div>
        
        {/* Add Button */}
        <button className="flex items-center gap-2 px-4 py-2 text-primary font-semibold active:scale-95 transition-transform">
          <PlusCircle className="w-6 h-6" strokeWidth={2} />
          <span>Añadir Concepto</span>
        </button>
      </section>

      {/* Section: TOTALES */}
      <section>
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="flex justify-between px-4 py-3 border-b border-outline-variant/10">
            <span className="text-on-surface">Subtotal</span>
            <span className="text-on-surface font-medium">970,00 €</span>
          </div>
          <div className="flex justify-between px-4 py-3 border-b border-outline-variant/10">
            <span className="text-on-surface">IVA (21%)</span>
            <span className="text-on-surface font-medium">203,70 €</span>
          </div>
          <div className="flex justify-between px-4 py-4">
            <span className="font-bold text-lg text-on-surface">Total</span>
            <span className="font-bold text-lg text-primary">1.173,70 €</span>
          </div>
        </div>
      </section>

      {/* Section: NOTAS */}
      <section>
        <h2 className="px-4 pb-2 font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
          Notas
        </h2>
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="p-4">
            <textarea 
              className="w-full bg-transparent border-none p-0 focus:ring-0 font-body text-on-surface placeholder:text-outline resize-none" 
              placeholder="Notas adicionales para el presupuesto..." 
              rows={4}
            ></textarea>
          </div>
        </div>
        <p className="px-4 pt-2 text-[11px] text-on-surface-variant leading-tight">
          Estas notas aparecerán en el PDF final del presupuesto.
        </p>
      </section>
    </div>
  );
}
