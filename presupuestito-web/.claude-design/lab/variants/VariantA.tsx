import { mockJobs } from "../data/fixtures";
import { ChevronRight } from "lucide-react";

export function VariantA() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "en curso": return "bg-blue-500/10 text-blue-500";
      case "presupuestado": return "bg-amber-500/10 text-amber-500";
      case "finalizado": return "bg-emerald-500/10 text-emerald-500";
      case "pagado": return "bg-purple-500/10 text-purple-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="flex flex-col border border-outline-variant/20 rounded-xl overflow-hidden bg-surface">
      {/* Header */}
      <div className="grid grid-cols-[1fr_auto_auto_40px] items-center gap-4 px-4 py-3 bg-surface-variant/30 border-b border-outline-variant/20 text-xs font-semibold text-on-surface-variant">
        <div>Título</div>
        <div className="w-24">Estado</div>
        <div className="w-24 text-right">Monto</div>
        <div></div>
      </div>
      
      {/* Rows */}
      <div className="flex flex-col divide-y divide-outline-variant/10">
        {mockJobs.map(job => (
          <div key={job.id} className="grid grid-cols-[1fr_auto_auto_40px] items-center gap-4 px-4 py-3 hover:bg-on-surface/5 transition-colors cursor-pointer group">
            <div className="font-medium text-sm text-on-surface truncate">{job.titulo}</div>
            <div className="w-24">
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${getStatusColor(job.estado)}`}>
                {job.estado}
              </span>
            </div>
            <div className="w-24 text-right text-sm text-on-surface-variant font-medium">
              ${job.presupuesto.toLocaleString("es-AR")}
            </div>
            <div className="flex justify-end">
              <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
