"use client";

import { PlusCircle } from "lucide-react";
import { ConceptItem } from "./concept-item";

// TODO: Replace with real data from hook
const MOCK_CONCEPTS = [
  { name: "Diseño de Interfaz UX/UI", description: "Proyecto completo de rediseño móvil", amount: "850,00 €" },
  { name: "Consultoría Técnica", description: "2 horas de auditoría de sistema", amount: "120,00 €" },
];

export function ConceptList() {
  return (
    <section>
      <h2 className="px-4 pb-2 font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
        Conceptos
      </h2>
      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden mb-3">
        {MOCK_CONCEPTS.map((concept) => (
          <ConceptItem key={concept.name} {...concept} />
        ))}
      </div>
      <button className="flex items-center gap-2 px-4 py-2 text-primary font-semibold active:scale-95 transition-transform">
        <PlusCircle className="w-6 h-6" strokeWidth={2} />
        <span>Añadir Concepto</span>
      </button>
    </section>
  );
}
