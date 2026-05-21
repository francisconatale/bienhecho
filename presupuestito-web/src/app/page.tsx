"use client";

import { DashboardHero } from "@/app/(dashboard)/components/dashboard-hero";
import { QuickActions } from "@/app/(dashboard)/components/quick-actions";
import { RecentActivity } from "@/app/(dashboard)/components/recent-activity";

import { useDataStore } from "@/lib/store";

export default function DashboardPage() {
  const { budgets } = useDataStore();
  
  const totalPendingNum = budgets.reduce((acc, b) => acc + b.total, 0);
  const formatCurrency = (num: number) => {
    return num.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });
  };

  return (
    <main className="flex-1 pb-24 md:pb-12 w-full pt-4 md:pt-10 transition-all">
      <DashboardHero 
        activeBudgets={budgets.length} 
        totalPending={formatCurrency(totalPendingNum)} 
      />

      <QuickActions />

      <div className="space-y-6">
        <RecentActivity />
      </div>
    </main>
  );
}
