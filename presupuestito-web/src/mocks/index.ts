import { Client, Project, Work, Budget } from '../types';

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Acme Corp', email: 'contacto@acme.com', phone: '123456789' },
  { id: 'c2', name: 'Stark Industries', email: 'tony@stark.com', phone: '987654321' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'p1', clientId: 'c1', name: 'Rediseño Web Corporativa', status: 'Activo', createdAt: '2023-10-01' },
  { id: 'p2', clientId: 'c2', name: 'Mantenimiento Anual SEO', status: 'Pausado', createdAt: '2023-09-15' },
];

export const MOCK_WORKS: Work[] = [
  { id: 'w1', projectId: 'p1', name: 'Fase 1: UI/UX y Wireframes', status: 'Finalizado' },
  { id: 'w2', projectId: 'p1', name: 'Fase 2: Desarrollo Frontend', status: 'En Progreso' },
  { id: 'w3', projectId: 'p2', name: 'Auditoría Técnica Q4', status: 'Pendiente' },
];

export const MOCK_BUDGETS: Budget[] = [
  { id: 'b1', workId: 'w1', type: 'Mano de Obra', total: 1200 },
  { id: 'b2', workId: 'w2', type: 'Mano de Obra', total: 2500 },
  { id: 'b3', workId: 'w2', type: 'Materiales', total: 300 }, // Ej. Licencias, assets
];
