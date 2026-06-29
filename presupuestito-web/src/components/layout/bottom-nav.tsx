"use client";

import { LayoutDashboard, Users, Settings, CheckSquare, Calendar, Briefcase } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
      className={`flex flex-col items-center justify-center transition-all ${activeClasses}`}
      href={href}
    >
      <div
        className={`${active ? "bg-primary/10 border border-primary/20" : "bg-transparent border border-transparent"} rounded-xl p-2 transition-all duration-300`}
      >
        {icon}
      </div>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Mostrar al hacer scroll up, ocultar al hacer scroll down (pasando un umbral mínimo de 50px)
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Ocultar completamente la barra de navegación en ciertas páginas
  if (pathname === "/landing" || pathname === "/trabajos/nuevo" || pathname === "/design-lab") {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50 transition-all duration-300 ease-in-out md:hidden ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
      }`}
    >
      <nav className="flex justify-between items-center px-2 py-1.5 bg-surface/95 backdrop-blur-xl border border-outline-variant/20 rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]">
        <NavItem
        icon={<LayoutDashboard className="w-5 h-5" strokeWidth={2} />}
        label="Dashboard"
        href="/"
        active={pathname === "/"}
      />
      <NavItem
        icon={<Users className="w-5 h-5" strokeWidth={2} />}
        label="Clientes"
        href="/clientes"
        active={pathname.startsWith("/clientes")}
      />
      <NavItem
        icon={<Briefcase className="w-5 h-5" strokeWidth={2} />}
        label="Trabajos"
        href="/trabajos"
        active={pathname.startsWith("/trabajos") && !pathname.includes("/tareas")}
      />
      <NavItem
        icon={<CheckSquare className="w-5 h-5" strokeWidth={2} />}
        label="Tareas"
        href="/tareas"
        active={pathname.startsWith("/tareas") || pathname.includes("/tareas/")}
      />
      <NavItem
        icon={<Calendar className="w-5 h-5" strokeWidth={2} />}
        label="Agenda"
        href="/agenda"
        active={pathname.startsWith("/agenda")}
      />
      <NavItem
        icon={<Settings className="w-5 h-5" strokeWidth={2} />}
        label="Ajustes"
        href="/ajustes"
        active={pathname.startsWith("/ajustes")}
      />
      </nav>
    </div>
  );
}
