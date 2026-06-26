"use client";

import { useState } from "react";
import { LayoutDashboard, Users, Settings, Wallet, ChevronLeft, ChevronRight, Briefcase, CheckSquare, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  isExpanded: boolean;
}

function NavItem({ icon, label, href, active, isExpanded }: NavItemProps) {
  const activeClasses = active
    ? "bg-primary/10 text-primary font-semibold shadow-sm border border-primary/20"
    : "text-on-surface-variant hover:bg-outline-variant/5 hover:text-on-surface border border-transparent";

  return (
    <Link
      href={href}
      className={`relative group/nav flex items-center ${isExpanded ? "gap-3 px-4" : "justify-center px-0"} py-3 rounded-2xl transition-all ${activeClasses}`}
    >
      <div className={`${active ? "text-primary" : "opacity-70"} shrink-0`}>
        {icon}
      </div>
      <span className={`text-[13px] tracking-wide whitespace-nowrap transition-all duration-300 overflow-hidden ${isExpanded ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0'}`}>
        {label}
      </span>
      
      {/* Tooltip Premium (UI UX Pro) - Visible solo si está contraído */}
      {!isExpanded && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-surface text-on-surface text-xs font-semibold rounded-lg opacity-0 group-hover/nav:opacity-100 transition-all duration-200 transform -translate-x-1 group-hover/nav:translate-x-0 whitespace-nowrap pointer-events-none shadow-lg z-50">
          {label}
        </div>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  // Ocultar la sidebar en la Landing Page
  if (pathname === "/landing") {
    return null;
  }

  // Comprobar si estamos en rutas hijas del dashboard
  const isDashboardActive = pathname === "/" || pathname.startsWith("/presupuestos/");

  return (
    <aside 
      className={`hidden md:flex flex-col h-screen sticky top-0 border-r border-outline-variant/10 bg-surface/50 backdrop-blur-xl shrink-0 transition-all duration-300 relative ${isExpanded ? "w-[260px]" : "w-[88px]"}`}
    >
      {/* Botón Flotante para Colapsar/Expandir */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3.5 top-8 w-7 h-7 bg-surface border border-outline-variant/20 rounded-full flex items-center justify-center shadow-sm text-on-surface-variant hover:text-primary transition-all z-50 hover:scale-110"
        aria-label={isExpanded ? "Contraer menú" : "Expandir menú"}
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4" strokeWidth={2.5} /> : <ChevronRight className="w-4 h-4" strokeWidth={2.5} />}
      </button>

      <div className={`p-6 pb-2 flex items-center ${isExpanded ? "justify-start" : "justify-center"}`}>
        <Link href="/" className="flex items-center gap-3 group overflow-hidden">
          <div className="w-9 h-9 rounded-[14px] bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform shrink-0">
            <Wallet className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <span className={`font-bold text-lg tracking-tight text-on-surface whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0'}`}>
            Presupuestito
          </span>
        </Link>
      </div>

      <div className={`flex-1 ${isExpanded ? "px-4" : "px-3"} py-8 space-y-1.5 transition-all`}>
        <NavItem
          icon={<LayoutDashboard className="w-[18px] h-[18px]" strokeWidth={2.5} />}
          label="Dashboard"
          href="/"
          active={isDashboardActive}
          isExpanded={isExpanded}
        />
        <NavItem
          icon={<Users className="w-[18px] h-[18px]" strokeWidth={2.5} />}
          label="Clientes"
          href="/clientes"
          active={pathname === "/clientes"}
          isExpanded={isExpanded}
        />
        <NavItem
          icon={<Briefcase className="w-[18px] h-[18px]" strokeWidth={2.5} />}
          label="Trabajos"
          href="/trabajos"
          active={pathname.startsWith("/trabajos")}
          isExpanded={isExpanded}
        />
        <NavItem
          icon={<CheckSquare className="w-[18px] h-[18px]" strokeWidth={2.5} />}
          label="Tareas"
          href="/tareas"
          active={pathname === "/tareas"}
          isExpanded={isExpanded}
        />
        <NavItem
          icon={<Calendar className="w-[18px] h-[18px]" strokeWidth={2.5} />}
          label="Agenda"
          href="/agenda"
          active={pathname === "/agenda"}
          isExpanded={isExpanded}
        />
        <NavItem
          icon={<Settings className="w-[18px] h-[18px]" strokeWidth={2.5} />}
          label="Ajustes"
          href="/ajustes"
          active={pathname === "/ajustes"}
          isExpanded={isExpanded}
        />
      </div>

      <div className={`mt-auto transition-all duration-300 overflow-hidden ${isExpanded ? "p-5 opacity-100 max-h-[250px]" : "p-0 opacity-0 max-h-0"}`}>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 shadow-sm">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 whitespace-nowrap">
            Plan Pro
          </h4>
          <p className="text-[11px] leading-relaxed text-on-surface-variant mb-3 whitespace-nowrap overflow-hidden text-ellipsis">
            Desbloquea plantillas.
          </p>
          <button className="w-full py-2 bg-surface border border-primary/20 hover:border-primary/30 text-primary text-xs font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap">
            Ver Planes
          </button>
        </div>
      </div>
    </aside>
  );
}
