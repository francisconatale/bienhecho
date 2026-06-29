"use client";

import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Material } from "@/types";
import { useMaterials } from "../hooks/use-materials";
import { MaterialForm } from "./material-form";

interface MaterialItemProps {
  material: Material;
  jobId: string;
}

export function MaterialItem({ material, jobId }: MaterialItemProps) {
  const { updateMaterial, removeMaterial } = useMaterials(jobId);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = (data: any) => {
    updateMaterial(material.id, data);
    setIsEditing(false);
  };

  const handleDelete = () => {
    removeMaterial(material.id);
    setConfirmDelete(false);
  };

  if (isEditing) {
    return (
      <MaterialForm
        initialData={{ 
          nombre_material: material.nombre_material, 
          cantidad: material.cantidad, 
          precio_unitario: material.precio_unitario 
        }}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <div className="group relative flex flex-col md:flex-row md:items-center px-4 py-3 hover:bg-primary/5 transition-colors gap-1 md:gap-0">
        
        {/* Name */}
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-[14px] font-bold transition-all duration-300 text-on-surface cursor-default select-none truncate">
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

        {/* Actions */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 active:scale-90"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-90"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-surface/80 ">
          <div className="bg-surface/90 dark:bg-surface/70 backdrop-blur-xl rounded-xl p-6 mx-4 max-w-sm w-full shadow-2xl space-y-4 border border-outline-variant/20">
            <h3 className="text-lg font-black text-on-surface">
              Eliminar material
            </h3>
            <p className="text-sm text-on-surface-variant/70 font-medium">
              ¿Estás seguro de eliminar &quot;{material.nombre_material}&quot;? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-3 rounded-xl bg-on-surface/5 text-on-surface font-black text-xs uppercase tracking-widest hover:bg-on-surface/10 transition-all active:scale-95"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
