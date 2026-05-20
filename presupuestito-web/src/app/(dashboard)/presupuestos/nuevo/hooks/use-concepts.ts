import { useState } from "react";

export interface Concept {
  id: string;
  name: string;
  description: string;
  amount: string;
}

const INITIAL_CONCEPTS: Concept[] = [
  { id: "1", name: "Diseño de Interfaz UX/UI", description: "Proyecto completo de rediseño móvil", amount: "850,00 €" },
  { id: "2", name: "Consultoría Técnica", description: "2 horas de auditoría de sistema", amount: "120,00 €" },
];

export function useConcepts() {
  const [concepts, setConcepts] = useState<Concept[]>(INITIAL_CONCEPTS);

  const addConcept = (data: Omit<Concept, "id">) => {
    const newConcept: Concept = {
      id: crypto.randomUUID(),
      ...data,
    };
    setConcepts((prev) => [...prev, newConcept]);
  };

  const updateConcept = (id: string, data: Omit<Concept, "id">) => {
    setConcepts((prev) =>
      prev.map((concept) =>
        concept.id === id ? { ...concept, ...data } : concept
      )
    );
  };

  const removeConcept = (id: string) => {
    setConcepts((prev) => prev.filter((concept) => concept.id !== id));
  };

  return { concepts, addConcept, updateConcept, removeConcept };
}
