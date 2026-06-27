import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { BottomNav } from "@/components/layout/bottom-nav";
import { TopNav } from "@/components/layout/top-nav";
import { AuthRedirect } from "@/components/auth/auth-redirect";
import { ThemeScript } from "@/components/layout/theme-script";

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
        <script dangerouslySetInnerHTML={{
          __html: `
            if ("serviceWorker" in navigator) {
              window.addEventListener("load", () => {
                navigator.serviceWorker.register("/serwist/sw.js");
              });
            }
          `,
        }} />
        
        {/* Grain / Noise Overlay (Persistent) */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-[-1] dark:opacity-[0.06]" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

        {/* Aurora Background (Persistent) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden transition-all duration-1000 z-[-1]">
          <div className="absolute top-[-50px] left-[-50px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/20 md:bg-primary/15 blur-[100px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[20%] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-container/20 md:bg-primary-container/15 blur-[120px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000" />
          <div className="hidden dark:block absolute top-[-50px] left-[-50px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/25 md:bg-primary/15 blur-[120px] md:blur-[180px] rounded-full transition-all duration-1000" />
          <div className="hidden dark:block absolute top-[20%] right-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-primary-container/30 md:bg-primary-container/20 blur-[120px] md:blur-[160px] rounded-full transition-all duration-1000" />
        </div>

        <ThemeProvider>
          <AuthRedirect>
            <div className="relative z-10 flex flex-col flex-1 w-full min-h-screen">
              <TopNav />
              <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-12">
                {children}
              </div>
              <BottomNav />
            </div>
          </AuthRedirect>
        </ThemeProvider>
      </body>
    </html>
  );
}
