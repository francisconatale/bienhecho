import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/layout/bottom-nav";
import { TopNav } from "@/components/layout/top-nav";
import { requireAuth } from "@/utils/supabase/require-auth";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="relative z-10 flex flex-col flex-1 w-full min-h-screen">
      <TopNav />
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
