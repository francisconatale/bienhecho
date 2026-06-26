"use client";

import { Client } from "@/types";
import { useClientForm } from "./use-client-form";

interface ClientFormProps {
  initialClient?: Client;
  onSuccess?: (clientId: string) => void;
}

export function ClientForm({ initialClient, onSuccess }: ClientFormProps) {
  const { form, onSubmit, isLoading } = useClientForm(initialClient, onSuccess);
  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-surface rounded-3xl p-5 md:p-6 border border-outline-variant/10 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-semibold text-on-surface mb-2">
              Nombre / Empresa <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Ej. Acme Corp o Juan Pérez"
              className={`w-full bg-grouped-bg-light bg-surface border ${errors.name ? 'border-red-500' : 'border-outline-variant/20'} rounded-xl px-4 py-3.5 text-[15px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-on-surface mb-2">
              Categoría / Rubro
            </label>
            <input
              id="category"
              type="text"
              {...register("category")}
              placeholder="Ej. Construcción, Software, etc."
              className="w-full bg-grouped-bg-light bg-surface border border-outline-variant/20 rounded-xl px-4 py-3.5 text-[15px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-on-surface mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="cliente@ejemplo.com"
              className={`w-full bg-grouped-bg-light bg-surface border ${errors.email ? 'border-red-500' : 'border-outline-variant/20'} rounded-xl px-4 py-3.5 text-[15px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="phone" className="block text-sm font-semibold text-on-surface mb-2">
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="+54 11 ..."
              className="w-full bg-grouped-bg-light bg-surface border border-outline-variant/20 rounded-xl px-4 py-3.5 text-[15px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 rounded-2xl flex items-center justify-center font-bold text-white text-[15px] bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
      >
        {isLoading ? "Guardando..." : initialClient ? "Guardar Cambios" : "Crear Cliente"}
      </button>
    </form>
  );
}
