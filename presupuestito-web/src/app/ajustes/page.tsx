import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { AjustesContent } from "@/app/ajustes/components/content";
import { BottomNav } from "@/components/layout/bottom-nav";

export const metadata: Metadata = {
  title: "Presupuestito - Ajustes",
  description: "Configurá tu cuenta y preferencias",
};

export default function AjustesPage() {
  return (
    <>
      <Header title="Ajustes" />

      <main className="flex-1 px-4 py-6 space-y-6 mt-20 pb-24 max-w-3xl mx-auto w-full">
        <AjustesContent />
      </main>

      <BottomNav />
    </>
  );
}
