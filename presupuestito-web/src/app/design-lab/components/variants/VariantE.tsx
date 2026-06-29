import { jobs, alerts, stats } from '../data/fixtures';
import { PlusCircle, Briefcase, FileText, AlertTriangle } from 'lucide-react';

export default function VariantE() {
  return (
    <div className="w-full max-w-md mx-auto bg-[#f8f9fa] dark:bg-[#121212] min-h-[800px] flex flex-col font-sans relative pb-24">
      {/* Floating/Layered Mobile App Style */}
      
      <div className="bg-primary pt-12 pb-20 px-6 rounded-b-[40px] text-white">
        <p className="text-primary-100 font-medium">Bienvenido</p>
        <h1 className="text-[36px] font-extrabold tracking-tight">Francisco</h1>
      </div>

      <div className="px-5 -mt-12 space-y-6">
        {/* Main Floating Card */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-[28px] p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-1">Por cobrar</p>
              <h2 className="text-[36px] font-black text-gray-900 dark:text-white leading-none">${stats.pendingToInvoice.toLocaleString()}</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <FileText size={20} />
            </div>
          </div>
          
          <div className="h-[1px] bg-gray-100 dark:bg-zinc-800 w-full mb-6" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-1">Activos</p>
              <p className="text-[20px] font-bold text-gray-900 dark:text-white">{stats.activeBudgets} trabajos</p>
            </div>
            <button className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-full text-[14px] font-bold text-gray-900 dark:text-white">
              Ver todos
            </button>
          </div>
        </div>

        {/* Alerts Pill */}
        {alerts.length > 0 && (
          <div className="bg-red-500 rounded-full p-1.5 pl-4 pr-5 flex items-center justify-between text-white shadow-lg shadow-red-500/30">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} />
              <span className="text-[14px] font-semibold truncate max-w-[200px]">{alerts[0].text}</span>
            </div>
            <span className="text-[12px] font-bold bg-white/20 px-2 py-1 rounded-full">Ver</span>
          </div>
        )}

        {/* Recent List */}
        <div>
          <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-4 px-1">Actividad</h3>
          <div className="space-y-3">
            {jobs.map(job => (
              <div key={job.id} className="bg-white dark:bg-[#1e1e1e] p-4 rounded-[20px] shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-bold text-gray-900 dark:text-white">{job.title}</p>
                  <p className="text-[13px] text-gray-500">{job.client}</p>
                </div>
                <p className="text-[15px] font-bold text-primary">${job.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button className="fixed bottom-6 right-6 w-16 h-16 bg-primary rounded-full shadow-[0_10px_25px_rgba(0,180,100,0.4)] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform z-10">
        <PlusCircle size={32} />
      </button>

    </div>
  )
}
