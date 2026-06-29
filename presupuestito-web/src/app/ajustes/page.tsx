import type { Metadata } from "next";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { AccountSection } from "./components/account-section";
import { SubscriptionSection } from "./components/subscription-section";
import { PreferencesSection } from "./components/preferences-section";
import { AccountActionsSection } from "./components/account-actions-section";

export const metadata: Metadata = {
  title: "Presupuestito - Ajustes",
  description: "Configurá tu cuenta y preferencias",
};

export default function AjustesPage() {
  return (
    <div className="relative w-full min-h-screen">
      <AuroraBackground preset="ajustes" />

      <main className="relative flex-1 px-5 md:px-8 lg:px-12 pt-16 pb-32 w-full transition-all">
        <div className="mb-8 pl-1">
          <h1 className="text-[38px] leading-tight font-extrabold text-on-surface tracking-tight">
            Ajustes
          </h1>
        </div>
        <div className="space-y-6">
          <AccountSection />
          <SubscriptionSection />
          <PreferencesSection />
          <AccountActionsSection />
        </div>
      </main>
    </div>
  );
}
