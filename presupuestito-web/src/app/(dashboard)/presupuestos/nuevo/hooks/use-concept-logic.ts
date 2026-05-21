import { useState } from "react";
import { Concept, useBudgetStore } from "./use-budget";

export function useConceptLogic() {
  const { concepts, addConcept, updateConcept, removeConcept, currency } = useBudgetStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConcept, setEditingConcept] = useState<Concept | null>(null);

  const handleOpenAdd = () => {
    setEditingConcept(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (concept: Concept) => {
    setEditingConcept(concept);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingConcept(null);
  };

  const handleSubmit = (data: Omit<Concept, "id">) => {
    if (editingConcept) {
      updateConcept(editingConcept.id, data);
    } else {
      addConcept(data);
    }
    handleCloseForm();
  };

  return {
    concepts,
    currency,
    isFormOpen,
    editingConcept,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseForm,
    handleSubmit,
    removeConcept,
  };
}
