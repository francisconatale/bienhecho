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

    // Save profile to perfiles table
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
    <main className="min-h-screen bg-grouped-bg-light dark:bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#2563EB] text-white shadow-xl shadow-[#2563EB]/20 mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-on-surface">
            ¡Bienvenido!
          </h1>
          <p className="text-on-surface-variant font-medium">
            Creá tu cuenta para empezar a presupuestar.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="bg-surface dark:bg-[#1C1C1E] rounded-xl p-8 border border-outline-variant/20 shadow-xl space-y-6">
            {error && (
              <div className="bg-red-500/10 text-red-500 text-sm font-medium p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563EB] ml-1">
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
                  className="w-full bg-surface-variant/10 border-none rounded-2xl pl-12 pr-6 py-4 text-base font-bold text-on-surface focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all placeholder:text-on-surface-variant/30"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563EB] ml-1">
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
                  className="w-full bg-surface-variant/10 border-none rounded-2xl pl-12 pr-6 py-4 text-base font-bold text-on-surface focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all placeholder:text-on-surface-variant/30"
                />
              </div>
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563EB] ml-1">
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
                  className="w-full bg-surface-variant/10 border-none rounded-2xl pl-12 pr-6 py-4 text-base font-bold text-on-surface focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all placeholder:text-on-surface-variant/30"
                />
              </div>
            </div>

            {/* Rubro */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563EB] ml-1">
                ¿En qué rubro trabajas?
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40 pointer-events-none" />
                <select
                  required
                  value={selectedTrade}
                  onChange={(e) => setSelectedTrade(e.target.value)}
                  className="w-full bg-surface-variant/10 border-none rounded-2xl pl-12 pr-10 py-4 text-base font-bold text-on-surface focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all appearance-none cursor-pointer"
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
            className="w-full py-5 rounded-xl bg-[#2563EB] text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-[#2563EB]/30 hover:bg-[#1D4ED8] disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-[0.98] flex items-center justify-center gap-3"
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
          <Link href="/login" className="text-[#2563EB] font-bold hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
