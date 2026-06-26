export interface Client {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  direccion: string;
  notas?: string;
  created_at: string;
}

export type JobStatus =
  | "presupuestado"
  | "en_curso"
  | "listo_para_facturar"
  | "facturado"
  | "cobrado";

export interface Job {
  id: string;
  cliente_id: string;
  titulo: string;
  direccion: string;
  descripcion?: string;
  presupuesto: number;
  estado: JobStatus;
  fecha_inicio?: string;
  fecha_fin_estimada?: string;
  created_at: string;
}

export interface Task {
  id: string;
  trabajo_id: string;
  descripcion: string;
  precio: number | null;
  completada: boolean;
  orden: number;
}

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

export interface TaskPhoto {
  id: string;
  tarea_id: string;
  url: string;
  descripcion: string;
  orden: number;
  created_at: string;
}
