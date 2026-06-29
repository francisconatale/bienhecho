"use client";

import { useProfile } from "@/hooks/use-profile";

export function ProfilePicture() {
  const { profile } = useProfile();
  const displayName = profile?.nombre || "Prestador de Servicios";

  return (
    <section className="flex flex-col items-center">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-surface-container-highest shadow-sm bg-surface-variant">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtLlSZwtWgWGTtJEOxjxbnaAZAtmdvT_rSNGTQm4k_SJ7TS2SAzG4XSdpTCjuhlwm5L4gJZOPnYv2gR-EVysK8AIam_f3uO35aPnu4Ww3YAeip_LniVzfUOtTJT_Y5uEktN6GitT9iWpj0_6czN9Q-F28SMawXmc7CSBH5clYZB7G4TW_lGwrNZ5PFV98aKyVzozGDqKlh-5FAOhENphAuq0ZRxNDObEeYztgxUjqGFHQ4XmNk5CzUpPCtOGZVaxyKOHtoHhsAn-s"
            alt={displayName}
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
  );
}
