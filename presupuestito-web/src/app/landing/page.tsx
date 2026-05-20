"use client";

import Link from "next/link";
import { ArrowRight, Wallet } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-white text-[#00236F] min-h-screen w-full font-body selection:bg-[#D9FF5F] selection:text-black">

      {/* 00. Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-[#00236F]/10 px-6 py-4 flex justify-between items-center max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 font-bold tracking-tighter text-xl">
          <div className="w-8 h-8 bg-[#00236F] text-white flex items-center justify-center rounded-sm">
            <Wallet className="w-5 h-5" />
          </div>
          PRESUPUESTITO
        </div>
        <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest items-center">
          <a href="#que-es" className="hover:text-blue-500 transition-colors">Qué es</a>
          <span className="text-[#00236F]/20 text-[10px]">·</span>
          <a href="#como-funciona" className="hover:text-blue-500 transition-colors">Cómo funciona</a>
          <span className="text-[#00236F]/20 text-[10px]">·</span>
          <a href="#precios" className="hover:text-blue-500 transition-colors">Precios</a>
        </div>
        <Link href="/">
          <button className="bg-[#00236F] text-white px-6 py-2 font-bold tracking-tight rounded-none hover:bg-blue-700 transition-all active:scale-[0.98]">
            ENTRAR A LA APP
          </button>
        </Link>
      </nav>

      <main>
        {/* VIEW 01: HERO */}
        <section id="que-es" className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden border-b-2 border-[#00236F]/5">
          {/* Background Geometry */}
          <div className="absolute top-20 right-[-5%] w-[400px] h-[400px] border-2 border-[#00236F]/5 rotate-12 -z-10 pointer-events-none hidden lg:block" />
          <div className="absolute bottom-10 left-[-5%] w-[300px] h-[300px] bg-[#D9FF5F]/10 -rotate-12 -z-10 pointer-events-none hidden lg:block" />

          <div className="max-w-[1000px] w-full space-y-10 text-center md:text-left">
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-[#00236F] text-xs font-black uppercase tracking-[0.15em] mb-4">
              Para electricistas, plomeros, carpinteros y más
            </div>

            <h1 className="text-5xl md:text-[85px] font-black tracking-tighter leading-[0.95] text-[#00236F]">
              Hacé tu presupuesto<br />
              <span className="relative inline-block">
                <span className="relative z-10">en 5 minutos.</span>
                <span className="absolute bottom-2 left-0 w-full h-[12px] md:h-[22px] bg-[#D9FF5F] -z-0"></span>
              </span> <br />
              Mandalo al toque.
            </h1>

            <p className="text-xl md:text-2xl font-medium text-[#00236F]/70 max-w-2xl leading-relaxed">
              Dejá de perder tiempo con el papel y el Excel. Con Presupuestito armás presupuestos profesionales desde el celular, los exportás en PDF y los mandás a tu cliente en el momento.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center md:justify-start">
              <Link href="/">
                <button className="bg-[#00236F] text-white px-10 py-5 font-bold text-lg rounded-none flex items-center justify-center gap-3 hover:bg-blue-800 transition-all group">
                  EMPEZAR GRATIS
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button href="#como-funciona" className="border-2 border-[#00236F] text-[#00236F] px-10 py-5 font-bold text-lg rounded-none hover:bg-[#00236F] hover:text-white transition-all">
                VER CÓMO FUNCIONA
              </button>
            </div>
          </div>
        </section>

        {/* VIEW 02: FEATURES */}
        <section id="como-funciona" className="py-24 px-6 max-w-[1250px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12 order-2 lg:order-1">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#00236F] border-l-8 border-[#D9FF5F] pl-6 uppercase">
              Todo lo que necesitás, <br /> nada que no usás.
            </h2>

            <div className="space-y-8">
              {[
                { id: "01", title: "Armá el presupuesto en el momento", desc: "Agregá materiales, mano de obra y descuentos. El total se calcula solo, sin fórmulas ni errores." },
                { id: "02", title: "Tu logo, tus datos, tu imagen", desc: "El PDF sale con tu nombre y tu marca. Tus clientes reciben algo profesional, no una foto borrosa de un papel." },
                { id: "03", title: "Todos tus clientes en un lugar", desc: "Guardá los datos de cada cliente y accedé al historial de presupuestos cuando lo necesités." },
                { id: "04", title: "De presupuesto a factura con un clic", desc: "Si el cliente acepta, convertís el presupuesto en factura sin volver a escribir nada." },
              ].map((item) => (
                <div key={item.id} className="group border-b border-[#00236F]/10 pb-6 hover:border-[#00236F] transition-colors cursor-default">
                  <div className="flex gap-6">
                    <span className="text-sm font-bold text-blue-500 mt-1.5">{item.id}</span>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight mb-2 uppercase">{item.title}</h3>
                      <p className="text-[#00236F]/60 font-medium">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center order-1 lg:order-2">
            <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center">
              {/* REMOVED EXCEL FREE ZONE - ADDED ILLUSTRATION */}
              <div className="absolute inset-0 bg-[#00236F]/5 rounded-full blur-[80px] opacity-30" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/illustration.png" 
                alt="Presupuestito en acción" 
                className="w-full h-auto object-contain relative z-10 drop-shadow-2xl mix-blend-darken"
              />
              <div className="absolute bottom-10 right-[-10px] bg-[#D9FF5F] text-black px-4 py-2 font-black text-sm uppercase tracking-tighter shadow-xl z-20">
                Listo para usar
              </div>
            </div>
          </div>
        </section>

        {/* VIEW 03: TRACTION */}
        <section id="precios" className="bg-[#00236F] text-white py-32 px-6 overflow-hidden">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="space-y-12">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
                Profesionales que <br /> <span className="text-blue-400">ya cobran mejor.</span>
              </h2>
              <p className="text-xl text-white/70 max-w-md font-medium leading-relaxed">
                Miles de trabajadores independientes ya usan Presupuestito para cerrar trabajos más rápido y dar una mejor impresión desde el primer contacto.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
              {[
                { label: "presupuestos generados", value: "+3.000" },
                { label: "de usuarios satisfechos", value: "98%" },
                { label: "promedio por presupuesto", value: "5 min" },
                { label: "al instante", value: "PDF" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#00236F] p-8 flex flex-col items-center justify-center hover:bg-black/20 transition-all cursor-default text-center">
                  <span className="text-4xl font-black mb-1">{stat.value}</span>
                  <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-32 border-y-2 border-white/10 py-8 overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-marquee uppercase font-black text-4xl md:text-6xl tracking-tighter opacity-10 space-x-20">
              <span>Fácil de usar</span>
              <span>Se ve profesional</span>
              <span>Sin papeles</span>
              <span>Desde el celular</span>
              <span>Para el rubro</span>
              <span>Sin letra chica</span>
              <span>Fácil de usar</span>
              <span>Se ve profesional</span>
              <span>Sin papeles</span>
              <span>Desde el celular</span>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 px-6 text-center bg-white text-[#00236F]">
          <div className="max-w-[850px] mx-auto space-y-8">
            <h3 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              ¿Seguís haciendo <br /> presupuestos a mano?
            </h3>
            <p className="text-xl md:text-2xl font-medium text-[#00236F]/60 px-4">
              Probalo gratis hoy. Sin tarjeta, sin trucos. Si en una semana no te cambia la forma de trabajar, no perdés nada.
            </p>
            <Link href="/">
              <button className="bg-black text-white px-12 py-6 font-bold text-xl rounded-none hover:bg-[#00236F] transition-all transform hover:scale-105 uppercase tracking-tighter">
                Empezar gratis ahora
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t-2 border-[#00236F]/5 py-12 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-black text-xl tracking-tighter flex items-center gap-2">
            <div className="w-6 h-6 bg-[#00236F] text-white flex items-center justify-center rounded-sm text-[10px]">
              <Wallet className="w-4 h-4" />
            </div>
            PRESUPUESTITO © 2025
          </div>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-[#00236F]/40">
            <a href="#" className="hover:text-[#00236F]">Privacidad</a>
            <a href="#" className="hover:text-[#00236F]">Términos</a>
            <a href="#" className="hover:text-[#00236F]">Soporte</a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
