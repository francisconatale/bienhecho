"use client";

import { useState } from "react";
import { Search, Plus, ArrowLeft, Briefcase } from "lucide-react";
import { useDataStore } from "@/lib/store";
import { Job } from "@/types";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationButtons } from "@/components/ui/pagination-buttons";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TrabajoDetail } from "./trabajo-detail";

function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

function getStatusColor(estado: string): string {
  switch (estado) {
    case "cobrado":
    case "facturado":
      return "bg-success";
    case "en_curso":
      return "bg-accent-dark";
    case "listo_para_facturar":
      return "bg-primary";
    default:
      return "bg-outline";
  }
}

export function JobList() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    () => searchParams.get("id") || null
  );
  
  const { jobs, clients } = useDataStore();

  const filtered = jobs.filter((j) => {
    const client = clients.find(c => c.id === j.cliente_id);
    return (
      j.titulo.toLowerCase().includes(search.toLowerCase()) ||
      (client && client.nombre.toLowerCase().includes(search.toLowerCase())) ||
      false
    );
  });

  const pag = usePagination(filtered, 10);
  const selected = jobs.find((j) => j.id === selectedId) || null;

  return (
    <div className="flex flex-col flex-1 bg-background">
      {/* Mobile PageHeader */}
      <div className="md:hidden pt-8 pb-2 px-4">
        <PageHeader
          title="Trabajos"
          description="Gestioná tus proyectos."
        />
      </div>

      {/* HEADER */}
      <div className="px-4 md:px-5 py-3 bg-surface md:bg-background border-b border-outline-variant/10">
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-outline pointer-events-none" strokeWidth={2} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar trabajos..."
              className="w-full bg-grouped-bg-light rounded-lg pl-9 md:pl-10 pr-3 py-2 md:py-2.5 text-xs md:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20 border-0"
            />
          </div>
          <Link
            href="/trabajos/nuevo"
            className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* MASTER-DETAIL GRID */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[360px_1fr] min-h-0">
        {/* LIST PANE */}
        <div
          className={`${
            selectedId ? "hidden md:flex" : "flex"
          } flex-col border-r border-outline-variant/10 bg-surface`}
        >
          <div className="px-4 md:px-5 py-2.5 md:py-3 border-b border-outline-variant/6">
            <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {filtered.length} trabajo{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {pag.paginatedItems.length > 0 ? (
              pag.paginatedItems.map((job) => {
                const isSelected = selectedId === job.id;
                const client = clients.find(c => c.id === job.cliente_id);
                
                return (
                  <button
                    key={job.id}
                    onClick={() => setSelectedId(job.id)}
                    className={`w-full text-left px-4 md:px-5 py-3 md:py-4 border-b border-outline-variant/5 transition-colors cursor-pointer ${
                      isSelected ? "bg-primary/8" : "hover:bg-primary/3"
                    }`}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? "bg-primary/15 text-primary" : "bg-primary/8 text-primary/60"
                      }`}>
                        <Briefcase className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-sm md:text-base text-on-surface truncate">{job.titulo}</div>
                          <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(job.estado)}`} />
                        </div>
                        <div className="text-[11px] md:text-sm text-on-surface-variant truncate">{client?.nombre || "Sin cliente"}</div>
                      </div>
                      <div className="text-right shrink-0 hidden md:block">
                        <div className="text-[10px] md:text-sm font-bold text-primary">{job.estado.replace(/_/g, " ")}</div>
                        <div className="text-[9px] md:text-xs text-on-surface-variant tabular-nums">
                          {job.presupuesto > 0 ? `$${job.presupuesto >= 1000000 ? `${(job.presupuesto / 1000000).toFixed(1)}M` : job.presupuesto >= 1000 ? `${(job.presupuesto / 1000).toFixed(0)}K` : job.presupuesto}` : "S/P"}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-on-surface-variant">
                <p className="text-xs md:text-sm">Sin resultados</p>
              </div>
            )}
          </div>
          <PaginationButtons
            currentPage={pag.currentPage}
            totalPages={pag.totalPages}
            totalItems={pag.totalItems}
            pageSize={pag.pageSize}
            onPageChange={pag.goToPage}
            className="px-4 md:px-5 pb-4"
          />
        </div>

        {/* DETAIL PANE */}
        <div
          className={`${
            selectedId ? "flex" : "hidden md:flex"
          } flex-col bg-grouped-bg-light min-w-0`}
        >
          {selected ? (
            <div className="flex-1 flex flex-col">
              <div className="md:hidden px-5 py-3 border-b border-outline-variant/8 bg-surface flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-7 h-7 md:w-9 md:h-9 rounded-lg hover:bg-outline-variant/10 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 md:w-5 md:h-5 text-on-surface-variant" />
                </button>
                <h2 className="text-sm md:text-lg font-bold text-on-surface">Detalle del Trabajo</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                <TrabajoDetail id={selected.id} isEmbedded={true} onBack={() => setSelectedId(null)} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-start justify-center pt-16 text-on-surface-variant">
              <div className="text-center">
                <Briefcase className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 opacity-15" />
                <p className="text-xs md:text-base font-medium">Seleccioná un trabajo</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
