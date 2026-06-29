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

  return (
    <main className="flex-1 pb-24 md:pb-12 w-full pt-4 md:pt-10 transition-all">
      <DashboardHero
        activeBudgets={jobs.length}
      />

      <QuickActions />

      <div className="space-y-6">
        <UpcomingVisits />
        <RecentActivity />
      </div>
    </main>
  );
}
