"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || loading) return;

    const publicPaths = ["/register", "/login", "/landing"];
    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      router.replace("/login");
    }
  }, [user, loading, pathname, isMounted, router]);

  // Show loading state while checking auth
  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-grouped-bg-light dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated (except public paths)
  const publicPaths = ["/register", "/login", "/landing"];
  if (!user && !publicPaths.includes(pathname)) {
    return (
      <div className="min-h-screen bg-grouped-bg-light dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
