import { Suspense } from "react";
import { WizardHeader } from "./components/wizard-header";
import { NuevoTrabajoWizard } from "./components/nuevo-trabajo-wizard";

export default function NuevoTrabajoPage() {
  return (
    <main className="flex-1 px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-xl md:max-w-2xl mx-auto w-full transition-all">
      <Suspense>
        <WizardHeader />
        <NuevoTrabajoWizard />
      </Suspense>
    </main>
  );
}
