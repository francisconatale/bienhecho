import { useMemo } from "react";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { materialsService } from "@/services";
import { Material } from "@/types";
import { toast } from "sonner";
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
    queryFn: () => materialsService.getByJobId(trabajoId),
  });

  const totalMateriales = useMemo(() => {
    return materiales.reduce((sum, m) => sum + m.subtotal, 0);
  }, [materiales]);

  const addMutation = useMutation({
    mutationFn: materialsService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials", trabajoId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Material> }) =>
      materialsService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials", trabajoId] }),
  });

  const removeMutation = useMutation({
    mutationFn: materialsService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials", trabajoId] }),
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
      toast.success("Material agregado");
    } catch (error) {
      toast.error("Error al agregar material");
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
      toast.success("Material actualizado");
    } catch (error) {
      toast.error("Error al actualizar material");
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
  };
}
