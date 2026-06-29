export type VisitStatus = "planificada" | "realizada" | "cancelada";

export interface Visit {
  id: string;
  trabajo_id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin?: string;
  notas?: string;
  estado: VisitStatus;
  created_at: string;
}

export interface VisitaTarea {
  visita_id: string;
  tarea_id: string;
  nota_progreso?: string;
}
