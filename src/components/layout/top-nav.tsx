"use client";

import { Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavItemProps {
  label: string;
  href: string;
  active?: boolean;
}

function NavItem({ label, href, active }: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative py-1 text-[15px] transition-colors duration-300 ${
        active 
          ? "text-primary-dark font-semibold" 
          : "text-on-surface-variant hover:text-primary-dark/70 font-medium"
      }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-primary rounded-full animate-fade-in-up" style={{ animationDuration: '0.2s' }} />
      )}
    </Link>
  );
}

export function TopNav() {
  const pathname = usePathname();

  if (pathname === "/landing") {
    return null;
  }

  const isDashboardActive = pathname === "/dashboard" || pathname.startsWith("/presupuestos/");
  const isClientesActive = pathname.startsWith("/clientes");
  const isTrabajosActive = pathname.startsWith("/trabajos") && !pathname.includes("/tareas");
  const isTareasActive = pathname.startsWith("/tareas") || pathname.includes("/tareas/");
  const isAgendaActive = pathname.startsWith("/agenda");
  const isAjustesActive = pathname.startsWith("/ajustes");

  return (
    <header className="hidden md:block sticky top-0 w-full z-50">
      {/* Navbar Container */}
      <div className="relative w-full bg-background z-10 px-6 sm:px-12 py-3 sm:py-4 border-b border-outline-variant/10">
        <div className="w-full flex items-center justify-between max-w-[1600px] mx-auto">
          
          <Link href="/dashboard" className="flex items-center gap-3 group mr-12">
            <div className="w-8 h-8 group-hover:scale-105 transition-transform flex items-center justify-center">
              <Image src="/icon.svg" alt="Bien Hecho Logo" width={32} height={32} />
            </div>
            <span className="font-bold text-lg tracking-tight text-primary-dark">
              Bien Hecho
            </span>
          </Link>

          <nav className="hidden md:flex flex-1 justify-end items-center gap-4 lg:gap-6">
            <NavItem label="Dashboard" href="/dashboard" active={isDashboardActive} />
            <NavItem label="Clientes" href="/clientes" active={isClientesActive} />
            <NavItem label="Trabajos" href="/trabajos" active={isTrabajosActive} />
            <NavItem label="Tareas" href="/tareas" active={isTareasActive} />
            <NavItem label="Agenda" href="/agenda" active={isAgendaActive} />
            <NavItem label="Ajustes" href="/ajustes" active={isAjustesActive} />
          </nav>
        </div>
      </div>
    </header>
  );
}
