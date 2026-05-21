"use client";

import { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { ConceptItem } from "./concept-item";
import { useBudgetStore, Concept, Currency } from "../hooks/use-budget";
import { ConceptForm } from "./concept-form";

export function ConceptList() {
  const { concepts, addConcept, updateConcept, removeConcept, currency, setCurrency } = useBudgetStore();
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
      
      <div className="space-y-4">
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
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
             <div className="py-10 text-center text-sm text-on-surface-variant">
               No hay conceptos. ¡Agregá el primero!
             </div>
          )}
           <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-3 text-primary font-semibold active:scale-95 transition-transform w-full border-t border-dashed border-outline-variant/30 hover:bg-primary/5"
          >
            <PlusCircle className="w-5 h-5" strokeWidth={2} />
            <span>Añadir Concepto</span>
          </button>
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg p-4">
               <button onClick={handleCloseForm} className="absolute -top-2 -right-2 w-8 h-8 bg-surface rounded-full flex items-center justify-center border border-outline-variant/30 z-10 text-on-surface-variant hover:scale-110 transition-transform">
                <X className="w-4 h-4"/>
              </button>
              <ConceptForm 
                initialData={editingConcept}
                onSubmit={handleSubmit} 
                onCancel={handleCloseForm} 
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

