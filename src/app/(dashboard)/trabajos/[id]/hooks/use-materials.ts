import { useMemo } from "react";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { materialsService_getByJobId, materialsService_create, materialsService_update, materialsService_delete } from "@/actions/materials.actions";
import { Material } from "@/types";
export const materialSchema = z.object({
  nombre_material: z.string().min(1, "El nombre es obligatorio"),
  cantidad: z.coerce.number().min(0.01, "La cantidad debe ser mayor a 0"),
  precio_unitario: z.coerce.number().min(0, "El precio no puede ser negativo"),
});

export type MaterialFormValues = z.infer<typeof materialSchema>;

export function useMaterials(trabajoId: string) {
  const queryClient = useQueryClient();

  const { data: materiales = [], isLoading } = useQuery({
    queryKey: ["materials", trabajoId],
    queryFn: () => materialsService_getByJobId(trabajoId),
  });

  const totalMateriales = useMemo(() => {
    return materiales.reduce((sum, m) => sum + m.subtotal, 0);
  }, [materiales]);

  const addMutation = useMutation({
    mutationFn: materialsService_create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials", trabajoId] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Material> }) =>
      materialsService_update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials", trabajoId] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: materialsService_delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials", trabajoId] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const addMaterial = async (data: MaterialFormValues) => {
    try {
      const subtotal = data.cantidad * data.precio_unitario;
      await addMutation.mutateAsync({
        trabajo_id: trabajoId,
        nombre_material: data.nombre_material,
        cantidad: data.cantidad,
        precio_unitario: data.precio_unitario,
        subtotal,
        comprado: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const updateMaterial = async (id: string, data: MaterialFormValues) => {
    try {
      const subtotal = data.cantidad * data.precio_unitario;
      await updateMutation.mutateAsync({
        id,
        data: {
          nombre_material: data.nombre_material,
          cantidad: data.cantidad,
          precio_unitario: data.precio_unitario,
          subtotal,
        },
      });
    } catch (error) {
      throw error;
    }
  };

  const removeMaterial = async (id: string) => {
    await removeMutation.mutateAsync(id);
  };

  return {
    materiales,
    totalMateriales,
    addMaterial,
    updateMaterial,
    removeMaterial,
    isLoading,
    isSaving: addMutation.isPending || updateMutation.isPending,
  };
}
