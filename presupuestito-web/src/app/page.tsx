import { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { DashboardHero } from "@/app/(dashboard)/components/dashboard-hero";
import { RecentActivity } from "@/app/(dashboard)/components/recent-activity";

export const metadata: Metadata = {
  title: "Presupuestito - Dashboard",
  description: "Gestioná tus presupuestos y clientes desde un solo lugar",
};

export default function DashboardPage() {
  return (
    <main className="flex-1 pb-24 md:pb-12 max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto w-full pt-4 md:pt-10 transition-all">
      <DashboardHero name="Francisco" activeBudgets={12} totalPending="$4,500" />

      {/* Primary Actions Area */}
      <div className="px-5 mt-8 mb-6">
        <Link href="/presupuestos/nuevo" className="block w-full">
          <button
            className="w-full h-14 rounded-full flex items-center justify-center gap-2 font-bold text-white text-[15px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#1E40AF] dark:hover:bg-[#1E3A8A] active:scale-[0.98] transition-all"
            style={{
              boxShadow: '0 8px 24px -6px rgba(30,64,175,0.5)' // Sombra basada en blue-800
            }}
          >
            <PlusCircle className="w-[22px] h-[22px]" strokeWidth={2} />
            Crear Nuevo Presupuesto
          </button>
        </Link>
      </div>

      <div className="space-y-6">
        <RecentActivity />
      </div>
    </main>
  );
}
