"use client";

import { useProfileSave } from "./profile-save-context";

export function SaveButton() {
  const { isPending } = useProfileSave();

  return (
    <button
      type="submit"
      form="profile-form"
      disabled={isPending}
      aria-label="Guardar cambios del perfil"
      className="text-primary font-bold hover:text-primary-dark transition-colors pb-1 text-[15px] select-none disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {isPending ? "Guardando..." : "Guardar"}
    </button>
  );
}
