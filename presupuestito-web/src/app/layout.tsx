import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
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
        className="bg-grouped-bg-light text-on-background font-body min-h-screen antialiased transition-colors duration-200"
      >
        <ThemeScript />
        <ThemeProvider>
          <AuthRedirect>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-0">
                {children}
              </div>
            </div>
            <BottomNav />
          </AuthRedirect>
        </ThemeProvider>
      </body>
    </html>
  );
}
