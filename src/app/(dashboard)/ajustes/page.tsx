import type { Metadata } from "next";
import { Suspense } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { AccountSection } from "./components/account-section";
import { SubscriptionSection } from "./components/subscription-section";
import { PreferencesSection } from "./components/preferences-section";
import { AccountActionsSection } from "./components/account-actions-section";
import { profileService_get } from "@/actions/profile.actions";

export const metadata: Metadata = {
  title: "Ajustes",
  description: "Configurá tu cuenta y preferencias",
};

function SectionFallback() {
  return (
    <div className="bg-surface/60 backdrop-blur-xl rounded-2xl border border-outline-variant/15 p-6 shadow-sm">
      <div className="w-36 h-5 bg-outline-variant/10 rounded animate-pulse mb-5" />
      <div className="space-y-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="w-32 h-3.5 bg-outline-variant/10 rounded animate-pulse" />
              <div className="w-48 h-2.5 bg-outline-variant/8 rounded animate-pulse" />
            </div>
            <div className="w-10 h-6 bg-outline-variant/10 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function AjustesPage() {
  const profile = await profileService_get();

  return (
    <div className="relative w-full min-h-screen">
      <AuroraBackground preset="ajustes" />

      <main className="relative flex-1 px-5 md:px-8 lg:px-12 pt-16 pb-32 w-full">
        <div className="max-w-7xl mx-auto mb-8 pl-1">
          <h1 className="text-[38px] leading-tight font-extrabold text-on-surface tracking-tight">
            Ajustes
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto items-start">
          <div className="lg:col-span-8 flex flex-col space-y-6">
            <Suspense fallback={<SectionFallback />}>
              <AccountSection initialData={profile} />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <PreferencesSection />
            </Suspense>
          </div>
          <div className="lg:col-span-4 flex flex-col space-y-6">
            <Suspense fallback={<SectionFallback />}>
              <SubscriptionSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <AccountActionsSection />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
