import { mockJobs } from "../data/fixtures";
import { ChevronRight } from "lucide-react";

export function VariantB() {
  return (
    <div className="bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-[24px] overflow-hidden border border-outline-variant/20 shadow-sm">
      <div className="flex flex-col">
        {mockJobs.map((job, idx) => (
          <div 
            key={job.id} 
            className={`flex items-center justify-between p-4 cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors ${idx !== mockJobs.length - 1 ? 'border-b border-outline-variant/15' : ''}`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-semibold text-on-surface">{job.titulo}</span>
              <span className="text-[13px] text-on-surface-variant capitalize">{job.estado}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[15px] font-medium text-on-surface-variant">
                ${job.presupuesto.toLocaleString("es-AR")}
              </span>
              <ChevronRight className="w-5 h-5 text-on-surface-variant/40" strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
