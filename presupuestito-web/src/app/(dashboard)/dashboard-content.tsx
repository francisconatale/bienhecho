"use client";

import { DashboardSkeleton } from "@/components/ui/skeletons";
import { useDashboard } from "./hooks/use-dashboard";
import { ActionsList } from "./components/actions-list";
import { AlertsList } from "./components/alerts-list";
import { ActivityList } from "./components/activity-list";
import { VisitsList } from "./components/visits-list";
import { StatCards } from "./components/stat-cards";

function BackgroundEffects() {
  return (
    <>
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.04] mix-blend-overlay bg-[url('/noise.svg')] bg-repeat" />
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute bottom-[5%] right-[-15%] w-[45%] h-[45%] rounded-full bg-blue-500/8 blur-[130px]" />
      </div>
    </>
  );
}

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
      <BackgroundEffects />
      <main id="main-content">
        <div className="md:hidden flex flex-col px-4 pt-14 pb-28 space-y-5">
          <div className="pt-4">
            <Greeting displayName={displayName} className="text-[32px] font-bold tracking-tight text-on-surface leading-tight" />
          </div>

          <StatCards stats={stats} />
          <VisitsList visits={upcomingVisits} />
          <AlertsList alerts={alerts} />
          <ActivityList pagination={pagination} />
        </div>

        <div className="hidden md:flex flex-col px-10 xl:px-16 pt-12 pb-16 gap-8 w-full max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between gap-6 pt-4">
            <Greeting displayName={displayName} className="text-[48px] lg:text-[56px] font-bold tracking-tight text-on-surface leading-none" />
            <ActionsList />
          </div>

          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
              <StatCards stats={stats} row />
              <AlertsList alerts={alerts} />
              <ActivityList pagination={pagination} />
            </div>
            <div className="col-span-12 lg:col-span-5">
              <VisitsList visits={upcomingVisits} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
