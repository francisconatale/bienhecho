import { jobs, alerts, stats } from '../data/fixtures';
import { PlusCircle, Briefcase, UserPlus, ChevronRight, AlertCircle, Clock, CheckCircle2, ChevronDown } from 'lucide-react';

export default function VariantB() {
  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-[#191919] min-h-[800px] flex flex-col font-sans px-4 sm:px-6 pt-12 pb-12">
      {/* Notion style header: Monospace/serif mix, simple black/white, minimal borders */}
      
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-[#37352f] dark:text-[#ffffff90] leading-tight flex items-center gap-2">
          <span className="text-[28px]">👋</span> Francisco
        </h1>
      </div>

      <div className="space-y-8">
        {/* Quick Actions - inline block style */}
        <div>
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-2 py-1.5 px-2 -mx-2 hover:bg-[#37352f]/5 dark:hover:bg-white/5 rounded text-[15px] font-medium text-[#37352f] dark:text-[#ffffff90] text-left transition-colors">
              <PlusCircle size={16} className="text-[#37352f]/60 dark:text-white/60" />
              Nuevo Trabajo
            </button>
            <button className="flex items-center gap-2 py-1.5 px-2 -mx-2 hover:bg-[#37352f]/5 dark:hover:bg-white/5 rounded text-[15px] font-medium text-[#37352f] dark:text-[#ffffff90] text-left transition-colors">
              <UserPlus size={16} className="text-[#37352f]/60 dark:text-white/60" />
              Nuevo Cliente
            </button>
            <button className="flex items-center gap-2 py-1.5 px-2 -mx-2 hover:bg-[#37352f]/5 dark:hover:bg-white/5 rounded text-[15px] font-medium text-[#37352f] dark:text-[#ffffff90] text-left transition-colors">
              <Briefcase size={16} className="text-[#37352f]/60 dark:text-white/60" />
              Ir a Trabajos
            </button>
          </div>
        </div>

        <div className="h-[1px] w-full bg-[#37352f]/10 dark:bg-white/10" />

        {/* Callouts (Alerts) */}
        <div className="space-y-3">
          {alerts.map(a => (
            <div key={a.id} className="flex items-start gap-3 p-3 rounded bg-[#fbf3db] dark:bg-[#433519] border border-[#fbf3db] dark:border-[#433519]">
              <span className="text-[18px] leading-none mt-0.5">⚠️</span>
              <p className="text-[14px] text-[#37352f] dark:text-[#ffffff90] leading-snug">{a.text}</p>
            </div>
          ))}
        </div>

        {/* Properties/Stats like a database */}
        <div>
          <h2 className="text-[14px] font-semibold text-[#37352f]/60 dark:text-white/60 mb-3 flex items-center gap-1">
            <ChevronDown size={14} /> Métricas
          </h2>
          <div className="border border-[#37352f]/10 dark:border-white/10 rounded">
            <div className="flex items-center py-2 px-3 border-b border-[#37352f]/10 dark:border-white/10">
              <span className="w-[120px] text-[14px] text-[#37352f]/60 dark:text-white/60 flex items-center gap-2">
                <span className="font-mono text-[12px]">∑</span> Activos
              </span>
              <span className="text-[14px] font-medium text-[#37352f] dark:text-[#ffffff90]">{stats.activeBudgets} presupuestos</span>
            </div>
            <div className="flex items-center py-2 px-3 border-b border-[#37352f]/10 dark:border-white/10">
              <span className="w-[120px] text-[14px] text-[#37352f]/60 dark:text-white/60 flex items-center gap-2">
                <span className="font-mono text-[12px]">$</span> Por facturar
              </span>
              <span className="text-[14px] font-medium text-[#37352f] dark:text-[#ffffff90]">${stats.pendingToInvoice.toLocaleString()}</span>
            </div>
            <div className="flex items-center py-2 px-3">
              <span className="w-[120px] text-[14px] text-[#37352f]/60 dark:text-white/60 flex items-center gap-2">
                <span className="font-mono text-[12px]">$</span> Facturado
              </span>
              <span className="text-[14px] font-medium text-[#37352f] dark:text-[#ffffff90]">${stats.totalInvoiced.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Database table view for recent activity */}
        <div>
          <h2 className="text-[14px] font-semibold text-[#37352f]/60 dark:text-white/60 mb-3 flex items-center gap-1">
            <ChevronDown size={14} /> Actividad Reciente
          </h2>
          <div className="flex flex-col gap-1">
            {jobs.map(job => (
              <div key={job.id} className="flex items-center justify-between py-2 px-2 -mx-2 hover:bg-[#37352f]/5 dark:hover:bg-white/5 rounded cursor-pointer group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                    {job.status === 'completed' ? (
                      <CheckCircle2 size={16} className="text-[#0f7b6c] dark:text-[#2da48f]" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-[#37352f]/30 dark:border-white/30" />
                    )}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-[14px] font-medium text-[#37352f] dark:text-[#ffffff90] truncate border-b border-transparent group-hover:border-[#37352f]/30 dark:group-hover:border-white/30">{job.title}</span>
                    <span className="text-[12px] text-[#37352f]/60 dark:text-white/60 truncate">{job.client}</span>
                  </div>
                </div>
                <span className="text-[13px] font-mono text-[#37352f]/60 dark:text-white/60 shrink-0 ml-4">${job.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
