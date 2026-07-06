export interface Task {
  id: string;
  trabajo_id: string;
  descripcion: string;
  cantidad?: number;
  precio_unitario?: number;
  precio: number | null;
  completada: boolean;
  orden: number;
}

export interface TaskPhoto {
  id: string;
  tarea_id: string;
  url: string;
  descripcion: string;
  orden: number;
  created_at: string;
}
