import { mockJobs } from "../data/fixtures";

export function VariantC() {
  return (
    <div className="flex flex-col bg-surface rounded-lg overflow-hidden border border-outline-variant/10">
      <div className="flex items-center px-4 py-2 border-b border-outline-variant/20 bg-surface-variant/20">
        <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex-1">Trabajo</div>
        <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest w-28">Estado</div>
        <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest w-28 text-right">Importe</div>
      </div>
      
      <div className="flex flex-col">
        {mockJobs.map((job, idx) => (
          <div 
            key={job.id} 
            className={`flex items-center px-4 py-3 hover:bg-primary/5 cursor-pointer transition-colors ${idx !== mockJobs.length - 1 ? 'border-b border-outline-variant/10' : ''}`}
          >
            <div className="flex-1 text-sm font-medium text-on-surface truncate pr-4">{job.titulo}</div>
            <div className="w-28 text-sm text-on-surface-variant capitalize">{job.estado}</div>
            <div className="w-28 text-sm text-on-surface text-right tabular-nums">
              ${job.presupuesto.toLocaleString("es-AR")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
