"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useMaterials } from "../hooks/use-materials";
import { usePagination } from "@/hooks/use-pagination";
import { DataTable, type Column } from "@/components/ui/data-table";
import { MaterialItem } from "./material-item";
import { MaterialForm } from "./material-form";
import { Modal } from "@/components/ui/modal";
import type { Material } from "@/types";

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

  const columns: Column<Material>[] = [
    { label: "Material" },
    { label: "Cant x Precio" },
    { label: "Subtotal", headerClassName: "text-right" },
    { label: "", headerClassName: "w-20" },
  ];

  return (
    <div className="mt-8 relative z-10">
      <DataTable
        columns={columns}
        items={pag.paginatedItems}
        keyExtractor={(m) => m.id}
        pagination={pag}
        title="Materiales del Trabajo"
        emptyMessage={isAdding ? "" : "Aún no hay materiales definidos"}
        actions={
          <button
            onClick={() => setIsAdding(true)}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/15 transition-colors text-[13px] font-bold text-primary shrink-0"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Agregar
          </button>
        }
        topContent={undefined}
        renderRow={(material) => (
          <MaterialItem material={material} jobId={jobId} />
        )}
        footerRow={pag.paginatedItems.length > 0 ? (
          <div className="px-4 py-3 flex items-center justify-between bg-primary/5 border-t border-primary/20">
            <span className="text-[11px] font-black uppercase tracking-widest text-primary">Total Materiales</span>
            <span className="text-[15px] font-bold text-on-surface tabular-nums">${totalMateriales.toLocaleString("es-AR")}</span>
          </div>
        ) : undefined}
      />
      
      <Modal isOpen={isAdding} onClose={() => setIsAdding(false)} title="Nuevo Material">
        <MaterialForm onSave={handleAdd} onCancel={() => setIsAdding(false)} />
      </Modal>
    </div>
  );
}
