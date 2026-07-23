import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/layout/bottom-nav";
import { TopNav } from "@/components/layout/top-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

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
