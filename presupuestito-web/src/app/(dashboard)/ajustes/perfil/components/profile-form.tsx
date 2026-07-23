"use client";

import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/contexts/auth-context";
import { profileService } from "@/services/profile.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useProfileSave } from "./profile-save-context";

export function ProfileForm() {
  const { profile, isLoading } = useProfile();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const { setIsPending } = useProfileSave();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const nombre = formData.get("nombre") as string;
      const rubro = formData.get("rubro") as string;
      const numero_matricula = formData.get("numero_matricula") as string;
      const direccion = formData.get("direccion") as string;
      await profileService.upsert({ nombre, rubro, numero_matricula, direccion });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Perfil guardado", { description: "Tus datos se actualizaron correctamente." });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Error al guardar", { description: "Intentá nuevamente." });
    },
    onSettled: () => {
      setIsSaving(false);
    }
  });

  useEffect(() => {
    setIsPending(mutation.isPending);
  }, [mutation.isPending, setIsPending]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    mutation.mutate(formData);
  };

  const displayName = profile?.nombre || user?.user_metadata?.full_name || "Prestador de Servicios";
  const email = user?.email || "";

  if (isLoading) {
    return (
      <section className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[72px] bg-surface-variant/20 rounded-xl" />
          <div className="h-[72px] bg-surface-variant/20 rounded-xl" />
          <div className="h-[72px] bg-surface-variant/20 rounded-xl" />
          <div className="h-[72px] bg-surface-variant/20 rounded-xl" />
        </div>
      </section>
    );
  }

  return (
    <form id="profile-form" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">Nombre</label>
          <input 
            type="text" 
            name="nombre"
            defaultValue={displayName} 
            required
            autoComplete="name"
            className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">Correo</label>
          <input 
            type="email" 
            defaultValue={email} 
            disabled
            autoComplete="email"
            className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface-variant cursor-not-allowed focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">Número de Matrícula</label>
          <input 
            type="text" 
            name="numero_matricula"
            defaultValue={profile?.numero_matricula || ""} 
            placeholder="Opcional" 
            className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">Rubro</label>
          <input 
            type="text" 
            name="rubro"
            defaultValue={profile?.rubro || ""} 
            placeholder="Tu rubro de trabajo" 
            className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none" 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-on-surface mb-2">Dirección para la factura</label>
          <input 
            type="text" 
            name="direccion"
            defaultValue={profile?.direccion || ""} 
            placeholder="Ej: Av. Corrientes 1234, CABA" 
            autoComplete="street-address"
            className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none" 
          />
        </div>
      </div>
      <p className="mt-4 text-sm text-on-surface-variant/80 font-medium">
        Estos detalles serán visibles en los presupuestos que generes. {isSaving && <span className="text-primary animate-pulse ml-2">Guardando...</span>}
      </p>
    </form>
  );
}
