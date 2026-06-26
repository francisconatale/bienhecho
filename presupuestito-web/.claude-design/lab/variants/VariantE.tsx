import React from "react";
import { mockJobs, mockClients, formatCurrency, getStatusColor } from "../data/fixtures";
import { Plus, ChevronRight, Briefcase } from "lucide-react";

export function VariantE() {
  return (
    <div className="bg-background min-h-[600px] rounded-3xl overflow-hidden relative font-sans">
      {/* Aurora Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[-10%] w-[250px] h-[250px] bg-primary-container/30 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="px-8 py-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-on-surface tracking-tighter">Mis Trabajos</h1>
            <p className="text-sm font-medium text-on-surface-variant mt-2">Gestioná tus proyectos activos</p>
          </div>
          <button className="bg-surface/30 backdrop-blur-xl border border-white/20 p-4 rounded-2xl hover:bg-surface/50 transition-all active:scale-95 shadow-xl text-primary">
            <Plus className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-8 pb-8 flex-1 overflow-y-auto space-y-4">
          {mockJobs.map(job => (
            <div key={job.id} className="group bg-surface/30 backdrop-blur-2xl p-5 rounded-[28px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 flex items-center justify-between cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-5 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${job.estado === 'listo_para_facturar' ? 'bg-primary/20 text-primary' : 'bg-surface-variant/50 text-on-surface-variant'}`}>
                  <Briefcase className="w-6 h-6" strokeWidth={2} />
                </div>
                
                <div>
                  <h3 className="font-black text-lg text-on-surface group-hover:text-primary transition-colors">{job.titulo}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-on-surface-variant">
                      {mockClients[job.cliente_id as keyof typeof mockClients]?.nombre}
                    </span>
                    <span className="text-on-surface-variant/30">•</span>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(job.estado)} shadow-[0_0_8px_currentColor]`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                        {job.estado.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 relative z-10">
                <span className="font-black text-xl text-on-surface tracking-tight">{formatCurrency(job.presupuesto)}</span>
                <div className="w-10 h-10 rounded-full bg-on-surface/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
