"use client";

import { VariantA } from "./variants/VariantA";
import { VariantB } from "./variants/VariantB";
import { VariantC } from "./variants/VariantC";
import { VariantD } from "./variants/VariantD";
import { VariantE } from "./variants/VariantE";
import { FeedbackOverlay } from "./FeedbackOverlay";

const variants = [
  { id: "A", name: "MASTER.md Compliance", description: "Grid master-detail [300px_1fr], py-3 items, spacing correcto. La base." },
  { id: "B", name: "Stripe Clean", description: "Sin bordes, sombras sutiles, border-radius consistente. Minimal." },
  { id: "C", name: "Linear Dense", description: "Ultra compacto, 260px sidebar, tipografía mínima. Maximum density." },
  { id: "D", name: "Dashboard Hybrid", description: "Stats pills en header, badge de activos, 3 métricas prominentes." },
  { id: "E", name: "Ultra Compact", description: "El más denso. 260px sidebar, form inline, tipografía 7-11px." },
];

export default function DesignLabClientes() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <header className="mb-6">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
            <span className="text-primary font-bold text-[11px]">CL</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-on-surface">Design Lab: Clientes</h1>
            <p className="text-[10px] text-on-surface-variant">Rediseño completo usando MASTER.md</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-3.5 border border-outline-variant/10">
          <h2 className="text-[10px] font-bold text-on-surface mb-2">Design Brief</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[9px]">
            <div><span className="font-bold text-on-surface-variant">Scope:</span> <span className="text-on-surface">Página completa</span></div>
            <div><span className="font-bold text-on-surface-variant">Type:</span> <span className="text-on-surface">Rediseño</span></div>
            <div><span className="font-bold text-on-surface-variant">Density:</span> <span className="text-on-surface">Compacta</span></div>
            <div><span className="font-bold text-on-surface-variant">Dark mode:</span> <span className="text-on-surface">Sí (MD3 tokens)</span></div>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-outline-variant/8">
            <h3 className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Reglas MASTER.md aplicadas</h3>
            <ul className="text-[9px] text-on-surface space-y-0.5">
              <li>• §2.3 Grid master-detail: <code className="bg-grouped-bg-light px-1 rounded">grid-cols-[300px_1fr]</code></li>
              <li>• §3.1 Items: <code className="bg-grouped-bg-light px-1 rounded">py-3</code> max, <code className="bg-grouped-bg-light px-1 rounded">px-4</code> lateral</li>
              <li>• §3.2 Iconos: <code className="bg-grouped-bg-light px-1 rounded">w-9 h-9</code> para lista densa</li>
              <li>• §3.3 Tipografía: <code className="bg-grouped-bg-light px-1 rounded">text-sm</code> nombres, <code className="bg-grouped-bg-light px-1 rounded">text-xs</code> metadata</li>
              <li>• §4 Antipatrones: Sin p-6, sin text-lg en listas, sin rounded-[32px]</li>
            </ul>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-outline-variant/8">
            <h3 className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">SPACING-GUIDELINES</h3>
            <ul className="text-[9px] text-on-surface space-y-0.5">
              <li>• List items: max padding-y 12px (py-3)</li>
              <li>• Separar con border-bottom, no espacio</li>
              <li>• Gap título → card: ~24px</li>
              <li>• Empty state: compacto, no centrado en 1200px</li>
            </ul>
          </div>
        </div>

        <div className="mt-3 bg-primary/5 rounded-lg p-2.5 border border-primary/10">
          <p className="text-[9px] text-on-surface">
            <strong>Instrucciones:</strong> Click el botón verde (esquina inferior derecha) para activar feedback. Click cualquier elemento para comentar. Copiá el feedback y pegalo acá.
          </p>
        </div>
      </header>

      <main>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {variants.map((v) => (
            <div key={v.id} data-variant={v.id} className="flex flex-col">
              <div className="mb-1.5 px-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-primary/15 text-primary text-[9px] font-bold flex items-center justify-center">{v.id}</span>
                  <h3 className="text-[11px] font-bold text-on-surface">{v.name}</h3>
                </div>
                <p className="text-[9px] text-on-surface-variant mt-0.5 ml-6">{v.description}</p>
              </div>
              <div className="h-[480px] rounded-xl border border-outline-variant/15 overflow-hidden bg-background shadow-sm">
                {v.id === "A" && <VariantA />}
                {v.id === "B" && <VariantB />}
                {v.id === "C" && <VariantC />}
                {v.id === "D" && <VariantD />}
                {v.id === "E" && <VariantE />}
              </div>
            </div>
          ))}
        </div>
      </main>

      <FeedbackOverlay targetName="ClientesPage" />
    </div>
  );
}
