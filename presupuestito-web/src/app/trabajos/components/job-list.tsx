"use client";

import { useState, useRef } from "react";
import { Briefcase, Pencil, X, Check } from "lucide-react";
import { useDataStore } from "@/lib/store";
import { Job } from "@/types";
import { usePagination } from "@/hooks/use-pagination";
import { useSearchParams } from "next/navigation";
import { TrabajoDetail } from "./trabajo-detail";
import { JobStatusSelector } from "../[id]/components/job-status";
import { MobileHeaderActions } from "@/components/ui/mobile-header-actions";
import { MasterDetail } from "@/components/ui/master-detail";

function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

function getStatusColor(estado: string): string {
  switch (estado) {
    case "cobrado":
    case "facturado":
      return "bg-success";
    case "en_curso":
      return "bg-accent-dark";
    case "listo_para_facturar":
      return "bg-primary";
    default:
      return "bg-outline";
  }
}

export function JobList() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    () => searchParams.get("id") || null
  );
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const editingJobIdRef = useRef<string | null>(null);

  const { jobs, clients } = useDataStore();

  const filtered = jobs.filter((j) => {
    const client = clients.find(c => c.id === j.cliente_id);
    return (
      j.titulo.toLowerCase().includes(search.toLowerCase()) ||
      (client && client.nombre.toLowerCase().includes(search.toLowerCase())) ||
      false
    );
  });

  const pag = usePagination(filtered, 10);
  const selected = jobs.find((j) => j.id === selectedId) || null;

  return (
    <div className="flex flex-col flex-1 bg-background relative overflow-hidden">
      {/* Grain / Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-[0] dark:opacity-[0.06]" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

      {/* Aurora Background */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-1000"
        style={{ zIndex: 0 }}
      >
        <div className="absolute top-[-50px] left-[-50px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/20 md:bg-primary/15 blur-[100px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-container/20 md:bg-primary-container/15 blur-[120px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000" />
        <div className="hidden dark:block absolute top-[-50px] left-[-50px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/25 md:bg-primary/15 blur-[120px] md:blur-[180px] rounded-full transition-all duration-1000" />
        <div className="hidden dark:block absolute top-[20%] right-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-primary-container/30 md:bg-primary-container/20 blur-[120px] md:blur-[160px] rounded-full transition-all duration-1000" />
      </div>

      <MasterDetail
        selectedId={selectedId}
        onSelectedChange={setSelectedId}
        items={filtered}
        getItemId={(j) => j.id}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filtrar trabajos..."
        countLabel="trabajo(s)"
        mobileTitle="Trabajos"
        mobileDescription="Gestioná tus proyectos."
        detailTitle={(job) => job.titulo}
        detailRightAction={(job) => {
          const isThisEditing = isHeaderEditing && editingJobIdRef.current === job.id;
          return (
            <MobileHeaderActions
              isEditing={isThisEditing}
              onEditStart={(e) => {
                e?.stopPropagation();
                editingJobIdRef.current = job.id;
                setEditTargetId(job.id);
              }}
              onCancel={() => {
                document.querySelector<HTMLButtonElement>('[data-job-header-cancel]')?.click();
              }}
              onSave={() => {
                document.querySelector<HTMLButtonElement>('[data-job-header-save]')?.click();
              }}
            />
          );
        }}
        pagination={pag}
        creationHref="/trabajos/nuevo"
        renderItem={(job, isSelected) => {
          const client = useDataStore.getState().clients.find((c) => c.id === job.cliente_id);
          return (
            <button
              onClick={() => setSelectedId(job.id)}
              className={`relative group w-full text-left px-4 md:px-5 py-4 transition-all duration-300 cursor-pointer rounded-[24px] md:rounded-none border border-white/20 dark:border-white/5 md:border-0 md:border-b md:border-outline-variant/5 bg-surface/40 dark:bg-surface/20 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none shadow-[0_4px_12px_rgba(0,0,0,0.02)] md:shadow-none hover:-translate-y-0.5 md:hover:translate-y-0 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:hover:shadow-none ${
                isSelected ? "md:bg-primary/15 dark:md:bg-primary/25 border-primary/30 md:border-b-outline-variant/5" : "md:hover:bg-on-surface/5"
              }`}
            >
              {isSelected && <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_8px_var(--color-primary)]" />}
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  isSelected ? "bg-primary/20 text-primary shadow-inner" : "bg-primary/8 text-primary/60"
                }`}>
                  <Briefcase className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className={`font-medium text-sm md:text-base truncate transition-colors ${isSelected ? "text-primary" : "text-on-surface"}`}>{job.titulo}</div>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(job.estado)}`} />
                  </div>
                  <div className="text-[11px] md:text-sm text-on-surface-variant truncate">{client?.nombre || "Sin cliente"}</div>
                </div>
                <div className="text-right shrink-0 hidden md:block">
                  <div className="text-[10px] md:text-sm font-bold text-primary">{job.estado.replace(/_/g, " ")}</div>
                  <div className="text-[9px] md:text-xs text-on-surface-variant tabular-nums">
                    {job.presupuesto > 0 ? `$${job.presupuesto >= 1000000 ? `${(job.presupuesto / 1000000).toFixed(1)}M` : job.presupuesto >= 1000 ? `${(job.presupuesto / 1000).toFixed(0)}K` : job.presupuesto}` : "S/P"}
                  </div>
                </div>
              </div>
            </button>
          );
        }}
        renderRailItem={(job, isActive) => (
          <button
            onClick={() => setSelectedId(job.id)}
            className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-90 ${
              isActive
                ? "bg-primary text-white shadow-md shadow-primary/30"
                : "bg-on-surface/5 text-on-surface-variant hover:bg-on-surface/10"
            }`}
            title={job.titulo}
          >
            <Briefcase className="w-4 h-4" strokeWidth={2} />
          </button>
        )}
        renderDetail={(job) => (
          <TrabajoDetail
            id={job.id}
            isEmbedded
            onBack={() => {
              setSelectedId(null);
              setIsHeaderEditing(false);
              editingJobIdRef.current = null;
            }}
            startEditing={editTargetId === job.id}
            onEditStarted={() => setEditTargetId(null)}
            onEditingChange={(editing) => {
              setIsHeaderEditing(editing);
              if (!editing) editingJobIdRef.current = null;
            }}
          />
        )}
        emptyDetail={
          <div className="flex-1 flex items-start justify-center pt-16 text-on-surface-variant">
            <div className="text-center">
              <Briefcase className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 opacity-15" />
              <p className="text-xs md:text-base font-medium">Seleccioná un trabajo</p>
            </div>
          </div>
        }
        emptyState={
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-6 opacity-40"
            >
              <rect x="24" y="50" width="112" height="72" rx="12" stroke="currentColor" strokeWidth="2" fill="none" />
              <rect x="48" y="30" width="64" height="24" rx="8" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M48 78h64M48 92h48M48 106h56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
              <circle cx="118" cy="100" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M118 93v14M111 100h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h3 className="text-base md:text-lg font-bold text-on-surface mb-1.5">
              Seleccioná un trabajo
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-[260px] leading-relaxed">
              Elegí un trabajo de la lista o creá uno nuevo para hacer seguimiento de presupuestos, tareas y pagos.
            </p>
          </div>
        }
      />
    </div>
  );
}
