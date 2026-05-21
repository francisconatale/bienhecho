import { Client, Project, Work, Budget } from '../types';

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Constructora del Sur', category: 'Obras Civiles', status: 'Activo', email: 'contacto@constructora.com' },
  { id: 'c2', name: 'Estudio de Arquitectura M&P', category: 'Diseño & Proyectos', status: 'Pendiente', email: 'info@mparquitectura.com' },
  { id: 'c3', name: 'Administración San Jose', category: 'Consorcios', status: 'Activo', email: 'admin@sanjose.com' },
  { id: 'c4', name: 'Mantenimientos Integrales S.A.', category: 'Servicios', status: 'Activo', email: 'servicios@mantenimientos.com' },
  { id: 'c5', name: 'Fábrica de Muebles Roble', category: 'Industria', status: 'Inactivo', email: 'ventas@roblemuebles.com' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'p1', clientId: 'c1', name: 'Edificio Las Heras', status: 'Activo', createdAt: '2023-10-01' },
  { id: 'p2', clientId: 'c2', name: 'Reforma Consultorio Dental', status: 'Pausado', createdAt: '2023-09-15' },
];

export const MOCK_WORKS: Work[] = [
  { id: 'w1', projectId: 'p1', name: 'Instalación Eléctrica General', status: 'Finalizado' },
  { id: 'w2', projectId: 'p1', name: 'Pintura y Revestimientos', status: 'En Progreso' },
  { id: 'w3', projectId: 'p2', name: 'Plomería y Griferías', status: 'Pendiente' },
];

export const MOCK_BUDGETS: Budget[] = [
  { id: 'b1', clientId: 'c1', projectId: 'p1', workId: 'w1', type: 'Mano de Obra', total: 1200 },
  { id: 'b2', clientId: 'c1', projectId: 'p1', workId: 'w2', type: 'Mano de Obra', total: 2500 },
  { id: 'b3', clientId: 'c1', projectId: 'p1', workId: 'w2', type: 'Materiales', total: 300 },
];
