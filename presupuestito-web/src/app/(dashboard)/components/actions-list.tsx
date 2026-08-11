"use client";

import Link from "next/link";
import { PlusCircle, Briefcase, UserPlus, CalendarDays, ChevronRight } from "lucide-react";

export function ActionsList() {
  const items = [
    { href: "/trabajos/nuevo", icon: <PlusCircle size={17} strokeWidth={2.5} />, label: "Nuevo Trabajo" },
    { href: "/trabajos",       icon: <Briefcase  size={17} strokeWidth={2.5} />, label: "Ver Trabajos" },
    { href: "/clientes",       icon: <UserPlus   size={17} strokeWidth={2.5} />, label: "Clientes" },
    { href: "/agenda",         icon: <CalendarDays size={17} strokeWidth={2.5} />, label: "Agenda" },
  ];

  return (
    <div className="bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm flex flex-col md:flex-row md:divide-x md:divide-y-0 divide-y divide-outline-variant/15 shrink-0">
      {items.map(({ href, icon, label }, i) => (
        <Link
          key={href}
          href={href}
          className={`w-full md:w-auto flex items-center justify-between md:justify-start gap-3 p-4 md:px-5 md:py-4 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] active:bg-black/[0.06] dark:active:bg-white/[0.06] transition-colors`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0" aria-hidden="true">
              {icon}
            </div>
            <span className="text-[17px] md:text-[15px] font-medium text-on-surface inline">{label}</span>
          </div>
          <ChevronRight size={19} className="md:hidden text-on-surface-variant/50" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
