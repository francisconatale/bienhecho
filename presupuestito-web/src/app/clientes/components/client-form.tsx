"use client";

import { Client } from "@/types";
import { useClientForm } from "./use-client-form";

interface ClientFormProps {
  initialClient?: Client;
  onSuccess?: (clientId: string) => void;
}

export function ClientForm({ initialClient, onSuccess }: ClientFormProps) {
  const { form, onSubmit, isLoading } = useClientForm(initialClient, onSuccess);
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label
              htmlFor="nombre"
              className="block text-sm font-semibold text-on-surface mb-2"
            >
              Nombre / Empresa <span className="text-red-500">*</span>
            </label>
            <input
              id="nombre"
              type="text"
              {...register("nombre")}
              placeholder="Ej. Acme Corp o Juan Pérez"
              className={`w-full bg-surface border ${
                errors.nombre ? "border-red-500" : "border-outline-variant/20"
              } rounded-xl px-4 py-3.5 text-[15px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20`}
            />
            {errors.nombre && (
              <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-on-surface mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="cliente@ejemplo.com"
              className={`w-full bg-surface border ${
                errors.email ? "border-red-500" : "border-outline-variant/20"
              } rounded-xl px-4 py-3.5 text-[15px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="telefono"
              className="block text-sm font-semibold text-on-surface mb-2"
            >
              Teléfono
            </label>
            <input
              id="telefono"
              type="tel"
              {...register("telefono")}
              placeholder="+54 11 ..."
              className="w-full bg-surface border border-outline-variant/20 rounded-xl px-4 py-3.5 text-[15px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="direccion"
              className="block text-sm font-semibold text-on-surface mb-2"
            >
              Dirección
            </label>
            <input
              id="direccion"
              type="text"
              {...register("direccion")}
              placeholder="Av. Corrientes 1234"
              className="w-full bg-surface border border-outline-variant/20 rounded-xl px-4 py-3.5 text-[15px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
