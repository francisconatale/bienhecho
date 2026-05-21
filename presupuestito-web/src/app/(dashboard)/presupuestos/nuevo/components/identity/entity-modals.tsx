"use client";

import { X } from "lucide-react";
import { ProjectForm } from "@/app/proyectos/nuevo/components/project-form";
import { ClientForm } from "@/app/clientes/components/client-form";
import { useBudgetIdentity } from "../../hooks/use-budget-identity";

export function EntityModals() {
  const {
    clientId,
    isNewClientModalOpen,
    isNewProjectModalOpen,
    handleSelectClient,
    handleSelectProject,
    closeNewClientModal,
    closeNewProjectModal,
  } = useBudgetIdentity();

  return (
    <>
      {isNewClientModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center animate-in fade-in duration-300">
          <div className="relative bg-surface rounded-3xl shadow-2xl m-4 w-full max-w-lg">
            <button
              onClick={closeNewClientModal}
              className="absolute -top-2 -right-2 w-8 h-8 bg-surface rounded-full flex items-center justify-center border border-outline-variant/30 z-10 text-on-surface-variant hover:scale-110 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-8">
              <h3 className="text-lg font-bold text-on-surface text-center mb-1">Nuevo Cliente</h3>
              <p className="text-sm text-on-surface-variant text-center mb-6">Añade un nuevo cliente a tu base de datos.</p>
              <ClientForm
                onSuccess={(newId) => {
                  handleSelectClient(newId);
                  closeNewClientModal();
                }}
                onCancel={closeNewClientModal}
              />
            </div>
          </div>
        </div>
      )}

      {isNewProjectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center animate-in fade-in duration-300">
          <div className="relative bg-surface rounded-3xl shadow-2xl m-4 w-full max-w-lg">
            <button
              onClick={closeNewProjectModal}
              className="absolute -top-2 -right-2 w-8 h-8 bg-surface rounded-full flex items-center justify-center border border-outline-variant/30 z-10 text-on-surface-variant hover:scale-110 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-8">
              <h3 className="text-lg font-bold text-on-surface text-center mb-1">Nueva Campaña</h3>
              <p className="text-sm text-on-surface-variant text-center mb-6">Crea una campaña para organizar tus presupuestos.</p>
              <ProjectForm
                initialClientId={clientId}
                hideClientSelection={true}
                onSuccess={(newId) => {
                  handleSelectProject(newId);
                  closeNewProjectModal();
                }}
                onCancel={closeNewProjectModal}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
