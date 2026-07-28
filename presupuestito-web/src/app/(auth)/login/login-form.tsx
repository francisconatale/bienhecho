"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { ArrowRight, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="min-h-[100dvh] flex flex-col lg:flex-row bg-surface relative overflow-hidden animate-page-in">
      
      {/* =========================================
          BRANDING SECTION (Top on Mobile, Left on Desktop)
          ========================================= */}
      <div className="relative flex flex-col lg:w-[45%] lg:bg-gradient-to-br lg:from-primary-container lg:via-surface-variant lg:to-secondary-container px-6 pt-12 lg:p-12 lg:justify-between shrink-0">
        
        {/* Fondo Gradiente Mobile */}
        <div className="absolute top-0 left-0 w-full h-[250px] bg-gradient-to-b from-primary-container/80 to-surface opacity-80 pointer-events-none lg:hidden" />
        
        <div className="relative z-10 flex flex-col lg:h-full lg:justify-between">
          {/* Logo Desktop */}
          <Image src="/icon.svg" alt="Bien Hecho" width={56} height={56} className="hidden lg:block mb-8" />
          
          {/* Textos Mobile con Logo a la derecha */}
          <div className="lg:hidden flex items-start justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-1">Iniciar Sesión</h1>
              <p className="text-sm font-medium text-on-surface-variant">Ingresá tus credenciales para continuar.</p>
            </div>
            <Image src="/icon.svg" alt="Bien Hecho" width={48} height={48} className="shrink-0" />
          </div>

          {/* Textos Desktop */}
          <div className="hidden lg:block">
            <h2 className="text-4xl font-bold tracking-tight text-on-primary-container leading-tight mb-4">
              Diseñado para<br/>
              simplificar <span className="text-primary-dark italic font-medium">tu oficio.</span>
            </h2>
            <p className="text-on-surface-variant font-medium text-lg max-w-sm">
              Gestión de presupuestos, clientes y obras en una plataforma pensada para tu tranquilidad.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          FORM SECTION (Bottom on Mobile, Right on Desktop)
          ========================================= */}
      <div className="flex-1 flex flex-col lg:items-center lg:justify-center px-6 pb-6 lg:p-8 relative z-10">
        <div className="w-full max-w-[400px] flex flex-col h-full lg:h-auto">
          
          {/* Header Desktop */}
          <div className="hidden lg:block mb-10">
            <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Iniciar Sesión</h1>
            <p className="text-on-surface-variant font-medium">Ingresá tus credenciales para continuar.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4 lg:space-y-5 flex-1 flex flex-col lg:block">
            {error && (
              <div className="bg-error-container text-on-error-container text-sm font-medium p-4 rounded-xl">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5 lg:space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com" 
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
              />
            </div>
            
            <div className="space-y-1.5 lg:space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Contraseña</label>
                <Link href="/recover-password" className="text-xs font-bold text-primary hover:text-primary-dark hidden lg:block">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input 
                type="password" 
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••" 
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
              />
            </div>
            
            {/* Link Mobile */}
            <div className="flex justify-end pt-1 lg:hidden">
              <Link href="/recover-password" className="text-xs font-bold text-primary">¿Olvidaste tu contraseña?</Link>
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !email || !password}
              className="w-full bg-primary text-on-primary font-bold py-3.5 lg:py-4 rounded-xl mt-auto lg:mt-4 shadow-sm hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50 group shrink-0"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar ahora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 lg:mt-8 text-center shrink-0">
            <span className="text-sm text-on-surface-variant font-medium">¿No tenés cuenta? </span>
            <Link href="/register" className="text-sm font-bold text-primary hover:text-primary-dark">Registrate acá</Link>
          </div>
        </div>
      </div>

    </main>
  );
}
