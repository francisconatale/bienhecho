import Link from "next/link";

export function EditarPerfilHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant/10 px-4 pb-4 pt-safe flex items-end justify-between transition-all">
      <Link
        href="/ajustes"
        className="text-primary font-medium hover:opacity-70 transition-opacity pb-1 text-sm select-none"
      >
        Cancelar
      </Link>
      <h1 className="font-headline-large-mobile text-headline-large-mobile text-primary flex-1 text-center font-bold tracking-tight">
        Editar Perfil
      </h1>
      <button
        type="button"
        className="text-primary font-semibold hover:opacity-70 transition-opacity pb-1 text-sm select-none"
      >
        Guardar
      </button>
    </header>
  );
}
