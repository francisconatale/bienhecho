import { Job } from "@/types";
import { JobsSlice, DataStateCreator } from "../types";
import { afterMutation } from "../middleware/cross-slice-sync";

export const createJobsSlice: DataStateCreator<JobsSlice> = (set, get) => ({
  jobs: [
    {
      id: "j1",
      cliente_id: "c1",
      titulo: "Edificio Las Heras",
      direccion: "Las Heras 456",
      presupuesto: 1500000,
      estado: "borrador",
      created_at: new Date().toISOString(),
    },
    {
      id: "j2",
      cliente_id: "c2",
      titulo: "Reforma Consultorio Dental",
      direccion: "Av. Cabildo 789",
      presupuesto: 800000,
      estado: "presupuestado",
      created_at: new Date().toISOString(),
    },
    {
      id: "j3",
      cliente_id: "c3",
      titulo: "Mantenimiento General",
      direccion: "Av. Rivadavia 890",
      presupuesto: 350000,
      estado: "pagado",
      created_at: new Date().toISOString(),
    },
  ],

  addJob: (jobData) => {
    const newJob: Job = {
      ...jobData,
      id: crypto.randomUUID(),
      estado: "borrador",
      created_at: new Date().toISOString(),
    };
    set((state) => ({ jobs: [newJob, ...state.jobs] }));
    return newJob;
  },

  updateJob: (id, jobData) =>
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...jobData } : j)),
    })),

  removeJob: (id) => {
    set((state) => {
      const job = state.jobs.find((j) => j.id === id);
      const result: any = {
        jobs: state.jobs.filter((j) => j.id !== id),
        tasks: state.tasks.filter((t) => t.trabajo_id !== id),
      };
      if (job && job.estado === "presupuestado") {
        result.transacciones = [
          ...state.transacciones,
          {
            id: crypto.randomUUID(),
            cliente_id: job.cliente_id,
            tipo: "abono",
            monto: job.presupuesto,
            concepto: `Anulación de presupuesto/factura: ${job.titulo}`,
            fecha: new Date().toISOString().slice(0, 10),
            referencia_trabajo_id: id,
            referencia_cobro_id: null,
            origen: "automático",
            created_at: new Date().toISOString(),
          },
        ];
      }
      return result;
    });
  },
});
