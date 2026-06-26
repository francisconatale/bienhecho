"use client";

import { X, Plus } from "lucide-react";
import { ConceptItem } from "./concept-item";
import { ConceptForm } from "./concept-form";
import { useConceptLogic } from "../../hooks/use-concept-logic";

export function ConceptList() {
  const {
    concepts,
    currency,
    isFormOpen,
    editingConcept,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseForm,
    handleSubmit,
    removeConcept,
  } = useConceptLogic();

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-on-surface-variant">Conceptos</h3>
        {!isFormOpen && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Añadir
          </button>
        )}
      </div>

      {!isFormOpen ? (
        <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-hidden">
          {concepts.length > 0 ? (
            concepts.map((concept) => (
              <ConceptItem
                key={concept.id}
                name={concept.name}
                description={concept.description}
                quantity={concept.quantity}
                unit={concept.unit}
                price={concept.price}
                amount={`${concept.amount} ${currency}`}
                onEdit={() => handleOpenEdit(concept)}
                onDelete={() => removeConcept(concept.id)}
              />
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-xs text-on-surface-variant/60 italic">Sin conceptos aún</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-outline-variant/30 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-on-surface">
              {editingConcept ? "Editar Concepto" : "Nuevo Concepto"}
            </h3>
            <button
              onClick={handleCloseForm}
              className="p-1 hover:bg-surface-variant/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-on-surface-variant/60" />
            </button>
          </div>
          <ConceptForm
            initialData={editingConcept}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        </div>
      )}
    </section>
  );
}
