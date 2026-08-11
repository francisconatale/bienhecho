"use client";

import { DashboardSkeleton } from "@/components/ui/skeletons";
import { useDashboard } from "./hooks/use-dashboard";
import { ActionsList } from "./components/actions-list";
import { AlertsList } from "./components/alerts-list";
import { ActivityList } from "./components/activity-list";
import { VisitsList } from "./components/visits-list";
import { StatCards } from "./components/stat-cards";



function Greeting({ displayName, className }: { displayName: string; className: string }) {
  return (
    <h1 className={className}>
      ¡Hola, {displayName}!
    </h1>
  );
}

import { DashboardInitialData } from "./hooks/use-dashboard";

export function DashboardContent({ initialData }: { initialData?: DashboardInitialData }) {
  const {
    isLoading,
    stats,
    upcomingVisits,
    pagination,
    profile,
    alerts,
  } = useDashboard(initialData);

  const displayName = profile?.nombre || "";

  if (isLoading) {
    return (
      <main id="main-content">
        <DashboardSkeleton />
      </main>
    );
  }

  return (
    <>
      <main id="main-content">
        <div className="flex flex-col px-4 md:px-10 xl:px-16 pt-14 md:pt-12 pb-28 md:pb-16 gap-5 md:gap-8 w-full max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between gap-6 pt-4">
            <Greeting displayName={displayName} className="text-[32px] md:text-[48px] lg:text-[56px] font-bold tracking-tight text-on-surface leading-tight md:leading-none" />
            <div className="hidden md:block">
              <ActionsList />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-start">
            <div className="lg:col-span-7 lg:row-start-1 lg:col-start-1 order-1">
              <StatCards stats={stats} row />
            </div>
            
            <div className="lg:col-span-5 lg:row-start-1 lg:row-span-3 lg:col-start-8 order-2">
              <VisitsList visits={upcomingVisits} />
            </div>

            <div className="lg:col-span-7 lg:row-start-2 lg:col-start-1 order-3 w-full">
              <AlertsList alerts={alerts} />
            </div>

            <div className="lg:col-span-7 lg:row-start-3 lg:col-start-1 order-4 w-full">
              <ActivityList pagination={pagination} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
