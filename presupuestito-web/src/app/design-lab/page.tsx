"use client";

import { VariantA } from "../../../.claude-design/lab/variants/VariantA";
import { VariantB } from "../../../.claude-design/lab/variants/VariantB";
import { VariantC } from "../../../.claude-design/lab/variants/VariantC";
import { VariantD } from "../../../.claude-design/lab/variants/VariantD";
import { VariantE } from "../../../.claude-design/lab/variants/VariantE";
import { FeedbackOverlay } from "./FeedbackOverlay";

const variants = [
  { id: "A", name: "Alertas Primero + Compacto", description: "Alertas y financial arriba del hero. Grid 2 cols para stats. Acciones en scroll horizontal.", Component: VariantA },
  { id: "B", name: "Hero + Alertas Inline", description: "Alertas como banner compacto debajo del hero. Financial como card separada. Stats como row.", Component: VariantB },
  { id: "C", name: "Glassmorphic Cards", description: "Todo como cards flotantes con backdrop-blur. Acciones como icon buttons. Más profundidad visual.", Component: VariantC },
  { id: "D", name: "List-First (Cards individuales)", description: "Cada ítem es su propia card con sombra. Acciones como pills. Ultra limpio.", Component: VariantD },
  { id: "E", name: "Dashboard con Tabs", description: "Alertas como banner sticky. Tabs para Resumen/Actividad. Más organización por contexto.", Component: VariantE },
];

export default function DesignLabPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-outline-variant/10 bg-surface/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-lg font-bold text-on-surface">Design Lab: Dashboard Mobile</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Reorganización del dashboard para mobile. Alertas movidas arriba + unificación de fonts.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-semibold">5 variants</span>
            <span className="px-2 py-1 rounded-md bg-on-surface/5 text-on-surface-variant text-[10px] font-semibold">Mobile-first</span>
            <span className="px-2 py-1 rounded-md bg-on-surface/5 text-on-surface-variant text-[10px] font-semibold">Alertas first</span>
          </div>
        </div>
      </header>

      {/* Instructions */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-6">
          <p className="text-xs text-on-surface">
            <strong>Cómo usar:</strong> Revisá las 5 variantes side-by-side. Usá el botón flotante 
            (abajo a la derecha) para agregar feedback interactivo sobre elementos específicos. 
            Describí qué variantes preferís y por qué.
          </p>
        </div>
      </div>

      {/* Variant Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {variants.map(({ id, name, description, Component }) => (
            <div key={id} data-variant={id} className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                  {id}
                </span>
                <div>
                  <h2 className="text-sm font-bold text-on-surface">{name}</h2>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{description}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm bg-grouped-bg-light">
                <div className="w-[375px] max-w-full mx-auto origin-top-left scale-[0.85] md:scale-100">
                  <Component />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Feedback Overlay */}
      <FeedbackOverlay targetName="Dashboard" />
    </div>
  );
}
