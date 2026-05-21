import { create } from "zustand";
import { Client, Job, Budget } from "@/types";

interface DataState {
  clients: Client[];
  jobs: Job[];
  budgets: Budget[];

  // Actions
  addClient: (client: Omit<Client, "id">) => Client;
  updateClient: (id: string, client: Partial<Client>) => void;
  removeClient: (id: string) => void;

  addJob: (job: Omit<Job, "id" | "createdAt" | "status">) => Job;
  updateJob: (id: string, job: Partial<Job>) => void;
  removeJob: (id: string) => void;

  addBudget: (budget: Omit<Budget, "id" | "date">) => Budget;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  removeBudget: (id: string) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  clients: [
    { id: 'c1', name: 'Constructora del Sur', category: 'Obras Civiles', status: 'Activo', email: 'contacto@constructora.com' },
    { id: 'c2', name: 'Estudio de Arquitectura M&P', category: 'Diseño & Proyectos', status: 'Pendiente', email: 'info@mparquitectura.com' },
    { id: 'c3', name: 'Administración San Jose', category: 'Consorcios', status: 'Activo', email: 'admin@sanjose.com' },
  ],
  jobs: [
    { id: 'j1', clientId: 'c1', name: 'Edificio Las Heras', status: 'Activo', createdAt: new Date().toISOString() },
    { id: 'j2', clientId: 'c2', name: 'Reforma Consultorio Dental', status: 'En Progreso', createdAt: new Date().toISOString() },
    { id: 'j3', clientId: 'c3', name: 'Mantenimiento General', status: 'Activo', createdAt: new Date().toISOString() },
  ],
  budgets: [],

  addClient: (clientData) => {
    const newClient = { ...clientData, id: crypto.randomUUID() };
    set((state) => ({ clients: [newClient, ...state.clients] }));
    return newClient;
  },
  updateClient: (id, clientData) => set((state) => ({
    clients: state.clients.map((c) => (c.id === id ? { ...c, ...clientData } : c))
  })),
  removeClient: (id) => set((state) => ({
    clients: state.clients.filter((c) => c.id !== id)
  })),

  addJob: (jobData) => {
    const newJob = { 
      ...jobData, 
      id: crypto.randomUUID(), 
      createdAt: new Date().toISOString(),
      status: 'Activo' as const
    };
    set((state) => ({ jobs: [newJob, ...state.jobs] }));
    return newJob;
  },
  updateJob: (id, jobData) => set((state) => ({
    jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...jobData } : j))
  })),
  removeJob: (id) => set((state) => ({
    jobs: state.jobs.filter((j) => j.id !== id)
  })),

  addBudget: (budgetData) => {
    const newBudget = { 
      ...budgetData, 
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    };
    set((state) => ({ budgets: [newBudget, ...state.budgets] }));
    return newBudget;
  },
  updateBudget: (id, budgetData) => set((state) => ({
    budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...budgetData } : b))
  })),
  removeBudget: (id) => set((state) => ({
    budgets: state.budgets.filter((b) => b.id !== id)
  })),
}));
