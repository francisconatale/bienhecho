import { DashboardHeader } from "@/app/(dashboard)/components/dashboard-header";
import { SummarySection } from "@/app/(dashboard)/components/summary-section";
import { QuickActions } from "@/app/(dashboard)/components/quick-actions";
import { RecentActivity } from "@/app/(dashboard)/components/recent-activity";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />

      <main className="flex-1 px-4 py-6 space-y-6 mt-20 pb-24 max-w-3xl mx-auto w-full">
        <SummarySection />
        <QuickActions />
        <RecentActivity />
      </main>

      <BottomNav />
    </>
  );
}
