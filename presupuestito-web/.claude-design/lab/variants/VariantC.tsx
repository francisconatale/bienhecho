import React from "react";
import { mockJobs, mockClients, formatCurrency, getStatusColor } from "../data/fixtures";
import { Plus, Filter, Download } from "lucide-react";

export function VariantC() {
  return (
    <div className="bg-background min-h-[600px] rounded-3xl flex flex-col font-sans border border-outline-variant/10 overflow-hidden">
      <div className="bg-surface px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
        <h1 className="text-lg font-bold text-on-surface">Trabajos (5)</h1>
        <div className="flex gap-2">
          <button className="p-2 bg-on-surface/5 rounded-lg text-on-surface hover:bg-on-surface/10">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-2 bg-on-surface/5 rounded-lg text-on-surface hover:bg-on-surface/10">
            <Download className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-dark">
            <Plus className="w-4 h-4" />
            <span>Nuevo</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 border-b border-outline-variant/10">
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-on-surface-variant/70">Trabajo</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-on-surface-variant/70">Cliente</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-on-surface-variant/70">Estado</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-on-surface-variant/70 text-right">Presupuesto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {mockJobs.map(job => (
              <tr key={job.id} className="bg-surface hover:bg-surface-variant/10 transition-colors cursor-pointer group">
                <td className="px-6 py-4">
                  <p className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">{job.titulo}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {new Date(job.created_at).toLocaleDateString("es-AR")}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-on-surface">
                    {mockClients[job.cliente_id as keyof typeof mockClients]?.nombre}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(job.estado)}`} />
                    <span className="text-xs font-semibold text-on-surface-variant">
                      {job.estado.replace(/_/g, " ")}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-sm text-on-surface">{formatCurrency(job.presupuesto)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
