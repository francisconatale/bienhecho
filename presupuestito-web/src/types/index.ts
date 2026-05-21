export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  category?: string;
  status?: 'Activo' | 'Pendiente' | 'Inactivo';
}

export interface Job {
  id: string;
  clientId: string;
  name: string; // Ej: "Obra Las Heras" o "Arreglo Termotanque"
  description?: string;
  status: 'Activo' | 'Completado' | 'Pausado' | 'En Progreso';
  createdAt: string;
}

export interface Budget {
  id: string;
  clientId: string;
  jobId: string; // Siempre pertenece a un Trabajo
  type: string;
  total: number;
  date: string;
}
