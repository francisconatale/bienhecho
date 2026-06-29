"use client";

import React, { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { useDataStore } from "@/lib/store";
import { MaterialList } from "../components/material-list";
import { getBackUrl } from "./navigation";

interface MaterialesPageInnerProps {
  id: string;
}

function MaterialesPageInner({ id }: MaterialesPageInnerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const { popHistory } = useNavigationHistory();
  const { jobs } = useDataStore();
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  const backUrl = getBackUrl(from, job.id, job.cliente_id);

  return (
    <div className="relative w-full min-h-screen animate-fade-in-up bg-transparent">

      {/* Mobile: simple back button */}
      <div className="md:hidden px-4 py-2.5 relative z-10">
        <button onClick={() => router.push(popHistory(backUrl))} className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant font-medium hover:text-on-surface transition-colors active:scale-95 cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      <main className="relative flex-1 px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-4xl mx-auto w-full md:mt-0 space-y-6">
        {/* Desktop Breadcrumb */}
        <div className="hidden md:flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant/60">
            <button 
              onClick={() => router.push(popHistory(backUrl))}
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver a {job.titulo}
            </button>
          </div>
        </div>

        <div className="space-y-2 cursor-default select-none">
          <h1 className="text-4xl md:text-5xl font-black text-on-surface leading-[1.1] tracking-tighter">
            Materiales
          </h1>
          <p className="text-sm font-medium text-on-surface-variant/60">
            Gestión de insumos y costos del trabajo
          </p>
        </div>

        <MaterialList jobId={job.id} />
      </main>
    </div>
  );
}

export default function MaterialesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return (
    <Suspense fallback={<div className="min-h-screen bg-transparent" />}>
      <MaterialesPageInner id={id} />
    </Suspense>
  );
}
