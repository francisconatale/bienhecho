"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { ConceptItem } from "./concept-item";
import { useBudgetStore, Concept, Currency } from "../hooks/use-budget";
import { Modal } from "@/components/ui/modal";
import { ConceptForm } from "./concept-form";

export function ConceptList() {
  const { concepts, addConcept, updateConcept, removeConcept, currency, setCurrency } = useBudgetStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConcept, setEditingConcept] = useState<Concept | null>(null);

  const handleOpenAdd = () => {
    setEditingConcept(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (concept: Concept) => {
    setEditingConcept(concept);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingConcept(null);
  };

  const handleSubmit = (data: Omit<Concept, "id">) => {
    if (editingConcept) {
      updateConcept(editingConcept.id, data);
    } else {
      addConcept(data);
    }
    handleCloseModal();
  };

  return (
    <section>
      <div className="flex justify-between items-end px-4 pb-2">
        <h2 className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
          Conceptos
        </h2>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Moneda
          </label>
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="text-xs bg-surface border border-outline-variant/30 rounded-md px-2 py-1 text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="€">EUR (€)</option>
            <option value="$">USD ($)</option>
            <option value="£">GBP (£)</option>
            <option value="ARS">ARS ($)</option>
          </select>
        </div>
      </div>
      
      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden mb-3">
        {concepts.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-on-surface-variant">
            No hay conceptos en este presupuesto.
          </div>
        ) : (
          concepts.map((concept) => (
            <ConceptItem 
              key={concept.id} 
              name={concept.name} 
              description={concept.description} 
              amount={`${concept.amount} ${currency}`} 
              onEdit={() => handleOpenEdit(concept)}
              onDelete={() => removeConcept(concept.id)}
            />
          ))
        )}
      </div>
      <button 
        onClick={handleOpenAdd}
        className="flex items-center gap-2 px-4 py-2 text-primary font-semibold active:scale-95 transition-transform"
      >
        <PlusCircle className="w-6 h-6" strokeWidth={2} />
        <span>Añadir Concepto</span>
      </button>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingConcept ? "Editar Concepto" : "Añadir Concepto"}
      >
        <ConceptForm 
          initialData={editingConcept} 
          onSubmit={handleSubmit} 
          onCancel={handleCloseModal} 
        />
      </Modal>
    </section>
  );
}

