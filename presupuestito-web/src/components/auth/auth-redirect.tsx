"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/lib/user-store";

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isRegistered = useUserStore((state) => state.isRegistered);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const publicPaths = ["/register", "/landing"];
    const isPublicPath = publicPaths.includes(pathname);

    if (!isRegistered && !isPublicPath) {
      router.replace("/register");
    }
  }, [isRegistered, pathname, isMounted, router]);

  // Prevent flash of content if not registered
  if (isMounted && !isRegistered && !["/register", "/landing"].includes(pathname)) {
    return (
      <div className="min-h-screen bg-grouped-bg-light dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
