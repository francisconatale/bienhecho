import { useMemo } from "react";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cobrosService, materialsService, jobsService } from "@/services";
import { Cobro } from "@/types";
import { toast } from "sonner";

export const cobroSchema = z.object({
  monto_cobrado: z.coerce.number().min(0.01, "El monto debe ser mayor a 0"),
  fecha_cobro: z.string().min(1, "La fecha es obligatoria"),
  forma_pago: z.string().optional(),
  notas: z.string().optional(),
});

export type CobroFormValues = z.infer<typeof cobroSchema>;

export function usePayments(trabajoId: string) {
  const queryClient = useQueryClient();

  const { data: cobros = [], isLoading: isLoadingCobros } = useQuery({
    queryKey: ["cobros", trabajoId],
    queryFn: () => cobrosService.getByJobId(trabajoId),
  });

  const { data: materiales = [], isLoading: isLoadingMaterials } = useQuery({
    queryKey: ["materials", trabajoId],
    queryFn: () => materialsService.getByJobId(trabajoId),
  });

  const { data: job, isLoading: isLoadingJob } = useQuery({
    queryKey: ["jobs", trabajoId],
    queryFn: () => jobsService.getById(trabajoId),
  });

  const totalMateriales = useMemo(() => {
    return materiales.reduce((sum, m) => sum + m.subtotal, 0);
  }, [materiales]);

  const presupuestoTotal = (job?.presupuesto || 0) + totalMateriales;

  const totalCobrado = useMemo(() => {
    return cobros.reduce((sum, c) => sum + c.monto_cobrado, 0);
  }, [cobros]);

  const saldoPendiente = useMemo(() => {
    return presupuestoTotal - totalCobrado;
  }, [presupuestoTotal, totalCobrado]);

  const addMutation = useMutation({
    mutationFn: cobrosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cobros", trabajoId] });
      queryClient.invalidateQueries({ queryKey: ["jobs", trabajoId] }); // invalidate job to reflect state change if any
      queryClient.invalidateQueries({ queryKey: ["transacciones"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Cobro> }) =>
      cobrosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cobros", trabajoId] });
      queryClient.invalidateQueries({ queryKey: ["jobs", trabajoId] });
      queryClient.invalidateQueries({ queryKey: ["transacciones"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: cobrosService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cobros", trabajoId] });
      queryClient.invalidateQueries({ queryKey: ["jobs", trabajoId] });
      queryClient.invalidateQueries({ queryKey: ["transacciones"] });
    },
  });

  const addCobro = async (data: CobroFormValues) => {
    try {
      await addMutation.mutateAsync({
        trabajo_id: trabajoId,
        monto_cobrado: data.monto_cobrado,
        fecha_cobro: data.fecha_cobro,
        forma_pago: data.forma_pago,
        notas: data.notas,
      });
      toast.success("Cobro registrado");
    } catch (error) {
      toast.error("Error al registrar cobro");
      throw error;
    }
  };

  const updateCobro = async (id: string, data: CobroFormValues) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          monto_cobrado: data.monto_cobrado,
          fecha_cobro: data.fecha_cobro,
          forma_pago: data.forma_pago,
          notas: data.notas,
        },
      });
      toast.success("Cobro actualizado");
    } catch (error) {
      toast.error("Error al actualizar cobro");
      throw error;
    }
  };

  const removeCobro = async (id: string) => {
    await removeMutation.mutateAsync(id);
  };

  return {
    cobros,
    totalCobrado,
    presupuestoTotal,
    saldoPendiente,
    addCobro,
    updateCobro,
    removeCobro,
    isLoading: isLoadingCobros || isLoadingMaterials || isLoadingJob,
  };
}
