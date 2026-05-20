"use client";

import { ChevronRight } from "lucide-react";

interface FormFieldProps {
  label: string;
  id: string;
  type: string;
  defaultValue?: string;
  placeholder?: string;
}

function FormField({ label, id, type, defaultValue, placeholder }: FormFieldProps) {
  return (
    <div className="flex items-center px-4 py-3 min-h-[44px] border-b border-outline-variant/10 last:border-0 bg-surface">
      <label
        htmlFor={id}
        className="w-24 font-medium text-on-surface-variant text-sm shrink-0"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-0 p-0 text-on-surface placeholder-on-surface-variant/40 focus:ring-0 text-sm"
      />
    </div>
  );
}

interface ActionRowProps {
  label: string;
  onClick?: () => void;
}

function ActionRow({ label, onClick }: ActionRowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] text-left hover:bg-surface-variant/30 active:bg-surface-variant/50 transition-colors border-b border-outline-variant/10 last:border-0 bg-surface group"
    >
      <span className="font-medium text-on-surface text-sm">{label}</span>
      <ChevronRight
        className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors shrink-0"
        strokeWidth={2.5}
      />
    </button>
  );
}

export function EditarPerfilContent() {
  return (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <section className="flex flex-col items-center">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-surface-container-highest shadow-sm bg-surface-variant">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtLlSZwtWgWGTtJEOxjxbnaAZAtmdvT_rSNGTQm4k_SJ7TS2SAzG4XSdpTCjuhlwm5L4gJZOPnYv2gR-EVysK8AIam_f3uO35aPnu4Ww3YAeip_LniVzfUOtTJT_Y5uEktN6GitT9iWpj0_6czN9Q-F28SMawXmc7CSBH5clYZB7G4TW_lGwrNZ5PFV98aKyVzozGDqKlh-5FAOhENphAuq0ZRxNDObEeYztgxUjqGFHQ4XmNk5CzUpPCtOGZVaxyKOHtoHhsAn-s"
              alt="Juan Pérez"
              className="w-full h-full object-cover select-none"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/10 opacity-0 group-active:opacity-100 transition-opacity pointer-events-none" />
        </div>
        <button
          type="button"
          className="mt-3 text-primary font-semibold text-sm hover:underline transition-all select-none"
        >
          Cambiar foto
        </button>
      </section>

      {/* Form Fields - Inset Grouped List Style */}
      <section>
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <FormField
            label="Nombre"
            id="full_name"
            type="text"
            defaultValue="Juan Pérez"
          />
          <FormField
            label="Correo"
            id="email"
            type="email"
            defaultValue="juan@empresa.com"
          />
          <FormField
            label="Teléfono"
            id="phone"
            type="tel"
            placeholder="Opcional"
          />
          <FormField
            label="Empresa"
            id="company"
            type="text"
            placeholder="Nombre de empresa"
          />
        </div>
        <p className="mt-2 px-4 text-[11px] text-on-surface-variant/60 font-medium tracking-tight">
          Estos detalles serán visibles en los presupuestos que generes.
        </p>
      </section>

      {/* Secondary Actions Group */}
      <section>
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <ActionRow label="Cambiar Contraseña" />
          <ActionRow label="Preferencias de Notificación" />
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <button
            type="button"
            className="w-full px-4 py-3 min-h-[44px] text-center hover:bg-error/5 active:bg-error/10 transition-colors text-sm font-semibold text-error select-none"
          >
            Cerrar Sesión
          </button>
        </div>
      </section>
    </div>
  );
}
