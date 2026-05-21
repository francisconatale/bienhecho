"use client";

import { X, PlusCircle } from "lucide-react";
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
      <div className="flex justify-between items-end px-4">
        <h2 className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
          {isFormOpen ? (editingConcept ? 'Editando concepto' : 'Nuevo concepto') : 'Conceptos del presupuesto'}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Lista de Conceptos: Solo se muestra si NO estamos agregando/editando */}
        {!isFormOpen ? (
          <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden divide-y divide-outline-variant/10 animate-in fade-in duration-500">
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
              <div className="py-12 text-center">
                 <p className="text-sm font-medium text-on-surface-variant/40 italic">Todavía no has añadido conceptos.</p>
              </div>
            )}

            {/* Botón de añadir al final de la lista */}
            <button 
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-5 py-6 text-[#2563EB] font-black active:scale-[0.98] transition-all w-full border-t border-outline-variant/10 hover:bg-[#2563EB]/[0.02] text-[13px] uppercase tracking-widest"
            >
              <PlusCircle className="w-5 h-5" strokeWidth={2.5} />
              <span>Añadir concepto</span>
            </button>
          </div>
        ) : (
          /* Formulario de Enfoque Único */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-surface rounded-3xl border-2 border-[#2563EB]/20 p-6 shadow-xl shadow-[#2563EB]/5">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                    <h3 className="text-sm font-black text-on-surface uppercase tracking-[0.2em]">
                        {editingConcept ? 'Modificar Detalles' : 'Completar Detalles'}
                    </h3>
                </div>
                <button 
                    onClick={handleCloseForm} 
                    className="p-2 hover:bg-on-surface/5 rounded-full transition-colors text-on-surface-variant/40"
                    title="Cerrar y volver a la lista"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            <ConceptForm 
                initialData={editingConcept}
                onSubmit={handleSubmit} 
                onCancel={handleCloseForm} 
            />
          </div>
        )}
      </div>
    </section>
  );
}
