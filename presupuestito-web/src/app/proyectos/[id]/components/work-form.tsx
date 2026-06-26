"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/store";

interface WorkFormProps {
  projectId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function WorkForm({ projectId, onSuccess, onCancel }: WorkFormProps) {
  const addWork = useDataStore((state) => state.addWork);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    
    // Simulate some delay if needed, but here we just call the store
    addWork({
      projectId,
      name: name.trim(),
      status: "Pendiente"
    });

    setIsLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-2">
      <div>
        <label htmlFor="workName" className="block text-sm font-semibold text-on-surface mb-2 pl-1">
          Nombre del Trabajo <span className="text-red-500">*</span>
        </label>
        <input
          id="workName"
          type="text"
          required
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Pintura, Instalación Eléctrica..."
          className="w-full bg-grouped-bg-light dark:bg-surface border border-outline-variant/20 rounded-xl px-4 py-3.5 text-[15px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-12 rounded-2xl font-bold text-on-surface-variant bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-[0.98]"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || !name.trim()}
          className="flex-[2] h-12 rounded-2xl font-bold text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? "Guardando..." : "Crear Trabajo"}
        </button>
      </div>
    </form>
  );
}
