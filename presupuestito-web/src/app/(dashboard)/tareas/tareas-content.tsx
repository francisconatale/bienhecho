"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useTareas } from "./hooks/use-tareas";
import { TareasFilter } from "./components/tareas-filter";
import { TareasList } from "./components/tareas-list";
import { ArrowLeft, LayoutList, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { TareasSkeletonContent } from "@/components/ui/skeletons";

export function TareasContent() {
  const {
    isLoading,
    filter,
    setFilter,
    category,
    setCategory,
    pendingCount,
    completedCount,
    categoryCounts,
    groupedTasks,
    toggleTask,
    togglePriority,
    deleteTask,
    ConfirmDialog,
    pag,
  } = useTareas();

  const isSpecialized = category !== "resumen";
  const specializedTitle = category === "alta" ? "Tareas para Hoy (Urgentes)" 
    : category === "media" ? "Tareas Próximamente (Media)" 
    : "Tareas Sin Apuro (Baja)";

  return (
    <>
      {/* Fondo Premium Aurora + Noise */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.04] mix-blend-overlay bg-[url('/noise.svg')] bg-repeat" />
      <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <main className={cn(
        "flex-1 max-w-[1400px] mx-auto w-full transition-all pb-24 md:pb-10",
        isSpecialized ? "px-0 md:px-4 lg:px-10 xl:px-16 md:py-10" : "px-4 md:px-8 lg:px-10 xl:px-16 py-6 md:py-10 space-y-6"
      )}>
        
        {/* Mobile Header */}
        {!isSpecialized ? (
          <div className="md:hidden mt-10">
            <PageHeader
              title="Tablero de Tareas"
              description="Gestión y seguimiento de tareas operativas."
            />
          </div>
        ) : (
          <div className="md:hidden sticky top-0 z-50 bg-surface/60 backdrop-blur-2xl border-b border-outline-variant/10 px-4 py-4 mb-6 flex items-center gap-3 shadow-sm">
            <button 
              onClick={() => setCategory("resumen")} 
              className="p-2 -ml-2 rounded-full bg-surface hover:bg-surface-variant/50 border border-outline-variant/20 active:scale-95 transition-all text-on-surface-variant shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-on-surface tracking-tight">{specializedTitle}</h1>
          </div>
        )}

        {/* Desktop Header */}
        <div className={cn("hidden md:flex items-center justify-between pb-6", isSpecialized && "pt-2")}>
          <div className="flex items-center gap-5">
            {isSpecialized && (
              <button 
                onClick={() => setCategory("resumen")}
                className="p-3 rounded-xl bg-surface/50 backdrop-blur-xl border border-outline-variant/20 shadow-sm text-on-surface-variant hover:text-on-surface hover:bg-surface transition-all active:scale-95 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-on-surface">
                {isSpecialized ? specializedTitle : "Tablero de Tareas"}
              </h1>
              {!isSpecialized && (
                <p className="text-on-surface-variant mt-1.5 text-lg">Gestión y seguimiento de tareas operativas.</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isSpecialized && (
              <div className="hidden md:block">
                <TareasFilter
                  filter={filter}
                  setFilter={setFilter}
                  pendingCount={pendingCount}
                  completedCount={completedCount}
                />
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <TareasSkeletonContent />
        ) : (
          <div className={cn(
            "flex flex-col w-full", 
            isSpecialized ? "px-4 md:px-0" : ""
          )}>
            <div className="space-y-6">
              {!isSpecialized && (
                <div className="flex items-center justify-between mb-6">
                  <div className="md:hidden w-full">
                    <TareasFilter
                      filter={filter}
                      setFilter={setFilter}
                      pendingCount={pendingCount}
                      completedCount={completedCount}
                    />
                  </div>
                </div>
              )}

              <TareasList
                groupedTasks={groupedTasks}
                categoryCounts={categoryCounts}
                filter={filter}
                category={category}
                setCategory={setCategory}
                onToggle={toggleTask}
                onTogglePriority={togglePriority}
                onDelete={deleteTask}
                pag={pag}
              />
            </div>
          </div>
        )}
      </main>
      <ConfirmDialog />
    </>
  );
}
