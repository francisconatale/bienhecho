import { useMemo } from "react";
import { z } from "zod";
import { useDataStore } from "@/lib/store";

export const materialSchema = z.object({
  nombre_material: z.string().min(1, "El nombre es obligatorio"),
  cantidad: z.coerce.number().min(0.01, "La cantidad debe ser mayor a 0"),
  precio_unitario: z.coerce.number().min(0, "El precio no puede ser negativo"),
});

export type MaterialFormValues = z.infer<typeof materialSchema>;

export function useMaterials(trabajoId: string) {
  const storeMateriales = useDataStore((state) => state.materiales);
  const addMaterialStore = useDataStore((state) => state.addMaterial);
  const updateMaterialStore = useDataStore((state) => state.updateMaterial);
  const removeMaterialStore = useDataStore((state) => state.removeMaterial);

  const materiales = useMemo(() => {
    return storeMateriales.filter((m) => m.trabajo_id === trabajoId);
  }, [storeMateriales, trabajoId]);

  const totalMateriales = useMemo(() => {
    return materiales.reduce((sum, m) => sum + m.subtotal, 0);
  }, [materiales]);

  const addMaterial = (data: MaterialFormValues) => {
    const subtotal = data.cantidad * data.precio_unitario;
    addMaterialStore({
      trabajo_id: trabajoId,
      nombre_material: data.nombre_material,
      cantidad: data.cantidad,
      precio_unitario: data.precio_unitario,
      subtotal,
      comprado: false,
    });
  };

  const updateMaterial = (id: string, data: MaterialFormValues) => {
    const subtotal = data.cantidad * data.precio_unitario;
    updateMaterialStore(id, {
      nombre_material: data.nombre_material,
      cantidad: data.cantidad,
      precio_unitario: data.precio_unitario,
      subtotal,
    });
  };

  const removeMaterial = (id: string) => {
    removeMaterialStore(id);
  };

  return {
    materiales,
    totalMateriales,
    addMaterial,
    updateMaterial,
    removeMaterial,
  };
}
