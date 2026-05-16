import { DashboardHeader } from "./components/dashboard-header";
import { SummarySection } from "./components/summary-section";
import { QuickActions } from "./components/quick-actions";
import { RecentActivity } from "./components/recent-activity";
import { BottomNav } from "./components/bottom-nav";

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
