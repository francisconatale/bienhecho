import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 h-16 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/20 z-50 font-sans transition-all">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        
        {/* Brand Text & Logo */}
        <Link href="/" className="flex items-center gap-2 group opacity-90 hover:opacity-100 transition-opacity">
          <Image 
            src="/icon.svg" 
            alt="Bien Hecho Logo" 
            width={24} 
            height={24} 
            className="w-6 h-6 drop-shadow-sm"
          />
          <span className="font-bold text-base tracking-tight text-on-surface">Bien Hecho</span>
        </Link>
        
        {/* Navigation Actions */}
        <nav className="flex items-center gap-6">
          <Link 
            href="/login" 
            className="text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link 
            href="/register" 
            className="text-xs font-semibold bg-primary text-on-primary px-4 py-2 rounded-full shadow-sm hover:shadow-md hover:bg-primary-dark transition-all"
          >
            Comenzar
          </Link>
        </nav>
      </div>
    </header>
  );
}
