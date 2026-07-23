import { useState } from "react";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { jobsService } from "@/services";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { cn, formatCurrency } from "@/lib/utils";
import { getStatusColor } from "./client-detail-pane"; // We'll keep it there to avoid circular dependencies if used elsewhere

export function ClientJobsCard({ clientId }: { clientId: string }) {
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);
  const { pushHistory } = useNavigationHistory();
  const { data: jobs = [], isLoading } = useQuery({ queryKey: ["jobs"], queryFn: jobsService.getAll });
  
  const clientJobs = jobs.filter((j) => j.cliente_id === clientId);
  
  if (isLoading) {
    return (
      <div className="relative bg-surface/40 dark:bg-surface/10 backdrop-blur-2xl rounded-xl p-8 md:p-10 border border-white/30 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] min-h-[200px]">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 py-4">
              <div className="w-2 h-2 rounded-full bg-outline-variant/10 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-outline-variant/10 rounded animate-pulse" />
                <div className="w-1/3 h-3 bg-outline-variant/10 rounded animate-pulse" />
              </div>
              <div className="w-9 h-9 rounded-full bg-outline-variant/10 animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (clientJobs.length === 0) return null;

  // Progressive Disclosure: show only top 5 recent jobs
  const visibleJobs = clientJobs.slice(0, 5);
  const hasMore = clientJobs.length > 5;

  return (
    <div className="relative bg-surface/40 dark:bg-surface/10 backdrop-blur-2xl rounded-xl p-8 md:p-10 border border-white/30 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant/60">Trabajos del Cliente</h3>
        <Link
          href={`/trabajos/nuevo?clienteId=${clientId}`}
          className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          + Nuevo
        </Link>
      </div>
      <div className="space-y-0">
        {visibleJobs.map((job) => (
          <div key={job.id} className="border-b border-outline-variant/10 last:border-0">
            <Link
              href={`/trabajos/${job.id}`}
              onClick={() => {
                setLoadingJobId(job.id);
                pushHistory(window.location.pathname + window.location.search);
              }}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 hover:bg-on-surface/5 transition-colors -mx-4 px-4 rounded-2xl cursor-pointer"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className={cn("w-2 h-2 rounded-full shrink-0", getStatusColor(job.estado))} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors truncate">{job.titulo}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-on-surface-variant/50 mt-1">{job.estado.replace(/_/g, " ")}</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                <div className="w-9 h-9 rounded-full bg-on-surface/5 flex items-center justify-center shrink-0 text-on-surface-variant group-hover:text-primary group-hover:bg-primary/10 transition-all group-active:scale-95">
                  {loadingJobId === job.id ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="pt-6 mt-4">
          <Link
            href={`/clientes/${clientId}/trabajos`}
            className="text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1"
          >
            Ver los {clientJobs.length} trabajos <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
