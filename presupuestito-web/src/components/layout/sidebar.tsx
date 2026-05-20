"use client";

import { useState } from "react";
import { LayoutDashboard, Users, Settings, Wallet, ChevronLeft, ChevronRight } from "lucide-react";
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
    ? "bg-blue-50/80 dark:bg-[#3B82F6]/10 text-blue-700 dark:text-blue-400 font-semibold shadow-sm border border-blue-200/50 dark:border-white/5"
    : "text-on-surface-variant hover:bg-outline-variant/5 hover:text-on-surface border border-transparent";

  return (
    <Link
      href={href}
      className={`relative group/nav flex items-center ${isExpanded ? "gap-3 px-4" : "justify-center px-0"} py-3 rounded-2xl transition-all ${activeClasses}`}
    >
      <div className={`${active ? "text-blue-600 dark:text-blue-400" : "opacity-70"} shrink-0`}>
        {icon}
      </div>
      <span className={`text-[13px] tracking-wide whitespace-nowrap transition-all duration-300 overflow-hidden ${isExpanded ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0'}`}>
        {label}
      </span>
      
      {/* Tooltip Premium (UI UX Pro) - Visible solo si está contraído */}
      {!isExpanded && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] text-xs font-semibold rounded-lg opacity-0 group-hover/nav:opacity-100 transition-all duration-200 transform -translate-x-1 group-hover/nav:translate-x-0 whitespace-nowrap pointer-events-none shadow-lg z-50">
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
      className={`hidden md:flex flex-col h-screen sticky top-0 border-r border-outline-variant/10 bg-white/50 dark:bg-[#121212]/50 backdrop-blur-xl shrink-0 transition-all duration-300 relative ${isExpanded ? "w-[260px]" : "w-[88px]"}`}
    >
      {/* Botón Flotante para Colapsar/Expandir */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3.5 top-8 w-7 h-7 bg-white dark:bg-[#1E1E1E] border border-outline-variant/20 rounded-full flex items-center justify-center shadow-sm text-on-surface-variant hover:text-blue-600 dark:hover:text-blue-400 transition-all z-50 hover:scale-110"
        aria-label={isExpanded ? "Contraer menú" : "Expandir menú"}
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4" strokeWidth={2.5} /> : <ChevronRight className="w-4 h-4" strokeWidth={2.5} />}
      </button>

      <div className={`p-6 pb-2 flex items-center ${isExpanded ? "justify-start" : "justify-center"}`}>
        <Link href="/" className="flex items-center gap-3 group overflow-hidden">
          <div className="w-9 h-9 rounded-[14px] bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
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
          icon={<Settings className="w-[18px] h-[18px]" strokeWidth={2.5} />}
          label="Ajustes"
          href="/ajustes"
          active={pathname === "/ajustes"}
          isExpanded={isExpanded}
        />
      </div>

      <div className={`mt-auto transition-all duration-300 overflow-hidden ${isExpanded ? "p-5 opacity-100 max-h-[250px]" : "p-0 opacity-0 max-h-0"}`}>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-[#3B82F6]/10 dark:to-transparent border border-blue-100 dark:border-white/5 shadow-sm">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-800 dark:text-blue-300 mb-1 whitespace-nowrap">
            Plan Pro
          </h4>
          <p className="text-[11px] leading-relaxed text-blue-900/60 dark:text-blue-200/50 mb-3 whitespace-nowrap overflow-hidden text-ellipsis">
            Desbloquea plantillas.
          </p>
          <button className="w-full py-2 bg-white dark:bg-[#1E1E1E] border border-blue-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-white/20 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap">
            Ver Planes
          </button>
        </div>
      </div>
    </aside>
  );
}
