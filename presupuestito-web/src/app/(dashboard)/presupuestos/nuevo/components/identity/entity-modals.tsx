"use client";

import { X, User, Briefcase, Mail } from "lucide-react";
import { useBudgetIdentity } from "../../hooks/use-budget-identity";
import { useDataStore } from "@/lib/store";
import { useState } from "react";

export function EntityModals() {
  const {
    clientId,
    isNewClientModalOpen,
    isNewJobModalOpen,
    closeNewClientModal,
    closeNewJobModal,
    handleSelectClient,
    handleSelectJob
  } = useBudgetIdentity();

  const { addClient, addJob } = useDataStore();

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [jobName, setJobName] = useState("");

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient = addClient({
      name: clientName,
      email: clientEmail,
      status: 'Activo'
    });
    handleSelectClient(newClient.id);
    closeNewClientModal();
    setClientName("");
    setClientEmail("");
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    const newJob = addJob({
      clientId,
      name: jobName
    });
    handleSelectJob(newJob.id);
    closeNewJobModal();
    setJobName("");
  };

  return (
    <>
      {/* Nuevo Cliente Modal */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-surface rounded-xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-on-surface">Nuevo Cliente</h3>
                <button
                  onClick={closeNewClientModal}
                  className="p-1 hover:bg-surface-variant/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-on-surface-variant/60" />
                </button>
              </div>
              <p className="text-xs text-on-surface-variant mb-5">Crea un perfil de cliente para tus presupuestos.</p>

              <form onSubmit={handleCreateClient} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-on-surface-variant mb-1.5 block">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                    <input
                      required
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej: Constructora del Sur"
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg pl-10 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-on-surface-variant/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-on-surface-variant mb-1.5 block">Email (Opcional)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="email@cliente.com"
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg pl-10 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-on-surface-variant/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary text-on-primary text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Guardar Cliente
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Nuevo Trabajo Modal */}
      {isNewJobModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-surface rounded-xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-on-surface">Nuevo Trabajo / Obra</h3>
                <button
                  onClick={closeNewJobModal}
                  className="p-1 hover:bg-surface-variant/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-on-surface-variant/60" />
                </button>
              </div>
              <p className="text-xs text-on-surface-variant mb-5">Identifica esta obra para agrupar sus presupuestos.</p>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-on-surface-variant mb-1.5 block">Nombre del Trabajo</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                    <input
                      required
                      type="text"
                      value={jobName}
                      onChange={(e) => setJobName(e.target.value)}
                      placeholder="Ej: Instalación Eléctrica - Piso 4"
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg pl-10 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-on-surface-variant/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary text-on-primary text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Crear Trabajo
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
