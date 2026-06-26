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
        <ThemeProvider>
          <AuthRedirect>
            <TopNav />
            <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-12">
              {children}
            </div>
            <BottomNav />
          </AuthRedirect>
        </ThemeProvider>
      </body>
    </html>
  );
}
