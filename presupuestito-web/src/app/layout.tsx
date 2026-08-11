import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Providers } from "./providers";

import { ThemeScript } from "@/components/layout/theme-script";
import { AuroraBackground } from "@/components/ui/aurora-background";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://bienhecho.vercel.app"),
  title: {
    default: "Bien Hecho — Gestioná y facturá tus trabajos",
    template: "%s | Bien Hecho",
  },
  description:
    "Gestioná y facturá tus trabajos, clientes y presupuestos en un solo lugar. Simple y rápido.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Bien Hecho",
    title: "Bien Hecho — Gestioná y facturá tus trabajos",
    description:
      "Gestioná y facturá tus trabajos, clientes y presupuestos en un solo lugar.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bien Hecho — Gestioná y facturá tus trabajos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bien Hecho — Gestioná y facturá tus trabajos",
    description:
      "Gestioná y facturá tus trabajos, clientes y presupuestos en un solo lugar.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "HgfWs0opdYsJnLxJKTBmcg5x67klCbQf0ITXWpg52Ew",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <body
        className="bg-grouped-bg-light text-on-background font-body min-h-screen antialiased transition-colors duration-200 flex flex-col"
      >
        <ThemeScript />

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-on-surface focus:shadow-lg"
        >
          Ir al contenido
        </a>

        <AuroraBackground preset="layout" />

        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
