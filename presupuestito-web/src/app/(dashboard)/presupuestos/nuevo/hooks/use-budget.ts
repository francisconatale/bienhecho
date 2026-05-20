import { create } from "zustand";

export type Currency = "€" | "$" | "£" | "ARS";

export interface Concept {
  id: string;
  name: string;
  description: string;
  amount: string; // Store as string without symbol, e.g. "150,00"
}

interface BudgetState {
  step: 1 | 2;
  clientId: string | null;
  projectId: string | null;
  workId: string | null;
  concepts: Concept[];
  currency: Currency;
  setStep: (step: 1 | 2) => void;
  setClient: (id: string | null) => void;
  setProject: (id: string | null) => void;
  setWork: (id: string | null) => void;
  addConcept: (data: Omit<Concept, "id">) => void;
  updateConcept: (id: string, data: Omit<Concept, "id">) => void;
  removeConcept: (id: string) => void;
  setCurrency: (currency: Currency) => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  step: 1,
  clientId: null,
  projectId: null,
  workId: null,
  concepts: [
    { id: "1", name: "Diseño de Interfaz UX/UI", description: "Proyecto completo de rediseño móvil", amount: "850,00" },
    { id: "2", name: "Consultoría Técnica", description: "2 horas de auditoría de sistema", amount: "120,00" },
  ],
  currency: "€",
  setStep: (step) => set({ step }),
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
