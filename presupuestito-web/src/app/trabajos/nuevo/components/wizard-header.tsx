"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function WizardHeader() {
  const searchParams = useSearchParams();
  const preselectId = searchParams.get("clienteId");

  return (
    <div className="flex items-center gap-3 mb-5">
      <Link href={preselectId ? `/clientes?clienteId=${preselectId}` : "/trabajos"}>
        <button
          aria-label="Volver"
          className="w-9 h-9 rounded-xl bg-surface border border-outline-variant/30 flex items-center justify-center hover:bg-on-surface/5 transition-all active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-on-surface" />
        </button>
      </Link>
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">
          Nuevo Trabajo
        </h1>
        <p className="text-sm text-on-surface-variant/60 mt-0.5">
          Respondé paso a paso para crear un nuevo trabajo.
        </p>
      </div>
    </div>
  );
}
