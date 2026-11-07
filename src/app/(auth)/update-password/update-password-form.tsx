"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Lock, Loader2 } from "lucide-react";

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await updatePassword(password);

    setLoading(false);

    if (error) {
      return;
    }
    router.push("/dashboard");
  };

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-page-in">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary shadow-lg shadow-primary/20 mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[34px] font-bold tracking-tight text-on-surface">
            Nueva Contraseña
          </h1>
          <p className="text-on-surface-variant font-medium">
            Ingresá tu nueva contraseña.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-[24px] border border-outline-variant/20 shadow-sm p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-primary ml-1">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40" />
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-2xl pl-12 pr-6 py-4 text-base font-semibold text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none transition-transform active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Actualizar contraseña"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
