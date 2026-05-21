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
    handleOpenAdd,
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
          <div className="py-20 text-center">
             <div className="bg-primary/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusCircle className="w-8 h-8 text-primary/40" />
             </div>
             <p className="text-sm font-medium text-on-surface-variant/60">No hay conceptos todavía.</p>
          </div>
        )}
        
        {!isFormOpen && (
          <button 
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-5 py-6 text-primary font-black active:scale-[0.98] transition-all w-full border-t border-outline-variant/10 hover:bg-primary/[0.02] text-[13px] uppercase tracking-widest"
          >
              <PlusCircle className="w-5 h-5" strokeWidth={2.5} />
              <span>Añadir concepto</span>
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-surface rounded-3xl border border-primary/20 p-6 shadow-xl shadow-primary/5">
          <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em]">
                  {editingConcept ? 'Editar Concepto' : 'Nuevo Concepto'}
              </h3>
              <button onClick={handleCloseForm} className="p-2 hover:bg-on-surface/5 rounded-full transition-colors">
                  <X className="w-4 h-4 text-on-surface-variant/40" />
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
