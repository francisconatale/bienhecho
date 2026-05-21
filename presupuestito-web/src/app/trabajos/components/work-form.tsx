"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/lib/store";

interface WorkFormProps {
  initialProjectId?: string;
  onSuccess?: (workId: string) => void;
  hideProjectSelection?: boolean;
}

export function WorkForm({ initialProjectId = "", onSuccess, hideProjectSelection = false }: WorkFormProps) {
  const router = useRouter();
  const { projects, addWork } = useDataStore();
  const [name, setName] = useState("");
  const [projectId, setProjectId] = useState(initialProjectId);
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newWork = addWork({
      projectId,
      name,
      status: "Pendiente",
    });
    
    if (onSuccess) {
      onSuccess(newWork.id);
    } else {
      router.back();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-surface rounded-3xl p-5 md:p-6 border border-outline-variant/10 shadow-sm space-y-5">
        {!hideProjectSelection && (
          <div>
            <label htmlFor="projectId" className="block text-sm font-semibold text-on-surface mb-2">
              Proyecto <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="projectId"
                required
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-grouped-bg-light dark:bg-[#1A1C20] border border-outline-variant/20 rounded-xl px-4 py-3.5 text-[15px] text-on-surface focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
              >
                <option value="" disabled>Seleccionar un proyecto...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-on-surface mb-2">
            Nombre del Trabajo / Fase <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Pintura General"
            className="w-full bg-grouped-bg-light dark:bg-[#1A1C20] border border-outline-variant/20 rounded-xl px-4 py-3.5 text-[15px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-on-surface mb-2">
            Descripción (Opcional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles adicionales del trabajo..."
            rows={4}
            className="w-full bg-grouped-bg-light dark:bg-[#1A1C20] border border-outline-variant/20 rounded-xl px-4 py-3.5 text-[15px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!name || !projectId}
        className="w-full h-14 rounded-2xl flex items-center justify-center font-bold text-white text-[15px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
      >
        {onSuccess ? "Guardar y Continuar" : "Crear Trabajo"}
      </button>
    </form>
  );
}
