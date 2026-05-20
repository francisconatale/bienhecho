"use client";

import { LayoutDashboard, Users, Settings, Wallet } from "lucide-react";
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
    ? "bg-blue-50/80 dark:bg-[#3B82F6]/10 text-blue-700 dark:text-blue-400 font-semibold shadow-sm border border-blue-200/50 dark:border-white/5"
    : "text-on-surface-variant hover:bg-outline-variant/5 hover:text-on-surface border border-transparent";

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeClasses}`}
    >
      <div className={`${active ? "text-blue-600 dark:text-blue-400" : "opacity-70"}`}>
        {icon}
      </div>
      <span className="text-[13px] tracking-wide">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  // Ocultar la sidebar en la Landing Page
  if (pathname === "/landing") {
    return null;
  }

  // Comprobar si estamos en rutas hijas del dashboard
  const isDashboardActive = pathname === "/" || pathname.startsWith("/presupuestos/");

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-screen sticky top-0 border-r border-outline-variant/10 bg-white/50 dark:bg-[#121212]/50 backdrop-blur-xl shrink-0">
      <div className="p-6 pb-2">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-[14px] bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Wallet className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-tight text-on-surface">Presupuestito</span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-8 space-y-1.5">
        <NavItem
          icon={<LayoutDashboard className="w-[18px] h-[18px]" strokeWidth={2.5} />}
          label="Dashboard"
          href="/"
          active={isDashboardActive}
        />
        <NavItem
          icon={<Users className="w-[18px] h-[18px]" strokeWidth={2.5} />}
          label="Clientes"
          href="/clientes"
          active={pathname === "/clientes"}
        />
        <NavItem
          icon={<Settings className="w-[18px] h-[18px]" strokeWidth={2.5} />}
          label="Ajustes"
          href="/ajustes"
          active={pathname === "/ajustes"}
        />
      </div>

      <div className="p-5 mt-auto">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-[#3B82F6]/10 dark:to-transparent border border-blue-100 dark:border-white/5 shadow-sm">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-800 dark:text-blue-300 mb-1">
            Plan Pro
          </h4>
          <p className="text-[11px] leading-relaxed text-blue-900/60 dark:text-blue-200/50 mb-3">
            Desbloquea plantillas y clientes ilimitados.
          </p>
          <button className="w-full py-2 bg-white dark:bg-[#1E1E1E] border border-blue-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-white/20 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-xl transition-colors shadow-sm">
            Ver Planes
          </button>
        </div>
      </div>
    </aside>
  );
}
