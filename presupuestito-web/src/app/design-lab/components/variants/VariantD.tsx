import { jobs, alerts, stats } from '../data/fixtures';
import { PlusCircle, Briefcase, UserPlus, FileText, Calendar, ChevronRight } from 'lucide-react';

export default function VariantD() {
  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-black min-h-[800px] flex flex-col font-sans">
      {/* List/Feed Style: Everything is a stacked list item */}
      
      <div className="p-6 pb-2 border-b border-gray-100 dark:border-zinc-900">
        <h1 className="text-[28px] font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-[15px] text-gray-500 mt-1">Francisco, tienes {alerts.length} alertas nuevas.</p>
      </div>

      <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-900">
        
        {/* Actions as list */}
        <div className="py-2">
          <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors group">
            <div className="flex items-center gap-4">
              <PlusCircle className="text-primary" size={24} />
              <span className="text-[16px] font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">Crear nuevo trabajo</span>
            </div>
          </button>
        </div>

        {/* Stats as list */}
        <div className="py-4 px-6">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3 text-gray-500">
              <Briefcase size={20} />
              <span className="text-[15px]">Presupuestos activos</span>
            </div>
            <span className="text-[18px] font-bold text-gray-900 dark:text-white">{stats.activeBudgets}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3 text-gray-500">
              <FileText size={20} />
              <span className="text-[15px]">Pendiente de cobro</span>
            </div>
            <span className="text-[18px] font-bold text-gray-900 dark:text-white">${stats.pendingToInvoice.toLocaleString()}</span>
          </div>
        </div>

        {/* Alerts */}
        <div className="py-4 px-6 bg-red-50/50 dark:bg-red-900/10">
          <h3 className="text-[13px] font-bold text-red-600 uppercase tracking-wider mb-3">Atención requerida</h3>
          <div className="flex flex-col gap-3">
            {alerts.map(a => (
              <p key={a.id} className="text-[15px] text-red-900 dark:text-red-200">
                • {a.text}
              </p>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="py-4 px-6">
          <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-4">Últimos movimientos</h3>
          <div className="flex flex-col gap-6">
            {jobs.map(job => (
              <div key={job.id} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[15px] font-medium text-gray-900 dark:text-white">{job.title}</span>
                  <span className="text-[14px] text-gray-500">{job.client} • ${job.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
