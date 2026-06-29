"use client";

import { ListGroup } from "@/components/ui/list-group";
import { ListItem } from "@/components/ui/list-item";
import { useDataStore } from "@/lib/store";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationButtons } from "@/components/ui/pagination-buttons";
import { useState, useEffect, useMemo } from "react";

export function RecentActivity() {
  const { clients, jobs } = useDataStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [jobs]);

  const pag = usePagination(sortedJobs, 5);

  if (!mounted) return null;

  return (
    <section className="px-5 md:px-8 lg:px-12 md:mt-12 transition-all">
      <div className="flex items-center justify-between mb-3 md:mb-5 px-1">
        <h3 className="text-xs md:text-sm font-bold text-on-surface-variant uppercase tracking-widest">
          Actividad Reciente
        </h3>
      </div>

      <ListGroup>
        {pag.paginatedItems.length > 0 ? (
          pag.paginatedItems.map((job) => {
            const client = clients.find((c) => c.id === job.cliente_id);
            return (
              <ListItem
                key={job.id}
                icon={client?.nombre.charAt(0) || "T"}
                title={job.titulo}
                subtitle={`${client?.nombre || "Sin cliente"} • ${new Date(job.created_at).toLocaleDateString()}`}
                trailing={
                  <span className="font-semibold text-on-surface text-sm">
                    ${job.presupuesto.toLocaleString()}
                  </span>
                }
              />
            );
          })
        ) : (
          <div className="py-10 text-center bg-surface rounded-2xl border border-outline-variant/10">
            <p className="text-sm font-medium text-on-surface-variant/40 italic">
              No hay actividad reciente.
            </p>
          </div>
        )}
      </ListGroup>

      <PaginationButtons
        currentPage={pag.currentPage}
        totalPages={pag.totalPages}
        totalItems={pag.totalItems}
        pageSize={pag.pageSize}
        onPageChange={pag.goToPage}
        className="px-1"
      />
    </section>
  );
}
