import { useMemo } from "react";
import { z } from "zod";
import { useDataStore } from "@/lib/store";

export const entregaParcialSchema = z.object({
  concepto: z.string().optional(),
  monto_entrega: z.coerce.number().min(0.01, "El monto debe ser mayor a 0"),
  fecha_estimada: z.string().optional(),
});

export type EntregaParcialFormValues = z.infer<typeof entregaParcialSchema>;

export const cobroSchema = z.object({
  entrega_parcial_id: z.string().nullable().optional(),
  monto_cobrado: z.coerce.number().min(0.01, "El monto debe ser mayor a 0"),
  fecha_cobro: z.string().min(1, "La fecha es obligatoria"),
  forma_pago: z.string().optional(),
  notas: z.string().optional(),
});

export type CobroFormValues = z.infer<typeof cobroSchema>;

export function usePayments(trabajoId: string) {
  const storeEntregas = useDataStore((state) => state.entregasParciales);
  const storeCobros = useDataStore((state) => state.cobros);
  const storeMateriales = useDataStore((state) => state.materiales);
  const job = useDataStore((state) => state.jobs.find((j) => j.id === trabajoId));

  const addEntregaStore = useDataStore((state) => state.addEntregaParcial);
  const updateEntregaStore = useDataStore((state) => state.updateEntregaParcial);
  const removeEntregaStore = useDataStore((state) => state.removeEntregaParcial);

  const addCobroStore = useDataStore((state) => state.addCobro);
  const updateCobroStore = useDataStore((state) => state.updateCobro);
  const removeCobroStore = useDataStore((state) => state.removeCobro);

  const entregas = useMemo(() => {
    return storeEntregas.filter((e) => e.trabajo_id === trabajoId);
  }, [storeEntregas, trabajoId]);

  const cobros = useMemo(() => {
    return storeCobros.filter((c) => c.trabajo_id === trabajoId);
  }, [storeCobros, trabajoId]);

  const materiales = useMemo(() => {
    return storeMateriales.filter((m) => m.trabajo_id === trabajoId);
  }, [storeMateriales, trabajoId]);

  const totalMateriales = useMemo(() => {
    return materiales.reduce((sum, m) => sum + m.subtotal, 0);
  }, [materiales]);

  const presupuestoTotal = (job?.presupuesto || 0) + totalMateriales;

  const totalEntregasComprometidas = useMemo(() => {
    return entregas.reduce((sum, e) => sum + e.monto_entrega, 0);
  }, [entregas]);

  const totalCobrado = useMemo(() => {
    return cobros.reduce((sum, c) => sum + c.monto_cobrado, 0);
  }, [cobros]);

  const saldoPendiente = useMemo(() => {
    if (entregas.length > 0) {
      return totalEntregasComprometidas - totalCobrado;
    }
    return presupuestoTotal - totalCobrado;
  }, [entregas.length, totalEntregasComprometidas, totalCobrado, presupuestoTotal]);

  const addEntrega = (data: EntregaParcialFormValues) => {
    const nextNumero = entregas.length + 1;
    addEntregaStore({
      trabajo_id: trabajoId,
      numero_entrega: nextNumero,
      concepto: data.concepto,
      monto_entrega: data.monto_entrega,
      fecha_estimada: data.fecha_estimada,
    });
  };

  const updateEntrega = (id: string, data: EntregaParcialFormValues) => {
    updateEntregaStore(id, {
      concepto: data.concepto,
      monto_entrega: data.monto_entrega,
      fecha_estimada: data.fecha_estimada,
    });
  };

  const removeEntrega = (id: string) => {
    removeEntregaStore(id);
  };

  const addCobro = (data: CobroFormValues) => {
    addCobroStore({
      trabajo_id: trabajoId,
      entrega_parcial_id: data.entrega_parcial_id,
      monto_cobrado: data.monto_cobrado,
      fecha_cobro: data.fecha_cobro,
      forma_pago: data.forma_pago,
      notas: data.notas,
    });
  };

  const updateCobro = (id: string, data: CobroFormValues) => {
    updateCobroStore(id, {
      entrega_parcial_id: data.entrega_parcial_id,
      monto_cobrado: data.monto_cobrado,
      fecha_cobro: data.fecha_cobro,
      forma_pago: data.forma_pago,
      notas: data.notas,
    });
  };

  const removeCobro = (id: string) => {
    removeCobroStore(id);
  };

  // Función auxiliar para obtener el estado de una entrega
  const getEstadoEntrega = (entregaId: string) => {
    const entrega = entregas.find(e => e.id === entregaId);
    if (!entrega) return "Desconocido";
    
    const cobrosEntrega = cobros.filter(c => c.entrega_parcial_id === entregaId);
    const sumCobros = cobrosEntrega.reduce((sum, c) => sum + c.monto_cobrado, 0);
    
    if (sumCobros === 0) return "Pendiente";
    if (sumCobros >= entrega.monto_entrega) return "Pagada";
    return "Parcial";
  };

  return {
    entregas,
    cobros,
    totalEntregasComprometidas,
    totalCobrado,
    presupuestoTotal,
    saldoPendiente,
    addEntrega,
    updateEntrega,
    removeEntrega,
    addCobro,
    updateCobro,
    removeCobro,
    getEstadoEntrega,
  };
}
