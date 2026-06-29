"use client";

import { useProfile } from "@/hooks/use-profile";

export function ProfilePicture() {
  const { profile } = useProfile();
  const displayName = profile?.nombre || "Prestador de Servicios";

  return (
    <section className="flex flex-col items-center">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-surface-container-highest shadow-sm bg-surface-variant flex items-center justify-center">
          <span className="text-3xl font-bold text-on-surface-variant uppercase">
            {displayName.charAt(0)}
          </span>
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
  );
}
