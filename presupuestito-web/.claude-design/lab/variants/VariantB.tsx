import React from "react";
import { mockJobs, mockClients, formatCurrency, getStatusColor } from "../data/fixtures";
import { Search, Plus, MoreHorizontal } from "lucide-react";

export function VariantB() {
  const columns = [
    { id: "en_curso", title: "En Curso" },
    { id: "listo_para_facturar", title: "Listos" },
    { id: "facturado", title: "Facturado" }
  ];

  return (
    <div className="bg-background min-h-[600px] rounded-3xl overflow-hidden flex flex-col font-sans relative">
      <div className="p-6 border-b border-outline-variant/10 bg-surface/50 backdrop-blur-md">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-on-surface">Tablero de Trabajos</h1>
          <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 min-w-max h-full">
          {columns.map(col => (
            <div key={col.id} className="w-80 flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(col.id)}`} />
                  <h3 className="font-bold text-sm text-on-surface">{col.title}</h3>
                </div>
                <span className="text-xs font-semibold text-on-surface-variant bg-surface-variant/30 px-2 py-0.5 rounded-full">
                  {mockJobs.filter(j => j.estado === col.id).length}
                </span>
              </div>
              
              <div className="flex-1 space-y-3">
                {mockJobs.filter(j => j.estado === col.id).map(job => (
                  <div key={job.id} className="bg-surface p-4 rounded-xl border border-outline-variant/10 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-primary/20 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {mockClients[job.cliente_id as keyof typeof mockClients]?.nombre}
                      </span>
                      <button className="text-on-surface-variant/50 hover:text-on-surface opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-semibold text-sm text-on-surface mb-4">{job.titulo}</h4>
                    <div className="flex justify-between items-end">
                      <p className="text-xs text-on-surface-variant font-medium">
                        {new Date(job.created_at).toLocaleDateString("es-AR", { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="font-bold text-sm text-on-surface">{formatCurrency(job.presupuesto)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
