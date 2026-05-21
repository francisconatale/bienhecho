"use client";

import { X, User, Briefcase, Mail, Phone, Tag } from "lucide-react";
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

  // Form states
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex justify-center items-center p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-surface rounded-[32px] shadow-2xl border border-outline-variant/30 overflow-hidden animate-in zoom-in-95 duration-300">
            <button 
              onClick={closeNewClientModal} 
              className="absolute -top-2 -right-2 w-8 h-8 bg-surface rounded-full flex items-center justify-center border border-outline-variant/30 z-10 text-on-surface-variant hover:scale-110 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-8">
              <h3 className="text-lg font-bold text-on-surface text-center mb-1">Nuevo Cliente</h3>
              <p className="text-sm text-on-surface-variant text-center mb-6">Crea un perfil de cliente para tus presupuestos.</p>
              
              <form onSubmit={handleCreateClient} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#2563EB]/60 ml-1">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                    <input
                      required
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej: Constructora del Sur"
                      className="w-full bg-surface-variant/5 border border-outline-variant/30 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/5 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#2563EB]/60 ml-1">Email (Opcional)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="email@cliente.com"
                      className="w-full bg-surface-variant/5 border border-outline-variant/30 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/5 outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full mt-4 py-4 bg-[#2563EB] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#2563EB]/20 active:scale-95 transition-all"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex justify-center items-center p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-surface rounded-[32px] shadow-2xl border border-outline-variant/30 overflow-hidden animate-in zoom-in-95 duration-300">
            <button 
              onClick={closeNewJobModal} 
              className="absolute -top-2 -right-2 w-8 h-8 bg-surface rounded-full flex items-center justify-center border border-outline-variant/30 z-10 text-on-surface-variant hover:scale-110 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-8">
              <h3 className="text-lg font-bold text-on-surface text-center mb-1">Nuevo Trabajo / Obra</h3>
              <p className="text-sm text-on-surface-variant text-center mb-6">Identifica esta obra para agrupar sus presupuestos.</p>
              
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#2563EB]/60 ml-1">Nombre del Trabajo</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                    <input
                      required
                      type="text"
                      value={jobName}
                      onChange={(e) => setJobName(e.target.value)}
                      placeholder="Ej: Instalación Eléctrica - Piso 4"
                      className="w-full bg-surface-variant/5 border border-outline-variant/30 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/5 outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full mt-4 py-4 bg-[#2563EB] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#2563EB]/20 active:scale-95 transition-all"
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
