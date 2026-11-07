export type JobStatus =
  | "borrador"
  | "presupuestado"
  | "pagado";

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
