"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Row } from "./row";
import { Lock } from "lucide-react";
import { SectionLabel } from "./section-label";

export function AccountActionsSection() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <section>
      <SectionLabel label="Seguridad & Acciones" />
      <div className="bg-surface/80 rounded-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] border border-outline-variant/20 overflow-hidden mb-6">
        <Row
          type="nav"
          icon={<Lock className="w-4 h-4 text-primary" strokeWidth={2} />}
          iconBg="bg-primary/10"
          label="Cambiar Contraseña"
        />
      </div>

      <div className="bg-surface/80 rounded-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] border border-error/20 overflow-hidden">
        <Row type="destructive" label="Cerrar Sesión" onClick={handleLogout} />
      </div>
    </section>
  );
}
