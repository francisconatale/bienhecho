import { create } from "zustand";
import { Client, Job, Task, JobStatus, TaskPhoto } from "@/types";

interface DataState {
  clients: Client[];
  jobs: Job[];
  tasks: Task[];
  taskPhotos: TaskPhoto[];

  addClient: (client: Omit<Client, "id" | "created_at">) => Client;
  updateClient: (id: string, client: Partial<Client>) => void;
  removeClient: (id: string) => void;

  addJob: (job: Omit<Job, "id" | "created_at" | "estado">) => Job;
  updateJob: (id: string, job: Partial<Job>) => void;
  removeJob: (id: string) => void;

  addTask: (task: Omit<Task, "id">) => Task;
  updateTask: (id: string, task: Partial<Task>) => void;
  removeTask: (id: string) => void;
  reorderTasks: (trabajoId: string, taskIds: string[]) => void;

  addTaskPhoto: (photo: Omit<TaskPhoto, "id" | "created_at">) => TaskPhoto;
  updateTaskPhoto: (id: string, photo: Partial<TaskPhoto>) => void;
  removeTaskPhoto: (id: string) => void;
  getTaskPhotos: (tareaId: string) => TaskPhoto[];
}

export const useDataStore = create<DataState>((set, get) => ({
  taskPhotos: [],

  clients: [
    {
      id: "c1",
      nombre: "Constructora del Sur",
      telefono: "11-4567-8901",
      email: "contacto@constructora.com",
      direccion: "Av. Corrientes 1234",
      notas: "Cliente frecuente",
      created_at: new Date().toISOString(),
    },
    {
      id: "c2",
      nombre: "Estudio de Arquitectura M&P",
      telefono: "11-5678-9012",
      email: "info@mparquitectura.com",
      direccion: "Av. Santa Fe 567",
      created_at: new Date().toISOString(),
    },
    {
      id: "c3",
      nombre: "Administración San Jose",
      telefono: "11-6789-0123",
      email: "admin@sanjose.com",
      direccion: "Av. Rivadavia 890",
      notas: "Consorcio",
      created_at: new Date().toISOString(),
    },
  ],
  jobs: [
    {
      id: "j1",
      cliente_id: "c1",
      titulo: "Edificio Las Heras",
      direccion: "Las Heras 456",
      presupuesto: 1500000,
      estado: "en_curso",
      created_at: new Date().toISOString(),
    },
    {
      id: "j2",
      cliente_id: "c2",
      titulo: "Reforma Consultorio Dental",
      direccion: "Av. Cabildo 789",
      presupuesto: 800000,
      estado: "presupuestado",
      created_at: new Date().toISOString(),
    },
    {
      id: "j3",
      cliente_id: "c3",
      titulo: "Mantenimiento General",
      direccion: "Av. Rivadavia 890",
      presupuesto: 350000,
      estado: "listo_para_facturar",
      created_at: new Date().toISOString(),
    },
  ],
  tasks: [
    { id: "t1", trabajo_id: "j1", descripcion: "Instalación eléctrica general", precio: 450000, completada: true, orden: 1 },
    { id: "t2", trabajo_id: "j1", descripcion: "Pintura interior", precio: 320000, completada: false, orden: 2 },
    { id: "t3", trabajo_id: "j1", descripcion: "Limpieza final", precio: null, completada: false, orden: 3 },
    { id: "t4", trabajo_id: "j2", descripcion: "Demolición de paredes", precio: 180000, completada: false, orden: 1 },
    { id: "t5", trabajo_id: "j2", descripcion: "Instalación hidráulica", precio: 250000, completada: false, orden: 2 },
    { id: "t6", trabajo_id: "j3", descripcion: "Reparación de grietas", precio: 120000, completada: true, orden: 1 },
    { id: "t7", trabajo_id: "j3", descripcion: "Pintura exterior", precio: 180000, completada: true, orden: 2 },
  ],

  addClient: (clientData) => {
    const newClient: Client = {
      ...clientData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    set((state) => ({ clients: [newClient, ...state.clients] }));
    return newClient;
  },
  updateClient: (id, clientData) =>
    set((state) => ({
      clients: state.clients.map((c) => (c.id === id ? { ...c, ...clientData } : c)),
    })),
  removeClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    })),

  addJob: (jobData) => {
    const newJob: Job = {
      ...jobData,
      id: crypto.randomUUID(),
      estado: "presupuestado",
      created_at: new Date().toISOString(),
    };
    set((state) => ({ jobs: [newJob, ...state.jobs] }));
    return newJob;
  },
  updateJob: (id, jobData) =>
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...jobData } : j)),
    })),
  removeJob: (id) =>
    set((state) => ({
      jobs: state.jobs.filter((j) => j.id !== id),
      tasks: state.tasks.filter((t) => t.trabajo_id !== id),
    })),

  addTask: (taskData) => {
    const newTask: Task = { ...taskData, id: crypto.randomUUID() };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    return newTask;
  },
  updateTask: (id, taskData) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...taskData } : t)),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
  reorderTasks: (trabajoId, taskIds) =>
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.trabajo_id !== trabajoId) return t;
        const newIndex = taskIds.indexOf(t.id);
        return newIndex !== -1 ? { ...t, orden: newIndex } : t;
      }),
    })),

  addTaskPhoto: (photoData) => {
    const newPhoto: TaskPhoto = {
      ...photoData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    set((state) => ({ taskPhotos: [...state.taskPhotos, newPhoto] }));
    return newPhoto;
  },
  updateTaskPhoto: (id, photoData) =>
    set((state) => ({
      taskPhotos: state.taskPhotos.map((p) => (p.id === id ? { ...p, ...photoData } : p)),
    })),
  removeTaskPhoto: (id) =>
    set((state) => ({
      taskPhotos: state.taskPhotos.filter((p) => p.id !== id),
    })),
  getTaskPhotos: (tareaId) => get().taskPhotos.filter((p) => p.tarea_id === tareaId),
}));
