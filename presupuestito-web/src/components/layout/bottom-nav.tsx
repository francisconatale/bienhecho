"use client";

import { LayoutDashboard, Users, Settings, CheckSquare, Calendar } from "lucide-react";
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
    ? "text-primary"
    : "text-on-surface-variant hover:text-on-surface";

  return (
    <Link
      className={`flex flex-col items-center justify-center p-2 transition-all ${activeClasses}`}
      href={href}
    >
      <div 
        className={`${active ? "bg-primary/10 border border-primary/20" : "bg-transparent border border-transparent"} rounded-[16px] p-2.5 transition-all duration-300`}
      >
        {icon}
      </div>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  // Ocultar la barra de navegación en la Landing Page y en el flujo de nuevo trabajo
  if (pathname === "/landing" || pathname === "/trabajos/nuevo") {
    return null;
  }

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-sm z-50 flex justify-between items-center px-4 py-2.5 md:hidden bg-surface/95 backdrop-blur-3xl border border-outline-variant/20 rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]">
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
        icon={<CheckSquare className="w-6 h-6" strokeWidth={2} />}
        label="Tareas"
        href="/tareas"
        active={pathname === "/tareas"}
      />
      <NavItem
        icon={<Calendar className="w-6 h-6" strokeWidth={2} />}
        label="Agenda"
        href="/agenda"
        active={pathname === "/agenda"}
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
