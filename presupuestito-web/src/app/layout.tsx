import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Providers } from "./providers";
import { BottomNav } from "@/components/layout/bottom-nav";
import { TopNav } from "@/components/layout/top-nav";
import { AuthRedirect } from "@/components/auth/auth-redirect";
import { ThemeScript } from "@/components/layout/theme-script";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Script from "next/script";
import { Toaster } from "@/components/layout/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Presupuestito - Dashboard",
  description: "Gestor de presupuestos digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <head />
      <body
        className="bg-grouped-bg-light text-on-background font-body min-h-screen antialiased transition-colors duration-200 flex flex-col"
      >
        <ThemeScript />
        <link rel="manifest" href="/manifest.webmanifest" />
        
        <Script id="service-worker" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `
            if ("serviceWorker" in navigator) {
              if (location.search.includes("reset-sw")) {
                window.addEventListener("load", async () => {
                  const registrations = await navigator.serviceWorker.getRegistrations();
                  for (const reg of registrations) {
                    await reg.unregister();
                  }
                  location.href = location.pathname + location.hash;
                });
              } else {
                window.addEventListener("load", () => {
                  navigator.serviceWorker.register("/serwist/sw.js");
                });
              }
            }
          `,
        }} />
        
        <AuroraBackground preset="layout" />

        <Providers>
          <ThemeProvider>
            <AuthRedirect>
              <div className="relative z-10 flex flex-col flex-1 w-full min-h-screen">
                <TopNav />
                <div className="flex-1 flex flex-col min-h-0 min-w-0 pb-24 md:pb-12">
                  {children}
                </div>
                <BottomNav />
              </div>
            </AuthRedirect>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
