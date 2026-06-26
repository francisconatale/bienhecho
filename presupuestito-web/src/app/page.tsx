"use client";

import { DashboardHero } from "@/app/(dashboard)/components/dashboard-hero";
import { QuickActions } from "@/app/(dashboard)/components/quick-actions";
import { RecentActivity } from "@/app/(dashboard)/components/recent-activity";
import { UpcomingVisits } from "@/app/(dashboard)/components/upcoming-visits";

import { useDataStore } from "@/lib/store";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { jobs } = useDataStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalPendingNum = jobs
    .filter((j) => j.estado === "listo_para_facturar" || j.estado === "facturado")
    .reduce((acc, j) => acc + j.presupuesto, 0);
  const formatCurrency = (num: number) => {
    if (!mounted) return "$0";
    return num.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });
  };

  return (
    <main className="flex-1 pb-24 md:pb-12 w-full pt-4 md:pt-10 transition-all">
      <DashboardHero
        activeBudgets={jobs.length}
        totalPending={formatCurrency(totalPendingNum)}
      />

      <QuickActions />

      <div className="space-y-6">
        <UpcomingVisits />
        <RecentActivity />
      </div>
    </main>
  );
}
