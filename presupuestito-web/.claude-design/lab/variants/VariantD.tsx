import React, { useState } from "react";
import { mockJobs, mockClients, formatCurrency, getStatusColor } from "../data/fixtures";
import { Search, Plus, ExternalLink, Calendar, DollarSign, Edit3 } from "lucide-react";

export function VariantD() {
  const [selectedId, setSelectedId] = useState<string>("1");
  const selectedJob = mockJobs.find(j => j.id === selectedId);

  return (
    <div className="bg-background min-h-[600px] rounded-3xl overflow-hidden flex font-sans border border-outline-variant/10">
      <div className="w-[320px] bg-surface flex flex-col border-r border-outline-variant/10">
        <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center">
          <h2 className="font-bold text-on-surface">Trabajos</h2>
          <button className="bg-primary text-white p-1.5 rounded-lg hover:bg-primary-dark">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {mockJobs.map(job => (
            <button
              key={job.id}
              onClick={() => setSelectedId(job.id)}
              className={`w-full text-left p-4 border-b border-outline-variant/5 hover:bg-surface-variant/10 transition-colors flex items-center justify-between ${selectedId === job.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
            >
              <div className="min-w-0 pr-2">
                <p className={`font-semibold text-sm truncate ${selectedId === job.id ? 'text-primary' : 'text-on-surface'}`}>{job.titulo}</p>
                <p className="text-xs text-on-surface-variant truncate mt-0.5">{mockClients[job.cliente_id as keyof typeof mockClients]?.nombre}</p>
              </div>
              <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(job.estado)}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-background relative overflow-y-auto">
        {selectedJob ? (
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${getStatusColor(selectedJob.estado)}`}>
                    {selectedJob.estado.replace(/_/g, " ")}
                  </div>
                  <span className="text-sm font-semibold text-on-surface-variant/60">
                    ID: #{selectedJob.id}
                  </span>
                </div>
                <h1 className="text-3xl font-black text-on-surface">{selectedJob.titulo}</h1>
                <p className="text-lg text-primary font-bold mt-1">
                  {mockClients[selectedJob.cliente_id as keyof typeof mockClients]?.nombre}
                </p>
              </div>
              <button className="p-2 bg-surface border border-outline-variant/20 rounded-xl hover:bg-surface-variant/20 transition-colors">
                <Edit3 className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-surface p-6 rounded-2xl border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-2 text-on-surface-variant">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Presupuesto</span>
                </div>
                <p className="text-2xl font-black text-on-surface">{formatCurrency(selectedJob.presupuesto)}</p>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-2 text-on-surface-variant">
                  <Calendar className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Creado</span>
                </div>
                <p className="text-2xl font-black text-on-surface">
                  {new Date(selectedJob.created_at).toLocaleDateString("es-AR")}
                </p>
              </div>
            </div>
            
            <div className="mt-8 bg-surface p-6 rounded-2xl border border-outline-variant/10 h-48 flex items-center justify-center border-dashed">
              <p className="text-on-surface-variant font-medium">Contenido del trabajo (tareas, notas, etc.)</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-on-surface-variant font-medium">
            Seleccioná un trabajo para ver los detalles
          </div>
        )}
      </div>
    </div>
  );
}
