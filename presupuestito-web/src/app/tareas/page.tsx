"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useTareas } from "./hooks/use-tareas";
import { TareasFilter } from "./components/tareas-filter";
import { TareasList } from "./components/tareas-list";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArrowLeft } from "lucide-react";

export default function TareasPage() {
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
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
  } = useTareas();

  return (
    <>
      {/* Fondo Premium Aurora + Noise */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.04] mix-blend-overlay bg-[url('/noise.svg')] bg-repeat" />
      <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <main className="flex-1 px-4 py-6 md:py-10 space-y-6 pb-24 md:pb-10 max-w-7xl mx-auto w-full transition-all">
        {/* Mobile Header */}
        <div className="md:hidden mt-10">
          <PageHeader
            title="Tablero de Tareas"
            description="Gestión y seguimiento de tareas operativas."
          />
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-on-surface">Tablero de Tareas</h1>
            <p className="text-on-surface-variant mt-1.5 text-lg">Gestión y seguimiento de tareas operativas.</p>
          </div>
        </div>

        {!mounted ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
            <LoadingSpinner size={48} />
            <p className="text-on-surface-variant mt-6 text-sm font-medium animate-pulse uppercase tracking-widest">
              Cargando tablero
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-6">
              {category !== "resumen" && filter === "pendientes" && (
                <div className="flex items-center gap-4 mb-2 animate-in fade-in slide-in-from-left-4">
                  <button 
                    onClick={() => setCategory("resumen")}
                    className="flex items-center gap-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors bg-primary/10 px-4 py-2.5 rounded-2xl cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al resumen
                  </button>
                  <h2 className="text-lg md:text-xl font-bold text-on-surface hidden md:block">
                    {category === "alta" ? "Tareas para Hoy (Urgentes)" : category === "media" ? "Tareas Próximamente (Media)" : "Tareas Sin Apuro (Baja)"}
                  </h2>
                </div>
              )}

              {category === "resumen" && (
                <TareasFilter
                  filter={filter}
                  setFilter={setFilter}
                  pendingCount={pendingCount}
                  completedCount={completedCount}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                />
              )}

              <TareasList
                groupedTasks={groupedTasks}
                categoryCounts={categoryCounts}
                filter={filter}
                category={category}
                setCategory={setCategory}
                viewMode={viewMode}
                onToggle={toggleTask}
                onTogglePriority={togglePriority}
                onDelete={deleteTask}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
