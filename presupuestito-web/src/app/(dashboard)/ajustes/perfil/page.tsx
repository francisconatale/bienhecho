import type { Metadata } from "next";
import { Suspense } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from "next/link";
import { ProfileLayout } from "./components/profile-layout";

export const metadata: Metadata = {
  title: "Presupuestito - Editar Perfil",
  description: "Modificá los datos de tu cuenta personal y empresa",
};

function ProfileFallback() {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-outline-variant/10 animate-pulse" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="w-24 h-3 bg-outline-variant/10 rounded animate-pulse" />
            <div className="w-full h-10 bg-outline-variant/10 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EditarPerfilPage() {
  return (
    <div className="relative w-full min-h-screen">
      <AuroraBackground preset="perfil" />

      <main className="relative flex-1 px-5 md:px-8 lg:px-12 pt-14 pb-32 max-w-7xl mx-auto w-full space-y-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/ajustes"
            className="text-on-surface-variant font-medium hover:text-on-surface transition-colors pb-1 text-[15px] select-none"
          >
            Cancelar
          </Link>
          <h1 className="text-[20px] leading-tight font-bold text-on-surface tracking-tight absolute left-1/2 -translate-x-1/2">
            Editar Perfil
          </h1>
          <button
            type="submit"
            form="profile-form"
            className="text-primary font-bold hover:text-primary-dark transition-colors pb-1 text-[15px] select-none"
          >
            Guardar
          </button>
        </div>

        <Suspense fallback={<ProfileFallback />}>
          <ProfileLayout />
        </Suspense>
      </main>
    </div>
  );
}
