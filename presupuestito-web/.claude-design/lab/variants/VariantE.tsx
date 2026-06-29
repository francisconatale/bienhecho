import { mockJobs } from "../data/fixtures";
import { FileText } from "lucide-react";

export function VariantE() {
  const getStatusTag = (status: string) => {
    switch (status) {
      case "en curso": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "presupuestado": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "finalizado": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pagado": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="flex flex-col border border-outline-variant/30 rounded-lg bg-surface shadow-sm">
      <div className="flex items-center gap-4 px-5 py-2.5 border-b border-outline-variant/30 bg-on-surface/5 text-xs text-on-surface-variant">
        <div className="flex-1">Trabajo</div>
        <div className="w-28">Estado</div>
        <div className="w-24 text-right">Presupuesto</div>
      </div>
      
      <div className="flex flex-col">
        {mockJobs.map((job) => (
          <div 
            key={job.id} 
            className="flex items-center gap-4 px-5 py-3 hover:bg-on-surface/5 cursor-pointer border-b border-outline-variant/10 last:border-0 group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className="w-4 h-4 text-on-surface-variant/50" />
              <span className="text-[14px] font-medium text-on-surface truncate group-hover:underline underline-offset-4 decoration-primary/30">
                {job.titulo}
              </span>
            </div>
            <div className="w-28">
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${getStatusTag(job.estado)}`}>
                {job.estado}
              </span>
            </div>
            <div className="w-24 text-[13px] text-on-surface-variant text-right">
              ${job.presupuesto.toLocaleString("es-AR")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
