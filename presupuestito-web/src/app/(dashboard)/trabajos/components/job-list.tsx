"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Briefcase, Pencil, X, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { jobsService, clientsService } from "@/services";
import { Job } from "@/types";
import { useServerPagination } from "@/hooks/use-server-pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { TrabajoDetail } from "./trabajo-detail";
import { JobStatusSelector } from "../[id]/components/job-status";
import { MobileHeaderActions } from "@/components/ui/mobile-header-actions";
import { MasterDetail } from "@/components/ui/master-detail";
import { MasterDetailSkeleton } from "@/components/ui/master-detail-skeleton";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { AuroraBackground } from "@/components/ui/aurora-background";

function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}



export function JobList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [ConfirmDialog, confirm] = useConfirm();

  const deleteJobMutation = useMutation({
    mutationFn: (id: string) => jobsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Trabajo eliminado correctamente");
    }
  });

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    () => searchParams.get("id") || null
  );

  const handleSelectedIdChange = (id: string | null) => {
    setSelectedId(id);
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("id", id);
    } else {
      params.delete("id");
    }
    // Remove dir if it exists to reset the animation state
    params.delete("dir");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const isBackDirection = searchParams.get("dir") === "back";

  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const editingJobIdRef = useRef<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useQuery({ 
    queryKey: ["jobs", "paginated", page, pageSize, search], 
    queryFn: () => jobsService.getPaginated(page, pageSize, search) 
  });

  const jobs = data?.data || [];
  const total = data?.total || 0;

  const serverPag = useServerPagination(total, pageSize);

  // Since we already made useServerPagination:
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const isFirstPage = page === 1;
  const isLastPage = page >= totalPages;

  const pag = {
    paginatedItems: jobs as any[],
    currentPage: page,
    totalPages,
    totalItems: total,
    pageSize,
    isFirstPage,
    isLastPage,
    goToPage: (p: number) => setPage(Math.max(1, Math.min(p, totalPages))),
    nextPage: () => !isLastPage && setPage(p => p + 1),
    prevPage: () => !isFirstPage && setPage(p => p - 1),
    setPageSize: () => {},
  };
  
  useEffect(() => {
    setPage(1);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = jobs.find((j) => j.id === selectedId) || null;

  if (isLoading && jobs.length === 0) {
    return <MasterDetailSkeleton />;
  }

  return (
    <div className="flex flex-col flex-1 bg-transparent relative overflow-hidden">
      <AuroraBackground preset="trabajo" className="md:hidden" />

      <MasterDetail
        detailAnimationClass={isBackDirection ? "animate-slide-in-left" : "animate-page-in"}
        selectedId={selectedId}
        onSelectedChange={handleSelectedIdChange}
        items={jobs}
        getItemId={(j) => j.id}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filtrar trabajos..."
        countLabel="trabajos"
        mobileTitle="Trabajos"
        mobileDescription="Gestioná tus proyectos."
        detailTitle={(job) => job.titulo}
        detailRightAction={(job) => {
          const isThisEditing = isHeaderEditing && editingJobIdRef.current === job.id;
          return (
            <MobileHeaderActions
              isEditing={isThisEditing}
              onEditStart={() => {
                editingJobIdRef.current = job.id;
                setEditTargetId(job.id);
              }}
              onCancel={() => {
                document.querySelector<HTMLButtonElement>('[data-job-header-cancel]')?.click();
              }}
              onSave={() => {
                document.querySelector<HTMLButtonElement>('[data-job-header-save]')?.click();
              }}
              onDelete={job.estado === "borrador" ? () => {
                confirm({
                  title: "Eliminar Trabajo",
                  description: `¿Estás seguro de que querés eliminar el trabajo "${job.titulo}"? Esta acción no se puede deshacer.`,
                  confirmText: "Eliminar",
                  variant: "danger",
                  action: async () => {
                    await deleteJobMutation.mutateAsync(job.id);
                    if (selectedId === job.id) {
                      handleSelectedIdChange(null);
                    }
                  }
                });
              } : undefined}
            />
          );
        }}
        pagination={pag as any}
        creationHref="/trabajos/nuevo"
        renderItem={(job: any, isSelected) => {
          const clientName = job.clientes?.nombre || "Sin cliente";
          return (
            <button
              onClick={() => handleSelectedIdChange(job.id)}
              className={`relative group w-full text-left px-4 md:px-5 py-4 transition-colors duration-200 cursor-pointer md:rounded-none md:border-0 md:border-b md:border-outline-variant/5 md:bg-transparent md:shadow-none hover:bg-black/[0.02] dark:hover:bg-white/[0.02] md:hover:bg-on-surface/5 ${
                isSelected ? "md:bg-primary/15 dark:md:bg-primary/25 md:border-b-outline-variant/5" : ""
              }`}
            >
              {isSelected && <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_8px_var(--color-primary)]" />}
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`w-8 h-8 flex items-center justify-center shrink-0 transition-colors duration-300 ${
                  isSelected ? "text-primary" : "text-on-surface-variant/40"
                }`}>
                  <Briefcase className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-start">
                  <div className={`font-medium text-sm md:text-base truncate transition-colors ${isSelected ? "text-primary" : "text-on-surface"}`}>{job.titulo}</div>
                  <div className="text-[11px] md:text-sm text-on-surface-variant truncate mb-1">{clientName}</div>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] md:text-[11px] font-medium bg-on-surface/5 text-on-surface-variant/70 capitalize">
                    {job.estado.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </button>
          );
        }}
        renderRailItem={(job, isActive) => (
          <button
            onClick={() => handleSelectedIdChange(job.id)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-90 ${
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
              handleSelectedIdChange(null);
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
          <div className="flex-1 flex items-start justify-center pt-16 text-on-surface-variant relative">
            <AuroraBackground preset="trabajo" />
            <div className="text-center z-10 relative">
              <Briefcase className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 opacity-15" />
              <p className="text-xs md:text-base font-medium">Seleccioná un trabajo</p>
            </div>
          </div>
        }
        emptyState={
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <Briefcase className="w-16 h-16 md:w-20 md:h-20 text-on-surface-variant/20 mb-6" strokeWidth={1} />
            <h3 className="text-base md:text-lg font-bold text-on-surface mb-1.5">
              Seleccioná un trabajo
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-[260px] leading-relaxed">
              Elegí un trabajo de la lista o creá uno nuevo para hacer seguimiento de presupuestos, tareas y pagos.
            </p>
          </div>
        }
      />
      <ConfirmDialog />
    </div>
  );
}
