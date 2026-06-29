import { mockJobs } from "../data/fixtures";

export function VariantD() {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-12 gap-4 px-2 py-3 border-b border-on-surface/10 mb-2">
        <div className="col-span-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Nombre del Trabajo</div>
        <div className="col-span-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Fase Actual</div>
        <div className="col-span-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] text-right">Valor Estimado</div>
      </div>
      
      <div className="flex flex-col gap-1">
        {mockJobs.map((job) => (
          <div 
            key={job.id} 
            className="grid grid-cols-12 gap-4 px-2 py-3 rounded-xl hover:bg-on-surface/5 cursor-pointer transition-colors items-center group"
          >
            <div className="col-span-6 text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{job.titulo}</div>
            <div className="col-span-3 text-xs font-medium text-on-surface-variant capitalize">{job.estado}</div>
            <div className="col-span-3 text-sm font-semibold text-on-surface text-right">
              ${job.presupuesto.toLocaleString("es-AR")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
