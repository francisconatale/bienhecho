"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function WizardHeader() {
  const searchParams = useSearchParams();
  const preselectId = searchParams.get("clienteId");

  return (
    <div className="flex items-center gap-3 mb-5">
      <Link
        href={preselectId ? `/clientes?clienteId=${preselectId}` : "/trabajos"}
        aria-label="Volver"
        className="w-9 h-9 rounded-xl bg-surface border border-outline-variant/30 flex items-center justify-center hover:bg-on-surface/5 transition-colors transition-transform active:scale-95 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 text-on-surface" />
      </Link>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
          Nuevo Trabajo
        </h1>
        <p className="text-sm text-on-surface-variant/60 mt-0.5">
          Respondé paso a paso para crear un nuevo trabajo.
        </p>
      </div>
    </div>
  );
}
