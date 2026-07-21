"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
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

    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-page-in">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary shadow-lg shadow-primary/20 mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[34px] font-bold tracking-tight text-on-surface">
            Bienvenido
          </h1>
          <p className="text-on-surface-variant font-medium">
            Inicia sesión para continuar.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl pl-12 pr-6 py-4 text-base font-semibold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
              <div className="flex justify-end">
                <Link href="/recover-password" className="text-xs font-bold text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Iniciar sesión
                <LogIn className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-on-surface-variant text-sm">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </main>
  );
}
