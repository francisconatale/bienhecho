import { BottomNav } from "@/components/layout/bottom-nav";
import { TopNav } from "@/components/layout/top-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 flex flex-col flex-1 w-full min-h-screen">
      <TopNav />
      <div className="flex-1 flex flex-col min-h-0 min-w-0 pb-24 md:pb-12">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
