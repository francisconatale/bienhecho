import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Client, Job, Task, JobStatus, TaskPhoto, Visit, VisitaTarea, VisitStatus, Material, Cobro } from "@/types";

interface DataState {
  clients: Client[];
  jobs: Job[];
  tasks: Task[];
  taskPhotos: TaskPhoto[];
  visits: Visit[];
  visitaTareas: VisitaTarea[];
  materiales: Material[];
  cobros: Cobro[];

  addMaterial: (material: Omit<Material, "id" | "created_at">) => Material;
  updateMaterial: (id: string, material: Partial<Material>) => void;
  removeMaterial: (id: string) => void;

  addCobro: (cobro: Omit<Cobro, "id" | "created_at">) => Cobro;
  updateCobro: (id: string, cobro: Partial<Cobro>) => void;
  removeCobro: (id: string) => void;

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

  addTaskPhoto: (photo: TaskPhoto | Omit<TaskPhoto, "id" | "created_at">) => TaskPhoto;
  updateTaskPhoto: (id: string, photo: Partial<TaskPhoto>) => void;
  removeTaskPhoto: (id: string) => void;
  getTaskPhotos: (tareaId: string) => TaskPhoto[];

  addVisit: (visit: Omit<Visit, "id" | "created_at">) => Visit;
  updateVisit: (id: string, visit: Partial<Visit>) => void;
  removeVisit: (id: string) => void;
  getVisitsByDate: (fecha: string) => Visit[];
  getVisitsByJob: (trabajoId: string) => Visit[];
  addVisitaTarea: (vt: VisitaTarea) => void;
  removeVisitaTarea: (visitaId: string, tareaId: string) => void;
}

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const todayStr = `${yyyy}-${mm}-${dd}`;

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
  taskPhotos: [],
  visits: [
    {
      id: "v1",
      trabajo_id: "j1",
      fecha: todayStr,
      hora_inicio: "09:00",
      hora_fin: "12:00",
      notas: "Revisar instalación eléctrica",
      estado: "planificada",
      created_at: new Date().toISOString(),
    },
    {
      id: "v2",
      trabajo_id: "j1",
      fecha: todayStr,
      hora_inicio: "14:00",
      hora_fin: "17:00",
      notas: "Medir superficies para pintura",
      estado: "planificada",
      created_at: new Date().toISOString(),
    },
    {
      id: "v3",
      trabajo_id: "j2",
      fecha: todayStr,
      hora_inicio: "10:00",
      notas: "Ver avance de demolición",
      estado: "realizada",
      created_at: new Date().toISOString(),
    },
  ],
  visitaTareas: [],
  materiales: [],
  cobros: [],

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
      estado: "borrador",
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
      estado: "pagado",
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
      estado: "borrador",
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
    set((state) => {
      const newTasks = [...state.tasks, newTask];
      const jobTasks = newTasks.filter(t => t.trabajo_id === newTask.trabajo_id);
      const newPresupuesto = jobTasks.reduce((sum, t) => sum + (t.precio || 0), 0);
      return { 
        tasks: newTasks,
        jobs: state.jobs.map(j => j.id === newTask.trabajo_id ? { ...j, presupuesto: newPresupuesto } : j)
      };
    });
    return newTask;
  },
  updateTask: (id, taskData) =>
    set((state) => {
      const newTasks = state.tasks.map((t) => (t.id === id ? { ...t, ...taskData } : t));
      const updatedTask = newTasks.find(t => t.id === id);
      if (updatedTask) {
        const jobTasks = newTasks.filter(t => t.trabajo_id === updatedTask.trabajo_id);
        const newPresupuesto = jobTasks.reduce((sum, t) => sum + (t.precio || 0), 0);
        return {
          tasks: newTasks,
          jobs: state.jobs.map(j => j.id === updatedTask.trabajo_id ? { ...j, presupuesto: newPresupuesto } : j)
        };
      }
      return { tasks: newTasks };
    }),
  removeTask: (id) =>
    set((state) => {
      const taskToRemove = state.tasks.find(t => t.id === id);
      const newTasks = state.tasks.filter((t) => t.id !== id);
      if (taskToRemove) {
        const jobTasks = newTasks.filter(t => t.trabajo_id === taskToRemove.trabajo_id);
        const newPresupuesto = jobTasks.reduce((sum, t) => sum + (t.precio || 0), 0);
        return {
          tasks: newTasks,
          jobs: state.jobs.map(j => j.id === taskToRemove.trabajo_id ? { ...j, presupuesto: newPresupuesto } : j)
        };
      }
      return { tasks: newTasks };
    }),
  reorderTasks: (trabajoId, taskIds) =>
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.trabajo_id !== trabajoId) return t;
        const newIndex = taskIds.indexOf(t.id);
        return newIndex !== -1 ? { ...t, orden: newIndex } : t;
      }),
    })),

  addTaskPhoto: (photoData) => {
    const hasId = "id" in photoData;
    if (hasId) {
      const existing = get().taskPhotos.find(p => p.id === (photoData as TaskPhoto).id);
      if (existing) return existing;
    }
    const newPhoto: TaskPhoto = {
      ...(photoData as TaskPhoto),
      id: hasId ? (photoData as TaskPhoto).id : crypto.randomUUID(),
      created_at: "created_at" in photoData ? (photoData as TaskPhoto).created_at : new Date().toISOString(),
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

  addVisit: (visitData) => {
    const newVisit: Visit = {
      ...visitData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    set((state) => ({ visits: [...state.visits, newVisit] }));
    return newVisit;
  },
  updateVisit: (id, visitData) =>
    set((state) => ({
      visits: state.visits.map((v) => (v.id === id ? { ...v, ...visitData } : v)),
    })),
  removeVisit: (id) =>
    set((state) => ({
      visits: state.visits.filter((v) => v.id !== id),
      visitaTareas: state.visitaTareas.filter((vt) => vt.visita_id !== id),
    })),
  getVisitsByDate: (fecha) => get().visits.filter((v) => v.fecha === fecha),
  getVisitsByJob: (trabajoId) => get().visits.filter((v) => v.trabajo_id === trabajoId),
  addVisitaTarea: (vt) =>
    set((state) => ({ visitaTareas: [...state.visitaTareas, vt] })),
  removeVisitaTarea: (visitaId, tareaId) =>
    set((state) => ({
      visitaTareas: state.visitaTareas.filter(
        (vt) => vt.visita_id !== visitaId || vt.tarea_id !== tareaId
      ),
    })),

  addMaterial: (materialData) => {
    const newMaterial: Material = {
      ...materialData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    set((state) => ({ materiales: [...state.materiales, newMaterial] }));
    return newMaterial;
  },
  updateMaterial: (id, materialData) =>
    set((state) => ({
      materiales: state.materiales.map((m) => (m.id === id ? { ...m, ...materialData } : m)),
    })),
  removeMaterial: (id) =>
    set((state) => ({
      materiales: state.materiales.filter((m) => m.id !== id),
    })),

  addCobro: (cobroData) => {
    const newCobro: Cobro = {
      ...cobroData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    set((state) => ({ cobros: [...state.cobros, newCobro] }));
    return newCobro;
  },
  updateCobro: (id, cobroData) =>
    set((state) => ({
      cobros: state.cobros.map((c) => (c.id === id ? { ...c, ...cobroData } : c)),
    })),
  removeCobro: (id) =>
    set((state) => ({
      cobros: state.cobros.filter((c) => c.id !== id),
    })),
  }),
  {
    name: "presupuestito-store",
  },
),
);
