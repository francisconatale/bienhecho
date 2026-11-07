"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Clientes", href: "#clientes" },
  { label: "Trabajos", href: "#trabajos" },
  { label: "Tareas", href: "#tareas" },
  { label: "Agenda", href: "#agenda" },
];

export function NavbarDemo() {
  const [activePath, setActivePath] = useState("#clientes");

  return (
    <header className="relative w-full">
      {/* 
        La navbar en sí misma es de color crema y está pegada al top.
        Tiene las esquinas superiores rectas y la inferior derecha con un radio enorme
        para generar la curva orgánica sobre la superficie verde.
      */}
      <div className="relative w-full bg-[#FDFBF7] rounded-br-[60px] md:rounded-br-[120px] z-10 px-6 sm:px-12 py-5 sm:py-7">
        <div className="w-full flex items-center justify-between max-w-[1600px] mx-auto">
          
          {/* Logo - Mayor jerarquía */}
          <div className="flex-shrink-0 mr-12">
            <Link href="#" className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-dark">
                Bien Hecho
              </span>
            </Link>
          </div>

          {/* Navegación - Discreta y horizontal, sin cards */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10">
            {navItems.map((item) => {
              const isActive = item.href === activePath;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePath(item.href);
                  }}
                  className={`
                    relative py-1 text-[15px] transition-colors duration-300
                    ${isActive 
                      ? "text-primary-dark font-semibold" 
                      : "text-on-surface-variant hover:text-primary-dark/70 font-medium"
                    }
                  `}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-primary rounded-full animate-fade-in-up" style={{ animationDuration: '0.2s' }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Acciones */}
          <div className="flex flex-1 justify-end">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
              <span className="text-sm font-bold text-primary-dark">BH</span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        Esquina invertida (recorte): 
        Este bloque se posiciona justo debajo de la esquina inferior derecha de la navbar.
        Crea la transición fluida y continua entre la curva de la navbar (crema) y 
        el fondo verde, logrando la sensación de "moldeado" orgánico.
      */}
      <div className="absolute right-0 bottom-[-40px] md:bottom-[-80px] w-[40px] h-[40px] md:w-[80px] md:h-[80px] bg-[#FDFBF7] z-0 overflow-hidden pointer-events-none">
        {/* Usamos el color verde del fondo principal para generar el recorte */}
        <div className="w-full h-full bg-primary-dark rounded-tr-[40px] md:rounded-tr-[80px]" />
      </div>
    </header>
  );
}
