import { NavbarDemo } from "./components/navbar-demo";

export default function NavbarDesignLabPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] w-full relative overflow-hidden flex flex-col">
      {/* 
        Superficie verde: ocupa la zona inferior/derecha de la composición. 
        Se extiende detrás de la navbar para generar el contraste.
      */}
      <div className="absolute top-0 right-0 bottom-0 left-[20%] md:left-[40%] bg-primary-dark rounded-tl-[100px] md:rounded-tl-[200px]" />
      
      <div className="relative z-10 flex flex-col w-full h-full flex-1">
        <NavbarDemo />
        <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-16">
          <h1 className="text-display text-[#FDFBF7] mb-4">Contenido de prueba</h1>
          <p className="text-body text-[#FDFBF7]/80 max-w-2xl">
            Este es el contenido de prueba. Se encuentra sobre la superficie verde para verificar el contraste general de la página.
          </p>
        </main>
      </div>
    </div>
  );
}
