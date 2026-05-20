import { create } from "zustand";

export type Currency = "€" | "$" | "£" | "ARS";

export interface Concept {
  id: string;
  name: string;
  description: string;
  amount: string; // Store as string without symbol, e.g. "150,00"
}

interface BudgetState {
  concepts: Concept[];
  currency: Currency;
  addConcept: (data: Omit<Concept, "id">) => void;
  updateConcept: (id: string, data: Omit<Concept, "id">) => void;
  removeConcept: (id: string) => void;
  setCurrency: (currency: Currency) => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  concepts: [
    { id: "1", name: "Diseño de Interfaz UX/UI", description: "Proyecto completo de rediseño móvil", amount: "850,00" },
    { id: "2", name: "Consultoría Técnica", description: "2 horas de auditoría de sistema", amount: "120,00" },
  ],
  currency: "€",
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
