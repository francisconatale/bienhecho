import React from 'react';
import Link from 'next/link';
import { Hammer, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMaterials } from '../hooks/use-materials';
import { usePayments } from '../hooks/use-payments';
import { useSearchParams } from 'next/navigation';

export function JobSummaryCards({
  jobId,
  from,
  pushHistory,
}: {
  jobId: string;
  from?: string | null;
  pushHistory: (url: string) => void;
}) {
  const { totalMateriales, materiales, isLoading: isLoadingMateriales } = useMaterials(jobId);
  const { saldoPendiente, isLoading: isLoadingPagos } = usePayments(jobId);
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <Link 
        href={`?${createQueryString('view', 'materiales')}`}
        scroll={false}
        className="group relative overflow-hidden bg-surface rounded-xl p-4 md:p-5 transition-shadow duration-300 hover:shadow-md border border-outline-variant/10 shadow-sm flex flex-col gap-2"
      >
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant/70">
            Materiales
          </span>
          <Hammer className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="relative z-10 mt-1">
          {isLoadingMateriales ? (
            <div className="space-y-1.5">
              <div className="h-7 w-24 bg-outline-variant/10 rounded animate-pulse" />
              <div className="h-3 w-20 bg-outline-variant/10 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <span className="text-2xl font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors">
                ${totalMateriales.toLocaleString("es-AR")}
              </span>
              <p className="text-xs font-medium text-on-surface-variant/60 mt-1">
                {materiales.length} ítem{materiales.length !== 1 && 's'}
              </p>
            </>
          )}
        </div>
      </Link>

      <Link 
        href={`?${createQueryString('view', 'pagos')}`}
        scroll={false}
        className="group relative overflow-hidden bg-surface rounded-xl p-4 md:p-5 transition-shadow duration-300 hover:shadow-md border border-outline-variant/10 shadow-sm flex flex-col gap-2"
      >
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant/70">
            Cuentas a Cobrar
          </span>
          <Wallet className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="relative z-10 mt-1">
          {isLoadingPagos ? (
            <div className="space-y-1.5">
              <div className="h-7 w-24 bg-outline-variant/10 rounded animate-pulse" />
              <div className="h-3 w-24 bg-outline-variant/10 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <span className={cn(
                "text-2xl font-bold tracking-tight transition-colors",
                saldoPendiente <= 0 ? "text-primary" : "text-on-surface group-hover:text-primary"
              )}>
                ${Math.max(0, saldoPendiente).toLocaleString("es-AR")}
              </span>
              <p className="text-xs font-medium text-on-surface-variant/60 mt-1">
                Saldo pendiente
              </p>
            </>
          )}
        </div>
      </Link>
    </div>
  );
}
