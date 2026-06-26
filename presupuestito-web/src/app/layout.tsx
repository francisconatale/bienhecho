import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { AuthRedirect } from "@/components/auth/auth-redirect";
import Script from "next/script";

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
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            try {
              if (localStorage.getItem('darkMode') === 'true' || (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (_) {}
          `}
        </Script>
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
