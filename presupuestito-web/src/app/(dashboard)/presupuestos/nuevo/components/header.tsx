import Link from "next/link";

export function NuevoPresupuestoHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant/10 px-4 pb-4 pt-safe flex items-end justify-between transition-all">
      <Link 
        href="/" 
        className="text-primary font-medium text-body px-2 -ml-2 hover:bg-surface-variant rounded-lg py-1 transition-colors min-w-20"
      >
        Cancelar
      </Link>
      
      <h1 className="font-headline text-headline text-on-surface flex-1 text-center font-bold tracking-tight">
        Nuevo Presupuesto
      </h1>

      <button 
        className="text-primary font-bold text-headline px-2 -mr-2 hover:bg-surface-variant rounded-lg py-1 transition-colors min-w-20 text-right"
      >
        Guardar
      </button>
    </header>
  );
}
