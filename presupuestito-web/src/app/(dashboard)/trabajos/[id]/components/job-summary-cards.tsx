import React from 'react';
import Link from 'next/link';
import { Hammer, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMaterials } from '../hooks/use-materials';
import { usePayments } from '../hooks/use-payments';

export function JobSummaryCards({
  jobId,
  from,
  pushHistory,
}: {
  jobId: string;
  from?: string | null;
  pushHistory: (url: string) => void;
}) {
  const { totalMateriales, materiales } = useMaterials(jobId);
  const { saldoPendiente } = usePayments(jobId);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Link 
        href={`/trabajos/${jobId}/materiales${from ? `?from=${from}` : ""}`} 
        onClick={() => pushHistory(window.location.pathname + window.location.search)}
        className="group relative overflow-hidden bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl p-5 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:scale-[1.02] flex flex-col gap-2"
      >
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50">
            Materiales
          </span>
          <Hammer className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="relative z-10 mt-1">
          <span className="text-2xl font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors">
            ${totalMateriales.toLocaleString("es-AR")}
          </span>
          <p className="text-[10px] font-medium text-on-surface-variant/40 mt-1 uppercase tracking-wider">
            {materiales.length} ítem{materiales.length !== 1 && 's'}
          </p>
        </div>
      </Link>

      <Link 
        href={`/trabajos/${jobId}/pagos`} 
        onClick={() => pushHistory(window.location.pathname + window.location.search)}
        className="group relative overflow-hidden bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl p-5 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:scale-[1.02] flex flex-col gap-2"
      >
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50">
            Cuentas a Cobrar
          </span>
          <Wallet className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="relative z-10 mt-1">
          <span className={cn(
            "text-2xl font-bold tracking-tight transition-colors",
            saldoPendiente <= 0 ? "text-primary" : "text-on-surface group-hover:text-primary"
          )}>
            ${Math.max(0, saldoPendiente).toLocaleString("es-AR")}
          </span>
          <p className="text-[10px] font-medium text-on-surface-variant/40 mt-1 uppercase tracking-wider">
            Saldo pendiente
          </p>
        </div>
      </Link>
    </div>
  );
}
