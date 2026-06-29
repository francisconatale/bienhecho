"use client";

import { useUserStore } from "@/lib/user-store";
import { FormField } from "./form-field";

export function ProfileForm() {
  const user = useUserStore((state) => state.user);
  const displayName = user?.name || "Juan Pérez";

  return (
    <section>
      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <FormField
          label="Nombre"
          id="full_name"
          type="text"
          defaultValue={displayName}
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
  );
}
