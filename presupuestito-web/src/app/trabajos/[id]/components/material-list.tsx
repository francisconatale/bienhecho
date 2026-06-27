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
          className="group flex items-center gap-1.5 px-4 py-2 rounded-[14px] border border-outline-variant/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-[11px] font-bold text-on-surface uppercase tracking-wider active:scale-95"
        >
          <Plus className="w-4 h-4 text-primary transition-transform group-hover:rotate-90 duration-300" strokeWidth={2.5} />
          Agregar
        </button>
      </div>

      <div className="space-y-3">
        {isAdding && (
          <div className="p-4">
            <MaterialForm onSave={handleAdd} onCancel={() => setIsAdding(false)} />
          </div>
        )}

        {pag.paginatedItems.length > 0 ? (
          <>
            {pag.paginatedItems.map((material, idx) => (
              <div 
                key={material.id} 
                className="animate-fade-in-up" 
                style={{ animationDelay: `${idx * 75}ms`, animationFillMode: 'both' }}
              >
                <MaterialItem material={material} jobId={jobId} />
              </div>
            ))}
            <div className="pt-4 flex justify-end px-2 animate-fade-in-up" style={{ animationDelay: `${materiales.length * 100}ms` }}>
              <div className="bg-primary/10 dark:bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 flex items-center justify-between gap-8 min-w-[280px]">
                <span className="text-[11px] font-black uppercase tracking-widest text-primary">Total Materiales</span>
                <span className="text-lg font-bold text-on-surface">${totalMateriales.toLocaleString("es-AR")}</span>
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
            <div className="py-12 px-6 text-center bg-surface/20 border border-dashed border-outline-variant/20 rounded-[24px] backdrop-blur-sm">
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
