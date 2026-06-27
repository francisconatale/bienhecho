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
      <div className="group relative overflow-hidden bg-surface/80 rounded-[20px] p-4 flex items-center gap-4 border border-white/20 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:scale-[1.01]">
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent dark:from-white/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10 flex-1 min-w-0 pr-8">
          <p className="text-base font-bold transition-all duration-300 tracking-tight text-on-surface cursor-default select-none">
            {material.nombre_material}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[11px] font-black tracking-widest text-on-surface-variant/50 uppercase cursor-default select-none">
              {material.cantidad} x ${material.precio_unitario.toLocaleString("es-AR")}
            </p>
            <span className="text-[11px] text-on-surface-variant/30 cursor-default select-none">•</span>
            <p className="text-[11px] font-black tracking-widest text-primary uppercase cursor-default select-none">
              Subtotal: ${material.subtotal.toLocaleString("es-AR")}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="absolute right-4 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-[12px] bg-primary/10 text-primary/70 hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-[0_4px_12px_rgba(61,139,110,0.3)] active:scale-90"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2 rounded-[12px] bg-red-500/10 text-red-500/70 hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)] active:scale-90"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-surface/80 ">
          <div className="bg-surface rounded-[28px] p-6 mx-4 max-w-sm w-full shadow-2xl space-y-4">
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
