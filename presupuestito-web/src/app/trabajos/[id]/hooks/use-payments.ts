import { useMemo, useCallback } from "react";
import { z } from "zod";
import { useDataStore } from "@/lib/store";

export const cobroSchema = z.object({
  monto_cobrado: z.coerce.number().min(0.01, "El monto debe ser mayor a 0"),
  fecha_cobro: z.string().min(1, "La fecha es obligatoria"),
  forma_pago: z.string().optional(),
  notas: z.string().optional(),
});

export type CobroFormValues = z.infer<typeof cobroSchema>;

export function usePayments(trabajoId: string) {
  const storeCobros = useDataStore((state) => state.cobros);
  const storeMateriales = useDataStore((state) => state.materiales);
  const storeTasks = useDataStore((state) => state.tasks);

  const addCobroStore = useDataStore((state) => state.addCobro);
  const updateCobroStore = useDataStore((state) => state.updateCobro);
  const removeCobroStore = useDataStore((state) => state.removeCobro);

  const cobros = useMemo(() => {
    return storeCobros.filter((c) => c.trabajo_id === trabajoId);
  }, [storeCobros, trabajoId]);

  const materiales = useMemo(() => {
    return storeMateriales.filter((m) => m.trabajo_id === trabajoId);
  }, [storeMateriales, trabajoId]);

  const tasks = useMemo(() => {
    return storeTasks.filter((t) => t.trabajo_id === trabajoId);
  }, [storeTasks, trabajoId]);

  const totalMateriales = useMemo(() => {
    return materiales.reduce((sum, m) => sum + m.subtotal, 0);
  }, [materiales]);

  const totalTareas = useMemo(() => {
    return tasks.reduce((sum, t) => sum + (t.precio || 0), 0);
  }, [tasks]);

  const presupuestoTotal = totalTareas + totalMateriales;

  const totalCobrado = useMemo(() => {
    return cobros.reduce((sum, c) => sum + c.monto_cobrado, 0);
  }, [cobros]);

  const saldoPendiente = useMemo(() => {
    return presupuestoTotal - totalCobrado;
  }, [presupuestoTotal, totalCobrado]);

  const checkAndAutoPaid = useCallback(() => {
    const state = useDataStore.getState();
    const allCobros = state.cobros.filter((c) => c.trabajo_id === trabajoId);
    const totalCobrado = allCobros.reduce((sum, c) => sum + c.monto_cobrado, 0);
    const allTasks = state.tasks.filter((t) => t.trabajo_id === trabajoId);
    const totalTareas = allTasks.reduce((sum, t) => sum + (t.precio || 0), 0);
    const allMateriales = state.materiales
      .filter((m) => m.trabajo_id === trabajoId)
      .reduce((sum, m) => sum + m.subtotal, 0);
    const presupuestoTotal = totalTareas + allMateriales;
    const job = state.jobs.find((j) => j.id === trabajoId);
    if (totalCobrado >= presupuestoTotal && job && job.estado !== "pagado") {
      useDataStore.getState().updateJob(trabajoId, { estado: "pagado" });
    }
  }, [trabajoId]);

  const addCobro = (data: CobroFormValues) => {
    addCobroStore({
      trabajo_id: trabajoId,
      monto_cobrado: data.monto_cobrado,
      fecha_cobro: data.fecha_cobro,
      forma_pago: data.forma_pago,
      notas: data.notas,
    });
    checkAndAutoPaid();
  };

  const updateCobro = (id: string, data: CobroFormValues) => {
    updateCobroStore(id, {
      monto_cobrado: data.monto_cobrado,
      fecha_cobro: data.fecha_cobro,
      forma_pago: data.forma_pago,
      notas: data.notas,
    });
    checkAndAutoPaid();
  };

  const removeCobro = (id: string) => {
    removeCobroStore(id);
    checkAndAutoPaid();
  };

  return {
    cobros,
    totalCobrado,
    presupuestoTotal,
    saldoPendiente,
    addCobro,
    updateCobro,
    removeCobro,
  };
}
