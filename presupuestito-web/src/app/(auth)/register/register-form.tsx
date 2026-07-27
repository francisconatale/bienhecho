"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { TRADES } from "@/lib/trades";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/utils/supabase/client";
import { ArrowRight, Loader2, ChevronDown } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [selectedTrade, setSelectedTrade] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 2 || !selectedTrade || !email || !password) return;

    setLoading(true);
    setError("");

    const { error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setError(signUpError);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error: profileError } = await supabase.from("perfiles").insert({
        id: user.id,
        nombre: name,
        rubro: selectedTrade,
      });

      if (profileError) {
        console.error("Error saving profile:", profileError);
      }
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-[100dvh] flex flex-col lg:flex-row-reverse bg-surface relative overflow-hidden animate-page-in">
      
      {/* =========================================
          BRANDING SECTION (Top on Mobile, Right on Desktop)
          ========================================= */}
      <div className="relative flex flex-col lg:w-[45%] lg:bg-gradient-to-tr lg:from-secondary-container lg:via-surface-variant lg:to-primary-container px-6 pt-12 lg:p-12 lg:justify-between shrink-0">
        
        {/* Fondo Gradiente Mobile */}
        <div className="absolute top-0 left-0 w-full h-[250px] bg-gradient-to-b from-secondary-container/80 to-surface opacity-80 pointer-events-none lg:hidden" />
        
        <div className="relative z-10 flex flex-col lg:h-full lg:justify-between">
          {/* Logo Desktop */}
          <Image src="/icon.svg" alt="Bien Hecho" width={56} height={56} className="hidden lg:block mb-8" />
          
          {/* Textos Mobile con Logo a la izquierda */}
          <div className="lg:hidden flex items-start mb-6 gap-4">
            <Image src="/icon.svg" alt="Bien Hecho" width={48} height={48} className="shrink-0" />
            <div>
              <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-1">Crear cuenta</h1>
              <p className="text-sm font-medium text-on-surface-variant">Completá tus datos y empezá a gestionar hoy.</p>
            </div>
          </div>

          {/* Textos Desktop */}
          <div className="hidden lg:block">
            <h2 className="text-4xl font-bold tracking-tight text-on-primary-container leading-tight mb-4">
              El primer paso para<br/>
              hacerlo <span className="text-primary-dark italic font-medium">Bien Hecho.</span>
            </h2>
            <p className="text-on-surface-variant font-medium text-lg max-w-sm">
              Creá tu cuenta gratis y empezá a gestionar tus obras y clientes como un profesional.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          FORM SECTION (Bottom on Mobile, Left on Desktop)
          ========================================= */}
      <div className="flex-1 flex flex-col lg:items-center lg:justify-center px-6 pb-6 lg:p-8 relative z-10 overflow-y-auto">
        <div className="w-full max-w-[440px] flex flex-col h-full lg:h-auto lg:my-8">
          
          {/* Header Desktop */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Crear cuenta</h1>
            <p className="text-on-surface-variant font-medium">Completá tus datos y empezá a gestionar hoy.</p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-4 lg:space-y-5 flex-1 flex flex-col lg:block">
            {error && (
              <div className="bg-error-container text-on-error-container text-sm font-medium p-4 rounded-xl">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5 lg:space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tu nombre o empresa</label>
              <input
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan Pérez Construcciones"
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-1.5 lg:space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Rubro</label>
              <div className="relative">
                <select
                  required
                  value={selectedTrade}
                  onChange={(e) => setSelectedTrade(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer invalid:text-on-surface-variant/40 text-on-surface"
                >
                  <option value="" disabled>Seleccioná tu rubro principal</option>
                  {TRADES.map((trade) => (
                    <option key={trade.id} value={trade.id} className="bg-surface text-on-surface">
                      {trade.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5 lg:space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com" 
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
              />
            </div>
            
            <div className="space-y-1.5 lg:space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Contraseña</label>
              <input 
                type="password" 
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres" 
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || name.length < 2 || !selectedTrade || !email || !password}
              className="w-full bg-primary text-on-primary font-bold py-3.5 lg:py-4 rounded-xl mt-auto lg:mt-6 shadow-sm hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50 group shrink-0"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Crear cuenta <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 lg:mt-8 text-center shrink-0">
            <span className="text-sm text-on-surface-variant font-medium">¿Ya tenés cuenta? </span>
            <Link href="/login" className="text-sm font-bold text-primary hover:text-primary-dark">Iniciá sesión acá</Link>
          </div>
        </div>
      </div>

    </main>
  );
}
