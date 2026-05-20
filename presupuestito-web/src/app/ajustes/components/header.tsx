export function AjustesHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant/10 px-4 pb-4 pt-safe flex items-end justify-between transition-all">
      {/* Spacer for centering title */}
      <div className="w-10" />
      <h1 className="font-headline-large-mobile text-headline-large-mobile text-primary flex-1 text-center font-bold tracking-tight">
        Ajustes
      </h1>
      <div className="w-10" />
    </header>
  );
}
