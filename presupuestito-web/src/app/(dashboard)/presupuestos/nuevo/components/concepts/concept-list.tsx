"use client";

import { PlusCircle, X } from "lucide-react";
import { ConceptItem } from "./concept-item";
import { ConceptForm } from "./concept-form";
import { useConceptLogic } from "../../hooks/use-concept-logic";

export function ConceptList() {
  const {
    concepts,
    currency,
    isFormOpen,
    editingConcept,
    handleOpenEdit,
    handleCloseForm,
    handleSubmit,
    removeConcept,
  } = useConceptLogic();

  return (
    <section className="space-y-6">
      <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden">
        {concepts.length > 0 ? (
          <div className="divide-y divide-outline-variant/10">
            {concepts.map((concept) => (
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
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
             <p className="text-sm font-medium text-on-surface-variant/40 italic">La lista de conceptos está vacía.</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex justify-center items-center p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-300">
              <button 
                onClick={handleCloseForm} 
                className="absolute -top-4 -right-4 w-10 h-10 bg-surface rounded-full flex items-center justify-center border border-outline-variant/30 z-10 text-on-surface-variant shadow-xl active:scale-90 transition-transform"
              >
                <X className="w-5 h-5"/>
              </button>
              <div className="bg-surface rounded-3xl border border-primary/20 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em]">
                        {editingConcept ? 'Editar Concepto' : 'Nuevo Concepto'}
                    </h3>
                </div>
                <ConceptForm 
                    initialData={editingConcept}
                    onSubmit={handleSubmit} 
                    onCancel={handleCloseForm} 
                />
              </div>
          </div>
        </div>
      )}
    </section>
  );
}
