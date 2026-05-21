export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  category?: string;
  status?: 'Activo' | 'Pendiente' | 'Inactivo';
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  status: 'Activo' | 'Completado' | 'Pausado';
  createdAt: string;
}

export interface Work {
  id: string;
  projectId: string;
  name: string;
  status: 'Pendiente' | 'En Progreso' | 'Finalizado';
}

export interface Budget {
  id: string;
  clientId: string;
  projectId?: string;
  workId?: string;
  type: 'Materiales' | 'Mano de Obra' | 'Mixto';
  total: number;
  // Conceptos will be added here
}
