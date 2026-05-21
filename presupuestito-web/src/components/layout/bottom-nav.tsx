"use client";

import { LayoutDashboard, Users, Settings, Folder } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

function NavItem({ icon, label, href, active }: NavItemProps) {
  const activeClasses = active
    ? "text-blue-600 dark:text-blue-400"
    : "text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300";

  return (
    <Link
      className={`flex flex-col items-center justify-center p-2 transition-all ${activeClasses}`}
      href={href}
    >
      <div 
        className={`${active ? "bg-blue-100 dark:bg-[#3B82F6]/20 border border-blue-200/50 dark:border-white/5" : "bg-transparent border border-transparent"} rounded-[16px] p-2.5 transition-all duration-300`}
      >
        {icon}
      </div>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  // Ocultar la barra de navegación en la Landing Page
  if (pathname === "/landing") {
    return null;
  }

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-sm z-50 flex justify-between items-center px-4 py-2.5 md:hidden bg-white/95 dark:bg-[#1A1C20]/90 backdrop-blur-3xl border border-gray-200/50 dark:border-white/[0.08] rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]">
      <NavItem
        icon={<LayoutDashboard className="w-6 h-6" strokeWidth={2} />}
        label="Dashboard"
        href="/"
        active={pathname === "/"}
      />
      <NavItem
        icon={<Users className="w-6 h-6" strokeWidth={2} />}
        label="Clientes"
        href="/clientes"
        active={pathname === "/clientes"}
      />
      <NavItem
        icon={<Folder className="w-6 h-6" strokeWidth={2} />}
        label="Campañas"
        href="/proyectos"
        active={pathname.startsWith("/proyectos")}
      />
      <NavItem
        icon={<Settings className="w-6 h-6" strokeWidth={2} />}
        label="Ajustes"
        href="/ajustes"
        active={pathname === "/ajustes"}
      />
    </nav>
  );
}
