"use client";

import { useBudgetStore } from "../../hooks/use-budget";
import { useDataStore } from "@/lib/store";
import { Sparkles } from "lucide-react";

const trades = [
  { id: 'construccion', label: 'Construcción', template: 'Obra en {clienteProject}' },
  { id: 'electricidad', label: 'Electricidad', template: 'Instalación eléctrica en {clienteProject}' },
  { id: 'plomeria', label: 'Plomería', template: 'Sistema de plomería en {clienteProject}' },
  { id: 'pintura', label: 'Pintura', template: 'Pintura para {clienteProject}' },
  { id: 'carpinteria', label: 'Carpintería', template: 'Carpintería en {clienteProject}' },
  { id: 'herreria', label: 'Herrería', template: 'Trabajo de herrería en {clienteProject}' },
  { id: 'mamposteria', label: 'Mampostería', template: 'Mampostería en {clienteProject}' },
  { id: 'cerrajeria', label: 'Cerrajería', template: 'Cerrajería para {clienteProject}' },
  { id: 'aluminios', label: 'Aluminios', template: 'Estructura de aluminio en {clienteProject}' },
  { id: 'revestimientos', label: 'Revestimientos', template: 'Revestimiento en {clienteProject}' },
  { id: 'climatizacion', label: 'Climatización', template: 'Sistema de climatización en {clienteProject}' },
  { id: 'jardineria', label: 'Jardinería', template: 'Diseño de jardín en {clienteProject}' },
  { id: 'limpieza', label: 'Limpieza', template: 'Limpieza profunda en {clienteProject}' },
  { id: 'electrodomesticos', label: 'Electrodomésticos', template: 'Reparación de electrodoméstico en {clienteProject}' },
  { id: 'mantenimiento', label: 'Mantenimiento', template: 'Mantenimiento general en {clienteProject}' },
  { id: 'telecomunicaciones', label: 'Telecomunicaciones', template: 'Instalación de servicios en {clienteProject}' },
  { id: 'mecanica', label: 'Mecánica', template: 'Reparación vehicular en {clienteProject}' },
  { id: 'reformas', label: 'Reformas Integrales', template: 'Reforma integral en {clienteProject}' },
  { id: 'tapiceria', label: 'Tapicería', template: 'Tapizado en {clienteProject}' },
  { id: 'poda', label: 'Poda', template: 'Poda y mantenimiento en {clienteProject}' },
  { id: 'diseño', label: 'Diseño', template: 'Proyecto de diseño para {clienteProject}' },
];

export function BudgetNameInput() {
  const { budgetName, setBudgetName, clientId } = useBudgetStore();
  const { clients } = useDataStore();

  const selectedClient = clients.find(c => c.id === clientId);
  const clientName = selectedClient ? selectedClient.name : "Cliente";

  const handleSuggest = (template: string) => {
    const suggestedName = template.replace("{clienteProject}", clientName);
    setBudgetName(suggestedName);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">
          Nombre del Presupuesto
        </label>
        <div className="relative">
          <input
            type="text"
            value={budgetName}
            onChange={(e) => setBudgetName(e.target.value)}
            placeholder="Ej: Diseño de Identidad Visual - Q2"
            className="w-full bg-surface-variant/5 border border-outline-variant/30 rounded-2xl px-6 py-4 text-xl font-black text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-on-surface-variant/20 shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-3 h-3 text-[#2563EB]/40" />
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">
            Sugerencias por rubro
          </span>
        </div>
        <div className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {trades.map((trade) => (
            <button
              key={trade.id}
              onClick={() => handleSuggest(trade.template)}
              type="button"
              className="whitespace-nowrap px-4 py-2 bg-surface border border-outline-variant/20 rounded-xl text-[11px] font-bold text-on-surface-variant hover:border-[#2563EB]/30 hover:bg-[#2563EB]/5 hover:text-[#2563EB] transition-all active:scale-95 shrink-0"
            >
              {trade.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
