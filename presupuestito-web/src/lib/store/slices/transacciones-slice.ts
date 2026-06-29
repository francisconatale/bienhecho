import { TransaccionCuentaCorriente } from "@/types";
import { TransaccionesSlice, DataStateCreator } from "../types";

export const createTransaccionesSlice: DataStateCreator<TransaccionesSlice> = (set, get) => ({
  transacciones: [
    {
      id: "tx1",
      cliente_id: "c2",
      tipo: "cargo",
      monto: 800000,
      concepto: "Emisión de presupuesto: Reforma Consultorio Dental",
      fecha: (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      })(),
      referencia_trabajo_id: "j2",
      referencia_cobro_id: null,
      origen: "automático",
      created_at: new Date().toISOString(),
    },
    {
      id: "tx2",
      cliente_id: "c3",
      tipo: "cargo",
      monto: 350000,
      concepto: "Emisión de presupuesto: Mantenimiento General",
      fecha: (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      })(),
      referencia_trabajo_id: "j3",
      referencia_cobro_id: null,
      origen: "automático",
      created_at: new Date().toISOString(),
    },
  ],

  addTransaccion: (txData) => {
    const newTx: TransaccionCuentaCorriente = {
      ...txData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    set((state) => ({ transacciones: [...state.transacciones, newTx] }));
    return newTx;
  },

  runCCMigration: () => {
    const state = get();
    if (typeof window === "undefined") return;
    const flag = "presupuestito-cc-migrated-v1";
    if (localStorage.getItem(flag)) return;
    if (state.transacciones.length > 0) return;
    const nuevas: TransaccionCuentaCorriente[] = [];
    for (const job of state.jobs) {

    }
    for (const cobro of state.cobros) {
      const job = state.jobs.find((j) => j.id === cobro.trabajo_id);
      if (job) {
        nuevas.push({
          id: crypto.randomUUID(),
          cliente_id: job.cliente_id,
          tipo: "abono",
          monto: cobro.monto_cobrado,
          concepto: `Cobro registrado: $${cobro.monto_cobrado.toLocaleString("es-AR")}`,
          fecha: (cobro.fecha_cobro || new Date().toISOString().slice(0, 10)),
          referencia_trabajo_id: cobro.trabajo_id,
          referencia_cobro_id: cobro.id,
          origen: "automático",
          created_at: new Date().toISOString(),
        });
      }
    }
    if (nuevas.length > 0) {
      set((s) => ({ transacciones: [...s.transacciones, ...nuevas] }));
    }
    try { localStorage.setItem(flag, "true"); } catch {}
  },
});
