"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TRADES } from "@/lib/trades";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/utils/supabase/client";
import { ArrowRight, User, Briefcase, Sparkles, Mail, Lock, Loader2 } from "lucide-react";

export default function RegisterPage() {
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
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-page-in">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary shadow-lg shadow-primary/20 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[34px] font-bold tracking-tight text-on-surface">
            ¡Bienvenido!
          </h1>
          <p className="text-on-surface-variant font-medium">
            Creá tu cuenta para empezar a presupuestar.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-[24px] border border-outline-variant/20 shadow-sm p-8 space-y-6">
            {error && (
              <div className="bg-error/10 text-error text-sm font-medium p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary ml-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl pl-12 pr-6 py-4 text-base font-semibold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary ml-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl pl-12 pr-6 py-4 text-base font-semibold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary ml-1">
                ¿Cómo te llamas?
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre o empresa"
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl pl-12 pr-6 py-4 text-base font-semibold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary ml-1">
                ¿En qué rubro trabajas?
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40 pointer-events-none" />
                <select
                  required
                  value={selectedTrade}
                  onChange={(e) => setSelectedTrade(e.target.value)}
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl pl-12 pr-10 py-4 text-base font-semibold text-on-surface outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Selecciona tu rubro</option>
                  {TRADES.map((trade) => (
                    <option key={trade.id} value={trade.id}>
                      {trade.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ArrowRight className="w-4 h-4 text-on-surface-variant/40 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || name.length < 2 || !selectedTrade || !email || !password}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Crear cuenta
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-on-surface-variant text-sm">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
