import React from "react";
import { mockJobs, mockClients, formatCurrency, getStatusColor } from "../data/fixtures";
import { Search, Plus, Briefcase, ExternalLink } from "lucide-react";

export function VariantA() {
  return (
    <div className="bg-background min-h-[600px] rounded-3xl overflow-hidden flex flex-col relative font-sans text-on-surface">
      <div className="p-6 pb-2">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black tracking-tight text-primary">Trabajos</h1>
          <button className="bg-primary text-white p-3 rounded-xl hover:bg-primary-dark transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
          <input 
            type="text" 
            placeholder="Buscar trabajos..." 
            className="w-full bg-surface border border-outline-variant/20 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="p-6 space-y-3 flex-1 overflow-y-auto">
        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">Todos</span>
          <span className="px-3 py-1 bg-surface border border-outline-variant/20 text-on-surface-variant text-xs font-bold rounded-full">En Curso</span>
          <span className="px-3 py-1 bg-surface border border-outline-variant/20 text-on-surface-variant text-xs font-bold rounded-full">Listos</span>
        </div>

        {mockJobs.map(job => (
          <div key={job.id} className="bg-surface p-4 rounded-2xl border border-outline-variant/10 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-surface-variant/30 shrink-0`}>
              <Briefcase className={`w-6 h-6 ${job.estado === 'en_curso' ? 'text-accent-dark' : 'text-primary'}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base text-on-surface truncate group-hover:text-primary transition-colors">{job.titulo}</h3>
              <p className="text-sm text-on-surface-variant mt-0.5">{mockClients[job.cliente_id as keyof typeof mockClients]?.nombre}</p>
            </div>
            
            <div className="text-right shrink-0">
              <p className="text-lg font-black">{formatCurrency(job.presupuesto)}</p>
              <div className="flex items-center justify-end gap-1.5 mt-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(job.estado)}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  {job.estado.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
