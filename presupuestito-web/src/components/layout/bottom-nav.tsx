"use client";

import { LayoutDashboard, Users, Settings, CheckSquare, Calendar, Briefcase } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

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
      className={`flex flex-col items-center justify-center transition-transform duration-200 ease-spring active:scale-[0.96] hit-padding ${activeClasses} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2`}
      href={href}
      aria-current={active ? "page" : undefined}
      aria-label={label}
    >
      <div
        className={`${active ? "bg-primary/10 border border-primary/20" : "bg-transparent border border-transparent"} rounded-xl p-2 transition-colors duration-200`}
      >
        {icon}
      </div>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const goingDown = currentScrollY > lastScrollYRef.current && currentScrollY > 50;
      lastScrollYRef.current = currentScrollY;
      setIsVisible(prev => (goingDown ? false : true));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ocultar completamente la barra de navegación en ciertas páginas
  if (pathname === "/landing" || pathname === "/trabajos/nuevo") {
    return null;
  }

  return (
    <div
      className={`fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50 transition-[transform,opacity] duration-300 ease-momentum md:hidden ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
      }`}
    >
      <nav aria-label="Navegación principal" className="flex justify-between items-center px-2 py-1.5 glass-thick rounded-full">
        <NavItem
        icon={<LayoutDashboard className="w-5 h-5" strokeWidth={2} />}
        label="Dashboard"
        href="/dashboard"
        active={pathname === "/dashboard"}
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
