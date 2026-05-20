import { CircleUserRound, PlusCircle } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant/10 px-4 pb-4 pt-safe flex items-end justify-between transition-all">
      <button
        aria-label="Profile"
        className="text-primary p-2 -ml-2 rounded-full hover:bg-surface-variant transition-colors"
      >
        <CircleUserRound className="w-8 h-8" strokeWidth={1.5} />
      </button>
      <h1 className="font-headline-large-mobile text-headline-large-mobile text-primary flex-1 text-center font-bold tracking-tight">
        Presupuestito
      </h1>
      <button
        aria-label="Add"
        className="text-primary p-2 -mr-2 rounded-full hover:bg-surface-variant transition-colors"
      >
        <PlusCircle className="w-8 h-8" strokeWidth={1.5} />
      </button>
    </header>
  );
}
