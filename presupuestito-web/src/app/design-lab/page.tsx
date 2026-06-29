"use client";

import VariantA from "./components/variants/VariantA";
import VariantB from "./components/variants/VariantB";
import VariantC from "./components/variants/VariantC";
import VariantD from "./components/variants/VariantD";
import VariantE from "./components/variants/VariantE";
import { FeedbackOverlay } from "./FeedbackOverlay";

export default function DesignLabPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black pb-32">
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-6 sticky top-0 z-40 shadow-sm">
        <h1 className="text-2xl font-bold dark:text-white">Design Lab: Mobile Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
          Exploración de layouts mobile-first con estética Apple/Notion. Revisa las variantes y anota tu feedback.
        </p>
      </header>

      <main className="p-6 overflow-x-auto">
        <div className="flex gap-12 w-max pb-12">
          
          <div data-variant="A" className="w-[420px] flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 dark:text-white bg-black dark:bg-white text-white dark:text-black px-4 py-1 rounded-full">Variant A: Apple Settings</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">Formas redondeadas grandes, scroll horizontal para métricas, listas tipo settings iOS.</p>
            <div className="border-[8px] border-black rounded-[48px] overflow-hidden shadow-2xl w-[393px] shrink-0 bg-white dark:bg-black relative">
              <div className="absolute top-0 inset-x-0 h-6 bg-black z-50 rounded-b-[20px] mx-[100px]" /> {/* notch */}
              <VariantA />
            </div>
          </div>

          <div data-variant="B" className="w-[420px] flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 dark:text-white bg-black dark:bg-white text-white dark:text-black px-4 py-1 rounded-full">Variant B: Notion</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">Fondo crudo, sin bordes duros, tipografías mezcladas, súper limpio y scaneable.</p>
            <div className="border-[8px] border-black rounded-[48px] overflow-hidden shadow-2xl w-[393px] shrink-0 bg-white dark:bg-[#191919] relative">
              <div className="absolute top-0 inset-x-0 h-6 bg-black z-50 rounded-b-[20px] mx-[100px]" />
              <VariantB />
            </div>
          </div>

          <div data-variant="C" className="w-[420px] flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 dark:text-white bg-black dark:bg-white text-white dark:text-black px-4 py-1 rounded-full">Variant C: Bento Grid</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">Cajas cuadradas, accesos rápidos visuales, uso de íconos grandes, estricta grilla 2x2.</p>
            <div className="border-[8px] border-black rounded-[48px] overflow-hidden shadow-2xl w-[393px] shrink-0 bg-gray-50 dark:bg-zinc-950 relative">
              <div className="absolute top-0 inset-x-0 h-6 bg-black z-50 rounded-b-[20px] mx-[100px]" />
              <VariantC />
            </div>
          </div>

          <div data-variant="D" className="w-[420px] flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 dark:text-white bg-black dark:bg-white text-white dark:text-black px-4 py-1 rounded-full">Variant D: Activity Feed</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">Enfoque lineal, listas horizontales continuas separadas por líneas, sin fondos grises.</p>
            <div className="border-[8px] border-black rounded-[48px] overflow-hidden shadow-2xl w-[393px] shrink-0 bg-white dark:bg-black relative">
              <div className="absolute top-0 inset-x-0 h-6 bg-black z-50 rounded-b-[20px] mx-[100px]" />
              <VariantD />
            </div>
          </div>

          <div data-variant="E" className="w-[420px] flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 dark:text-white bg-black dark:bg-white text-white dark:text-black px-4 py-1 rounded-full">Variant E: Floating iOS</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">Cabecera de marca, tarjetas flotantes superpuestas, botón flotante de acción (FAB).</p>
            <div className="border-[8px] border-black rounded-[48px] overflow-hidden shadow-2xl w-[393px] shrink-0 bg-[#f8f9fa] dark:bg-[#121212] relative">
              <div className="absolute top-0 inset-x-0 h-6 bg-black z-50 rounded-b-[20px] mx-[100px]" />
              <VariantE />
            </div>
          </div>

        </div>
      </main>

      <FeedbackOverlay targetName="Dashboard Mobile" />
    </div>
  );
}
