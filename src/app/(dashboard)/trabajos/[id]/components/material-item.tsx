"use client";

import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Material } from "@/types";
import { useMaterials } from "../hooks/use-materials";
import { MaterialForm } from "./material-form";
import { useConfirm } from "@/hooks/use-confirm";
import { Modal } from "@/components/ui/modal";

interface MaterialItemProps {
  material: Material;
  jobId: string;
}

export function MaterialItem({ material, jobId }: MaterialItemProps) {
  const { updateMaterial, removeMaterial } = useMaterials(jobId);
  const [isEditing, setIsEditing] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm();

  const handleSave = (data: any) => {
    updateMaterial(material.id, data);
    setIsEditing(false);
  };

  const handleDelete = () => {
    confirm({
      title: "Eliminar material",
      description: `¿Estás seguro de eliminar "${material.nombre_material}"? Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      variant: "danger",
      action: async () => {
        await removeMaterial(material.id);
      }
    });
  };

  if (isEditing) {
    return (
      <div className="px-4 py-4 bg-primary/5 border-b border-outline-variant/10">
        <MaterialForm
          initialData={{ 
            nombre_material: material.nombre_material, 
            cantidad: material.cantidad, 
            precio_unitario: material.precio_unitario 
          }}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
        <ConfirmDialog />
      </div>
    );
  }

  return (
    <>
      <div className="group relative flex flex-col md:flex-row md:items-center pl-4 pr-[90px] md:pr-0 py-3 hover:bg-primary/5 transition-colors gap-1 md:gap-0 border-b border-outline-variant/5">
        
        {/* Name */}
        <div className="flex-1 min-w-0 md:pr-4">
          <p className="text-[14px] font-bold transition-colors duration-300 text-on-surface cursor-default select-none truncate">
            {material.nombre_material}
          </p>
          {/* Mobile details */}
          <div className="md:hidden flex items-center gap-2 mt-0.5">
            <p className="text-[12px] font-medium text-on-surface-variant cursor-default select-none">
              {material.cantidad} x ${material.precio_unitario.toLocaleString("es-AR")}
            </p>
            <span className="text-[12px] text-on-surface-variant/30">•</span>
            <p className="text-[12px] font-bold text-primary cursor-default select-none">
              ${material.subtotal.toLocaleString("es-AR")}
            </p>
          </div>
        </div>

        {/* Cant x Precio (Desktop) */}
        <div className="hidden md:flex w-32 shrink-0 items-center">
          <p className="text-[13px] font-medium text-on-surface-variant cursor-default select-none">
            {material.cantidad} x ${material.precio_unitario.toLocaleString("es-AR")}
          </p>
        </div>

        {/* Subtotal (Desktop) */}
        <div className="hidden md:flex w-32 shrink-0 items-center justify-end pr-4">
          <p className="text-[14px] font-semibold text-on-surface tabular-nums cursor-default select-none">
            ${material.subtotal.toLocaleString("es-AR")}
          </p>
        </div>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex w-20 shrink-0 items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-4">
          <button
            onClick={() => setIsEditing(true)}
            aria-label={`Editar ${material.nombre_material}`}
            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 active:scale-90"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            aria-label={`Eliminar ${material.nombre_material}`}
            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-90"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Actions (Mobile) */}
        <div className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1">
          <button
            onClick={() => setIsEditing(true)}
            aria-label={`Editar ${material.nombre_material}`}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 active:scale-90"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            aria-label={`Eliminar ${material.nombre_material}`}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-90"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ConfirmDialog />
    </>
  );
}
