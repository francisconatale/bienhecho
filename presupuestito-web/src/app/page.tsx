import { CircleUserRound, PlusCircle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { SummarySection } from "@/app/(dashboard)/components/summary-section";
import { QuickActions } from "@/app/(dashboard)/components/quick-actions";
import { RecentActivity } from "@/app/(dashboard)/components/recent-activity";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Presupuestito"
        leftAction={
          <button
            aria-label="Profile"
            className="text-primary p-2 -ml-2 rounded-full hover:bg-surface-variant transition-colors"
          >
            <CircleUserRound className="w-8 h-8" strokeWidth={1.5} />
          </button>
        }
        rightAction={
          <button
            aria-label="Add"
            className="text-primary p-2 -mr-2 rounded-full hover:bg-surface-variant transition-colors"
          >
            <PlusCircle className="w-8 h-8" strokeWidth={1.5} />
          </button>
        }
      />

      <main className="flex-1 px-4 py-6 space-y-6 mt-20 pb-24 max-w-3xl mx-auto w-full">
        <SummarySection />
        <QuickActions />
        <RecentActivity />
      </main>

      <BottomNav />
    </>
  );
}
