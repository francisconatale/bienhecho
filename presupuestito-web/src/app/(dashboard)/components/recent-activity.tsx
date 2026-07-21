"use client";

import { useQuery } from "@tanstack/react-query";
import { jobsService } from "@/services";
import { useServerPagination } from "@/hooks/use-server-pagination";
import { PaginationButtons } from "@/components/ui/pagination-buttons";
import { useState, useEffect } from "react";

export function RecentActivity() {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data, isLoading } = useQuery({
    queryKey: ["jobs", "paginated", page, pageSize, ""],
    queryFn: () => jobsService.getPaginated(page, pageSize, ""),
  });

  const jobs = data?.data || [];
  const total = data?.total || 0;

  const serverPag = useServerPagination(total, pageSize);
  useEffect(() => { serverPag.goToPage(page); }, [page]);

  const pag = {
    ...serverPag,
    goToPage: (p: number) => { setPage(p); serverPag.goToPage(p); },
    paginatedItems: jobs as any[],
  };

  if (isLoading) {
    return (
      <section className="transition-all w-full flex flex-col h-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="w-32 h-3 bg-outline-variant/10 rounded animate-pulse" />
        </div>
        <div className="flex-1 flex flex-col bg-surface/60 backdrop-blur-2xl rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4 md:p-5 border-b border-outline-variant/5 last:border-0">
              <div className="w-10 h-10 rounded-xl bg-outline-variant/10 animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="w-2/3 h-3.5 bg-outline-variant/10 rounded animate-pulse" />
                <div className="w-1/3 h-2.5 bg-outline-variant/10 rounded animate-pulse" />
              </div>
              <div className="w-14 h-4 bg-outline-variant/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="transition-all w-full flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-[10px] md:text-sm font-bold text-on-surface-variant uppercase tracking-widest">
          Actividad Reciente
        </h2>
      </div>

      <div className="flex-1 flex flex-col bg-surface/60 backdrop-blur-2xl rounded-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] border border-outline-variant/20 overflow-hidden">
        <div className="flex flex-col divide-y divide-black/[0.04] dark:divide-white/[0.04]">
          {pag.paginatedItems.length > 0 ? (
            pag.paginatedItems.map((job) => {
              const clientName = job.clientes?.nombre || "Sin cliente";
              return (
                <div
                  key={job.id}
                  className="flex items-center gap-3 p-4 md:p-5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm md:text-lg shrink-0 shadow-inner">
                    {clientName.charAt(0) || "T"}
                  </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs md:text-sm text-on-surface truncate">{job.titulo}</div>
                  <div className="text-[10px] md:text-xs text-on-surface-variant truncate">{clientName} • {new Date(job.created_at).toLocaleDateString()}</div>
                </div>
                <span className="font-semibold text-xs md:text-sm text-on-surface shrink-0">
                  ${job.presupuesto.toLocaleString()}
                </span>
              </div>
            );
          })
        ) : (
          <div className="py-10 text-center bg-surface rounded-2xl border border-outline-variant/10">
            <p className="text-sm font-medium text-on-surface-variant/40 italic">
              No hay actividad reciente.
            </p>
          </div>
        )}
        </div>

        <div className="mt-auto p-4 md:p-5 border-t border-black/[0.04] dark:border-white/[0.04] bg-surface/20">
          <PaginationButtons
            currentPage={pag.currentPage}
            totalPages={pag.totalPages}
            totalItems={pag.totalItems}
            pageSize={pag.pageSize}
            onPageChange={pag.goToPage}
          />
        </div>
      </div>
    </section>
  );
}
