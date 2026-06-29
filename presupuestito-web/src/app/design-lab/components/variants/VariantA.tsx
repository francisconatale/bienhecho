import { jobs, alerts, stats } from '../data/fixtures';
import { PlusCircle, Briefcase, UserPlus, ChevronRight, AlertCircle, Clock } from 'lucide-react';

export default function VariantA() {
  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-black min-h-[800px] flex flex-col font-sans">
      {/* Header Apple Style: Large title, no borders, clean */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-[34px] font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
          Resumen
        </h1>
      </div>

      <div className="px-4 space-y-6">
        {/* Horizontal scroll cards for stats */}
        <div className="flex gap-4 overflow-x-auto snap-x pb-2 -mx-4 px-4 scrollbar-hide">
          <div className="snap-start shrink-0 w-[280px] bg-gray-100/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-5">
            <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Presupuestos</p>
            <div className="flex items-end justify-between">
              <span className="text-[40px] font-bold text-gray-900 dark:text-white leading-none">{stats.activeBudgets}</span>
              <span className="text-[15px] font-medium text-gray-500 mb-1">Activos</span>
            </div>
          </div>
          <div className="snap-start shrink-0 w-[280px] bg-blue-50 dark:bg-blue-900/20 rounded-[24px] p-5">
            <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Por facturar</p>
            <div className="flex items-end justify-between">
              <span className="text-[32px] font-bold text-blue-700 dark:text-blue-300 leading-none">${stats.pendingToInvoice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Apple Settings Style */}
        <div className="bg-gray-100/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[20px] overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 bg-transparent border-b border-gray-200/50 dark:border-zinc-800/50 active:bg-gray-200 dark:active:bg-zinc-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <PlusCircle size={18} />
              </div>
              <span className="text-[17px] font-medium text-gray-900 dark:text-white">Nuevo Trabajo</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-transparent border-b border-gray-200/50 dark:border-zinc-800/50 active:bg-gray-200 dark:active:bg-zinc-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                <Briefcase size={18} />
              </div>
              <span className="text-[17px] font-medium text-gray-900 dark:text-white">Ver Trabajos</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-transparent active:bg-gray-200 dark:active:bg-zinc-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                <UserPlus size={18} />
              </div>
              <span className="text-[17px] font-medium text-gray-900 dark:text-white">Nuevo Cliente</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Alerts */}
        <div className="space-y-3">
          <h2 className="text-[20px] font-bold text-gray-900 dark:text-white px-2">Avisos</h2>
          {alerts.map(a => (
            <div key={a.id} className="flex gap-3 bg-red-50 dark:bg-red-900/20 p-4 rounded-[20px]">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[15px] font-medium text-red-900 dark:text-red-200 leading-tight">{a.text}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="space-y-3 pb-8">
          <h2 className="text-[20px] font-bold text-gray-900 dark:text-white px-2">Actividad</h2>
          <div className="bg-gray-100/80 dark:bg-zinc-900/80 rounded-[24px] p-2">
            {jobs.map((job, i) => (
              <div key={job.id} className={`p-3 flex items-center justify-between ${i !== jobs.length - 1 ? 'border-b border-gray-200/50 dark:border-zinc-800/50' : ''}`}>
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-gray-900 dark:text-white">{job.title}</span>
                  <span className="text-[14px] text-gray-500">{job.client}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-medium text-gray-900 dark:text-white">${job.amount.toLocaleString()}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
