import { Metadata } from "next";
import { DashboardHero } from "@/app/(dashboard)/components/dashboard-hero";
import { QuickActions } from "@/app/(dashboard)/components/quick-actions";
import { RecentActivity } from "@/app/(dashboard)/components/recent-activity";

export const metadata: Metadata = {
  title: "Presupuestito - Dashboard",
  description: "Gestioná tus presupuestos y clientes desde un solo lugar",
};

export default function DashboardPage() {
  return (
    <main className="flex-1 pb-24 md:pb-12 w-full pt-4 md:pt-10 transition-all">
      <DashboardHero name="Francisco" activeBudgets={12} totalPending="$4,500" />

      <QuickActions />

      <div className="space-y-6">
        <RecentActivity />
      </div>
    </main>
  );
}
