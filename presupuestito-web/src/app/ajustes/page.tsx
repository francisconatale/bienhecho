import type { Metadata } from "next";
import { AjustesHeader } from "@/app/ajustes/components/header";
import { AjustesContent } from "@/app/ajustes/components/content";
import { BottomNav } from "@/components/layout/bottom-nav";

export const metadata: Metadata = {
  title: "Presupuestito - Ajustes",
  description: "Configurá tu cuenta y preferencias",
};

export default function AjustesPage() {
  return (
    <>
      <AjustesHeader />

      <main className="flex-1 px-4 py-6 space-y-6 mt-20 pb-24 max-w-3xl mx-auto w-full">
        <AjustesContent />
      </main>

      <BottomNav />
    </>
  );
}
