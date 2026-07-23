"use client";

import { DashboardSkeleton } from "@/components/ui/skeletons";
import { useDashboard } from "./hooks/use-dashboard";
import { ActionsList } from "./components/actions-list";
import { AlertsList } from "./components/alerts-list";
import { ActivityList } from "./components/activity-list";
import { VisitsList } from "./components/visits-list";
import { StatCards } from "./components/stat-cards";

export default function DashboardPage() {
  const {
    isLoading,
    stats,
    upcomingVisits,
    pagination,
    profile,
    alerts,
  } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const displayName = profile?.nombre || "Francisco";

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:font-bold">
        Saltar al contenido
      </a>
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.04] mix-blend-overlay bg-[url('/noise.svg')] bg-repeat" />
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute bottom-[5%] right-[-15%] w-[45%] h-[45%] rounded-full bg-blue-500/8 blur-[130px]" />
      </div>

      <main id="main-content">
        <div className="md:hidden flex flex-col px-4 pt-14 pb-28 space-y-5 animate-page-in">
          <div className="pt-4">
            <h1 className="text-[32px] font-bold tracking-tight text-on-surface leading-tight">
              ¡Hola, {displayName}!
            </h1>
          </div>

          <StatCards stats={stats} />
          <VisitsList visits={upcomingVisits} />
          <AlertsList alerts={alerts} />
          <ActivityList pagination={pagination} />
        </div>

        <div className="hidden md:flex flex-col px-10 xl:px-16 pt-12 pb-16 gap-8 w-full max-w-[1400px] mx-auto animate-page-in">
          <div className="flex items-center justify-between gap-6 pt-4">
            <h1 className="text-[48px] lg:text-[56px] font-bold tracking-tight text-on-surface leading-none">
              ¡Hola, {displayName}!
            </h1>
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
