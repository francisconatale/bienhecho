import { create } from "zustand";

export type Currency = "€" | "$" | "£" | "ARS";
export type Unit = "unidades" | "horas" | "un.";

export interface Concept {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: Unit;
  price: string; // Store unit price as string, e.g. "150,00"
  amount: string; // Store total as string, e.g. "450,00"
}

interface BudgetState {
  budgetName: string;
  clientId: string | null;
  projectId: string | null;
  workId: string | null;
  concepts: Concept[];
  currency: Currency;
  setBudgetName: (name: string) => void;
  setClient: (id: string | null) => void;
  setProject: (id: string | null) => void;
  setWork: (id: string | null) => void;
  addConcept: (data: Omit<Concept, "id">) => void;
  updateConcept: (id: string, data: Omit<Concept, "id">) => void;
  removeConcept: (id: string) => void;
  setCurrency: (currency: Currency) => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  budgetName: "",
  clientId: null,
  projectId: null,
  workId: null,
  concepts: [
    { id: "1", name: "Diseño de Interfaz UX/UI", description: "Proyecto completo de rediseño móvil", quantity: 1, unit: "unidades", price: "850,00", amount: "850,00" },
    { id: "2", name: "Consultoría Técnica", description: "2 horas de auditoría de sistema", quantity: 2, unit: "horas", price: "60,00", amount: "120,00" },
  ],
  currency: "€",
  setBudgetName: (name) => set({ budgetName: name }),
  setClient: (id) => set({ clientId: id, projectId: null, workId: null }), // Reset project and work when client changes
  setProject: (id) => set({ projectId: id, workId: null }), // Reset work when project changes
  setWork: (id) => set({ workId: id }),
  addConcept: (data) => set((state) => ({
    concepts: [...state.concepts, { id: crypto.randomUUID(), ...data }]
  })),
  updateConcept: (id, data) => set((state) => ({
    concepts: state.concepts.map((concept) =>
      concept.id === id ? { ...concept, ...data } : concept
    )
  })),
  removeConcept: (id) => set((state) => ({
    concepts: state.concepts.filter((concept) => concept.id !== id)
  })),
  setCurrency: (currency) => set({ currency })
}));
