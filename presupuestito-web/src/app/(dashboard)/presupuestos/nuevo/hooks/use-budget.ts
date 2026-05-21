import { create } from "zustand";

export type Currency = "€" | "$" | "£" | "ARS";
export type Unit = "un." | "hs." | "m2" | "m3" | "ml" | "kg" | "gl";

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
  step: 1 | 2;
  budgetName: string;
  clientId: string | null;
  projectId: string | null;
  workId: string | null;
  concepts: Concept[];
  currency: Currency;
  setStep: (step: 1 | 2) => void;
  setBudgetName: (name: string) => void;
  setClient: (id: string | null) => void;
  setProject: (id: string | null) => void;
  setWork: (id: string | null) => void;
  addConcept: (data: Omit<Concept, "id">) => void;
  updateConcept: (id: string, data: Omit<Concept, "id">) => void;
  removeConcept: (id: string) => void;
  setCurrency: (currency: Currency) => void;
  reset: () => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  step: 1,
  budgetName: "",
  clientId: null,
  projectId: null,
  workId: null,
  concepts: [],
  currency: "ARS",
  setStep: (step) => set({ step }),
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
  setCurrency: (currency) => set({ currency }),
  reset: () => set({
    step: 1,
    budgetName: "",
    clientId: null,
    projectId: null,
    workId: null,
    concepts: [],
    currency: "ARS"
  })
}));
