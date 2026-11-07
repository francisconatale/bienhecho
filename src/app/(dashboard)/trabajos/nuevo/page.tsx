import { Suspense } from "react";
import { WizardHeader } from "./components/wizard-header";
import { NuevoTrabajoWizard } from "./components/nuevo-trabajo-wizard";

export default function NuevoTrabajoPage() {
  return (
    <main className="flex-1 px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-xl md:max-w-2xl mx-auto w-full">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-transparent">
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <p className="text-on-surface-variant/60 mt-4 text-sm font-medium animate-pulse">Cargando wizard...</p>
        </div>
      }>
        <WizardHeader />
        <NuevoTrabajoWizard />
      </Suspense>
    </main>
  );
}
