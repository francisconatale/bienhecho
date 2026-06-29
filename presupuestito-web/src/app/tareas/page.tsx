"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useTareas } from "./hooks/use-tareas";
import { TareasFilter } from "./components/tareas-filter";
import { TareasList } from "./components/tareas-list";
import { ShoppingList } from "./components/shopping-list";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type TabType = "tareas" | "compras";

export default function TareasPage() {
  const [activeTab, setActiveTab] = useState<TabType>("tareas");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    filter,
    setFilter,
    pendingCount,
    completedCount,
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
            title="Centro de Operaciones"
            description="Seguimiento de tareas, materiales y finanzas."
          />
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-on-surface">Centro de Operaciones</h1>
            <p className="text-on-surface-variant mt-1.5 text-lg">Seguimiento integral de tareas, materiales y balance.</p>
          </div>
        </div>

        {/* Tabs (Visible on all devices now) */}
        <div className="flex gap-2 p-1 bg-surface/40 backdrop-blur-xl rounded-2xl border border-outline-variant/10 shadow-sm max-w-[400px]">
          <button
            onClick={() => setActiveTab("tareas")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              activeTab === "tareas"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface hover:bg-surface/60"
            }`}
          >
            Tablero de Tareas
          </button>
          <button
            onClick={() => setActiveTab("compras")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              activeTab === "compras"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface hover:bg-surface/60"
            }`}
          >
            Lista de Compras
          </button>
        </div>

        {!mounted ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
            <LoadingSpinner size={48} />
            <p className="text-on-surface-variant mt-6 text-sm font-medium animate-pulse uppercase tracking-widest">
              Sincronizando operaciones
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === 'tareas' ? (
              <div className="space-y-6">
                <TareasFilter
                  filter={filter}
                  setFilter={setFilter}
                  pendingCount={pendingCount}
                  completedCount={completedCount}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                />
                <TareasList
                  groupedTasks={groupedTasks}
                  filter={filter}
                  viewMode={viewMode}
                  onToggle={toggleTask}
                  onTogglePriority={togglePriority}
                  onDelete={deleteTask}
                />
              </div>
            ) : (
              <div className="max-w-2xl">
                <ShoppingList />
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
