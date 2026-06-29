import { jobs, alerts, stats } from '../data/fixtures';
import { PlusCircle, Briefcase, UserPlus, FileText, AlertCircle, Calendar } from 'lucide-react';

export default function VariantC() {
  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 dark:bg-zinc-950 min-h-[800px] flex flex-col font-sans p-4 space-y-4">
      
      {/* Header compact */}
      <div className="flex items-center justify-between pt-4 pb-2">
        <div>
          <p className="text-[14px] text-gray-500 dark:text-gray-400 font-medium">Dashboard</p>
          <h1 className="text-[28px] font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">
            Hola, Francisco
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
          FP
        </div>
      </div>

      {/* Bento Grid Top: Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-4 border border-gray-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col justify-between aspect-square">
          <div className="w-10 h-10 rounded-[12px] bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Briefcase size={20} />
          </div>
          <div>
            <p className="text-[32px] font-extrabold text-gray-900 dark:text-white leading-none mb-1">{stats.activeBudgets}</p>
            <p className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">Activos</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-4 border border-gray-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col justify-between aspect-square">
          <div className="w-10 h-10 rounded-[12px] bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-[24px] font-extrabold text-gray-900 dark:text-white leading-none mb-1">
              ${stats.pendingToInvoice >= 1000 ? `${(stats.pendingToInvoice/1000).toFixed(1)}k` : stats.pendingToInvoice}
            </p>
            <p className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">Por facturar</p>
          </div>
        </div>
      </div>

      {/* Actions (Full width) */}
      <div className="grid grid-cols-2 gap-3">
        <button className="col-span-2 bg-primary text-white rounded-[20px] p-4 flex items-center justify-center gap-2 font-bold shadow-md shadow-primary/20 active:scale-95 transition-transform">
          <PlusCircle size={20} />
          Nuevo Trabajo
        </button>
        <button className="bg-white dark:bg-zinc-900 border border-gray-200/50 dark:border-zinc-800/50 rounded-[20px] p-4 flex flex-col items-center justify-center gap-2 font-bold text-gray-700 dark:text-gray-300 active:scale-95 transition-transform shadow-sm">
          <UserPlus size={20} className="text-gray-400" />
          <span className="text-[13px]">Cliente</span>
        </button>
        <button className="bg-white dark:bg-zinc-900 border border-gray-200/50 dark:border-zinc-800/50 rounded-[20px] p-4 flex flex-col items-center justify-center gap-2 font-bold text-gray-700 dark:text-gray-300 active:scale-95 transition-transform shadow-sm">
          <Calendar size={20} className="text-gray-400" />
          <span className="text-[13px]">Agenda</span>
        </button>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-500/10 rounded-[20px] p-4 border border-amber-200/50 dark:border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-amber-600 dark:text-amber-500" />
            <span className="text-[13px] font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wide">Requiere atención</span>
          </div>
          <p className="text-[14px] text-amber-900 dark:text-amber-200 font-medium leading-snug">{alerts[0].text}</p>
        </div>
      )}

      {/* Recent Activity List */}
      <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-5 border border-gray-200/50 dark:border-zinc-800/50 shadow-sm flex-1">
        <h2 className="text-[16px] font-bold text-gray-900 dark:text-white mb-4">Actividad</h2>
        <div className="flex flex-col gap-4">
          {jobs.map(job => (
            <div key={job.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-gray-400 text-[14px] font-bold shrink-0">
                {job.client.charAt(0)}
              </div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-[15px] font-bold text-gray-900 dark:text-white truncate">{job.title}</span>
                <span className="text-[13px] text-gray-500 truncate">{job.client}</span>
              </div>
              <div className="text-[14px] font-bold text-gray-900 dark:text-white">
                ${job.amount >= 1000 ? `${(job.amount/1000).toFixed(0)}k` : job.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
