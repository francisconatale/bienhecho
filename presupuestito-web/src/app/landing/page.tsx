"use client";

import Link from "next/link";
import { ArrowRight, Wallet, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-white text-[#00236F] h-screen overflow-y-auto scroll-snap-type-y mandatory font-body selection:bg-[#D9FF5F] selection:text-black scroll-smooth">

      {/* 00. Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-[#00236F]/10 px-6 py-4 flex justify-between items-center max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 font-bold tracking-tighter text-xl cursor-default uppercase">
          <div className="w-8 h-8 bg-[#00236F] text-white flex items-center justify-center rounded-sm">
            <Wallet className="w-5 h-5" />
          </div>
          PRESUPUESTITO
        </div>
        <div className="hidden md:flex gap-8 text-[13px] font-semibold uppercase tracking-widest items-center">
          <a href="#view-1" className="hover:text-blue-600 transition-colors">Qué es</a>
          <span className="text-[#00236F]/20 text-[10px]">·</span>
          <a href="#view-2" className="hover:text-blue-600 transition-colors">Cómo funciona</a>
          <span className="text-[#00236F]/20 text-[10px]">·</span>
          <a href="#view-3" className="hover:text-blue-600 transition-colors">Precios</a>
        </div>
        <Link href="/">
          <button className="bg-[#00236F] text-white px-6 py-2 font-bold tracking-tight rounded-none hover:bg-blue-700 transition-all active:scale-[0.98]">
            ENTRAR A LA APP
          </button>
        </Link>
      </nav>

      <main className="w-full h-full">

        {/* VIEW 01: HERO */}
        <section id="view-1" className="w-full h-screen scroll-snap-align-start flex flex-col items-center justify-center px-6 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-20 right-[-5%] w-[400px] h-[400px] border-2 border-[#00236F]/5 rotate-12 -z-10 pointer-events-none hidden lg:block" />
          <div className="absolute bottom-10 left-[-5%] w-[300px] h-[300px] bg-blue-500/5 -rotate-12 -z-10 pointer-events-none hidden lg:block rounded-full blur-3xl" />

          <div className="max-w-[1000px] w-full space-y-8 text-center md:text-left pt-16">
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-[#00236F] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 rounded-full border border-blue-100">
              Para electricistas, plomeros, carpinteros y más
            </div>

            <h1 className="text-[44px] md:text-[80px] font-extrabold tracking-tight leading-[1] text-[#00236F]">
              Hacé tu presupuesto<br />
              <span className="relative inline-block text-blue-600">
                en 5 minutos.
                <span className="absolute bottom-1 left-0 w-full h-[15%] bg-[#D9FF5F] -z-10 opacity-70" />
              </span> <br />
              Mandalo al toque.
            </h1>

            <p className="text-xl md:text-2xl font-medium text-gray-500 max-w-2xl leading-relaxed">
              Dejá de perder tiempo con el papel y el Excel. Armá presupuestos profesionales desde el celular, exportalos en PDF y mandalos al momento.
            </p>

            <div className="flex pt-6 justify-center md:justify-start">
              <Link href="/">
                <button className="bg-[#00236F] text-white px-12 py-5 font-bold text-xl rounded-none flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 active:scale-95 group">
                  EMPEZAR GRATIS
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* VIEW 02: FEATURES */}
        <section id="view-2" className="w-full h-screen scroll-snap-align-start flex items-center justify-center px-6 bg-white overflow-hidden">
          <div className="max-w-[1250px] w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#00236F] border-l-8 border-[#D9FF5F] pl-6 uppercase">
                Todo lo que necesitás, <br /> nada que no usás.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                {[
                  { title: "Presupuestos en el momento", desc: "Agregá materiales y mano de obra. El total se calcula solo." },
                  { title: "Tu marca personal", desc: "El PDF sale con tu nombre y logo. Proyectá profesionalismo." },
                  { title: "Historial de clientes", desc: "Guardá los datos y accedé al historial cuando lo necesités." },
                  { title: "Facturación Express", desc: "Convertí presupuestos aceptados en facturas con un clic." },
                ].map((item, i) => (
                  <div key={i} className="group border-b-2 border-gray-100 pb-6 hover:border-[#00236F]/30 transition-colors cursor-default">
                    <h3 className="text-lg md:text-xl font-bold tracking-tight mb-2 uppercase text-[#00236F]">{item.title}</h3>
                    <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center relative">
              <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-[100px]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/illustration.png"
                alt="Presupuestito en acción"
                className="w-full max-w-[480px] h-auto object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform duration-500 mix-blend-darken"
              />
              <div className="absolute bottom-5 right-5 bg-[#D9FF5F] text-black px-4 py-2 font-black text-sm uppercase tracking-tighter shadow-xl z-20">
                PRO Ready
              </div>
            </div>
          </div>
        </section>

        {/* VIEW 03: CONVERSION */}
        <section id="view-3" className="w-full h-screen scroll-snap-align-start flex flex-col bg-[#00236F] text-white overflow-hidden relative">

          <div className="flex-1 flex items-center justify-center px-6">
            <div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-12">
                <h2 className="text-5xl md:text-[90px] font-extrabold tracking-tighter leading-[0.9] uppercase">
                  Profesionales <br /> <span className="text-blue-400">cobrando mejor.</span>
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "presupuestos", value: "+3k" },
                    { label: "satisfechos", value: "98%" },
                    { label: "tiempo", value: "5m" },
                    { label: "formato", value: "PDF" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/5 p-6 rounded-none border border-white/5 hover:bg-white/10 transition-all text-center">
                      <span className="text-4xl font-black mb-1 block">{stat.value}</span>
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-14 space-y-10">
                <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase leading-[1]">
                  ¿Seguís haciendo <br /> presupuestos a mano?
                </h3>
                <p className="text-lg md:text-xl font-medium text-white/60 leading-relaxed">
                  Probalo gratis hoy. Sin tarjeta, sin trucos. Si en una semana no te cambia la forma de trabajar, no perdés nada.
                </p>
                <Link href="/">
                  <button className="w-full bg-[#D9FF5F] text-black py-6 font-bold text-2xl rounded-none hover:bg-white transition-all transform active:scale-95 uppercase tracking-tighter">
                    Empezar ahora
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <footer className="bg-white/5 border-t border-white/5 py-8 px-8 text-[11px] font-bold uppercase tracking-widest text-white/30 flex justify-between items-center">
            <div>PRESUPUESTITO © 2025</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Soporte</a>
            </div>
          </footer>
        </section>
      </main>

      <style jsx global>{`
        .scroll-snap-type-y {
          scroll-snap-type: y mandatory;
        }
        .scroll-snap-align-start {
          scroll-snap-align: start;
        }
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
