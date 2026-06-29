import { Suspense } from "react";
import { WizardHeader } from "./components/wizard-header";
import { NuevoTrabajoWizard } from "./components/nuevo-trabajo-wizard";
import { Header } from "@/components/layout/header";

export default function NuevoTrabajoPage() {
  return (
    <>
      <div className="md:hidden">
        <Header title="Nuevo Trabajo" />
      </div>
      <main className="flex-1 px-4 py-6 pb-28 mt-20 md:px-8 md:py-8 md:pb-12 max-w-xl md:max-w-2xl mx-auto w-full md:mt-0 transition-all">
        <Suspense>
          <WizardHeader />
          <NuevoTrabajoWizard />
        </Suspense>
      </main>
    </>
  );
}
