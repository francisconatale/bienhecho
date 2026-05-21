import { create } from "zustand";
import { Client, Project, Work, Budget } from "@/types";
import { MOCK_CLIENTS, MOCK_PROJECTS, MOCK_WORKS, MOCK_BUDGETS } from "@/mocks";

interface DataState {
  clients: Client[];
  projects: Project[];
  works: Work[];
  budgets: Budget[];

  // Actions
  addClient: (client: Omit<Client, "id">) => Client;
  updateClient: (id: string, client: Partial<Client>) => void;
  removeClient: (id: string) => void;

  addProject: (project: Omit<Project, "id">) => Project;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;

  addWork: (work: Omit<Work, "id">) => Work;
  updateWork: (id: string, work: Partial<Work>) => void;
  removeWork: (id: string) => void;

  addBudget: (budget: Omit<Budget, "id">) => Budget;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  removeBudget: (id: string) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  clients: [...MOCK_CLIENTS],
  projects: [...MOCK_PROJECTS],
  works: [...MOCK_WORKS],
  budgets: [...MOCK_BUDGETS],

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

  addProject: (projectData) => {
    const newProject = { ...projectData, id: crypto.randomUUID() };
    set((state) => ({ projects: [newProject, ...state.projects] }));
    return newProject;
  },
  updateProject: (id, projectData) => set((state) => ({
    projects: state.projects.map((p) => (p.id === id ? { ...p, ...projectData } : p))
  })),
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id)
  })),

  addWork: (workData) => {
    const newWork = { ...workData, id: crypto.randomUUID() };
    set((state) => ({ works: [newWork, ...state.works] }));
    return newWork;
  },
  updateWork: (id, workData) => set((state) => ({
    works: state.works.map((w) => (w.id === id ? { ...w, ...workData } : w))
  })),
  removeWork: (id) => set((state) => ({
    works: state.works.filter((w) => w.id !== id)
  })),

  addBudget: (budgetData) => {
    const newBudget = { ...budgetData, id: crypto.randomUUID() };
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
