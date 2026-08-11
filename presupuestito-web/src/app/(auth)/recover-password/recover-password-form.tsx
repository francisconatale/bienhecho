"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Mail, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export function RecoverPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await resetPassword(email);

    setLoading(false);

    if (error) {
      toast.error(error || "Ocurrió un error al intentar enviar el correo.");
      return;
    }

    toast.success("Te enviamos un correo con las instrucciones para recuperar tu contraseña.");
    router.push("/login");
  };

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-page-in">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary shadow-lg shadow-primary/20 mb-4">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[34px] font-bold tracking-tight text-on-surface">
            Recuperar Contraseña
          </h1>
          <p className="text-on-surface-variant font-medium">
            Ingresá tu email y te enviaremos un link para restablecerla.
          </p>
        </div>

        <form onSubmit={handleRecover} className="space-y-6">
          <div className="bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-[24px] border border-outline-variant/20 shadow-sm p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-primary ml-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40" />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl pl-12 pr-6 py-4 text-base font-semibold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none transition-transform active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Enviar correo de recuperación"
            )}
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-on-surface-variant text-sm font-bold hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al login
          </Link>
        </div>
      </div>
    </main>
  );
}
