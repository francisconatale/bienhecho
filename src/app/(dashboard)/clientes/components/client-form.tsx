"use client";

import { Client } from "@/types";
import { useClientForm } from "./use-client-form";
import { cn } from "@/lib/utils";

interface ClientFormProps {
  initialClient?: Client;
  onSuccess?: (clientId: string) => void;
  onCancel?: () => void;
}

const inputClasses = "w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-colors";

export function ClientForm({ initialClient, onSuccess, onCancel }: ClientFormProps) {
  const { form, onSubmit, isLoading } = useClientForm(initialClient, onSuccess);
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-on-surface-variant/50">
          Nombre / Empresa <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("nombre")}
          placeholder="Ej. Acme Corp o María Gómez"
          aria-invalid={!!errors.nombre}
          aria-describedby={errors.nombre ? "client-nombre-error" : undefined}
          className={cn(inputClasses, errors.nombre && "border-red-500")}
        />
        {errors.nombre && (
          <p id="client-nombre-error" role="alert" className="text-xs font-bold text-red-500 mt-1">
            {errors.nombre.message}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="space-y-1.5 flex-1">
          <label className="text-[11px] font-bold text-on-surface-variant/50">Email</label>
          <input
            type="email"
            {...register("email")}
            placeholder="cliente@ejemplo.com"
            aria-label="Email"
            aria-invalid={!!errors.email}
            className={cn(inputClasses, errors.email && "border-red-500")}
          />
          {errors.email && (
            <p className="text-xs font-bold text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="space-y-1.5 flex-1">
          <label className="text-[11px] font-bold text-on-surface-variant/50">Teléfono</label>
          <input
            type="tel"
            {...register("telefono")}
            placeholder="+54 11 ..."
            aria-label="Teléfono"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-on-surface-variant/50">Dirección</label>
        <input
          type="text"
          {...register("direccion")}
          placeholder="Av. Corrientes 1234"
          aria-label="Dirección"
          className={inputClasses}
        />
      </div>

      <div className="flex gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 rounded-full bg-on-surface/5 text-on-surface font-bold text-xs hover:bg-on-surface/10 transition-[background-color,transform] active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "flex-1 py-3 rounded-full font-bold text-xs transition-[background-color,transform] active:scale-[0.96] flex items-center justify-center gap-2",
            isLoading
              ? "bg-primary/60 text-white cursor-wait"
              : "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
          )}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {initialClient ? "Guardando..." : "Creando..."}
            </>
          ) : initialClient ? "Guardar" : "Crear Cliente"}
        </button>
      </div>
    </form>
  );
}
