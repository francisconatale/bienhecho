"use client";

import { LayoutDashboard, Users, Settings, Wallet, CheckSquare, Calendar, Briefcase } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

function NavItem({ icon, label, href, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-[13px] font-semibold tracking-wide ${
        active
          ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
          : "text-on-surface-variant hover:bg-outline-variant/10 hover:text-on-surface border border-transparent"
      }`}
    >
      <div className={active ? "text-primary" : "opacity-60"}>
        {icon}
      </div>
      {label}
    </Link>
  );
}

export function TopNav() {
  const pathname = usePathname();

  if (pathname === "/landing") {
    return null;
  }

  const isDashboardActive = pathname === "/" || pathname.startsWith("/presupuestos/");
  const isClientesActive = pathname.startsWith("/clientes");
  const isTrabajosActive = pathname.startsWith("/trabajos") && !pathname.includes("/tareas");
  const isTareasActive = pathname.startsWith("/tareas") || pathname.includes("/tareas/");
  const isAgendaActive = pathname.startsWith("/agenda");
  const isAjustesActive = pathname.startsWith("/ajustes");

  return (
    <nav className="hidden md:flex sticky top-0 z-50 h-16 items-center justify-between border-b border-outline-variant/10 bg-surface px-6 transition-all">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-[12px] bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform">
            <Wallet className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-base tracking-tight text-on-surface">
            Presupuestito
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <NavItem
            icon={<LayoutDashboard className="w-4 h-4" strokeWidth={2.5} />}
            label="Dashboard"
            href="/"
            active={isDashboardActive}
          />
          <NavItem
            icon={<Users className="w-4 h-4" strokeWidth={2.5} />}
            label="Clientes"
            href="/clientes"
            active={isClientesActive}
          />
          <NavItem
            icon={<Briefcase className="w-4 h-4" strokeWidth={2.5} />}
            label="Trabajos"
            href="/trabajos"
            active={isTrabajosActive}
          />
          <NavItem
            icon={<CheckSquare className="w-4 h-4" strokeWidth={2.5} />}
            label="Tareas"
            href="/tareas"
            active={isTareasActive}
          />
          <NavItem
            icon={<Calendar className="w-4 h-4" strokeWidth={2.5} />}
            label="Agenda"
            href="/agenda"
            active={isAgendaActive}
          />
          <NavItem
            icon={<Settings className="w-4 h-4" strokeWidth={2.5} />}
            label="Ajustes"
            href="/ajustes"
            active={isAjustesActive}
          />
        </div>
      </div>

      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-105 transition-transform">
        FP
      </div>
    </nav>
  );
}
