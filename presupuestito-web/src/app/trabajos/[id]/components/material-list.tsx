"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useMaterials } from "../hooks/use-materials";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationButtons } from "@/components/ui/pagination-buttons";
import { MaterialItem } from "./material-item";
import { MaterialForm } from "./material-form";

interface MaterialListProps {
  jobId: string;
}

export function MaterialList({ jobId }: MaterialListProps) {
  const { materiales, totalMateriales, addMaterial } = useMaterials(jobId);
  const [isAdding, setIsAdding] = useState(false);
  const pag = usePagination(materiales, 20);

  const handleAdd = (data: any) => {
    addMaterial(data);
    setIsAdding(false);
  };

  return (
    <div className="space-y-5 relative z-10">
      <div className="flex items-end justify-between px-2">
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-on-surface-variant/50">
          Materiales del Trabajo
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="group flex items-center gap-1.5 px-4 py-2 rounded-xl border border-outline-variant/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-[11px] font-bold text-on-surface uppercase tracking-wider active:scale-95"
        >
          <Plus className="w-4 h-4 text-primary transition-transform group-hover:rotate-90 duration-300" strokeWidth={2.5} />
          Agregar
        </button>
      </div>

      <div className="flex flex-col mt-4">
        {isAdding && (
          <div className="mb-4 bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl p-4 border border-outline-variant/20 shadow-sm">
            <MaterialForm onSave={handleAdd} onCancel={() => setIsAdding(false)} />
          </div>
        )}

        {pag.paginatedItems.length > 0 ? (
          <>
            <div className="flex flex-col bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm">
              <div className="hidden md:flex items-center px-4 py-2 border-b border-outline-variant/20 bg-surface-variant/20">
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex-1">Material</div>
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest w-32">Cant x Precio</div>
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest w-32 text-right">Subtotal</div>
                <div className="w-20"></div>
              </div>

              <div className="flex flex-col divide-y divide-outline-variant/10">
                {pag.paginatedItems.map((material, idx) => (
                  <div 
                    key={material.id} 
                    className="animate-fade-in-up" 
                    style={{ animationDelay: `${idx * 75}ms`, animationFillMode: 'both' }}
                  >
                    <MaterialItem material={material} jobId={jobId} />
                  </div>
                ))}
                <div className="px-4 py-3 flex items-center justify-between bg-primary/5 border-t border-primary/20 animate-fade-in-up" style={{ animationDelay: `${materiales.length * 100}ms` }}>
                  <span className="text-[11px] font-black uppercase tracking-widest text-primary">Total Materiales</span>
                  <span className="text-[15px] font-bold text-on-surface tabular-nums">${totalMateriales.toLocaleString("es-AR")}</span>
                </div>
              </div>
            </div>
            <PaginationButtons
              currentPage={pag.currentPage}
              totalPages={pag.totalPages}
              totalItems={pag.totalItems}
              pageSize={pag.pageSize}
              onPageChange={pag.goToPage}
            />
          </>
        ) : (
          !isAdding && (
            <div className="py-12 px-6 text-center">
              <p className="text-sm font-bold text-on-surface-variant/60">
                Aún no hay materiales definidos
              </p>
              <p className="text-[11px] font-medium text-on-surface-variant/40 mt-2 tracking-wide uppercase">
                Agregá materiales para llevar un control de costos
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
