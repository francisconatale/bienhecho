import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Providers } from "./providers";

import { ThemeScript } from "@/components/layout/theme-script";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Toaster } from "@/components/layout/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://bien-hecho.vercel.app"),
  title: {
    default: "Bien Hecho — CRM para freelancers",
    template: "%s | Bien Hecho",
  },
  description:
    "Gestioná tus trabajos, clientes y presupuestos en un solo lugar. CRM rápido y simple para freelancers y emprendedores.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Bien Hecho",
    title: "Bien Hecho — CRM para freelancers",
    description:
      "Gestioná tus trabajos, clientes y presupuestos en un solo lugar.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bien Hecho — CRM para freelancers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bien Hecho — CRM para freelancers",
    description:
      "Gestioná tus trabajos, clientes y presupuestos en un solo lugar.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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

        <AuroraBackground preset="layout" />

        <Providers>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
